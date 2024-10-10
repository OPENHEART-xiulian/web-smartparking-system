const Layout = () => import("@/layout/index.vue");
export default {
  path: "/vehicle",
  name: "Vehicle",
  component: Layout,
  redirect: "/system/outboundOrder",
  meta: {
    icon: "ep:van",
    title: "车场管理",
    rank: 2
  },
  children: [
    {
      path: "/vehicle/equipment",
      name: "Equipment",
      component: () => import("@/views/vehicle/equipment/index.vue"),
      meta: {
        title: "设备管理",
        roles: ["4", "3"]
      }
    },

    {
      path: "/vehicle/carRentalSpace",
      name: "CarRentalSpace",
      component: () => import("@/views/vehicle/carRentalSpace/index.vue"),
      meta: {
        title: "商家租赁车位管理",
        roles: ["4", "3"]
      }
    },
    // {
    //   path: "/vehicle/vipCar",
    //   name: "VipCar",
    //   component: () => import("@/views/vehicle/vipCar/index.vue"),
    //   meta: {
    //     title: "内部车辆",
    //     roles: ["4", "3"]
    //   }
    // },
    {
      path: "/vehicle/journal",
      name: "Journal",
      component: () => import("@/views/vehicle/journal/index.vue"),
      meta: {
        title: "车辆出入库记录",
        roles: ["4", "3"]
      }
    }
  ]
} satisfies RouteConfigsTable;
