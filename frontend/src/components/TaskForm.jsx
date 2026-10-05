import { useEffect, useState } from "react";

function TaskForm({
    onAddTask,
    taskToEdit,
    onUpdateTask,
}) {
    const [formData, setFormData] = useState({
        nombre_proyecto: "",
        tipo_actividad: "",
        estado: "Pendiente",
        resumen: "",
        descripcion: "",
        prioridad: "Media",
        informador: "",
        persona_asignada: "",
        precondicion: "",
        fecha_creacion: "",
        fecha_cierre: "",
        sprint: "",
    });

    useEffect(() => {
        if (taskToEdit) {
            setFormData({
                // Mapeamos cada campo asegurando que si viene null/undefined, sea ""
                // (Por si en tu BD o API vienen como snake_case, puedes adaptarlo aquí)
                nombreProyecto: taskToEdit.nombreProyecto || taskToEdit.nombre_proyecto || "",
                tipoActividad: taskToEdit.tipoActividad || taskToEdit.tipo_actividad || "",
                estado: taskToEdit.estado || "Pendiente",
                resumen: taskToEdit.resumen || "",
                descripcion: taskToEdit.descripcion || "",
                prioridad: taskToEdit.prioridad || "Media",
                informador: taskToEdit.informador || "",
                personaAsignada: taskToEdit.personaAsignada || taskToEdit.persona_asignada || "",
                precondicion: taskToEdit.precondicion || "",
                fechaCreacion: taskToEdit.fechaCreacion ? taskToEdit.fechaCreacion.split('T')[0] : (taskToEdit.fecha_creacion ? taskToEdit.fecha_creacion.split('T')[0] : ""),
                fechaCierre: taskToEdit.fechaCierre ? taskToEdit.fechaCierre.split('T')[0] : (taskToEdit.fecha_cierre ? taskToEdit.fecha_cierre.split('T')[0] : ""),
                sprint: taskToEdit.sprint || "",
            });
        } else {
            limpiarFormulario();
        }
    }, [taskToEdit]);

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((datosAnteriores) => ({
            ...datosAnteriores,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const taskParaEnviar = {
            nombreProyecto: formData.nombreProyecto,
            tipoActividad: formData.tipoActividad,
            estado: formData.estado,
            resumen: formData.resumen,
            descripcion: formData.descripcion,
            prioridad: formData.prioridad,
            informador: formData.informador,
            personaAsignada: formData.personaAsignada,
            precondicion: formData.precondicion,
            fechaCreacion: formData.fechaCreacion,
            fechaCierre: formData.fechaCierre || null, // Si está vacío se manda null a la BD
            sprint: formData.sprint,
        };

        if (taskToEdit) {
            await onUpdateTask({
                ...taskParaEnviar,
                id: taskToEdit.id,
            });
        } else {
            await onAddTask(taskParaEnviar);
        }

        limpiarFormulario();
    }

    function limpiarFormulario() {
        setFormData({
            nombreProyecto: "",
            tipoActividad: "",
            estado: "Pendiente",
            resumen: "",
            descripcion: "",
            prioridad: "Media",
            informador: "",
            personaAsignada: "",
            precondicion: "",
            fechaCreacion: "",
            fechaCierre: "",
            sprint: "",
        });
    }

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <h2>
                {taskToEdit ? "Editar Tarea" : "Nueva Tarea"}
            </h2>

            <div className="form-grid">
                {/* Nombre del proyecto */}
                <div className="form-group">
                    <label>Nombre del Proyecto</label>
                    <input
                        type="text"
                        name="nombreProyecto"
                        value={formData.nombreProyecto || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Tipo de actividad */}
                <div className="form-group">
                    <label>Tipo de Actividad</label>
                    <select
                        name="tipoActividad"
                        value={formData.tipoActividad || ""}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccionar</option>
                        <option value="Desarrollo">Desarrollo</option>
                        <option value="Bug">Bug</option>
                        <option value="Prueba">Prueba</option>
                        <option value="Documentación">Documentación</option>
                    </select>
                </div>

                {/* Estado */}
                <div className="form-group">
                    <label>Estado</label>
                    <select
                        name="estado"
                        value={formData.estado || "Pendiente"}
                        onChange={handleChange}
                    >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En progreso">En progreso</option>
                        <option value="Finalizada">Finalizada</option>
                    </select>
                </div>

                {/* Prioridad */}
                <div className="form-group">
                    <label>Prioridad</label>
                    <select
                        name="prioridad"
                        value={formData.prioridad || "Media"}
                        onChange={handleChange}
                    >
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                    </select>
                </div>

                {/* Resumen */}
                <div className="form-group">
                    <label>Resumen</label>
                    <input
                        type="text"
                        name="resumen"
                        value={formData.resumen || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Sprint */}
                <div className="form-group">
                    <label>Sprint</label>
                    <input
                        type="text"
                        name="sprint"
                        value={formData.sprint || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Informador */}
                <div className="form-group">
                    <label>Informador</label>
                    <input
                        type="text"
                        name="informador"
                        value={formData.informador || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Persona asignada */}
                <div className="form-group">
                    <label>Persona asignada</label>
                    <input
                        type="text"
                        name="personaAsignada"
                        value={formData.personaAsignada || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Precondición */}
                <div className="form-group">
                    <label>Precondición</label>
                    <input
                        type="text"
                        name="precondicion"
                        value={formData.precondicion || ""}
                        onChange={handleChange}
                    />
                </div>

                {/* Fecha de creación */}
                <div className="form-group">
                    <label>Fecha de Creación</label>
                    <input
                        type="date"
                        name="fechaCreacion"
                        value={formData.fechaCreacion || ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Fecha de cierre */}
                <div className="form-group">
                    <label>Fecha de Cierre</label>
                    <input
                        type="date"
                        name="fechaCierre"
                        value={formData.fechaCierre || ""}
                        onChange={handleChange}
                    />
                </div>

                {/* Descripción */}
                <div className="form-group full">
                    <label>Descripción</label>
                    <textarea
                        name="descripcion"
                        value={formData.descripcion || ""}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <button type="submit" className="form-button">
                {taskToEdit ? "Guardar Cambios" : "Crear Tarea"}
            </button>
        </form>
    );
}

export default TaskForm;