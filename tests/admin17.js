/* ---- Suite de tests Lot 17 — import facture/devis, approbation 1 par 1 ---- */
var results=[];
function TI17(name,fn){try{fn();results.push('PASS '+name);}catch(e){results.push('FAIL '+name+' -> '+(e&&e.message||e));}}

const IMP_SAMPLE='FACTURE N° 2026-0142\nSociété du Lagon SARL\nDate : 12/03\n----------------------------\n2 KG TOMATES GRAPPE 7,90\nBRIE AOP 200 G 3,95 €\n1 BAGUETTE TRADITION 1,20\nMAHI MAHI FILET KG 18,50\nx3 EAU MINERALE 1,5L 2,70\nTotal HT : 34,25\nTVA 5,5 % : 1,88\nNET A PAYER : 36,13';

/* ==== parse ==== */
TI17('impParse : lignes produits extraites, bruit ignoré', function(){
  const props=impParse(IMP_SAMPLE);
  const ids=props.map(function(p){return p.id;});
  if(ids.indexOf('tomates-grappe')<0) throw new Error('tomates absentes : '+ids.join(','));
  if(ids.indexOf('brie-aop')<0) throw new Error('brie absent');
  if(ids.indexOf('baguette-tradition')<0) throw new Error('baguette absente');
  if(ids.indexOf('mahi-mahi-filet')<0) throw new Error('mahi absent');
  if(ids.indexOf('eau-minerale')<0) throw new Error('eau absente : '+ids.join(','));
  if(props.some(function(p){return /facture|total|tva|net/i.test(p.n);})) throw new Error('ligne de bruit acceptée');
});
TI17('impParse : prix corrects (virgule, €, formats)', function(){
  const props=impParse(IMP_SAMPLE);
  const m={};props.forEach(function(p){m[p.id]=p.pr;});
  if(m['tomates-grappe']!==7.9) throw new Error('tomates '+m['tomates-grappe']);
  if(m['brie-aop']!==3.95) throw new Error('brie '+m['brie-aop']);
  if(m['baguette-tradition']!==1.2) throw new Error('baguette '+m['baguette-tradition']);
  if(m['mahi-mahi-filet']!==18.5) throw new Error('mahi '+m['mahi-mahi-filet']);
  if(m['eau-minerale']!==2.7) throw new Error('eau '+m['eau-minerale']);
});
TI17('impParse : noms nettoyés (quantités et unités retirés)', function(){
  const props=impParse(IMP_SAMPLE);
  const m={};props.forEach(function(p){m[p.id]=p.n;});
  if(m['tomates-grappe']!=='Tomates grappe') throw new Error('tomates : '+m['tomates-grappe']);
  if(m['baguette-tradition']!=='Baguette tradition') throw new Error('baguette : '+m['baguette-tradition']);
  if(/kg|200 g|1,5l|x3/i.test(m['brie-aop']+' '+m['eau-minerale'])) throw new Error('unités résiduelles : '+m['brie-aop']+' / '+m['eau-minerale']);
});
TI17('impParse : catégorie et emoji déduits', function(){
  const props=impParse(IMP_SAMPLE);
  const m={};props.forEach(function(p){m[p.id]=p;});
  if(m['tomates-grappe'].cat!=='fruits'||m['tomates-grappe'].e!=='🥭') throw new Error('tomates cat : '+m['tomates-grappe'].cat);
  if(m['brie-aop'].cat!=='cremerie') throw new Error('brie cat : '+m['brie-aop'].cat);
  if(m['baguette-tradition'].cat!=='boulangerie') throw new Error('baguette cat : '+m['baguette-tradition'].cat);
  if(m['mahi-mahi-filet'].cat!=='mer') throw new Error('mahi cat : '+m['mahi-mahi-filet'].cat);
  if(m['eau-minerale'].cat!=='boissons') throw new Error('eau cat : '+m['eau-minerale'].cat);
});
TI17('impParse : ligne sans prix rejetée', function(){
  const props=impParse('TOMATES GRAPPE\nPRIX INCONNU\nAUTRE CHOSE 3,50');
  if(props.length!==1||props[0].id!=='autre-chose') throw new Error(JSON.stringify(props));
});
TI17('impParse : doublon existant marqué (mise à jour)', function(){
  const save=CATALOG;CATALOG=validateCatalog([{id:'tomates-grappe',n:'Tomates grappe',pr:7,st:5}]);
  const props=impParse('TOMATES GRAPPE 7,90');
  CATALOG=save;
  if(props.length!==1||!props[0].dup) throw new Error('dup non détecté : '+JSON.stringify(props));
});
TI17('impParse : doublons de la fournée dédoublonnés', function(){
  const props=impParse('TOMATES GRAPPE 7,90\nTomates grappe 8,10');
  if(props.length!==1) throw new Error(JSON.stringify(props));
});

