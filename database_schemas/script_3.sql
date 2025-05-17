-- 1. TABLA: DEPARTAMENTO
SELECT setval(pg_get_serial_sequence('departamento', 'departamentoid'), (SELECT MAX(departamentoid) FROM departamento));

-- 2. TABLA: MUNICIPIO
SELECT setval(pg_get_serial_sequence('municipio', 'municipioid'), (SELECT MAX(municipioid) FROM municipio));

-- 3. TABLA: PERSONA
SELECT setval(pg_get_serial_sequence('persona', 'personaid'), (SELECT MAX(personaid) FROM persona));

-- 4. TABLA: FACULTAD
SELECT setval(pg_get_serial_sequence('facultad', 'facultadid'), (SELECT MAX(facultadid) FROM facultad));

-- 5. TABLA: PERSONAFACULTAD
SELECT setval(pg_get_serial_sequence('personafacultad', 'personafacultadid'), (SELECT MAX(personafacultadid) FROM personafacultad));

-- 6. TABLA: CARRERA
SELECT setval(pg_get_serial_sequence('carrera', 'carreraid'), (SELECT MAX(carreraid) FROM carrera));

-- 7. TABLA: AREACIENTIFICA
SELECT setval(pg_get_serial_sequence('areacientifica', 'areacientificaid'), (SELECT MAX(areacientificaid) FROM areacientifica));

-- 8. TABLA: PERSONAAREACIENTIFICA
SELECT setval(pg_get_serial_sequence('personaareacientifica', 'personaareacientificaid'), (SELECT MAX(personaareacientificaid) FROM personaareacientifica));

-- 9. TABLA: TITULO
SELECT setval(pg_get_serial_sequence('titulo', 'tituloid'), (SELECT MAX(tituloid) FROM titulo));

-- 10. TABLA: INVESTIGACION
SELECT setval(pg_get_serial_sequence('investigacion', 'investigacionid'), (SELECT MAX(investigacionid) FROM investigacion));

-- 11. TABLA: INVESTIGACIONPERSONA
SELECT setval(pg_get_serial_sequence('investigacionpersona', 'investigacionpersonaid'), (SELECT MAX(investigacionpersonaid) FROM investigacionpersona));