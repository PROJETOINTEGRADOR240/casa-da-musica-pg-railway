// public/js/validaMatricula.js

document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    const aluno = form.querySelector('#aluno');
    const professor = form.querySelector('#professor');
    const disciplina = form.querySelector('#disciplina');

    // Só aplica se todos os campos forem encontrados no formulário
    if (aluno && professor && disciplina) {
      form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const alunoId = aluno.value;
        const professorId = professor.value;
        const disciplinaId = disciplina.value;

        try {
          const response = await fetch("/verificarMatricula?aluno=${alunoId}&professor=${professorId}&disciplina=${disciplinaId}");
          const data = await response.text();

          if (data === 'OK') {
            this.submit(); // tudo certo, envia o form
          } else {
            alert('Aluno não matriculado para esse Professor/Disciplina');
          }
        } catch (err) {
          console.error('Erro na verificação:', err);
          alert('Erro ao verificar matrícula.');
        }
      });
    }
  });
});
