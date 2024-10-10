<script lang="ts" setup>
import { useECharts } from "@pureadmin/utils";
import { useUserStore } from "@/store/modules/user";
import { parkingSpaceStatistics } from "@/api";
import { Ref } from "vue";

const userId = useUserStore().userInfo.id;
const isAdmin = useUserStore().isAdmin;
const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
const data = ref<any>({
  issuedParkingSpaces: 0,
  ordinaryParkingSpace: 0,
  remainingParkingSpaces: 0,
  rentalParkingSpace: 0,
  totalParkingSpaces: 0,
  unlicensedParkingSpaces: 0,
  usedParkingSpaces: 0
});
const init = () => {
  const label: any = {
    formatter: [
      "{title|{b}}{abg|}",
      "{valueHead|租赁车位}{rateHead|普通车位}",
      "{hr|}",
      ` {value|${data.value?.rentalParkingSpace ?? 0}}{weatherHead|${data.value?.ordinaryParkingSpace ?? 0}}`
    ].join("\n"),
    backgroundColor: "#eee",
    borderColor: "#777",
    borderWidth: 1,
    borderRadius: 4,
    rich: {
      title: {
        color: "#eee",
        align: "center"
      },
      abg: {
        backgroundColor: "#333",
        width: "100%",
        align: "right",
        height: 25,
        borderRadius: [4, 4, 0, 0]
      },
      rate: {
        height: 20,
        align: "left"
      },
      weatherHead: {
        color: "#333",
        height: 30,
        align: "left"
      },
      hr: {
        borderColor: "#777",
        width: "100%",
        borderWidth: 0.5,
        height: 0
      },
      value: {
        width: 20,
        padding: [0, 20, 0, 30],
        align: "left"
      },
      valueHead: {
        color: "#333",
        width: 20,
        height: 30,
        padding: [0, 20, 0, 30],
        align: "center"
      },
      rateHead: {
        color: "#333",
        width: 40,
        align: "center",
        padding: [0, 10, 0, 0]
      }
    }
  };
  setOptions({
    tooltip: {
      trigger: "item",
      formatter: "{b} : {c} ({d}%)"
    },
    legend: {
      top: 10,
      left: "center",
      data: isAdmin ? ["剩余车位", "已用车位"] : ["未发券车位", "已发券车位"]
    },
    series: [
      {
        startAngle: 0,

        type: "pie",
        radius: "65%",
        center: ["50%", "50%"],
        selectedMode: "single",
        data: [
          {
            value: isAdmin
              ? data.value?.usedParkingSpaces
              : data.value?.unlicensedParkingSpaces,
            name: isAdmin ? "已用车位" : "未发券车位",
            label: isAdmin ? label : {}
          },
          {
            value: isAdmin
              ? data.value?.remainingParkingSpaces
              : data.value?.issuedParkingSpaces,
            name: isAdmin ? "剩余车位" : "已发券车位"
          }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  });
};
const getData = () => {
  parkingSpaceStatistics({ userId }).then((res: any) => {
    data.value = res.data;
    nextTick(() => {
      init();
    });
  });
};
onBeforeMount(getData);
</script>

<template>
  <div class="bg-white mt-[20px] rounded-[4px] dark:bg-[#141414] flex-1">
    <div class="font-bold text-[20px] px-[20px] leading-[60px]">车位统计</div>
    <!--    <el-empty v-show="yData.length == 0" description="暂无数据" />-->
    <div ref="chartRef" class="h-[400px] w-[100%]" />
  </div>
</template>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  display: flex;
  justify-content: space-between;

  .lf {
    font-weight: bold;
  }
}
</style>
