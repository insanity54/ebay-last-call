#!/bin/bash

bindir="$(dirname "$(readlink -fm "$0")")"

if [[ ! $bindir =~ /home/ ]]; then
  echo 'This install script is not under /home/. It is only designed to work under /home/ because the path is used to derive the user to run the systemd script. (Its a DIRTY hack)'
  exit 5
fi

if [ "$EUID" -ne 0 ]; then
    sudo "$0" "$@"
    exit $?
fi

runasUser="$(pwd ${bindir} | cut -d '/' -f 3)"
runasGroup="${runasUser}"

echo "runas ${runasUser}"

# change to the directory where the application source code is at
echo "${bindir}"
cd "${bindir}"
cd ../

# generate systemd .service and .timer files
$(which node) ./src/generateServiceFile.js "${runasUser}" "${runasGroup}" | sudo tee /etc/systemd/system/ebay-last-call.service &&
$(which node) ./src/generateTimerFile.js | sudo tee /etc/systemd/system/ebay-last-call.timer &&
sudo systemctl daemon-reload &&
sudo systemctl start ebay-last-call.timer &&


mkdir -p ~/.local/share/ebay-last-call &&
cp ./src/airbus-chime.wav ~/.local/share/ebay-last-call/airbus-chime.wav
