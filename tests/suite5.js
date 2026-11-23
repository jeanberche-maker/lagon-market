/* ---- Suite de tests Lot 5 (repassse + nouveau) ---- */
var results=[];
function T5(name,fn){try{fn();results.push('PASS '+name);}catch(e){results.push('FAIL '+name+' -> '+(e&&e.message||e));}}

/* ==== Repasse lots précédents ==== */
T5('home + catalogue rendus', function(){renderHome();renderCatalog();});
T5('panier totaux base', function(){Object.keys(cart).forEach(k=>delete cart[k]);cart.ananas=1;cart.brie=1;if(Math.abs(cartTotal()-10.4)>1e-9) throw new Error('total KO '+cartTotal());if(Math.abs(fees()-4.9)>1e-9) throw new Error('frais KO '+fees());renderCart();});
T5('livraison offerte dès seuil', function(){cart.entrecote=6;if(fees()!==0) throw new Error('frais attends 0, obtenu '+fees());delete cart.entrecote;renderCart();});
T5('paiement crée une commande (base)', function(){renderPay();var b=orders.length;payNow();if(orders.length!==b+1) throw new Error('commande manquante');if(cartCount()!==0) throw new Error('panier non vidé');goAccount();});
T5('suivi + paramétrage rendus', function(){lastOrder=orders[0];goTrack();advanceTrack(1);goSettings();});

/* ==== LOT 5 — AVIS ==== */
T5('avis seedés : ananas (moyenne 14/3)', function(){var r=reviewsOf('ananas');if(r.length<3) throw new Error('attendu >=3, obtenu '+r.length);if(Math.abs(avgRating('ananas')-14/3)>1e-9) throw new Error('moyenne KO '+avgRating('ananas'));});
T5('produit sans avis : tomate', function(){if(reviewsOf('tomate').length!==0) throw new Error('attendu 0, obtenu '+reviewsOf('tomate').length);});
T5('starsHtml arrondis et bornes', function(){if((starsHtml(4.6).match(/★/g)||[]).length!==5) throw new Error('arrondi haut KO');if((starsHtml(1.2).match(/★/g)||[]).length!==1) throw new Error('arrondi bas KO');if((starsHtml(99).match(/★/g)||[]).length!==5) throw new Error('borne haute KO');if((starsHtml(-2).match(/☆/g)||[]).length!==5) throw new Error('borne basse KO');});
T5('fiche avec avis : section rendue', function(){renderProduct('ananas');var h=document.querySelector('#product-body').innerHTML;if(h.indexOf('Avis clients')<0||h.indexOf('Sophie L.')<0||h.indexOf('4,7')<0) throw new Error('section avis KO');});
T5('fiche sans avis : mention premier avis', function(){renderProduct('tomate');var h=document.querySelector('#product-body').innerHTML;if(h.indexOf('Pas encore d')<0||h.indexOf('Écrire le premier avis')<0) throw new Error('mention KO');});
T5('openReview + setRv', function(){openReview('tomate');setRv(4);if(reviewRating!==4) throw new Error('setRv KO');document.getElementById('rv-txt').value='Très bon produit';});
T5('submitReview : ajout + persistance', function(){submitReview();var u=USER_REVIEWS.tomate;if(!u||!u.length) throw new Error('avis non ajouté');if(u[0].r!==4) throw new Error('note KO '+u[0].r);if(u[0].n!==profile.name) throw new Error('auteur KO');var sv=JSON.parse(localStorage.getItem('lm-reviews'));if(!sv||!sv.tomate||!sv.tomate.length) throw new Error('persistance KO');});
T5('avis utilisateur visible sur fiche', function(){renderProduct('tomate');var h=document.querySelector('#product-body').innerHTML;if(h.indexOf('Très bon produit')<0) throw new Error('avis absent du rendu');});
T5('moyenne recalculée après avis', function(){if(Math.abs(avgRating('tomate')-4)>1e-9) throw new Error('moyenne KO '+avgRating('tomate'));});

