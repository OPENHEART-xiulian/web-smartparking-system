<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus/es/components/form";
import {
  deleteMonthlyCar,
  monthlyCarPageList,
  MonthlyCarPageListType,
  newOrUpdatedMonthlyCar
} from "@/api";
import LicensePlateInput from "@/components/LicensePlateInput/index.vue";
import { ElMessage } from "element-plus";
import { computed } from "vue";

defineOptions({
  name: "VipCar"
});

let refList = ref<FormInstance[]>([]);

const dataList = ref<MonthlyCarPageListType[]>([]);
let backups: MonthlyCarPageListType[] = [];
const editIndex = ref(-1);
const rules = reactive<FormRules<any>>({
  mainlandLicensePlates: [
    { required: true, message: "请输入内地车牌号码", trigger: "blur" }
  ],
  startTime: [
    { required: true, message: "请选择免收费时间段", trigger: "blur" }
  ]
});
const params = reactive({
  pageNumber: 1,
  pageSize: 10,
  total: 0,
  totalNumber: 0
});
// 设置多个ref
const setItemRef = (el: any) => {
  if (el) {
    refList.value.push(el);
  }
};
//保存
const saveFn = (data: any) => {
  Promise.all(refList.value.map(v => v.validate()))
    .then(() => {
      return newOrUpdatedMonthlyCar(data.row);
    })
    .then(() => {
      editIndex.value = -1;
      getData();
      ElMessage.success(data.row.id ? "编辑成功" : "新增成功");
    });
};
//取消
const cancellation = () => {
  editIndex.value = -1;
  dataList.value = JSON.parse(JSON.stringify(backups));
};
//删除
const deleteFn = (id: string) => {
  ElMessageBox.confirm("此操作不可恢复，是否确认删除？", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      return deleteMonthlyCar({ ids: [id] });
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
  endTime: "",
  startTime: "",
  mainlandLicensePlates: ""
});
//获取数据
const getData = () => {
  const { pageSize, pageNumber } = params;
  monthlyCarPageList({
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
//新增
const addData = () => {
  if (editIndex.value == -1) {
    dataList.value.unshift({
      id: "",
      mainlandLicensePlates: "",
      otherLicensePlates: ""
    });
    editIndex.value = 0;
    tableRef.value.$refs.scrollBarRef.setScrollTop(0);
  } else {
    ElMessage.warning("编辑状态不可新增！");
  }
};
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
const tableHeight = computed(() => {
  let windowHeight =
    document.documentElement.clientHeight || document.body.clientHeight;
  return windowHeight - 340;
});
</script>
<template>
  <div class="bg-white dark:bg-[#141414] content">
    <div class="c_box">
      <div class="title">
        <div class="lf">VIP车辆</div>
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
            <div>创建时间段：</div>
            <div class="time_picker_date">
              <el-date-picker
                v-model="time"
                end-placeholder="结束时间"
                range-separator="To"
                start-placeholder="开始时间"
                type="datetimerange"
                value-format="YYYY-MM-DD HH:mm:ss"
                @change="(e: any) => changeFnTime(e, 'startTime', 'endTime')"
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
          :show-overflow-tooltip="editIndex < 0"
          align="center"
          label="内地车牌号码"
          min-width="260px"
        >
          <template #default="scope">
            <el-form
              v-if="scope.$index == editIndex"
              id="form_item_box"
              :ref="setItemRef"
              :model="scope.row"
              :rules="rules"
            >
              <el-form-item prop="mainlandLicensePlates">
                <LicensePlateInput v-model="scope.row.mainlandLicensePlates" />
              </el-form-item>
            </el-form>
            <template v-else class="text_box">
              {{ scope.row.mainlandLicensePlates }}
            </template>
          </template>
        </el-table-column>
        <el-table-column align="center" label="其他车牌号码" min-width="200px">
          <template #default="scope">
            <el-form
              v-if="scope.$index == editIndex"
              :ref="setItemRef"
              :model="scope.row"
              :rules="rules"
            >
              <el-form-item prop="otherLicensePlates">
                <el-input
                  v-model="scope.row.otherLicensePlates"
                  clearable
                  placeholder="多个车牌号码英文逗号分隔"
                />
              </el-form-item>
            </el-form>
            <template v-else class="text_box">
              {{ scope.row.otherLicensePlates || "--" }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="登记时间"
          prop="createTime"
          width="200"
        >
          <template #default="scope">
            {{ scope.row.createTime ?? "--" }}
          </template>
        </el-table-column>

        <el-table-column align="center" fixed="right" label="操作" width="200">
          <template #default="scope">
            <template v-if="scope.$index != editIndex">
              <el-button
                icon="Delete"
                size="small"
                type="danger"
                @click="deleteFn(scope.row.id)"
              >
                删除
              </el-button>
              <el-button
                icon="Edit"
                size="small"
                @click="editIndex = scope.$index"
              >
                编辑
              </el-button>
            </template>
            <div v-else style="margin-bottom: 20px">
              <el-button
                icon="FolderChecked"
                size="small"
                type="primary"
                @click="saveFn(scope)"
              >
                保存
              </el-button>
              <el-button icon="Close" size="small" @click="cancellation">
                取消
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination_box">
        <el-button icon="Plus" size="small" type="primary" @click="addData">
          新增
        </el-button>
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
    justify-content: space-between;
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
  display: grid;
  grid-template-columns: repeat(auto-fill, 31%);
  justify-content: flex-end;
  gap: 10px 20px;
  flex-wrap: wrap;

  .form_item_box {
    display: flex;
    align-items: center;

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
