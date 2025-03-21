import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';
import '@fortawesome/fontawesome-free/css/all.css';
import './assets/styles/main.css';

const app = createApp(App);
  
app.use(router);
app.use(store);
app.use(i18n);
  
// Monter l'application
app.mount('#app');