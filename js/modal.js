function CreateModal(elementoSelector) {
    const element = document.querySelector(elementoSelector);

    if (!element) {
        console.error("No se pudo cargar el elemento toast")
    };

    const html = `
        <section class="modal">
            <div class="modal-container">
                <section class="modal-header">
                    <h2 class="modal-title"></h2>
                </section>
                <section class="modal-body">
                    <p class="modal-paragraph"></p>
                </section>
                <span class="modal-close">Cerrar modal</span>
            </div>
        </section>
    `

    element.innerHTML += html;
}

function showModal(title = "", body = "") {
    const MODAL = document.querySelector(".modal");
    const TITLE = document.querySelector(".modal-title");
    const BODY = document.querySelector(".modal-paragraph");

    TITLE.innerHTML = title;
    BODY.innerHTML = body;


    MODAL.classList.add("modal--show")
}

function closeModal() {
    const MODAL = document.querySelector(".modal");
    MODAL.classList.remove("modal--show")
}