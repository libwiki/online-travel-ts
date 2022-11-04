import Three3DMap from "/@/hooks/three3d/lib/Three3DMap";
import {onMounted, onUnmounted, ref} from "vue";
import {IThree3DMapRenderGeoJsonOption} from "/@/hooks/three3d/lib/Interfaces";

export function useThree3d(el: HTMLElement) {
    const map = new Three3DMap(el)
    const _autoReboot = ref<boolean>(true)
    // 1、本地乡镇数据来源：https://hxkj.vip/demo/echartsMap/ （与阿里云有所偏差）
    // 2、更高级别的远程省城数据来源：http://datav.aliyun.com/portal/school/atlas/area_selector  (阿里云实时更新更准确)
    const option: IThree3DMapRenderGeoJsonOption = {
        areaGeoJsonUrl: "/geojson/dahua/area.geo.json",
        borderlineGeoJsonUrl: "/geojson/dahua/border.geo.json",
        // borderlineGeoJsonUrl: "https://geo.datav.aliyun.com/areas_v3/bound/451229.json",
    }
    onMounted(() => {
        if (_autoReboot.value) {
            map.onStart()
            map.onRenderByGeoJson(option)
            // setTimeout(() => {
            //     map.onRenderByGeoJson({
            //         areaGeoJsonUrl:"https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json"
            //     })
            // }, 2000)
        }
    })
    onUnmounted(() => {
        map.onDispose()
    })
    return {
        map,
        onStart(autoReboot = true) {
            _autoReboot.value = autoReboot
            map.onStart()
            map.onRenderByGeoJson(option)
        },
        onDispose() {
            _autoReboot.value = false
            map.onDispose()
        }
    }
}
