// ==========================================
// CONTROLADOR DE TAREAS
// ==========================================


// ELEMENTOS

const formulario =
    document.getElementById("formularioTarea");

const estudianteInput =
    document.getElementById("estudiante");

const materiaInput =
    document.getElementById("materia");

const fechaInput =
    document.getElementById("fecha");

const tituloInput =
    document.getElementById("titulo");

const descripcionInput =
    document.getElementById("descripcion");

const archivoInput =
    document.getElementById("archivo");

const archivoSeleccionado =
    document.getElementById(
        "archivoSeleccionado"
    );

const listaTareas =
    document.getElementById("listaTareas");

const mensajeVacio =
    document.getElementById("mensajeVacio");

const buscarInput =
    document.getElementById("buscar");

const filtroEstado =
    document.getElementById("filtroEstado");

const filtroEstudiante =
    document.getElementById("filtroEstudiante");

const btnGuardar =
    document.getElementById("btnGuardar");

const btnCancelar =
    document.getElementById("btnCancelar");

const totalTareas =
    document.getElementById("totalTareas");

const pendientes =
    document.getElementById("pendientes");

const completadas =
    document.getElementById("completadas");

const contador =
    document.getElementById("contador");


// ==========================================
// VARIABLES
// ==========================================

let tareas =
    JSON.parse(
        localStorage.getItem(
            "tareasColegio"
        )
    ) || [];


let tareaEditando = null;


// ==========================================
// ARCHIVO SELECCIONADO
// ==========================================

archivoInput.addEventListener(
    "change",
    function() {

        const archivo =
            archivoInput.files[0];


        if (!archivo) {

            archivoSeleccionado.style.display =
                "none";

            return;

        }


        archivoSeleccionado.style.display =
            "block";


        archivoSeleccionado.innerHTML = `

            📎 <strong>
            Archivo seleccionado:
            </strong>

            ${escapeHTML(
                archivo.name
            )}

        `;

    }
);


// ==========================================
// GUARDAR EN LOCALSTORAGE
// ==========================================

function guardarTareas() {

    localStorage.setItem(

        "tareasColegio",

        JSON.stringify(tareas)

    );

}


// ==========================================
// FORMULARIO
// ==========================================

formulario.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const estudiante =
            estudianteInput.value.trim();

        const materia =
            materiaInput.value.trim();

        const fecha =
            fechaInput.value;

        const titulo =
            tituloInput.value.trim();

        const descripcion =
            descripcionInput.value.trim();


        if (
            !estudiante ||
            !materia ||
            !fecha ||
            !titulo
        ) {

            alert(
                "Completa los campos obligatorios."
            );

            return;

        }


        // ==================================
        // ARCHIVO
        // ==================================

        let archivo = null;


        if (
            archivoInput.files &&
            archivoInput.files[0]
        ) {

            const archivoOriginal =
                archivoInput.files[0];


            // Convertir archivo a Base64
            // para almacenamiento local

            const datos =
                await convertirArchivo(
                    archivoOriginal
                );


            archivo = {

                nombre:
                    archivoOriginal.name,

                tipo:
                    archivoOriginal.type,

                tamaño:
                    archivoOriginal.size,

                datos:
                    datos

            };

        }


        // ==================================
        // EDITAR
        // ==================================

        if (
            tareaEditando !== null
        ) {

            const tarea =
                tareas.find(
                    tarea =>
                        tarea.id ===
                        tareaEditando
                );


            if (tarea) {

                tarea.estudiante =
                    estudiante;

                tarea.materia =
                    materia;

                tarea.fecha =
                    fecha;

                tarea.titulo =
                    titulo;

                tarea.descripcion =
                    descripcion;


                // Solo cambiar archivo
                // si se seleccionó uno nuevo

                if (archivo) {

                    tarea.archivo =
                        archivo;

                }

            }


            tareaEditando =
                null;


            btnGuardar.textContent =
                "💾 Guardar tarea";


            btnCancelar.style.display =
                "none";

        }


        // ==================================
        // NUEVA TAREA
        // ==================================

        else {

            const nuevaTarea = {

                id:
                    Date.now(),

                estudiante:
                    estudiante,

                materia:
                    materia,

                fecha:
                    fecha,

                titulo:
                    titulo,

                descripcion:
                    descripcion,

                archivo:
                    archivo,

                completada:
                    false

            };


            tareas.push(
                nuevaTarea
            );

        }


        guardarTareas();


        formulario.reset();


        archivoSeleccionado.style.display =
            "none";


        mostrarTareas();

    }
);


