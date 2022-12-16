<template>
  <v-table class="user-list" height="300px">
    <thead>
      <tr>
        <th class="text-center">
          Name
        </th>
        <th class="text-center">
          Перейти к брокеру
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
      v-for="user in brokers"
      :key="user.id"
      >
        <td class="text-center">{{ user.name }}</td>
        <td class="text-center"><v-btn
            class="mx-2"
            fab
            dark
            large
            color="cyan"
            @click="goToBroker(user.name)"
        >
          <v-icon dark>
            mdi-pencil
          </v-icon>
        </v-btn></td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import axios from "axios";
import router from "@/router/router";

export default {
  name: "UserList",
  data() {
    return {
      brokers: null
    }
  },
  methods: {
    async loadBrokers() {
      let resp = await axios.get('http://localhost:3000/settings')
      console.log(resp.data)
      this.brokers = resp.data
      // console.log(this.brokers)
    },
    goToBroker(name) {
      router.push(`/broker/${name}`)
    }
  },
  mounted() {
    this.loadBrokers()
  }
}
</script>

<style scoped>
  .user-list {
    margin: auto;
    width: 800px;
  }
</style>