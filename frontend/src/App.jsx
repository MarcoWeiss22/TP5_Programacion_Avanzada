import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import "./App.css";

const API_URL = "http://localhost:3000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    cargarTareas();
  }, []);

  async function cargarTareas() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      console.log("📥 Tareas cargadas:", data);
      setTasks([...data]); // <--- Creamos un arreglo completamente nuevo
    } catch (error) {
      console.error("❌ Error al cargar tareas:", error);
    }
  }

  async function agregarTarea(task) {
    try {
      console.log("📤 Enviando nueva tarea:", task);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      const nuevaTarea = await response.json();
      console.log("✅ Tarea creada con éxito:", nuevaTarea);

      await cargarTareas(); // Refrescar lista completa
    } catch (error) {
      console.error("❌ Error al crear tarea:", error);
    }
  }

  function editarTarea(task) {
    console.log("✏️ Seleccionada para editar:", task);
    setTaskToEdit(task);
  }

  async function actualizarTarea(taskActualizada) {
    try {
      console.log(`📤 Actualizando tarea ID ${taskActualizada.id}:`, taskActualizada);
      const response = await fetch(`${API_URL}/${taskActualizada.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskActualizada),
      });

      if (!response.ok) throw new Error("Error al actualizar en el servidor");

      console.log("✅ Actualización en BD exitosa. Recargando lista...");

      // Forzamos la recarga inmediata de la BD
      await cargarTareas();
      setTaskToEdit(null);
    } catch (error) {
      console.error("❌ Error al actualizar tarea:", error);
    }
  }

  async function eliminarTarea(id) {
    try {
      console.log(`🗑️ Eliminando tarea ID ${id}`);
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      console.log("✅ Tarea eliminada correctamente");

      setTasks((tareasAnteriores) =>
        tareasAnteriores.filter((task) => task.id !== id)
      );
    } catch (error) {
      console.error("❌ Error al eliminar tarea:", error);
    }
  }

  async function finalizarTarea(id) {
    try {
      console.log(`🏁 Finalizando tarea ID ${id}`);
      const response = await fetch(`${API_URL}/${id}/finish`, {
        method: "PATCH",
      });

      if (!response.ok) throw new Error("Error al finalizar");

      // Actualizamos el estado localmente de inmediato buscando la tarea y cambiando su estado
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id
            ? { ...task, estado: "Finalizada", fecha_cierre: new Date().toISOString() }
            : task
        )
      );

      // Y luego recargamos de la base de datos por seguridad
      await cargarTareas();
    } catch (error) {
      console.error("❌ Error al finalizar tarea:", error);
    }
  }

  return (
    <div className="app">
      <h1>Gestor de Tareas</h1>

      <TaskForm
        onAddTask={agregarTarea}
        taskToEdit={taskToEdit}
        onUpdateTask={actualizarTarea}
      />

      <h2>Listado de Tareas</h2>

      {tasks.length === 0 && <p>No hay tareas cargadas.</p>}

      <div className="task-list">
        {tasks.map((task) => (
          <div className="task-card" key={task.id}>
            <h3>{task.nombre_proyecto}</h3>

            <p><strong>Tipo:</strong> {task.tipo_actividad}</p>
            <p><strong>Estado:</strong> {task.estado}</p>
            <p><strong>Prioridad:</strong> {task.prioridad}</p>
            <p><strong>Resumen:</strong> {task.resumen}</p>
            <p><strong>Descripción:</strong> {task.descripcion}</p>
            <p><strong>Informador:</strong> {task.informador}</p>
            <p><strong>Persona asignada:</strong> {task.persona_asignada}</p>
            <p><strong>Precondición:</strong> {task.precondicion}</p>
            <p><strong>Fecha de creación:</strong> {task.fecha_creacion ? task.fecha_creacion.split("T")[0] : ""}</p>
            <p><strong>Fecha de cierre:</strong> {task.fecha_cierre ? task.fecha_cierre.split("T")[0] : "Sin definir"}</p>
            <p><strong>Sprint:</strong> {task.sprint}</p>

            <div className="task-buttons">
              <button type="button" onClick={() => editarTarea(task)}>
                Editar
              </button>
              <button type="button" onClick={() => eliminarTarea(task.id)}>
                Eliminar
              </button>
              <button type="button" onClick={() => finalizarTarea(task.id)}>
                Finalizar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;