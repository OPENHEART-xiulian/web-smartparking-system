<template>
  <div class="car_no_popover">
    <div class="row_div">
      <div v-for="item in area" class="every_div">
        <button @click="selectCarNo(item)">{{ item }}</button>
      </div>
    </div>
    <div class="row_div">
      <div v-for="item in areaLetter" class="every_div">
        <button @click="selectCarNo(item)">{{ item }}</button>
      </div>
    </div>
    <div class="row_div">
      <div class="btn_div">
        <el-button
          :icon="Back"
          size="large"
          type="primary"
          @click="backBtnHandle"
        ></el-button>
        <el-button size="large" type="primary" @click="clearBtnHandle"
          >清空
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { Back } from "@element-plus/icons-vue";

export default {
  computed: {
    Back() {
      return Back;
    }
  },
  props: {
    value: Boolean,
    modelValue: String
  },
  data() {
    return {
      visible: false,
      carNo: "",
      area: [
        "京",
        "津",
        "沪",
        "渝",
        "冀",
        "豫",
        "云",
        "辽",
        "黑",
        "湘",
        "皖",
        "鲁",
        "新",
        "苏",
        "浙",
        "赣",
        "鄂",
        "桂",
        "甘",
        "晋",
        "蒙",
        "陕",
        "吉",
        "贵",
        "粤",
        "青",
        "藏",
        "川",
        "宁",
        "琼",
        "港",
        "澳",
        "学",
        "领",
        "警"
      ],
      areaLetter: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
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
      ]
    };
  },
  methods: {
    selectCarNo(item) {
      if (this.carNo.length <= 7) {
        this.carNo = this.carNo + item;
        this.$emit("update:modelValue", this.carNo);
      }
    },
    backBtnHandle() {
      if (this.carNo.length > 0) {
        this.carNo = this.carNo.substring(0, this.carNo.length - 1);
        this.$emit("update:modelValue", this.carNo);
      }
    },
    sureBtnHandle() {
      this.$emit("fatherMethod");
    },
    clearBtnHandle() {
      this.carNo = "";
      this.$emit("update:modelValue", this.carNo);
    },
    updateValue(item) {
      this.carNo = item;
      this.$emit("update:modelValue", this.carNo);
    }
  }
};
</script>
<style scoped>
.car_no_popover {
  margin-top: 18px !important;
}

.every_div {
  margin-left: 4px;
  margin-top: 4px;
}

.every_div button {
  width: 36px;
  height: 30px;
  cursor: pointer;
  border-radius: 4px;
}

.row_div {
  display: flex;
  flex-wrap: wrap;
}

.row_div .btn_div {
  position: absolute;
  right: 13px;
  bottom: 11px;
}

.row_div .btn_div button {
  height: 30px;
  padding: 4px 13px;
}
</style>
