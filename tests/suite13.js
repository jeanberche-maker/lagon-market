/* ---- Suite de tests Lot 13 — i18n FR/EN ---- */
var results=[];
function T13(name,fn){try{fn();results.push('PASS '+name);}catch(e){results.push('FAIL '+name+' -> '+(e&&e.message||e));}}
function withEn(fn){var old=LANG;LANG='en';try{fn();}finally{LANG=old;}}

/* ==== cœur ==== */
T13('t/trExact : FR par défaut (inchangé)', function(){ var old=LANG;LANG='fr';try{ if(trText('Panier')!=='Panier') throw new Error('fr modifié'); }finally{LANG=old;} });
T13('trExact : traduction exacte en EN', function(){ withEn(function(){ if(trText('Panier')!=='Cart') throw new Error(trText('Panier')); if(trText('Voir les paniers')!=='See the baskets') throw new Error('bannière KO'); }); });
T13('trExact : clé inconnue → texte source inchangé', function(){ withEn(function(){ if(trText('Chaîne inexistante XYZ')!=='Chaîne inexistante XYZ') throw new Error('fallback KO'); }); });
T13('trText : whitespace préservé', function(){ withEn(function(){ var r=trText('  Panier  '); if(r!=='  Cart  ') throw new Error(JSON.stringify(r)); }); });
T13('trText : idempotent (texte EN re-traduit = identique)', function(){ withEn(function(){ var a=trText('Paniers prêts à livrer'); if(trText(a)!==a) throw new Error(a+' -> '+trText(a)); }); });

/* ==== phrases interpolées ==== */
T13('pattern : stock faible', function(){ withEn(function(){ if(trText('Plus que 3 en stock')!=='Only 3 left') throw new Error(trText('Plus que 3 en stock')); }); });
T13('pattern : compteur produits', function(){ withEn(function(){ if(trText('48 produits')!=='48 products') throw new Error('48'); if(trText('Voir 24 produits')!=='View 24 products') throw new Error('voir 24'); }); });
T13('pattern : livraison offerte à portée', function(){ withEn(function(){ if(trText('Encore 12,00 € pour la livraison offerte')!=='12,00 € more for free delivery') throw new Error('encore'); }); });
T13('pattern : ajout au panier (nom interpolé)', function(){ withEn(function(){ if(trText('Mangue Judy ajouté au panier')!=='Mangue Judy added to cart') throw new Error('toast'); }); });
T13('pattern : origine + tri', function(){ withEn(function(){ if(trText('Origine : Verger du Sud.')!=='Origin: Verger du Sud.') throw new Error('origine'); if(trText('Trier : pertinence')!=='Sort: relevance') throw new Error('tri'); }); });
T13('pattern : ETA livreur', function(){ withEn(function(){ if(trText('Livreur à 35 min')!=='Driver in 35 min') throw new Error('35'); if(trText('Arrivée estimée : dans 27 min')!=='Estimated arrival: in 27 min') throw new Error('eta'); }); });
T13('pattern : créneau traduit (Aujourd’hui/Demain/Samedi)', function(){ withEn(function(){ if(trText('Demain, 8 h – 10 h')!=='Tomorrow, 8 am – 10 am') throw new Error(trText('Demain, 8 h – 10 h')); if(trText('Samedi, 9 h – 11 h')!=='Saturday, 9 am – 11 am') throw new Error('samedi'); }); });
T13('pattern : commande + statut push banner', function(){ withEn(function(){ if(trText('Commande #1037 — Commande confirmée')!=='Order #1037 — Order confirmed') throw new Error(trText('Commande #1037 — Commande confirmée')); }); });
T13('pattern : réordonnance avec rupture ignorée', function(){ withEn(function(){ var r=trText('3 articles réordonnés · 1 en rupture ignoré'); if(r!=='3 items reordered · 1 out of stock skipped') throw new Error(r); }); });
T13('pattern : barre d\'action fiche (total interpolé)', function(){ withEn(function(){ if(trText('Ajouter au panier · 4,50 €')!=='Add to cart · 4,50 €') throw new Error('pbar'); if(trText('Ajouter tout au panier · 34,00 €')!=='Add all to cart · 34,00 €') throw new Error('basket'); }); });
T13('pattern : X l\'unité (panier)', function(){ withEn(function(){ if(trText('9,00 € l\'unité')!=='9,00 € each') throw new Error('unité'); }); });

