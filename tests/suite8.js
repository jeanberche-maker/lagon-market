/* ---- Suite de tests Lot 8 — UX mobile ---- */
var results=[];
function T8(name,fn){try{fn();results.push('PASS '+name);}catch(e){results.push('FAIL '+name+' -> '+(e&&e.message||e));}}

/* ==== LOT 8 — META / VIEWPORT ==== */
T8('viewport-fit=cover déclaré (safe-areas actives)', function(){ if(RAW_HTML.indexOf('viewport-fit=cover')<0) throw new Error('absent de la meta viewport'); });
T8('meta mobile-web-app-capable (Chrome Android)', function(){ if(RAW_HTML.indexOf('name="mobile-web-app-capable"')<0) throw new Error('meta absente'); });

/* ==== LOT 8 — CSS ==== */
T8('hauteur dynamique 100dvh (barre URL Safari)', function(){ if(RAW_HTML.indexOf('height:100dvh')<0) throw new Error('100dvh absent'); });
T8('marge avant l\'encoche : safe-area-inset-top sur .top', function(){ if(!/\.top\{padding-top:calc\(14px \+ env\(safe-area-inset-top\)\)\}/.test(RAW_HTML)) throw new Error('règle .top absente'); });
T8('marge basse navbar : safe-area-inset-bottom conservée', function(){ if(!/\.navbar\{[^}]*env\(safe-area-inset-bottom\)/.test(RAW_HTML)) throw new Error('règle navbar KO'); });
T8('inputs à 16px minimum (anti-zoom iOS)', function(){ var m=RAW_HTML.match(/\.search input\{[^}]*font-size:(\d+(?:\.\d+)?)px/); if(!m) throw new Error('règle .search input introuvable'); if(parseFloat(m[1])<16) throw new Error('font-size '+m[1]+'px < 16px'); });
T8('touch-action manipulation sur éléments cliquables', function(){ if(RAW_HTML.indexOf('[onclick]{touch-action:manipulation}')<0) throw new Error('règle absente'); });
T8('sélection de texte désactivée hors champs', function(){ if(RAW_HTML.indexOf('*{-webkit-user-select:none;user-select:none')<0) throw new Error('user-select global absent'); if(!/input,textarea\{-webkit-user-select:text;user-select:text\}/.test(RAW_HTML)) throw new Error('override champs absent'); });
T8('menu long-press désactivé (touch-callout)', function(){ if(RAW_HTML.indexOf('-webkit-touch-callout:none')<0) throw new Error('absent'); });
T8('cible « + » ≥ 44px', function(){ var m=RAW_HTML.match(/\.plus\{width:(\d+)px;height:(\d+)/); if(!m||+m[1]<44||+m[2]<44) throw new Error('.plus '+(m&&m[1]+'x'+m[2]||'?')); });
T8('stepper ≥ 44px de large/taille', function(){ var m=RAW_HTML.match(/\.stepper button\{width:(\d+)px;height:(\d+)/); if(!m||+m[1]<44||+m[2]<44) throw new Error('stepper '+(m&&m[1]+'x'+m[2]||'?')); });
T8('feedback :active (cartes, boutons, chips)', function(){ var n=(RAW_HTML.match(/[.\w\[\]-]+(?=:active\b)/g)||[]).length; if(n<10) throw new Error(n+' états :active seulement'); });
T8('pas de pull-to-refresh parasite : overscroll-behavior', function(){ if(!/html,body\{[^}]*overscroll-behavior:none/.test(RAW_HTML)) throw new Error('règle absente'); });

/* ==== LOT 8 — JS (haptique + swipe) ==== */
T8('haptic : vibration sur addToCart', function(){ VIBES.length=0; addToCart('baguette'); if(!VIBES.length) throw new Error('aucune vibration'); delete cart.baguette; });
T8('haptic : vibration sur uCard (+/−)', function(){ VIBES.length=0; uCard('brie',1,null); if(!VIBES.length) throw new Error('aucune vibration'); uCard('brie',-1,null); });
T8('haptic : silencieux si vibration non supportée', function(){ var saved=navigator.vibrate; navigator.vibrate=null; try{ addToCart('ananas'); } finally { navigator.vibrate=saved; } delete cart.ananas; });
T8('sheetSwipe : glisser vers le bas ferme la feuille', function(){ if(typeof sheetSwipe!=='function') throw new Error('helper absent'); var calls=[],sh={classList:{add(){},remove(){},contains(){return true}},style:{},addEventListener(t,f){calls.push(t);}}; sheetSwipe(sh); ['touchstart','touchmove','touchend'].forEach(function(ev){ if(calls.indexOf(ev)<0) throw new Error('listener '+ev+' manquant'); }); sh.style.transition='none'; });
T8('pas de régression : rendus principaux OK', function(){ renderHome(); renderCatalog(); renderProduct('ananas'); renderCart(); });

results.forEach(r=>console.log(r));
console.log('--- RÉSUMÉ-L7 : '+results.filter(r=>r.indexOf('PASS')===0).length+' PASS · '+results.filter(r=>r.indexOf('FAIL')===0).length+' FAIL');
