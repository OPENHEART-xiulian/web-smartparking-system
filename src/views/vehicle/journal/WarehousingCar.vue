<script lang="ts" setup>
import { getInventoryPageList, InventoryPageList } from "@/api";
import { warehousingTableColumn } from "@/views/data";

defineOptions({
  name: "WarehousingCar"
});

const dataList = ref<InventoryPageList[]>([]);
const editIndex = ref(-1);
const params = reactive({
  pageNumber: 1,
  pageSize: 10,
  total: 0,
  totalNumber: 0
});
const searchParams = reactive({
  endTime: "",
  startTime1: "",
  mainlandLicensePlates: ""
});
//获取数据
const getData = () => {
  const { pageSize, pageNumber } = params;
  getInventoryPageList({
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

const time = ref("");
const changeFnTime = (e: any, start: string, end: string) => {
  console.log(time);
  if (e) {
    searchParams[start] = e[0];
    searchParams[end] = e[1];
  } else {
    searchParams[start] = "";
    searchParams[end] = "";
  }
};
</script>
<template>
  <div class="bg-white dark:bg-[#141414] content">
    <div class="c_box">
      <div class="title">
        <div class="lf">车辆入库记录</div>
      </div>
      <div class="form_box_p">
        <div class="form_box">
          <div class="form_item_box">
            <div>内地车牌号码：</div>
            <el-input
              v-model="searchParams.mainlandLicensePlates"
              clearable
              placeholder="请输入内地车牌号码"
            />
          </div>
          <div class="form_item_box">
            <div>进库时间段：</div>
            <div class="time_picker_date">
              <el-date-picker
                v-model="time"
                end-placeholder="结束时间"
                range-separator="To"
                start-placeholder="开始时间"
                type="datetimerange"
                value-format="YYYY-MM-DD HH:mm:ss"
                @change="(e: any) => changeFnTime(e, 'startTime1', 'endTime')"
              />
            </div>
          </div>
        </div>
        <el-button type="primary" @click="getData">搜索</el-button>
      </div>
      <el-table
        ref="tableRef"
        :data="dataList"
        :height="500"
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
          v-for="(item, index) in warehousingTableColumn"
          :key="index"
          :label="item.label"
          :min-width="item.width ?? 100"
          align="center"
        >
          <template #default="scope">
            {{
              item?.handleFn
                ? item.handleFn(scope.row[item.prop])
                : scope.row[item.prop] ?? "--"
            }}
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
  align-items: flex-start;
  font-size: 14px;
  gap: 20px;
  margin-bottom: 10px;
}

.form_box {
  flex: 1;
  display: flex;
  gap: 20px;

  .form_item_box {
    display: flex;
    align-items: center;
    width: 600px;

    & > div:nth-child(1) {
      width: 190px;
      text-align: right;
      flex-shrink: 0;
    }

    .el-row,
    .time_picker_date {
      flex: 1;
    }
  }
}

:deep .el-range-editor.el-input__wrapper {
  width: 100%;
}

.logo_img {
  margin: 0 auto;
  height: 40px;
  width: 40px;
}
</style>
