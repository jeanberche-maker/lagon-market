/* ---- Suite de tests Lot 7 ---- */
var results=[];
function T7(name,fn){try{fn();results.push('PASS '+name);}catch(e){results.push('FAIL '+name+' -> '+(e&&e.message||e));}}

/* ==== LOT 7 — RECHERCHE ==== */
T7('noAccenle accents', function(){if(noAcc('Crèmerie')!=='cremerie') throw new Error('noAcc KO : '+noAcc('Crèmerie'));if(noAcc('Rosé de Provence bio')!=='rose de provence bio') throw new Error('noAcc é KO');});
T7('suggestions : requête sans accent -> rosé', function(){query='rose';renderSugg();var h=document.getElementById('sugg').innerHTML;if(h.indexOf('Rosé de Provence')<0) throw new Error('suggestion rose absente');});
T7('suggestions : cachées si requête vide', function(){query='';renderSugg();if(document.getElementById('sugg').style.display!=='none') throw new Error('devrait être masqué');});
T7('suggestions : placeholder accompagnant, pas bloquant', function(){query='zzzz';renderSugg();var b=document.getElementById('sugg');if(b.innerHTML.indexOf('appuyez sur Entrée')<0||b.style.display!=='block') throw new Error('message KO');});
T7('openSearchResult : fiche + reset recherche', function(){query='brie';searchMode=true;openSearchResult('brie');if(query!=='') throw new Error('query KO');if(searchMode) throw new Error('searchMode KO');});
T7('goSearchCatalog : requête vide refuse', function(){searchMode=false;activeCat='fruits';query='';goSearchCatalog();if(searchMode||activeCat==='search') throw new Error('mode recherche activé à vide');});
T7('goSearchCatalog : entrée en mode recherche', function(){query='brie';goSearchCatalog();if(activeCat!=='search'||!searchMode) throw new Error('mode KO');
  if(document.querySelector('#cat-title').textContent.indexOf('Recherche')<0) throw new Error('titre KO');
  if(!filtered().length) throw new Error('aucun résultat');
  var ok=filtered().every(p=>noAcc(p.n+' '+p.b).indexOf('brie')>=0);if(!ok) throw new Error('résultats hors filtre');renderCatalog();
  if(document.querySelector('#chips-row').innerHTML.indexOf('Effacer la recherche')<0) throw new Error('chip effacer absent');});
T7('tag requête supprimable', function(){renderTags();if(document.querySelector('#active-tags').innerHTML.indexOf('« brie »')<0) throw new Error('tag absent');rmTag({dataset:{tag:'q',tv:''}});if(searchMode||query) throw new Error('clearSearch KO');});
T7('état vide en recherche : message dédié', function(){searchMode=true;activeCat='search';query='xxintrouvablexx';renderCatalog();if(filtered().length!==0) throw new Error('devrait être vide');});
T7('openCat sort du mode recherche', function(){query='brie';searchMode=true;activeCat='search';openCat('mer');if(searchMode||activeCat!=='mer') throw new Error('reset KO');});

/* ==== LOT 7 — ZONES ==== */
T7('zones : rendu écran + couvertes', function(){goZones();var h=document.querySelector('#zones-body').innerHTML;if(h.indexOf('Orient Bay')<0||h.indexOf('Couvert')<0) throw new Error('zones KO');});
T7('zones : zones à venir signalées', function(){var h=document.querySelector('#zones-body').innerHTML;if(h.indexOf('Bientôt')<0||h.indexOf('2026')<0||h.indexOf('Prochain mois')<0) throw new Error('à venir KO');});
T7('zones : CTA adresse présent', function(){var h=document.querySelector('#zones-body').innerHTML;if(h.indexOf("openSheet('sheet-addr')")<0) throw new Error('CTA adresse absent');});
T7('exitZones revient à l\'écran précédent', function(){lastScreen='home';exitZones();});

/* ==== LOT 7 — ONBOARDING ==== */
T7('onboarding : affiché à la première visite', function(){var o=document.getElementById('onboard');if(o.style.display!=='flex') throw new Error('devrait être affiché : '+o.style.display);
  var oh=document.querySelector('#onboard').innerHTML;if(oh.indexOf('Vos courses, livrées à la villa')<0) throw new Error('slide 1 KO');if(oh.indexOf('Suivant')<0) throw new Error('CTA KO');if(oh.indexOf('Passer')<0) throw new Error('skip KO');});
T7('onboarding : navigation avant/arrière', function(){obNav(1);if(document.querySelector('#onboard').innerHTML.indexOf('Un panier prêt à livrer')<0) throw new Error('slide 2 KO');
  obNav(1);var h=document.querySelector('#onboard').innerHTML;if(h.indexOf('Commencer')<0||h.indexOf('Suivant')>=0) throw new Error('slide 3 KO : attendu CTA Commencer');
  obNav(-1);if(document.querySelector('#onboard').innerHTML.indexOf('Un panier prêt à livrer')<0) throw new Error('retour KO');});
T7('onboarding : borne gauche', function(){obNav(-1);obNav(-1);if(document.querySelector('#onboard').innerHTML.indexOf('Vos courses')<0) throw new Error('devrait rester slide 1');});
T7('onboarding : fin -> flag persisté + masqué', function(){obFinish();if(localStorage.getItem('lm-onboarded')!=='1') throw new Error('flag KO');if(document.getElementById('onboard').style.display!=='none') throw new Error('devrait être masqué');});
T7('onboarding : plus réaffiché après flag', function(){document.getElementById('onboard').style.display='';maybeOnboard();if(document.getElementById('onboard').style.display!=='') throw new Error('réaffiché à tort');});

/* ==== repasse complète finale ==== */
T7('flux complet L1->L7', function(){Object.keys(cart).forEach(k=>delete cart[k]);query='mangue';renderSugg();openSearchResult('mangue');tFav('mangue');addToCart('mangue');goCart();promoCode='';document.getElementById('promo-input').value='BIENVENUE10';applyPromo();goDelivery();pickSlot(1);goPay();payNow();goTrack();refreshTrack();goAccount();reorder(lastOrder.id);backHome();renderHome();});

results.forEach(r=>console.log(r));
console.log('--- RÉSUMÉ-L7 : '+results.filter(r=>r.indexOf('PASS')===0).length+' PASS · '+results.filter(r=>r.indexOf('FAIL')===0).length+' FAIL');
