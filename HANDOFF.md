# HANDOFF.md — Passation projet « Lagon Market » (à coller à un assistant IA)

> Document d'handoff : l'état exact du prototype après 7 lots de développement.
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

## 7. Tests (harnais JavaScriptCore)

76 tests PASS / 0 FAIL — reconstruits à chaque lot depuis le fichier live, rejouables par une seule commande macOS :

```bash
bash tests/run.sh        # reconstruit le harnais + exécute + exit 1 si FAIL
```
Après chaque évolution, étendre une suite dans `tests/suite*.js` (stub DOM + `renderX()` + asserts) puis relancer `tests/run.sh` — la CI GitHub rejoue le tout sur chaque push.
⚠ Toute évolution doit relancer cette suite (conserver les suites `/tmp/tests5.js`, `tests6.js`, `tests7.js`).
⚠ Réserve : exécution via JavaScriptCore + DOM simulé ≠ rendu navigateur réel ; vérification visuelle à faire à l'œil.

## 8. Ce qui reste aisé à ajouter (pistes)

- Vraies photos + lazy loading (remplacer gradients `p.g` par `<img>`).
- Paniers avec quantités éditables / wishlist → commande, notifications pushes réelles (service worker).
- Suivi : vraie carte (Leaflet/MapLibre) — le lot actuel est une carte stylisée.
- i18n EN/NL (clientèle Saint-Martin), mode sombre.
- Paiement : Pages « nouvelles carte » (stripe elements simulés).
- Épinglage manuel des remplacements (`pinnedReplacement`).

## 9. Distribution

Voir README → « Publier en ligne ». Le prototype est un fichier unique sans build : GitHub Pages (ou tout hébergeur statique / Netlify drop) suffit.
