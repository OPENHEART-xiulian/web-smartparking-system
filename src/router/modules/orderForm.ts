const Layout = () => import("@/layout/index.vue");
export default {
  path: "/orderForm",
  name: "OrderForm",
  component: Layout,
  redirect: "/orderForm/outboundOrder",
  meta: {
    icon: "ep:tickets",
    title: "订单管理",
    rank: 2
  },
  children: [
    {
      path: "/orderForm/outboundOrder",
      name: "OutboundOrder",
      component: () => import("@/views/orderForm/outboundOrder/index.vue"),
      meta: {
        title: "出库订单流水"
      }
    }
  ]
} satisfies RouteConfigsTable;
