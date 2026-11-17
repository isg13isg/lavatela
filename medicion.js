(function(){
 var AW="", LBL="";
 window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;
 gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});
 if(AW){var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id='+AW;document.head.appendChild(s);
  gtag('js',new Date());gtag('config',AW);
  var c=null;try{c=localStorage.getItem('ck')}catch(e){}
  if(c==='si')gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted'});
  var b=document.getElementById('ck');if(b&&!c){b.style.display='block';
   b.querySelector('.si').onclick=function(){try{localStorage.setItem('ck','si')}catch(e){}gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted'});b.style.display='none'};
   b.querySelector('.no').onclick=function(){try{localStorage.setItem('ck','no')}catch(e){}b.style.display='none'};}}
 document.addEventListener('click',function(e){var a=e.target.closest('a[href*="wa.me"]');
  if(a&&AW&&LBL)gtag('event','conversion',{send_to:AW+'/'+LBL});});
})();