#!/bin/bash

#must insert VB guest additions disc with GUI
#prepare for guest additions
sudo apt install -y build-essential linux-headers-$(uname -r)

#install guest additions
sudo mount /dev/cdrom /media
cd /media
sudo ./VBoxLinuxAdditions.run
#reboot wil be required after script runs

#install curl
sudo apt install curl -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

#install NodeJS
nvm i 16.17.0 -y

#install react
npm install create-react-app -y
npm audit fix --force
npm install

#install VS code with snap
sudo snap install code --classic

#install git
sudo apt install git=1:2.34.1-1ubuntu1.4

#reboot to finalize some installations
sudo reboot
