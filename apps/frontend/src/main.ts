import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { router } from '@/router'
import AppRoot from '@/App.vue'
import '@/assets/main.css'

const app = createApp(AppRoot)

app.use(router)
app.use(VueQueryPlugin, {})

app.mount('#app')