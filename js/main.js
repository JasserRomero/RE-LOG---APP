/*
    Autor: Jasser Romero Ramirez
*/

const TITLE = "IMPORTANTE";
const TEMPLATE = `
<section class="section-instrucciones">
    <strong>Indicaciones.<br/></strong>
    <br>
    <p>Se debe cargar un archivo log que contenga la información a analizar ó cargar el archivo que se encuentra en la siguiente ruta.</p><br/>
    <ul class="ol-rules">
        <li><strong>Ubicacion:</strong> ./{raiz-proyecto}/data/access_log.log</li>
    </ul>
    <p>Posterior a esto, ingresar una fecha de busqueda y presionar en el botón "Procesar Archivo".</p>
    <br>
    <p>Suponiendo que el log sigue lo siguiente:</p>
    <ul class="ol-rules">
        <li><strong>Formato:</strong> {IP} - - {FECHA} {METODO} {COD.RESPUESTA}</li>
        <li><strong>Formato Fecha:</strong> [dd/Mon/yyyy:HH:mm:ss +0000]</li>
        <li><strong>Metodo HTTP:</strong>(GET, POST, etc.)</li>
        <li><strong>Codigo De Respuesta:</strong>(e.g., 401, 404)</li>
    </ul>
    <br>
    <p>El programa se encargará de contar los errores con codigo de respuestas <strong>401, 402, 403 y 404</strong></p>
</section>
`;

document.addEventListener("DOMContentLoaded", () => {
    // EXPRESIONES
    const octeto = /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/;
    const ipRegex = new RegExp(`${octeto.source}\\.${octeto.source}\\.${octeto.source}\\.${octeto.source}`);

    const fileExtension = /\.log$/i; // Determina el tipo de archivo a procesar

    const dateRegex = /\[(\d{2}\/\w{3}\/\d{4}:\d{2}:\d{2}:\d{2} \+\d{4})\]/; // Expresion para la fecha

    const methodRegex = /"((GET|POST|HEAD|PUT|DELETE|OPTIONS|PATCH) \/.*\/1\.[01])"/; // Expresion para los metodos HTTP

    const statusCodeRegex = /(401|402|403|404)/; // Expresion para los codigos de respuesta que nos interesaa
    
    const fullLogRegex = new RegExp(
        `^${ipRegex.source} - - ${dateRegex.source} ${methodRegex.source} ${statusCodeRegex.source} \\d+$`
    );

    console.log(fullLogRegex);

    // Cargues adicionales
    CreateToast("#content-toast");
    CreateModal("#content-modal");

    //Variables
    const INPUT = document.querySelector("#datafile");
    const BUTTON = document.querySelector("#processData");
    const PREELEMENT = document.querySelector("#datafilepre");
    const BUTTON_CLOSE_MODAL = document.querySelector(".modal-close");
    const START_DATE = document.querySelector("#StartDate");
    const END_DATE = document.querySelector("#EndDate");

    // Eventos
    BUTTON.addEventListener("click", processFile);
    INPUT.addEventListener("change", changePre);
    BUTTON_CLOSE_MODAL.addEventListener("click", closeModal);

    setTimeout(() => showModal(TITLE, TEMPLATE), 800);

    // Funciones
    function processFile() {
        if (!INPUT.files.length) {
            showAlert("Por favor, seleccione un archivo");
            return;
        }

        const namefile = INPUT.value;
        if (!fileExtension.test(namefile)) {
            showAlert("Por favor, selecciona un archivo con extensión .log");
            INPUT.value = "";
            PREELEMENT.innerHTML = "";
            return;
        }

        const file = INPUT.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const fileContent = e.target.result;
            proccesData(fileContent);
        };

        reader.readAsText(file);
    }
    function proccesData(content) {
        const lines = content.split("\n");

        // Obtener fechas
        const fromDate = START_DATE.value ? formatUserDate(START_DATE.value) : null;
        const toDate = END_DATE.value ? formatUserDate(END_DATE.value) : null;

        // Si no se proporcionan ambas fechas, no procesamos nada
        if (!fromDate || !toDate) {
            showAlert("Por favor, proporciona un rango de fechas válido.");
            return;
        }

        let Errores401 = 0;
        let Errores402 = 0;
        let Errores403 = 0;
        let Errores404 = 0;
        let totalCruce = 0

        lines.forEach((line) => {
            const match = line.match(fullLogRegex);
            if (match) {
                const logDateStr = match[5]; // <- obtenemos la fecha
                const logStatus = match[8]; // <- obtenemos el status

                // Convertir la fecha
                const logDate = formatLogDateToSimpleDate(logDateStr);

                // Verificar si la fecha del log está dentro del rango
                if (logDate >= fromDate && logDate <= toDate) {
                    totalCruce++;
                    // Contar los errores HTTP válidos dentro del rango de fechas
                    if (logStatus === "401") Errores401++;
                    if (logStatus === "402") Errores402++;
                    if (logStatus === "403") Errores403++;
                    if (logStatus === "404") Errores404++;
                }
            }
        });

        const TEMPLATE = `
            <p>Errores con codigo 401: <strong>${Errores401}</strong></p>
            <p>Errores con codigo 402: <strong>${Errores402}</strong></p>
            <p>Errores con codigo 403: <strong>${Errores403}</strong></p>
            <p>Errores con codigo 404: <strong>${Errores404}</strong></p>
            <br>
            <p>Total en rango de fecha: <strong>${totalCruce}</strong></p>
        `;
        showModal("RESULTADO", TEMPLATE);
    }

    function changePre() {
        const filename = INPUT.value;
        PREELEMENT.innerHTML = "Archivo a procesar " + filename;
    }
    function convertMonthToNumber(month) {
        const months = {
            Jan: "01",
            Feb: "02",
            Mar: "03",
            Apr: "04",
            May: "05",
            Jun: "06",
            Jul: "07",
            Aug: "08",
            Sep: "09",
            Oct: "10",
            Nov: "11",
            Dec: "12",
        };
        return months[month];
    }
    function formatLogDateToSimpleDate(logDateStr) {
        const parts = logDateStr.split(/[\/: ]/);
        const day = parts[0];
        const month = convertMonthToNumber(parts[1]);
        const year = parts[2];
        return `${day}/${month}/${year}`; // Devolver en formato dd/mm/yyyy
    }
    function formatUserDate(userDateStr) {
        const parts = userDateStr.split("-");
        return `${parts[2]}/${parts[1]}/${parts[0]}`; // Devolver en formato dd/mm/yyyy
    }
});
