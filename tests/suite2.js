/* ---- Lot 2 ---- */
function T2(name,fn){try{fn();results.push('PASS '+name);}catch(e){results.push('FAIL '+name+' -> '+(e&&e.message||e));}}
T2('panier vide', function(){ Object.keys(cart).forEach(k=>delete cart[k]); renderCart(); });
T2('ajout panier -> totaux', function(){ cart.ananas=1; cart.brie=1; if(Math.abs(cartTotal()-10.4)>1e-9) throw new Error('total KO '+cartTotal()); if(Math.abs(fees()-4.9)>1e-9) throw new Error('frais KO '+fees()); renderCart(); });
T2('livraison offerte dès 60 €', function(){ cart.entrecote=6; if(fees()!==0) throw new Error('frais attends 0, obtenu '+fees()); delete cart.entrecote; renderCart(); });
T2('renderDelivery + pickSlot', function(){ goDelivery(); pickSlot(3); });
T2('livraison hors zone', function(){ pickAddr('cul'); goDelivery(); slotsOk(); pickAddr('azur'); });
T2('renderPay récap + méthodes', function(){ goPay(); pickPay(1); pickPay(0); });
T2('payNow vide le panier + succès', function(){ cart.ananas=2; renderPay(); payNow(); if(cartCount()!==0) throw new Error('panier non vidé'); renderPay(true); backHome(); });
T2('syncPbar hors fiche (garde null)', function(){ syncPbar(prod('ananas')); });
T2('flux complet : fiche -> panier -> livraison -> paiement', function(){ addToCart('rose'); uCard('ananas',-1,null); goCart(); goDelivery(); pickSlot(1); goPay(); payNow(); backHome(); });
T2('badge "Voir le panier" câblé', function(){ uCard('oeufs',1,null); delete cart.oeufs; });
console.log(results.join('\n'));
