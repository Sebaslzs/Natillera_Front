jQuery(function () {
    // Llenar la tabla de ahorros al cargar la página
    LlenarTabla();

    // Event listeners para los botones
    $("#btnInsertar").click(function () {
        EjecutarComando("POST", "Insertar");
    });
    $("#btnActualizar").click(function () {
        EjecutarComando("PUT", "Actualizar");
    });
    $("#btnEliminar").click(function () {
        EjecutarComando("DELETE", "Eliminar");
    });
    $("#btnConsultar").click(function () {
        Consultar();
    });
});

// Función para llenar la tabla de ahorros
function LlenarTabla() {
    LlenarTablaXServicios("http://localhost:55005/api/Ahorros/LlenarTablaAhorros", "ahorrosTable");
}

// Función genérica para ejecutar comandos (Insertar, Actualizar, Eliminar)
async function EjecutarComando(Metodo, Funcion) {
    const ahorro = new Ahorro(
        $("#txtIdAhorro").val(),
        $("#txtNombreAhorro").val(),
        $("#txtMonto").val(),
        $("#txtInteres").val(),
        $("#txtFechaInicio").val(),
        $("#txtFechaFin").val()
    );
    let URL = "http://localhost:55005/api/Ahorros/" + Funcion;
    await EjecutarServicio(Metodo, URL, ahorro);
    LlenarTabla(); // Actualizar la tabla después de cualquier operación
}

// Clase que representa un objeto Ahorro
class Ahorro {
    constructor(IdAhorro, Nombre, Monto, Interes, FechaInicio, FechaFin) {
        this.IdAhorro = IdAhorro;
        this.Nombre = Nombre;
        this.Monto = Monto;
        this.Interes = Interes;
        this.FechaInicio = FechaInicio;
        this.FechaFin = FechaFin;
    }
}

// Función para consultar un ahorro por ID
async function Consultar() {
    let IdAhorro = $("#txtIdAhorro").val();
    let URL = "http://localhost:55005/api/Ahorros/ConsultarXID?id=" + IdAhorro;
    const ahorro = await ConsultarServicio(URL);
    if (ahorro != null) {
        $("#txtNombreAhorro").val(ahorro.Nombre);
        $("#txtMonto").val(ahorro.Monto);
        $("#txtInteres").val(ahorro.Interes);
        $("#txtFechaInicio").val(ahorro.FechaInicio);
        $("#txtFechaFin").val(ahorro.FechaFin);
    } else {
        $("#dvMensaje").html("El ID del ahorro no está en la base de datos");
        LimpiarFormulario();
    }
}

// Función para limpiar el formulario
function LimpiarFormulario() {
    $("#txtNombreAhorro").val("");
    $("#txtMonto").val("");
    $("#txtInteres").val("");
    $("#txtFechaInicio").val("");
    $("#txtFechaFin").val("");
}
function LlenarTablaXServicios(url, tablaId) {
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function (data) {
            let tabla = $("#" + tablaId + " tbody");
            tabla.empty(); // Limpiar la tabla
            $.each(data, function (index, ahorro) {
                tabla.append("<tr>" +
                    "<td>" + ahorro.IdAhorro + "</td>" +
                    "<td>" + ahorro.Nombre + "</td>" +
                    "<td>" + ahorro.Monto + "</td>" +
                    "<td>" + ahorro.Interes + "</td>" +
                    "<td>" + ahorro.FechaInicio + "</td>" +
                    "<td>" + ahorro.FechaFin + "</td>" +
                    "</tr>");
            });
        },
        error: function (error) {
            console.error("Error llenando la tabla:", error);
        }
    });
}

// Función para ejecutar servicios (POST, PUT, DELETE) según el método y URL
async function EjecutarServicio(metodo, url, datos) {
    try {
        await $.ajax({
            url: url,
            type: metodo,
            contentType: "application/json",
            data: JSON.stringify(datos),
            success: function (response) {
                $("#dvMensaje").html("Operación realizada con éxito: " + response);
            },
            error: function (error) {
                console.error("Error en la operación:", error);
                $("#dvMensaje").html("Error en la operación");
            }
        });
    } catch (error) {
        console.error("Error en EjecutarServicio:", error);
    }
}

// Función para consultar un servicio y devolver los datos
async function ConsultarServicio(url) {
    try {
        const response = await $.ajax({
            url: url,
            type: "GET",
            dataType: "json"
        });
        return response;
    } catch (error) {
        console.error("Error en ConsultarServicio:", error);
        $("#dvMensaje").html("Error en la consulta");
        return null;
    }
}