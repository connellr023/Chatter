import {createRouter, createWebHistory, type Router} from "vue-router"

import ConnectView from "@/views/ConnectView.vue";
import ChatView from "@/views/ChatView.vue";
import ErrorView from "@/views/ErrorView.vue";

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/:catchAll(.*)",
      name: "404",
      component: ErrorView,
      props: {
        code: "404",
        message: "Route Not Found"
      }
    },
    {
      path: "/",
      name: "connect",
      component: ConnectView
    },
    {
      path: "/chat",
      name: "chat",
      component: ChatView
    },
    {
      path: "/error/:code/:message",
      name: "error",
      component: ErrorView,
      props: true
    }
  ]
});

export default router