// ==========================================
// CONVERTIR ARCHIVO A BASE64
// ==========================================

function convertirArchivo(archivo) {

    return new Promise(
        (resolve, reject) => {

            const lector =
                new FileReader();


            lector.onload =
                () => resolve(
                    lector.result
                );


            lector.onerror =
                error => reject(
                    error
                );


            lector.readAsDataURL(
                archivo
            );

        }
    );

}


// ==========================================
// MOSTRAR TAREAS
// ==========================================

function mostrarTareas() {

    listaTareas.innerHTML = "";


    const busqueda =
        buscarInput.value
        .toLowerCase()
        .trim();


    const estado =
        filtroEstado.value;


    const estudianteSeleccionado =
        filtroEstudiante.value;


    const filtradas =
        tareas.filter(
            tarea => {


                const coincideBusqueda =

                    tarea.estudiante
                        .toLowerCase()
                        .includes(busqueda)

                    ||

                    tarea.titulo
                        .toLowerCase()
                        .includes(busqueda)

                    ||

                    tarea.materia
                        .toLowerCase()
                        .includes(busqueda);


                let coincideEstado =
                    true;


                if (
                    estado ===
                    "pendientes"
                ) {

                    coincideEstado =
                        !tarea.completada;

                }


                if (
                    estado ===
                    "completadas"
                ) {

                    coincideEstado =
                        tarea.completada;

                }


                let coincideEstudiante =
                    true;


                if (
                    estudianteSeleccionado
                    !==
                    "todos"
                ) {

                    coincideEstudiante =
                        tarea.estudiante ===
                        estudianteSeleccionado;

                }


                return (

                    coincideBusqueda &&
                    coincideEstado &&
                    coincideEstudiante

                );

            }
        );


    // MENSAJE VACÍO

    if (
        filtradas.length === 0
    ) {

        mensajeVacio.style.display =
            "block";

    } else {

        mensajeVacio.style.display =
            "none";

    }


    // CREAR TARJETAS

    filtradas.forEach(
        tarea => {


            const tarjeta =
                document.createElement(
                    "article"
                );


            tarjeta.className =
                "tarea";


            if (
                tarea.completada
            ) {

                tarjeta.classList.add(
                    "completada"
                );

            }


            let archivoHTML = "";


            if (tarea.archivo) {

                archivoHTML = `

                    <div class="archivo-tarea">

                        <strong>
                            📎 Archivo de la tarea
                        </strong>

                        <p>
                            ${escapeHTML(
                                tarea.archivo.nombre
                            )}
                        </p>

                        <br>

                        <a
                            href="${tarea.archivo.datos}"
                            target="_blank"
                            class="btn-archivo"
                            download="${escapeHTML(
                                tarea.archivo.nombre
                            )}"
                        >
                            👁️ Ver / descargar tarea
                        </a>

                    </div>

                `;

            }


            tarjeta.innerHTML = `

                <div class="estudiante">

                    👤 ${escapeHTML(
                        tarea.estudiante
                    )}

                </div>


                <h3 class="titulo-tarea">

                    ${escapeHTML(
                        tarea.titulo
                    )}

                </h3>


                <span class="materia">

                    📚 ${escapeHTML(
                        tarea.materia
                    )}

                </span>


                <p class="descripcion">

                    ${escapeHTML(
                        tarea.descripcion ||
                        "Sin descripción"
                    )}

                </p>


                <p class="fecha">

                    📅 Fecha de entrega:

                    <strong>
                        ${formatearFecha(
                            tarea.fecha
                        )}
                    </strong>

                </p>


                ${archivoHTML}


                <div class="acciones">


                    <button
                        class="btn btn-completar"
                        onclick="cambiarEstado(${tarea.id})"
                    >

                        ${
                            tarea.completada
                            ? "↩️ Marcar pendiente"
                            : "✅ Completar"
                        }

                    </button>


                    <button
                        class="btn btn-editar"
                        onclick="editarTarea(${tarea.id})"
                    >

                        ✏️ Editar

                    </button>


                    <button
                        class="btn btn-eliminar"
                        onclick="eliminarTarea(${tarea.id})"
                    >

                        🗑️ Eliminar

                    </button>


                </div>

            `;


            listaTareas.appendChild(
                tarjeta
            );

        }
    );


    actualizarEstadisticas();

    actualizarFiltroEstudiantes();

}


