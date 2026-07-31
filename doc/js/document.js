(()=>{'use strict';
const menuButton=document.querySelector('.menu-button');const siteNav=document.getElementById('site-nav');
if(menuButton&&siteNav){menuButton.addEventListener('click',()=>{const open=siteNav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});}
document.querySelectorAll('[data-print]').forEach(button=>button.addEventListener('click',()=>window.print()));
const toTop=document.querySelector('.to-top');if(toTop){window.addEventListener('scroll',()=>toTop.classList.toggle('visible',window.scrollY>500),{passive:true});toTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));}
const current=document.body.dataset.currentDoc;if(current){document.querySelectorAll('[data-doc]').forEach(a=>{if(a.dataset.doc===current)a.setAttribute('aria-current','page');});}
document.querySelectorAll('.table-wrap').forEach(w=>{if(w.scrollWidth>w.clientWidth)w.classList.add('scrollable');});
const portalInput=document.querySelector('[data-portal-search]');if(portalInput){portalInput.addEventListener('input',()=>{const q=portalInput.value.toLocaleLowerCase('ja');document.querySelectorAll('.doc-card').forEach(card=>{card.hidden=!card.textContent.toLocaleLowerCase('ja').includes(q);});});}
})();