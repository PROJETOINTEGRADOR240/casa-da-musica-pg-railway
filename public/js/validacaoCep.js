
document.addEventListener("DOMContentLoaded", function () {
    const cepInput = document.getElementById('cep');

    // Bloquear letras e outros caracteres que não sejam números
    cepInput.addEventListener('keypress', function(event) {
        const charCode = event.charCode || event.keyCode;
        if (charCode < 48 || charCode > 57) {
            event.preventDefault(); // Bloqueia letras
        }
    });

    // Limpa tudo que não for número no input (inclusive colagem)
    cepInput.addEventListener('input', function(event) {
        cepInput.value = cepInput.value.replace(/\D/g, '');
    });

    // Quando perder o foco, dispara a validação
    cepInput.addEventListener('blur', function () {
        validarCep();
    });
});

async function validarCep() {
    const cepInput = document.getElementById('cep');
    let cep = cepInput.value.trim();

    if (cep === "") return;

    if (cep.length !== 8 || isNaN(cep)) {
        alert("CEP inválido! Digite um CEP com 8 dígitos numéricos.");
        cepInput.value = "";
        setTimeout(() => cepInput.focus(), 10);
        return;
    }

    const isValid = await buscarCep(cep);
    if (!isValid) {
        cepInput.value = "";
        setTimeout(() => cepInput.focus(), 10);
    }
}
