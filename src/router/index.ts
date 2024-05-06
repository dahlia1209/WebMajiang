import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from "@/components/HelloWorld.vue"
import Index from "@/views/page/Index.vue"
import Netplay from "@/views/page/Netplay.vue"

const routes = [
    {
        path: '/helloworld',
        component: HelloWorld
    },
    {
        path: '/',
        component: Index,
    },
    {
        path: '/netplay',
        component: Netplay,
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router