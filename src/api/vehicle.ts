import { http } from "@/utils/http";
import { PagesType, Result } from "../../types";

export type visitorVansPageListType = {
  createTime?: string;
  endTime: string;
  id: string;
  isFree?: number;
  mainlandLicensePlates: string;
  otherLicensePlates: string;
  startTime: string;
  updateTime?: string;
};
export type MonthlyCarPageListType = {
  createTime?: string;
  id: string;
  mainlandLicensePlates: string;
  otherLicensePlates: string;
  updateTime?: string;
};

export type InventoryPageList = {
  carGroupId: number;
  carGroupName: string;
  deviceGroupId: number;
  deviceGroupName: string;
  id: string;
  isToll: number;
  mainlandLicensePlates: string;
  otherLicensePlates: string;
  startCameraDeviceId: string;
  startTime: string;
};
export type OutboundPageList = {
  carGroupId: number;
  carGroupName: string;
  deviceGroupId: number;
  deviceGroupName: string;
  endCameraDeviceId: string;
  endTime: string;
  id: string;
  isToll: number;
  mainlandLicensePlates: string;
  otherLicensePlates: string;
  remark: string;
  totalMinutes: string;
  totalToll: string;
};
// 分页查询访客车登记管理列表
export const visitorVansPageList = (data: {
  mainlandLicensePlates?: string;
  otherLicensePlates?: string;
  pageNumber: number;
  pageSize: number;
  sort?: number;
  sortType?: number;
}) => {
  return http.request<Result<PagesType<visitorVansPageListType>>>(
    "post",
    "/vehicleManagement/visitorVansPageList",
    {
      data
    }
  );
};
// 分页查询vip月租车登记管理列表
export const monthlyCarPageList = (data: {
  mainlandLicensePlates?: string;
  otherLicensePlates?: string;
  pageNumber: number;
  pageSize: number;
  sort?: number;
  sortType?: number;
}) => {
  return http.request<Result<PagesType<MonthlyCarPageListType>>>(
    "post",
    "/vehicleManagement/monthlyCarPageList",
    {
      data
    }
  );
};
// 分页查询车辆入库记录列表
export const getInventoryPageList = (data: {
  mainlandLicensePlates?: string;
  otherLicensePlates?: string;
  pageNumber: number;
  pageSize: number;
}) => {
  return http.request<Result<PagesType<InventoryPageList>>>(
    "post",
    "/vehicleManagement/getInventoryPageList",
    {
      data
    }
  );
};
//分页查询车辆出库记录列表
export const getOutboundPageList = (data: {
  mainlandLicensePlates?: string;
  otherLicensePlates?: string;
  pageNumber: number;
  pageSize: number;
}) => {
  return http.request<Result<PagesType<OutboundPageList>>>(
    "post",
    "/vehicleManagement/getOutboundPageList",
    {
      data
    }
  );
};
// 新增或修改访客车登记管理
export const newOrUpdatedVisitorVans = (data: {
  endTime: string;
  id: string;
  mainlandLicensePlates: string;
  otherLicensePlates: string;
  startTime: string;
}) => {
  return http.request<Result<object>>(
    "post",
    "/vehicleManagement/newOrUpdatedVisitorVans",
    {
      data
    }
  );
};
// 新增或修改vip月租车登记管理
export const newOrUpdatedMonthlyCar = (data: {
  id: string;
  mainlandLicensePlates: string;
  otherLicensePlates: string;
}) => {
  return http.request<Result<object>>(
    "post",
    "/vehicleManagement/newOrUpdatedMonthlyCar",
    {
      data
    }
  );
};
// 删除访客车登记管理
export const deleteVisitorVans = (data: { ids: string[] }) => {
  return http.request<Result<object>>(
    "post",
    "/vehicleManagement/deleteVisitorVans",
    {
      data
    }
  );
};
// 删除访客车登记管理
export const deleteMonthlyCar = (data: { ids: string[] }) => {
  return http.request<Result<object>>(
    "post",
    "/vehicleManagement/deleteMonthlyCar",
    {
      data
    }
  );
};
//车位配置-查询
export const getParking = () => {
  return http.request<Result<any>>("post", "/systemManagement/getParking", {});
};
//车位配置-查询
export const updateParking = (data: {
  disposableNumber: number;
  id: string;
  parkingNumber: number;
}) => {
  return http.request<Result<any>>("post", "/systemManagement/updateParking", {
    data
  });
};

export interface ParkingDetailListType {
  assignedNumber: number;
  assignedStatus: string;
  endTime: string;
  id: string;
  startTime: string;
  userId: string;
  userName: string;
}

// 租赁车位-分页查询列表
export const pageParkingDetailList = (data: {
  assignedNumber?: number | string;
  assignedStatus?: number | string;
  endTime?: string;
  pageNumber: number;
  pageSize: number;
  startTime?: string;
  userName?: string;
}) => {
  return http.request<Result<PagesType<ParkingDetailListType>>>(
    "post",
    "/systemManagement/pageParkingDetailList",
    {
      data
    }
  );
};
// 租赁车位-新增或编辑
export const parkingDetailCreateOrUpdate = (data: {
  assignedNumber: number;
  endTime: string;
  id: string;
  startTime: string;
  userId: string;
}) => {
  return http.request<Result<ParkingDetailListType>>(
    "post",
    "/systemManagement/parkingDetailCreateOrUpdate",
    {
      data
    }
  );
};
// 租赁车位-删除
export const parkingDetailDelete = (data: { ids: string[] }) => {
  return http.request<Result<ParkingDetailListType>>(
    "post",
    "/systemManagement/parkingDetailDelete",
    {
      data
    }
  );
};
//租赁车位-统计
export const parkingDetailSum = () => {
  return http.request<Result<ParkingDetailListType>>(
    "post",
    "/systemManagement/parkingDetailSum"
  );
};
