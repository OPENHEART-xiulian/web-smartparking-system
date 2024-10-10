<script lang="ts" setup>
import Carnumber from "@/components/Carnumber.vue";
import { FormInstance, FormRules } from "element-plus/es/components/form";
import { useUserStore } from "@/store/modules/user";
import { assignedNumber, createParkCollect, generateQRCode } from "@/api";
import Details from "@/views/business/couponIssuance/Details.vue";
import { _src } from "@/utils";

const ruleFormRef = ref<FormInstance>();
const isShow = ref(false);
const data = ref({});
const user = useUserStore().userInfo;
const form = ref({
  plates: "",
  userId: user.id
});
const mainlandLicensePlatesValidator = (
  rule: any,
  value: any,
  callback: any
) => {
  if (
    !/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/.test(
      value
    ) &&
    !/^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/.test(
      value
    )
  ) {
    callback(new Error("请输入正确的车牌号或手机号格"));
  } else {
    callback();
  }
};
const rules = reactive<FormRules<any>>({
  plates: [
    {
      required: true,
      message: "请输入您的车牌号码/手机号码（无牌车）",
      trigger: "blur"
    },
    { validator: mainlandLicensePlatesValidator, trigger: "blur" }
  ]
});
const carVisible = ref(false);
const carNumber = ref<InstanceType<typeof Carnumber> | null>(null);
const carVisibleChange = () => {
  carVisible.value = false;
};
const changeValue = (item: string) => {
  carNumber.value.updateValue(item);
  carVisible.value = true;
};
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (status.value) {
    if (!formEl) return;
    formEl
      .validate()
      .then(() => {
        return createParkCollect(form.value);
      })
      .then(res => {
        ruleFormRef.value.resetFields();
        isShow.value = true;
        data.value = res.data;
      });
  } else {
    ElMessage.error(user.userName + "已无多余优惠卷可以领取，请稍后再试！");
  }
};
const num = ref(0);
const status = ref(0);
const url = ref("");
onBeforeMount(() => {
  const userId = user.id;
  getCode();
  assignedNumber({ userId }).then(res => {
    num.value = res.data.assignedNumber ?? 0;
    status.value = res.data.assignedStatus ?? 0;
  });
});
let time = null;
const getCode = () => {
  clearTimeout(time);
  const userId = user.id;
  generateQRCode({
    userId,
    url: "https://smartparkingh5.xlbzone.com/#/pages/parkingLot/parkingLot"
  }).then(res => {
    url.value = res.data;
    time = setTimeout(getCode, 1800000);
  });
};
onBeforeUnmount(() => clearTimeout(time));
</script>

<template>
  <div class="content bg-white dark:bg-[#141414] h-[calc(100vh-155px)]">
    <div class="title">
      <div class="lf">停车领券-电脑端</div>
    </div>
    <div class="w-[500px] mx-auto">
      <el-form ref="ruleFormRef" :model="form" :rules="rules">
        <div class="text-center mb-[20px]">电脑端领券</div>
        <el-form-item prop="plates">
          <el-popover
            v-model="carVisible"
            placement="bottom"
            trigger="click"
            width="600"
          >
            <Carnumber
              ref="carNumber"
              v-model="form.plates"
              @fatherMethod="carVisibleChange"
            />
            <template #reference>
              <el-input
                v-model="form.plates"
                :validate-event="carVisible"
                maxlength="11"
                placeholder="请输入您的车牌号码/手机号码（无牌车）"
                @input="changeValue(form.plates)"
              />
            </template>
          </el-popover>
        </el-form-item>
        <div class="flex justify-between mb-[20px]">
          <div>商家抵用券：</div>
          <div>{{ user.userName }}</div>
        </div>
        <div class="flex justify-between mb-[20px]">
          <div>剩余抵用券：</div>
          <div>{{ num }}张</div>
        </div>
        <el-row justify="center" style="width: 100%">
          <el-col :span="12">
            <el-button
              size="large"
              style="width: 100%"
              type="primary"
              @click="onSubmit(ruleFormRef)"
            >
              点击领券
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-divider />
    <div class="w-[500px] mx-auto">
      <div class="text-center mb-[20px]">手机端领券</div>
      <img
        :src="_src(url)"
        alt="二维码"
        class="w-[200px] h-[200px] mx-auto block mb-[20px]"
      />
      <div class="text-center">
        动态码，30分钟生成一次，每次扫码30分钟内有效。
      </div>
      <el-row justify="center" style="width: 100%">
        <el-col :span="12">
          <el-button
            size="large"
            style="width: 100%; margin-top: 20px"
            type="primary"
            @click="getCode"
          >
            刷新二维码
          </el-button>
        </el-col>
      </el-row>
    </div>
    <Details v-model="isShow" :data="data" />
  </div>
</template>

<style lang="scss" scoped>
.content {
  margin-bottom: 20px;

  padding: 20px;
  border-radius: 5px;

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