/* ==== composites « · » ==== */
T13('composite : segments traduits séparément', function(){ withEn(function(){ var r=trText('5 articles · Demain, 8 h – 10 h · Villa Azur'); if(r!=='5 items · Tomorrow, 8 am – 10 am · Villa Azur') throw new Error(r); }); });

/* ==== données couvertes par le dictionnaire ==== */
T13('dictionnaire : nom + format + description de chaque produit', function(){ withEn(function(){
  var unit=/^[0-9~.,\sx×Lkgcl]+$/;
  P.forEach(function(p){
    if(trExact(p.n)===p.n) throw new Error('nom non traduit : '+p.id);
    if(trExact(p.f)===p.f&&!unit.test(p.f)) throw new Error('format non traduit : '+p.id+' ('+p.f+')');
    if(p.d&&trExact(p.d)===p.d) throw new Error('description non traduite : '+p.id);
  });
}); });
T13('dictionnaire : badges (tous ceux utilisés + Rupture)', function(){ withEn(function(){
  var bs=['Frais du jour','Bio','Importé','Sans gluten','Nouveau','Rupture','Rupture de stock'];
  bs.forEach(function(b){ if(trExact(b)===b) throw new Error('badge non traduit : '+b); });
  P.forEach(function(p){ (p.bd||[]).forEach(function(b){ if(trExact(b)===b) throw new Error(p.id+' badge '+b); }); });
}); });
T13('dictionnaire : catégories et sous-rayons', function(){ withEn(function(){
  CATS.forEach(function(c){ if(trExact(c.t)===c.t) throw new Error('cat : '+c.id); });
  Object.keys(SUBS).forEach(function(k){ SUBS[k].forEach(function(s){ if(trExact(s)===s) throw new Error('sub : '+k+'/'+s); }); });
}); });
T13('dictionnaire : paniers (titre + sous-titre)', function(){ withEn(function(){
  BASKETS.forEach(function(k){
    if(!Object.prototype.hasOwnProperty.call(EN_DICT,k.t)) throw new Error('basket : '+k.id);
    if(trExact(k.s)===k.s) throw new Error('basket sub : '+k.id);
  });
}); });
T13('dictionnaire : créneaux par défaut + sous-titres', function(){ withEn(function(){
  DEFAULT_SLOTS.forEach(function(s){ if(trExact(s.t)===s.t) throw new Error('slot : '+s.t); if(s.s&&trExact(s.s)===s.s) throw new Error('slot sub : '+s.t); });
}); });
T13('dictionnaire : moyens de paiement', function(){ withEn(function(){
  PAYS.forEach(function(m){
    if(!Object.prototype.hasOwnProperty.call(EN_DICT,m.t)) throw new Error('pay : '+m.t);
    if(trExact(m.s)===m.s) throw new Error('pay sub : '+m.t);
  });
}); });
T13('dictionnaire : zones (textes + horaires + ouvertures)', function(){ withEn(function(){
  ZONES.forEach(function(z){
    if(z.s&&trExact(z.s)===z.s) throw new Error('zone sub : '+z.t);
    if(z.ok){ if(trExact(z.nfo)===z.nfo) throw new Error('zone nfo : '+z.t); if(trExact('Couvert')!=='Covered') throw new Error('tag couvert'); }
    else { if(trExact(z.when)===z.when&&z.when!=='2026') throw new Error('zone when : '+z.t); if(trExact('Bientôt')!=='Soon') throw new Error('tag bientôt'); }
  });
}); });
T13('dictionnaire : FAQ complète', function(){ withEn(function(){
  FAQ.forEach(function(f){ if(trExact(f.q)===f.q) throw new Error('faq q : '+f.q); if(trExact(f.a)===f.a) throw new Error('faq a : '+f.q); });
}); });
T13('dictionnaire : libellés promos', function(){ withEn(function(){
  Object.keys(PROMOS).forEach(function(k){ if(trExact(PROMOS[k].label)===PROMOS[k].label) throw new Error('promo : '+k); });
}); });
T13('dictionnaire : étapes de suivi', function(){ withEn(function(){
  TRACK_STEPS.forEach(function(s){ if(trExact(s)===s) throw new Error('étape : '+s); });
}); });

