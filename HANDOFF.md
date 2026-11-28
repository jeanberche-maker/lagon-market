# HANDOFF.md — Passation projet « Lagon Market » (à coller à un assistant IA)

> Document d'handoff : l'état exact du prototype après 11 lots de développement.
> À fournir tel quel à un assistant (Claude ou autre) pour poursuivre le travail.

## 1. Le projet en une phrase

Prototype cliquable d'une app mobile de livraison de courses à Orient Bay (Saint-Martin), en un seul fichier `index.html` (~1 600 lignes, vanilla JS + CSS custom, aucun framework, aucune dépendance build). Sert de spécification interactive avant développement réel.

## 2. Arborescence

```text
untitled folder/
├── index.html              ← tout le prototype (HTML + CSS + JS)
├── README.md               ← documentation par lot + déploiement
├── HANDOFF.md              ← ce document
├── manifest.json / sw.js / icons/  ← PWA installable
├── .github/workflows/test.yml      ← CI (runner macOS, rejoue les tests)
└── tests/                  ← stub DOM + suites (build.sh, run.sh)
```

## 3. Design system (figé, à respecter)

| Élément | Règle |
|---|---|
| Titres | Fraunces (serif, Google Fonts, fallback local) |
| Texte | Manrope (fallback system-ui) |
| Couleur d'action | lagon `--lagon:#0FA3A3` (foncé `#0B7E7E`) |
| Accent / alertes | corail `#FF6F61` (badge panier), ambre `#E8A13D` + `--ambre-soft` (stock faible, hors zone, « bientôt ») |
| Succès / stock ok | vert `--vert:#2E9E5B` |
| Fond | `#FAF7F2` |
| Règles | une seule action principale par écran ; zones tactiles ≥ 44 px ; stepper « − » devient 🗑 à quantité 1 ; quantité plafonnée au stock |
| Images | emoji + gradients CSS (aucune vraie photo, aucun asset) |

## 4. Fonctionnalités par écran (état réel du code)

