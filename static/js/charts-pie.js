/**
 * For usage, visit Chart.js docs https://www.chartjs.org/docs/latest/
 */
const pieConfig = {
  type: 'doughnut',
  data: {
    datasets: [
      {
        data: [33, 33, 33],
        /**
         * These colors come from Tailwind CSS palette
         * https://tailwindcss.com/docs/customizing-colors/#default-color-palette
         */
        backgroundColor: ['#0694a2', '#1c64f2', '#7e3af2'],
        label: 'Dataset 1',
      },
    ],
    labels: ['Shoes', 'Shirts', 'Bags'],
  },
  options: {
    responsive: true,
    cutoutPercentage: 80,
    /**
     * Default legends are ugly and impossible to style.
     * See examples in charts.html to add your own legends
     *  */
    legend: {
      display: false,
    },
  },
}

// change this to the id of your chart element in HMTL
const pieCtx = document.getElementById('pie');
window.myPie = new Chart(pieCtx, pieConfig);

countCommentsByHour = (data) => {
  // Inicializar contadores por rango de horas
  const labels = ["0 a.m. - 8 a.m.", "8 a.m. - 16 p.m.", "16 p.m. - 0 a.m."];
  const counts = [0, 0, 0];

  Object.values(data).forEach(record => {
      const savedTime = record.saved;
      if (!savedTime) {
          return;
      }

      console.log(`Hora: ${savedTime}`);

      // Convertir la hora a un formato AM/PM estándar
      let formattedTime = savedTime.replace('a. m.', 'AM').replace('p. m.', 'PM');

      console.log(`Hora formateada: ${formattedTime}`);

      // Reemplazar la coma por espacio para poder usarla en la fecha
      formattedTime = formattedTime.replace(',', '');

      // Crear la fecha en formato 'YYYY-MM-DD HH:MM:SS AM/PM' que JavaScript puede interpretar
      const formattedDate = formattedTime.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)/, 
          '$3-$2-$1 $4:$5:$6 $7');

      console.log(`Hora formateada a formato legible: ${formattedDate}`);

      // Crear objeto Date con la cadena de tiempo
      const dt = new Date(formattedDate);

      console.log(`Hora procesada a objeto Date: ${dt}`);

      // Verificar si la hora es válida
      if (isNaN(dt)) {
          console.log('Error al procesar la hora');
          return;
      }

      // Obtener la hora en formato de 24 horas
      const hour = dt.getHours();
      console.log(`Hora a formato hour: ${hour}`);

      // Clasificar en el rango correspondiente
      if (hour >= 0 && hour < 8) {
          counts[0]++;
      } else if (hour >= 8 && hour < 16) {
          counts[1]++;
      } else {
          counts[2]++;
      }
  });

  console.log(`contador de array: ${counts}`);
  return { labels, counts };
};




update = () => {
  fetch('/api/v1/landing')
    .then(response => response.json())
    .then(data => {

      let { labels, counts } = countCommentsByHour(data)

      // Reset data
      window.myPie.data.labels = [];
      window.myPie.data.datasets[0].data = [];

      // New data
      window.myPie.data.labels = [...labels]
      window.myPie.data.datasets[0].data = [...counts]

      window.myPie.update();

    })
    .catch(error => console.error('Error:', error));
}

update();
