/* ---- Suite de tests Lot 11 — carte réelle (Leaflet + repli) ---- */
var results=[];
function T11(name,fn){try{fn();results.push('PASS '+name);}catch(e){results.push('FAIL '+name+' -> '+(e&&e.message||e));}}

/* ==== données géo ==== */
T11('TRACK_ROUTE : tracé boutique -> villa (3 segments min)', function(){ if(!Array.isArray(TRACK_ROUTE)||TRACK_ROUTE.length<3) throw new Error('tracé trop court'); if(TRACK_ROUTE[0]!==TRACK_SHOP||TRACK_ROUTE[TRACK_ROUTE.length-1]!==TRACK_HOME) throw new Error('extrémités KO'); });
T11('coordonnées plausibles pour Saint-Martin', function(){ var ok=function(p){return p.lat>17.99&&p.lat<18.13&&p.lng>-63.13&&p.lng<-62.99;}; if(!ok(TRACK_SHOP)||!ok(TRACK_HOME)) throw new Error('track hors Sant-Martin'); Object.keys(ZONE_POLYS).forEach(function(k){ ZONE_POLYS[k].forEach(function(c){ if(!ok({lat:c[0],lng:c[1]})) throw new Error('zone '+k+' hors île'); }); }); });
T11('ZONE_POLYS : couvre les 6 zones affichées', function(){ if(Object.keys(ZONE_POLYS).length!==ZONES.length) throw new Error(Object.keys(ZONE_POLYS).length+' polygones pour '+ZONES.length+' zones'); });

/* ==== maths du pin (exécutables sans Leaflet) ==== */
T11('posToT : bornes 22 % -> 0, 88 % -> 1', function(){ if(posToT(22)!==0) throw new Error(posToT(22)); if(posToT(88)!==1) throw new Error(posToT(88)); if(posToT(55)!==0.5) throw new Error('55 : '+posToT(55)); });
T11('posToT : clamp hors bornes', function(){ if(posToT(5)!==0||posToT(95)!==1||posToT(-20)!==0) throw new Error('clamp KO'); });
T11('interAlong : départs et arrivée exacts', function(){ var a=interAlong(TRACK_ROUTE,0), z=interAlong(TRACK_ROUTE,1); if(a.lat!==TRACK_SHOP.lat||a.lng!==TRACK_SHOP.lng) throw new Error('départ KO'); if(z.lat!==TRACK_HOME.lat) throw new Error('arrivée KO'); });
T11('interAlong : milieu = midpoint (2 points)', function(){ var m=interAlong([{lat:1,lng:1},{lat:3,lng:5}],0.5); if(Math.abs(m.lat-2)>1e-9||Math.abs(m.lng-3)>1e-9) throw new Error(JSON.stringify(m)); });
T11('interAlong : progression monotone', function(){ var prev=0; [0.2,0.4,0.6,0.8].forEach(function(t){ var p=interAlong(TRACK_ROUTE,t); if(p.lat<=prev) throw new Error('non monotone à t='+t); prev=p.lat; }); });
T11('interAlong : cas dégénérés (null / point unique)', function(){ if(interAlong(null,0.5)!==null) throw new Error('null KO'); var one=interAlong([{lat:5,lng:5}],0.99); if(one.lat!==5) throw new Error('point unique KO'); if(interAlong([],0.5)!==null) throw new Error('vide KO'); });

/* ==== guards sans Leaflet (harnais JXA) ==== */
T11('mountRealMap/mountZonesMap : inoffensifs sans L', function(){ mountRealMap(); mountZonesMap(); });
T11('renderTrack : carte fake + overlay #lmap présents', function(){ renderTrack(); var h=document.getElementById('track-body').innerHTML; if(h.indexOf('id="lmap"')<0) throw new Error('overlay lmap absent'); if(h.indexOf('linear-gradient')<0) throw new Error('repli stylisé absent'); });
T11('renderZones : conteneur #zmap présent', function(){ renderZones(); if(document.getElementById('zones-body').innerHTML.indexOf('id="zmap"')<0) throw new Error('zmap absent'); });
T11('head : Leaflet CDN + tuiles OSM + attribution', function(){ if(RAW_HTML.indexOf('cdn.jsdelivr.net/npm/leaflet')<0) throw new Error('CDN Leaflet absent'); if(RAW_HTML.indexOf('tile.openstreetmap.org')<0) throw new Error('tuiles OSM absentes'); if(RAW_HTML.indexOf('OpenStreetMap')<0) throw new Error('attribution manquante'); });
T11('moveTrackPin : enchâssé dans refreshTrack (pas de régression ETA)', function(){ document.getElementById('lmap')/* warm */; trackStep=3;trackEta={mins:30,pos:40};var m0=trackEta.mins; refreshTrack(); if(trackEta.mins>=m0) throw new Error('ETA n\'a pas baissé'); if(trackEta.pos<=40) throw new Error('pos non avancée'); });

results.forEach(r=>console.log(r));
console.log('--- RÉSUMÉ-L11 : '+results.filter(r=>r.indexOf('PASS')===0).length+' PASS · '+results.filter(r=>r.indexOf('FAIL')===0).length+' FAIL');
