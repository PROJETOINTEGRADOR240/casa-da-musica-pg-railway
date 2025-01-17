document.getElementById('data_nasc').addEventListener('input', function () {
    const dataNascimento = new Date(this.value);
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mes = hoje.getMonth() - dataNascimento.getMonth();
    
    // Ajusta a idade se o mês e o dia atual forem menores que a data de nascimento
    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
    }

    // Atualiza o campo de idade
    document.getElementById('idade').value = idade >= 0 ? idade : '';
});
