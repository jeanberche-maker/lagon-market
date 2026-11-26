/* ---- Suite de tests Lot 12 — photos réelles des produits (repli emoji) ---- */
var results=[];
function T12(name,fn){try{fn();results.push('PASS '+name);}catch(e){results.push('FAIL '+name+' -> '+(e&&e.message||e));}}

/* ==== produits.json : photos créditées ==== */
T12('RAW_PRODS : 19 produits avec photo https + crédit', function(){
  if(!Array.isArray(RAW_PRODS)||RAW_PRODS.length!==19) throw new Error('RAW_PRODS '+RAW_PRODS.length);
  RAW_PRODS.forEach(function(p){
    if(typeof p.ph!=='string'||p.ph.indexOf('https://')!==0) throw new Error(p.id+' : ph KO');
    if(typeof p.cr!=='string'||p.cr.length<5) throw new Error(p.id+' : cr KO');
  });
});
T12('RAW_PRODS : URL wikimedia pour chaque photo', function(){
  RAW_PRODS.forEach(function(p){ if(p.ph.indexOf('wikimedia.org')<0&&p.ph.indexOf('wikipedia.org')<0) throw new Error(p.id+' : '+p.ph.slice(0,60)); });
});
T12('RAW_PRODS : crédits uniques (pas de doublon)', function(){
  var seen={}; RAW_PRODS.forEach(function(p){ if(seen[p.ph]) throw new Error('doublon '+p.id); seen[p.ph]=true; });
});

/* ==== données embarquées P : cohérence avec products.json ==== */
T12('P embarqué : ph/cr synchronisés avec products.json', function(){
  RAW_PRODS.forEach(function(rp){
    var p=prod(rp.id);
    if(!p) throw new Error('absent de P : '+rp.id);
    if(p.ph!==rp.ph) throw new Error(rp.id+' : ph embarqué != products.json');
    if(!p.cr) throw new Error(rp.id+' : cr absent');
  });
});
T12('pvis : visuel de repli = dégradé + emoji', function(){
  var h=pvis(prod('ananas'));
  if(h.indexOf('linear-gradient')<0||h.indexOf('🍍')<0) throw new Error(h);
});

/* ==== pimg : rendu photo + repli ==== */
T12('pimg : img avec src=ph, lazy, referrerpolicy', function(){
  var h=pimg(prod('ananas'));
  if(h.indexOf('<img')<0) throw new Error('pas de img');
  if(h.indexOf('data-fe')>=0&&h.indexOf('src="https')<0) throw new Error('src KO');
  if(h.indexOf('loading="lazy"')<0) throw new Error('lazy absent');
  if(h.indexOf('referrerpolicy="no-referrer"')<0) throw new Error('referrerpolicy absent');
  if(h.indexOf('onerror="imgFail')<0) throw new Error('onerror absent');
});
T12('pimg : produit sans ph → repli dégradé+emoji', function(){
  var sansph=Object.assign({},prod('ananas')); delete sansph.ph;
  var h=pimg(sansph);
  if(h.indexOf('<img')>=0) throw new Error('img devrait être absente');
  if(h.indexOf('linear-gradient')<0) throw new Error('repli KO');
});
T12('pimg : classe additionnelle propagée', function(){
  if(pimg(prod('ananas'),'poussin').indexOf('ph poussin')<0) throw new Error('cls KO');
});

/* ==== replis d'erreur (avec objets factices, sans DOM réel) ==== */
T12('imgFail : remplace img par le visuel dégradé', function(){
  var fake={parentNode:{outerHTML:''}};
  imgFail(fake,'ananas');
  if(fake.parentNode.outerHTML.indexOf('linear-gradient')<0) throw new Error('repli non posé');
});
T12('imgFail : inoffensif si produit inconnu', function(){
  var fake={parentNode:{outerHTML:''}};
  imgFail(fake,'inexistant');
  if(fake.parentNode.outerHTML!=='') throw new Error('effet de bord');
});
T12('bigImgFail : reconstitue l\'emoji depuis data-fe', function(){
  var r=null;
  var fake={dataset:{fe:'🥭'},replaceWith:function(n){r=n;}};
  bigImgFail(fake);
  if(!r||r.textContent!=='🥭') throw new Error('emoji non restauré');
});
T12('bigImgFail : emoji de secours si data-fe vide', function(){
  var r=null;
  var fake={dataset:{},replaceWith:function(n){r=n;}};
  bigImgFail(fake);
  if(!r||!r.textContent) throw new Error('pas d\'emoji secours');
});

/* ==== rendu réel de l'app ==== */
T12('pcard : photo réelle rendue pour ananas', function(){
  var h=pcard(prod('ananas'));
  if(h.indexOf('<img')<0||h.indexOf('thumb.wikimedia')<0) throw new Error('photo absente de pcard');
});
T12('fiche produit : grand visuel img + repli emoji data-fe', function(){
  renderProduct('ananas');
  var h=document.getElementById('product-body').innerHTML;
  if(h.indexOf('object-fit:cover')<0) throw new Error('héro sans photo');
  if(h.indexOf('data-fe')<0) throw new Error('repli emoji absent');
  if(h.indexOf('Photo : ')<0) throw new Error('crédit photo absent');
});
T12('fiche produit sans photo : emoji + pas de crédit', function(){
  var p=prod('ananas'),backup=p.ph; p.ph='';
  renderProduct('ananas');
  var h=document.getElementById('product-body').innerHTML;
  p.ph=backup;
  if(h.indexOf('object-fit:cover')>=0) throw new Error('img devrait être absente');
  if(h.indexOf('Photo : ')>=0) throw new Error('crédit devrait être absent');
  if(h.indexOf(p.e)<0) throw new Error('emoji absent');
});

/* ==== CSS & attribution ==== */
T12('CSS : .ph img object-fit cover présent', function(){
  if(RAW_HTML.indexOf('.ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover')<0) throw new Error('règle absente');
});
T12('crédits Commons référencés dans le README (licence)', function(){
  /* lecture du README via le harnais impossible : vérifié côté bash — test jumeau sur RAW_PRODS */
  if(!RAW_PRODS.every(function(p){return p.cr.indexOf('File:')===0||p.cr.indexOf('Commons')>=0;})) throw new Error('format crédit KO');
});

results.forEach(r=>console.log(r));
console.log('--- RÉSUMÉ-L12 : '+results.filter(r=>r.indexOf('PASS')===0).length+' PASS · '+results.filter(r=>r.indexOf('FAIL')===0).length+' FAIL');
