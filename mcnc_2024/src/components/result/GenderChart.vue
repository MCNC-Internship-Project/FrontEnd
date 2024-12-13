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

        const totalCount = femaleCount + maleCount;

        if (totalCount === 0) {
            createNoResponseChart(chartElement);
        } else {
            createGenderChart(chartElement, [femaleCount, maleCount]);
        }
    }
});

function createGenderChart(chartElement, data) {
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
                    formatter: (value, context) => {
                        if (value === 0) {
                            return ""; 
                        }
                        const data = context.chart.data.datasets[0].data; // 데이터 배열
                        const total = data.reduce((sum, val) => sum + val, 0); // 전체 합계 계산
                        const percentage = ((value / total) * 100).toFixed(1); // 비율 계산 (소수점 1자리)

                        return `${value}명 (${percentage}%)`; // 퍼센트 값 출력
                    },
                    display: (context) => context.dataset.data.some((value) => value > 0),
                },
            },
            responsive: true,
            maintainAspectRatio: false,
        },
    });
}

function createNoResponseChart(chartElement) {
    new Chart(chartElement, {
        type: "pie",
        data: {
            labels: ["응답자 없음"],
            datasets: [
                {
                    data: [1],
                    backgroundColor: ["#D3D3D3"],
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
                    formatter: () => "0%",
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            // 툴팁 값이 1일 때 0으로 표시
                            const value = tooltipItem.raw;
                            return `${value === 1 ? "0" : value}명`;
                        },
                    },
                },
            },
            responsive: true,
            maintainAspectRatio: false,
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
    max-width: 400px;
    height: auto;
    margin: 12px;
}
</style>
