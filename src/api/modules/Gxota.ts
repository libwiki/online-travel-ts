
import {Http} from "/@/api/http";

// 看板数据接口
export default {
    // 获取客源地比例数据
    tourist_from(day:string) {
        return Http.get('/api/gxota/v2/kanban/tourist_from', {day})
    },

}
