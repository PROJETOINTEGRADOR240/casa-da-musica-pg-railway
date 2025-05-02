// Arquivo: public/js/validaCpfCnpj.js

function validaCpfCnpj(valor) {
    const apenasNumeros = valor.replace(/\D/g, '');
    
    // Se estiver vazio, é válido
    if (!apenasNumeros) return true;

    // Se não tiver exatamente 11 ou 14 dígitos, é inválido
    if (apenasNumeros.length !== 11 && apenasNumeros.length !== 14) {
        return false;
    }

    // Validação CPF (11 dígitos)
    if (apenasNumeros.length === 11) {
        if (/^(\d)\1+$/.test(apenasNumeros)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(apenasNumeros.charAt(i)) * (10 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(apenasNumeros.charAt(9))) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(apenasNumeros.charAt(i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(apenasNumeros.charAt(10))) return false;

        return true;
    }
    // Validação CNPJ (14 dígitos)
    else if (apenasNumeros.length === 14) {
        if (/^(\d)\1+$/.test(apenasNumeros)) return false;

        const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        let soma = 0;
        for (let i = 0; i < 12; i++) {
            soma += parseInt(apenasNumeros.charAt(i)) * pesos1[i];
        }
        let resto = soma % 11;
        let digito1 = resto < 2 ? 0 : 11 - resto;
        if (parseInt(apenasNumeros.charAt(12)) !== digito1) return false;

        const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        soma = 0;
        for (let i = 0; i < 13; i++) {
            soma += parseInt(apenasNumeros.charAt(i)) * pesos2[i];
        }
        resto = soma % 11;
        let digito2 = resto < 2 ? 0 : 11 - resto;
        if (parseInt(apenasNumeros.charAt(13)) !== digito2) return false;

        return true;
    }

    return false;
}

function formataCpfCnpj(valor) {
    const apenasNumeros = valor.replace(/\D/g, '');
    
    if (apenasNumeros.length === 11) {
        return apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (apenasNumeros.length === 14) {
        return apenasNumeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return valor;
}

function aplicarValidacaoCpfCnpj(inputId, formId) {
//    const $input = $("#${inputId}");
//    const $form = formId ? $("#${formId}") : $input.closest('form');

const $input = $("#" + inputId);
const $form = formId ? $("#" + formId) : $input.closest('form');


    // Validação em tempo real enquanto digita
    $input.on('input', function() {
        const valor = $(this).val();
        // Remove caracteres não numéricos enquanto digita
        const apenasNumeros = valor.replace(/\D/g, '');
        if (valor && !apenasNumeros) {
            $(this).val(''); // Limpa se só tiver caracteres não numéricos
        }
    });

    // Validação ao tentar sair do campo
    $input.on('focusout', function(e) {
        const valor = $(this).val();
        
        if (valor && !validaCpfCnpj(valor)) {
            e.preventDefault();
            alert('CPF ou CNPJ inválido! Digite um CPF (11 dígitos) ou CNPJ (14 dígitos) válido ou deixe o campo vazio.');
            $(this).val('');
            setTimeout(() => $(this).focus(), 0); // Força o foco de volta
            return false;
        } else if (valor) {
            $(this).val(formataCpfCnpj(valor)); // Aplica máscara se válido
        }
    });

    // Remove máscara antes de enviar o formulário
    if ($form.length) {
        $form.on('submit', function(e) {
            const valor = $input.val();
            if (valor) {
                $input.val(valor.replace(/\D/g, '')); // Envia apenas números
            }
        });
    }
}