/* ==== helpers produit ==== */
T13('pn/pf/pd : repli FR si pas de traduction', function(){ var fake={n:'Produit local X',f:'1 lot',d:'Récolté ce matin.',g:['#fff','#000'],e:'🍋'}; withEn(function(){ if(pn(fake)!=='Produit local X') throw new Error('pn repli'); if(pf(fake)!=='1 lot') throw new Error('pf repli'); if(pd(fake)!=='Récolté ce matin.') throw new Error('pd repli'); }); });
T13('pn/pf : traduits en EN pour un produit du catalogue', function(){ withEn(function(){ var p=prod('ananas'); if(pn(p)==='Ananas Victoria') throw new Error('pn EN'); if(pf(p)==='pièce ~1,2 kg') throw new Error('pf EN'); }); });
T13('pn : identique en FR', function(){ var p=prod('ananas'); if(pn(p)!=='Ananas Victoria') throw new Error('fr KO'); });

/* ==== rendu ==== */
T13('pcard : nom traduit en EN dans le HTML rendu', function(){ withEn(function(){ var h=pcard(prod('tomate')); if(h.indexOf('Vine tomatoes')<0) throw new Error('nom EN absent'); if(h.indexOf('Tomates grappe')>=0) throw new Error('nom FR encore présent'); }); });
T13('fiche : description traduite même tronquée (Lire la suite)', function(){ withEn(function(){ renderProduct('ananas'); var h=document.getElementById('product-body').innerHTML; if(h.indexOf('Full Saint-Martin sunshine')<0) throw new Error('desc EN absente'); }); });
T13('paramétrage : sélecteur Langue présent (FR/EN)', function(){
  renderSettings();
  var h=document.getElementById('settings-body').innerHTML;
  if(h.indexOf('Langue · Language')<0||h.indexOf("setLang('en')")<0||h.indexOf("setLang('fr')")<0) throw new Error('sélecteur absent');
});
T13('setLang : bascule + persistance lm-config + retour FR', function(){
  setLang('en'); if(LANG!=='en') throw new Error('lang KO');
  var c=JSON.parse(localStorage.getItem('lm-config')); if(c.lang!=='en') throw new Error('persistance KO');
  withEn(function(){ if(trText('Livraison')!=='Delivery') throw new Error('tr KO'); });
  setLang('fr'); if(LANG!=='fr') throw new Error('retour KO');
  var c2=JSON.parse(localStorage.getItem('lm-config')); if(c2.lang!=='fr') throw new Error('persistance retour KO');
});
T13('setLang : conserve les autres réglages (fee/free/wa)', function(){
  try{localStorage.setItem('lm-config',JSON.stringify({fee:6.5,free:70,wa:'590123456'}));}catch(e){}
  setLang('en');setLang('fr');
  var c=JSON.parse(localStorage.getItem('lm-config'));
  if(c.fee!==6.5||c.free!==70||c.wa!=='590123456') throw new Error(JSON.stringify(c));
  try{localStorage.removeItem('lm-config');}catch(e){}
});
T13('RAW_HTML : MutationObserver gardé + traduction au démarrage', function(){
  if(RAW_HTML.indexOf('MutationObserver')<0) throw new Error('observer absent');
  if(RAW_HTML.indexOf("if(LANG==='en')trTree(document.body)")<0) throw new Error('démarrage EN absent');
});

results.forEach(r=>console.log(r));
console.log('--- RÉSUMÉ-L13 : '+results.filter(r=>r.indexOf('PASS')===0).length+' PASS · '+results.filter(r=>r.indexOf('FAIL')===0).length+' FAIL');
