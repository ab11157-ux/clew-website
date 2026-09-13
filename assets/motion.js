document.body.classList.add('motion-ready');

const wipe=document.createElement('div');
wipe.className='page-wipe';
wipe.setAttribute('aria-hidden','true');
wipe.innerHTML='<span></span><i></i>';
document.body.appendChild(wipe);

document.querySelectorAll('a[href]').forEach(link=>link.addEventListener('click',event=>{
  const href=link.getAttribute('href');
  if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('http')||link.target==='_blank')return;
  event.preventDefault();
  const label=(link.textContent||'Clew').trim().replace(/⌄/g,'');
  wipe.querySelector('span').textContent=label;
  wipe.classList.add('active');
  window.setTimeout(()=>{window.location.href=href},620);
}));

const nav=document.querySelector('.nav');
const setNav=()=>nav&&nav.classList.toggle('scrolled',window.scrollY>42);
setNav();
window.addEventListener('scroll',setNav,{passive:true});

const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.stat strong').forEach(stat=>{
  const finalText=stat.textContent.trim();
  const target=Number(finalText.replace(/[^0-9.]/g,''));
  if(!target||reduce)return;
  const prefix=finalText.startsWith('$')?'$':'';
  const suffix=finalText.includes('M')?'M+':finalText.includes('%')?'%+':'';
  stat.textContent=prefix+'0'+suffix;
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    observer.disconnect();
    const start=performance.now();
    const tick=now=>{
      const progress=Math.min((now-start)/1250,1);
      const eased=1-Math.pow(1-progress,3);
      stat.textContent=prefix+Math.round(target*eased)+suffix;
      if(progress<1)requestAnimationFrame(tick);else stat.textContent=finalText;
    };
    requestAnimationFrame(tick);
  }),{threshold:.55});
  observer.observe(stat);
});
