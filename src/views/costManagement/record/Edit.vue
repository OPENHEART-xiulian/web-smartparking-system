<script lang="ts" setup>
import { FormInstance, FormRules } from "element-plus/es/components/form";
import { countMoney, createOrUpdate, getChargeRules } from "@/api";
import Carnumber from "@/components/Carnumber.vue";
import { carTypeList } from "@/views/data";

interface Props {
  modelValue: boolean;
  fromData: any;
}

interface Emits {
  (e: "update:modelValue", isShow: boolean): void;

  (e: "updateFn"): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const form = ref({
  carTypeCode: "",
  cardId: "",
  id: "",
  longTerm: 0,
  mainlandLicensePlates: "",
  monthlyEndTime: "",
  monthlyFree: 0,
  monthlyStartTime: "",
  parkingLotCode: "",
  phoneNumber: "",
  userName: ""
});
const ruleFormRef = ref<FormInstance>();
const monthlyMoney = ref(0);

const phoneNumberValidator = (rule: any, value: any, callback: any) => {
  if (value && !/^(?:(?:\+|00)86)?1\d{10}$/.test(value)) {
    callback(new Error("手机号格式错误"));
  } else {
    callback();
  }
};
const cardIdValidator = (rule: any, value: any, callback: any) => {
  if (
    value &&
    !/^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/.test(
      value
    )
  ) {
    callback(new Error("身份证格式错误"));
  } else {
    callback();
  }
};
const mainlandLicensePlatesValidator = (
  rule: any,
  value: any,
  callback: any
) => {
  if (
    !/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/.test(
      value
    )
  ) {
    callback(new Error("车牌号格式错误"));
  } else {
    callback();
  }
};
const rules = reactive<FormRules<any>>({
  phoneNumber: [{ validator: phoneNumberValidator, trigger: "blur" }],
  cardId: [{ required: false, validator: cardIdValidator, trigger: "blur" }],
  carTypeCode: [{ required: true, message: "请选择车辆类型", trigger: "blur" }],
  monthlyStartTime: [
    { required: true, message: "请选择购买月保月份", trigger: "blur" }
  ],
  mainlandLicensePlates: [
    { required: true, message: "请输入车牌号", trigger: "blur" },
    { validator: mainlandLicensePlatesValidator, trigger: "blur" }
  ]
});
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl
    .validate()
    .then(() => {
      return createOrUpdate(form.value);
    })
    .then(() => {
      ruleFormRef.value.resetFields();
      ElMessage.success(form.value.id ? "编辑成功" : "月保成功！");
      emits("update:modelValue", false);
      emits("updateFn");
    });
};
const closeFn = () => {
  ruleFormRef.value?.resetFields(); // 重置表单验证器
  monthlyMoney.value = 0;
};
const carVisible = ref(false);
const carNumber = ref<InstanceType<typeof Carnumber> | null>(null);
watchEffect(() => {
  if (props.modelValue) {
    form.value = JSON.parse(JSON.stringify(props.fromData));
  }
});
watchEffect(() => {
  carNumber.value?.updateValue(form.value.mainlandLicensePlates);
});
const carVisibleChange = () => {
  carVisible.value = false;
};
const changeValue = (item: string) => {
  carNumber.value.updateValue(item);
  carVisible.value = true;
};

const options = ref(carTypeList);
const freeTimePeriod = computed<any>({
  get() {
    return [form.value.monthlyStartTime, form.value.monthlyEndTime];
  },
  set(value) {
    form.value.monthlyStartTime = value?.[0] ?? "";
    form.value.monthlyEndTime = value?.[1] ?? "";
  }
});
onBeforeMount(() => {
  getChargeRules().then(res => {
    options.value.forEach(item => {
      item.charge = res.data[item.key];
    });
  });
});
watchEffect(() => {
  form.value.monthlyFree =
    options.value.find(item => item.value === form.value.carTypeCode)?.charge ||
    0;
});

watch(
  [
    () => form.value.carTypeCode,
    () => form.value.longTerm,
    () => form.value.monthlyFree,
    () => form.value.monthlyStartTime
  ],
  () => {
    const {
      carTypeCode,
      longTerm,
      monthlyEndTime,
      monthlyFree,
      monthlyStartTime
    } = form.value;
    if (carTypeCode && monthlyFree && (monthlyStartTime || longTerm)) {
      countMoney({
        carTypeCode,
        longTerm,
        monthlyEndTime,
        monthlyFree,
        monthlyStartTime
      }).then(res => {
        monthlyMoney.value = res.data;
      });
    }
  }
);
</script>

<template>
  <el-dialog
    :destroy-on-close="true"
    :modelValue="modelValue"
    :title="form.id ? '编辑月保缴费' : '新增月保缴费'"
    width="600px"
    @close="closeFn"
    @update:modelValue="$emit('update:modelValue', false)"
  >
    <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="135px">
      <el-form-item label="车牌号" prop="mainlandLicensePlates">
        <el-popover
          v-model="carVisible"
          placement="bottom"
          trigger="click"
          width="600"
        >
          <Carnumber
            ref="carNumber"
            v-model="form.mainlandLicensePlates"
            @fatherMethod="carVisibleChange"
          />
          <template #reference>
            <el-input
              v-model="form.mainlandLicensePlates"
              :maxlength="8"
              :validate-event="carVisible"
              placeholder="请输入车牌号"
              @input="changeValue(form.mainlandLicensePlates)"
            />
          </template>
        </el-popover>
      </el-form-item>
      <el-form-item label="车辆类型" prop="carTypeCode">
        <el-select v-model="form.carTypeCode" placeholder="请选择车辆类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :required="!form.longTerm"
        label="选择购买月保月份"
        prop="monthlyStartTime"
      >
        <div class="flex gap-[20px] items-center w-[100%]">
          <el-date-picker
            v-model="freeTimePeriod"
            :disabled="!!form.longTerm"
            end-placeholder="请选择结束月份"
            range-separator="To"
            start-placeholder="请选择开始月份"
            style="flex: 1"
            type="monthrange"
            value-format="YYYY-MM"
          />
          <el-checkbox
            v-model="form.longTerm"
            :false-value="0"
            :true-value="1"
            label="长期"
            size="large"
          />
        </div>
      </el-form-item>
      <el-form-item label="月保费用" prop="monthlyFree">
        <el-input v-model="form.monthlyFree" disabled type="number">
          <template #append>元/月</template>
        </el-input>
      </el-form-item>
      <el-form-item label="车位编号" prop="parkingLotCode">
        <el-input
          v-model="form.parkingLotCode"
          placeholder="请输入车位编号"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="userName">
        <el-input
          v-model="form.userName"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phoneNumber">
        <el-input
          v-model="form.phoneNumber"
          maxlength="11"
          placeholder="请输入手机号码"
          type="number"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="cardId">
        <el-input
          v-model="form.cardId"
          maxlength="18"
          placeholder="请输入身份证号"
        />
      </el-form-item>
      <el-form-item label="收费">
        <div class="font-bold text-[16px] text-[#e4393c]">
          ￥<span class="ml-1 text-[20px]">{{ monthlyMoney }}</span>
        </div>
      </el-form-item>
      <el-row justify="center" style="width: 100%">
        <el-col :span="12">
          <el-button
            size="large"
            style="width: 100%"
            type="primary"
            @click="onSubmit(ruleFormRef)"
          >
            保存
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
