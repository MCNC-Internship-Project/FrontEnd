<template>
    <div class="question-container">
        <h3 class="question-title">{{ question.body }}</h3>
        <div class="chart-wrapper">
            <canvas ref="barChartCanvas" height="500vh"></canvas>
        </div>
        <div v-if="question.selectionList.some(option => option.etc && option.etcAnswer.length > 0)">
            <div class="text">기타</div>
            <div class="etc-list">
                <div v-for="option in question.selectionList" :key="option.sequence">
                    <div v-if="option.etc && option.etcAnswer.length > 0">
                        <div v-for="(answer, index) in option.etcAnswer" :key="index" class="answer-box">
                            {{ answer }}
                        </div>
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
        const canvasElement = barChartCanvas.value;
        const optionCount = props.question.selectionList.length;
        canvasElement.height = getChartHeight(optionCount);

        const canvasContext = canvasElement.getContext("2d");
        createChart(canvasContext, props.question);
    }
});

// 보기 개수에 따라 높이를 동적으로 계산
function getChartHeight(optionCount) {
    const baseHeight = 50;
    const minHeight = 300;
    return Math.max(optionCount * baseHeight, minHeight);
}

// 보기 내용 줄바꿈꿈
function wrapText(text, maxLineLength) {
    const regex = new RegExp(`.{1,${maxLineLength}}`, "g"); 
    return text.match(regex).join("\n"); 
}

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
                        title: function (tooltipItems) {
                            console.log(tooltipItems[0])
                            const label = tooltipItems[0].label || ""; // 보기 내용
                            const maxLineLength = 20; // 한 줄에 표시할 최대 글자 수
                            const wrappedLabel = wrapText(label, maxLineLength);

                            return wrappedLabel.split("\n"); 
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

                        return `${percentage}%`; 
                    },
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
                    ticks: {
                        callback: (value) => (Number.isInteger(value) ? value : ""),
                        font: { size: 10 },
                    },
                    min: 0,
                },
                y: {
                    grid: { display: false },
                    ticks: {
                        autoSkip: false,
                        font: { size: 12 },
                        callback: function (value, index) {
                            const label = this.getLabelForValue(index);
                            if (label.length > 5) {
                                return label.substring(0, 5) + "..."; // 길이 제한 후 말줄임표 추가
                            }
                            return label;
                        },
                    },
                    categoryPercentage: 0.8, 
                    barPercentage: 0.9,
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
    overflow-y: auto;
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
    height: auto;
    max-height: 1000px;
    margin-top: 12px;
    margin-bottom: 12px;
}

.barChartCanvas {
    height: 100vh;
}

canvas {
    width: 100%;
    max-width: 90%;
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

.etc-list {
    max-height: 300px; 
    overflow-y: auto; 
    padding: 10px; 
    margin-bottom: 12px;
}
.etc-list .answer-box:last-child {
    margin-bottom: 0;
}
</style>
