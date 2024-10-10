import {http} from "@/utils/http";
import {Result} from "../../types";
// 统计剩余抵用券
export const assignedNumber = (data: { userId: string }) => {
  return http.request<Result<any>>(
    "post",
    "/merchantReconciliation/assignedNumber",
    {
      data
    }
  );
};
// 停车领劵
export const createParkCollect = (data: { userId: string; plates: string }) => {
  return http.request<Result<any>>(
    "post",
    "/merchantReconciliation/createParkCollect",
    {
      data
    }
  );
};
// 停车领劵
export const generateQRCode = (params: { userId: string; url: string }) => {
  return http.request<Result<any>>(
    "get",
    "/merchantReconciliation/generateQRCode",
    {
      params
    }
  );
};
