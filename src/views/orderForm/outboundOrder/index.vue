<script lang="ts" setup>
import { orderTotalPageList, totalPageListType } from "@/api";
import { computed } from "vue";
import { tableColumn, typeCode } from "@/views/data";
import { useRoute } from "vue-router";
import { useUserStore } from "@/store/modules/user";

defineOptions({
  name: "MonthlyRent"
});
const isAdmin = useUserStore().isAdmin;
const userId = useUserStore().userInfo.id;
const dataList = ref<totalPageListType[]>([]);
const editIndex = ref(-1);
const params = reactive({
  pageNumber: 1,
  pageSize: 10,
  total: 0,
  totalNumber: 0
});
const route = useRoute();
const searchParams = reactive({
  discount: "",
  endTime: "",
  mainlandLicensePlates: "",
  orderNumber: "",
  startTime: "",
  totalAmount: "",
  totalDiscountAmount: "",
  totalDuration: "",
  totalIncomeAmount: "",
  typeCode: +route.query?.typeCode || "",
  typeName: "",
  userId: route.query?.userId || userId,
  userName: ""
});
//获取数据
const getData = () => {
  const { pageSize, pageNumber } = params;
  orderTotalPageList({
    pageSize,
    pageNumber,
    ...searchParams
  }).then((res: any) => {
    editIndex.value = -1;
    const { pageNumber, pageSize, total, totalNumber, list } = res.data;
    dataList.value = list;
    Object.assign(params, { pageNumber, pageSize, total, totalNumber });
  });
};
const tooltipOptions: any = {
  popperClass: "tool-tip",
  placement: "bottom"
};
const indexMethod = (index: number) => {
  const { pageSize, pageNumber } = params;
  return index + 1 + (pageNumber - 1) * pageSize;
};
onBeforeMount(getData);
const tableRef = ref<any>(null);
const tableHeight = computed(() => {
  let windowHeight =
    document.documentElement.clientHeight || document.body.clientHeight;
  return windowHeight - 460;
});
</script>
<template>
  <div class="bg-white dark:bg-[#141414] content">
    <div class="c_box">
      <div class="title">
        <div class="lf">出库订单流水</div>
      </div>
      <div class="form_box_p">
        <div class="form_box">
          <div class="form_item_box">
            <div>车牌号/手机号码(无牌车)：</div>
            <el-input
              v-model="searchParams.mainlandLicensePlates"
              clearable
              placeholder="请输入车牌号/手机号码(无牌车)"
            />
          </div>
          <div class="form_item_box">
            <div>订单编号：</div>
            <el-input
              v-model="searchParams.orderNumber"
              clearable
              placeholder="请输入订单编号"
            />
          </div>
          <div v-if="isAdmin" class="form_item_box">
            <div>商户：</div>
            <el-input
              v-model="searchParams.userName"
              clearable
              placeholder="请输入商户"
            />
          </div>
          <div class="form_item_box">
            <div>停车类型：</div>
            <el-select
              v-model="searchParams.typeCode"
              clearable
              placeholder="请选择停车类型"
              style="width: 100%"
            >
              <el-option
                v-for="item in typeCode"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="form_item_box">
            <div>进场时间：</div>
            <div class="time_picker_date">
              <el-date-picker
                v-model="searchParams.startTime"
                placeholder="请选择进场时间"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </div>
          </div>
          <div class="form_item_box">
            <div>出场时间：</div>
            <div class="time_picker_date">
              <el-date-picker
                v-model="searchParams.endTime"
                placeholder="请选择出场时间"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </div>
          </div>

          <div class="form_item_box">
            <div>总计金额：</div>
            <el-input
              v-model="searchParams.totalAmount"
              clearable
              placeholder="请输入总计金额"
              type="number"
            />
          </div>
          <div class="form_item_box">
            <div>优惠金额：</div>
            <el-input
              v-model="searchParams.totalDiscountAmount"
              clearable
              placeholder="请输入优惠金额"
              type="number"
            />
          </div>
          <div class="form_item_box">
            <div>收入金额：</div>
            <el-input
              v-model="searchParams.totalIncomeAmount"
              clearable
              placeholder="请输入收入金额"
              type="number"
            />
          </div>
          <div class="form_item_box">
            <div>停车时长：</div>
            <el-input
              v-model="searchParams.totalDuration"
              clearable
              placeholder="请输入停车时长"
              type="number"
            />
          </div>
        </div>
        <el-button class="flex-shrink-1" type="primary" @click="getData">
          搜索
        </el-button>
      </div>
      <el-table
        ref="tableRef"
        :data="dataList"
        :height="tableHeight"
        :tooltip-options="tooltipOptions"
        show-overflow-tooltip
      >
        <el-table-column
          :index="indexMethod"
          :show-overflow-tooltip="false"
          align="center"
          label="序号"
          min-width="60"
          type="index"
        />
        <el-table-column
          v-for="(item, index) in tableColumn"
          :key="index"
          :label="item.label"
          :width="item.width"
          align="center"
        >
          <template #default="scope">
            {{ scope.row[item.prop] ?? "--" }}
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination_box">
        <el-pagination
          v-if="params.total"
          v-model:current-page="params.pageNumber"
          v-model:page-size="params.pageSize"
          :page-sizes="[10, 50, 100, 150]"
          :small="false"
          :total="params.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="getData"
          @current-change="getData"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
::v-deep .el-popper {
  max-width: 200px !important;
}

.content {
  margin-bottom: 20px;

  .c_box {
    padding: 20px;
    border-radius: 5px;
  }

  .title_box {
    font-size: 16px;
    font-weight: bold;
    line-height: 32px;
  }

  .pagination_box {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}

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

.form_box_p {
  display: flex;
  font-size: 14px;
  gap: 20px;
  margin-bottom: 10px;
  align-items: flex-end;
}

.form_box {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, 31%);
  justify-content: flex-end;
  gap: 10px 20px;
  flex-wrap: wrap;

  .form_item_box {
    display: flex;
    align-items: center;

    & > div:nth-child(1) {
      min-width: 170px;
      text-align: right;
      flex-shrink: 0;
    }

    .el-row,
    .time_picker_date {
      flex: 1;
    }
  }
}

:deep .el-date-editor.el-input {
  width: 100%;
}

.logo_img {
  margin: 0 auto;
  height: 40px;
  width: 40px;
}
</style>
