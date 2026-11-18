(function(){
 var AW="", LBL="", GA="G-4S3S1DBZ0B", CL="";
 // Dispositivos del dueño: abrir lavatela.com/?interno=1 una vez en cada navegador → no se mide nada (?interno=0 lo deshace)
 var m=location.search.match(/[?&]interno=([01])/),yo=null;
 try{if(m){m[1]==='1'?localStorage.setItem('interno','1'):localStorage.removeItem('interno');}yo=localStorage.getItem('interno');}catch(e){}
 if(m){var t=document.createElement('div');t.textContent=m[1]==='1'?'✅ Este dispositivo ya no se cuenta en las estadísticas':'Este dispositivo vuelve a contarse en las estadísticas';
  t.style.cssText='position:fixed;top:12px;left:12px;right:12px;z-index:9;background:#032b5f;color:#fff;padding:14px;border-radius:14px;text-align:center;font-weight:700';
  document.addEventListener('DOMContentLoaded',function(){document.body.appendChild(t);setTimeout(function(){t.remove()},6000)});}
 if(yo==='1'){var k=document.getElementById('ck');if(k)k.remove();return;}
 window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;
 gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});
 var c=null;try{c=localStorage.getItem('ck')}catch(e){}
 function clarity(){if(!CL||window.clarity)return;(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",CL);
  window.clarity('consent');}
 function acepta(){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',analytics_storage:'granted'});clarity();}
 if(AW||GA){var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id='+(GA||AW);document.head.appendChild(s);
  gtag('js',new Date());if(GA)gtag('config',GA);if(AW)gtag('config',AW);}
 if(AW||GA||CL){if(c==='si')acepta();
  var b=document.getElementById('ck');if(b&&!c){b.style.display='block';
   b.querySelector('.si').onclick=function(){try{localStorage.setItem('ck','si')}catch(e){}acepta();b.style.display='none';ev('cookies',{eleccion:'aceptar'})};
   b.querySelector('.no').onclick=function(){try{localStorage.setItem('ck','no')}catch(e){}b.style.display='none';ev('cookies',{eleccion:'rechazar'})};}}
 // Embudo: un evento por cada acción que importa
 function ev(n,p){p=p||{};p.pagina=location.pathname;p.idioma=document.documentElement.lang||'es';
  if(GA)gtag('event',n,p);if(window.clarity)window.clarity('event',n);}
 function zona(el){return el.closest('.fija')?'barra_inferior':el.closest('nav')?'menu':el.closest('header')?'cabecera':
  el.closest('footer')?'pie':el.closest('.bloque-promo')?'promocion':el.closest('.hero,.promo-hero,.regalo')?'encabezado':'contenido';}
 document.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;var h=a.getAttribute('href')||'',z=zona(a);
  if(/wa\.me/.test(h)){ev('clic_whatsapp',{zona:z});if(AW&&LBL)gtag('event','conversion',{send_to:AW+'/'+LBL});}
  else if(/^tel:/.test(h))ev('clic_llamar',{zona:z});
  else if(/maps\/dir/.test(h))ev('clic_como_llegar',{zona:z});
  else if(/g\.page\/r\/.*review/.test(h))ev('clic_escribir_resena',{zona:z});
  else if(/apps\.apple|play\.google/.test(h))ev('clic_descargar_app',{tienda:/apple/.test(h)?'ios':'android',zona:z});
  else if(a.closest('.idi'))ev('cambio_idioma',{a:a.getAttribute('hreflang')});
  else if(a.closest('nav'))ev('clic_menu',{destino:h});
  else if(/btn/.test(a.className))ev('clic_boton',{texto:(a.textContent||'').trim().slice(0,40),zona:z});});
 document.addEventListener('submit',function(e){if(e.target.id==='recl')ev('enviar_reclamacion');});
 var hechos={};window.addEventListener('scroll',function(){var d=document.documentElement,p=(d.scrollTop+innerHeight)/d.scrollHeight*100;
  [25,50,75,90].forEach(function(u){if(p>=u&&!hechos[u]){hechos[u]=1;ev('scroll_'+u);}});},{passive:true});
})();