#! /bin/bash

#Production
git reset --hard
git checkout main
git pull origin main

npm i
npm run build
pm2 start process.config.js --env production

#Development
# git reset --hard
# git checkout development
# git pull origin development

# npm i
# pm2 start "npm run start:dev" --name "AlphaFit"