$(document).ready(function () {
    const salesData = window.salesData || [];
  
    // X o‘qi: kunlar
    const labels = salesData.map(item => item._id);
    console.log("sss",window.salesData);
    // Y o‘qi: summalar
    const totals = salesData.map(item => item.total);
  
    const ctx = $("#salesChart");
  
    new Chart(ctx, {
      type: "line", // "bar" qilsa ustun ko‘rinadi
      data: {
        labels: labels,
        datasets: [
          {
            label: "Daily profit(USD)",
            data: totals,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              font: {
                size: 14
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Days",
              font: {
                size: 14,
                weight: "bold"
              }
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Dollars (USD)",
              font: {
                size: 14,
                weight: "bold"
              }
            }
          }
        }
      }
    });
  });
  