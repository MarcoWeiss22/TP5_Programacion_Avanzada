const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensaje: "Backend funcionando",
    });
});

app.get("/tasks", async (req, res) => {
    try {
        const resultado = await pool.query(
            "SELECT * FROM tasks ORDER BY id ASC"
        );

        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al obtener las tareas",
        });
    }
});

app.post("/tasks", async (req, res) => {
    try {
        const {
            nombreProyecto,
            tipoActividad,
            estado,
            resumen,
            descripcion,
            prioridad,
            informador,
            personaAsignada,
            precondicion,
            fechaCreacion,
            fechaCierre,
            sprint,
        } = req.body;

        const resultado = await pool.query(
            `INSERT INTO tasks (
        nombre_proyecto,
        tipo_actividad,
        estado,
        resumen,
        descripcion,
        prioridad,
        informador,
        persona_asignada,
        precondicion,
        fecha_creacion,
        fecha_cierre,
        sprint
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *`,
            [
                nombreProyecto,
                tipoActividad,
                estado,
                resumen,
                descripcion,
                prioridad,
                informador,
                personaAsignada,
                precondicion,
                fechaCreacion,
                fechaCierre || null,
                sprint,
            ]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al crear la tarea",
        });
    }
});

app.delete("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM tasks WHERE id = $1",
            [id]
        );

        res.json({
            mensaje: "Tarea eliminada",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al eliminar la tarea",
        });
    }
});

app.put("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nombreProyecto,
            tipoActividad,
            estado,
            resumen,
            descripcion,
            prioridad,
            informador,
            personaAsignada,
            precondicion,
            fechaCreacion,
            fechaCierre,
            sprint,
        } = req.body;

        const resultado = await pool.query(
            `UPDATE tasks
       SET
         nombre_proyecto = $1,
         tipo_actividad = $2,
         estado = $3,
         resumen = $4,
         descripcion = $5,
         prioridad = $6,
         informador = $7,
         persona_asignada = $8,
         precondicion = $9,
         fecha_creacion = $10,
         fecha_cierre = $11,
         sprint = $12
       WHERE id = $13
       RETURNING *`,
            [
                nombreProyecto,
                tipoActividad,
                estado,
                resumen,
                descripcion,
                prioridad,
                informador,
                personaAsignada,
                precondicion,
                fechaCreacion,
                fechaCierre || null,
                sprint,
                id,
            ]
        );

        res.json(resultado.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al actualizar la tarea",
        });
    }
});

app.patch("/tasks/:id/finish", async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            `UPDATE tasks
       SET estado = 'Finalizada'
       WHERE id = $1
       RETURNING *`,
            [id]
        );

        res.json(resultado.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error al finalizar la tarea",
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Backend funcionando en http://localhost:${PORT}`);
});