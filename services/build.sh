#!/bin/bash

# Salir del script si algún comando falla
set -e

# Definir el array de servicios (agrega o quita los nombres según corresponda)
services=("areacientifica" "carrera" "departamento" "facultades" "investigaciones" "investigacionpersona" "municipio" "personaareacientifica" "personafacultad" "personas" "titulo")

# Obtener el directorio en el que se encuentra este script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Iterar sobre cada servicio en el array
for service_name in "${services[@]}"; do
    # Definir el Dockerfile para el servicio (por ejemplo, "Dockerfile_personas")
    dockerfile="$SCRIPT_DIR/Dockerfile"

    echo "Construyendo imagen Docker para el servicio: $service_name usando $dockerfile"
    docker build -f "$dockerfile" -t "${service_name}_service:latest" --build-arg file="${service_name}.js" "$SCRIPT_DIR"
    echo "La imagen Docker para $service_name se ha construido exitosamente."
done
