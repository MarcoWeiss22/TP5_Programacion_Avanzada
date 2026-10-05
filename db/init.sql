CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    nombre_proyecto VARCHAR(100) NOT NULL,
    tipo_actividad VARCHAR(50),
    estado VARCHAR(50),
    resumen TEXT,
    descripcion TEXT,
    prioridad VARCHAR(20),
    informador VARCHAR(50),
    persona_asignada VARCHAR(50),
    precondicion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre TIMESTAMP,
    sprint VARCHAR(50)
);