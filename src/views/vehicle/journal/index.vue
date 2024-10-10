<script lang="ts" setup>
import WarehousingCar from "./WarehousingCar.vue";
import Outbound from "./Outbound.vue";

defineOptions({
  name: "Journal"
});
</script>

<template>
  <div>
    <WarehousingCar />
    <Outbound />
  </div>
</template>
