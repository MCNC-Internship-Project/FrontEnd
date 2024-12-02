<template>
    <div class="chart-wrapper">
        <canvas ref="genderChartCanvas"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);


const genderChartCanvas = ref(null);
const props = defineProps({
    genderCountList: {
        type: Array,
        required: true,
    },
});

onMounted(() => {
    if (genderChartCanvas.value) {
        const chartElement = genderChartCanvas.value.getContext("2d");
        const femaleCount = props.genderCountList.find((item) => item.gender === "FEMALE")?.count || 0;
        const maleCount = props.genderCountList.find((item) => item.gender === "MALE")?.count || 0;

        createChart(chartElement, [femaleCount, maleCount]);
    }
});

function createChart(chartElement, data) {
    new Chart(chartElement, {
        type: "pie",
        data: {
            labels: ["여성", "남성"],
            datasets: [
                {
                    data: data,
                    backgroundColor: ["#FDD4D6", "#C3E5FF"],
                    hoverOffset: 2,
                    borderColor: "transparent",
                    borderWidth: 0,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: "bottom",
                    labels: {
                        boxWidth: 20,
                        padding: 20,
                        font: {
                            size: 12,
                        },
                    },
                },
                datalabels: {
                    anchor: "center",
                    align: "center",
                    formatter: (value) => (value === 0 ? "" : value),
                    display: (context) => context.dataset.data.some((value) => value > 0),
                },
                beforeDraw(chart) {
                    drawEmptyState(chart);
                },
            },
            responsive: true,
            maintainAspectRatio: false,
        },
    });
}

function drawEmptyState(chart) {
    const { datasets } = chart.data;
    const total = datasets[0].data.reduce((sum, value) => sum + value, 0);

    if (total === 0) {
        const ctx = chart.ctx;
        const { width, height } = chart;
        ctx.save();

        // 배경 회색 원
        ctx.fillStyle = "#E0E0E0";
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, Math.min(width, height) / 4, 0, 2 * Math.PI);
        ctx.fill();

        // 중앙 텍스트
        ctx.font = "bold 16px Arial";
        ctx.fillStyle = "#555";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("0", width / 2, height / 2);

        ctx.restore();
    }
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
    max-width: 400px;
    height: auto;
    margin: 12px;
}
</style>
