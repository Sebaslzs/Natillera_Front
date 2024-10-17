jQuery(function () {
    // Cargar el menú en el contenedor designado
    $("#dvMenu").load("../Paginas/Menu.html");
});

async function ConsultarDeposito() {
    let idDeposito = $("#txtIdDeposito").val();
    try {
        // Invocar el servicio para consultar un depósito por ID
        const resultado = await fetch(`http://localhost:50745/api/Depositos/Consultar?idDeposito=${idDeposito}`, {
            method: "GET",
            mode: "cors",
            headers: { "Content-Type": "application/json" }
        });

        // Verificar si la respuesta es exitosa
        if (!resultado.ok) {
            throw new Error("Error en la consulta del depósito.");
        }

        // Convertir la respuesta a objeto JSON
        const respuesta = await resultado.json();

        // Rellenar los campos con los datos del depósito
        $("#txtMonto").val(respuesta.monto);
        $("#txtFecha").val(respuesta.fecha.split('T')[0]); // Manejo de formato de fecha
        $("#txtClienteId").val(respuesta.clienteId);
    } catch (error) {
        $("#dvMensaje").html(`Error: ${error.message}`);
    }
}

function InsertarDeposito() {
    EjecutarComandoDeposito("POST", "Insertar");
}

function ActualizarDeposito() {
    EjecutarComandoDeposito("PUT", "Actualizar");
}

function EliminarDeposito() {
    EjecutarComandoDeposito("DELETE", "Eliminar");
}

async function EjecutarComandoDeposito(metodo, funcion) {
    // Crear una instancia de Deposito con los datos ingresados
    const deposito = new Deposito(
        $("#txtIdDeposito").val(),
        $("#txtMonto").val(),
        $("#txtFecha").val(),
        $("#txtClienteId").val()
    );

    try {
        // Invocar la API con el método adecuado
        const resultado = await fetch(`http://localhost:50745/api/Depositos/${funcion}`, {
            method: metodo,
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(deposito)
        });

        // Verificar si la respuesta es exitosa
        if (!resultado.ok) {
            throw new Error("Error al ejecutar el comando.");
        }

        // Convertir la respuesta a objeto JSON
        const respuesta = await resultado.json();
        $("#dvMensaje").html(`Respuesta: ${respuesta}`);
    } catch (error) {
        $("#dvMensaje").html(`Error: ${error.message}`);
    }
}

class Deposito {
    constructor(idDeposito, monto, fecha, clienteId) {
        this.IdDeposito = idDeposito; // Asegúrate de que coincide con el modelo
        this.Monto = monto;
        this.Fecha = fecha;
        this.ClienteId = clienteId; // Asegúrate de que esto coincide con tu modelo de datos
    }
}
