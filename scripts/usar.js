// Autocompletar nombre del proyecto
document.getElementById("id_proyecto4").addEventListener("input", function () {
  const id = this.value.trim();
  const nombreInput = document.getElementById("nombreProyecto");

  if (id === "") {
    nombreInput.value = "";
    return;
  }

  fetch(`usar.php?id=${id}`)
    .then(response => response.json())
    .then(data => {
      nombreInput.value = data.nombre_proyecto || "No encontrado";
    })
    .catch(error => {
      console.error("Error al buscar el nombre del proyecto:", error);
      nombreInput.value = "Error al cargar";
    });
});

const reservas = [];

function mostrarFechaSeleccionada() {
  const fecha = document.getElementById("dia_horario").value;
  if (fecha) {
    document.getElementById('resultadoDisponibilidad').innerHTML =
      `<p class="text-primary">Has seleccionado el día <strong>${fecha}</strong>.</p>`;
  }
}

function guardarReserva() {
  const btn = document.querySelector("button.btn-primary, button.btn-success");

  const id_proyecto4 = document.getElementById("id_proyecto4").value.trim();
  const nombreProyecto = document.getElementById("nombreProyecto").value.trim();
  const dia_horario = document.getElementById("dia_horario").value;
  const horaInicio = document.getElementById("horaInicio").value;
  const horaFin = document.getElementById("horaFin").value;
  const resultado = document.getElementById("resultadoDisponibilidad");

  if (!id_proyecto4 || !nombreProyecto || !dia_horario || !horaInicio || !horaFin) {
    alert("Por favor, llena todos los campos.");
    return;
  }

  if (horaFin <= horaInicio) {
    alert("La hora de fin debe ser mayor que la de inicio.");
    return;
  }

  fetch("usar.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      id_proyecto4: id_proyecto4,
      nombre_proyecto: nombreProyecto,
      dia_horario: dia_horario,
      hora_inicio: horaInicio,
      hora_fin: horaFin
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const yaExiste = reservas.some(r =>
        r.nombreProyecto === nombreProyecto &&
        r.dia_horario === dia_horario &&
        r.horaInicio === horaInicio &&
        r.horaFin === horaFin
      );

      if (!yaExiste) {
        reservas.push({ nombreProyecto, dia_horario, horaInicio, horaFin });
        actualizarListaReservas();
      } else {
        console.warn("Reserva duplicada detectada, no se agregará.");
      }

      resultado.innerHTML = `
        <p class="text-success">
          Reserva guardada:<br>
          <strong>${nombreProyecto}</strong><br>
          Fecha: <strong>${dia_horario}</strong><br>
          Hora: <strong>${horaInicio}</strong> a <strong>${horaFin}</strong>
        </p>`;

      btn.classList.add("btn-success");
      btn.classList.remove("btn-primary");
      btn.textContent = "Reserva Guardada";

      setTimeout(() => {
        document.getElementById("id_proyecto4").value = "";
        document.getElementById("nombreProyecto").value = "";
        document.getElementById("horaInicio").value = "";
        document.getElementById("horaFin").value = "";
        document.getElementById("dia_horario").value = "";

        btn.classList.remove("btn-success");
        btn.classList.add("btn-primary");
        btn.textContent = "Guardar Reserva";

        resultado.innerHTML = "Selecciona una fecha para ver la disponibilidad.";
      }, 1500);
    } else {
      alert("Error al guardar en la base de datos: " + data.error);
    }
  })
  .catch(error => {
    console.error("Error al enviar la reserva:", error);
    alert("Error de conexión con el servidor.");
  });
}

function actualizarListaReservas() {
  const lista = document.getElementById("listaReservas");
  lista.innerHTML = "";

  if (reservas.length === 0) {
    lista.innerHTML = '<li class="list-group-item text-muted">No hay reservas registradas.</li>';
    return;
  }

  reservas.sort((a, b) => a.dia_horario.localeCompare(b.dia_horario));

  reservas.forEach(r => {
    const item = document.createElement("li");
    item.classList.add("list-group-item");
    item.innerHTML = `
      <strong>${r.dia_horario}</strong><br>
      Proyecto: ${r.nombreProyecto}<br>
      Hora: ${r.horaInicio} - ${r.horaFin}
    `;
    lista.appendChild(item);
  });
}

// Cargar reservas al iniciar
window.addEventListener("DOMContentLoaded", () => {
  fetch("usar.php?listar=1")
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data)) {
        reservas.length = 0;
        data.forEach(r => {
          reservas.push({
            nombreProyecto: r.nombre_proyecto,
            dia_horario: r.dia_horario,
            horaInicio: r.hora_inicio,
            horaFin: r.hora_fin
          });
        });
        actualizarListaReservas();
      }
    })
    .catch(error => {
      console.error("Error al cargar reservas:", error);
    });
});
