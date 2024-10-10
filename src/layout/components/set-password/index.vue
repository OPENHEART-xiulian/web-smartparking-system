<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus/es/components/form";
import { updatePassword } from "@/api";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage } from "element-plus";
import md5 from "js-md5";

const store = useUserStoreHook();

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: "update:modelValue", isShow: boolean): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const form = ref({
  password: "",
  confirmPassword: "",
  oldPassword: ""
});
const ruleFormRef = ref<FormInstance>();
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl
    .validate()
    .then(() => {
      return updatePassword({
        password: md5(form.value.password),
        oldPassword: md5(form.value.oldPassword),
        account: store.userInfo!.account
      });
    })
    .then(res => {
      store.userInfo = res.data;
      ElMessage.success("修改成功");
      emits("update:modelValue", false);
    });
};
const urlValidator = (rule: any, value: any, callback: any) => {
  if (value != form.value.password) {
    callback(new Error("两次密码不一致！"));
  } else {
    callback();
  }
};
const rules = reactive<FormRules<any>>({
  password: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  confirmPassword: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    { validator: urlValidator, trigger: "blur" }
  ],
  oldPassword: [{ required: true, message: "请输入原密码", trigger: "blur" }]
});

const closeFn = () => {
  ruleFormRef.value?.resetFields(); // 重置表单验证器
};
</script>

<template>
  <el-dialog
    :destroy-on-close="true"
    :modelValue="modelValue"
    append-to-body
    title="修改密码"
    width="400px"
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
      <el-form-item label="原密码" prop="oldPassword">
        <el-input
          v-model="form.oldPassword"
          placeholder="请输入原密码"
          show-password
          type="password"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input
          v-model="form.password"
          placeholder="请输入新密码"
          show-password
          type="password"
        />
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          placeholder="请确认新密码"
          show-password
          type="password"
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
              >保存
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
