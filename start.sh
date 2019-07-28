#!/bin/bash

SCRIPT_DIR=$(cd $(dirname $0); pwd)

. ${SCRIPT_DIR}/.env

sudo -u pi /usr/bin/node /usr/bin/forever start -a -d /home/pi/src/github.com/tamanishi/dictateEnvServer/server.js
autossh -f -M 0 -N -R ${SUBDOMAIN}:80:localhost:8080 serveo.net

