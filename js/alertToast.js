function CreateToast(elementoSelector) {
    const elemento = document.querySelector(elementoSelector);

    if (!elemento) {
        console.error("No se pudo cargar el elemento toast")
    };

    const html = `
    <div class="toast">
        <div class="toast-content">
            <i class="fas fa-solid fa-check check"></i>
            <div class="message">
                <span class="text text-1" id="header-toast"></span>
                <span class="text text-2" id="text-toast"></span>
            </div>
        </div>
        <i class="fa-solid fa-xmark close"></i>
        <div class="progress"></div>
    </div>`

    elemento.innerHTML += html;
}


function showAlert(text = "") {
    let timer1, timer2;

    const toast = document.querySelector(".toast");
    const progress = document.querySelector(".progress");
    const contenText = document.querySelector("#text-toast");
    const button = document.querySelector("#processData")

    contenText.innerHTML = text
    button.disabled = true;

    toast.classList.add("active");
    progress.classList.add("active");

    timer1 = setTimeout(() => {
        toast.classList.remove("active");
        button.disabled = false;
    }, 5000); //1s = 1000 milliseconds
    
    timer2 = setTimeout(() => {
        progress.classList.remove("active");
    }, 5300);
}