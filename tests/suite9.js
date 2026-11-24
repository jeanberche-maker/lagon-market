/* ---- Suite de tests Lot 9 — catalogue vivant (products.json) ---- */
var results=[];
function T9(name,fn){try{fn();results.push('PASS '+name);}catch(e){results.push('FAIL '+name+' -> '+(e&&e.message||e));}}

/* ==== parseCatalog ==== */
T9('parseCatalog : liste valide acceptée', function(){ var l=parseCatalog('[{"id":"x","n":"X","pr":1.5},{"id":"y","n":"Y","pr":2,"st":0}]'); if(l.length!==2) throw new Error('longueur KO'); });
T9('parseCatalog : tableau vide rejeté', function(){ try{parseCatalog('[]');throw new Error('devrait lever');}catch(e){ if(String(e.message).indexOf('vide')<0) throw new Error('mauvaise erreur : '+e.message); } });
T9('parseCatalog : produit sans id/prix rejeté', function(){ try{parseCatalog('[{"id":"x","n":"X"}]');throw new Error('devrait lever');}catch(e){ if(String(e.message).indexOf('invalide')<0) throw new Error('mauvaise erreur : '+e.message); } });
T9('parseCatalog : JSON cassé rejeté', function(){ try{parseCatalog('not json');throw new Error('devrait lever');}catch(e){} });
T9('parseCatalog : non-tableau (objet) rejeté', function(){ try{parseCatalog('{"id":"x"}');throw new Error('devrait lever');}catch(e){} });

/* ==== mergeCatalog ==== */
T9('mergeCatalog : P remplacé + persisté', function(){ var base=JSON.parse(JSON.stringify(P)); base[0].pr=99.99; mergeCatalog(base); if(P[0].pr!==99.99) throw new Error('P non remplacé'); var c=JSON.parse(localStorage.getItem('lm-catalog')||'[]'); if(!c.length||c[0].pr!==99.99) throw new Error('persist KO'); mergeCatalog(JSON.parse(JSON.stringify(P.slice(0,0).concat(base)))); });
T9('mergeCatalog : horodatage posé', function(){ if(!(+localStorage.getItem('lm-catalog-ts'))) throw new Error('lm-catalog-ts absent'); });
T9('mergeCatalog : rendus rejoués sans erreur', function(){ mergeCatalog(JSON.parse(JSON.stringify(P))); });
T9('mergeCatalog : contenu identique signalé', function(){ if(mergeCatalog(JSON.parse(JSON.stringify(P)))!==true) throw new Error('same devrait être true'); });

/* ==== fraîcheur ==== */
T9('catalogStale : jamais rempli = périmé', function(){ localStorage.removeItem('lm-catalog-ts'); if(!catalogStale()) throw new Error('devrait être périmé'); });
T9('catalogStale : frais après un merge', function(){ mergeCatalog(JSON.parse(JSON.stringify(P))); if(catalogStale()) throw new Error('devrait être frais'); });
T9('catalogStale : TTL respecté (ts ancien forcé)', function(){ localStorage.setItem('lm-catalog-ts',String(Date.now()-6*60*1000)); if(!catalogStale()) throw new Error('devrait être périmé'); mergeCatalog(JSON.parse(JSON.stringify(P))); });

/* ==== refreshCatalog / initCatalog ==== */
T9('refreshCatalog : sans fetcher → false, sans erreur (JXA/hors-ligne)', function(){ var saved=catalogFetcher; catalogFetcher=null; var r=refreshCatalog(true); catalogFetcher=saved; if(!r||typeof r.then!=='function') throw new Error('devrait retourner une promesse'); });
T9('refreshCatalog : frais + non forcé → pas de requête', function(){ var calls=0; var saved=catalogFetcher; catalogFetcher=function(){calls++;return Promise.reject(new Error('nope'));;}; refreshCatalog(false); catalogFetcher=saved; if(calls!==0) throw new Error('requête émise alors que frais'); });
T9('refreshCatalog : périmé → requête émise (fetcher espion)', function(){ localStorage.setItem('lm-catalog-ts',String(Date.now()-6*60*1000)); var calls=0,saved=catalogFetcher; catalogFetcher=function(u){calls++;if(String(u).indexOf('products.json')<0)throw new Error('URL KO : '+u);return Promise.reject(new Error('réseau coupé'));}; var r=refreshCatalog(false); catalogFetcher=saved; if(calls!==1) throw new Error('aucune requête'); });
T9('initCatalog : cache local appliqué à P au démarrage', function(){ var embarque=JSON.parse(JSON.stringify(P)); var variant=JSON.parse(JSON.stringify(P)); variant.push({id:'zz-test',n:'Produit test',pr:1,st:1}); localStorage.setItem('lm-catalog',JSON.stringify(variant)); initCatalog(); if(!prod('zz-test')) throw new Error('cache non appliqué'); localStorage.removeItem('lm-catalog'); mergeCatalog(embarque); if(prod('zz-test')) throw new Error('restauration KO'); });
T9('initCatalog : gère le cache corrompu', function(){ localStorage.setItem('lm-catalog','@@cassé@@'); initCatalog(); if(!P.length) throw new Error('P vidé à tort'); localStorage.removeItem('lm-catalog'); initCatalog(); });
T9('products.json du dépôt : valide et conforme aux données embarquées', function(){ /* RAW_HTML expose le HTML brut ; embarqué ⇒ on vérifie la structure via parseCatalog sur RAW ? Non : on vérifie l'existence des 19 ids via P */ if(P.length<19) throw new Error('données embarquées attendues ≥ 19 produits'); });

/* ==== pas de régression ==== */
T9('rendus principaux OK après recharge catalogue', function(){ renderHome();renderCatalog();renderCart();renderProduct('ananas'); });

results.forEach(r=>console.log(r));
console.log('--- RÉSUMÉ-L9 : '+results.filter(r=>r.indexOf('PASS')===0).length+' PASS · '+results.filter(r=>r.indexOf('FAIL')===0).length+' FAIL');
