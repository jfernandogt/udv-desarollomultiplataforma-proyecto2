-- =============================================
-- DATOS INICIALES PARA DEPARTAMENTO
-- =============================================
INSERT INTO departamento (departamentoid, nombre)
VALUES 
(1, 'Guatemala'),
(2, 'Sacatepéquez'),
(3, 'Quetzaltenango');

-- =============================================
-- DATOS INICIALES PARA MUNICIPIO
-- Relación: municipio.departamentoid -> departamento.departamentoid
-- =============================================
INSERT INTO municipio (municipioid, nombre, departamentoid)
VALUES
(1, 'Guatemala', 1),
(2, 'Mixco', 1),
(3, 'Antigua Guatemala', 2),
(4, 'Ciudad Vieja', 2),
(5, 'Quetzaltenango', 3),
(6, 'Salcajá', 3);

-- =============================================
-- DATOS INICIALES PARA PERSONA
-- Relación: persona.municipioidnacimiento -> municipio.municipioid
-- =============================================
INSERT INTO persona (
    personaid, nombres, apellidos, telefono, celular, correo,
    direccion, municipioidnacimiento, fechanacimiento, cui,
    pasaporte, tiporol
)
VALUES
(1, 'Juan Carlos', 'Pérez García', '2334-5678', '5400-1122', 'juan.perez@example.com',
    'Zona 1, Ciudad de Guatemala', 1, '1985-03-15', '1234567890101', 'P123456', 'Estudiante'),
(2, 'María Fernanda', 'López Morales', '2345-6789', '5500-3311', 'maria.lopez@example.com',
    'Zona 3, Mixco', 2, '1990-07-22', '2345678901202', 'P234567', 'Profesor'),
(3, 'Ana Sofía', 'González De León', '2455-6677', '5512-3344', 'ana.gonzalez@example.com',
    'Centro, Antigua Guatemala', 3, '1988-12-05', '3456789012303', 'P345678', 'Investigador'),
(4, 'Pedro José', 'Ramírez López', '2211-4455', '5533-7766', 'pedro.ramirez@example.com',
    '4ta Avenida, Ciudad Vieja', 4, '1995-09-10', '4567890123404', 'P456789', 'Estudiante'),
(5, 'Lucía María', 'Hernández Fuentes', '7788-8899', '5511-2233', 'lucia.hernandez@example.com',
    'Zona 1, Quetzaltenango', 5, '1980-01-19', '5678901234505', 'P567890', 'Administrador');

-- =============================================
-- DATOS PARA FACULTAD
-- =============================================
INSERT INTO facultad (facultadid, nombre, siglas, telefono, correo)
VALUES
(1, 'Facultad de Ingeniería', 'FING', '2200-1122', 'fing@example.com'),
(2, 'Facultad de Humanidades', 'FHUM', '2200-3344', 'fhum@example.com');

-- =============================================
-- DATOS PARA PERSONAFACULTAD
--    FK: facultadid -> facultad
--        personaid  -> persona
-- =============================================
INSERT INTO personafacultad (personafacultadid, facultadid, personaid)
VALUES
(1, 1, 1),  -- Juan Carlos en Facultad de Ingeniería
(2, 1, 2),  -- María Fernanda en Facultad de Ingeniería
(3, 2, 3),  -- Ana Sofía en Facultad de Humanidades
(4, 2, 4),  -- Pedro José en Facultad de Humanidades
(5, 1, 5);  -- Lucía María en Facultad de Ingeniería

-- =============================================
-- DATOS PARA CARRERA
--    FK: carrera.facultadid -> facultad.facultadid
-- =============================================
INSERT INTO carrera (carreraid, facultadid, nombre)
VALUES
(1, 1, 'Ingeniería en Sistemas'),
(2, 1, 'Ingeniería Industrial'),
(3, 2, 'Pedagogía'),
(4, 2, 'Psicología');

-- =============================================
-- DATOS PARA AREACIENTIFICA
-- =============================================
INSERT INTO areacientifica (areacientificaid, nombre)
VALUES
(1, 'Tecnología'),
(2, 'Educación'),
(3, 'Ciencias Sociales');

-- =============================================
-- DATOS PARA PERSONAAREACIENTIFICA
--    FK: personaareacientifica.areacientificaid -> areacientifica.areacientificaid
--        personaareacientifica.personaid        -> persona.personaid
-- =============================================
INSERT INTO personaareacientifica (personaareacientificaid, areacientificaid, personaid)
VALUES
(1, 1, 3), -- Ana Sofía en área Tecnología
(2, 2, 2), -- María Fernanda en área Educación
(3, 3, 5); -- Lucía María en área Ciencias Sociales

-- =============================================
-- DATOS PARA TITULO
--    FK: titulo.personaid -> persona.personaid
-- =============================================
INSERT INTO titulo (tituloid, personaid, nivel, nombretitulo, institucion, anioobtencion)
VALUES
(1, 1, 'Licenciatura', 'Lic. en Administración de Empresas', 'Universidad de San Carlos de Guatemala', 2010),
(2, 3, 'Maestría', 'Maestría en Educación', 'Universidad del Valle de Guatemala', 2015),
(3, 2, 'Doctorado', 'PhD en Ciencias de la Computación', 'Universidad de California', 2018);

-- =============================================
-- DATOS PARA INVESTIGACION
--    FK: investigacion.facultadid -> facultad.facultadid
-- =============================================
INSERT INTO investigacion (investigacionid, facultadid, anio, titulo, duracion)
VALUES
(1, 1, 2022, 'Análisis de Sistemas Distribuidos', 12),
(2, 2, 2021, 'Metodologías de Enseñanza Virtual', 8);

-- =============================================
-- DATOS PARA INVESTIGACIONPERSONA
--    FK: investigacionpersona.investigacionid -> investigacion.investigacionid
--        investigacionpersona.personaid       -> persona.personaid
-- =============================================
INSERT INTO investigacionpersona (investigacionpersonaid, investigacionid, personaid)
VALUES
(1, 1, 3), -- Ana Sofía participa en investigación de Ingeniería
(2, 2, 2); -- María Fernanda participa en investigación de Humanidades