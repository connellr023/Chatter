import {createRouter, createWebHistory, type Router} from "vue-router"
import ConnectView from "@/views/ConnectView.vue";
import ChatView from "@/views/ChatView.vue";
import NotFoundView from "@/views/NotFoundView.vue";

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: "/:catchAll(.*)",
      name: "404",
      component: NotFoundView
    }
  ]
});

export default router
