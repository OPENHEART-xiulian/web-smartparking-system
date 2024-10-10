<template>
  <el-upload
    :action="action"
    :before-upload="beforeAvatarUpload"
    :data="{ fileSize: imgSize, fileName }"
    :headers="{}"
    :on-error="handleAvatarError"
    :on-success="handleAvatarSuccess"
    :show-file-list="false"
    accept=".jpg,.png,.jpeg,.bmp,.webp,.svg,.gif,.ico"
    class="avatar-uploader"
    name="files"
  >
    <img
      v-if="modelValue"
      :src="_src(modelValue)"
      :style="style"
      alt="icon"
      class="upload_box"
    />
    <div v-else :style="style" class="upload_box">
      <el-icon class="avatar-uploader-icon">
        <Plus />
      </el-icon>
    </div>
  </el-upload>
</template>
<script lang="ts" setup>
import { Plus } from "@element-plus/icons-vue";
import type { UploadProps } from "element-plus/es/components/upload/src/upload";
import { _src } from "@/utils";

type propsType = {
  modelValue: any;
  style?: any;
  imgSize?: number; // 图片大小，单位M
  fileName?: string | null;
  host?: string;
  api?: string;
  imgApi?: string;
};
type emitType = {
  (e: "update:modelValue", url: string): void;
  (e: "callbackFn", path: string): void;
};
let Loading: any = null;

const props = withDefaults(defineProps<propsType>(), {
  imgSize: 2,
  fileName: null,
  host: import.meta.env.VITE_API_IMGHOST,
  imgApi: import.meta.env.VITE_API_IMG_REPLACE,
  api: "/upload/files"
});
const action = import.meta.env.VITE_API_HOST + props.api;
const item = defineEmits<emitType>();
const handleAvatarSuccess: UploadProps["onSuccess"] = response => {
  if (response.code == 200) {
    ElMessage.success("上传成功！");
    item("callbackFn", response?.data);
    item("update:modelValue", response?.data);
  } else {
    ElMessage.error(response.message);
  }
  Loading.close();
};

const handleAvatarError = () => {
  Loading.close();
  ElMessage.error("上传失败！");
};
const beforeAvatarUpload: UploadProps["beforeUpload"] = rawFile => {
  if (rawFile.size / 1024 / 1024 > props.imgSize) {
    ElMessage.error(`图片大小不能超过${props.imgSize}MB！`);
    return false;
  }
  Loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(255, 255, 255, 0.8)"
  });
  return true;
};
</script>

<style lang="scss" scoped>
.upload_box {
  width: 120px;
  height: 120px;
  border: 1px solid #ededed;
  border-radius: 4px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: end;
  object-fit: contain;

  .avatar-uploader-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 20px;
    color: #b7bac0;
  }
}
</style>
