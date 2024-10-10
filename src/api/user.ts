import { http } from "@/utils/http";

export type UserResult = {
  code: number;
  data: {
    account: string;
    createTime: string;
    headSculpture: string;
    id: string;
    token: string;
    userName: string;
  };
};

/** 登录 */
export const getLogin = (data: { account: string; password: string }) => {
  return http.request<UserResult>("post", "/spUser/logon", {
    data
  });
};
// 更改密码
export const updatePassword = (data: {
  account: string;
  password: string;
  oldPassword: string;
}) => {
  return http.request<UserResult>("post", "/spUser/updatePassword", {
    data
  });
};
