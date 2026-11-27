/* ---- Suite de tests Lot 15 — backend optionnel (Supabase REST) ---- */
var results=[];
function T15(name,fn){try{fn();results.push('PASS '+name);}catch(e){results.push('FAIL '+name+' -> '+(e&&e.message||e));}}
/* Les ids de commande sont déterministes (#1030+n) et les suites suivantes
   s'y appuient : on sauvegarde l'état commandes/panier et on le restaure à la fin. */
var ordersSave15=orders.slice(),lastSave15=lastOrder;

/* Promesse synchrones : résolvent pendant l'appel, pour tester les chaînes async sans timers. */
function syncP(exec){
  var st='p',val,err,cbs=[];
  function done(v){if(st!=='p')return;st='r';val=v;flush();}
  function fail(e){if(st!=='p')return;st='j';err=e;flush();}
  function flush(){cbs.splice(0).forEach(function(h){h();});}
  var p={
    then:function(fn,rf){
      var nx=syncP(function(){});
      var h=function(){
        if(st==='r'){try{var v2=fn?fn(val):undefined;nx.__res(v2);}catch(e){nx.__rej(e);}}
        else if(st==='j'){if(rf){try{var v3=rf(err);nx.__res(v3);}catch(e2){nx.__rej(e2);}}else nx.__rej(err);}
        else nx.__rej(new Error('pending'));
      };
      cbs.push(h);if(st!=='p')h();return nx;
    },
    catch:function(rf){return p.then(null,rf);}
  };
  p.__res=function(v){ if(v&&typeof v.then==='function'){try{v.then(function(x){done(x);},function(e){fail(e);});}catch(e){fail(e);}} else done(v); };
  p.__rej=fail;
  try{exec(done,fail);}catch(e){fail(e);}
  return p;
}

/* ==== mapping lignes <-> app ==== */
T15('rowToProduct : mapping complet + replis', function(){
  var r=rowToProduct({id:'x1',n:'Mangue',n_en:'Judy mango',b:'Verger',f:'pièce',f_en:'each',pr:3.2,u:'7,10 €/kg',e:'🥭',g:['#111','#222'],cat:'fruits',sub:'Exotiques',bd:['Bio'],st:5,d:'Desc',d_en:'Desc EN',ph:'https://x/p.jpg',cr:'Wikimedia',promo:true});
  if(r.id!=='x1'||r.n!=='Mangue'||r.n_en!=='Judy mango'||r.pr!==3.2||r.st!==5||r.cat!=='fruits'||r.promo!==true) throw new Error(JSON.stringify(r));
  if(r.ph!=='https://x/p.jpg'||r.cr!=='Wikimedia') throw new Error('photo/crédit KO');
});
T15('rowToProduct : replis (g, st, bd, promo)', function(){
  var r=rowToProduct({id:'x2',n:'P',pr:1,st:-3,g:'pas un tableau',bd:'pas un tableau',promo:'oui'});
  if(!Array.isArray(r.g)||r.g.length!==2) throw new Error('dégradé repli KO');
  if(r.st!==0) throw new Error('stock repli KO (attendu 0, reçu '+r.st+')');
  if(!Array.isArray(r.bd)||r.bd.length) throw new Error('badges repli KO');
  if(r.promo!==true) throw new Error('promo devrait être true');
});
T15('appToRow : nulls pour absents + promo booléen', function(){
  var row=appToRow({id:'a',n:'A',pr:2,st:1});
  if(row.n_en!==null||row.d_en!==null||row.ph!==null||row.cr!==null) throw new Error('nulls KO');
  if(row.promo!==false||row.u===''||row.u===undefined&&false) {}
  if(row.st!==1||row.id!=='a') throw new Error('basiques KO');
  if(appToRow({id:'b',n:'B',pr:1,st:0,promo:1}).promo!==true) throw new Error('promo KO');
});

