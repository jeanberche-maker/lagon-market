/* ---- Suite de tests Lot 16 — sécurisation : auth marchand ---- */
var results=[];
function TB16(name,fn){try{fn();results.push('PASS '+name);}catch(e){results.push('FAIL '+name+' -> '+(e&&e.message||e));}}

/* faux fetch : auth Supabase + REST, jeton marchand simulé */
var _caps16=[],_tok16='tok-1',_authMode16='ok';
var fetch=function(u,o){
  _caps16.push({u:u,m:o&&o.method,h:o&&o.headers,b:o&&o.body});
  return syncP(function(res){
    if(u.indexOf('/auth/v1/token?grant_type=password')>=0){
      var b=JSON.parse(o.body);
      if(_authMode16!=='ok'){res({ok:false,json:function(){return syncP(function(r2){r2({msg:'Invalid login credentials'});});}});return;}
      if(b.email==='m@x.com'&&b.password==='pw')res({ok:true,json:function(){return syncP(function(r2){r2({access_token:'tok-1',refresh_token:'rt-1',user:{email:'m@x.com'}});});}});
      else res({ok:false,json:function(){return syncP(function(r2){r2({msg:'Invalid login credentials'});});}});
      return;
    }
    if(u.indexOf('/auth/v1/token?grant_type=refresh_token')>=0){
      var b2=JSON.parse(o.body);
      if(b2.refresh_token==='rt-1')res({ok:true,json:function(){return syncP(function(r2){r2({access_token:'tok-2',refresh_token:'rt-2'});});}});
      else res({ok:false,json:function(){return syncP(function(r2){r2({});});}});
      return;
    }
    if(u.indexOf('/auth/v1/logout')>=0){res({ok:true,json:function(){return syncP(function(r2){r2({});});}});return;}
    /* REST */
    if(u.indexOf('/rest/v1/products?select=*')>=0){
      res({ok:true,status:200,json:function(){return syncP(function(r2){r2([{id:'bk1',n:'Du backend',pr:5,st:2,cat:'epicerie',g:['#EEE','#CCC'],bd:[],u:'',e:'🧂',b:'',f:'',d:''}]);});}});
      return;
    }
    if(u.indexOf('/rest/v1/products?on_conflict=id')>=0){
      const okk=(o&&o.headers&&o.headers.Authorization)==='Bearer '+_tok16;
      res({ok:okk,status:okk?200:401,json:function(){return syncP(function(r2){r2([]);});}});
      return;
    }
    res({ok:true,status:200,json:function(){return syncP(function(r2){r2([]);});}});
  });
};

/* état propre au départ */
BK.url='https://shop.supabase.co';BK.key='anon-123';BKSESS=null;_caps16=[];_tok16='tok-1';_authMode16='ok';

