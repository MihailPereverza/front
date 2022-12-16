import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from "@/router/router";

loadFonts()


const app = createApp(App)

// app.config.errorHandler = (err) => {console.log(err)}

    app.use(router)
  .use(vuetify)
  .mount('#app')
