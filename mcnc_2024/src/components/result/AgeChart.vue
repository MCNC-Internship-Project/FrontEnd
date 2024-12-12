<template>
    <div class="chart-wrapper">
        <canvas ref="ageChartCanvas"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);

const ageChartCanvas = ref(null);
const props = defineProps({
    ageCountList: {
        type: Array,
        required: true,
    },
});

onMounted(() => {
    if (ageChartCanvas.value) {
        const canvasContext = ageChartCanvas.value.getContext("2d");
        createChart(canvasContext, props.ageCountList);
    }
});

function createChart(chartElement, ageCountList) {
    const labels = ageCountList.map((item) => item.age);
    const data = ageCountList.map((item) => item.count);

    new Chart(chartElement, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: [
                        "#FFB3BA",
                        "#FFDFBA",
                        "#FFFCA3",
                        "#BAE1FF",
                        "#B9FBC0",
                        "#D9BAFF",
                        "#FFC3C3",
                        "#FFEBCC",
                        "#C7FFD8",
                    ],
                    borderRadius: 3,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                }, 
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.raw; 
                            return `${value}명`;
                        },
                    },
                },
                datalabels: {
                    anchor: "center",
                    align: "center",
                    formatter: (value) => (value === 0 ? "" : value),
                    color: "#555",
                    font: { size: 12 },
                },
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 12 } },
                },
                y: {
                    grid: { display: false },
                    ticks: { callback: (value) => (Number.isInteger(value) ? value : ""), font: { size: 10 } },
                },
            },
        },
    });
}
</script>

<style scoped>
.chart-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 300px;
    margin-top: 12px;
    margin-bottom: 12px;
}

canvas {
    width: 100%;
    max-width: 600px;
    height: auto;
}
</style>
