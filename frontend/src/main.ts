import { createApp } from 'vue'
import App from './App.vue'
import HttpCheckoutGateway from './gateway/HttpCheckoutGateway';

const app = createApp(App);
app.provide("checkoutGateway", new HttpCheckoutGateway)
app.mount('#app')
