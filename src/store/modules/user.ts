import { defineStore } from "pinia";
import {
  resetRouter,
  router,
  routerArrays,
  storageLocal,
  store,
  type userType
} from "../utils";
import { getLogin, type UserResult } from "@/api/user";
import { useMultiTagsStoreHook } from "./multiTags";
import { type DataInfo, removeToken, setToken, userKey } from "@/utils/auth";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 头像
    avatar:
      storageLocal().getItem<DataInfo<number>>(userKey)?.headSculpture ?? "",
    // 用户名
    username: storageLocal().getItem<DataInfo<number>>(userKey)?.userName ?? "",
    // 昵称
    nickname: storageLocal().getItem<DataInfo<number>>(userKey)?.userName ?? "",
    // 页面级别权限
    roles: [storageLocal().getItem<DataInfo<number>>(userKey)?.roleId],
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7,
    //是否是管理员
    isAdmin: false,
    userInfo: null
  }),
  actions: {
    /** 存储头像 */
    SET_TOKEN(token: string) {
      this.token = token;
    } /** 存储头像 */,
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储昵称 */
    SET_NICKNAME(nickname: string) {
      this.nickname = nickname;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 登入 */
    async loginByUsername(data: any) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(data)
          .then((data: any) => {
            if (data?.code == 200) {
              setToken(data.data);
              this.userInfo = data.data;
              this.isAdmin = data.data.roleId == 3 || data.data.roleId == 4;
            }
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.userInfo = null;
      this.roles = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      return router.push("/login");
    }
  },
  persist: true
});

export function useUserStoreHook() {
  return useUserStore(store);
}
