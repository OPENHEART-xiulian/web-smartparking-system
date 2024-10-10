const Layout = () => import("@/layout/index.vue");
export default {
  path: "/management",
  name: "Management",
  component: Layout,
  redirect: "/management/feeRules",
  meta: {
    icon: "ep:wallet",
    title: "费用管理",
    rank: 5
  },
  children: [
    {
      path: "/management/feeRules",
      name: "FeeRules",
      component: () => import("@/views/costManagement/feeRules/index.vue"),
      meta: {
        title: "收费规则",
        roles: ["4", "3"]
      }
    },
    {
      path: "/management/record",
      name: "Record",
      component: () => import("@/views/costManagement/record/index.vue"),
      meta: {
        title: "月保记录",
        roles: ["4", "3"]
      }
    },
    {
      path: "/management/zombieCar",
      name: "ZombieCar",
      component: () => import("@/views/costManagement/zombieCar/index.vue"),
      meta: {
        title: "访客车辆",
        roles: ["4", "3"]
      }
    },
    {
      path: "/management/reconciliation",
      name: "Reconciliation",
      component: () =>
        import("@/views/costManagement/reconciliation/index.vue"),
      meta: {
        title: "商家对账",
        roles: ["4", "3"]
      }
    }
  ]
} satisfies RouteConfigsTable;