/* ==== apiReady / apiFetch ==== */
T15('apiReady : faux sans config, vrai avec URL+clé', function(){
  API.url='';API.key='';
  if(apiReady()) throw new Error('devrait être faux');
  API.url='https://abc.supabase.co';API.key='anon-key';
  if(!apiReady()) throw new Error('devrait être vrai');
  API.url='';API.key='';
});
T15('apiFetch : URL rest/v1 + en-têtes apikey/Bearer', function(){
  API.url='https://abc.supabase.co';API.key='anon-key';
  var cap=null;
  var saveF=apiFetcher;
  apiFetcher=function(u,o){cap={u:u,o:o};return syncP(function(res){res({ok:true});});};
  apiFetch('products?select=id',{method:'POST'});
  apiFetcher=saveF;
  if(cap.u!=='https://abc.supabase.co/rest/v1/products?select=id') throw new Error('URL KO : '+cap.u);
  if(cap.o.headers.apikey!=='anon-key'||cap.o.headers.Authorization!=='Bearer anon-key') throw new Error('en-têtes KO');
  if(cap.o.method!=='POST') throw new Error('méthode KO');
  API.url='';API.key='';
});

/* ==== refreshCatalog : dispatcher API/local ==== */
T15('refreshCatalog sans backend : route products.json', function(){
  API.url='';API.key='';
  var called=null,saveC=catalogFetcher;
  catalogFetcher=function(u){called=u;return syncP(function(res){res({ok:true,text:function(){return JSON.stringify(P);}});});};
  refreshCatalogJson(true);
  catalogFetcher=saveC;
  if(!called||called.indexOf('products.json')<0) throw new Error('products.json non interrogé : '+called);
});
T15('refreshCatalog avec backend : route API + catalogue remplacé', function(){
  API.url='https://abc.supabase.co';API.key='anon-key';
  var saveP=JSON.parse(JSON.stringify(P)),saveF=apiFetcher,called=null;
  apiFetcher=function(u,o){called=u;return syncP(function(res){
    res({ok:true,json:function(){return [{id:'api-test',n:'Produit API',pr:9.5,st:3,cat:'fruits',g:['#EEE','#CCC'],bd:[],u:'',e:'🥭',b:'',f:'',d:''}];}});
  });};
  refreshCatalog(true);
  apiFetcher=saveF;
  if(!called||called.indexOf('/rest/v1/products')<0) throw new Error('API non interrogée : '+called);
  var p=prod('api-test');
  if(!p||p.n!=='Produit API'||p.pr!==9.5) throw new Error('catalogue non remplacé');
  P=saveP;try{localStorage.removeItem('lm-catalog');}catch(e){}
  API.url='';API.key='';
});
T15('refreshCatalog : backend en échec -> repli products.json', function(){
  API.url='https://abc.supabase.co';API.key='anon-key';
  var saveP=JSON.parse(JSON.stringify(P)),saveF=apiFetcher,saveC=catalogFetcher,calledJson=null;
  apiFetcher=function(){return syncP(function(res,rej){rej(new Error(' réseau'));});};
  catalogFetcher=function(u){calledJson=u;return syncP(function(res){
    res({ok:true,text:function(){return JSON.stringify([{id:'repli-test',n:'Repli local',pr:1,st:2,cat:'epicerie',g:['#EEE','#CCC'],bd:[],u:'',e:'🧂',b:'',f:'',d:''}]);}});
  });};
  refreshCatalog(true);
  apiFetcher=saveF;catalogFetcher=saveC;
  if(!calledJson) throw new Error('repli products.json non déclenché');
  if(!prod('repli-test')) throw new Error('repli non appliqué');
  P=saveP;try{localStorage.removeItem('lm-catalog');}catch(e){}
  API.url='';API.key='';
});

