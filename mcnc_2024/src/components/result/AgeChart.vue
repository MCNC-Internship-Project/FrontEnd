<template>
    <div class="chart-wrapper">
        <canvas ref="ageChartCanvas"></canvas>
    </div>
</template>

<script setup>
/**
 * @fileoverview 설문통계 - 연령 그래프 컴포넌트
 * @author 김은수 (kimeunsu@mcnc.co.kr)
 * @date 2024-12-10
 * @lastModified 2024-12-20
 * @description 설문 응답자의 연령 분포를 시각화하는 가로 막대형 그래프 컴포넌트.
 */

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

// 나이 막대 그래프 생성
const createChart = (chartElement, ageCountList) => {
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
            interaction: {
                mode: 'y',
                intersect: false,
            },
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
                        const data = context.chart.data.datasets[0].data; 
                        const total = data.reduce((sum, val) => sum + val, 0); 
                        const percentage = ((value / total) * 100).toFixed(1); 

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
