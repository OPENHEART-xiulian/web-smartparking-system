<script lang="ts" setup>
import {FormInstance, FormRules} from "element-plus/es/components/form";
import {getWeChatJsapiPay, weChatJsapiPayCreateOrUpdate} from "@/api";
import { UploadUserFile} from 'element-plus'
import type {  UploadProps,  } from 'element-plus'
import {useUserStore} from '@/store/modules/user'
const form = ref({
  apiV3Key: "",
  appId: "",
  currency: "",
  id: "",
  macId: "",
  macSerialNo: "",
  privateKeyPath: "",
  secret: ""
});
const token=useUserStore().userInfo.token;
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules<any>>({
  appId: [
    {required: true, message: "微信公众号appid", trigger: "blur"}
  ],
  currency: [
    {required: true, message: "请输入币种", trigger: "blur"}
  ],
  apiV3Key: [
    {required: true, message: "请输入商户APIv3密钥", trigger: "blur"}
  ],
  macId: [
    {required: true, message: "请输入商户号", trigger: "blur"}
  ],
  macSerialNo: [
    {required: true, message: "请输入商户API证书序列号", trigger: "blur"}
  ],
  secret: [
    {required: true, message: "请输入公众号密钥", trigger: "blur"}
  ],
  privateKeyPath: [
    {required: true, message: "请上传商户私钥文件", trigger: "blur"}
  ]
});
const fileList = ref<UploadUserFile[]>([

])
const action = import.meta.env.VITE_API_HOST + '/systemManagement/uploadPrivateKey';
let Loading: any = null;
const handleAvatarError = () => {
  Loading.close();
  ElMessage.error("上传失败！");
};
const handleAvatarSuccess: UploadProps["onSuccess"] = response => {
  if (response.code == 200) {
    ElMessage.success("上传成功！");
    form.value.privateKeyPath = response.data;
    fileList.value = [{
      name: response.data,
      url: response.data,
    }];
  } else {
    ElMessage.error(response.message);
  }
  Loading.close();
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = rawFile => {

  Loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(255, 255, 255, 0.8)"
  });
  return true;
};
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl
    .validate()
    .then(() => {
      return weChatJsapiPayCreateOrUpdate(form.value);
    })
    .then(() => {
      ElMessage.success("保存成功");
    });
};
onBeforeMount(() => {
  getWeChatJsapiPay().then(res => {
    form.value = res.data;
    fileList.value.push(  {
      name: res.data.privateKeyPath,
      url: res.data.privateKeyPath,
    },)
  });
});
</script>

<template>
  <div class="content bg-white dark:bg-[#141414]">
    <div class="max-w-[600px]">
      <div class="title">
        <div class="lf">微信支付配置</div>
      </div>
      <el-form
        ref="ruleFormRef"
        :model="form"
        :rules="rules"
        label-width="176px"
      >
        <el-form-item label="微信公众号appid" prop="appId">
          <el-input
            v-model="form.appId"
            placeholder="请输入微信公众号appid"
            clearable
        />
        </el-form-item>
        <el-form-item label="币种" prop="currency">
          <el-input
            v-model="form.currency"
            placeholder="请输入币种"
            clearable
      />
        </el-form-item>
        <el-form-item label="商户APIv3密钥" prop="apiV3Key">
          <el-input
            v-model="form.apiV3Key"
            placeholder="请输入商户APIv3密钥"
            clearable
          />
        </el-form-item>
        <el-form-item label="商户号" prop="macId">
          <el-input
            v-model="form.macId"
            placeholder="请输入商户号"
            clearable
         />
        </el-form-item>
        <el-form-item label="商户API证书序列号" prop="macSerialNo">
          <el-input
            v-model="form.macSerialNo"
            placeholder="请输入商户API证书序列号"
            clearable
         />
        </el-form-item>
        <el-form-item
          label="公众号密钥"
          prop="secret"
        >
          <el-input
            v-model="form.secret"
            placeholder="请输入公众号密钥"
            clearable
         />
        </el-form-item>
        <el-form-item
          label="商户私钥文件上传"
          prop="privateKeyPath"
        >
          <div style="width: 100%">
          <el-upload
              v-model:file-list="fileList"
              ref="upload"
              :action="action"
              multiple
              :on-error="handleAvatarError"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              accept=".pem"
              name="files"
              :headers="{Authorization:token}"
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
          </div>
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
