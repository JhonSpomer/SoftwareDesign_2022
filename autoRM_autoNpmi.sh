#!/bin/bash

#removes mpn_modules then runs npm install in cs-kiosk-backend, cs-kiosk-display, and cs-kiosk-frontend
cd /home/user/CSCI490/SoftwareDesign_2022/cs-kiosk-backend
rm -rf ./node_modules
npm install

cd /home/user/CSCI490/SoftwareDesign_2022/cs-kiosk-display
rm -rf ./node_modules
npm install

cd /home/user/CSCI490/SoftwareDesign_2022/cs-kiosk-frontend
rm -rf ./node_modules
npm install