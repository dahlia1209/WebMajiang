import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createHead } from '@unhead/vue'


import $ from 'jquery';
(window as any).jQuery = (window as any).$ = $;

const app = createApp(App);
const head = createHead()
app.use(router)
app.use(head)

app.mount('body')
