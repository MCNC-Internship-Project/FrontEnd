<template>
    <div class="chart-wrapper">
        <canvas id="chartCanvas"></canvas>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { Chart } from "chart.js/auto";
// import ChartDataLaels from 'chartjs-plugin-datalabels';

// Chart.register(ChartDataLaels);

//html 요소를 찾아서 처리해야 하므로, onMounted에 올려서 사용해야 함
onMounted(() => {
    const chartElement = document.querySelector('#chartCanvas').getContext('2d');
    new Chart(chartElement, {
        type: 'pie',
        data: {
            labels: ['여성', '남성'],
            datasets: [{
                data: [75, 25],
                backgroundColor: ['#FDD4D6', '#C3E5FF'],
                hoverOffset: 2,
                borderColor: 'transparent',
                borderWidth: 0
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 12
                        }
                    },
                },
                // datalabels: {
                //     formatter: (value, context) => {
                //         let total = context.dataset.data.reduce((a,b)=>a+b, 0);
                //         let percentage = ((value/total)*100).toFixed(1);
                //         return `${percentage}%`;
                //     },
                //     font:{
                //         size:12
                //     },
                //     anchor: 'end',
                //     align: 'start'
                // }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
});
</script>

<style scoped>
.chart-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70%;
    height: 300px;
    margin: auto;
}

#chartCanvas {
    width: 100%;
    max-width: 400px;
    height: auto;
}
</style>