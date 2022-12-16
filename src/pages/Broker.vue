<template>
  <div class="broker">
 <h1 class="text-center">Страница брокера {{$route.params.name}}</h1>
    <div class="table-container">
      <p class="user-balance">Текущий баланс: {{balance}}</p>
      <v-table class="stock-price-table">
    <thead>
    <tr>
      <th class="text-center">
        Label
      </th>
      <th class="text-center">
        Price
      </th>
      <th class="text-center">
        Buy
      </th>
      <th class="text-center">
        Sell
      </th>
    </tr>
    </thead>
    <tbody>
    <tr
        v-for="stock in stocks"
        :key="stock.label"
    >
      <stock-price-row-table
          :stocks="objBrokerStocks"
          :balance="balance"
          :prop_label="stock"
          :socket="socket"
          @up_price="updatePrices"
          @buy="buyStock"
          @sell="sellStock"
      />
    </tr>
    </tbody>
  </v-table>
    <p class="stock-date">Текущая дата торгов: {{date}}</p>
    </div>
    <broker-stocks :prices="prices" :stocks="brokerStocks"/>
<!--        v-if="stock !== undefined && datasets[stock.label] !== undefined"-->
    <chart
        v-for="stock in brokerStocks"
        :datasetTemplate="datasets[stock.label]"
    />
<!--    <chart :chart-data="priceHistory['AMZN']" label="AMZN"  :labels="priceLabels['AMZN']"/>-->
  </div>
</template>

<script>
import axios from "axios";
import {io} from "socket.io-client";
import StockPriceRowTable from "@/components/StockPriceRowTable";
import BrokerStocks from "@/components/BrokerStocks";
import Chart from "@/components/Chart";

const socket = io('http://localhost:3000')

export default {
  name: "Broker",
  components: {Chart, BrokerStocks, StockPriceRowTable},
  data: () => ({
    stocks: null,
    socket: socket,
    date: null,
    balance: null,
    _prices: {},
    brokerStocks: [],
    objBrokerStocks: {},
    comDatasets: {},
  }),
  methods: {
    async loadStocks() {
      const resp = await axios.get('http://localhost:3000/market')
      // console.log(resp.data)
      this.stocks = resp.data.filter((el) => el.status)
    },
    joinBroker() {
      this.socket.emit('join_broker', {room: this.$route.params.name})
    },
    onDate() {
      this.socket.on('new_date', (data)=> {
        // console.log(data)
        this.date = data
      })
    },
    joinStocks() {
      this.stocks.map((label, pos) => {
        if (!label.status) {
          return
        }
        this.socket.emit('join', {room: label.label})
        this.socket.on(label.label, (data) => {
          // console.log(data)
        })
      })
    },
    async getUserInfo() {
      const resp = await axios.get(`http://localhost:3000/brokers/name/${this.$route.params.name}`)
      this.balance = resp.data['balance']
    },
    async getBrokerStocks() {
      const resp = await axios.get(`http://localhost:3000/brokers/stocks/${this.$route.params.name}`)
      for (let el of resp.data) {
        this.objBrokerStocks[el.label] = el
        this.brokerStocks.push(el)
      }
    },
    buyStock(data) {
      data.price = Math.round(parseFloat(data.price.slice(1)) * 100) / 100
      this.balance -= data.price
      console.log(this.brokerStocks.filter(el => el.label === data.label)[0])
      if (this.brokerStocks.filter(el => el.label === data.label).length === 0){
        const stock = {count: 0, label: data.label, sum: 0}
        this.brokerStocks.push(stock)
        this.objBrokerStocks[data.label] = stock
      }
      this.brokerStocks.filter(el => el.label === data.label)[0].sum += data.price
      this.brokerStocks.filter(el => el.label === data.label)[0].count += 1
    },
    sellStock(data) {
      console.log('data')
      console.log(data)
      console.log(this.balance)
      data.price = Math.round(parseFloat(data.price.slice(1)) * 100) / 100
      console.log(data)
      this.balance += data.price
      console.log(this.balance)
      for (let i = 0; i < this.brokerStocks.length; i++) {
        if (!(this.brokerStocks[i].label === data.label)) continue
        console.log(i)
        const stock = this.brokerStocks[i]
        console.log('stock')
        console.log(stock)
        if (stock.count > 1) {
          stock.sum -= Math.round((stock.sum / stock.count) * 100) / 100
          stock.count -= 1
        } else {
          this.brokerStocks.splice(i, 1)
          delete this.objBrokerStocks[data.label]
        }
      }
      console.log('balance')
      console.log(this.balance)
    },
    async loadAll() {
      await this.loadStocks()
      this.onDate()
      this.joinBroker()
      this.joinStocks()
      await this.getUserInfo()
      await this.getBrokerStocks()
    },
    updatePrices(data) {
      // console.log(data)
      this._prices[data.label] = data.price
      // console.log(this._prices[data.label])
      data.price = Math.round(parseFloat(data.price.slice(1)) * 100) / 100
      // if (data.label === 'AMZN' || data.label === 'AMD') return
      console.log(data.price)
      console.log(data.label)
      if (!this.comDatasets[data.label]) this.comDatasets[data.label] = {labels: [], datasets: [{label: data.label, backgroundColor: '#f87979', data: []}]}
      this.comDatasets[data.label].labels.push(data)
      // this.comDatasets[data.label].datasets[0].data.push(data.price)
      console.log('--------------')

    }
  },
  async created() {
    await this.loadAll()
  },
  computed: {
    prices() {
      return this._prices
    },
    datasets() {
      return this.comDatasets
    }
  }
}
</script>

<style scoped>
  .stock-price-table {
    max-height: 300px;

    border: rgba(211,211,211, 0.5) solid 1px;
  }
  .broker {
    --prism-font-family: monospace;

  }
  h1 {
    font-weight: 400;
    padding-bottom: 20px;
  }
  .table-container{
    margin: auto;
    width: 800px;
  }
  .stock-date {
    padding-top: 10px;
    margin: 0;
  }
  .user-balance {
    font-size: 20px;
    font-weight: 500;
    padding-bottom: 20px;
  }
  hr{
    margin: 5px;
  }
</style>