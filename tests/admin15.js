/* ---- Suite de tests Lot 15 — Espace boutique : backend Supabase ---- */
var results=[];
function TA15(name,fn){try{fn();results.push('PASS '+name);}catch(e){results.push('FAIL '+name+' -> '+(e&&e.message||e));}}

/* Promesse synchrones (cf. suite15.js de l'app). */
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
/* faux fetch global pour l'admin (les vrais appels vont dans le navigateur) */
var _bkCaps=[],_bkMode='ok';
var fetch=function(u,o){_bkCaps.push({u:u,m:o&&o.method,body:o&&o.body});
  return syncP(function(res,rej){
    if(_bkMode==='ok')res({ok:true,json:function(){return [{id:'bk1',n:'Du backend',pr:5,st:2,cat:'epicerie',g:['#EEE','#CCC'],bd:[],u:'',e:'🧂',b:'',f:'',d:''}];}});
    else rej(new Error('réseau'));
  });
};

TA15('bkToRow : mapping aligné sur le schéma SQL', function(){
  var row=bkToRow({id:'mangue',n:'Mangue',pr:3.2,st:5,g:['#A','#B'],bd:['Bio'],u:'',e:'🥭',b:'',f:'',d:'',promo:true});
  if(row.id!=='mangue'||row.n!=='Mangue'||row.pr!==3.2||row.st!==5||row.promo!==true) throw new Error(JSON.stringify(row));
  if(row.n_en!==null||row.ph!==null) throw new Error('nulls KO');
});
TA15('bkSave : URL non https refusée', function(){
  BK.url='';BK.key='';
  document.getElementById('bk-url').value='http://pas-secure.fr';
  document.getElementById('bk-key').value='k';
  bkSave();
  if(bkReady()) throw new Error('URL http devrait être refusée');
  var raw=null;try{raw=JSON.parse(localStorage.getItem('lm-config')||'null');}catch(e){}
  if(raw&&raw.api&&raw.api.url) throw new Error('config enregistrée à tort');
});
TA15('bkSave : configuration https persistée dans lm-config', function(){
  document.getElementById('bk-url').value='https://shop.supabase.co/';
  document.getElementById('bk-key').value='anon-123';
  bkSave();
  if(BK.url!=='https://shop.supabase.co') throw new Error('slash final non retiré : '+BK.url);
  if(!bkReady()) throw new Error('bkReady KO');
  var c=JSON.parse(localStorage.getItem('lm-config'));
  if(!c.api||c.api.url!=='https://shop.supabase.co'||c.api.key!=='anon-123') throw new Error('persistance KO');
  if(document.getElementById('bk-tag').textContent.indexOf('connecté')<0) throw new Error('tag KO');
});
TA15('bkPublish : catalogue vide refusé', function(){
  _bkCaps=[];var save=CATALOG;CATALOG=[];
  bkPublish();
  CATALOG=save;
  if(_bkCaps.length) throw new Error('appel émis malgré catalogue vide');
});
TA15('bkPublish : catalogue invalide refusé', function(){
  _bkCaps=[];var save=CATALOG;CATALOG=[{id:'x',n:'X'}]; /* pas de pr ni st */
  try{bkPublish();}finally{CATALOG=save;}
  if(_bkCaps.length) throw new Error('appel émis malgré catalogue invalide');
});
TA15('bkPublish : upsert groupé POST ?on_conflict=id', function(){
  _bkCaps=[];_bkMode='ok';
  CATALOG=validateCatalog([{id:'a',n:'A',pr:1,st:1},{id:'b',n:'B',pr:2,st:0}]);
  bkPublish();
  if(_bkCaps.length!==1) throw new Error('attendu 1 appel, reçu '+_bkCaps.length);
  var c=_bkCaps[0];
  if(c.u.indexOf('/rest/v1/products?on_conflict=id')<0||c.m!=='POST') throw new Error('appel KO : '+c.u);
  var body=JSON.parse(c.body);
  if(!Array.isArray(body)||body.length!==2||body[0].id!=='a'||body[1].id!=='b') throw new Error('body KO : '+c.body);
  if(document.getElementById('toast').textContent.indexOf('Publié')<0) throw new Error('toast KO : '+document.getElementById('toast').textContent);
});
TA15('bkLoad : remplace le catalogue local par celui du backend', function(){
  _bkCaps=[];_bkMode='ok';
  CATALOG=validateCatalog([{id:'local',n:'Local',pr:1,st:1}]);
  bkLoad();
  if(_bkCaps.length!==1||_bkCaps[0].u.indexOf('/rest/v1/products?select=*')<0) throw new Error('appel KO');
  if(CATALOG.length!==1||CATALOG[0].id!=='bk1'||CATALOG[0].n!=='Du backend') throw new Error('catalogue KO : '+JSON.stringify(CATALOG));
});
TA15('bkPublish / bkLoad : backend injoignable signalé', function(){
  _bkCaps=[];_bkMode='fail';
  CATALOG=validateCatalog([{id:'a',n:'A',pr:1,st:1}]);
  bkPublish();
  if(document.getElementById('toast').textContent.indexOf('injoignable')<0) throw new Error('toast publish KO');
  bkLoad();
  if(document.getElementById('toast').textContent.indexOf('impossible')<0) throw new Error('toast load KO');
});
TA15('bkClear : configuration retirée', function(){
  document.getElementById('bk-url').value='https://shop.supabase.co';
  document.getElementById('bk-key').value='anon-123';
  bkClear();
  if(bkReady()) throw new Error('devrait être déconnecté');
  var c=JSON.parse(localStorage.getItem('lm-config')||'{}');
  if(c.api) throw new Error('api devrait être supprimée de lm-config');
  if(document.getElementById('bk-url').value!=='') throw new Error('champ non vidé');
});

results.forEach(function(r){console.log(r);});
