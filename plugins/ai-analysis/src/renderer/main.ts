import { createApp } from 'vue'
import ElementPlus from 'element-plus'
// Element Plus base styles.
// In dev (standalone Vite), this gives the UI its correct appearance.
// In production (loaded inside EcuBus-Pro via wujie), the host already
// injects element.css — so this import is excluded from the production
// bundle via the cssExcludes wujie plugin option on the host side.
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
