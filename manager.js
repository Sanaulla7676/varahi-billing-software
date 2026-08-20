(function(){
  const DEMO_USER='manager';
  const DEMO_PASS='1234';
  const css=`
  .manager-login-btn{border:1px solid #d6d6d6;background:#fff;color:#333;border-radius:4px;padding:7px 10px;font-size:11px;cursor:pointer}
  .manager-login-btn.logged{background:#eaf5ea;color:#23733a;border-color:#b9d9bf}
  .owner-overlay{position:fixed;inset:0;background:rgba(0,0,0,.58);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px}
  .owner-panel{width:min(1120px,96vw);max-height:92vh;overflow:auto;background:#f7f7f5;border-radius:10px;box-shadow:0 30px 100px rgba(0,0,0,.35);font-family:Arial,Helvetica,sans-serif}
  .owner-head{background:#25272b;color:#fff;padding:16px 20px;display:flex;align-items:center;justify-content:space-between}
  .owner-head h2{margin:0;font-size:18px}.owner-head small{display:block;color:#bfc2c8;margin-top:3px;font-size:10px}
  .owner-close{border:0;background:#3a3d43;color:#fff;border-radius:4px;padding:8px 12px;cursor:pointer}
  .owner-body{padding:18px}.owner-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}
  .owner-card{background:#fff;border:1px solid #ddd;border-radius:8px;padding:14px}.owner-card span{display:block;color:#7d8186;font-size:10px}.owner-card b{display:block;font-size:22px;margin-top:5px}.owner-card small{color:#9b9ea2;font-size:9px}
  .owner-grid{display:grid;grid-template-columns:1.7fr 1fr;gap:14px}.owner-box{background:#fff;border:1px solid #ddd;border-radius:8px;padding:14px}.owner-box h3{margin:0 0 12px;font-size:14px}
  .owner-actions{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.owner-actions button,.owner-mini-actions button{border:1px solid #d7d7d5;background:#fff;padding:10px;border-radius:6px;font-size:10px;cursor:pointer;text-align:left}.owner-actions button:hover,.owner-mini-actions button:hover{border-color:#c98745;background:#fffaf1}
  .owner-table{width:100%;border-collapse:collapse;font-size:10px}.owner-table th{background:#f4f4f2;text-align:left;padding:9px;color:#70747a}.owner-table td{padding:9px;border-top:1px solid #eee}.owner-table button{border:1px solid #d4d4d2;background:#fff;padding:5px 7px;border-radius:4px;font-size:9px;cursor:pointer}.owner-table .danger{color:#ad4a43}
  .owner-mini-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px}.owner-note{font-size:9px;color:#868a90;line-height:1.5;margin-top:10px}
  .login-card{width:min(390px,92vw);background:#fff;border-radius:10px;padding:24px;box-shadow:0 25px 80px rgba(0,0,0,.35)}
  .login-card .v{width:42px;height:42px;border-radius:8px;background:#c32825;color:#fff;display:grid;place-items:center;font:700 22px Georgia,serif;font-style:italic;margin-bottom:12px}
  .login-card h3{margin:0;font-size:18px}.login-card p{font-size:11px;color:#7c8085}.login-card label{display:block;margin:12px 0;font-size:10px;color:#6e7379}.login-card input{display:block;width:100%;margin-top:5px;border:1px solid #d0d0cd;padding:10px;border-radius:5px;outline:none}
  .login-actions{display:flex;gap:8px;margin-top:14px}.login-actions button{flex:1;border:0;border-radius:5px;padding:10px;cursor:pointer}.login-actions .primary{background:#ef4a23;color:#fff}.login-actions .secondary{background:#eee;color:#444}
  .login-hint{background:#faf7ef;border:1px solid #eee0c3;border-radius:5px;padding:8px;font-size:9px;color:#80652e;margin-top:12px}
  .product-editor{width:min(620px,94vw);background:#fff;border-radius:10px;padding:20px;box-shadow:0 25px 80px rgba(0,0,0,.35)}
  .product-editor .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.product-editor label{font-size:10px;color:#70747a}.product-editor input,.product-editor select{display:block;width:100%;margin-top:5px;border:1px solid #d1d1ce;padding:9px;border-radius:5px;outline:none}
  .product-editor textarea{width:100%;min-height:70px;border:1px solid #d1d1ce;border-radius:5px;padding:9px;margin-top:5px;resize:vertical}.product-editor .actions{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}.product-editor .actions button{border:0;border-radius:5px;padding:9px 13px;cursor:pointer}.product-editor .actions .save{background:#ef4a23;color:#fff}.product-editor .actions .cancel{background:#eee}
  @media(max-width:900px){.owner-cards{grid-template-columns:repeat(2,1fr)}.owner-grid{grid-template-columns:1fr}.owner-actions{grid-template-columns:repeat(2,1fr)}}
  `;
  const s=document.createElement('style');s.textContent=css;document.head.appendChild(s);

  function sessionUser(){return sessionStorage.getItem('varahi_manager_user')||''}
  function isManager(){return !!sessionUser()}
  function addHeaderButton(){
    const head=document.querySelector('.head-right'); if(!head||document.getElementById('managerBtn')) return;
    const b=document.createElement('button'); b.id='managerBtn'; b.className='manager-login-btn'+(isManager()?' logged':''); b.textContent=isManager()?'MANAGER DASHBOARD':'MANAGER LOGIN'; b.onclick=()=>isManager()?openOwnerDashboard():openLogin();
    head.prepend(b);
  }
  function wrapRender(){
    if(typeof window.render!=='function') return;
    const original=window.render;
    window.render=function(){original();addHeaderButton();};
    addHeaderButton();
  }
  function openLogin(){
    let modal=document.getElementById('modal'); if(!modal)return;
    modal.innerHTML=`<div class="shade"><div class="login-card"><div class="v">V</div><h3>Manager Login</h3><p>Owner / manager access for Varahi Billing Software.</p><label>Username<input id="mgrUser" value="manager" autocomplete="off"></label><label>Password<input id="mgrPass" type="password" value="1234"></label><div class="login-actions"><button class="secondary" onclick="window.__varahiClose()">Cancel</button><button class="primary" onclick="window.__varahiLogin()">Login</button></div><div class="login-hint">Demo presentation login: <b>manager</b> / <b>1234</b></div></div></div>`;
    window.__varahiClose=()=>{modal.innerHTML='';};
    window.__varahiLogin=()=>{const u=document.getElementById('mgrUser').value.trim(),p=document.getElementById('mgrPass').value;if(u===DEMO_USER&&p===DEMO_PASS){sessionStorage.setItem('varahi_manager_user',u);modal.innerHTML='';window.render();openOwnerDashboard();}else alert('Invalid manager credentials.');};
  }
  function openOwnerDashboard(){
    const modal=document.getElementById('modal'); if(!modal)return;
    const list=(window.products||[]).filter(p=>p&&p.active!==false);
    modal.innerHTML=`<div class="owner-overlay"><div class="owner-panel"><div class="owner-head"><div><h2>Varahi Owner Dashboard</h2><small>Manager access · Complete restaurant control</small></div><div><button class="owner-close" onclick="window.__varahiCloseOwner()">Close</button></div></div><div class="owner-body"><div class="owner-cards"><div class="owner-card"><span>Today's Sales</span><b>₹24,680</b><small>86 bills</small></div><div class="owner-card"><span>Open Orders</span><b>12</b><small>4 online</small></div><div class="owner-card"><span>Low Stock</span><b>7</b><small>Needs attention</small></div><div class="owner-card"><span>Cash in Drawer</span><b>₹16,280</b><small>Expected</small></div></div><div class="owner-grid"><div class="owner-box"><h3>Manager Controls</h3><div class="owner-actions"><button onclick="window.__varahiGoto('pos')">POS / Billing</button><button onclick="window.__varahiGoto('tables')">Tables</button><button onclick="window.__varahiGoto('menu')">Menu & Pricing</button><button onclick="window.__varahiGoto('inventory')">Inventory</button><button onclick="window.__varahiGoto('reports')">Reports</button><button onclick="window.__varahiGoto('accounting')">Accounting</button><button onclick="window.__varahiGoto('users')">Staff Rights</button><button onclick="window.__varahiGoto('config')">Settings / Printer</button><button onclick="window.__varahiGoto('online')">Online Orders</button><button onclick="window.__varahiGoto('kitchen')">Kitchen / KOT</button><button onclick="window.__varahiQuickAdd()">Add Product</button><button onclick="window.__varahiLogout()">Logout Manager</button></div></div><div class="owner-box"><h3>Quick Management</h3><div class="owner-mini-actions"><button onclick="window.__varahiQuickEdit()">Edit a Product</button><button onclick="window.__varahiQuickPrice()">Change Price</button><button onclick="window.__varahiQuickDelete()">Delete Product</button><button onclick="window.__varahiTestReceipt()">Test Receipt</button></div><div class="owner-note">This is the presentation owner control panel. Product changes are stored in this browser so you can demonstrate add/edit/delete and pricing changes without a backend database.</div></div></div><div class="owner-box" style="margin-top:14px"><h3>Menu Control</h3><table class="owner-table"><thead><tr><th>Product</th><th>Category</th><th>Portion</th><th>Price</th><th>Actions</th></tr></thead><tbody>${list.map(p=>{const v=(p.variants||[])[0]||['Regular',p.price||0];return `<tr><td><span class="veg-mark">●</span> <b>${escapeHtml(p.name)}</b></td><td>${escapeHtml(p.cat||'General')}</td><td>${escapeHtml(v[0])}</td><td>${money(v[1])}</td><td><button onclick="window.__varahiEdit(${p.id})">Edit</button> <button class="danger" onclick="window.__varahiDelete(${p.id})">Delete</button></td></tr>`}).join('')}</tbody></table></div></div></div></div>`;
    window.__varahiCloseOwner=()=>{modal.innerHTML='';window.render();};
    window.__varahiGoto=(view)=>{modal.innerHTML='';window.goModule(view);};
    window.__varahiLogout=()=>{sessionStorage.removeItem('varahi_manager_user');modal.innerHTML='';window.render();};
    window.__varahiEdit=(id)=>window.__varahiProductEditor(id);
    window.__varahiDelete=(id)=>{if(confirm('Delete this product?')){const idx=products.findIndex(p=>p.id===id);if(idx>=0){products.splice(idx,1);save();openOwnerDashboard();}}};
    window.__varahiQuickAdd=()=>window.__varahiProductEditor(null);
    window.__varahiQuickEdit=()=>{const p=products.find(x=>x.active!==false);if(p)window.__varahiProductEditor(p.id);};
    window.__varahiQuickPrice=()=>{const p=products.find(x=>x.active!==false);if(!p)return;const n=prompt('New price for '+p.name,(p.variants?.[0]?.[1]||p.price||0));if(n&&Number(n)>0){p.price=Number(n);if(p.variants?.[0])p.variants[0][1]=Number(n);save();openOwnerDashboard();}};
    window.__varahiQuickDelete=()=>{const p=products.find(x=>x.active!==false);if(p)window.__varahiDelete(p.id);};
    window.__varahiTestReceipt=()=>{modal.innerHTML='';window.render();if(typeof window.quickAdd==='function')window.quickAdd(4);setTimeout(()=>window.printBill(false),120);};
  }
  function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  function money(n){return '₹'+Number(n||0).toLocaleString('en-IN',{minimumFractionDigits:0});}
  window.__varahiProductEditor=function(id){
    const modal=document.getElementById('modal'); if(!modal)return;
    const p=id?products.find(x=>x.id===id):{name:'',cat:'South Indian',price:0,variants:[['Regular',0]],addons:['Extra Sambar']};
    modal.innerHTML=`<div class="shade"><div class="product-editor"><h3>${id?'Edit Product':'Add Product'}</h3><div class="grid"><label>Product Name<input id="vmName" value="${escapeHtml(p.name)}"></label><label>Category<select id="vmCat">${['South Indian','Breakfast','Meals','North Indian','Breads','Rice','Beverages','Desserts','Starters','Soups'].map(c=>`<option ${c===p.cat?'selected':''}>${c}</option>`).join('')}</select></label><label>Portion / Size<input id="vmPortion" value="${escapeHtml((p.variants&&p.variants[0]&&p.variants[0][0])||'Regular')}"></label><label>Price<input id="vmPrice" type="number" value="${(p.variants&&p.variants[0]&&p.variants[0][1])||p.price||0}"></label></div><label>Add-ons<input id="vmAddons" value="${escapeHtml((p.addons||[]).join(', '))}"></label><label>Active <select id="vmActive"><option value="true" ${(p.active!==false)?'selected':''}>Yes</option><option value="false" ${(p.active===false)?'selected':''}>No</option></select></label><div class="actions"><button class="cancel" onclick="window.__varahiBackOwner()">Cancel</button><button class="save" onclick="window.__varahiSaveProduct(${id||0})">Save Product</button></div></div></div>`;
    window.__varahiBackOwner=openOwnerDashboard;
  };
  window.__varahiSaveProduct=function(id){
    const name=document.getElementById('vmName').value.trim(),cat=document.getElementById('vmCat').value,portion=document.getElementById('vmPortion').value.trim(),price=Number(document.getElementById('vmPrice').value),addons=document.getElementById('vmAddons').value.split(',').map(x=>x.trim()).filter(Boolean),active=document.getElementById('vmActive').value==='true';
    if(!name||!portion||!(price>0))return alert('Enter product name, portion and a valid price.');
    if(id){const p=products.find(x=>x.id===id);Object.assign(p,{name,cat,price,variants:[[portion,price]],addons,active});}else products.push({id:Date.now(),name,cat,price,variants:[[portion,price]],addons,active});
    save();openOwnerDashboard();
  };
  // Direct POS path: one-click add to bill. This removes the common demo failure where a cashier opens a variant dialog and never commits it.
  window.quickAdd=function(id){const p=products.find(x=>x.id===id);if(!p)return;const v=(p.variants&&p.variants[0])||['Regular',p.price||0];const found=state.cart.find(x=>x.id===id&&x.variant===v[0]&&!x.extras?.length&&!x.note);if(found)found.qty++;else state.cart.push({id,name:p.name,variant:v[0],price:Number(v[1]),qty:1,extras:[],note:'',key:'quick'});if(typeof closeModal==='function')closeModal();window.render();};
  // Replace product tiles with direct-add affordance plus variant dialog. Existing code remains intact; the green Add button guarantees the receipt path works.
  function enhanceItems(){document.querySelectorAll('.item').forEach(btn=>{if(btn.dataset.enhanced)return;btn.dataset.enhanced='1';const idm=(btn.getAttribute('onclick')||'').match(/variants\((\d+)\)/);if(!idm)return;const id=idm[1];const add=document.createElement('span');add.textContent='ADD';add.style.cssText='margin-top:4px;background:#16843c;color:#fff;border-radius:2px;padding:3px 9px;font:700 9px Arial;align-self:center';add.onclick=function(e){e.preventDefault();e.stopPropagation();window.quickAdd(Number(id));};btn.appendChild(add);});}
  function boot(){
    // Remove stale pre-upgrade menu data that cannot participate in the current POS model.
    try{const raw=JSON.parse(localStorage.getItem('varahi_products')||'null');if(!Array.isArray(raw)||!raw.length||raw.some(p=>!p||!Array.isArray(p.variants)||!('cat' in p)||['Chicken Biryani','Mutton Biryani','Chicken 65','Butter Chicken','Fish Fry'].includes(p.name))){localStorage.removeItem('varahi_products');}}
    catch(e){localStorage.removeItem('varahi_products');}
    wrapRender();
    const oldRender=window.render;
    window.render=function(){oldRender();addHeaderButton();enhanceItems();};
    window.render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
