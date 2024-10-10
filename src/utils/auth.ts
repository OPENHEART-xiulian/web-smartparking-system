import Cookies from "js-cookie";
import { storageLocal } from "@pureadmin/utils";
import { useUserStoreHook } from "@/store/modules/user";

export interface DataInfo<T> {
  account: string;
  createTime: string;
  freeTime: number;
  frontBusinessLicense: string;
  headSculpture: string;
  id: string;
  oppositeBusinessLicense: string;
  password: string;
  phoneNumber: string;
  roleId: string;
  roleName: string;
  status: number;
  token: string;
  unitAddress: string;
  userName: string;
}

export const userKey = "user-info";
export const TokenKey = "authorized-token";
/**
 * 通过`multiple-tabs`是否在`cookie`中，判断用户是否已经登录系统，
 * 从而支持多标签页打开已经登录的系统后无需再登录。
 * 浏览器完全关闭后`multiple-tabs`将自动从`cookie`中销毁，
 * 再次打开浏览器需要重新登录系统
 * */
export const multipleTabsKey = "multiple-tabs";

/** 获取`token` */
export function getToken(): DataInfo<number> {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  return Cookies.get(TokenKey)
    ? JSON.parse(Cookies.get(TokenKey))
    : storageLocal().getItem(userKey);
}

/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`、`refreshToken`这三条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将`avatar`、`username`、`nickname`、`roles`、`refreshToken`、`expires`这六条信息放在key值为`user-info`的localStorage里（利用`multipleTabsKey`当浏览器完全关闭后自动销毁）
 */
export function setToken(data: DataInfo<Date>) {
  function setUserKey({ avatar, username, nickname, roleId }: any) {
    useUserStoreHook().SET_AVATAR(avatar);
    useUserStoreHook().SET_USERNAME(username);
    useUserStoreHook().SET_NICKNAME(nickname);
    useUserStoreHook().SET_ROLES(roleId);
    storageLocal().setItem(userKey, {
      avatar,
      username,
      nickname,
      roleId
    });
  }

  if (data.userName && data.roleId) {
    const { userName, roleId } = data;
    setUserKey({
      avatar: data?.headSculpture ?? "",
      userName,
      nickname: data?.userName ?? "",
      roleId
    });
  } else {
    const avatar =
      storageLocal().getItem<DataInfo<number>>(userKey)?.headSculpture ?? "";
    const username =
      storageLocal().getItem<DataInfo<number>>(userKey)?.userName ?? "";
    const nickname =
      storageLocal().getItem<DataInfo<number>>(userKey)?.userName ?? "";
    const roles =
      [storageLocal().getItem<DataInfo<number>>(userKey)?.roleId] ;
    setUserKey({
      avatar,
      username,
      nickname,
      roles
    });
  }
}

/** 删除`token`以及key值为`user-info`的localStorage信息 */
export function removeToken() {
  Cookies.remove(TokenKey);
  Cookies.remove(multipleTabsKey);
  storageLocal().removeItem(userKey);
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return "Bearer " + token;
};
