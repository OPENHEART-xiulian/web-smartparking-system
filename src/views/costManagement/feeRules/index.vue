<script lang="ts" setup>
import {FormInstance, FormRules} from "element-plus/es/components/form";
import {getChargeRules, updateChargeRules} from "@/api";

const form = ref({
  freeDuration: 0,
  id: "",
  monthlyEnterpriseCar: "",
  monthlyExternalCarMachinery: "",
  monthlyInternalCar: "",
  monthlyInternalCarNoMachinery: "",
  feeCap: "",
  tollStandard: ""
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules<any>>({
  freeDuration: [
    {required: true, message: "请输入进场免费时长", trigger: "blur"}
  ],
  tollStandard: [
    {required: true, message: "请输入临保收费", trigger: "blur"}
  ],
  monthlyInternalCar: [
    {required: true, message: "请输入内部收费", trigger: "blur"}
  ],
  monthlyEnterpriseCar: [
    {required: true, message: "请输入所属企业公车", trigger: "blur"}
  ],
  monthlyExternalCarMachinery: [
    {required: true, message: "请输入外部车辆（机械车位）", trigger: "blur"}
  ],
  feeCap: [
    {required: true, message: "请输入临保日收费上限", trigger: "blur"}
  ],
  monthlyInternalCarNoMachinery: [
    {required: true, message: "请输入外部车辆（非机械车位）", trigger: "blur"}
  ]
});
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl
    .validate()
    .then(() => {
      return updateChargeRules(form.value);
    })
    .then(() => {
      ElMessage.success("保存成功");
    });
};
onBeforeMount(() => {
  getChargeRules().then(res => {
    form.value = res.data;
  });
});
</script>

<template>
  <div class="content bg-white dark:bg-[#141414]">
    <div class="max-w-[600px]">
      <div class="title">
        <div class="lf">收费规则设置</div>
      </div>
      <el-form
        ref="ruleFormRef"
        :model="form"
        :rules="rules"
        label-width="176px"
      >
        <el-form-item label="进场免费时长" prop="freeDuration">
          <el-input
            v-model="form.freeDuration"
            placeholder="请输入进场免费时长"
            type="number"
          >
            <template #append>分钟</template>
          </el-input>
        </el-form-item>
        <el-form-item label="临保收费" prop="tollStandard">
          <el-input
            v-model="form.tollStandard"
            placeholder="请输入临保收费"
            type="number"
          >
            <template #append>元/小时</template>
          </el-input>
        </el-form-item>
        <el-form-item label="临保日收费上限" prop="feeCap">
          <el-input
            v-model="form.feeCap"
            placeholder="请输入临保日收费上限"
            type="number"
          >
            <template #append>天</template>
          </el-input>
        </el-form-item>
        <div class="title">
          <div class="lf">月保收费</div>
        </div>
        <el-form-item label="内部收费" prop="monthlyInternalCar">
          <el-input
            v-model="form.monthlyInternalCar"
            placeholder="请输入内部收费"
            type="number"
          >
            <template #append>元/月</template>
          </el-input>
        </el-form-item>
        <el-form-item label="所属企业公车" prop="monthlyEnterpriseCar">
          <el-input
            v-model="form.monthlyEnterpriseCar"
            placeholder="请输入所属企业公车"
            type="number"
          >
            <template #append>元/月</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="外部车辆（机械车位）"
          prop="monthlyExternalCarMachinery"
        >
          <el-input
            v-model="form.monthlyExternalCarMachinery"
            placeholder="请输入外部车辆（机械车位）"
            type="number"
          >
            <template #append>元/月</template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="外部车辆（非机械车位）"
          prop="monthlyInternalCarNoMachinery"
        >
          <el-input
            v-model="form.monthlyInternalCarNoMachinery"
            placeholder="请输入外部车辆（非机械车位）"
            type="number"
          >
            <template #append>元/月</template>
          </el-input>
        </el-form-item>
        <el-form-item>
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
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content {
  height: calc(100vh - 160px);
  border-radius: 10px;
  padding: 20px;

  .title {
    margin-bottom: 18px;
    font-size: 16px;
    display: flex;
    justify-content: space-between;

    .lf {
      font-weight: bold;
      flex-shrink: 0;
      margin-right: 20px;
    }

    .rg {
      display: flex;
      align-items: flex-start;
      font-size: 14px;
      gap: 20px;
      flex: 1;
    }
  }
}
</style>
