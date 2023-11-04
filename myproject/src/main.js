import { createApp } from 'vue';
import App from './App.vue';
import router from './routers.js';
import "./assets/style.css";
import jQuery from 'jquery';
import vuetify from './plugins/vuetify';
import AppearTransition from './components/AppearTransition.vue'

const app = createApp(App)
app.component('AppearTransition', AppearTransition)
app.use(vuetify).use(router).mount('#app')
 
window.$ = window.jQuery = jQuery;



 


