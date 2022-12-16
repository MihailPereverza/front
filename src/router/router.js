import Login from "@/pages/Login";
import {createRouter, createWebHistory} from "vue-router";
import Broker from "@/pages/Broker";
import Administrator from "@/pages/administrator";

const routes = [
    {
        path: '/login',
        component: Login
    },
    {
        path: '/broker/:name',
        component: Broker
    },
    {
        path: '/administrator',
        component: Administrator
    }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})


export default router