const Layout = () => import("@/layout/index.vue");
export default {
  path: "/business",
  name: "Business",
  component: Layout,
  redirect: "/business/couponIssuance",
  meta: {
    icon: "solar:shop-2-linear",
    title: "商户总览",
    rank: 1
  },
  children: [
    {
      path: "/business/couponIssuance",
      name: "CouponIssuance",
      component: () => import("@/views/business/couponIssuance/index.vue"),
      meta: {
        title: "停车领券",
        roles: ["1", "2"]
      }
    }
  ]
} satisfies RouteConfigsTable;
