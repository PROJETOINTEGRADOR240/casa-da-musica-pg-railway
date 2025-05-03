
async function buscarCep(cep) {
    const cepInput = document.querySelector('input[name="cep"]');
    cep = cep.replace(/\D/g, "");

    if (cep === "") return true;

    if (cep.length !== 8) {
        return false;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

        const data = await response.json();

        if (data.erro) {
            alert("CEP não encontrado! Digite um CEP válido.");
            return false;
        }

        document.querySelector('input[name="endereco"]').value = data.logradouro || "";
        const bairroInput = document.querySelector('input[name="bairro"]');
        const cidadeInput = document.querySelector('input[name="cidade"]');
        const estadoInput = document.querySelector('input[name="estado"]');

        if (bairroInput) bairroInput.value = data.bairro || "";
        if (cidadeInput) cidadeInput.value = data.localidade || "";
        if (estadoInput) estadoInput.value = data.uf || "";

        // Aplica a máscara no input do CEP
        cepInput.value = cep.replace(/(\d{5})(\d{3})/, "$1-$2");

        return true;
    } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        alert("Erro ao buscar o CEP. Verifique sua conexão.");
        return false;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const cepInput = document.querySelector('input[name="cep"]');
    cepInput.addEventListener("blur", function () {
        validarCep();
    });
});
