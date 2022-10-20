#!/bin/bash

# https://gist.github.com/chrisidakwo/5f228cb0883efdcfae1a880f80b9744b
## This script installs all the dependencies on the AMI.

sudo apt-get update
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - &&
sudo apt-get install -y nodejs
sudo apt-get update && sudo apt-get install npm -y
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn -y
sudo apt install zip unzip
sudo apt-get install postgresql postgresql-contrib -y
sudo systemctl start postgresql.service
sudo su postgres <<EOF
createdb fundb;
psql -c "CREATE ROLE me WITH LOGIN PASSWORD 'password';"
EOF
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
cd webapp && yarn && yarn test
sudo cp ~/webapp/webapp.service /lib/systemd/system/



# echo "############# Installing NodeJS #############"
# curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs
# echo "############# Installing npm #############"
# sudo apt-get install npm -y
# echo "############# Checking for versions #############"
# node --version
# npm --version

# echo "############# Print binary paths #############"
# which npm
# which node

# echo "############# Installing PostgreSQL  #############"
# sudo apt-get update
# sudo apt-get install postgresql postgresql-contrib -y

# echo "############# STARTING PSQL SERVICE ############## "
# sudo systemctl start postgresql.service

# echo "############# CREATE ROLE #############"
# sudo su postgres <<EOF
# createdb test;
# psql -c “CREATE ROLE me WITH LOGIN PASSWORD ‘password’;”
# EOF

# echo "############# Unzip File #############"
# tar xzf webapp.tar.gz

# echo "############# Install NPM Packages #############"
# cd webapp && npm install && npm run test


