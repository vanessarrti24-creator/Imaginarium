// 🧑‍🎓 Generar campos dinámicos para Estudiantes
document.getElementById('totalEstudiantes').addEventListener('input', function () {
    const total = parseInt(this.value);
    const contenedor = document.getElementById('contenedorNombresEstudiantes');
    contenedor.innerHTML = '';

    if (!isNaN(total) && total > 0) {
        for (let i = 1; i <= total; i++) {
            const div = document.createElement('div');
            div.className = 'border rounded p-3 mb-3';
            div.innerHTML = `
                <h6>Estudiante ${i}</h6>
                <div class="form-floating mb-2">
                    <input type="text" name="expediente_estudiante_${i}" class="form-control" id="expedienteEstudiante${i}" placeholder="Expediente" required>
                    <label for="expedienteEstudiante${i}">Expediente</label>
                </div>
                <div class="form-floating mb-2">
                    <input type="text" name="nombre_estudiante_${i}" class="form-control" id="nombreEstudiante${i}" placeholder="Nombre" required>
                    <label for="nombreEstudiante${i}">Nombre</label>
                </div>
                <div class="form-floating mb-2">
                    <input type="text" name="nivel_${i}" class="form-control" id="nivel${i}" placeholder="Nivel" required>
                    <label for="nivel${i}">Nivel</label>
                </div>
                <div class="form-floating mb-2">
                    <input type="text" name="carrera_estudiante_${i}" class="form-control" id="carrera${i}" placeholder="Carrera" required>
                    <label for="carrera${i}">Carrera</label>
                </div>
                <div class="form-floating mb-2">
                    <input type="text" name="grupo_estudiante_${i}" class="form-control" id="grupo${i}" placeholder="Grupo" required>
                    <label for="grupo${i}">Grupo</label>
                </div>
                <div class="form-floating mb-2">
                    <input type="text" name="tutor_${i}" class="form-control" id="tutor${i}" placeholder="Tutor" required>
                    <label for="tutor${i}">Tutor</label>
                </div>
                <div class="form-floating mb-2">
                    <input type="text" name="cuatrimestre_${i}" class="form-control" id="cuatrimestre${i}" placeholder="Cuatrimestre" required>
                    <label for="cuatrimestre${i}">Cuatrimestre</label>
                </div>
                <div class="mb-2">
                    <label class="form-label">Género</label>
                    <select name="genero_estudiante_${i}" class="form-select" required>
                        <option value="">Selecciona</option>
                        <option value="Mujer">Mujer</option>
                        <option value="Hombre">Hombre</option>
                        <option value="Otro género">Otro género</option>
                    </select>
                </div>
            `;
            contenedor.appendChild(div);
        }
    }
});

function actualizarContadoresGenero() {
    const selects = document.querySelectorAll('select[name="genero_estudiante[]"]');
    let mujeres = 0, hombres = 0, otros = 0;

    selects.forEach(select => {
        switch (select.value) {
            case 'Mujer':
                mujeres++;
                break;
            case 'Hombre':
                hombres++;
                break;
            case 'Otro género':
                otros++;
                break;
        }
    });

    document.getElementById('mujeresEstudiantes').value = mujeres;
    document.getElementById('hombresEstudiantes').value = hombres;
    document.getElementById('otroGeneroEstudiantes').value = otros;
}

// 👨‍🏫 Generar campos dinámicos para Profesores
document.getElementById('totalProfesores').addEventListener('input', function () {
    const total = parseInt(this.value);
    const contenedor = document.getElementById('contenedorNombresProfesores');
    contenedor.innerHTML = '';

    if (!isNaN(total) && total > 0) {
        for (let i = 1; i <= total; i++) {
            const div = document.createElement('div');
            div.className = 'border rounded p-3 mb-3';
            div.innerHTML = `
                <h6>Profesor ${i}</h6>
                <div class="form-floating mb-2">
                    <input type="text" name="expediente_profesor_${i}" class="form-control" id="expedienteProfesor${i}" placeholder="Expediente" required>
                    <label for="expedienteProfesor${i}">Expediente</label>
                </div>
                <div class="form-floating mb-2">
                    <input type="text" name="nombre_profesor_${i}" class="form-control" id="nombreProfesor${i}" placeholder="Nombre" required>
                    <label for="nombreProfesor${i}">Nombre</label>
                </div>
                <div class="mb-2">
                    <label class="form-label">Género</label>
                    <select name="genero_profesor_${i}" class="form-select" required>
                        <option value="">Selecciona</option>
                        <option value="Mujer">Mujer</option>
                        <option value="Hombre">Hombre</option>
                        <option value="Otro género">Otro género</option>
                    </select>
                </div>
            `;
            contenedor.appendChild(div);
        }
    }
});

function actualizarContadoresGeneroP() {
    const selects = document.querySelectorAll('select[name="genero_profesor[]"]');
    let mujeres = 0, hombres = 0, otros = 0;

    selects.forEach(select => {
        switch (select.value) {
            case 'Mujer':
                mujeres++;
                break;
            case 'Hombre':
                hombres++;
                break;
            case 'Otro género':
                otros++;
                break;
        }
    });

    document.getElementById('mujeresProfesores').value = mujeres;
    document.getElementById('hombresProfesores').value = hombres;
    document.getElementById('otroGeneroProfesores').value = otros;
}

// 📚 Generar campos dinámicos para Asignaturas
document.getElementById('totalAsignaturas').addEventListener('input', function () {
    const total = parseInt(this.value);
    const contenedor = document.getElementById('contenedorAsignaturasPE');
    contenedor.innerHTML = '';

    if (!isNaN(total) && total > 0) {
        for (let i = 1; i <= total; i++) {
            const div = document.createElement('div');
            div.className = 'form-floating mb-2';
            div.innerHTML = `
                <input type="text" name="asignatura_pe_${i}" class="form-control" id="asignaturaPE${i}" placeholder="Asignatura ${i}" required>
                <label for="asignaturaPE${i}">Asignatura ${i}</label>
            `;
            contenedor.appendChild(div);
        }
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const id = params.get('id');
    const msg = params.get('msg');

    const alertContainer = document.getElementById('alert-message');

    if (status === 'success') {
        alertContainer.innerHTML = `
            <div id="mensajeExito" class="alert alert-success alert-dismissible fade show" role="alert">
                ✅ Proyecto registrado exitosamente. ID generado: <strong>${id}</strong><br>
                <small>📌 Guarda tu ID, ya que se te pedirá para ingresar a la sala.</small>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;

        // ✅ Limpiar la URL después de mostrar el mensaje
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (status === 'error') {
        alertContainer.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ❌ Error al registrar: <strong>${decodeURIComponent(msg)}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;

        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // ⏱️ Ocultar automáticamente después de 10 segundos
    setTimeout(() => {
        const mensaje = document.getElementById('mensajeExito');
        if (mensaje) {
            mensaje.classList.remove('show');
            mensaje.classList.add('hide');
        }
    }, 10000);
});

