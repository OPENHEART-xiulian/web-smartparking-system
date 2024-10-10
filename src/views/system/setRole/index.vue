<script lang="ts" setup>
import { deleteUser, pageUserList, resettingPassword } from "@/api";
import md5 from "js-md5";
import UserUpdateCreate from "./UserUpdateCreate.vue";

export type TableType = {
  account: string;
  freeTime: number;
  frontBusinessLicense: string;
  headSculpture: string;
  id: string;
  phoneNumber: string;
  roleId: string;
  status: number;
  userName: string;
  unitAddress: string;
};
const isShow = ref(false);
const dataList = ref<TableType[]>([]);
const params = reactive({
  pageNumber: 1,
  pageSize: 10,
  total: 0,
  totalNumber: 0
});
const searchParams = reactive({
  userName: "",
  account: ""
});
const initData = {
  account: "",
  freeTime: 15,
  frontBusinessLicense: "",
  headSculpture: "",
  id: "",
  phoneNumber: "",
  unitAddress: "",
  roleId: "",
  status: 1,
  userName: ""
};
const data = ref<TableType>(initData);
// 打开编辑
const openFn = (e: any) => {
  data.value = e;
  isShow.value = true;
};

//删除
const resetting = (userId: string) => {
  ElMessageBox.confirm("此操作不可恢复，是否确认重置密码？", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      return resettingPassword({ ids: [userId], password: md5("123456") });
    })
    .then(() => {
      ElMessage.success("密码已重置成功，默认密码是123456");
      getData();
    });
};
//删除
const delteFn = (userId: string) => {
  ElMessageBox.confirm("此操作不可恢复，是否确认删除？", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      return deleteUser({ ids: [userId] });
    })
    .then(() => {
      ElMessage.success("删除成功");
      getData();
    });
};
//新增
const addData = () => {
  data.value = initData;
  isShow.value = true;
};
//获取数据
const getData = () => {
  const { pageSize, pageNumber } = params;
  pageUserList({
    pageSize,
    pageNumber,
    ...searchParams
  }).then((res: any) => {
    const { pageNumber, pageSize, total, totalNumber, list } = res.data;
    dataList.value = list;
    Object.assign(params, { pageNumber, pageSize, total, totalNumber });
  });
};
onBeforeMount(() => {
  getData();
});

const tableHeight = computed(() => {
  let windowHeight =
    document.documentElement.clientHeight || document.body.clientHeight;
  return windowHeight - 380;
});
const statusList = {
  1: "正常",
  2: "锁定",
  3: "禁用"
};
</script>

<template>
  <div class="bg-white dark:bg-[#141414] content">
    <div class="c_box">
      <div class="title">
        <div class="lf">账号管理</div>
      </div>
      <div class="form_box_p">
        <div class="form_box">
          <div class="form_item_box">
            <div>登录账号：</div>
            <el-input
              v-model="searchParams.account"
              clearable
              placeholder="请输入登录账号"
            />
          </div>
          <div class="form_item_box">
            <div>单位名称：</div>
            <el-input
              v-model="searchParams.userName"
              clearable
              placeholder="请输入单位名称"
            />
          </div>
        </div>
        <el-button type="primary" @click="getData">搜索</el-button>
      </div>

      <el-table :data="dataList" :height="tableHeight" style="width: 100%">
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
        <el-table-column align="center" label="免费停车时长（分钟）">
          <template #default="scope">
            <div class="text_box">
              {{ scope.row.freeTime ?? "--" }}
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
        <el-table-column align="center" label="创建时间">
          <template #default="scope">
            <div class="text_box">
              {{ scope.row.createTime ?? "--" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="265">
          <template #default="scope">
            <el-form-item prop="url">
              <el-button
                icon="Delete"
                size="small"
                type="danger"
                @click="delteFn(scope.row.id)"
              >
                删除
              </el-button>
              <el-button icon="Edit" size="small" @click="openFn(scope.row)">
                编辑
              </el-button>
              <el-button
                icon="Edit"
                size="small"
                @click="resetting(scope.row.id)"
              >
                重置密码
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
    <UserUpdateCreate v-model="isShow" :from-data="data" @update-fn="getData" />
  </div>
</template>

<style lang="scss" scoped>
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
    width: 33%;

    & > div:nth-child(1) {
      text-align: right;
      flex-shrink: 0;
      width: 190px;
    }

    .el-row,
    .time_picker_date {
      flex: 1;
    }
  }
}

.text_box {
  margin-bottom: 18px;
}
</style>
