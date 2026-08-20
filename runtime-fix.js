// Varahi runtime reliability fixes for the presentation prototype.
// The original POS called closeModal() from several paths but did not define it.
window.closeModal = function(){
  const modal=document.getElementById('modal');
  if(modal) modal.innerHTML='';
};

// Keep the POS cart usable even if a modal is closed through browser/UI events.
window.__varahiEnsureCart = function(){
  if(!Array.isArray(window.__varahiCartGuard)) window.__varahiCartGuard=[];
};

// If the deployed page is opened with an old cached build, make the manager button
// available after the next render as well.
window.addEventListener('load',function(){
  if(typeof window.render==='function') window.render();
});
