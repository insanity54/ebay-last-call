#!/bin/bash

bindir="$(dirname "$(readlink -fm "$0")")"


if [ "$EUID" -eq 0 ]; then
  echo "try again but not as root"
  exit 5
fi


# change to the directory where the application source code is at
echo "${bindir}"
cd "${bindir}"
cd ../

# generate systemd .service and .timer files
node ./src/generateServiceFile.js $USER $USER | sudo tee /etc/systemd/system/ebay-last-call.service &&
node ./src/generateTimerFile | sudo tee /etc/systemd/system/ebay-last-call.timer &&
sudo systemctl daemon-reload
sudo systemctl start ebay-last-call.timer

# copy the audio file into the correct dir
mkdir -p ~/.local/share/ebay-last-call &&
cp ./src/airbus-chime.wav ~/.local/share/ebay-last-call/airbus-chime.wav
