<template>
    <td class="text-center">{{ prop_label.label }}</td>
    <td class="text-center">{{ pricee }}</td>
  <td style="width: 50px" class="text-center"><v-btn
      variant="flat"
      color="secondary"
      size="small"
      @click="buy"
  >
    Купить
  </v-btn></td>
  <td style="width: 50px" class="text-center"><v-btn
      variant="flat"
      color="error"
      size="small"
      @click="sell"
  >
    Продать
  </v-btn></td>
</template>

<script>
import axios from "axios";

export default {
  name: "StockPriceRow",
  emits: ['up_price', 'buy', 'sell'],
  props: {
    prop_label: {
      required: true
    },
    socket: {
      required: true
    },
    balance: {
      required: true
    },
    stocks: {
      required: true
    }
  },
  data: () => ({
    pricee: null,
    label_row: ''
  }),
  methods: {
    updatingPrice() {
      this.socket.on(this.prop_label.label, (data) => {
        this.pricee = data.close
        // console.log('asdfasddasasfafdasf--------------------')
        // console.log(this.label_row)
        this.$emit('up_price', {price: this.pricee, label: this.label_row, date: data.date})
        // console.log('adsasdfsd')
      })
      this.socket.on('start_' + this.prop_label.label, (data) => {
        console.log(data)

        data.map(el => this.$emit('up_price', {price: el.close, label: this.label_row, date: el.date}))
      })
    },


    async buy() {
      const price = Math.round(parseFloat(this.pricee.slice(1)) * 100) / 100
      if (price > this.balance) return
      if (!this.pricee) return

      await axios.post('http://localhost:3000/stocks/buy', {
        name: this.$route.params.name,
        price: price,
        label: this.label_row,
      })
      this.$emit('buy', {label: this.prop_label.label, price: this.pricee})
    },
    async sell() {
      console.log(this.stocks)
      if (!this.stocks[this.prop_label.label] || this.stocks[this.prop_label.label].count < 1) return

      await axios.post('http://localhost:3000/stocks/sell', {
        name: this.$route.params.name,
        price: Math.round(parseFloat(this.pricee.slice(1)) * 100) / 100,
        label: this.label_row,
      })
      this.$emit('sell', {label: this.prop_label.label, price: this.pricee})
    },
  },
  mounted() {
    // console.log(this.label)
    console.log('mounted')
    this.updatingPrice()
    this.label_row = this.prop_label.label
  }
}
</script>

<style scoped>

</style>