TB16('bkAuthed : faux sans session', function(){ if(bkAuthed()) throw new Error('devrait être faux'); });
TB16('bkLogin sans backend configuré : refusé', function(){
  BK.url='';BK.key='';
  bkLogin();
  if(document.getElementById('toast').textContent.indexOf('Configurez')<0) throw new Error('toast KO : '+document.getElementById('toast').textContent);
  BK.url='https://shop.supabase.co';BK.key='anon-123';
});
TB16('bkLogin champs vides : refusé', function(){
  document.getElementById('au-mail').value='';document.getElementById('au-pass').value='';
  bkLogin();
  if(document.getElementById('toast').textContent.indexOf('Renseignez')<0) throw new Error('toast KO');
});
TB16('bkLogin : mot de passe faux -> message du serveur', function(){
  document.getElementById('au-mail').value='m@x.com';document.getElementById('au-pass').value='mauvais';
  bkLogin();
  if(document.getElementById('toast').textContent.indexOf('refusée')<0) throw new Error('toast KO : '+document.getElementById('toast').textContent);
  if(bkAuthed()) throw new Error('session créée à tort');
});
TB16('bkLogin : succès -> session persistée + UI connectée', function(){
  _caps16=[];
  document.getElementById('au-mail').value='m@x.com';document.getElementById('au-pass').value='pw';
  bkLogin();
  if(!bkAuthed()||BKSESS.access_token!=='tok-1'||BKSESS.email!=='m@x.com') throw new Error('session KO : '+JSON.stringify(BKSESS));
  var saved=JSON.parse(localStorage.getItem('lm-admin-auth'));
  if(!saved||saved.access_token!=='tok-1') throw new Error('persistance KO');
  var c=_caps16[0];
  if(c.u.indexOf('/auth/v1/token?grant_type=password')<0||c.h.apikey!=='anon-123') throw new Error('appel auth KO : '+c.u);
  if(document.getElementById('auth-who').textContent!=='m@x.com') throw new Error('UI KO');
  if(document.getElementById('auth-off').style.display!=='none') throw new Error('formulaire devrait être masqué');
});
TB16('bkFetch : Bearer = jeton marchand si connecté, clé anon sinon', function(){
  _caps16=[];
  bkFetch('products?select=id',{method:'POST'});
  if(_caps16[0].h.Authorization!=='Bearer tok-1') throw new Error('attendu jeton marchand : '+_caps16[0].h.Authorization);
  BKSESS=null;
  bkFetch('products?select=id',{method:'POST'});
  if(_caps16[1].h.Authorization!=='Bearer anon-123') throw new Error('attendu clé anon : '+_caps16[1].h.Authorization);
  BKSESS={access_token:'tok-1',refresh_token:'rt-1',email:'m@x.com'};
});
TB16('bkFetch : lecture produits anonyme OK (RLS lecture publique)', function(){
  _caps16=[];BKSESS=null;
  var res=null;bkFetch('products?select=*').then(function(r){res=r;});
  if(!res||!res.ok) throw new Error('lecture anonyme devrait passer');
});
TB16('bkPublish sans session : refusé, aucun appel REST', function(){
  _caps16=[];BKSESS=null;
  CATALOG=validateCatalog([{id:'a',n:'A',pr:1,st:1}]);
  bkPublish();
  if(_caps16.length) throw new Error('appel émis sans session');
  if(document.getElementById('toast').textContent.indexOf('Connectez-vous')<0) throw new Error('toast KO');
});
TB16('bkPublish session expirée : refresh puis retry réussi', function(){
  _caps16=[];_tok16='tok-2'; /* le serveur n'accepte plus que tok-2 */
  BKSESS={access_token:'tok-1',refresh_token:'rt-1',email:'m@x.com'}; /* session expirée */
  CATALOG=validateCatalog([{id:'a',n:'A',pr:1,st:1}]);
  bkPublish();
  var authCalls=_caps16.filter(function(c){return c.u.indexOf('/auth/v1/token')>=0;});
  if(authCalls.length!==1||authCalls[0].u.indexOf('grant_type=refresh_token')<0) throw new Error('refresh non déclenché : '+JSON.stringify(_caps16.map(function(c){return c.u;})));
  if(BKSESS.access_token!=='tok-2') throw new Error('jeton non rafraîchi : '+BKSESS.access_token);
  if(document.getElementById('toast').textContent.indexOf('Publié')<0) throw new Error('toast KO : '+document.getElementById('toast').textContent);
  var restCalls=_caps16.filter(function(c){return c.u.indexOf('/rest/v1/')>=0;});
  if(restCalls.length!==2) throw new Error('attendu 2 tentatives REST, reçu '+restCalls.length);
});
TB16('bkPublish refresh en échec : session nettoyée + invite', function(){
  _caps16=[];_authMode16='fail'; /* login/refresh refusés */
  BKSESS={access_token:'vieux',refresh_token:'rt-périmé',email:'m@x.com'};
  CATALOG=validateCatalog([{id:'a',n:'A',pr:1,st:1}]);
  bkPublish();
  if(bkAuthed()) throw new Error('session devrait être nettoyée');
  if(document.getElementById('toast').textContent.indexOf('reconnectez-vous')<0) throw new Error('toast KO : '+document.getElementById('toast').textContent);
  _authMode16='ok';
});
TB16('bkLogout : session effacée + appel logout best-effort', function(){
  _caps16=[];
  BKSESS={access_token:'tok-1',refresh_token:'rt-1',email:'m@x.com'};
  bkLogout();
  if(bkAuthed()) throw new Error('session devrait être nulle');
  if(localStorage.getItem('lm-admin-auth')!==null) throw new Error('lm-admin-auth devrait être supprimé');
  var lo=_caps16.filter(function(c){return c.u.indexOf('/auth/v1/logout')>=0;});
  if(lo.length!==1) throw new Error('logout KO');
});
/* restauration */
BKSESS=null;try{localStorage.removeItem('lm-admin-auth');}catch(e){}
try{localStorage.removeItem('lm-config');}catch(e){}

results.forEach(function(r){console.log(r);});
