import { http } from "@/utils/http";
import {PagesType, Result} from "../../types";


type SystemManagementResult = {
  code: number;
  data: {
    createTime?: string;
    deviceIp: string;
    deviceLocation: string;
    deviceName: string;
    devicePort: string;
    deviceRole: number;
    id: string;
    updateTime?: string;
  }[];
};

type CameraListResult = {
  code: number;
  data: {
    createTime: string;
    deviceIp: string;
    deviceLocation: string;
    deviceName: string;
    devicePort: string;
    deviceRole: number;
    groupId: number;
    id: string;
    isToll: number;
    updateTime: string;
  }[];
};

export type pageUserListType = {
  account: string;
  createTime: string;
  freeTime: number;
  headSculpture: string;
  id: string;
  password: string;
  roleId: string;
  roleName: string;
  token: string;
  userName: string;
};
// 查询闸机设备列表
export const systemManagement = (data: {
  deviceIp?: string;
  deviceLocation?: string;
  deviceName?: string;
  devicePort?: string;
  deviceRole?: number | string;
}) => {
  return http.request<SystemManagementResult>(
    "post",
    "/systemManagement/pageList",
    {
      data
    }
  );
};
// 新增或修改闸机设备
export const newOrUpdatedTurnstiles = (data: {
  deviceIp: string;
  deviceLocation: string;
  deviceName: string;
  devicePort: string;
  id: string;
  deviceRole: number;
}) => {
  return http.request<Result<object>>(
    "post",
    "/systemManagement/newOrUpdatedTurnstiles",
    {
      data
    }
  );
};
// 删除闸机设备
export const deleteTurnstiles = (data: { ids: string[] }) => {
  return http.request<Result<object>>(
    "post",
    "/systemManagement/deleteTurnstiles",
    {
      data
    }
  );
};
// 查询摄像头设备列表
export const getCameraList = (data: {
  deviceIp?: string;
  deviceLocation?: string;
  deviceName?: string;
  devicePort?: string;
  deviceRole?: number | string;
  groupId?: number | string;
  isToll?: number | string;
}) => {
  return http.request<CameraListResult>(
    "post",
    "/systemManagement/getCameraList",
    {
      data
    }
  );
};
// 新增或修改摄像头设备
export const newOrUpdatedCamera = (data: {
  deviceIp: string;
  deviceLocation: string;
  deviceName: string;
  devicePort: string;
  deviceRole: number;
  groupId: number;
  id: string;
  isToll: number;
}) => {
  return http.request<Result<object>>(
    "post",
    "/systemManagement/newOrUpdatedCamera",
    {
      data
    }
  );
};
// 删除闸机设备
export const deleteCamera = (data: { ids: string[] }) => {
  return http.request<Result<object>>(
    "post",
    "/systemManagement/deleteCamera",
    {
      data
    }
  );
};


// 新增或修改月租车收费规则
export const newOrUpdatedMonthly = (data: {
  groupingId: number;
  groupingName: string;
  id: string;
  tollCycle: number;
  tollStandard: string;
}) => {
  return http.request<Result<object>>(
    "post",
    "/systemManagement/newOrUpdatedMonthly",
    {
      data
    }
  );
};
// 用户-分页查询列表
export const pageUserList = (data: {
  userName?: string;
  account?: string;
  pageNumber: number;
  pageSize: number;
}) => {
  return http.request<Result<PagesType<pageUserListType>>>(
    "post",
    "/systemManagement/pageUserList",
    {
      data
    }
  );
};
// 角色-分页查询列表
export const pageRoleListUser = (data: {
  roleName?: string;
  pageNumber: number;
  pageSize: number;
}) => {
  return http.request<Result<PagesType<pageUserListType>>>(
    "post",
    "/systemManagement/pageRoleList",
    {
      data
    }
  );
};

// 用户-新增
export const userCreateOrUpdate = (data: {
  freeTime: number;
  frontBusinessLicense: string;
  headSculpture: string;
  id: string;
  phoneNumber: string;
  roleId: string;
  status: number;
  userName: string;
  unitAddress: string;
}) => {
  return http.request<Result<any>>(
    "post",
    "/systemManagement/userCreateOrUpdate",
    {
      data
    }
  );
};

// 用户-删除
export const deleteUser = (data: { ids: string[] }) => {
  return http.request<Result<any>>("post", "/systemManagement/deleteUser", {
    data
  });
};
// 用户-重置密码
export const resettingPassword = (data: {
  ids: string[];
  password: string;
}) => {
  return http.request<Result<any>>(
    "post",
    "/systemManagement/resettingPassword",
    {
      data
    }
  );
};
// 微信JSAPI支付配置-查询
export const getWeChatJsapiPay = () => {
  return http.request<Result<any>>(
    "post",
    "/systemManagement/getWeChatJsapiPay",
  );
};
// 微信JSAPI支付配置-新增或更新
export const weChatJsapiPayCreateOrUpdate = (data: {
  apiV3Key: string
  appId: string
  currency: string
  id: string
  macId: string
  macSerialNo: string
  privateKeyPath: string
  secret: string
}) => {
  return http.request<Result<any>>(
    "post",
    "/systemManagement/weChatJsapiPayCreateOrUpdate",
    {
      data
    }
  );
};
