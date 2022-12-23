<template>
  <v-table class="user-list" height="300px">
    <thead>
    <tr>
      <th class="text-center">
        Name
      </th>
      <th class="text-center">
        Balance
      </th>
      <th class="text-center">
        Stocks
      </th>
    </tr>
    </thead>
    <tbody>
    <tr
        v-for="user in brok"
        :key="user.id"
    >
      <td class="text-center">{{ user.name }}</td>
      <td class="text-center">{{ user.balance}}</td>
      <td class="text-center">
        <v-list dense>
          <v-list-item-group
              color="primary"
          >
            <v-list-item
                class="text-center"
                v-for="stock in Object.values(user.stocks)"
                :key="stock.title"
            >
<!--              {{console.log(this.prices[stock.label].slice(1))}}-->
              {{stock.label}} - {{stock.count}} - {{ Object.values(this.prices).length !== 0 && this.prices[stock.label]? Math.round(stock.count * parseFloat(this.prices[stock.label].slice(1)).toFixed(2) * 100 - stock.sum * 100) / 100: 'Не торгуется' }}
            </v-list-item>
          </v-list-item-group>
        </v-list>
        </td>
    </tr>
    </tbody>
  </v-table>
</template>

<script>
import axios from "axios";
import router from "@/router/router";
import {io} from "socket.io-client";


const socket = io('http://localhost:3000')


export default {
  name: "UserList",
  data() {
    return {
      brokers: null,
      socket: socket,
      prices: {},
      stocks: []
    }
  },
  methods: {
    async loadBrokers() {
      let resp = await axios.get('http://localhost:3000/brokers')
      this.brokers = resp.data
      console.log(resp.data)
    },
    goToBroker(name) {
      router.push(`/broker/${name}`)
    },
    balanceUpdate() {
      this.socket.emit('balance')
      this.socket.on('balance', (data) => {
        for (let i = 0; i < this.brokers.length; i++){
          if (this.brokers[i].name !== data.name) continue
          this.brokers[i].balance = data.balance
        }
        let broker = this.brokers.filter(el => el.name === data.name)
        broker.balance = data.balance
      })
    },
    // async getBrokerStocks() {
    //
    //   const resp = await axios.get(`http://localhost:3000/brokers/stocks/${this.$route.params.name}`)
    //   for (let el of resp.data) {
    //     this.objBrokerStocks[el.label] = el
    //     this.brokerStocks.push(el)
    //   }
    // },
    async loadStocks() {
      const resp = await axios.get('http://localhost:3000/market')
      this.stocks = resp.data.filter((el) => el.status).map(el => el.label)
      console.log(this.stocks)
    },
    priceUpdate() {
      for (let label of this.stocks) {
        console.log(label)
        this.socket.emit('join', {room: label})
        this.socket.on(label, (data) => {
          console.log(data)
          this.prices[label] = data['close']
        })
      }
    },
    async loadAll() {
      await this.loadStocks()
      this.priceUpdate()
    }
  },
  mounted() {
    this.loadBrokers()
    this.balanceUpdate()
    this.loadAll()
    // this.loadStocks()
    // this.priceUpdate()
  },
  computed: {
    brok() {
      return this.brokers
    }
  }

}
</script>

<style scoped>
.user-list {
  margin: auto;
  width: 800px;
}
</style>