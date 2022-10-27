// 看板数据接口
import {Http} from "/@/api/http";

export default {
    // 获取集团资产数据
    asserts() {
        return Http.get('/assets/all')
    },

    // 获取城建数据 itfname空则返回全部
    construction(itfname = "") {
        return Http.get('/construction/all', {itfname})
    },

    // 获取文体数据 itfname空则返回全部
    culturesPorts(itfname = "") {
        return Http.get('/culturesports/all', {itfname})
    },
    // 获取全国数据(domestic) itfname空则返回全部
    domestic(itfname = "") {
        return Http.get('/domestic/all', {itfname})
    },
    // 获取金融数据(finance) itfname空则返回全部
    finance(itfname = "") {
        return Http.get('/finance/all', {itfname})
    },
    // 获取广西数据(guangxi) itfname空则返回全部
    guangxi(itfname = "") {
        return Http.get('/guangxi/all', {itfname})
    },
    // 获取旅发数据(gxtdg) itfname空则返回全部
    gxtdg(itfname = "") {
        return Http.get('/gxtdg/all', {itfname})
    },
    // 获取健康数据(health)
    health(itfname = "") {
        return Http.get('/health/all', {itfname})
    },

    // 获取全球数据(international) itfname空则返回全部
    international(itfname = "") {
        return Http.get('/international/all', {itfname})
    },

    // 获取科技数据(technology) itfname空则返回全部
    technology(itfname = "") {
        return Http.get('/technology/all', {itfname})
    },

    // 获取旅游数据(tourism) itfname空则返回全部
    tourism(itfname = "") {
        return Http.get('/tourism/all', {itfname})
    },
}
