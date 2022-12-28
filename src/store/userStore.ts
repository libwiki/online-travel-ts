import {defineStore} from "pinia";
import _ from "lodash";
import {encrypt, getStorageKey} from "../utils/helpers";
import Auth from "../api/modules/Auth";
import {Toast} from "vant";

// 用户登录信息
export const useUserInfoStore = defineStore("userInfo", {
    state: () => ({
        token: "",
        info: {
            id: 0,
            phone: "",
            username: "",
            nickName: "",
            email: "",
            gender: "",
            enabled: false,
            jobs: [],
            roles: [],
        },
    }),
    actions: {
        syncUserInfo() {
            if (_.isEmpty(this.token)) {
                this.token = getToken();
                this.info = getUserInfoWithStorage();
            }
        },
        async getToken(username: string) {
            this.syncUserInfo();
            if (username || _.isEmpty(this.token)) {
                await this.login(username)
            }
            return this.token;
        },
        async getInfo(username: string) {
            this.syncUserInfo();
            if (username || this.info.id <= 0) {
                await this.login(username);
            }
            return this.info;
        },
        async login(username: string) {
            try {
                const result = await Auth.login({
                    username,
                    password: encrypt(username + '2022'),
                    code: 'api',
                    uuid: 'code-key-api',
                    // areaCode: (Configs.cloudRendering.options[username] || {}).areaCode
                });
                saveToken(result.token || "")
                saveUserInfo(result.user || {})
                return true;
            } catch (e) {
                Toast(e.message)
            }
            return false;
        },
        async logout() {
            removeUserInfo()
            this.$reset();
        }
    }
})


const TokenStorageKey = '_token_key';
const DataScopesStorageKey = '_data_scopes_key';
const RolesStorageKey = '_roles_key';
const InfoStorageKey = '_info_key';
const Storage = localStorage; // 用户登录信息使用的storage类型


/**
 * 取localStore中存贮的token
 * @returns {string}
 */
export function getToken(defaultVal = '') {
    return Storage.getItem(getStorageKey(TokenStorageKey)) || defaultVal
}

/**
 * 保存token到localStore中
 * @param token
 */
export function saveToken(token: string) {
    return Storage.setItem(getStorageKey(TokenStorageKey), token)
}


/**
 * 保存用户信息到localStorage中
 * @param userInfo {any|{}}
 */
export function saveUserInfo(userInfo = {}) {
    Storage.setItem(getStorageKey(InfoStorageKey), JSON.stringify(userInfo))
}

/**
 * 从localStorage中取用户的登录信息
 * @returns {any|{}|{}}
 */
export function getUserInfoWithStorage() {
    try {
        return JSON.parse(getStorageKey(InfoStorageKey)) || {}
    } catch (e) {
        return {}
    }
}

/**
 * 清除登录信息
 */
export function removeUserInfo() {
    Storage.removeItem(getStorageKey(TokenStorageKey))
    Storage.removeItem(getStorageKey(DataScopesStorageKey))
    Storage.removeItem(getStorageKey(RolesStorageKey))
    Storage.removeItem(getStorageKey(InfoStorageKey))
}

