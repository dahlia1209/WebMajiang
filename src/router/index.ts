import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from "@/components/HelloWorld.vue"
import Index from "@/views/page/Index.vue"

const routes = [
    {
        path: '/helloworld',
        component: HelloWorld
    },
    {
        path: '/',
        component: Index,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router