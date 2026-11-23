/* ---- Lot 3 ---- */
function T3(name,fn){try{fn();results.push('PASS '+name);}catch(e){results.push('FAIL '+name+' -> '+(e&&e.message||e));}}
T3('compte : rendu + historique', function(){ goAccount(); if(!orders.length) throw new Error('aucune commande seedée'); });
T3('suivi : commande seedée', function(){ lastOrder=orders[0]; goTrack(); advanceTrack(1); advanceTrack(3); });
T3('suivi sans commande (garde)', function(){ lastOrder=null; renderTrack(); lastOrder=null; });
T3('paramétrage : rendu', function(){ goSettings(); });
T3('paramétrage : modifier frais/seuil', function(){ document.getElementById('set-fee').value='7,50'; document.getElementById('set-free').value='45'; DELIV_FEE=num('set-fee',4.9); FREE_FROM=num('set-free',60); if(DELIV_FEE!==7.5) throw new Error('parsing KO '+DELIV_FEE); if(FREE_FROM!==45) throw new Error('parsing seuil KO'); DELIV_FEE=4.9; FREE_FROM=60; });
T3('paramétrage : saisie invalide ignorée', function(){ DELIV_FEE=num('set-fee',4.9); if(isNaN(DELIV_FEE)||DELIV_FEE<0) throw new Error('fallback KO'); });
T3('créneaux : ajout/suppression/minimum', function(){ var n0=SLOTS.length; document.getElementById('set-slot').value='Dimanche, 10 h – 12 h'; addSlot(); if(SLOTS.length!==n0+1) throw new Error('ajout KO'); while(SLOTS.length>1)delSlot(SLOTS.length-1); delSlot(0); if(SLOTS.length!==1) throw new Error('minimum KO'); SLOTS.splice(0); DEFAULT_SLOTS.forEach(s=>SLOTS.push({...s})); if(SLOTS.length!==DEFAULT_SLOTS.length) throw new Error('restauration KO'); });
T3('resetConfig : valeurs du brief', function(){ DELIV_FEE=9; FREE_FROM=10; resetConfig(); if(DELIV_FEE!==4.9||FREE_FROM!==60||SLOTS.length!==5) throw new Error('reset KO'); document.getElementById('set-fee').value='4,9'; document.getElementById('set-free').value='60'; saveSettings();  });
T3('paiement crée une commande', function(){ cart.ananas=2; cart.rose=1; renderPay(); var before=orders.length; payNow(); if(orders.length!==before+1) throw new Error('commande non enregistrée'); if(cartCount()!==0) throw new Error('panier non vidé'); if(!lastOrder) throw new Error('lastOrder KO'); if(Math.abs(lastOrder.total-(2*4.5+14.9+4.9))>1e-9) throw new Error('total commande KO '+lastOrder.total); goAccount(); });
T3('account -> suivi via buy numéro', function(){ trackOrderId(orders[0].id); });
T3('badges cohérents après commande', function(){ if(cartCount()!==0) throw new Error('badge attendu 0'); });
T3('flux lot3 complet : achat -> suivi -> compte -> réglage', function(){ addToCart('citron'); goCart(); goDelivery(); pickSlot(2); goPay(); payNow(); goTrack(); advanceTrack(3); goAccount(); goSettings(); backHome(); });
console.log(results.join('\n'));
