$(document).ready(function () {
    const salesData = window.salesData || [];
  
    // X axis: days
    const labels = salesData.map(item => item._id);
    // Y axis: totals
    const totals = salesData.map(item => item.total);
  
    const ctx = $("#salesChart");
  
    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Daily Profit (USD)",
            data: totals,
            backgroundColor: "rgba(234, 66, 66, 0.1)",
            borderColor: "rgba(234, 66, 66, 1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: "#ffffff",
            pointBorderColor: "rgba(234, 66, 66, 1)",
            pointBorderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                size: 13,
                weight: '500'
              },
              color: '#374151',
              padding: 16,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 13,
              weight: '500'
            },
            bodyFont: {
              size: 13
            },
            cornerRadius: 6,
            displayColors: true
          }
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              font: {
                size: 12
              },
              color: '#6b7280'
            },
            title: {
              display: true,
              text: "Days",
              font: {
                size: 13,
                weight: '500'
              },
              color: '#374151',
              padding: {
                top: 10,
                bottom: 0
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              font: {
                size: 12
              },
              color: '#6b7280',
              callback: function(value) {
                return '$' + value;
              }
            },
            title: {
              display: true,
              text: "Dollars (USD)",
              font: {
                size: 13,
                weight: '500'
              },
              color: '#374151',
              padding: {
                top: 0,
                bottom: 10
              }
            }
          }
        }
      }
    });
  });