// ==========================================
// EDITAR
// ==========================================

function editarTarea(id) {


    const tarea =
        tareas.find(
            tarea =>
                tarea.id === id
        );


    if (!tarea) return;


    estudianteInput.value =
        tarea.estudiante;

    materiaInput.value =
        tarea.materia;

    fechaInput.value =
        tarea.fecha;

    tituloInput.value =
        tarea.titulo;

    descripcionInput.value =
        tarea.descripcion;


    tareaEditando =
        id;


    btnGuardar.textContent =
        "💾 Guardar cambios";


    btnCancelar.style.display =
        "block";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ==========================================
// CANCELAR
// ==========================================

btnCancelar.addEventListener(
    "click",
    function() {

        tareaEditando =
            null;


        formulario.reset();


        archivoSeleccionado.style.display =
            "none";


        btnGuardar.textContent =
            "💾 Guardar tarea";


        btnCancelar.style.display =
            "none";

    }
);


// ==========================================
// ELIMINAR
// ==========================================

function eliminarTarea(id) {


    if (
        !confirm(
            "¿Deseas eliminar esta tarea?"
        )
    ) {

        return;

    }


    tareas =
        tareas.filter(
            tarea =>
                tarea.id !== id
        );


    guardarTareas();

    mostrarTareas();

}


// ==========================================
// COMPLETAR
// ==========================================

function cambiarEstado(id) {


    const tarea =
        tareas.find(
            tarea =>
                tarea.id === id
        );


    if (!tarea) return;


    tarea.completada =
        !tarea.completada;


    guardarTareas();

    mostrarTareas();

}


// ==========================================
// ESTADÍSTICAS
// ==========================================

function actualizarEstadisticas() {


    const total =
        tareas.length;


    const cantidadCompletadas =
        tareas.filter(
            tarea =>
                tarea.completada
        ).length;


    const cantidadPendientes =
        total -
        cantidadCompletadas;


    totalTareas.textContent =
        total;


    pendientes.textContent =
        cantidadPendientes;


    completadas.textContent =
        cantidadCompletadas;


    contador.textContent =

        `${total} ${
            total === 1
            ? "tarea"
            : "tareas"
        }`;

}


// ==========================================
// ESTUDIANTES
// ==========================================

function actualizarFiltroEstudiantes() {


    const estudiantes =

        [
            ...new Set(
                tareas.map(
                    tarea =>
                        tarea.estudiante
                )
            )
        ].sort();


    const valorActual =
        filtroEstudiante.value;


    filtroEstudiante.innerHTML = `

        <option value="todos">

            Todos los estudiantes

        </option>

    `;


    estudiantes.forEach(
        estudiante => {

            const opcion =
                document.createElement(
                    "option"
                );


            opcion.value =
                estudiante;


            opcion.textContent =
                estudiante;


            filtroEstudiante.appendChild(
                opcion
            );

        }
    );


    if (
        estudiantes.includes(
            valorActual
        )
    ) {

        filtroEstudiante.value =
            valorActual;

    }

}


// ==========================================
// FECHA
// ==========================================

function formatearFecha(fecha) {


    if (!fecha) {

        return "Sin fecha";

    }


    const partes =
        fecha.split("-");


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


// ==========================================
// PROTECCIÓN HTML
// ==========================================

function escapeHTML(texto) {


    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        texto;


    return div.innerHTML;

}


// ==========================================
// BUSCAR
// ==========================================

buscarInput.addEventListener(
    "input",
    mostrarTareas
);


// ==========================================
// FILTRO
// ==========================================

filtroEstado.addEventListener(
    "change",
    mostrarTareas
);


filtroEstudiante.addEventListener(
    "change",
    mostrarTareas
);


// ==========================================
// INICIAR
// ==========================================

mostrarTareas();