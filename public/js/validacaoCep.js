document.getElementById('cep').addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Impede que o Enter pule o campo ou envie o formulário
        validarCep(); // Chama a função de validação
    }
});

document.getElementById('cep').addEventListener('blur', function() {
    validarCep(); // Valida quando o campo perde o foco
});

function validarCep() {
    let cepField = document.getElementById('cep');
    let cep = cepField.value.trim();

    if (cep !== "" && (cep.length < 8 || isNaN(cep))) {
        alert("CEP inválido! Digite um CEP válido ou deixe o campo em branco.");
        cepField.focus(); // Mantém o foco no campo CEP até corrigir
    } else {
        // Se o CEP for válido ou estiver em branco, pode ir para o próximo campo
        buscarCep(cep);
    }
}