### Accueil (`s-home`)
- En-tête : logo, adresse sélectionnable (feuille d'adresses), panier + badge corail.
- **Bandeau push « commande en cours »** (Lot 6) : carte lagon en haut — « Commande #1030 — Confirmée / Préparation / Livreur à X min » (ETA dynamique), tap → suivi, ✕ ferme (`homePushDismissed`, réarmé à chaque commande).
- **Barre de recherche vivante** (Lot 7) : suggestions en direct (≤ 5, produit/marque/format, insensibles aux accents via `noAcc()`), tap → fiche ; Entrée → mode recherche catalogue.
- Bannière « Arrivée Villa » (1 CTA), paniers prêts à livrer (BASKETS × 6), **section « Vos favoris »** masquée si vide, rangées : Sélection / Frais / Nouveautés, grille catégories (CATS × 8).
- États : skeletons, erreur réseau avec bandeau « Réessayer », hors-zone ambre, sections masquées si vides.
- Molette de démo ⚙ (bord gauche) : pilote les états alternatifs.

### Catalogue (`s-catalog`)
- Sous-catégories chips, filtre (feuille : 4 tranches de prix, dispo, marques, bio, sans gluten, végétarien, promo ; bouton avec compte en direct), tri (pertinence, prix ↑/↓, nouveautés), tags actifs supprimables + « Tout effacer ».
- Grille 2 colonnes, badges, « + » → stepper sur place, rupture → « Me prévenir », cœur favori sur chaque carte.
- **Mode recherche** (Lot 7) : titre « Recherche : « … » », chip « ✕ Effacer la recherche », tag de requête supprimable, filtres/tris actifs, état vide dédié.

### Fiche produit (`s-product`)
- Grande photo (points de pagination), badges, nom/marque/format, prix + prix au kilo, stock (vert / ambre « Plus que 3 » / rupture).
- Description avec « Lire la suite », **avis clients** (Lot 5) : moyenne étoilée format fr (« 4,7 · 3 avis »), 2 avis visibles, feuille d'évaluation 5 étoiles tapables + commentaire, publication en tête, persistance `lm-reviews`.
- Cœur favori, WhatsApp conseil, barre fixe (stepper + « Ajouter au panier · total »), remplacements suggérés (mixte : auto par catégorie + manuel), hors-zone → feuille « Changer d'adresse ».

### Panier / Livraison / Paiement (`s-cart`, `s-delivery`, `s-pay`)
- Panier : lignes article avec stepper, **bloc code promo** (Lot 5) : `BIENVENUE10` (−10 %), `LAGON5` (−5 € plafonné au sous-total), `LIVRAISONOFFERTE` (livraison gratuite) ; ligne de remise verte propagée partout (panier → barre livraison → récap paiement → montant de la commande ; code consommé au paiement).
- Livraison : adresses (3, dont 1 hors-zone), 5 créneaux éditables en Paramétrage, note livreur.
- Paiement : 3 moyens, CTA « Payer X € » → confirmation + panier vidé ; `lastOrder.items` enregistré.

### Suivi (`s-track`)
- Carte, 4 étapes (tap = prévisualisation), **ETA dynamique** (Lot 4) : bouton « ↻ Actualiser la position » → −4 à −7 min, pin 📍 glisse 22 % → 88 %, « Livrée » auto à 0 min ; notifs poussées aux étapes clés.

### Compte / Paramétrage (`s-account`, `s-settings`)
- Profil (initiales dynamiques, éditable, `lm-profile`), **notifications** (badge corail « X nouvelles », lu à l'ouverture, plafond 15, `pushNotif()`), **« ↻ Réordonner »** par commande (Lot 6 : cumul au panier, plafonné stock, ruptures sautées), historique persisté, adresses, WhatsApp, déconnexion.
- Paramétrage modifiable + persisté (`lm-config`) : frais (4,90 €), seuil gratuit (60 €), WhatsApp, créneaux (ajout/suppression, min 1) ; « Restaurer » ; **« 🎬 Revoir l'introduction »**.

### Écran Zones (`s-zones`, Lot 7)
- Couvertes : Orient Bay, Cul de Sac, Anse Marcel (infos livraison) ; Bientôt : Grand-Case, Marigot, Philipsburg. Accessible depuis bannière accueil, feuilles hors-zone et adresses.

### Onboarding (overlay, Lot 7)
- 3 slides pleine page au premier lancement, flag `lm-onboarded`, rejouable via Paramétrage.

## 5. Modèle de données clé

```js
P          // produits : {id,n,b,f,pr,u,e,g,cat,sub,bd,st,d,promo?}
BASKETS    // paniers prêts : {id,t,s,pr,e,g,it:[ids]}
CATS, SUBS // catégories / sous-catégories
ADDRESSES  // {id,t,s,ok} — ok:false = hors zone
orders     // commandes : {id,n,total,slot,addr,when,status(1-4),promo,items:[{id,q}]}
SLOTS      // créneaux éditables
PROMOS     // {BIENVENUE10:{type:'pct',v:10}, LAGON5:{type:'eur',v:5}, LIVRAISONOFFERTE:{type:'ship'}}
SEED_REVIEWS / USER_REVIEWS  // avis
FAVS, NOTIFS, trackEta{mins,pos}, demo{home,catalog,product}
```

Persistance localStorage : `lm-config`, `lm-orders` (8 max), `lm-profile`, `lm-reviews`, `lm-favs`, `lm-onboarded`.
Écrans pilotés par `go(id)` + `openSheet()/closeSheets()` ; feuilles : `sheet-addr, basket, filter, sort, zone, profile, assist, logout, review, notifs`.

## 6. Décisions produit tranchées (ne pas rouvrir)

1. **Devise : euros (€)**, format français (`6,20 €`), prix/kg en secondaire.
2. **Remplacements : mixte** — auto par catégorie, affiné manuellement (`pinnedReplacement` prévu côté API).
3. **Paramètres modulation** : frais, seuil de gratuité, WhatsApp, créneaux — éditables et persistés.
4. Notifs : fictives, simulation locale, plafond 15.
5. Règlement encaissé seulement après livraison réussie (sémantique affichée).
6. **Lot 8 — UX mobile** (`index.html`) :
   - meta viewport `viewport-fit=cover` + `.top{padding-top:calc(14px + env(safe-area-inset-top))}` en mobile → contenu jamais sous l'encoche en PWA standalone (status bar `black-translucent`) ;
   - `height:100dvh` (fallback `100vh`) sur `.phone` en mobile → plus de décalage avec la barre d'URL Safari ;
   - inputs `.search` à **16px** → iOS ne zoome plus l'écran au focus ;
   - cibles élargies : `.plus` et `.stepper` à 44px (règle des 44px respectée partout) ;
   - `touch-action:manipulation` sur les éléments cliquables (pas de délai de 300 ms ni de double-tap zoom) ;
   - `user-select:none` global (:text sur les champs) + `-webkit-touch-callout:none` (pas de menu long-press) ;
   - feedback immédiat : `:active` avec `scale(.97)` sur cartes/boutons/chips, `opacity` sur icones/nav ;
   - **haptique** : `haptic(ms)` (guard `typeof navigator`) vibre sur addToCart/uCard — silencieux si non supporté ;
   - **feuilles fermer-par-glissement** : `sheetSwipe()` — glisser ≥ 90 px vers le bas sur l'en-tête ferme la feuille (le scroll interne `.sh-in` n'est pas intercepté) ;
   - `overscroll-behavior:none` sur html/body → pas de pull-to-refresh parasite ;
   - meta `mobile-web-app-capable` pour Chrome Android.
   - Tests : `tests/suite8.js` (18 tests) + harnais enrichi — `build.sh` expose le HTML brut dans la variable globale `RAW_HTML` (assertions CSS/meta possibles) et le stub fournit un `navigator.vibrate` espion (`VIBES`).

7. **Lot 9 — catalogue vivant** (`index.html` + `products.json` + `sw.js`) :
   - `P` est passé en `let` : la liste produits est **remplaçable à chaud** ;
   - `products.json` à la racine (19 produits, générés depuis les données embarquées) = source canonique, éditable sur github.com sans build ;
   - chaînage de repli : **réseau → cache `lm-catalog` → données embarquées** ; jamais d'écran vide ;
   - fonctions : `parseCatalog` (validation : array non vide, chaque produit requiert `id`, `n`, `pr` numérique), `mergeCatalog` (remplace `P`, persiste `lm-catalog` + `lm-catalog-ts`, rejoue renders : home/catalog/cart/badges + fiche ouverte via `openPid`, retourne `true` si contenu inchangé), `catalogStale` (TTL `CAT_TTL` = 5 min), `refreshCatalog(force)` (anti-rebond TTL, cache-buster `?maj=`, toast « Catalogue mis à jour » seulement si le contenu a changé), `initCatalog` (applique le cache au démarrage, tolère un cache corrompu) ;
   - périodicité : timer `setInterval(CAT_TTL)` + `visibilitychange` (si périmé) ; `catalogFetcher` injectable (fallbacks : `typeof fetch` ; absent en JXA → no-op silencieux) ;
   - `sw.js` v2 : **network-first pour `products.json`** (le catalogue ne reste jamais figé en cache), cache-first inchangé pour l'app shell ;
   - Tests : `tests/suite9.js` (19 tests) ; `run.sh` affiche désormais `✓ TOTAL : N tests uniques PASS · 0 FAIL` (compte dédupliqué — les vieux résumés de suites étaient trompeurs : le vrai total est 163, pas 76/94).

8. **Lot 10 — Espace boutique** (`admin.html` + `tests/suite10.js` + `tests/build-admin.sh`) :
   - écran commerçant autonome, même design system ; lié depuis le Paramétrage de `index.html` (« 🏪 Espace boutique » → `window.open('admin.html')`) ;
   - **ne pas mettre `const $=`** dans admin.html : le harnais réserve `$` (convention `qs`) ;
   - fonctions : `slugify` (ids anti-accents), `parsePrice` (virgule OU point), `parseStock` (**chiffres seuls** — parseInt seul accepterait `3,5`), `validateCatalog` (rejette : non-liste, liste vide interdite côté serveur seulement, produit sans `id`/`n`/`pr`/`st`, id en double), `collectForm`/`fillForm`/`syncSubs` (formulaire ↔ état), `addOrUpdate` (insert OU update selon `editId`), `bumpStock` (plancher 0), `togglePromo`, `delProduct`, `renderList` (filtre + compteurs), `exportJSON` (Blob natif avec repli copier), `onImport` (FileReader) ;
   - brouillon local `lm-admin-catalog` : les mutations du commerçant persistent sur le poste ; au chargement, le `products.json` du serveur n'écrase **pas** un brouillon non vide ;
   - `sw.js` : `./admin.html` ajouté à l'app shell cachée ;
   - `build.sh` exclut `suite10.js` de son glob (tests admin ⇒ autre harnais, sinon 13 FAIL « Can't find variable » dans le harnais index) ; bash 3.2 macOS : pas de `mapfile`, boucle `for + case` requise.

9. **Lot 11 — carte réelle Leaflet/OpenStreetMap** (`index.html` + `sw.js`) :
   - CDN jsdelivr Leaflet 1.9.4 (grep du `build.sh` insensible : le `<script src>` externe n'est pas extrait par l'awk du harnais) ;
   - **Suivi** : overlay `#lmap` (display:none par défaut) au-dessus de la carto stylisée — affiché seulement si `L` est défini et l'init réussit (`mountRealMap`, idempotent : `renderTrack` recrée `#lmap`, le `if(lmapEl!==holder)` remonte la carte sur le nouveau nœud) ; marqueurs 🏪/🏠, polyline lagon, pin 🛵→✅ positionné par `interAlong(TRACK_ROUTE, posToT(trackEta.pos))` (mêmes 22 %/88 % que le lot 3-4) ; badge ETA en `z-index:3` au-dessus de la carte ;
   - **Zones** : carte `#zmap` (non interactive) + `ZONE_POLYS` (polygones indicatifs, lagon = couvert / ambre pointillé = bientôt), fitBounds auto ;
   - Guards obligatoires : `typeof L==='undefined'` (JXA, hors-ligne, CDN bloqué) → repli stylisé inchangé ; try/catch autour des inits ;
   - `sw.js` : tuiles OSM cache-first borné ~80 (`lagon-tiles`) ;
   - Tests : `tests/suite11.js` — maths (`posToT` clamp 22/88, `interAlong` endpoints/milieu/monotonic/dégénérés), bornes géo de Saint-Martin, présence overlays/CDN/attribution, guards sans `L`, pas de régression ETA.

10. **Lot 12 — photos réelles des produits** (`index.html`, `products.json`, `admin.html`, `sw.js`) :
   - Source : Wikimedia Commons (licences libres CC0/CC BY/CC BY-SA/PD), CDN `upload/thumb.wikimedia.org`, aucune clé API ;
   - `products.json` : champs `ph` (URL https) + `cr` (crédit « File:… (licence) ») sur les 19 produits ; mêmes champs dupliqués dans les données embarquées `P` de `index.html` (cohérence testée) ;
   - Rendu : helper `pimg(p,cls)` (photo `<img loading="lazy" referrerpolicy="no-referrer">` en `object-fit:cover`, `.ph img` CSS) + repli `pvis(p)` (dégradé + emoji) ; `imgFail` (cartes) et `bigImgFail` (fiche, via `data-fe`) restaurisent l'emoji si l'image ne charge pas — jamais d'image cassée ; ⚠ l'ancien helper `ph(p)` a été renommé `pvis(p)` (collision avec le champ `p.ph`) ;
   - Fiche : photo en héro plein + crédit discret « Photo : … » sous l'image ;
   - `admin.html` : champ « Photo (URL https) » (`f-ph`) — http refusé, vide = repli emoji ; `fillForm`/`cancelEdit` gèrent `f-ph` ; liste : photo en fond de vignette (emoji masqué par `font-size:0`, apostrophes d'URL → `%27`) ;
   - `sw.js` inchangé pour les photos (hors app shell) ; offline → repli emoji ;
   - Tests : `tests/suite12.js` (17) — champs présents/uniques, synchronisation JSON ↔ embarqué, rendus pcard/fiche, replis via objets factices, CSS ; suite10 étendue (+6 : champ photo).

13. **Lot 16 — sécurisation (Supabase Auth)** (`admin.html`, `supabase-schema.sql` v2) : policies RLS restreintes (produits en écriture et commandes en lecture → `to authenticated` uniquement ; lecture produits + création commandes restent publiques) ; Espace boutique → carte « Compte marchand » (`bkLogin`/`bkLogout`/`bkRefresh`, session persistée `lm-admin-auth`, retry automatique après refresh sur HTTP 401) ; `bkFetch` envoie le jeton marchand si connecté, sinon la clé anon ; suite admin16 (11 tests). Création du compte : Authentication → Users → Add user (Auto Confirm).

12. **Lot 15 — backend optionnel Supabase REST** (`index.html`, `admin.html`, `supabase-schema.sql`) : bloc API sans SDK (`API`/`apiReady`/`apiFetch`, `apiProducts`, `apiSubmitOrder`, `apiUpsertProduct`, `rowToProduct`/`appToRow`) ; Paramétrage → carte Backend (URL + clé anon + test + déconnexion) ; `refreshCatalog` dispatcher (API prioritaire, repli products.json) ; `payNow` ne confirme qu'après accord serveur ; Espace boutique → publication groupée (upsert `?on_conflict=id`) + chargement backend ; schéma SQL + RLS permissives (prototype) ; suites 15 (14 tests) et admin15 (9 tests).

11. **Lot 13 — i18n FR/EN** (`index.html`, `admin.html`) :
   - FR = langue source ; bloc i18n inséré après l'état : `EN_DICT` (textes exacts, ~200 entrées : chrome, produits noms/formats/descriptions, catégories, sous-rayons, paniers, créneaux, moyens de paiement, zones, FAQ, promos, onboarding, toasts) + `EN_PAT` (phrases interpolées ; `$n` = 1ᵉʳ groupe, sous-traduction des fragments connus) + composite « · » traduit par segments ;
   - `trText`/`trExact`/`trPat` purs (testables) ; `trTree` marche le DOM (textes + placeholder/aria-label/title) ; `MutationObserver` (gardé `typeof!=='undefined'` — absent en JXA) traduit les nœuds ajoutés ; démarrage : `if(LANG==='en')trTree(document.body)` ;
   - `LANG` persisté dans `lm-config` (`loadConfig` ne l'écrase pas — lecture directe au chargement) ; `setLang(l)` re-traduit + re-rend Paramétrage ; sélecteur 🇫🇷/🇬🇧 dans Paramétrage (« Langue · Language ») ;
   - Helpers produit `pn(p)/pf(p)/pd(p)` : priorité `p.n_en`/`p.d_en` (champs boutique) → dictionnaire → FR ; branchés dans pcard (n, f, alt), openBasket, fiche (h1, format, `pdesc` pour le tronquage « Lire la suite »), panier, remplacements, suggestions, avis ; `matchesQuery` cherche aussi le nom EN ;
   - `admin.html` : champs facultatifs « Nom (EN) » (`f-nen`) et « Description (EN) » (`f-den`) — stockés seulement s'ils sont renseignés ;
   - ⚠ pièges : ne PAS renommer le helper `ph(p)`→c'est `pvis` depuis le Lot 12 ; les traductions identiques (BBQ, Apple Pay) sont acceptées ; test `'250 g'` format sans mot FR toléré.

## 7. Tests (harnais JavaScriptCore)

255 tests uniques PASS / 0 FAIL (suites 1→9 + 11 + 12 + 13 pour index.html ; 25 admin via suite10) — deux harnais : `tests/build.sh` (index.html, expose aussi `RAW_PRODS` = products.json) et `tests/build-admin.sh` (admin.html, suite10), tous deux exécutés par `run.sh` qui affiche le total dédupliqué. Attention : le stub note désormais que `querySelector('#x')` et `getElementById('x')` renvoient le **même** objet simulé (nécessaire aux tests du formulaire admin).

```bash
bash tests/run.sh        # reconstruit le harnais + exécute + exit 1 si FAIL
```
Après chaque évolution, étendre une suite dans `tests/suite*.js` (stub DOM + `renderX()` + asserts) puis relancer `tests/run.sh` — la CI GitHub rejoue le tout sur chaque push.
⚠ Toute évolution doit relancer cette suite (conserver les suites `/tmp/tests5.js`, `tests6.js`, `tests7.js`).
⚠ Réserve : exécution via JavaScriptCore + DOM simulé ≠ rendu navigateur réel ; vérification visuelle à faire à l'œil.

## 8. Ce qui reste aisé à ajouter (pistes)

- ~~Vraies photos + lazy loading~~ **fait (Lot 12)** — restant : propres photos des commerçants (remplacer les URL Commons par leurs clichés via l'Espace boutique).
- Paniers avec quantités éditables / wishlist → commande, notifications pushes réelles (service worker).
- Suivi : vraie carte (Leaflet/MapLibre) — le lot actuel est une carte stylisée.
- ~~i18n EN/NL~~ **EN fait (Lot 13)** — restant : NL (clientèle néerlandophone de Saint-Martin), en suivant le même schéma dict+patterns.
- Paiement : Pages « nouvelles carte » (stripe elements simulés).
- Épinglage manuel des remplacements (`pinnedReplacement`).

## 9. Distribution

Voir README → « Publier en ligne ». Le prototype est un fichier unique sans build : GitHub Pages (ou tout hébergeur statique / Netlify drop) suffit.
