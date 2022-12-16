<template>
  <div style="height: 500px; width: 800px; margin: auto">
  <Line
      v-if="loaded"
    :options="options"
    :data="dataset"
  />
  </div>
</template>

<script>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)


export default {
  name: "my-chart",
  components: {Line},
  props: {
    datasetTemplate: {
      required: true
    }
  },
  data() {
    return {
      loaded: false,
      dataset: null,
      options: {
        responsive: true,
        maintainAspectRatio: false
      },
    }
  },
  watch: {
    datasetTemplate: {
      handler(value) {
        console.log(this.datasetTemplate)
        if (this.datasetTemplate === undefined) return

        let labels = []
        let prices = []
        let label = ''
        this.datasetTemplate.labels.map(el => {
          labels.push(el.date)
          prices.push(el.price)
          label = el.label
        })
        this.dataset = {
          labels: labels,
          datasets: [
              {label: label, backgroundColor: '#f87979', data: prices}
          ]
        }
        this.loaded = true
        console.log(value)
      },
      deep: true
    }
  },
}
</script>

<style scoped>

</style>