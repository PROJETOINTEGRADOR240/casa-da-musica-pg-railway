document.addEventListener("DOMContentLoaded", function () {
    const cepInput = document.querySelector('input[name="cep"]');

    cepInput.addEventListener("blur", async function () {
        let cep = cepInput.value.replace(/\D/g, ""); // Remove caracteres não numéricos

        if (cep === "") {
            return; // Se estiver vazio, permite sair do campo
        }

        if (cep.length !== 8) {
            alert("CEP inválido! Digite um CEP com 8 dígitos.");
            setTimeout(() => cepInput.focus(), 10); // Mantém o foco no campo CEP
            return;
        }

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                alert("CEP não encontrado! Digite um CEP válido.");
                setTimeout(() => cepInput.focus(), 10); // Mantém o foco no campo CEP
                return;
            }

            // Preenche os campos com os dados do CEP
            document.querySelector('input[name="endereco"]').value = data.logradouro || "";
            document.querySelector('input[name="bairro"]').value = data.bairro || "";
            document.querySelector('input[name="cidade"]').value = data.localidade || "";
            document.querySelector('input[name="estado"]').value = data.uf || "";

        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            alert("Erro ao buscar o CEP. Verifique sua conexão.");
            setTimeout(() => cepInput.focus(), 10); // Mantém o foco no campo CEP
        }
    });
});