/* ==== file d'approbation 1 par 1 ==== */
TI17('impAnalyze : remplit la file, garde le premier en tête', function(){
  const save=localStorage.getItem('lm-import-queue');
  IMPQ=[];
  document.getElementById('imp-raw').value=IMP_SAMPLE;
  impAnalyze();
  if(IMPQ.length<5) throw new Error('file trop courte : '+IMPQ.length);
  if(IMPQ[0].id!=='tomates-grappe') throw new Error('tête de file KO : '+IMPQ[0].id);
  if(document.getElementById('imp-raw').value!=='') throw new Error('textarea non vidé');
  if(document.getElementById('imp-queue').innerHTML.indexOf('Produit 1 sur')<0) throw new Error('rendu KO');
  IMPQ=[];try{ if(save===null)localStorage.removeItem('lm-import-queue'); else localStorage.setItem('lm-import-queue',save);}catch(e){}
});
TI17('impAnalyze : texte vide → message, file intacte', function(){
  IMPQ=[];
  document.getElementById('imp-raw').value='   ';
  impAnalyze();
  if(IMPQ.length) throw new Error('file modifiée à tort');
  if(document.getElementById('toast').textContent.indexOf('Aucune ligne')<0) throw new Error('toast KO');
});
TI17('approbation : ajoute au catalogue, avance dans la file, persiste', function(){
  const save=CATALOG;CATALOG=validateCatalog([]);IMPQ=impParse(IMP_SAMPLE);impSaveQ();impRender();
  document.getElementById('i-n').value='Tomates grappe';document.getElementById('i-pr').value='7,90';document.getElementById('i-st').value='10';
  impApprove();
  if(CATALOG.length!==1||CATALOG[0].id!=='tomates-grappe'||CATALOG[0].pr!==7.9||CATALOG[0].st!==10) throw new Error('catalogue : '+JSON.stringify(CATALOG));
  if(IMPQ.length!==impParse(IMP_SAMPLE).length-1) throw new Error('file non décrémentée : '+IMPQ.length);
  if(IMPQ[0].id!=='brie-aop') throw new Error('tête de file KO : '+IMPQ[0].id);
  const savedQ=JSON.parse(localStorage.getItem('lm-import-queue'));
  if(savedQ.length!==IMPQ.length) throw new Error('file non persistée');
  CATALOG=save;IMPQ=[];impSaveQ();
});
TI17('approbation : produit existant → mise à jour (pas de doublon)', function(){
  const save=CATALOG;CATALOG=validateCatalog([{id:'tomates-grappe',n:'Tomates grappe',pr:7,st:5}]);
  IMPQ=impParse('TOMATES GRAPPE 8,50');impRender();
  document.getElementById('i-pr').value='8,50';document.getElementById('i-st').value='6';
  impApprove();
  if(CATALOG.length!==1) throw new Error('doublon créé : '+JSON.stringify(CATALOG));
  if(CATALOG[0].pr!==8.5||CATALOG[0].st!==6) throw new Error('pas mis à jour : '+JSON.stringify(CATALOG[0]));
  CATALOG=save;IMPQ=[];impSaveQ();
});
TI17('approbation : prix invalide → refusé, file intacte', function(){
  const save=CATALOG;CATALOG=validateCatalog([]);
  IMPQ=impParse('TOMATES GRAPPE 7,90');impRender();
  document.getElementById('i-pr').value='abc';
  impApprove();
  if(CATALOG.length!==0) throw new Error('ajouté malgré prix invalide');
  if(IMPQ.length!==1) throw new Error('file vidée à tort');
  if(document.getElementById('toast').textContent.indexOf('Prix invalide')<0) throw new Error('toast KO');
  CATALOG=save;IMPQ=[];impSaveQ();
});
TI17('rejet : passe au suivant sans toucher au catalogue', function(){
  const save=CATALOG;const len=CATALOG.length;
  IMPQ=impParse(IMP_SAMPLE);impRender();
  impReject();
  if(CATALOG.length!==len) throw new Error('catalogue modifié');
  if(IMPQ[0].id!=='brie-aop') throw new Error('tête de file KO : '+(IMPQ[0]&&IMPQ[0].id));
  IMPQ=[];impSaveQ();
});
TI17('impReset : file vidée et persistée vide', function(){
  IMPQ=impParse(IMP_SAMPLE);impSaveQ();
  impReset();
  if(IMPQ.length) throw new Error('file non vidée');
  if(JSON.parse(localStorage.getItem('lm-import-queue')).length) throw new Error('persistance non vidée');
});
TI17('file vide : rendu accueil + tag', function(){
  IMPQ=[];impRender();
  if(document.getElementById('imp-queue').innerHTML.indexOf('Aucune proposition')<0) throw new Error('rendu vide KO');
  if(document.getElementById('imp-tag').textContent.indexOf('file vide')<0) throw new Error('tag KO');
});

/* restauration */
IMPQ=[];try{localStorage.removeItem('lm-import-queue');}catch(e){}

results.forEach(function(r){console.log(r);});
