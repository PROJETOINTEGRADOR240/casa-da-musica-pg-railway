// Este script será carregado na página "reportResult.ejs" para exibir o gráfico
const ctx = document.getElementById('myChart').getContext('2d');

// Exemplo de gráfico de barras
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Masculino', 'Feminino'],  // Dados exemplo
    datasets: [{
      label: 'Alunos por Sexo',
      data: [12, 19],  // Quantidade de alunos por sexo
      backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
      borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
