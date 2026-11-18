"""Actualiza la nota y el nº de opiniones de Google en la web publicada (lo ejecuta GitHub Actions a diario).

Lee Places API (New) con la clave del secreto PLACES_API_KEY, guarda resenas.json y reescribe en
todas las páginas las marcas data-g="nota" / data-g="n" / data-g="est" y las descripciones con data-tpl.
Sin dependencias: solo biblioteca estándar de Python.
"""
import datetime as dt
import html
import json
import os
import re
import sys
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).parent
BUSQUEDA = "LAVA TELA, Calle de Benita López 36, 28021 Madrid"
COMA = ("es", "fr", "ro")   # idiomas con coma decimal


def consultar(clave):
    """Devuelve (place_id, nota, nº opiniones). Usa PLACE_ID si se conoce; si no, búsqueda de texto."""
    cab = {"X-Goog-Api-Key": clave, "Content-Type": "application/json"}
    pid = os.environ.get("PLACE_ID", "").strip()
    if pid:
        req = urllib.request.Request(f"https://places.googleapis.com/v1/places/{pid}",
                                     headers={**cab, "X-Goog-FieldMask": "id,displayName,rating,userRatingCount"})
        lugar = json.load(urllib.request.urlopen(req, timeout=30))
    else:
        req = urllib.request.Request(
            "https://places.googleapis.com/v1/places:searchText", method="POST",
            data=json.dumps({"textQuery": BUSQUEDA, "languageCode": "es"}).encode(),
            headers={**cab, "X-Goog-FieldMask": "places.id,places.displayName,places.rating,places.userRatingCount"})
        lugares = json.load(urllib.request.urlopen(req, timeout=30)).get("places", [])
        lugar = next((p for p in lugares if "LAVA TELA" in p.get("displayName", {}).get("text", "").upper()), None)
        if not lugar:
            sys.exit("No encuentro LAVA TELA en Places API")
    return lugar["id"], float(lugar["rating"]), int(lugar["userRatingCount"])


def idioma(ruta):
    primera = ruta.relative_to(RAIZ).parts[0]
    return primera if primera in ("en", "fr", "ro", "ar", "zh") else "es"


def reescribir(pagina, lang, nota, n):
    txt = f"{nota:.1f}".replace(".", "," if lang in COMA else ".")
    pagina = re.sub(r'(<span data-g="nota">)[^<]*(</span>)', rf"\g<1>{txt}\g<2>", pagina)
    pagina = re.sub(r'(<span data-g="n">)[^<]*(</span>)', rf"\g<1>{n}\g<2>", pagina)

    def estrellas(m):
        svg = re.match(r"<svg.*?</svg>", m.group(2), re.S).group(0)
        return m.group(1) + svg * max(1, min(5, int(nota + 0.5))) + m.group(3)
    pagina = re.sub(r'(<span class="estrellas" data-g="est">)(.*?)(</span>)', estrellas, pagina, flags=re.S)

    def meta(m):
        tpl = html.unescape(m.group(1))
        nuevo = html.escape(tpl.replace("{nota}", txt).replace("{n}", str(n)), quote=True)
        return f'<meta name="description" content="{nuevo}" data-tpl="{m.group(1)}">'
    return re.sub(r'<meta name="description" content="[^"]*" data-tpl="([^"]*)">', meta, pagina)


def main():
    clave = os.environ.get("PLACES_API_KEY", "").strip()
    if not clave:
        sys.exit("Falta el secreto PLACES_API_KEY")
    pid, nota, n = consultar(clave)
    if not (1 <= nota <= 5 and n > 0):
        sys.exit("Dato de Google no válido; no se cambia nada")
    f = RAIZ / "resenas.json"
    previo = json.loads(f.read_text(encoding="utf-8")) if f.exists() else {}
    if previo.get("n") and n < previo["n"] * 0.7:   # caída brusca: probablemente otra ficha
        sys.exit(f"Nº de opiniones baja de {previo['n']} a {n}; revisar a mano")
    cambiadas = 0
    for p in RAIZ.rglob("index.html"):
        viejo = p.read_text(encoding="utf-8")
        nuevo = reescribir(viejo, idioma(p), nota, n)
        if nuevo != viejo:
            p.write_text(nuevo, encoding="utf-8")
            cambiadas += 1
    if previo.get("nota") != nota or previo.get("n") != n or cambiadas:
        f.write_text(json.dumps({"nota": nota, "n": n, "fecha": dt.date.today().isoformat(), "place_id": pid},
                                ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Google: {nota} ★ · {n} opiniones · páginas cambiadas: {cambiadas}")


if __name__ == "__main__":
    main()
