<script lang="ts" setup>
import { TableType } from "@/views/system/setRole/index.vue";
import { pageUserList } from "@/api";

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: "update:modelValue", isShow: boolean): void;

  (e: "handleCurrentChange", val: any): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const dataList = ref<TableType[]>([]);
const params = reactive({
  pageNumber: 1,
  pageSize: 10,
  total: 0,
  totalNumber: 0
});
const statusList = {
  1: "正常",
  2: "锁定",
  3: "禁用"
};
const getData = () => {
  const { pageSize, pageNumber } = params;
  pageUserList({
    pageSize,
    pageNumber
  }).then((res: any) => {
    const { pageNumber, pageSize, total, totalNumber, list } = res.data;
    dataList.value = list;
    Object.assign(params, { pageNumber, pageSize, total, totalNumber });
  });
};
onBeforeMount(() => {
  getData();
});
const handleCurrentChange = (val: TableType | undefined) => {
  emits("handleCurrentChange", val);
  emits("update:modelValue", false);
};
</script>

<template>
  <el-dialog
    :destroy-on-close="true"
    :modelValue="modelValue"
    title="选择商家"
    width="1000px"
    @update:modelValue="$emit('update:modelValue', false)"
  >
    <el-table
      :data="dataList"
      :height="500"
      highlight-current-row
      style="width: 100%"
      @current-change="handleCurrentChange"
    >
      <el-table-column type="index" />

      <el-table-column align="center" label="账号">
        <template #default="scope">
          <div class="text_box">{{ scope.row.account ?? "--" }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单位名称">
        <template #default="scope">
          <div class="text_box">{{ scope.row.userName ?? "--" }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色">
        <template #default="scope">
          <div class="text_box">
            {{ scope.row.roleName ?? "--" }}
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="联系电话">
        <template #default="scope">
          <div class="text_box">
            {{ scope.row.phoneNumber ?? "--" }}
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template #default="scope">
          <div class="text_box">
            {{ statusList[scope.row.status] ?? "--" }}
          </div>
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
  </el-dialog>
</template>

<style lang="scss" scoped>
.pagination_box {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
