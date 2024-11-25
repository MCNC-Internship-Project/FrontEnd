<!-- <template>
    <div>
        <PieChart :chart-data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup>

import { onMounted } from "vue";
import { Chart } from "chart.js/auto";

//html 요소를 찾아서 처리해야 하므로, onMounted에 올려서 사용해야 함
onMounted(() => {
    const chartElement = document.querySelector('#chartCanvas').getContext('2d');
    const chartCanvas = new Chart(chartElement, {
        type: 'pie',
        data: {
            labels: ['여성', '남성'],
            datasets: [{
                data: [75, 25],
                backgroundColor: ['#1E90FF', '#FFD700'],
                hoverOffset: 4
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: '일과 통계',
                    font: {
                        size: 20
                    }
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 15
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
});
</script>

<style scoped>
.chart-container {
    width: 100%;
    height: 300px;
    /* 원하는 높이로 조정 */
}
</style> -->