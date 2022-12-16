<template>
  <v-table class="user-list" height="300px">
    <thead>
    <tr>
      <th class="text-center">
        Label
      </th>
      <th class="text-center">
        Count
      </th>
      <th class="text-center">
        Cost
      </th>
      <th class="text-center">
        Прибыль/Убыток
      </th>
    </tr>
    </thead>
    <tbody>
    <tr
        v-for="stock in stocks"
        :key="stock.label"
    >
      <td class="text-center">{{ stock.label }}</td>
      <td class="text-center">{{stock.count}}</td>
      <td class="text-center">{{stock.sum}}</td>
      <td class="text-center">${{summ(stock)}}</td>
    </tr>
    </tbody>
  </v-table>
</template>

<script>
export default {
  name: "BrokerStocks",
  props: {
    stocks: {
      required: true
    },
    prices: {
      required: true
    }
  },
  data: () => ({
    // stocks: null,
    // prices: null,
  }),
  methods: {
    summ(stock) {
        // console.log('afsdfa')
        // console.log(stock)
        // console.log(this.prices)
        if (this.prices === undefined || this.prices === null) return 0
        if (Object.values(this.prices).length === 0) return 0
      if (this.prices[stock.label] === undefined) return 0
      // console.log(stock.sum - stock.count * parseFloat(this.prices[stock.label].slice(1)))
        return Math.round(stock.count * parseFloat(this.prices[stock.label].slice(1)).toFixed(2) * 100 - stock.sum * 100) / 100
      },
  },
  watch: {
  //   prices: {
  //     handler(value) {
  //       console.log(value)
  //     },
  //     deep: true
  //   },
    stocks: {
      handler(value) {
        console.log(value)
      },
      deep: true
    },
  },
  updated() {
    console.log(this.created)
  },
  computed: {

  }
}
</script>

<style scoped>

</style>