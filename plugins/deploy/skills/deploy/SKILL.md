---
name: deploy
description: Deploy, publish, push code, update project, release, migrations, build
---
# Skill: Deploy

## Quando Usar
Quando o usuario pedir deploy, atualizar, publicar, ou subir codigo de algum projeto.

## Projetos Laravel
```bash
PROJECT="sistemareino.com.br"  # ou api.hubnews.ai, work8.billy.dev.br
cd /home/forge/$PROJECT
sudo -u forge php artisan down --retry=60
sudo -u forge git pull origin main
sudo -u forge composer install --no-dev --optimize-autoloader
sudo -u forge php artisan migrate --force
sudo -u forge php artisan config:cache
sudo -u forge php artisan route:cache
sudo -u forge php artisan view:cache
sudo -u forge php artisan queue:restart
sudo -u forge php artisan up
curl -I https://$PROJECT
```

## Projetos Next.js
```bash
PROJECT="thehubnews.ai"  # ou billy.dev.br, neuralnets.com.br
PM2_NAME="thehubnews"    # ou billy-portfolio, neuralnets
cd /home/forge/$PROJECT
sudo -u forge git pull origin main
sudo -u forge npm ci
sudo -u forge npm run build
sudo -u forge pm2 restart $PM2_NAME
```

## Sistema Reino (especial — tem SSR)
```bash
cd /home/forge/sistemareino.com.br
sudo -u forge php artisan down --retry=60
sudo -u forge git pull origin main
sudo -u forge composer install --no-dev --optimize-autoloader
sudo -u forge php artisan migrate --force
sudo -u forge php artisan config:cache && sudo -u forge php artisan route:cache && sudo -u forge php artisan view:cache
sudo -u forge npm run build && sudo -u forge npm run build:ssr
sudo -u forge pm2 restart reino-ssr
sudo -u forge php artisan queue:restart
sudo -u forge php artisan up
```

## Regras
- SEMPRE faca `php artisan down` antes
- SEMPRE confirme com curl apos subir
- Se migration falhar: rollback e reporte ao Billy
