#!/bin/bash

# https://gist.github.com/chrisidakwo/5f228cb0883efdcfae1a880f80b9744b
## This script installs all the dependencies on the AMI.

sudo apt-get update -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - &&
sudo apt-get install -y nodejs
sudo apt-get update && sudo apt-get install npm -y
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn -y
sudo apt install zip unzip
sudo apt-get install postgresql postgresql-contrib -y
sudo systemctl start postgresql.service
# sudo su postgres <<EOF
# createdb fundb;
# psql -c "CREATE ROLE me WITH LOGIN PASSWORD 'password';"
# EOF
node --version
npm --version
yarn --version
psql --version
zip --version
which node
which npm
which yarn
which psql
unzip /home/ubuntu/webapp.zip -d /home/ubuntu/webapp
cd /home/ubuntu/webapp && yarn


