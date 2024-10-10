<script lang="ts" setup>
import CountTo from "@/components/CountTo/src/CountTo.vue";
import { useUserStore } from "@/store/modules/user";
import { getStatistics } from "@/api";

const isAdmin = useUserStore().isAdmin;
const userId = useUserStore().userInfo.id;
const data = ref<any>({
  todayPaymentAmount: 0,
  todayTemporaryAmount: 0,
  totalAccumulatePaymentAmount: 0,
  totalTemporaryAmount: 0
});
const getData = () => {
  getStatistics({ userId }).then((res: any) => {
    data.value = res.data;
  });
};
onBeforeMount(getData);
</script>

<template>
  <div
    class="bg-white px-[20px] mt-[20px] rounded-[4px] dark:bg-[#141414] flex-1"
  >
    <div class="font-bold text-[20px] leading-[60px]">收益统计</div>
    <div class="flex gap-[20px] flex-col items-center">
      <el-card class="flex-1 w-[80%]">
        <div class="flex items-center gap-20 mb-[20px]">
          <div class="h-[100%] w-[100px]">临保今日收益</div>
          <CountTo
            :endVal="data.todayTemporaryAmount ?? 0"
            :startVal="0"
            class="text-2xl flex-1 text-right"
            suffix="元"
          />
        </div>
        <div class="flex items-center gap-20">
          <div class="h-[100%] w-[100px]">临保总收益</div>
          <CountTo
            :endVal="data.totalTemporaryAmount ?? 0"
            :startVal="0"
            class="text-2xl flex-1 text-right"
            suffix="元"
          />
        </div>
        <RouterLink
          active-class="select"
          to="/orderForm/outboundOrder?typeCode=1"
        >
          <div class="mt-[20px] text-right cursor-pointer">
            点击查看临保订单流水>
          </div>
        </RouterLink>
      </el-card>
      <el-card v-if="isAdmin" class="flex-1 w-[80%]">
        <div class="flex items-center gap-20 mb-[20px]">
          <div class="h-[100%] w-[100px]">月保今日收益</div>
          <CountTo
            :endVal="data.todayPaymentAmount ?? 0"
            :startVal="0"
            class="text-2xl flex-1 text-right"
            suffix="元"
          />
        </div>
        <div class="flex items-center gap-20">
          <div class="h-[100%] w-[100px]">月保总收益</div>
          <CountTo
            :endVal="data.totalAccumulatePaymentAmount ?? 0"
            :startVal="0"
            class="text-2xl flex-1 text-right"
            suffix="元"
          />
        </div>
        <RouterLink
          active-class="select"
          to="/orderForm/outboundOrder?typeCode=2"
        >
          <div class="mt-[20px] text-right cursor-pointer">
            点击查看月保订单流水>
          </div>
        </RouterLink>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
