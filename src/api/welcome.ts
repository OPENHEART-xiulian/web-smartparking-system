import { http } from "@/utils/http";
import { Result } from "../../types";

export const countOrder = (data: { userId: string; year: string }) => {
  return http.request<Result<any>>("post", "/homePageEndpoint/countOrder", {
    data
  });
};
export const getStatistics = (data: { userId: string }) => {
  return http.request<Result<any>>("post", "/homePageEndpoint/getStatistics", {
    data
  });
};
export const parkingSpaceStatistics = (data: { userId: string }) => {
  return http.request<Result<any>>(
    "post",
    "/homePageEndpoint/parkingSpaceStatistics",
    {
      data
    }
  );
};
