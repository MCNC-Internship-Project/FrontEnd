<template>
    <div class="question-container">
        <h3 class="question-title">{{ question.body }}</h3>
        <div class="chart-wrapper">
            <canvas ref="barChartCanvas"></canvas>
        </div>
        <div v-if="question.selectionList.some(option => option.etc && option.etcAnswer.length > 0)">
            <div class="text">기타</div>
            <div v-for="option in question.selectionList" :key="option.sequence">
                <div v-if="option.etc && option.etcAnswer.length > 0">
                    <div v-for="(answer, index) in option.etcAnswer" :key="index" class="answer-box">
                        {{ answer }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from "vue";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);

const barChartCanvas = ref(null);
const props = defineProps({
    question: Object,
});

onMounted(() => {
    if (barChartCanvas.value) {
        const canvasContext = barChartCanvas.value.getContext("2d");
        createChart(canvasContext, props.question);
    }
});

function createChart(chartElement, question) {
    const labels = question.selectionList.map((option) => option.body);
    const data = question.selectionList.map((option) => option.responseCount);

    new Chart(chartElement, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: "#B4DBFF",
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
                    font: {
                        size: 12,
                    },
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
                    ticks: {
                        callback: (value) => (Number.isInteger(value) ? value : ""),
                        font: { size: 10 },
                    },
                },
            },
        },
    });
}
</script>


<style scoped>
.question-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #FAF8F8;
    border: solid 1px #EFF0F6;
    border-radius: 16px;
    box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.15);
    margin-bottom: 16px;
    padding: 20px 16px 0px 16px;
}

.question-title {
    font-size: 1rem;
    font-weight: bold;
    color: #8C8C8C;
    margin-bottom: 12px;
    background-color: #FFF;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #EFF0F6;
}

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

.text {
    color: #8C8C8C;
    font-weight: bold;
    font-size: 1rem;
    padding-left: 4px;
    margin-bottom: 4px;
}

.answer-box {
    padding: 12px;
    margin-bottom: 8px;
    border: 1px solid #D9D9D9;
    border-radius: 8px;
    background-color: #FFFFFF;
    font-size: 0.875rem;
}
</style>
