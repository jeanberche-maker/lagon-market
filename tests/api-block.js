/* ===== Lot 15 — backend optionnel (Supabase REST, sans SDK) =====
   Sans configuration : l'app reste 100 % locale (products.json + localStorage).
   Avec URL + clé anon (Paramétrage → Backend) : produits lus dans la table
   `products`, commandes écrites dans `orders`, Espace boutique publié en upsert. */
let API={url:'',key:''};
try{ const _ac=JSON.parse(localStorage.getItem('lm-config')||'null'); if(_ac&&_ac.api){ API={url:String(_ac.api.url||'').trim().replace(/\/+$/,''),key:String(_ac.api.key||'').trim()}; } }catch(e){}
function apiReady(){ return !!(API.url&&API.key); }
let apiFetcher=(typeof fetch==='function')?function(u,o){ return fetch(u,o); }:null;
function apiFetch(path,opts){
  if(typeof apiFetcher!=='function')return Promise.reject(new Error('fetch indisponible'));
  opts=opts||{};
  opts.headers=Object.assign({'apikey':API.key,'Authorization':'Bearer '+API.key,'Content-Type':'application/json','Prefer':'return=representation'},opts.headers||{});
  return apiFetcher(API.url+'/rest/v1/'+path,opts);
}
function rowToProduct(r){
  return {id:String(r.id||''), n:r.n||'', n_en:r.n_en||'', b:r.b||'', f:r.f||'', f_en:r.f_en||'',
    pr:Number(r.pr)||0, u:r.u||'', e:r.e||'🛒',
    g:(Array.isArray(r.g)&&r.g.length)?r.g.slice(0,2):['#E3F4F4','#9CCFE0'],
    cat:r.cat||'epicerie', sub:r.sub||'',
    bd:Array.isArray(r.bd)?r.bd:[],
    st:(typeof r.st==='number'&&r.st>=0)?r.st:0, d:r.d||'', d_en:r.d_en||'',
    ph:r.ph||'', cr:r.cr||'', promo:!!r.promo};
}
function apiProducts(){
  return apiFetch('products?select=*').then(function(r){
    if(!r||!r.ok)throw new Error('HTTP '+String((r&&r.status)||'?'));
    return r.json();
  }).then(function(rows){
    if(!Array.isArray(rows)||!rows.length)throw new Error('catalogue backend vide');
    return rows.map(rowToProduct);
  });
}
function apiSubmitOrder(order){
  const row={customer:order.addr, slot:order.slot, total:order.total,
    items:order.items, note:typeof note==='string'?note:'', promo:order.promo||'', status:1};
  return apiFetch('orders',{method:'POST',body:JSON.stringify(row)});
}
function appToRow(p){
  return {id:p.id, n:p.n, n_en:p.n_en||null, b:p.b||'', f:p.f||'', f_en:p.f_en||null,
    pr:p.pr, u:p.u||'', e:p.e||'🛒', g:p.g||[], cat:p.cat||'epicerie', sub:p.sub||'',
    bd:p.bd||[], st:p.st, d:p.d||'', d_en:p.d_en||null, ph:p.ph||null, cr:p.cr||null, promo:!!p.promo};
}
function apiUpsertProduct(p){
  return apiFetch('products?on_conflict=id',{method:'POST',headers:{'Prefer':'resolution=merge-duplicates'},body:JSON.stringify(appToRow(p))});
}
function testBackend(){
  if(!apiReady()){toast('Renseignez l\'URL et la clé anon d\'abord');return;}
  toast('Test du backend…');
  apiFetch('products?select=id').then(function(r){
    toast(r&&r.ok?'Backend connecté ✓':'Backend injoignable (HTTP '+String((r&&r.status)||'?')+')');
  }).catch(function(){ toast('Backend injoignable — vérifiez URL et clé'); });
}
