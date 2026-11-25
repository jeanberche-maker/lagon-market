/* ---- Suite de tests Lot 10 — Espace boutique (admin.html) ---- */
var results=[];
function T10(name,fn){try{fn();results.push('PASS '+name);}catch(e){results.push('FAIL '+name+' -> '+(e&&e.message||e));}}

/* ==== utilitaires ==== */
T10('slugify : accents et espaces', function(){ if(slugify('Rosé de Provence')!=='rose-de-provence') throw new Error(slugify('Rosé de Provence')); if(slugify('Crème  🥭 fraîche')!=='creme-fraiche') throw new Error(slugify('Crème  🥭 fraîche')); });
T10('eur : format français', function(){ if(eur(4.5)!=='4,50 €') throw new Error(eur(4.5)); });
T10('parsePrice : virgule ET point', function(){ if(parsePrice('3,20')!==3.2||parsePrice('3.20')!==3.2) throw new Error('parsePrice KO'); if(parsePrice('abc')!==null||parsePrice('-2')!==null) throw new Error('poubelle KO'); });
T10('parseStock : entier >= 0', function(){ if(parseStock('12')!==12||parseStock('0')!==0) throw new Error('KO'); if(parseStock('3,5')!==null) throw new Error('décimal devrait être refusé'); });

/* ==== validateCatalog ==== */
T10('validateCatalog : liste complète acceptée', function(){ validateCatalog([{id:'a',n:'A',pr:1,st:0},{id:'b',n:'B',pr:2,st:5}]); });
T10('validateCatalog : id en double rejeté', function(){ try{validateCatalog([{id:'a',n:'A',pr:1,st:1},{id:'a',n:'B',pr:1,st:1}]);throw new Error('devrait lever');}catch(e){ if(String(e.message).indexOf('double')<0) throw e; } });
T10('validateCatalog : produit sans nom/prix rejetté', function(){ try{validateCatalog([{id:'a',pr:1,st:1}]);throw new Error('devrait lever');}catch(e){} try{validateCatalog([{id:'a',n:'A',st:1}]);throw new Error('devrait lever');}catch(e){} try{validateCatalog([{id:'a',n:'A',pr:1}]);throw new Error('devrait lever');}catch(e){} });

/* ==== formulaire → catalogue ==== */
function sv(id,v){document.getElementById(id).value=v;}
T10('formulaire renseigné -> produit ajouté', function(){ CATALOG=[];editId=null;
  sv('f-n','Mangue Test');sv('f-b','Verger du Sud');sv('f-f','pièce');sv('f-pr','3,20');sv('f-u','7,10 €/kg');sv('f-e','🥭');
  sv('f-st','8');sv('f-d','Une mangue de test.');
  document.getElementById('f-frais').checked=true;document.getElementById('f-promo').checked=true;
  addOrUpdate();
  if(CATALOG.length!==1) throw new Error('non ajouté');
  var p=CATALOG[0];
  if(p.id!=='mangue-test'||p.pr!==3.2||p.st!==8) throw new Error(JSON.stringify(p));
  if(p.bd.indexOf('Frais du jour')<0||!p.promo) throw new Error('badges/promo KO');
});
T10('formulaire incomplet -> refusé avec message', function(){ CATALOG=[{id:'a',n:'A',pr:1,st:1}]; CATALOG.push({id:'a2',n:'A2',pr:1,st:1});
  sv('f-n','');sv('f-pr','3,20');sv('f-st','5');
  var avant=CATALOG.length; addOrUpdate();
  if(CATALOG.length!==avant) throw new Error('devrait être refusé');
});
T10('édition : même id remplacé (pas dupliqué)', function(){ CATALOG=[{id:'a',n:'A',pr:1,st:1}]; editId='a';
  sv('f-n','A renommé');sv('f-pr','2,00');sv('f-st','4');document.getElementById('f-bio').checked=true;
  addOrUpdate();
  if(CATALOG.length!==1||CATALOG[0].n!=='A renommé'||CATALOG[0].pr!==2||!CATALOG[0].bd||CATALOG[0].bd.indexOf('Bio')<0) throw new Error(JSON.stringify(CATALOG));
  editId=null;
});

/* ==== mutations ==== */
T10('bumpStock : +/− avec plancher à 0', function(){ CATALOG=[{id:'a',n:'A',pr:1,st:2}];
  bumpStock('a',1); if(CATALOG[0].st!==3) throw new Error('plus KO');
  bumpStock('a',-5); if(CATALOG[0].st!==0) throw new Error('plancher KO : '+CATALOG[0].st);
});
T10('delProduct : retire le produit', function(){ CATALOG=[{id:'a',n:'A',pr:1,st:1},{id:'b',n:'B',pr:1,st:1}];
  delProduct('a'); if(CATALOG.length!==1||CATALOG[0].id!=='b') throw new Error('KO');
});
T10('togglePromo : va-et-vient', function(){ CATALOG=[{id:'a',n:'A',pr:1,st:1}];
  togglePromo('a'); if(!CATALOG[0].promo) throw new Error('on KO');
  togglePromo('a'); if(CATALOG[0].promo) throw new Error('off KO');
});
T10('brouillon persisté dans lm-admin-catalog', function(){ var c=JSON.parse(localStorage.getItem('lm-admin-catalog')||'[]'); if(!c.length) throw new Error('brouillon absent'); });

/* ==== export ==== */
T10('exportJSON : produire du JSON valide', function(){ var s=JSON.stringify(CATALOG,null,1); var l=JSON.parse(s); if(!Array.isArray(l)||!l.length) throw new Error('export KO'); });

/* ==== pas de régression ==== */
T10('renderList : rendu sans erreur + compteurs', function(){ renderList(); if(String(qs('#count').innerHTML).indexOf('produits')<0) throw new Error('compteur KO'); });

results.forEach(r=>console.log(r));
console.log('--- RÉSUMÉ-L10 : '+results.filter(r=>r.indexOf('PASS')===0).length+' PASS · '+results.filter(r=>r.indexOf('FAIL')===0).length+' FAIL');
