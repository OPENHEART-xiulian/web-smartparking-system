import {PagesType, Result} from "../../types";
import {http} from "@/utils/http";
// 收费规则-查询
export const getChargeRules = () => {
  return http.request<Result<any>>("post", "/systemManagement/getChargeRules");
};
// 收费规则-更新
export const updateChargeRules = (data: {
  freeDuration: number;
  id: string;
  monthlyEnterpriseCar: string;
  monthlyExternalCarMachinery: string;
  monthlyInternalCar: string;
  monthlyInternalCarNoMachinery: string;
  tollStandard: string;
}) => {
  return http.request<Result<any>>(
    "post",
    "/systemManagement/updateChargeRules",
    {
      data
    }
  );
};
// 缴费记录-缴费金额计算
export const countMoney = (data: {
  carTypeCode: string;
  longTerm: number;
  monthlyEndTime: string;
  monthlyFree: string | number;
  monthlyStartTime: string;
}) => {
  return http.request<Result<any>>("post", "/monthlyInsurance/countMoney", {
    data,
    headers: { isEnableLoading: false }
  });
};
// 缴费记录-新增或更新
export const createOrUpdate = (data: {
  carTypeCode: string;
  cardId?: string;
  id?: string;
  longTerm?: number;
  mainlandLicensePlates: string;
  monthlyEndTime: string;
  monthlyFree: number;
  monthlyStartTime: string;
  parkingLotCode?: string;
  phoneNumber?: string;
  userName?: string;
}) => {
  return http.request<Result<any>>("post", "/monthlyInsurance/createOrUpdate", {
    data
  });
};
//缴费记录-删除
export const monthlyInsuranceDelete = (data: { ids: string[] }) => {
  return http.request<Result<any>>("post", "/monthlyInsurance/delete", {
    data
  });
};

export interface MonthlyInsurancePageListType {
  accumulatePaymentAmount: string;
  carTypeCode: string;
  carTypeName: string;
  cardId: string;
  expirationDate: string;
  id: string;
  longTerm: number;
  mainlandLicensePlates: string;
  monthlyEndTime: string;
  monthlyFree: number;
  monthlyStartTime: string;
  monthlyStatus: string;
  parkingLotCode: string;
  paymentAmount: string;
  paymentStatus: number;
  phoneNumber: string;
  userName: string;
}

// 缴费记录-分页查询列表
export const monthlyInsurancePageList = (data: {
  carTypeCode: string;
  cardId: string;
  longTerm: number;
  mainlandLicensePlates: string;
  monthlyEndTime: string;
  monthlyFree: string;
  monthlyStartTime: string;
  monthlyStatus: string;
  pageNumber: number;
  pageSize: number;
  parkingLotCode: string;
  paymentStatus: string;
  phoneNumber: string;
  userName: string;
}) => {
  return http.request<Result<PagesType<MonthlyInsurancePageListType>>>(
    "post",
    "/monthlyInsurance/pageList",
    {
      data
    }
  );
};

export interface merchantReconciliationPageListType {
  assignedNumber: number;
  id: string;
  monthNumber: string;
  status: string;
  totalAmount: string;
  totalDiscountAmount: string;
  totalDuration: string;
  totalIncomeAmount: string;
  userId: string;
  userName: string;
  yearNumber: string;
}

// 对账记录-分页查询列表
export const merchantReconciliationPageList = (data: {
  pageNumber: number;
  pageSize: number;
  status?: string;
  userName?: string;
  yearNumber?: string;
}) => {
  return http.request<Result<PagesType<merchantReconciliationPageListType>>>(
    "post",
    "/merchantReconciliation/pageList",
    {
      data
    }
  );
};

// 对账记录-确认发放
export const merchantReconciliationUpdateStatus = (data: { id: string }) => {
  return http.request<Result<any>>(
    "post",
    "/merchantReconciliation/updateStatus",
    {
      data
    }
  );
};
