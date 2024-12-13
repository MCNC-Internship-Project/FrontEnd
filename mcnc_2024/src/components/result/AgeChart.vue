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
                        "#FFABAB", // 파스텔 레드
                        "#8EEDC7", // 파스텔 민트
                        "#D5C5DE", // 연보라
                        "#FFE194", // 파스텔 옐로우
                        "#A8DADC", // 파스텔 블루
                        "#FFCFD1", // 연한 핑크
                        "#D0ECB1", // 파스텔 라임
                        "#FFE0B7", // 파스텔 오렌지
                        "#CAE1F8"  // 연한 하늘색
                    ],
                    borderRadius: 3,
                    barThickness: 30,
                },
            ],
        },
        options: {
            indexAxis: 'y', 
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
                    formatter: (value, context) => {
                        if (value === 0) {
                            return ""; 
                        }
                        const data = context.chart.data.datasets[0].data; // 데이터 배열
                        const total = data.reduce((sum, val) => sum + val, 0); // 전체 합계 계산
                        const percentage = ((value / total) * 100).toFixed(1); // 비율 계산 (소수점 1자리)

                        return `${value}명 (${percentage}%)`; // 퍼센트 값 출력
                    },
                    color: "#555",
                    font: { size: 12 },
                },
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { callback: (value) => (Number.isInteger(value) ? value : ""), font: { size: 10 } },
                },
                y: {
                    grid: { display: false },
                    ticks: { font: { size: 12 } },
                    // Y축 레이블 영역의 고정 폭
                    afterFit: function (scale) {
                        scale.width = 80; 
                    },
                },
            },
        },
    });
}
</script>

<style scoped>
.chart-wrapper {
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 400px;
    margin-top: 12px;
    margin-bottom: 12px;
}

canvas {
    width: 100%;
    max-width: 95%;
    height: auto;
}
</style>
