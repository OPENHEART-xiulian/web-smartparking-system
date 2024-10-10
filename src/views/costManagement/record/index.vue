<script lang="ts" setup>
import type { FormInstance } from "element-plus/es/components/form";
import Edit from "./Edit.vue";
import {
  createOrUpdate,
  monthlyInsuranceDelete,
  monthlyInsurancePageList,
  MonthlyInsurancePageListType
} from "@/api";
import { ElMessage } from "element-plus";
import { computed } from "vue";
import { carTypeList, monthlyStatusList } from "@/views/data";

defineOptions({
  name: "ZombieCar"
});
const isShow = ref(false);

let refList = ref<FormInstance[]>([]);
const dataList = ref<MonthlyInsurancePageListType[]>([]);
let backups: MonthlyInsurancePageListType[] = [];
const editIndex = ref(-1);
const params = reactive({
  pageNumber: 1,
  pageSize: 10,
  total: 0,
  totalNumber: 0
});
//保存
const saveFn = (data: { row: MonthlyInsurancePageListType }) => {
  Promise.all(refList.value.map(v => v.validate()))
    .then(() => {
      return createOrUpdate(data.row);
    })
    .then(() => {
      editIndex.value = -1;
      getData();
      ElMessage.success(data.row.id ? "编辑成功" : "新增成功");
    });
};
//删除
const deleteFn = (id: string) => {
  ElMessageBox.confirm("此操作不可恢复，是否确认删除？", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      return monthlyInsuranceDelete({ ids: [id] });
    })
    .then(() => {
      ElMessage.success("删除成功");
      if (dataList.value.length == 1 && params.pageNumber > 1) {
        params.pageNumber = params.pageNumber - 1;
      }
      getData();
    });
};
const searchParams = reactive({
  carTypeCode: "",
  cardId: "",
  longTerm: null,
  mainlandLicensePlates: "",
  monthlyEndTime: "",
  monthlyFree: "",
  monthlyStartTime: "",
  monthlyStatus: "",
  parkingLotCode: "",
  paymentStatus: "",
  phoneNumber: "",
  userName: ""
});
const freeTimePeriod2 = computed<any>({
  get() {
    return [searchParams?.monthlyStartTime, searchParams?.monthlyEndTime];
  },
  set(value) {
    searchParams.monthlyStartTime = value?.[0] ?? "";
    searchParams.monthlyEndTime = value?.[1] ?? "";
  }
});
//获取数据
const getData = () => {
  const { pageSize, pageNumber } = params;
  monthlyInsurancePageList({
    pageSize,
    pageNumber,
    ...searchParams
  }).then((res: any) => {
    editIndex.value = -1;
    const { pageNumber, pageSize, total, totalNumber, list } = res.data;
    dataList.value = list;
    Object.assign(params, { pageNumber, pageSize, total, totalNumber });
    backups = JSON.parse(JSON.stringify(list));
  });
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
  return windowHeight - 464;
});
const initData = {
  carTypeCode: "",
  cardId: "",
  id: "",
  longTerm: 0,
  mainlandLicensePlates: "",
  monthlyEndTime: "",
  monthlyFree: 0,
  monthlyStartTime: "",
  parkingLotCode: "",
  phoneNumber: "",
  userName: ""
};
const data = ref<any>(initData);
const addData = () => {
  data.value = initData;
  isShow.value = true;
};
const openFn = (e: any) => {
  data.value = e;
  isShow.value = true;
};
</script>
<template>
  <div class="content bg-white dark:bg-[#141414]">
    <div class="c_box">
      <div class="title">
        <div class="lf">月保记录</div>
      </div>
      <div class="form_box_p">
        <div class="form_box form_box2">
          <div class="form_item_box">
            <div>车牌号码：</div>
            <el-input
              v-model="searchParams.mainlandLicensePlates"
              clearable
              placeholder="请输入车牌号码"
            />
          </div>
          <div class="form_item_box">
            <div>月保费用：</div>
            <el-input
              v-model="searchParams.monthlyFree"
              clearable
              placeholder="请输入月保费用"
            />
          </div>
          <div class="form_item_box">
            <div>车位编号：</div>
            <el-input
              v-model="searchParams.parkingLotCode"
              clearable
              placeholder="请输入车位编号"
            />
          </div>
          <div class="form_item_box">
            <div>姓名：</div>
            <el-input
              v-model="searchParams.userName"
              clearable
              placeholder="请输入姓名"
            />
          </div>
          <div class="form_item_box">
            <div>手机号码：</div>
            <el-input
              v-model="searchParams.phoneNumber"
              clearable
              placeholder="请输入手机号码"
            />
          </div>
          <div class="form_item_box">
            <div>身份证号：</div>
            <el-input
              v-model="searchParams.cardId"
              clearable
              placeholder="请输入身份证号"
            />
          </div>
          <div class="form_item_box">
            <div>车辆类型：</div>
            <el-select
              v-model="searchParams.carTypeCode"
              clearable
              placeholder="请选择车辆类型"
              style="width: 100%"
            >
              <el-option
                v-for="item in carTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="form_item_box">
            <div>状态：</div>
            <el-select
              v-model="searchParams.monthlyStatus"
              clearable
              placeholder="请选择状态"
              style="width: 100%"
            >
              <el-option
                v-for="item in monthlyStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="form_item_box">
            <div>月保时间段：</div>
            <div class="time_picker_date">
              <el-date-picker
                v-model="freeTimePeriod2"
                end-placeholder="结束时间"
                range-separator="To"
                start-placeholder="开始时间"
                type="datetimerange"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </div>
          </div>
        </div>
        <el-button type="primary" @click="getData">搜索</el-button>
      </div>
      <el-table
        ref="tableRef"
        :data="dataList"
        :height="tableHeight"
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
          :show-overflow-tooltip="editIndex < 0"
          align="center"
          label="车牌号码"
          min-width="100px"
        >
          <template #default="scope">
            {{ scope.row.mainlandLicensePlates ?? "--" }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="车辆类型"
          min-width="200px"
          prop="freePoints"
        >
          <template #default="scope">
            {{ scope.row.carTypeName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="月保时间段" min-width="250px">
          <template #default="scope">
            {{
              scope.row.longTerm == 1
                ? "长期"
                : `${scope.row.monthlyStartTime} / ${scope.row.monthlyEndTime}`
            }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="月保费用（元/月）"
          min-width="200"
          prop="monthlyFree"
        />
        <el-table-column
          :show-overflow-tooltip="editIndex < 0"
          align="center"
          label="状态"
          min-width="100px"
        >
          <template #default="scope">
            {{
              monthlyStatusList.find(v => v.value == scope.row.monthlyStatus)
                ?.label || "--"
            }}
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="editIndex < 0"
          align="center"
          label="车位编号"
          min-width="100px"
        >
          <template #default="scope">
            {{ scope.row.parkingLotCode || "--" }}
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="editIndex < 0"
          align="center"
          label="姓名"
          min-width="100px"
        >
          <template #default="scope">
            {{ scope.row.userName || "--" }}
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="editIndex < 0"
          align="center"
          label="手机号码"
          min-width="100px"
        >
          <template #default="scope">
            {{ scope.row.phoneNumber || "--" }}
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="editIndex < 0"
          align="center"
          label="身份证号码"
          min-width="100px"
        >
          <template #default="scope">
            {{ scope.row.cardId || "--" }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          min-width="200"
        >
          <template #default="scope">
            <el-button
              icon="Delete"
              size="small"
              type="danger"
              @click="deleteFn(scope.row.id)"
            >
              删除
            </el-button>
            <el-button icon="Edit" size="small" @click="openFn(scope.row)">
              编辑
            </el-button>
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
      <el-button
        icon="Plus"
        size="small"
        style="margin-top: 20px"
        type="primary"
        @click="addData"
      >
        新增
      </el-button>
    </div>
    <Edit v-model="isShow" :from-data="data" @update-fn="getData" />
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
  align-items: center;
}

.form_box {
  flex: 1;
  display: flex;
  gap: 20px;
  align-content: center;

  .form_item_box {
    display: flex;
    align-items: center;

    & > div:nth-child(1) {
      width: 130px;
      text-align: right;
      flex-shrink: 0;
    }

    .el-row,
    .time_picker_date {
      flex: 1;
    }
  }
}

.form_box2 {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, 31%);
  justify-content: flex-end;
  gap: 10px 20px;
  flex-wrap: wrap;
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
