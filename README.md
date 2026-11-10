Repère des Cafetiers — Premium épuré : finition accueil et message de commande.

Ouvrir index.html ou déposer le contenu de ce dossier sur Netlify Drop.

Le message WhatsApp contient des rubriques en gras, les détails, le total et une demande de confirmation de commande/prix et un retour sur les modalités de livraison.
Le titre d’accueil utilise Manrope (chargée via Google Fonts), avec repli sur Inter/Arial hors connexion.

Mise à jour : police originale Inter rétablie sur le titre et les libellés de l’accueil, DM Sans pour les textes ; animation d’entrée conservée. Aucune autre fonctionnalité modifiée.

Mise à jour : taille du titre d’accueil réduite sur ordinateur uniquement (largeurs supérieures à 800 px).

## Galerie de l’entreprise
Rubrique « Notre entreprise en images » ajoutée avant Contact, avec bouton de navigation et affichage en plein écran sur clic. Ajoutez des photos JPG dans `images/galerie`, nommées `galerie-06.jpg` à `galerie-20.jpg`, sans modifier le code. Toutes les vignettes ont le même cadre ; voir `GUIDE_GALERIE.txt`.

La galerie de l’entreprise défile automatiquement de droite vers la gauche, accepte 40 photos JPG et ouvre une photo en grand au clic. Le bouton Pause suspend le défilement.


### Dernières modifications
- `favicon.png` utilise le logo de l’entreprise dans l’onglet navigateur.
- Galerie forcée sur une seule ligne horizontale, quel que soit le format d’écran.
- Pour ajouter une photo : `images/galerie/galerie-06.jpg`, puis `galerie-07.jpg`, etc.


## Galerie corrigée
- Photos sur une seule ligne ; défilement automatique par étapes avec 4,2 s de délai initial et 4,8 s entre mouvements, seulement lorsque la galerie est visible.
- Flèches sur les côtés des photos, bouton Pause.
- Clic sur une photo : fenêtre plein écran sans remontée, navigation de photo en photo, fond verrouillé. Fermeture par croix, clic extérieur ou Échap. La position de lecture de la page est restaurée.
- Pour ajouter des images : `images/galerie/galerie-06.jpg`, etc.


Galerie photo/vidéo : consultez GUIDE_PHOTOS_VIDEOS.txt.
