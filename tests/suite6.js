/* ---- Suite de tests Lot 6 ---- */
var results=[];
function T6(name,fn){try{fn();results.push('PASS '+name);}catch(e){results.push('FAIL '+name+' -> '+(e&&e.message||e));}}

T6('repassse Lot 5 : promo + avis', function(){Object.keys(cart).forEach(k=>delete cart[k]);cart.ananas=2;promoCode='';document.getElementById('promo-input').value='BIENVENUE10';applyPromo();if(Math.abs(discount().amt-0.9)>1e-9) throw new Error('remise KO '+discount().amt);rmPromo();renderProduct('ananas');});

/* ==== LOT 6 — FAVORIS ==== */
T6('pcard : bouton cœur présent', function(){var h=pcard(prod('ananas'));if(h.indexOf('data-fid="ananas"')<0||h.indexOf('tFav')<0) throw new Error('coeur absent');});
T6('fiche : cœur en haut à droite', function(){renderProduct('ananas');var h=document.querySelector('#product-body').innerHTML;if(h.indexOf('top:16px;right:16px')<0||h.indexOf('tFav')<0) throw new Error('coeur fiche absent');});
T6('tFav : ajout + persistance', function(){FAVS=[];tFav('mangue');if(!isFav('mangue')) throw new Error('non favori');var sv=JSON.parse(localStorage.getItem('lm-favs'));if(!sv||sv.indexOf('mangue')<0) throw new Error('persistance KO');});
T6('tFav : toggle off', function(){tFav('mangue');if(isFav('mangue')) throw new Error('toujours favori');});
T6('activé : section Vos favoris sur accueil', function(){FAVS=['ananas','brie'];renderHome();var h=document.querySelector('#home-body').innerHTML;if(h.indexOf('Vos favoris')<0||h.indexOf('data-fid="ananas"')<0) throw new Error('section favoris KO');});
T6('vide : section masquée', function(){FAVS=[];renderHome();var h=document.querySelector('#home-body').innerHTML;if(h.indexOf('Vos favoris')>=0) throw new Error('section devrait être masquée');});
T6('activé : cœur plein vs vide', function(){FAVS=['ananas'];renderHome();var h=document.querySelector('#home-body').innerHTML;var ih=h.indexOf('♥');if(ih<0) throw new Error('coeur plein attendu');FAVS=[];});

/* ==== LOT 6 — RÉORDONNER ==== */
T6('compte : chip Réordonner par commande', function(){goAccount();var h=document.querySelector('#account-body').innerHTML;if(h.indexOf('Réordonner')<0) throw new Error('chip absent');});
T6('reorder commande seedée : 5 articles', function(){Object.keys(cart).forEach(k=>delete cart[k]);reorder('#1030');if(cart.ananas!==2||cart.brie!==1||cart.baguette!==2||cart.tomate!==2||cart.water!==1) throw new Error('panier KO '+JSON.stringify(cart));if(cartCount()!==8) throw new Error('total articles KO '+cartCount());});
T6('reorder ajoute au panier existant', function(){reorder('#1017');if(cart.mahimahi!==1) throw new Error('mahi KO');cart.mahimahi=1;reorder('#1017');if(cart.mahimahi!==2) throw new Error('cumul KO '+cart.mahimahi);});
T6('reorder plafonne au stock et saute les ruptures', function(){Object.keys(cart).forEach(k=>delete cart[k]);orders.unshift({id:'#TEST',n:2,total:9,slot:'',addr:'',when:'',status:4,items:[{id:'mahimahi',q:9},{id:'avocat',q:2}]});reorder('#TEST');if(cart.mahimahi!==3) throw new Error('plafond KO '+cart.mahimahi);if(cart.avocat) throw new Error('rupture non sautée');orders.shift();});
T6('reorder commande sans items : garde', function(){Object.keys(cart).forEach(k=>delete cart[k]);orders.unshift({id:'#EMPTY',n:0,total:0,slot:'',addr:'',when:'',status:4});var c0=cartCount();reorder('#EMPTY');if(cartCount()!==c0) throw new Error('panier modifié');orders.shift();});
T6('payNow enregistre les items', function(){Object.keys(cart).forEach(k=>delete cart[k]);cart.ananas=1;payNow();if(!lastOrder||!lastOrder.items||lastOrder.items[0].id!=='ananas'||lastOrder.items[0].q!==1) throw new Error('items KO '+JSON.stringify(lastOrder&&lastOrder.items));});
T6('reorder depuis commande payée', function(){Object.keys(cart).forEach(k=>delete cart[k]);reorder(lastOrder.id);if(cart.ananas!==1) throw new Error('réordonnance KO '+JSON.stringify(cart));});

/* ==== LOT 6 — BANDEAU PUSH ACCUEIL ==== */
T6('push : commande confirmée', function(){homePushDismissed=false;lastOrder=orders.find(o=>o.id==='#1030');lastOrder.status=1;renderHome();var h=document.querySelector('#home-body').innerHTML;if(h.indexOf('Commande #1030 — Commande confirmée')<0) throw new Error('bannière KO');});
T6('push : préparation en cours', function(){lastOrder.status=2;renderHome();var h=document.querySelector('#home-body').innerHTML;if(h.indexOf('Préparation en cours')<0) throw new Error('label préparation KO');});
T6('push : livreur à X min (ETA dynamique)', function(){lastOrder.status=3;trackEta={mins:18,pos:60};renderHome();var h=document.querySelector('#home-body').innerHTML;if(h.indexOf('Livreur à 18 min')<0) throw new Error('ETA KO');});
T6('push : caché si livrée', function(){lastOrder.status=4;renderHome();var h=document.querySelector('#home-body').innerHTML;if(h.indexOf('Toucher pour suivre la livraison')>=0) throw new Error('bannière devrait disparaître');});
T6('push : bouton fermer', function(){lastOrder.status=2;homePushDismissed=true;renderHome();var h=document.querySelector('#home-body').innerHTML;if(h.indexOf('Toucher pour suivre la livraison')>=0) throw new Error('dismiss KO');homePushDismissed=false;});
T6('push : caché sans commande', function(){homePushDismissed=false;lastOrder=null;renderHome();var h=document.querySelector('#home-body').innerHTML;if(h.indexOf('Toucher pour suivre la livraison')>=0) throw new Error('bannière sans commande');});
T6('payNow réarme le push', function(){homePushDismissed=true;Object.keys(cart).forEach(k=>delete cart[k]);cart.citron=1;payNow();if(homePushDismissed) throw new Error('push non réarmé');});

/* ==== repasse complète finale ==== */
T6('flux complet avec innovations', function(){Object.keys(cart).forEach(k=>delete cart[k]);reorder('#1030');goCart();promoCode='';document.getElementById('promo-input').value='LAGON5';applyPromo();goDelivery();pickSlot(2);goPay();payNow();goTrack();goAccount();backHome();});

results.forEach(r=>console.log(r));
console.log('--- RéSUMÉ-L6 : '+results.filter(r=>r.indexOf('PASS')===0).length+' PASS · '+results.filter(r=>r.indexOf('FAIL')===0).length+' FAIL');
