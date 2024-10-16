import { createApp } from 'vue'
import { vMaska } from "maska"
import App from './App.vue';

const app = createApp(App)

app.directive('maska', vMaska);

app.mount('#app')
