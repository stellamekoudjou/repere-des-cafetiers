# Repère des Cafetiers

**Site web de présentation et de commande de produits alimentaires à Yaoundé, Cameroun.**

Repère des Cafetiers est une entreprise spécialisée dans l'approvisionnement des cafétérias, commerces et particuliers en produits alimentaires, boissons et produits de consommation courante.

Ce projet vise à faciliter la consultation du catalogue, la préparation des commandes et les échanges avec les clients grâce à une interface moderne, accessible et adaptée aux smartphones.

**Au service des cafétérias.**

---

## Fonctionnalités

### Catalogue des produits
- Présentation des produits par catégories : œufs, produits alimentaires et boissons.
- Affichage des prix en FCFA.
- Gestion des tarifs de base et des tarifs de gros, lorsqu'ils sont disponibles.
- Recherche et filtrage des produits.
- Photos associées aux différentes références.

### Panier et commandes
- Ajout et suppression de produits.
- Modification des quantités.
- Calcul automatique du montant total.
- Affichage d'un récapitulatif de commande.
- Saisie des informations nécessaires à la livraison.
- Préparation d'un message de commande à transmettre via WhatsApp.

### Galerie de l'entreprise
- Présentation des activités de Repère des Cafetiers.
- Galerie horizontale de photos et vidéos.
- Défilement automatique des médias.
- Agrandissement des images et lecture des vidéos.
- Navigation adaptée aux ordinateurs et smartphones.

### Expérience utilisateur
- Interface responsive.
- Barre de navigation fixe.
- Animations discrètes.
- Logo personnalisé et favicon.
- Formulaires avec vérification des champs obligatoires.

---

## Technologies utilisées

Le site repose sur des technologies web simples, sans framework :

- **HTML5** : structure des pages.
- **CSS3** : design, animations et adaptation aux écrans.
- **JavaScript** : catalogue dynamique, panier, galerie et interactions.
- **Git & GitHub** : gestion du code source et des versions.
- **Cloudflare Pages** : hébergement et déploiement du site.

---

## Structure du projet

```text
repere_des_cafetiers/
├── index.html
├── style.css
├── app.js
├── products.js
├── galerie.js
├── favicon.png
├── logo-repere.jpg
├── images/
│   ├── produits/
│   └── galerie/
└── README.md
```

Les fichiers et dossiers peuvent évoluer au fil du développement.

---

## Installation locale

1. Cloner le dépôt :

```bash
git clone https://github.com/stellamekoudjou/repere-des-cafetiers.git
```

2. Accéder au dossier :

```bash
cd repere-des-cafetiers
```

3. Ouvrir `index.html` dans un navigateur ou utiliser un serveur local, par exemple Live Server dans Visual Studio Code.

Aucune installation de dépendances JavaScript n'est nécessaire pour cette version statique.

---

## Déploiement

Le site est conçu pour être hébergé sur Cloudflare Pages.

Pour automatiser les mises à jour :

1. Connecter le dépôt GitHub à Cloudflare Pages.
2. Sélectionner la branche `main`.
3. Choisir un projet HTML/CSS/JavaScript sans framework.
4. Définir le répertoire de publication à la racine du projet.
5. Lancer le déploiement.

Les prochaines modifications publiées sur `main` pourront déclencher automatiquement de nouveaux déploiements.

---

## Informations importantes

Les prix affichés sont indicatifs et peuvent être actualisés selon les disponibilités et les conditions de vente.

Le montant calculé dans le panier est une estimation côté navigateur. Les commandes sont actuellement transmises par WhatsApp et doivent être vérifiées et confirmées par l'entreprise avant leur traitement.

Cette version ne comprend pas encore de paiement en ligne ni de base de données centralisée des commandes.

---

## Contact

**Repère des Cafetiers**

Localisation : Yaoundé, Cameroun  
Zone de service : Biyem-Assi et environs  
WhatsApp : +237 673 714 759

---

## Évolutions envisagées

- Système de commandes enregistré dans une base de données.
- Espace d'administration sécurisé.
- Gestion centralisée des prix et des produits.
- Suivi du traitement des commandes.
- Amélioration continue de l'expérience mobile.

---

© 2026 Repère des Cafetiers. Tous droits réservés.
