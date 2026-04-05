<script lang="ts">
import { defineComponent } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'

export default defineComponent({
	name: 'ChartDemo',
	components: {
		DemoSection,
		CodeBlock,
	},
	data() {
		return {
			barChartData: {
				labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
				datasets: [{
					label: 'Sales',
					data: [12, 19, 3, 5, 2, 3],
					backgroundColor: '#42b883'
				}]
			},
			lineChartData: {
				labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
				datasets: [{
					label: 'Visitors',
					data: [150, 230, 180, 290, 210, 320, 280],
					borderColor: '#42b883',
					backgroundColor: 'rgba(66, 184, 131, 0.1)',
					fill: true
				}]
			},
			multiChartData: {
				labels: ['Q1', 'Q2', 'Q3', 'Q4'],
				datasets: [
					{
						label: 'Revenue',
						data: [100, 150, 180, 220],
						backgroundColor: '#42b883'
					},
					{
						label: 'Expenses',
						data: [80, 90, 100, 110],
						backgroundColor: '#f59e0b'
					}
				]
			},
			pieChartData: {
				labels: ['Desktop', 'Mobile', 'Tablet'],
				datasets: [{
					data: [55, 35, 10],
					backgroundColor: ['#42b883', '#667eea', '#f59e0b']
				}]
			},
		}
	},
	computed: {
		basicCode(): string {
			return `<canvas v-chart="{
  type: 'bar',
  labels: ['Jan', 'Feb', 'Mar'],
  datasets: [{
    label: 'Sales',
    data: [12, 19, 3],
    backgroundColor: '#42b883'
  }]
}"></canvas>`
		},
		optionsCode(): string {
			return `<canvas v-chart="{
  type: 'line',
  labels: ['Mon', 'Tue', 'Wed'],
  datasets: [{
    label: 'Visitors',
    data: [150, 230, 180],
    borderColor: '#42b883',
    fill: true
  }],
  width: 400,
  height: 200,
  title: 'Weekly Visitors'
}"></canvas>`
		},
		composableCode(): string {
			return `import { useChart } from 'directix'

const { chart, update, destroy } = useChart({
  type: 'bar',
  labels: ['Jan', 'Feb', 'Mar'],
  datasets: [{ label: 'Sales', data: [12, 19, 3] }]
})

// Update chart data
update({
  labels: ['Apr', 'May', 'Jun'],
  datasets: [{ label: 'Sales', data: [15, 22, 18] }]
})

// Destroy chart
destroy()`
		},
	},
})
</script>

<template>
	<div class="demo-page">
		<h1>v-chart</h1>
		<p class="intro">
			A directive for simple chart binding using Chart.js. Supports bar, line, pie, doughnut, radar, and polar area charts.
		</p>

		<div class="note">
			<strong>Note:</strong> Chart.js must be installed separately: <code>npm install chart.js</code>
		</div>

		<!-- Scenario 1: Bar chart -->
		<DemoSection title="Bar Chart" description="Basic bar chart with sales data">
			<div class="demo-box">
				<canvas v-chart="{ type: 'bar', ...barChartData }" class="chart"></canvas>
			</div>
			<CodeBlock :code="basicCode" />
		</DemoSection>

		<!-- Scenario 2: Line chart -->
		<DemoSection title="Line Chart" description="Line chart with trend data">
			<div class="demo-box">
				<canvas v-chart="{ type: 'line', ...lineChartData }" class="chart"></canvas>
			</div>
		</DemoSection>

		<!-- Scenario 3: Multiple datasets -->
		<DemoSection title="Multiple Datasets" description="Chart with multiple data series">
			<div class="demo-box">
				<canvas v-chart="{ type: 'bar', ...multiChartData }" class="chart"></canvas>
			</div>
		</DemoSection>

		<!-- Scenario 4: Pie chart -->
		<DemoSection title="Pie Chart" description="Pie chart for distribution data">
			<div class="demo-box">
				<canvas v-chart="{ type: 'pie', ...pieChartData }" class="chart-small"></canvas>
			</div>
		</DemoSection>

		<!-- Options -->
		<DemoSection title="Chart Options" description="Configure chart with custom options">
			<div class="demo-box">
				<CodeBlock :code="optionsCode" />
			</div>
		</DemoSection>

		<!-- Composable API -->
		<DemoSection title="Composable API - useChart" description="Using useChart composable for programmatic control">
			<div class="demo-box">
				<CodeBlock :code="composableCode" />
			</div>
		</DemoSection>
	</div>
</template>

<style scoped>
.demo-page {
	max-width: 900px;
}

h1 {
	margin-bottom: 8px;
}

.intro {
	color: #666;
	margin-bottom: 24px;
}

.note {
	padding: 12px 16px;
	background: #fff3cd;
	border-radius: 6px;
	font-size: 13px;
	color: #856404;
	margin-bottom: 24px;
}

.note code {
	background: rgba(0, 0, 0, 0.1);
	padding: 2px 6px;
	border-radius: 4px;
	font-family: monospace;
}

.demo-box {
	padding: 20px;
	background: #f8f9fa;
	border-radius: 8px;
	margin-bottom: 12px;
}

.chart {
	max-height: 300px;
}

.chart-small {
	max-height: 250px;
	max-width: 400px;
	margin: 0 auto;
}
</style>
