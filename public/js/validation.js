async function validateInput(type) {
    const input = document.getElementById(type);
    const msg = document.getElementById("${type}-msg");
    const code = input.value.trim();
    const response = await fetch("/validate/${type}/${code}");
    const data = await response.json();

    if (!code) {
        msg.textContent = "${type.charAt(0).toUpperCase() + type.slice(1)} não pode ser vazio.";
        msg.style.color = 'red';
        input.focus();
        return;
    }


    if ((!code) && (!data.success)){
        msg.textContent = "${type.charAt(0).toUpperCase() + type.slice(1)} inexistente";
        msg.style.color = 'red';
        input.focus();
        return;
    }

    try {
 //       const response = await fetch("/validate/${type}/${code}");
 //       const data = await response.json();

        if (data.success) {
            msg.textContent = "Nome: ${data.name}";
            msg.style.color = 'green';
        } else {
            msg.textContent = data.message;
            msg.style.color = 'red';
            input.focus();
        }
    } catch (error) {
        msg.textContent = 'Erro ao validar. Tente novamente.';
        msg.style.color = 'red';
        input.focus();
    }

    
}
