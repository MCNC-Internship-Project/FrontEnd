<template>
    <div class="chart-wrapper">
      <canvas id="barChartCanvas"></canvas>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from "vue";
  import { Chart } from "chart.js/auto";
  import ChartDataLabels from "chartjs-plugin-datalabels";
  
  // Chart.js 플러그인 등록
  Chart.register(ChartDataLabels);
  
  onMounted(() => {
    const chartElement = document
      .querySelector("#barChartCanvas")
      .getContext("2d");
  
    // 수평 막대 그래프 생성
    new Chart(chartElement, {
      type: "bar",
      data: {
        labels: ["10대", "20대", "30대", "40대", "50대~"], // y축 라벨
        datasets: [
          {
            data: [12, 45, 30, 25, 10], // x축 데이터
            backgroundColor: [
              "#C3CCE3"
            ],
            borderRadius: 3, // 막대 끝의 둥글기
          },
        ],
      },
      options: {
        indexAxis: "y", // 수평 그래프 설정
        plugins: {
            legend: {
                    display: false,
                },
          datalabels: {
            anchor: "end",
            align: "right",
            formatter: (value) => `${value}명`,
            color: "#555",
            font: {
              size: 12,
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              borderDash: [5, 5],
            // display:false,
            },
            ticks: {
              stepSize: 20,
              font: {
                size: 10,
              },
            },
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 10,
              },
            },
          },
        },
      },
    });
  });
  </script>
  
  <style scoped>
  .chart-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 300px;
    margin: auto;
    margin-bottom: 12px;
  }
  
  #barChartCanvas {
    width: 100%;
    max-width: 600px;
    height: auto;
  }
  </style>
  