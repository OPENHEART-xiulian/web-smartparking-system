interface tableColumnType {
  prop: string;
  label: string;
  width?: string | number;
  handleFn?: (value: any) => string;
}

export const tollList = [
  {
    label: "开始计费",
    value: 1
  },
  {
    label: "结算计费",
    value: 2
  },
  {
    label: "不计费",
    value: 0
  }
];
const tollOutList = [
  {
    label: "结算计费",
    value: 1
  },
  {
    label: "不计费",
    value: 0
  }
];
export const effectList = [
  {
    label: "入闸",
    value: 1
  },
  {
    label: "出闸",
    value: 0
  }
];
export const vehicleGrouping = [
  {
    label: "VIP月租车",
    value: 2
  },
  {
    label: "普通月租车",
    value: 3
  }
];
export const typeCode = [
  {
    label: "临保",
    value: 1
  },
  {
    label: "月保",
    value: 2
  },
  {
    label: "访客车",
    value: 3
  },
  {
    label: "无牌车",
    value: 4
  },
  {
    label: "其他",
    value: 5
  }
];
export const statusList = [
  {
    label: "已出库",
    value: 1
  },
  {
    label: "未出库",
    value: 0
  }
];
export const groupNumberList = [
  {
    label: "主库",
    value: 1
  },
  {
    label: "东库",
    value: 2
  },
  {
    label: "西库",
    value: 3
  }
];
export const tableColumn: tableColumnType[] = [
  {
    prop: "userName",
    label: "商户名称"
  },
  {
    prop: "mainlandLicensePlates",
    label: "车牌号/手机号码(无牌车)",
    width: 220
  },
  {
    prop: "endTime",
    label: "出场时间"
  },
  {
    prop: "totalDuration",
    label: "停车时长"
  },
  {
    prop: "orderNumber",
    label: "订单编号"
  },
  {
    prop: "totalAmount",
    label: "总计金额"
  },
  {
    prop: "totalDiscountAmount",
    label: "优惠金额"
  },

  {
    prop: "discount",
    label: "优惠信息"
  },
  {
    prop: "totalIncomeAmount",
    label: "收入金额"
  },
  {
    prop: "typeName",
    label: "类型名称"
  }
];

export const warehousingTableColumn:tableColumnType[] = [
  {
    prop: "mainlandLicensePlates",
    label: "车牌号码/手机号码"
  },
  {
    prop: "carGroupName",
    label: "车辆分组名称"
  },
  {
    prop: "deviceGroupName",
    label: "设备组号"
  },
  {
    prop: "isToll",
    label: "此处是否开始计费",
    handleFn: value => tollList.find(item => item.value == value)?.label ?? "--"
  },
  {
    prop: "status",
    label: "是否已出库",
    handleFn: value =>
      statusList.find(item => item.value == value)?.label ?? "--"
  },
  {
    prop: "startTime",
    label: "进库时间"
  }
] ;
export const outboundColumn: tableColumnType[] = [
  {
    prop: "mainlandLicensePlates",
    label: "车牌号码/手机号码"
  },
  {
    prop: "carGroupName",
    label: "车辆分组名称"
  },
  {
    prop: "deviceGroupName",
    label: "设备组号"
  },
  {
    prop: "endCameraDeviceIp",
    label: "出库摄像头IP"
  },
  {
    prop: "isToll",
    label: "此处是否结算计费",
    handleFn: value =>
      tollOutList.find(item => item.value == value)?.label ?? "--"
  },
  {
    prop: "startTime",
    label: "进库时间"
  },
  {
    prop: "endTime",
    label: "出库时间"
  },
  {
    prop: "remark",
    label: "备注",
    width: 100
  }
];

export interface GrowCardItem {
  icon: string;
  title: string;
  value: number;
  total: number;
  type: string;
  action: string;
}

export const growCardList: GrowCardItem[] = [
  {
    title: "进库车辆",
    icon: "total-sales|svg",
    value: 20000,
    total: 500000,
    type: "success",
    action: "日"
  },
  {
    title: "出库车辆",
    icon: "download-count|svg",
    value: 8000,
    total: 120000,
    type: "primary",
    action: "日"
  },
  {
    title: "月租收费",
    icon: "visit-count|svg",
    value: 2000,
    total: 120000,
    type: "danger",
    action: "月"
  },
  {
    title: "临停收费",
    icon: "transaction|svg",
    value: 5000,
    total: 50000,
    type: "danger",
    action: "月"
  }
];
export const carTypeList = [
  {
    value: "1",
    label: "内部车辆",
    charge: 0,
    key: "monthlyInternalCar"
  },
  {
    value: "2",
    label: "所属企业公车",
    charge: 0,
    key: "monthlyEnterpriseCar"
  },
  {
    value: "3",
    label: "外部车辆(机械车位)",
    charge: 0,
    key: "monthlyExternalCarMachinery"
  },
  {
    value: "4",
    label: "外部车辆(非机械车位)",
    charge: 0,
    key: "monthlyInternalCarNoMachinery"
  }
];
export const monthlyStatusList = [
  {
    value: "1",
    label: "在保"
  },
  {
    value: "2",
    label: "过保"
  }
];
