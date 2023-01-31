# Consignes

## En tant qu’utilisateur :
- [X] Il est possible de demander à communiquer avec un conseiller de vente.
- [X] En cas de conseiller non-disponible, il n’est pas possible de demander à communiquer avec un
conseiller de vente.
- [ ] Il est possible de communiquer avec un chatbot pour l’entretien d’une moto (voir workflow).
- [X] Il est possible de communiquer avec les autres clients.
- [ ] Il est possible de rejoindre des salons de discussions prédéfinis par un administrateur.
- [ ] Il n’est pas possible de rejoindre un salon de discussion complet.
- [ ] Il n’est pas possible de communiquer sur un salon de discussion supprimé.
- [ ] Il est possible de recevoir des notifications commerciales d’un administrateur.
## En tant qu’administrateur :
- [X] Il est possible de voir les demandes de communication en attente.
- [X] Il est possible de refuser une demande de communication.
- [X] Il est possible d’accepter une demande de communication.
- [X] Il est possible de s’enregistrer comme étant disponible pour communiquer avec des clients.
- [ ] Il est possible de créer un salon de discussion.
- [ ] Il est possible de modifier le nom d’un salon de discussion
- [ ] Il est possible de modifier le volume d'utilisateurs d’un salon de discussion
- [ ] Il est possible de supprimer un salon de discussion
- [ ] Il est possible d'émettre des notifications commerciales

## Bonus :
- [X] Librairie NPM
- [ ] UX & UI travaillés
- [ ] Tests unitaires, d’intégration & E2E
- [ ] Tests de performance
- [X] Monitoring applicatif (Sentry, Crashlytics, ..)
- [ ] SEO travaillé
- [ ] Intégration & Déploiement continu
- [ ] Optimisation des assets clients
- [ ] Hébergé + nom de domaine public

## Installation:

- docker compose up
- l'app sera accessible sur localhost:3000
- par défaut on atteri sur une page avec un boutton de login.

## Connexion:

L'app utilise auth0 pour gérer l'authentification. Vous pouvez vous connecter soit avec un compte google soit avec les credentials suivantes :

### username/password:
-   user1@test.com:@password123
-   user2@test.com:@password123

Tout les comptes par défaut sont des utilisateurs normaux. Pour créer un compte admin, il faut cliquer sur l'avatar dans la navbar puis sur le bouton rouge "Make Admin".
