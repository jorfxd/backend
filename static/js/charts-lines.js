/**
 * For usage, visit Chart.js docs https://www.chartjs.org/docs/latest/
 */
const lineConfig = {
  type: 'line',
  data: {
    labels: [], // Se llenará con las fechas
    datasets: [
      {
        label: 'Cantidad de respuestas por día',
        borderColor: '#0694a2',
        backgroundColor: '#0694a2',
        data: [], // Se llenará con las cantidades por día
        fill: false,
        tension: 0.1
      }
    ]
  },
  options: {
    responsive: true,
    legend: {
      display: true,
    },
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    scales: {
      x: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Fecha'
        },
      },
      y: {
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Cantidad de respuestas'
        },
      },
    },
  },
}
 
// Función para contar las respuestas por día
const countCommentsByDay = (data) => {
  const counts = {};
  const labels = [];
 
  Object.values(data).forEach(record => {
    const savedTime = record.saved;
    if (!savedTime) {
      return;
    }
 
    // Convertir la hora a formato AM/PM
    let formattedTime = savedTime.replace('a. m.', 'AM').replace('p. m.', 'PM');
    formattedTime = formattedTime.replace(',', '');
 
    // Formatear la fecha para que JavaScript la entienda
    const formattedDate = formattedTime.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)/,
      '$3-$2-$1 $4:$5:$6 $7');
 
    const dt = new Date(formattedDate);
 
    // Si la fecha no es válida, ignorarla
    if (isNaN(dt)) {
      return;
    }
 
    // Extraer la fecha en formato YYYY-MM-DD
    const day = dt.toISOString().split('T')[0];
 
    // Contar las respuestas por día
    counts[day] = counts[day] ? counts[day] + 1 : 1;
  });
 
  // Organizar las fechas y extraer las cantidades
  for (let day in counts) {
    labels.push(day);
  }
  labels.sort();
 
  const countsArray = labels.map(day => counts[day]);
 
  return { labels, counts: countsArray };
};
 
// Función para actualizar el gráfico
const updateLineChart = () => {
  fetch('/api/v1/landing')
    .then(response => response.json())
    .then(data => {
      const { labels, counts } = countCommentsByDay(data);
 
      // Actualizar los datos del gráfico
      window.myLine.data.labels = labels;
      window.myLine.data.datasets[0].data = counts;
 
      // Actualizar el gráfico
      window.myLine.update();
    })
    .catch(error => console.error('Error:', error));
};
 
// Inicializar el gráfico de líneas
const lineCtx = document.getElementById('line');
window.myLine = new Chart(lineCtx, lineConfig);
 
// Llamar la función para actualizar el gráfico
updateLineChart();
