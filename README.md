# DevOps Mini Dashboard 

Mini dashboard en HTML/CSS/JS (tâches + stats + graphique) avec Docker, Docker Compose et CI/CD via GitHub Actions + déploiement sur GitHub Pages.

## Fonctionnalités
- Ajout / suppression de tâches
- Marquer une tâche comme faite
- Sauvegarde via LocalStorage
- Thème sombre/clair
- Mini graphique Canvas (progression) en camembert

## Lancer en local (sans Docker)
Ouvre `index.html` dans ton navigateur.

## Lancer avec Docker
```bash
docker build -t devops-static-site .
docker run -p 8080:80 devops-static-site
