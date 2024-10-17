jQuery(function () {
    // Cargar el menú en el contenedor designado
    $("#dvMenu").load("../Paginas/Menu.html");
    alert("pr");
});

async function Consultar() {
    let documento = $("#txtDocumento").val();
    try {
        // Invocar el servicio para consultar un cliente por documento
        const resultado = await fetch(`http://localhost:50745/api/Clientes/ConsultarXDocumento?Documento=${documento}`, {
            method: "GET",
            mode: "cors",
            headers: { "Content-Type": "application/json" }
        });

        // Verificar si la respuesta es exitosa
        if (!resultado.ok) {
            throw new Error("Error en la consulta del cliente.");
        }

        // Convertir la respuesta a objeto JSON
        const respuesta = await resultado.json();

        // Rellenar los campos con los datos del cliente
        $("#txtNombre").val(respuesta.nombre);
        $("#txtPrimerApellido").val(respuesta.apellido); // Asegúrate de que la propiedad coincida
        $("#txtSegundoApellido").val(respuesta.segundoApellido || ''); // Si no existe, dejar vacío
        $("#txtEmail").val(respuesta.email || ''); // Si no existe, dejar vacío
        $("#txtDireccion").val(respuesta.direccion);
        $("#txtFechaNacimiento").val(respuesta.fechaNacimiento ? respuesta.fechaNacimiento.split('T')[0] : ''); // Manejo de formato de fecha
    } catch (error) {
        $("#dvMensaje").html(`Error: ${error.message}`);
    }
}

function Insertar() {
    EjecutarComando("POST", "Insertar");
}

function Actualizar() {
    EjecutarComando("PUT", "Actualizar");
}

function Eliminar() {
    EjecutarComando("DELETE", "Eliminar");
}

async function EjecutarComando(metodo, funcion) {
    // Crear una instancia de Cliente con los datos ingresados
    const cliente = new Cliente(
        $("#txtDocumento").val(),
        $("#txtNombre").val(),
        $("#txtPrimerApellido").val(),
        $("#txtSegundoApellido").val(),
        $("#txtDireccion").val(),
        $("#txtEmail").val(),
        $("#txtFechaNacimiento").val()
    );

    try {
        // Invocar la API con el método adecuado
        const resultado = await fetch(`http://localhost:50745/api/Clientes/${funcion}`, {
            method: metodo,
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cliente)
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

class Cliente {
    constructor(documento, nombre, primerApellido, segundoApellido, direccion, email, fechaNacimiento) {
        this.Documento = documento; 
        this.Nombre = nombre;
        this.PrimerApellido = primerApellido;
        this.SegundoApellido = segundoApellido;
        this.Direccion = direccion;
        this.Email = email;
        this.FechaNacimiento = fechaNacimiento;
    }
}
