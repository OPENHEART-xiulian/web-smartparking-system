<script lang="ts" setup>
import { useECharts } from "@pureadmin/utils";
import { countOrder } from "@/api";
import { useUserStore } from "@/store/modules/user";

const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
const year = ref(new Date());
const userId = useUserStore().userInfo.id;
const data1 = ref([]);
const data2 = ref([]);
const data3 = ref([]);
const init = () => {
  setOptions({
    legend: {},
    xAxis: {
      type: "category",
      data: [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月"
      ],
      axisTick: {
        alignWithLabel: true
      }
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    yAxis: {
      type: "value"
    },
    grid: {
      // 让图表占满容器
      top: "40px",
      left: "60px",
      right: "60px",
      bottom: "40px"
    },

    series: [
      {
        data: data1.value,
        name: "收益",
        type: "bar",
        stack: "Ad",
        barWidth: "60%",
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)"
        }
      },
      {
        name: "优惠",
        type: "bar",
        stack: "Ad",
        emphasis: {
          focus: "series"
        },
        data: data2.value
      },
      {
        name: "总数",
        type: "bar",
        barWidth: 10,
        stack: "Search Engine",
        emphasis: {
          focus: "series"
        },
        data: data3.value
      }
    ]
  });
};
const getData = (year: any) => {
  year = year.getFullYear();
  countOrder({ year, userId }).then((res: any) => {
    data1.value = [];
    data2.value = [];
    data3.value = [];
    res.data.forEach(v => {
      data1.value.push(v.totalIncomeAmount);
      data2.value.push(v.totalDiscountAmount);
      data3.value.push(v.totalAmount);
    });
    nextTick(() => {
      init();
    });
  });
};
onBeforeMount(() => getData(year.value));
</script>

<template>
  <div class="bg-white mt-[20px] rounded-[4px] dark:bg-[#141414]">
    <div
      class="font-bold px-[20px] w-[100%] text-[20px] leading-[60px] flex justify-between items-center"
    >
      <div>月收费统计</div>
      <el-date-picker
        v-model="year"
        :clearable="false"
        placeholder="请选择年份"
        type="year"
        @change="getData"
      />
    </div>
    <el-empty v-show="data3.length == 0" description="暂无数据" />
    <div
      v-if="data3.length > 0"
      ref="chartRef"
      class="h-[400px] w-[100%]"
    ></div>
  </div>
</template>

<style lang="scss" scoped></style>
