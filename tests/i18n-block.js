/* ================= LOT 13 — i18n FR/EN ================= */
/* Principe : le français est la langue source. EN_DICT traduit les textes exacts ;
   EN_PAT traduit les phrases interpolées (prix, quantités, dates).
   trTree + MutationObserver traduisent le DOM au fil des rendus — aucun template à modifier. */
let LANG='fr';
try{ const _lc=JSON.parse(localStorage.getItem('lm-config')||'null'); if(_lc&&_lc.lang)LANG=_lc.lang; }catch(e){}
const EN_DICT={
/* chrome */
'Accueil':'Home','Catalogue':'Catalog','Panier':'Cart','Compte':'Account','Livraison':'Delivery','Paiement':'Payment',
'Suivi de livraison':'Delivery tracking','Paramétrage':'Settings','Zones couvertes':'Delivery zones',
'Rechercher un produit, une marque…':'Search a product, a brand…',
'⚠ Connexion interrompue':'⚠ Connection lost','Réessayer':'Retry','Voir les zones':'See zones',
'⚠ Impossible de charger les produits':'⚠ Could not load products',
'🛟 Nous ne livrons pas encore à cette adresse':'🛟 We do not deliver to this address yet',
'Changer':'Change',
/* accueil */
'Spécial arrivée':'New arrival special','Votre villa est vide ? On remplit le frigo.':'Villa empty? We fill the fridge.',
'Voir les paniers':'See the baskets','Paniers prêts à livrer':'Ready-to-deliver baskets','Livraison dès demain':'Delivery from tomorrow',
'Sélection du moment':'Picks of the week','Tout voir':'See all','Produits frais':'Fresh products','Nouveautés':'New in',
'Cette semaine':'This week','Catégories':'Categories','Toutes les catégories':'All categories',
'✕ Effacer la recherche':'✕ Clear search','Saisissez d\'abord un mot-clé — ex. « brie »':'Type a keyword first — e.g. "brie"',
/* filtres / tri */
'Filtres':'Filters','Effacer':'Clear','Trier par':'Sort by','Prix':'Price','Préférences':'Preferences','Marques':'Brands',
'Moins de 5 €':'Under €5','5 – 10 €':'€5 – 10','10 – 20 €':'€10 – 20','Plus de 20 €':'Over €20',
'Bio':'Organic','Sans gluten':'Gluten-free','Végétarien':'Vegetarian','Disponible':'Available','Promotion':'On sale',
'Disponible aujourd’hui':'Available today','En promotion':'On sale',
'Pertinence':'Relevance','Prix croissant':'Price low → high','Prix décroissant':'Price high → low','Nouveautés':'Newest',
'prix croissant':'price low → high','prix décroissant':'price high → low','pertinence':'relevance','nouveautés':'newest',
'Tout effacer':'Clear all','Réinitialiser les filtres':'Reset filters','Essayez d\'élargir votre recherche.':'Try widening your search.',
'Aucun produit ne correspond à ces filtres':'No product matches these filters',
/* fiche produit */
'Rupture':'Out of stock','Rupture de stock':'Out of stock','En stock':'In stock','Me prévenir':'Notify me',
'Me prévenir du retour':'Notify me when back','Voir les remplacements suggérés':'See suggested replacements',
'Replacements suggérés':'Suggested replacements','Remplacements suggérés':'Suggested replacements',
'Suggérés automatiquement dans la même catégorie, affinés par l\'équipe.':'Picked automatically from the same category, refined by our team.',
'en stock':'in stock','Ajouter':'Add','Fermer':'Close','Lire la suite':'Read more','Complétez votre panier':'Complete your basket',
'Un conseil ? Écrire sur WhatsApp':'Need advice? Message us on WhatsApp',
'Ce produit n\'est plus disponible':'This product is no longer available','Retour au catalogue':'Back to catalog',
'Retrouvez nos nouveautés chaque semaine au catalogue.':'Find our new arrivals in the catalog every week.',
'Ajouter une adresse':'Add an address','Villa, bateau, appartement…':'Villa, boat, apartment…',
'L\'ajout d\'adresse arrive au Lot 3':'Adding addresses is coming in a later update',
/* panier */
'Votre panier est vide':'Your cart is empty','Ajoutez des produits au fil de votre visite, ou partez d\'un panier prêt à livrer.':'Add products as you browse, or start from a ready-made basket.',
'Sous-total':'Subtotal','Offerte':'Free','Total':'Total','Choisir la livraison':'Choose delivery',
'🎉 Livraison offerte':'🎉 Free delivery','Modifier':'Edit','l\'unité':'each','ajouté au panier':'added to cart',
'Voir le panier':'View cart','articles':'items','article':'item','arrivée estimée demain matin':'estimated arrival tomorrow morning',
'Adresse :':'Address:','Adresse :':'Address:',
/* livraison / paiement */
'Créneau de livraison':'Delivery slot','Note pour le livreur':'Note for the driver','(facultatif)':'(optional)',
'Code portail, villa à gauche…':'Gate code, villa on the left…',
'Changer d\'adresse':'Change address','Le paiement sera disponible depuis une adresse livrable.':'Payment will be available from a deliverable address.',
'Continuer vers le paiement':'Continue to payment',
'Commande confirmée':'Order confirmed','Suivre ma livraison':'Track my delivery','Retour à l\'accueil':'Back to home',
'Moyen de paiement':'Payment method',
'Paiement sécurisé. Votre règlement est conservé jusqu\'à la livraison : impossible de payer une livraison ratée.':'Secure payment. Your payment is held until delivery: you can never pay for a failed delivery.',
/* créneaux */
'Aujourd’hui, 17 h – 19 h':'Today, 5 pm – 7 pm','Demain, 8 h – 10 h':'Tomorrow, 8 am – 10 am',
'Demain, 11 h – 13 h':'Tomorrow, 11 am – 1 pm','Demain, 17 h – 19 h':'Tomorrow, 5 pm – 7 pm','Samedi, 9 h – 11 h':'Saturday, 9 am – 11 am',
'Dernier créneau du jour':'Last slot of the day','Idéal pour le petit-déjeuner':'Perfect for breakfast','Le plus demandé':'Most popular',
'Aujourd’hui':'Today','Demain':'Tomorrow','Samedi':'Saturday','Hier':'Yesterday',
/* moyens de paiement */
'Carte enregistrée':'Saved card','Visa •• 4444 — expire 08/27':'Visa •• 4444 — expires 08/27',
'Apple Pay':'Apple Pay','Face ID en un tap':'Face ID in one tap','Nouvelle carte':'New card','Payer en ligne en toute sécurité':'Pay online securely',
/* suivi */
'Confirmée':'Confirmed','Préparation':'Preparing','En livraison':'Out for delivery','Livrée':'Delivered',
'confirmée':'confirmed','préparation':'preparing','en livraison':'out for delivery','livrée':'delivered',
'Bientôt en route':'Starting soon','Commande livrée — bon appétit !':'Order delivered — enjoy!',
'↻ Actualiser la position du livreur':'↻ Refresh driver position','Appeler le livreur':'Call the driver','Écrire au support':'Message support','Signaler un problème':'Report an issue','Retour au compte':'Back to account',
'Astuce prototype : tap sur une étape pour prévisualiser.':'Prototype tip: tap a step to preview.',
/* compte */
'Modifier le profil':'Edit profile','Nom':'Name','E-mail':'Email','Téléphone':'Phone','Nom complet':'Full name',
'Enregistrer le profil':'Save profile','Annuler':'Cancel','Suivre':'Track','Ouvrir':'Open','Rien de nouveau':'Nothing new',
'Mes commandes':'My orders','↻ Réordonner':'↻ Reorder','Mes adresses':'My addresses','Gérer les adresses':'Manage addresses',
'⚙ Paramétrage (démonstration)':'⚙ Settings (demo)','Se déconnecter':'Log out','Se déconnecter ?':'Log out?',
'Votre panier et vos commandes restent enregistrés sur cet appareil. Vous pourrez vous reconnecter à tout moment.':'Your cart and orders stay on this device. You can log back in anytime.',
'Rester connecté':'Stay logged in','Notifications':'Notifications',
'Articles de cette commande indisponibles pour la réordonnance':'Items from this order are unavailable for reorder',
'Aucun article disponible — tout est en rupture':'No item available — all out of stock',
/* assistance */
'Assistance':'Support','Questions fréquentes':'Frequently asked questions','Envoyer le signalement':'Send report',
'Article manquant':'Missing item','Commande incomplète':'Incomplete order','Article abîmé':'Damaged item','Retard de livraison':'Late delivery','Autre':'Other',
'Détaillez en quelques mots (facultatif)…':'Add a few words (optional)…','Message envoyé — réponse sous 24 h':'Message sent — reply within 24 h',
'À bientôt ! Vous êtes déconnecté·e — vos commandes restent enregistrées':'See you soon! You are logged out — your orders stay saved',
'Quand vais-je être livré ?':'When will I be delivered?',
'Votre créneau est confirmé au paiement. Le jour J, vous recevez notifié l\'arrivée du livreur 15 minutes avant.':'Your slot is confirmed at payment. On the day, you get notified 15 minutes before the driver arrives.',
'Un article manque dans ma commande ?':'An item is missing from my order?',
'Un article en rupture au moment de la préparation vous est remboursé automatiquement, et le livreur l\'explique à la remise.':'An item out of stock at packing time is refunded automatically, and the driver explains it on delivery.',
'Comment sont contrôlés les produits frais ?':'How are fresh products checked?',
'Frais du jour = arrivés ce matin sur le dernier bateau ou ramassés sur le détaquant. Ils sont stockés en chambre froide jusqu\'à la livraison.':'Fresh today = arrived this morning on the last boat or picked from the day-boat catch. They are kept cold until delivery.',
'Puis-je payer à la livraison ?':'Can I pay on delivery?',
'Non : le règlement est en ligne au moment de la commande, mais il n\'est encaissé qu\'après la livraison réussie.':'No: payment is online at order time, but it is only captured after successful delivery.',
/* avis */
'Pas encore d\'avis':'No reviews yet','Avis clients':'Customer reviews','avis':'reviews','Donner mon avis':'Write a review',
'Écrire le premier avis':'Be the first to review','Votre avis':'Your review','Votre commentaire':'Your comment',
'Ce que vous avez aimé (ou pas)…':'What you liked (or not)…','Publier mon avis':'Post my review','À l\'instant':'Just now',
/* promos */
'Appliquer':'Apply','Codes de démonstration : BIENVENUE10, LAGON5, LIVRAISONOFFERTE':'Demo codes: BIENVENUE10, LAGON5, LIVRAISONOFFERTE',
'Code promo (ex. BIENVENUE10)':'Promo code (e.g. BIENVENUE10)','Entrez d\'abord un code promo':'Enter a promo code first',
'Ajoutez des articles avant d\'appliquer un code':'Add items before applying a code','Code promo retiré':'Promo code removed',
'−10 % sur votre première commande':'−10% on your first order','5 € offerts sur le panier':'€5 off your basket','Livraison offerte':'Free delivery',
/* notifications */
'Aucune notification pour le moment.':'No notifications yet.',
'Bienvenue sur Lagon Market':'Welcome to Lagon Market','Première commande ? Le code BIENVENUE10 vous offre −10 %.':'First order? Code BIENVENUE10 gives you −10%.',
'Nouveauté chez votre primeur':'New at your greengrocer','La mangue Judy fait son retour cette semaine.':'Judy mango is back this week.',
'Votre livreur est en route':'Your driver is on the way','Il arrive dans environ 35 minutes.':'Arriving in about 35 minutes.',
'Commande livrée !':'Order delivered!','Bon appétit — notez vos produits en un tap.':'Enjoy — rate your products in one tap.',
'Livreur assigné':'Driver assigned','Votre livreur part dans quelques minutes.':'Your driver leaves in a few minutes.',
/* favoris / push */
'Retiré des favoris':'Removed from favourites','Ajouté aux favoris ❤':'Added to favourites ❤','Vos favoris':'Your favourites',
'Préparation en cours':'Being prepared','Commande en cours':'Order in progress','Toucher pour suivre la livraison':'Tap to track your delivery',
/* zones */
'Lagon Market livre la baie d\'Orient et se développe île par île. Votre adresse actuelle :':'Lagon Market delivers Orient Bay and grows island by island. Your current address:',
'Cul de Sac Bay — zone non couverte':'Cul de Sac Bay — not covered yet',
'Couvert':'Covered','Bientôt':'Soon','Ouverture :':'Opening:','Prochain mois':'Next month','Prochain trimestre':'Next quarter',
'Villas entre Pinel et la baie — votre secteur':'Villas between Pinel and the bay — your area','Résidences du littoral':'Waterfront residences',
'Villas du fond de baie':'Villas at the head of the bay','Village et environs':'Village and surroundings','Centre-ville et Marina':'Downtown and Marina','Front de mer':'Seafront',
'Tous les jours · dès 8 h':'Every day · from 8 am','Tous les jours · dès 8 h · livreur à ~45 min':'Every day · from 8 am · driver ~45 min','Sur créneau du matin':'Morning slots',
'Choisir mon adresse de livraison':'Choose my delivery address','Une zone manque ? Écrivez-nous sur WhatsApp : elle priorise la liste.':'A zone missing? Message us on WhatsApp: it jumps the queue.',
/* onboarding */
'Passer':'Skip','Retour':'Back','Suivant':'Next','Commencer':'Start','Bienvenue à bord 👋':'Welcome aboard 👋',
'Vos courses, livrées à la villa':'Your groceries, delivered to the villa',
'Produits frais du jour, paniers prêts à livrer, et la livraison à l\'heure à Orient Bay.':'Fresh products, ready-made baskets, on-time delivery in Orient Bay.',
'Un panier prêt à livrer':'A basket ready to deliver',
'Apéro, BBQ, bateau ou petit-déjeuner : un tap sur « Ajouter tout », et la villa est approvisionnée.':'Drinks, BBQ, boat or breakfast: one tap on "Add all" and the villa is stocked.',
'Suivez votre livreur':'Follow your driver',
'Position en temps réel, créneau confirmé, et le règlement n\'est encaissé qu\'après la livraison réussie.':'Real-time position, confirmed slot, and payment is only captured after successful delivery.',
/* paniers */
'Apéro':'Aperitif','BBQ':'BBQ','Bateau':'Boat day','Petit-déjeuner':'Breakfast','Famille':'Family',
'Rosé, antipasti, noix':'Rosé, antipasti, nuts','Pour 4 personnes':'Serves 4','La journée en mer':'A day at sea','Douceur du matin':'Morning treats','Pour la semaine':'For the week','Sélection dédiée':'Dedicated selection',
/* catégories / sous-rayons */
'Fruits & Légumes':'Fruits & Vegetables','Boulangerie':'Bakery','Crèmerie':'Dairy & Cheese','Poissonnerie':'Fishmonger',
'Boucherie':'Butcher','Cave & Boissons':'Wine & Drinks','Épicerie':'Grocery','Surgelés':'Frozen',
'Tout':'All','Exotiques':'Exotic','Légumes':'Vegetables','Agrumes':'Citrus','Pains':'Breads','Viennoiseries':'Pastries','Pâtisseries':'Desserts',
'Fromages':'Cheeses','Produits laitiers':'Dairy','Poissons':'Fish','Fruits de mer':'Seafood','Bœuf':'Beef','Volailles':'Poultry',
'Charcuterie':'Deli meats','Vin':'Wine','Sans alcool':'Non-alcoholic','Farines':'Flours','Boissons':'Drinks','Conserves':'Canned goods','Glaces':'Ice cream',
/* paramétrage */
'Les trois valeurs à valider du brief Lot 2 sont modifiables ici : le catalogue se recalcule en direct et le réglage persiste (localStorage).':'The three brief values are editable here: the catalog recalculates live and the setting persists (localStorage).',
'Frais de livraison':'Delivery fee','appliqués sous le seuil de gratuité':'applied below the free threshold',
'Livraison offerte dès':'Free delivery from','seuil d\'incitation au panier':'basket-boost threshold',
'Numéro WhatsApp support':'Support WhatsApp number','fiche produit, compte, suivi':'product page, account, tracking',
'Créneaux de livraison':'Delivery slots','editable':'editable','＋ Ajouter':'＋ Add',
'Enregistrer le paramétrage':'Save settings','Restaurer les valeurs du brief':'Restore brief values',
'🎬 Revoir l\'introduction':'🎬 Replay the intro','🏪 Espace boutique — gérer les produits':'🏪 Shop console — manage products',
'Il faut au moins un créneau':'At least one slot is required','Saisissez un créneau, ex. Dimanche, 10 h – 12 h':'Type a slot, e.g. Sunday, 10 am – 12 pm',
'Ex. Dimanche, 10 h – 12 h':'E.g. Sunday, 10 am – 12 pm','Créneau ajouté — « Enregistrer » pour confirmer':'Slot added — "Save" to confirm',
'Valeurs du brief restaurées':'Brief values restored',
/* démo */
'États de démo':'Demo states','Accueil & catalogue':'Home & catalog','Fiche produit':'Product page','Par défaut':'Default',
'Erreur réseau':'Network error','Hors zone de livraison':'Out of delivery zone','Erreur catalogue':'Catalog error',
'Produit en rupture':'Product out of stock','Produit retiré':'Product removed',
'États par défaut':'Default states','État : erreur réseau — Retry pour recharger':'State: network error — Retry to reload',
'État : hors zone de livraison':'State: outside delivery zone','État : erreur catalogue':'State: catalog error',
'État : produit en rupture (appliqué à la fiche ouverte)':'State: product out of stock (applies to the open page)',
'État : produit retiré (appliqué à la fiche ouverte)':'State: product removed (applies to the open page)',
'Appel du support… 📞':'Calling support… 📞','Appel du livreur… 📞':'Calling driver… 📞',
/* produits : noms */
'Ananas Victoria':'Victoria pineapple','Corossol':'Soursop','Tomates grappe':'Vine tomatoes','Avocats mi-noir':'Hass avocados',
'Citrons verts':'Limes','Filet de mahi-mahi':'Mahi-mahi fillet','Crevettes bouquet':'Bouquet shrimp','Baguette tradition':'Traditional baguette',
'Brie de Meaux AOP':'Brie de Meaux AOP','Beurre doux AOP':'Sweet churned butter AOP','Œufs plein air x6':'Free-range eggs x6',
'Jambon blanc supérieur':'Superior cooked ham','Entrecôte origine France':'Ribeye steak, origin France','Poulet fermier':'Free-range chicken',
'Rosé de Provence bio':'Organic Provence rosé','Eau de source':'Spring water','Farine de riz sans gluten':'Gluten-free rice flour',
'Mélange de noix bio':'Organic mixed nuts','Mangue Judy':'Judy mango',
/* formats */
'pièce ~1,2 kg':'~1.2 kg each','pièce ~700 g':'~700 g each','botte 500 g':'500 g bunch','sachet 2 pièces':'pack of 2',
'sachet 500 g':'500 g bag','2 filets ~400 g':'2 fillets ~400 g','case 500 g':'500 g box','tranche 250 g':'250 g slice',
'plaquette 250 g':'250 g block','boîte 6':'box of 6','tranches 4 x 60 g':'4 × 60 g slices','tranche ~300 g':'~300 g slice',
'~1,4 kg':'~1.4 kg','bouteille 75 cl':'75 cl bottle','bidon 5 L':'5 L jug','paquet 1 kg':'1 kg pack','sachet 250 g':'250 g bag','pièce ~450 g':'~450 g each',
/* descriptions */
'Plein soleil de Saint-Martin, sucré et parfumé. Cocktail, jus ou nature au bord de la piscine — la découpe est offerte sur demande.':'Full Saint-Martin sunshine, sweet and fragrant. Cocktail, juice or plain by the pool — cut open for free on request.',
'Chair crémeuse à la saveur acidulée, parfait en sorbet ou en smoothie du matin.':'Creamy flesh with a tangy flavour, perfect in sorbet or a morning smoothie.',
'Cultivées sur l\'île, goût de tomate retrouvé. Parfaites en salade ou confites au four.':'Grown on the island, real tomato flavour. Great in salads or slow-roasted.',
'Fondants à souhait : toasts croustillants, salades, guacamole du vendredi.':'Meltingly good: crispy toasts, salads, Friday guacamole.',
'Indispensables pour le ti-punch, le poisson grillé et les vinaigrettes.':'Essential for ti-punch, grilled fish and vinaigrettes.',
'Pêche du jour du détaquant du Galion. Chair ferme, idéale au grill ou en ceviche.':'Caught today off Galion beach. Firm flesh, ideal grilled or as ceviche.',
'Cuites à l\'eau d\'ail, servies très fraîches avec une sauce cocktail maison.':'Boiled with garlic, served very fresh with homemade cocktail sauce.',
'Croustillante, cuite sur pierre deux fois par jour. Commandée avant 18 h, livrée au petit-déjeuner.':'Crispy, stone-baked twice a day. Ordered before 6 pm, delivered for breakfast.',
'AOP, affiné quatre semaines. Pâte souple, goût franc, parfait en fin de repas.':'PDO, aged four weeks. Supple paste, bold taste, perfect to end a meal.',
'Beurre de baratte d\'Isigny, doux et crémeux.':'Churned Isigny butter, sweet and creamy.',
'Poules élevées en plein air à la Ferme Colombier, œufs du jour.':'Free-range hens at Ferme Colombier, eggs laid today.',
'Tendre et moelleux, sans couenne. Le classique des lunchs de plage.':'Tender and moist, rindless. The beach-lunch classic.',
'Persillée, maturée 15 jours, née, élevée et transformée en France.':'Well-marbled, aged 15 days, born, raised and processed in France.',
'Parfait pour un poulet boucané du dimanche, au feu de bois.':'Perfect for a Sunday smoked chicken over wood fire.',
'Sec, fruité, la référence de l\'apéro à Orient Bay. Millésime 2024.':'Dry, fruity, the Orient Bay aperitif staple. 2024 vintage.',
'':'', /* (eau de source : pas de description) */
'Pour pancakes, cakes et gâteaux légers.':'For pancakes, loaves and light cakes.',
'Noix de cajou, amandes et noisettes grillées à sec.':'Cashews, almonds and hazelnuts dry-roasted.',
'Sucrée, peu fibreuse, à la chair fondante — la préférée de l\'île.':'Sweet, barely fibrous, melting flesh — the island\'s favourite.',
};
/* Phrases interpolées : première règle qui matche gagne */
const EN_PAT=[
[/^(\d+) produits?$/,'$n products'],
[/^Voir (\d+) produits?$/,'View $n products'],
[/^Catalogue mis à jour \((\d+) produits\)$/,'Catalog updated ($1 products)'],
[/^Plus que (\d+) en stock$/,'Only $n left'],
[/^Encore (.+) pour la livraison offerte$/,'$1 more for free delivery'],
[/^Livreur à (\d+) min$/,'Driver in $n min'],
[/^Arrivée estimée : dans (\d+) min$/,'Estimated arrival: in $n min'],
[/^Arrivée estimée : (.+)$/,'Estimated arrival: $2'],
[/^✅ Livré à (.+)$/,'✅ Delivered to $2'],
[/^Stock maximum atteint : (\d+) exemplaires$/,'Max stock reached: $n units'],
[/^Nous vous préviendrons du retour de (.+)$/,'We will let you know when $2 is back'],
[/^Commande (#[0-9]+) confirmée$/,'Order $2 confirmed'],
[/^Nous la préparons — livraison (.+)$/,'We are preparing it — delivery $2'],
[/^Merci pour votre avis \((\d+)★\) !$/,'Thanks for your review ($n★)!'],
[/^Voir les (\d+) avis$/,'See all $n reviews'],
[/^(\d+) avis$/,'$n reviews'],
[/^(\d+) nouvelle(s)?$/,'$n new'],
[/^Merci ! Signalement envoyé : (.+)$/,'Thanks! Report sent: $2'],
[/^Code « (.+) » invalide — essayez (.+)$/,'Code "$2" is invalid — try $3'],
[/^Code ([A-Z0-9]+) appliqué : (.+)$/,'Code $2 applied: $3'],
[/^Code ([A-Z0-9]+) appliqué$/,'Code $2 applied'],
[/^Remise ([A-Z0-9]+)$/,'Discount $2'],
[/^Aperçu : (.+)$/,'Preview: $2'],
[/^Recherche : « (.+) »$/,'Search: "$2"'],
[/^Aucun produit pour « (.+) »$/,'No product for "$2"'],
[/^Aucun produit ici — appuyez sur Entrée pour chercher « (.+) » dans tout le catalogue$/,'No match here — press Enter to search "$2" across the catalog'],
[/^Profil mis à jour — à bientôt, (.+) !$/,'Profile updated — see you soon, $2!'],
[/^Paramètres enregistrés · livraison (.+) — offerte dès (.+)$/,'Settings saved · delivery $2 — free from $3'],
[/^Commande (#[0-9]+) en cours$/,'Order $2 in progress'],
[/^Commande (#[0-9]+) — (.+)$/,'Order $2 — $3'],
[/^(#{0,1}[0-9]*) ?·? ?([\d]+) articles? réordonnés?(?: · (\d+) en rupture ignorés?)?$/,'itemsReordered'],
[/^(\d+) articles?$/,'$n items'],
[/^· (\d+) articles?$/,'· $n items'],
[/^(.+) l'unité$/,'$2 each'],
[/^(.+) · en stock · (.+)$/,'$2 · in stock · $3'],
[/^Adresse : (.+)$/,'Address: $2'],
[/^Trier : (.+)$/,'Sort: $2'],
[/^Origine : (.+)\.$/,'Origin: $2.'],
[/^soit (.+)$/,'($2)'],
[/^Payer (.+)$/,'Pay $2'],
[/^Ajouter tout au panier( · .+)?$/,'Add all to cart$1'],
[/^Ajouter au panier( · .+)?$/,'Add to cart$1'],
[/^Panier (.+) ajouté — (\d+) articles?$/,'Basket $2 added — $3 items'],
[/^(.+) ajouté au panier$/,'$2 added to cart'],
[/^Un problème avec la commande (#[0-9]*) \?$/,'An issue with order $2?'],
[/^Un problème avec la commande \?$/,'An issue with your order?'],
[/^Photo : (.+)$/,'Photo: $2'],
[/^Ouverture : (.+)$/,'Opening: $2'],
[/^(Aujourd’hui|Demain|Samedi|Dimanche|aujourd’hui|demain|samedi|dimanche)(,.*)$/,'daySlot'],
];
function trExact(s){ return (LANG==='en'&&Object.prototype.hasOwnProperty.call(EN_DICT,s))?EN_DICT[s]:s; }
function trPat(x){
  if(LANG!=='en')return x;
  for(var i=0;i<EN_PAT.length;i++){
    var m=x.match(EN_PAT[i][0]);
    if(!m)continue;
    if(EN_PAT[i][1]==='itemsReordered'){
      var out=m[2]+' '+(+m[2]===1?'item':'items')+' reordered';
      if(m[3])out+=' · '+m[3]+' out of stock skipped';
      return out;
    }
    if(EN_PAT[i][1]==='daySlot'){
      var w={'Aujourd’hui':'Today','Demain':'Tomorrow','Samedi':'Saturday','Dimanche':'Sunday'}[m[1].charAt(0).toUpperCase()+m[1].slice(1)]||m[1];
      return w+m[2];
    }
    var r=EN_PAT[i][1];
    for(var j=1;j<m.length;j++)r=r.replace('$'+j,m[j]===undefined?'':m[j]);
    r=r.replace(/\$n/g,m[1]);
    /* sous-traduction des fragments interpolés (ex. « Order #12 — Commande confirmée ») */
    return r.replace(/(Commande confirmée|Préparation en cours|Commande en cours|Confirmée|Préparation|En livraison|Livrée|Aujourd’hui, [^·]+|Demain, [^·]+|Samedi, [^·]+)/g,function(seg){return trExact(seg)||seg;});
  }
  return x;
}
function trText(s){
  if(LANG!=='en'||typeof s!=='string')return s;
  var lead=s.match(/^\s*/)[0], trail=s.match(/\s*$/)[0], x=s.slice(lead.length,s.length-trail.length);
  if(!x)return s;
  var out=trExact(x);
  if(out===x)out=trPat(x);
  if(out===x&&x.indexOf(' · ')>=0){ /* composite : traduire chaque segment */
    var parts=x.split(' · ').map(trText), changed=parts.some(function(p,i){return p!==x.split(' · ')[i];});
    if(changed)out=parts.join(' · ');
  }
  return out===x?s:lead+out+trail;
}
function trAttrs(el){
  ['placeholder','aria-label','title'].forEach(function(a){
    try{ var v=el.getAttribute&&el.getAttribute(a); if(v){ var t=trText(v); if(t!==v)el.setAttribute(a,t); } }catch(e){}
  });
}
function trTree(node){
  try{
    if(!node||typeof node.nodeType!=='number')return;
    if(node.nodeType===3){ var t2=trText(node.nodeValue); if(t2!==node.nodeValue)node.nodeValue=t2; return; }
    if(node.nodeType===1){
      trAttrs(node);
      var kids=node.childNodes;
      if(kids&&kids.length)for(var i=0;i<kids.length;i++)trTree(kids[i]);
    }
  }catch(e){}
}
function setLang(l){
  LANG=(l==='en')?'en':'fr';
  try{
    var c={}; try{c=JSON.parse(localStorage.getItem('lm-config')||'{}')||{};}catch(e){}
    c.lang=LANG; localStorage.setItem('lm-config',JSON.stringify(c));
  }catch(e){}
  try{document.documentElement.lang=LANG;}catch(e){}
  trTree(document.body||document.documentElement);
  if(typeof renderSettings==='function'&&document.getElementById('settings-body'))renderSettings();
  if(typeof renderAddr==='function')renderAddr();
}
/* Traduction des nœuds ajoutés au fil des rendus (renders dynamiques, toasts…) */
if(typeof MutationObserver!=='undefined'&&typeof document!=='undefined'&&document.body){
  try{
    var _i18nMo=new MutationObserver(function(ms){
      for(var i=0;i<ms.length;i++){
        var m=ms[i];
        if(m.addedNodes&&m.addedNodes.length)for(var j=0;j<m.addedNodes.length;j++)trTree(m.addedNodes[j]);
        if(m.type==='attributes'&&m.target)trAttrs(m.target);
      }
    });
    _i18nMo.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['placeholder','aria-label','title']});
  }catch(e){}
}
if(LANG==='en'){ try{document.documentElement.lang='en';}catch(e){} }
/* Affichage produit selon la langue (n/f/d traduits par dictionnaire, repli FR) */
function pn(p){return LANG==='en'?trExact(p.n):p.n;}
function pf(p){return LANG==='en'?trExact(p.f):p.f;}
function pd(p){return LANG==='en'?trExact(p.d):p.d;}
