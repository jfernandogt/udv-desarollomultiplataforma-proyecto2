-- =====================================================================
-- 1. TABLA: DEPARTAMENTO
-- =====================================================================
CREATE TABLE departamento (
    departamentoid SERIAL PRIMARY KEY,
    nombre         VARCHAR(100) NOT NULL
);

-- =====================================================================
-- 2. TABLA: MUNICIPIO
--    Relación: municipio.departamentoid -> departamento.departamentoid
-- =====================================================================
CREATE TABLE municipio (
    municipioid    SERIAL PRIMARY KEY,
    nombre         VARCHAR(100) NOT NULL,
    departamentoid INT          NOT NULL,
    CONSTRAINT fk_municipio_departamento
        FOREIGN KEY (departamentoid)
        REFERENCES departamento (departamentoid)
);

-- =====================================================================
-- 3. TABLA: PERSONA
--    Relación: persona.municipioidnacimiento -> municipio.municipioid
-- =====================================================================
CREATE TABLE persona (
    personaid              SERIAL PRIMARY KEY,
    nombres                VARCHAR(100),
    apellidos              VARCHAR(100),
    telefono               VARCHAR(20),
    celular                VARCHAR(20),
    correo                 VARCHAR(100),
    direccion              VARCHAR(255),
    municipioidnacimiento  INT,
    fechanacimiento        DATE,
    cui                    VARCHAR(25),
    pasaporte              VARCHAR(25),
    tiporol                VARCHAR(50),
    CONSTRAINT fk_persona_municipio
        FOREIGN KEY (municipioidnacimiento)
        REFERENCES municipio (municipioid)
);

-- =====================================================================
-- 4. TABLA: FACULTAD
-- =====================================================================
CREATE TABLE facultad (
    facultadid SERIAL PRIMARY KEY,
    nombre     VARCHAR(100) NOT NULL,
    siglas     VARCHAR(20),
    telefono   VARCHAR(20),
    correo     VARCHAR(100)
);

-- =====================================================================
-- 5. TABLA: PERSONAFACULTAD
--    Relación: personafacultad.facultadid -> facultad.facultadid
--              personafacultad.personaid -> persona.personaid
-- =====================================================================
CREATE TABLE personafacultad (
    personafacultadid SERIAL PRIMARY KEY,
    facultadid        INT NOT NULL,
    personaid         INT NOT NULL,
    CONSTRAINT fk_personafacultad_facultad
        FOREIGN KEY (facultadid)
        REFERENCES facultad (facultadid),
    CONSTRAINT fk_personafacultad_persona
        FOREIGN KEY (personaid)
        REFERENCES persona (personaid)
);

-- =====================================================================
-- 6. TABLA: CARRERA
--    Relación: carrera.facultadid -> facultad.facultadid
-- =====================================================================
CREATE TABLE carrera (
    carreraid  SERIAL PRIMARY KEY,
    facultadid INT          NOT NULL,
    nombre     VARCHAR(100) NOT NULL,
    CONSTRAINT fk_carrera_facultad
        FOREIGN KEY (facultadid)
        REFERENCES facultad (facultadid)
);

-- =====================================================================
-- 7. TABLA: AREACIENTIFICA
-- =====================================================================
CREATE TABLE areacientifica (
    areacientificaid SERIAL PRIMARY KEY,
    nombre           VARCHAR(100) NOT NULL
);

-- =====================================================================
-- 8. TABLA: PERSONAAREACIENTIFICA
--    Relación: personaareacientifica.areacientificaid -> areacientifica.areacientificaid
--              personaareacientifica.personaid -> persona.personaid
-- =====================================================================
CREATE TABLE personaareacientifica (
    personaareacientificaid SERIAL PRIMARY KEY,
    areacientificaid        INT NOT NULL,
    personaid               INT NOT NULL,
    CONSTRAINT fk_pac_area
        FOREIGN KEY (areacientificaid)
        REFERENCES areacientifica (areacientificaid),
    CONSTRAINT fk_pac_persona
        FOREIGN KEY (personaid)
        REFERENCES persona (personaid)
);

-- =====================================================================
-- 9. TABLA: TITULO
--    Relación: titulo.personaid -> persona.personaid
-- =====================================================================
CREATE TABLE titulo (
    tituloid      SERIAL PRIMARY KEY,
    personaid     INT NOT NULL,
    nivel         VARCHAR(100),
    nombretitulo  VARCHAR(255),
    institucion   VARCHAR(255),
    anioobtencion INT,
    CONSTRAINT fk_titulo_persona
        FOREIGN KEY (personaid)
        REFERENCES persona (personaid)
);

-- =====================================================================
-- 10. TABLA: INVESTIGACION
--     Relación: investigacion.facultadid -> facultad.facultadid
-- =====================================================================
CREATE TABLE investigacion (
    investigacionid SERIAL PRIMARY KEY,
    facultadid      INT          NOT NULL,
    anio            INT,
    titulo          VARCHAR(255),
    duracion        INT,
    CONSTRAINT fk_investigacion_facultad
        FOREIGN KEY (facultadid)
        REFERENCES facultad (facultadid)
);

-- =====================================================================
-- 11. TABLA: INVESTIGACIONPERSONA
--     Relación: investigacionpersona.investigacionid -> investigacion.investigacionid
--               investigacionpersona.personaid -> persona.personaid
-- =====================================================================
CREATE TABLE investigacionpersona (
    investigacionpersonaid SERIAL PRIMARY KEY,
    investigacionid        INT NOT NULL,
    personaid              INT NOT NULL,
    CONSTRAINT fk_ip_investigacion
        FOREIGN KEY (investigacionid)
        REFERENCES investigacion (investigacionid),
    CONSTRAINT fk_ip_persona
        FOREIGN KEY (personaid)
        REFERENCES persona (personaid)
);