#!/bin/bash

# Definir el directorio base
BASE_DIR="/home/ubuntu/test_app"

# Función para ejecutar y mostrar mensajes
run_command() {
  echo "Running: $1"
  eval $1
  if [ $? -ne 0 ]; then
    echo "Error executing: $1"
    exit 1
  fi
}

# Cambiar al directorio base
cd $BASE_DIR || { echo "Directory not found: $BASE_DIR"; exit 1; }

# 1. git pull origin main en test_app si hay cambios
echo "Checking for changes in repository..."
git fetch origin main
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})
if [ $LOCAL = $REMOTE ]; then
    echo "No changes detected in the repository."
else
    echo "Changes detected, pulling updates..."
    run_command "git pull origin main"

    # 2. npm i y npm run dev en BackEnd
    cd "${BASE_DIR}/BackEnd" || { echo "Directory not found: ${BASE_DIR}/BackEnd"; exit 1; }
    run_command "npm install"
    run_command "npm run dev &" # Ejecutar npm run dev en segundo plano

    # 3. sudo npm i, sudo npm run build y sudo npm run start en FrontEnd
    cd "${BASE_DIR}/FrontEnd" || { echo "Directory not found: ${BASE_DIR}/FrontEnd"; exit 1; }
    run_command "sudo npm install"
    run_command "sudo npm run build"
    run_command "sudo npm run start &" # Ejecutar npm run start en segundo plano
fi

echo "All tasks completed successfully."
