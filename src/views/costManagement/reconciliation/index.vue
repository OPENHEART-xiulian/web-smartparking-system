<script lang="ts" setup>
import {
  merchantReconciliationPageList,
  merchantReconciliationPageListType,
  merchantReconciliationUpdateStatus
} from "@/api";
import { computed } from "vue";
import { useRouter } from "vue-router";

defineOptions({
  name: "MonthlyRent"
});
const router = useRouter();
const dataList = ref<merchantReconciliationPageListType[]>([]);
const editIndex = ref(-1);
const params = reactive({
  pageNumber: 1,
  pageSize: 10,
  total: 0,
  totalNumber: 0
});
const searchParams = reactive({
  status: "",
  userName: "",
  yearNumber: ""
});
//获取数据
const getData = () => {
  const { pageSize, pageNumber } = params;
  merchantReconciliationPageList({
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
  return windowHeight - 340;
});
const grant = (id: string) => {
  ElMessageBox.confirm("请先财务打款后，再点击确定发放按钮！", "确定发放？", {
    confirmButtonText: "确定发放",
    cancelButtonText: "取消发放",
    type: "warning"
  })
    .then(() => {
      return merchantReconciliationUpdateStatus({ id });
    })
    .then(() => {
      ElMessage.success("发放成功");
      getData();
    });
};
</script>
<template>
  <div class="bg-white dark:bg-[#141414] content">
    <div class="c_box">
      <div class="title">
        <div class="lf">出库订单流水</div>
      </div>
      <div class="form_box_p">
        <div class="form_box">
          <div></div>
          <div></div>
          <div class="form_item_box">
            <div>账单月份：</div>
            <div class="time_picker_date">
              <el-date-picker
                v-model="searchParams.yearNumber"
                placeholder="请选择账单月份"
                type="month"
                value-format="YYYY-MM"
                @change="getData"
              />
            </div>
          </div>
        </div>
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
        <el-table-column align="center" label="商家">
          <template #default="scope">
            {{ scope.row.userName ?? "--" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="租赁车位">
          <template #default="scope">
            {{ scope.row.assignedNumber ?? "--" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="总停车时长（小时）">
          <template #default="scope">
            {{ scope.row.totalDuration ?? "--" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="总计金额（元）">
          <template #default="scope">
            {{ scope.row.totalAmount ?? "--" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="总计优惠金额（元）">
          <template #default="scope">
            {{ scope.row.totalDiscountAmount ?? "--" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="总收入金额（元）">
          <template #default="scope">
            {{ scope.row.totalIncomeAmount ?? "--" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单时间">
          <template #default="scope">
            {{ scope.row.yearNumber ?? "--" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="发放状态">
          <template #default="scope">
            {{ scope.row.status ?? "--" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="220">
          <template #default="scope">
            <el-form-item prop="url">
              <el-button
                icon="View"
                size="small"
                @click="
                  () =>
                    router.push(
                      `/orderForm/outboundOrder?userId=${scope.row.userId}`
                    )
                "
              >
                查看流水
              </el-button>
              <el-button
                v-if="scope.row.status == '未发放'"
                icon="Check"
                size="small"
                type="primary"
                @click="grant(scope.row.id)"
              >
                确定发放
              </el-button>
            </el-form-item>
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
