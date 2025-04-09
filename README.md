# UDV Multiplataforma Parcial2

Este proyecto contiene múltiples microservicios construidos con Node.js y Express que interactúan con una base de datos PostgreSQL. Cada microservicio es responsable de un dominio específico y expone APIs REST. Los servicios están containerizados con Docker y orquestados usando Docker Compose. Kong se utiliza como gateway de API, configurado a través de la carpeta `kong-config`.

## Resumen de los Microservicios

1. **areacientifica**

   - **Puerto:** 3000
   - **Descripción:** Expone endpoints para gestionar "Área Científica". Devuelve el número de personas asociadas mediante la tabla `personaareacientifica`.

2. **carrera**

   - **Puerto:** 3001
   - **Descripción:** Proporciona endpoints para interactuar con registros de "Carrera". Se une con la tabla `facultad` para incluir información de la facultad.

3. **departamento**

   - **Puerto:** 3002
   - **Descripción:** Gestiona datos de "Departamento" y devuelve una lista de municipios relacionados. Los datos se agregan utilizando funciones JSON de PostgreSQL.

4. **facultades**

   - **Puerto:** 3003
   - **Descripción:** Ofrece endpoints para recuperar registros de "Facultad" junto con el conteo de personas asociadas (a través de `personafacultad`).

5. **investigaciones**

   - **Puerto:** 3004
   - **Descripción:** Expone APIs para "Investigación" y se une con `facultad` para proporcionar detalles adicionales de la facultad.

6. **investigacionpersona**

   - **Puerto:** 3005
   - **Descripción:** Gestiona la asociación entre personas e investigaciones. Devuelve detalles del investigador unidos con la investigación y la persona asociada.

7. **municipio**

   - **Puerto:** 3006
   - **Descripción:** Proporciona endpoints para "Municipio". Incluye información del departamento al unirse con la tabla `departamento`.

8. **personaareacientifica**

   - **Puerto:** 3007
   - **Descripción:** Expone APIs para gestionar la relación entre personas y áreas científicas. Se une con las tablas `persona` y `areacientifica` para obtener un detalle completo.

9. **personafacultad**

   - **Puerto:** 3008
   - **Descripción:** Ofrece endpoints para gestionar las asociaciones entre personas y facultades. Se une con `persona` y `facultad` para devolver datos detallados.

10. **personas**

    - **Puerto:** 3009
    - **Descripción:** Gestiona registros de "Persona". Se une con `municipio` y `departamento` para proporcionar contexto adicional, como detalles del lugar de nacimiento.

11. **titulo**
    - **Puerto:** 3010
    - **Descripción:** Proporciona APIs para "Título" y se une con `persona` para incluir información personal relacionada con el registro del título.

## Esquema de la Base de Datos

El esquema de la base de datos se define mediante scripts SQL en la carpeta `/database_schemas`. Estos scripts crean y poblan las tablas:

- Departamento, Municipio, Persona, Facultad, Personafacultad, Carrera, Área Científica, PersonaÁreaCientifica, Título, Investigación e InvestigaciónPersona.

## Docker y Docker Compose

- Cada microservicio tiene su propia imagen Docker creada utilizando el `Dockerfile` compartido. El proceso de creación utiliza el script `build.sh` para crear imágenes para cada servicio.
- El archivo `docker-compose.yaml` orquesta los contenedores utilizando la red `kong-network`, define volúmenes para persistir la data de PostgreSQL y especifica las dependencias entre servicios con healthchecks para garantizar que la base de datos esté lista antes de iniciar otros contenedores.
- Kong se configura mediante un archivo declarativo (`kong.yaml`) ubicado en la carpeta `kong-config` y se expone en los puertos 8000/8443 (proxy) y 8001/8444 (admin).

### Cómo Funciona docker-compose

- **Inicialización de la Base de Datos:**  
  El servicio `db` utiliza la imagen oficial de PostgreSQL. Se configuran las variables de entorno `POSTGRES_USER`, `POSTGRES_PASSWORD` y `POSTGRES_DB` para establecer la base de datos principal. Un healthcheck verifica su disponibilidad antes de que inicien los demás servicios.

- **Interconexión de Servicios:**  
  Todos los servicios dependen de la base de datos (`db`) y se inician una vez que este servicio pasa el healthcheck. Esto se garantiza mediante la directiva `depends_on` en docker-compose.

- **Persistencia de Datos:**  
  Se utiliza un volumen (`pgdata_2`) para almacenar la información de la base de datos y asegurar la persistencia de los datos.

- **Orquestación y Puertos:**  
  Cada servicio se asigna a un puerto específico en el host, permitiendo el acceso análogo a través de Kong. Gracias a Docker Compose, levantar todos los servicios es sencillo y se asegura la correcta comunicación entre ellos en la red `kong-network`.

## Cómo Construir y Ejecutar

1. **Crear Imágenes Docker:**

   Ejecuta el script de construcción desde el directorio `/services`:

   ```sh
   ./build.sh
   ```

2. **Iniciar los Contenedores:**

   Usa Docker Compose desde el directorio raíz:

   ```sh
   docker-compose up --build
   ```

3. **Acceder a los Servicios a través de Kong:**

   Kong escucha en los puertos 8000, 8443 (proxy) y 8001, 8444 (admin). Utiliza las rutas proporcionadas (por ejemplo, `/areacientifica`, `/carrera`, etc.) para acceder a cada microservicio.

## Información Adicional

- **Gestor de Paquetes:**  
  El proyecto usa npm con las dependencias definidas en `/services/package.json`.

- **Manejo de Errores:**  
  Cada servicio Express registra errores en la consola y devuelve códigos HTTP apropiados en caso de fallo.

- **Endpoints:**  
  Todos los endpoints devuelven datos en formato JSON.

Siéntete libre de extender este README con más documentación o referencias según sea necesario.
