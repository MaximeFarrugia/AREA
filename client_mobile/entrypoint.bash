#!/bin/bash

cd /workspace
npm i
expo login -u ${EXPO_LOGIN} -p '${EXPO_PASSWORD}'
expo build:android -t apk