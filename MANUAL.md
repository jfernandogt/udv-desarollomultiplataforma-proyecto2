# Manual de Usuario

Bienvenido al sistema de Microservicios de UDV Multiplataforma Parcial2. Este manual está diseñado para ayudarte a entender, de manera sencilla, el funcionamiento del programa sin necesidad de tener conocimientos técnicos o de programación.

---

## 1. ¿Qué es este programa?

Este programa es un conjunto de aplicaciones independientes (llamadas "microservicios") que trabajan juntas para gestionar y consultar información de diferentes ámbitos, como áreas científicas, carreras, departamentos, facultades, investigaciones y más. Cada uno de estos servicios se encarga de una tarea específica, por ejemplo:

- **Área Científica:** Gestiona y muestra información sobre áreas de conocimiento y las personas relacionadas.
- **Carrera:** Permite ver y gestionar información sobre carreras y facultades.
- **Departamento y Municipio:** Muestra datos administrativos y geográficos.
- **Investigaciones y Títulos:** Facilita el acceso a los registros de investigaciones y títulos.

Además, se utiliza **Kong**, un intermediario (gateway), que canaliza el acceso a todos estos servicios a través de rutas simples.

---

## 2. Requisitos para utilizar el programa

Para poder utilizar el programa, es necesario contar con lo siguiente:

- **Docker** y **Docker Compose** instalados en la máquina. Estos programas permiten ejecutar todas las aplicaciones de forma simultánea sin necesidad de configuraciones complejas.
- Acceso a un navegador web para interactuar con los servicios a través de las direcciones (URLs) proporcionadas.
- Conexión a la red local de la máquina, ya que el programa se ejecuta localmente.

_No es necesario tener conocimientos de programación para usar el sistema; se trata únicamente de acceder a las interfaces que ya han sido establecidas._

---

## 3. Cómo funciona y cómo utilizarlo

### 3.1. Ejecución del Sistema

1. **Preparación:**

   - Asegúrate de tener Docker y Docker Compose instalados en tu Mac.
   - Verifica que los puertos necesarios (por ejemplo, 3000 a 3010 para los microservicios, y 8000/8443/8001/8444 para Kong) no estén siendo utilizados por otros programas.
   - **Importante:** Antes de ejecutar el comando de arranque, corre el archivo `services/init.sh` para compilar las imágenes de todos los microservicios.

2. **Inicio del programa:**
   - Levanta el sistema completo utilizando Docker Compose. Esto iniciará la base de datos, el servicio de administración, el intermediario (Kong) y todos los microservicios.
   - Para iniciar el sistema, abre la Terminal y ejecuta el siguiente comando desde el directorio raíz del proyecto:
     ```sh
     docker-compose up --build
     ```
   - Este comando construirá y ejecutará los contenedores necesarios. Espere unos minutos hasta que todos los servicios estén activos.

### 3.2. Acceso a los Servicios

- **Acceso a través de Kong:**

  - Kong actúa como puerta de entrada (gateway) y canaliza las solicitudes a cada microservicio.
  - Utiliza tu navegador para acceder a los distintos servicios mediante rutas sencillas. Por ejemplo:
    - Para acceder a la gestión de "Área Científica":  
       `http://localhost:8000/areacientifica`
    - Para ver información sobre "Carrera":  
       `http://localhost:8000/carrera`
  - De manera similar, puedes acceder a las demás funcionalidades (departamento, facultades, investigaciones, etc.) mediante sus respectivas rutas.

- **Interfaz de Administración de Kong:**
  - Kong también expone una interfaz de administración a la que se puede acceder en:
    `http://localhost:8001`
  - Esta interfaz está destinada a administradores avanzados, pero no es necesaria para el uso diario del programa.

### 3.3. Uso del Sistema

Una vez que el sistema esté en ejecución, puedes realizar tareas como:

- Consultar información de áreas, carreras, departamentos, etc.
- Visualizar detalles completos de registros (por ejemplo, la relación entre personas e investigaciones).
- Realizar operaciones de consulta mediante las rutas establecidas.

_Recuerda que todas las respuestas y datos se presentan en formato sencillo y en lenguaje natural (JSON), lo que facilita la integración de la información en otros sistemas o herramientas._

---

## 4. Soporte y Resolución de Problemas

- **Verificación del estado del sistema:**  
  Si tienes problemas para iniciar el programa o para acceder a alguna funcionalidad, revisa que Docker Compose haya levantado todos los contenedores sin errores. En la Terminal se mostrará el estado de cada servicio.

- **Puertos y red:**  
  Asegúrate de que no existan conflictos de puertos. Una vez iniciado, los servicios estarán disponibles en los puertos especificados.

- **Actualizaciones:**  
  Si el proyecto se actualiza, es posible que se necesite reconstruir las imágenes de Docker utilizando el comando de construcción nuevamente.

---

## 5. Información final

Este sistema ha sido diseñado para simplificar la gestión de información en diferentes áreas de la UDV. Su arquitectura modular permite que todas las partes interactúen entre sí de forma eficiente, garantizando un acceso rápido y seguro a la información.
