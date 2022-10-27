import {Http} from "../http";

export default {
    // 登录
    login(params: Partial<any>) {
        return Http.post('/auth/login_api', params)
    },
}
