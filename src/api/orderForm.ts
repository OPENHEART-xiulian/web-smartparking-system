import { http } from "@/utils/http";
import { PagesType, Result } from "../../types";

export type totalPageListType = {
  discount: string;
  endTime: string;
  id: string;
  mainlandLicensePlates: string;
  orderNumber: string;
  playTime: string;
  startTime: string;
  totalAmount: string;
  totalDiscountAmount: string;
  totalDuration: string;
  totalIncomeAmount: string;
  typeCode: string;
  typeName: string;
  userId: string;
  userName: string;
};

// 分页查询访客车登记管理列表
export const orderTotalPageList = (data: {
  discount?: string;
  endTime?: string;
  mainlandLicensePlates?: string;
  orderNumber?: string;
  pageNumber: number;
  pageSize: number;
  startTime?: string;
  totalAmount?: string;
  totalDiscountAmount?: string;
  totalDuration?: string;
  totalIncomeAmount?: string;
  typeCode?: string | number;
  typeName?: string;
  userName?: string;
}) => {
  return http.request<Result<PagesType<totalPageListType>>>(
    "post",
    "/orderEndpoint/pageList",
    {
      data
    }
  );
};
