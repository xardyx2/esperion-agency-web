<script setup lang="ts">
/**
 * UDashboardChart - Wrapper component for Apache ECharts
 * 
 * @usage
 * ```vue
 * <UDashboardChart
 *   type="line"
 *   :data="chartData"
 *   :options="customOptions"
 * />
 * ```
 */

import { useColorMode } from '#imports'

export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'funnel'

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    color?: string
  }[]
}

interface Props {
  type: ChartType
  data: ChartData
  height?: string
  showLegend?: boolean
  showTooltip?: boolean
  darkMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: '300px',
  showLegend: true,
  showTooltip: true,
  darkMode: undefined
})

const colorMode = useColorMode()
const isDark = computed(() => props.darkMode ?? colorMode.value === 'dark')

// Esperion brand colors
const brandColors = [
  '#2B9EDB', // Primary
  '#7CC6FE', // Secondary
  '#10B981', // Success
  '#F59E0B', // Warning
  '#EF4444', // Error
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
]

// ECharts option generation
const chartOption = computed(() => {
  const textColor = isDark.value ? '#94A3B8' : '#475569'
  const gridColor = isDark.value ? '#1E293B' : '#E2E8F0'
  const bgColor = 'transparent'

  const baseOption = {
    backgroundColor: bgColor,
    textStyle: {
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    tooltip: props.showTooltip ? {
      trigger: 'axis',
      backgroundColor: isDark.value ? '#151E32' : '#FFFFFF',
      borderColor: isDark.value ? '#1E293B' : '#E2E8F0',
      textStyle: {
        color: isDark.value ? '#F8FAFC' : '#102B4E'
      }
    } : undefined,
    legend: props.showLegend ? {
      bottom: 0,
      textStyle: { color: textColor }
    } : undefined,
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    color: brandColors
  }

  if (props.type === 'line' || props.type === 'area') {
    return {
      ...baseOption,
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: props.data.labels,
        axisLine: { lineStyle: { color: gridColor } },
        axisLabel: { color: textColor }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: gridColor } },
        axisLabel: { color: textColor }
      },
      series: props.data.datasets.map((dataset, index) => ({
        name: dataset.label,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 3 },
        areaStyle: props.type === 'area' ? {
          opacity: 0.1,
          color: brandColors[index % brandColors.length]
        } : undefined,
        data: dataset.data,
        itemStyle: {
          color: dataset.color || brandColors[index % brandColors.length]
        }
      }))
    }
  }

  if (props.type === 'bar') {
    return {
      ...baseOption,
      xAxis: {
        type: 'category',
        data: props.data.labels,
        axisLine: { lineStyle: { color: gridColor } },
        axisLabel: { color: textColor }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: gridColor } },
        axisLabel: { color: textColor }
      },
      series: props.data.datasets.map((dataset, index) => ({
        name: dataset.label,
        type: 'bar',
        barMaxWidth: 40,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: dataset.color || brandColors[index % brandColors.length]
        },
        data: dataset.data
      }))
    }
  }

  if (props.type === 'pie' || props.type === 'funnel') {
    const pieData = props.data.datasets[0]?.data.map((value, index) => ({
      value,
      name: props.data.labels[index]
    })) || []

    return {
      ...baseOption,
      tooltip: props.showTooltip ? {
        trigger: 'item',
        backgroundColor: isDark.value ? '#151E32' : '#FFFFFF',
        borderColor: isDark.value ? '#1E293B' : '#E2E8F0',
        textStyle: {
          color: isDark.value ? '#F8FAFC' : '#102B4E'
        }
      } : undefined,
      series: [{
        type: props.type,
        radius: props.type === 'pie' ? ['40%', '70%'] : undefined,
        center: ['50%', '45%'],
        data: pieData,
        label: {
          color: textColor
        },
        itemStyle: {
          borderRadius: 4
        }
      }]
    }
  }

  return baseOption
})

// ECharts instance
const chartRef = ref<HTMLDivElement>()
const chartInstance = ref<any>(null)

// Initialize chart
const initChart = async () => {
  if (!chartRef.value) return
  
  // Dynamic import of ECharts
  // @ts-ignore - echarts is dynamically imported on client side
  const echarts = await import('echarts')
  
  if (chartInstance.value) {
    chartInstance.value.dispose()
  }
  
  chartInstance.value = echarts.init(chartRef.value, isDark.value ? 'dark' : undefined)
  chartInstance.value.setOption(chartOption.value)
}

// Update chart when options change
watch(() => chartOption.value, () => {
  if (chartInstance.value) {
    chartInstance.value.setOption(chartOption.value, true)
  }
}, { deep: true })

// Handle resize
const handleResize = () => {
  chartInstance.value?.resize()
}

// Handle theme change
watch(isDark, () => {
  initChart()
})

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance.value?.dispose()
})
</script>

<template>
  <div
    ref="chartRef"
    :style="{ height }"
    class="w-full"
  />
</template>
