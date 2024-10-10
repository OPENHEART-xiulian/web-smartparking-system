<script lang="ts" setup>
interface Props {
  modelValue: string;
}

interface Emits {
  (e: "update:modelValue", _: string): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();
defineOptions({ name: "LicensePlateInput" });
const sfArray = [
  "鲁",
  "皖",
  "澳",
  "京",
  "闽",
  "甘",
  "粤",
  "桂",
  "贵",
  "琼",
  "冀",
  "豫",
  "黑",
  "鄂",
  "湘",
  "吉",
  "苏",
  "赣",
  "辽",
  "蒙",
  "宁",
  "青",
  "晋",
  "陕",
  "沪",
  "川",
  "台",
  "津",
  "藏",
  "港",
  "新",
  "云",
  "浙",
  "渝"
];
const letterArray = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z"
];
const sf = ref(props.modelValue[0] ?? "");
const letter = ref(props.modelValue[1] ?? "");
const plateNumber = ref(props.modelValue.slice(3) ?? "");

watch([sf, letter, plateNumber], () => {
  if (sf.value && letter.value && plateNumber.value) {
    emits("update:modelValue", sf.value + letter.value + plateNumber.value);
  } else {
    emits("update:modelValue", "");
  }
});
</script>

<template>
  <div class="LicensePlateInput">
    <el-select v-model="sf" placeholder="" style="width: 60px; flex-shrink: 0">
      <el-option
        v-for="item in sfArray"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
    <el-select
      v-model="letter"
      placeholder=""
      style="width: 60px; flex-shrink: 0"
    >
      <el-option
        v-for="item in letterArray"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
    <el-input
      v-model="plateNumber"
      clearable
      placeholder="请输入"
      style="width: 100%"
    />
  </div>
</template>

<style lang="scss" scoped>
.LicensePlateInput {
  display: flex;
  align-content: center;
  gap: 5px;
  width: 100%;
}
</style>
