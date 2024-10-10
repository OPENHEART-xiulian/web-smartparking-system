<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus/es/components/form";
import UploadImage from "@/components/UploadImage.vue";
import { pageRoleListUser, userCreateOrUpdate } from "@/api";
import { TableType } from "@/views/system/setRole/index.vue";

interface Props {
  modelValue: boolean;
  fromData: TableType;
}

interface Emits {
  (e: "update:modelValue", isShow: boolean): void;

  (e: "updateFn"): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const form = ref<TableType>({
  account: "",
  freeTime: 15,
  frontBusinessLicense: "",
  headSculpture: "",
  id: "",
  phoneNumber: "",
  unitAddress: "",
  roleId: "",
  status: 1,
  userName: ""
});
const roleList = ref([]);

watchEffect(() => {
  form.value = JSON.parse(JSON.stringify(props.fromData));
});
const getRoleList = () => {
  pageRoleListUser({ pageNumber: 1, pageSize: 1000 }).then((res: any) => {
    roleList.value = res.data.list;
  });
};
onBeforeMount(() => {
  getRoleList();
});
const ruleFormRef = ref<FormInstance>();
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl
    .validate()
    .then(() => {
      return userCreateOrUpdate(form.value);
    })
    .then(() => {
      if (!form.value.id) {
        ElMessageBox.alert("新建账号密码默认是123456", "新建账号成功", {
          confirmButtonText: "知道了",
          callback: () => {
            emits("updateFn");
            emits("update:modelValue", false);
          }
        });
      } else {
        ElMessage.success("编辑成功");
        emits("updateFn");
        emits("update:modelValue", false);
      }
    });
};
const urlValidator = (rule: any, value: any, callback: any) => {
  if (!/^(?:(?:\+|00)86)?1\d{10}$/.test(value)) {
    callback(new Error("手机号格式错误"));
  } else {
    callback();
  }
};
const rules = reactive<FormRules<any>>({
  account: [{ required: true, message: "请输入账户", trigger: "blur" }],
  userName: [{ required: true, message: "请输入单位名称", trigger: "blur" }],
  roleId: [{ required: true, message: "请选择角色", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "blur" }],
  phoneNumber: [
    { required: true, message: "请输入联系电话", trigger: "blur" },
    { validator: urlValidator, trigger: "blur" }
  ],
  freeTime: [
    { required: true, message: "请输入免费停车时长", trigger: "blur" }
  ],
  frontBusinessLicense: [
    { required: true, message: "请上传营业执照", trigger: "blur" }
  ]
});
const closeFn = () => {
  ruleFormRef.value?.resetFields(); // 重置表单验证器
};
const statusList = [
  {
    value: 1,
    label: "正常"
  },
  {
    value: 2,
    label: "锁定"
  },
  {
    value: 3,
    label: "禁用"
  }
];
</script>

<template>
  <el-dialog
    :destroy-on-close="true"
    :modelValue="modelValue"
    :title="fromData.id ? '编辑账户' : '新增账户'"
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
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="账户" prop="account">
            <el-input v-model="form.account" placeholder="请输入账户" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位名称" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入单位名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phoneNumber">
            <el-input
              v-model="form.phoneNumber"
              maxlength="11"
              placeholder="请输入联系电话"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位地址" prop="unitAddress">
            <el-input v-model="form.unitAddress" placeholder="请输入单位地址" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="form.roleId" placeholder="请选择角色">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择状态">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.roleId !== '3'" :gutter="20">
        <el-col :span="12">
          <el-form-item label="免费停车时长（分钟）" prop="freeTime">
            <el-input
              v-model="form.freeTime"
              placeholder="请输入免费停车时长"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="营业执照" prop="frontBusinessLicense">
            <UploadImage v-model="form.frontBusinessLicense" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位logo" prop="headSculpture">
            <UploadImage v-model="form.headSculpture" />
          </el-form-item>
        </el-col>
      </el-row>

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