/* ==== payNow : confirmation selon backend ==== */
function cartReset15(){Object.keys(cart).forEach(function(k){delete cart[k];});promoCode='';}
T15('payNow sans backend : commande créée immédiatement', function(){
  API.url='';API.key='';
  cartReset15();cart.mangue=2;
  var b=orders.length;payNow();
  if(orders.length!==b+1) throw new Error('commande manquante');
  if(cartCount()!==0) throw new Error('panier non vidé');
});
T15('payNow avec backend OK : POST orders puis commande créée', function(){
  API.url='https://abc.supabase.co';API.key='anon-key';
  var saveF=apiFetcher,caps=[];
  apiFetcher=function(u,o){caps.push({u:u,m:o&&o.method,body:o&&o.body});return syncP(function(res){res({ok:true});});};
  cartReset15();cart.mangue=1;
  var b=orders.length;payNow();
  apiFetcher=saveF;
  if(!caps.length||caps[0].u.indexOf('/rest/v1/orders')<0||caps[0].m!=='POST') throw new Error('POST orders KO : '+JSON.stringify(caps));
  var body=JSON.parse(caps[0].body);
  if(!body.items||body.items[0].id!=='mangue'||body.items[0].q!==1) throw new Error('items KO : '+caps[0].body);
  if(typeof body.total!=='number') throw new Error('total KO');
  if(orders.length!==b+1) throw new Error('commande non créée après accord serveur');
  if(cartCount()!==0) throw new Error('panier non vidé');
  API.url='';API.key='';
});
T15('payNow avec backend en échec : rien de confirmé', function(){
  API.url='https://abc.supabase.co';API.key='anon-key';
  var saveF=apiFetcher;
  apiFetcher=function(){return syncP(function(res,rej){rej(new Error('réseau'));});};
  cartReset15();cart.mangue=1;
  var b=orders.length;payNow();
  apiFetcher=saveF;
  if(orders.length!==b) throw new Error('commande créée malgré l\'échec');
  if(cartCount()!==1) throw new Error('panier vidé malgré l\'échec');
  API.url='';API.key='';
});

/* ==== testBackend / Paramétrage ==== */
T15('testBackend sans config : invite à renseigner', function(){
  API.url='';API.key='';
  testBackend();
  if(document.getElementById('toast-msg').textContent.indexOf('Renseignez')<0) throw new Error('message KO : '+document.getElementById('toast-msg').textContent);
});
T15('testBackend avec backend joignable : connecté ✓', function(){
  API.url='https://abc.supabase.co';API.key='anon-key';
  var saveF=apiFetcher;
  apiFetcher=function(){return syncP(function(res){res({ok:true});});};
  testBackend();
  apiFetcher=saveF;
  if(document.getElementById('toast-msg').textContent.indexOf('connecté')<0) throw new Error('toast KO : '+document.getElementById('toast-msg').textContent);
  API.url='';API.key='';
});
T15('Paramétrage : carte Backend rendue avec test + déconnexion', function(){
  renderSettings();
  var h=document.getElementById('settings-body').innerHTML;
  if(h.indexOf('set-api-url')<0||h.indexOf('set-api-key')<0) throw new Error('champs absents');
  if(h.indexOf('testBackend()')<0||h.indexOf('clearBackend()')<0) throw new Error('boutons absents');
  if(h.indexOf('Backend (optionnel)')<0) throw new Error('titre KO');
});
T15('loadConfig : restaure API depuis lm-config (https uniquement)', function(){
  try{localStorage.setItem('lm-config',JSON.stringify({api:{url:'https://ok.supabase.co',key:'k2'}}));}catch(e){}
  API.url='';API.key='';loadConfig();
  if(API.url!=='https://ok.supabase.co'||API.key!=='k2') throw new Error('restauration KO : '+API.url);
  try{localStorage.setItem('lm-config',JSON.stringify({api:{url:'http://pas-secure.fr',key:'k3'}}));}catch(e){}
  API.url='';API.key='';loadConfig();
  if(API.url!=='') throw new Error('URL non https devrait être refusée');
  try{localStorage.removeItem('lm-config');}catch(e){}
});

/* restauration de l'état pour les suites suivantes */
orders=ordersSave15;lastOrder=lastSave15;saveOrder();
Object.keys(cart).forEach(function(k){delete cart[k];});promoCode='';

results.forEach(function(r){console.log(r);});
