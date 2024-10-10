<script lang="ts" setup>
interface Props {
  modelValue: boolean;
  data: any;
}

interface Emits {
  (e: "update:modelValue", isShow: boolean): void;
}

const form = ref({
  discount: "",
  endTime: "",
  id: "",
  isItOver: 0,
  mainlandLicensePlates: "",
  receiveTime: "",
  startTime: "",
  totalAmount: "",
  totalDiscountAmount: "",
  totalDuration: "",
  totalIncomeAmount: "",
  userId: ""
});
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
watchEffect(() => {
  form.value = JSON.parse(JSON.stringify(props.data));
});
</script>

<template>
  <el-dialog
    :destroy-on-close="true"
    :modelValue="modelValue"
    title="领券详情"
    width="400px"
    @update:modelValue="$emit('update:modelValue', false)"
  >
    <div>
      <div class="mb-[20px]">停车场</div>
      <div class="flex justify-between mb-[20px]">
        <div>车牌号码：</div>
        <div>{{ form.mainlandLicensePlates ?? "--" }}</div>
      </div>
      <div class="flex justify-between mb-[20px]">
        <div>进场时间：</div>
        <div>{{ form.startTime ?? "--" }}</div>
      </div>
      <div class="flex justify-between mb-[20px]">
        <div>出场时间：</div>
        <div>{{ form.endTime ?? "--" }}</div>
      </div>
      <div class="flex justify-between mb-[20px]">
        <div>停车时长：</div>
        <div>{{ form.totalDuration ?? "--" }}</div>
      </div>
      <el-divider />
      <div class="flex justify-between mb-[20px]">
        <div>总计金额：</div>
        <div>{{ form.totalAmount ?? "--" }}元</div>
      </div>
      <div class="flex justify-between mb-[20px]">
        <div>优惠金额：</div>
        <div>{{ form.totalDiscountAmount ?? "--" }}元</div>
      </div>
      <div class="flex justify-between mb-[20px]">
        <div>优惠信息：</div>
        <div>{{ form.discount ?? "--" }}</div>
      </div>
      <div class="flex justify-between mb-[20px]">
        <div>需付金额：</div>
        <div>{{ form.totalIncomeAmount ?? "--" }}元</div>
      </div>
      <div class="mt-[40px] text-[#e4393c] text-[30px] text-center">
        领券成功
      </div>
      <div class="mt-[20px] text-center">
        请于领劵后
        <span class="text-[#e4393c]">30分钟内</span>
        离场，超时需要补缴停车费
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
