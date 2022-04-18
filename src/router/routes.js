const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Home.vue") },
      { path: "/about", component: () => import("pages/About.vue") },
      { path: "/faqs", component: () => import("pages/FAQs.vue") },
      { path: "/register", component: () => import("pages/Register.vue") },
      { path: "/login", component: () => import("pages/Login.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
