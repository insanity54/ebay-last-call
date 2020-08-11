#!/bin/bash

bindir="$(dirname "$(readlink -fm "$0")")"
echo "${bindir}"
cd "${bindir}"
cd ../

$(which node) ./src/generateServiceFile.js | sudo tee /etc/systemd/system/ebay-last-call.service &&
$(which node) ./src/generateTimerFile.js | sudo tee /etc/systemd/system/ebay-last-call.timer &&
sudo systemctl daemon-reload &&
sudo systemctl start ebay-last-call.timer &&
mkdir -p ~/.local/share/ebay-last-call &&
cp ./src/airbus-chime.wav ~/.local/share/ebay-last-call/airbus-chime.wav