/* ==== LOT 5 — CODES PROMO ==== */
T5('promo : code vide refusé', function(){Object.keys(cart).forEach(k=>delete cart[k]);cart.ananas=1;promoCode='';document.getElementById('promo-input').value='';applyPromo();if(promoCode) throw new Error('code vide accepté');});
T5('promo : code inconnu refusé', function(){document.getElementById('promo-input').value='XX123';applyPromo();if(promoCode) throw new Error('code inconnu accepté');});
T5('promo BIENVENUE10 : -10 %', function(){document.getElementById('promo-input').value='bienvenue10';applyPromo();if(promoCode!=='BIENVENUE10') throw new Error('non appliqué : '+promoCode);if(Math.abs(discount().amt-0.45)>1e-9) throw new Error('remise KO '+discount().amt);if(Math.abs(fees()-4.9)>1e-9) throw new Error('frais KO sous promo pct');renderCart();});
T5('promo LIVRAISONOFFERTE : livraison à 0', function(){document.getElementById('promo-input').value='LIVRAISONOFFERTE';applyPromo();if(fees()!==0) throw new Error('frais attends 0, obtenu '+fees());if(discount().amt!==0) throw new Error('remise devrait être nulle');});
T5('promo LAGON5 plafonné au sous-total', function(){document.getElementById('promo-input').value='lagOn5';applyPromo();if(Math.abs(discount().amt-4.5)>1e-9) throw new Error('plafond KO '+discount().amt);renderCart();});
T5('rmPromo restaure les frais', function(){rmPromo();if(promoCode) throw new Error('code non retiré');if(Math.abs(fees()-4.9)>1e-9) throw new Error('frais attends 4,9, obtenu '+fees());});
T5('promo + panier vide : remise nulle', function(){promoCode='BIENVENUE10';Object.keys(cart).forEach(k=>delete cart[k]);if(discount().amt!==0) throw new Error('remise sur panier vide KO');});
T5('payNow applique la remise + note le code', function(){cart.ananas=1;if(Math.abs(fees()-4.9)>1e-9) throw new Error('setup frais KO');var b=orders.length;payNow();if(orders.length!==b+1) throw new Error('commande manquante');if(promoCode!=='') throw new Error('code non consommé');if(Math.abs(lastOrder.total-(4.5+4.9-0.45))>1e-9) throw new Error('total commande KO '+lastOrder.total);});

/* ==== LOT 5 — NOTIFICATIONS ==== */
T5('pushNotif ajoute en tête', function(){NOTIFS=[];pushNotif('🧪','Test notif','Corps du message');if(NOTIFS.length!==1||NOTIFS[0].t!=='Test notif') throw new Error('pushNotif KO');});
T5('plafond 15 notifications', function(){for(var i=0;i<30;i++)pushNotif('🧪','n'+i,'x');if(NOTIFS.length!==15) throw new Error('plafond KO '+NOTIFS.length);if(NOTIFS[0].t!=='n29') throw new Error('ordre KO : '+NOTIFS[0].t);});
T5('openNotifs marque lu + rendu vide', function(){NOTIFS=[];openNotifs();if(NOTIFS.length!==0) throw new Error('reset KO');document.getElementById('notifs-body').innerHTML='';});
T5('seedNotifs au démarrage (loadConfig)', function(){NOTIFS=[];loadConfig();if(NOTIFS.length<1) throw new Error('seed absent');if(NOTIFS[0].read!==false) throw new Error('badge attendu non lu');});
T5('compte : compteur non lues + carte', function(){goAccount();if(NOTIFS.filter(n=>!n.read).length<1) throw new Error('badge KO au rendu');});
T5('advanceTrack(2) -> notif livreur', function(){NOTIFS=[];lastOrder=orders.find(o=>o.status<4)||orders[0];trackStep=1;advanceTrack(2);if(NOTIFS.length!==1||NOTIFS[0].t.indexOf('livreur')<0) throw new Error('notif KO : '+(NOTIFS[0]&&NOTIFS[0].t));});
T5('refreshTrack jusqu’à livraison -> notif', function(){NOTIFS=[];trackStep=3;trackEta={mins:4,pos:60};refreshTrack();if(trackStep!==4) throw new Error('pas livré : step='+trackStep+' mins='+trackEta.mins);if(NOTIFS.length!==1||NOTIFS[0].t.indexOf('livrée')<0) throw new Error('notif livraison KO');});
T5('renderTrack + ETA dynamique', function(){trackStep=3;trackEta={mins:12,pos:55};renderTrack();});
T5('renderTrack livré : position finale', function(){trackStep=4;renderTrack();});

/* ==== LOT 4 repasse — initiales dynamiques ==== */
T5('compte : initiales dynamiques (JR figée aboli)', function(){goAccount();var h=document.querySelector('#account-body').innerHTML;if(h.indexOf(initialsOf(profile.name))<0) throw new Error('initiales KO');if(h.indexOf(profile.name)<0) throw new Error('nom KO');if(h.indexOf('>JR<')>=0) throw new Error('avatar figé encore présent');});
T5('profil édité -> initiales suivent', function(){profile.name='Jean René Pailloux';goAccount();var h=document.querySelector('#account-body').innerHTML;if(h.indexOf('>JR<')<0) throw new Error('initiales JR attendues');profile.name='Marie R.';goAccount();});

results.forEach(r=>console.log(r));
console.log('--- RÉSUMÉ : '+results.filter(r=>r.indexOf('PASS')===0).length+' PASS · '+results.filter(r=>r.indexOf('FAIL')===0).length+' FAIL');
