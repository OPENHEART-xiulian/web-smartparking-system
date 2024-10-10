<script lang="ts" setup>
import TrendChart from "./TrendChart.vue";
import ParkingLot from "./ParkingLot.vue";
import PaymentTable from "./Statistics.vue";

defineOptions({
  name: "Welcome"
});
</script>

<template>
  <div>
    <!--      <CountTo :endVal="item.value" :startVal="1" class="text-2xl" />-->
    <div class="flex gap-[20px]">
      <ParkingLot :data-list="[]" />
      <PaymentTable :data-list="[]" />
    </div>
    <TrendChart />
  </div>
</template>
<style lang="scss" scoped>
::v-deep .el-card__header {
  padding: 0 12px !important;
  line-height: 38px;
  font-weight: bold;
}
</style>
