<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus/es/components/form";
import { updateParking } from "@/api";

interface Props {
  modelValue: boolean;
  fromData: {
    disposableNumber: number;
    id: string;
    parkingNumber: number;
  };
}

interface Emits {
  (e: "update:modelValue", isShow: boolean): void;

  (e: "updateFn"): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const form = ref<any>({
  disposableNumber: 0,
  id: "",
  parkingNumber: 0
});

watchEffect(() => {
  form.value = JSON.parse(JSON.stringify(props.fromData));
});

const ruleFormRef = ref<FormInstance>();
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl
    .validate()
    .then(() => {
      return updateParking(form.value);
    })
    .then(() => {
      ElMessage.success("编辑成功");
      emits("updateFn");
      emits("update:modelValue", false);
    });
};
const rules = reactive<FormRules<any>>({
  disposableNumber: [
    { required: true, message: "请输入可租赁车位数", trigger: "blur" }
  ],
  parkingNumber: [{ required: true, message: "请输入总车位", trigger: "blur" }]
});
const closeFn = () => {
  ruleFormRef.value?.resetFields(); // 重置表单验证器
};
</script>

<template>
  <el-dialog
    :destroy-on-close="true"
    :modelValue="modelValue"
    title="编辑车场配置"
    width="500px"
    @close="closeFn"
    @update:modelValue="$emit('update:modelValue', false)"
  >
    <el-form
      ref="ruleFormRef"
      :model="form"
      :rules="rules"
      label-position="top"
      label-width="120px"
    >
      <el-form-item label="可租赁车位数" prop="disposableNumber">
        <el-input
          v-model="form.disposableNumber"
          clearable
          placeholder="请输入可租赁车位数"
          type="number"
        />
      </el-form-item>
      <el-form-item label="总车位" prop="parkingNumber">
        <el-input
          v-model="form.parkingNumber"
          clearable
          placeholder="请输入总车位"
          type="number"
        />
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
  </el-dialog>
</template>

<style lang="scss" scoped></style>
