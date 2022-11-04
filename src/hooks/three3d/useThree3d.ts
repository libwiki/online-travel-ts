import Three3DMap from "/@/hooks/three3d/lib/Three3DMap";
import {onMounted, onUnmounted, ref} from "vue";
import {IThree3DMapRenderGeoJsonOption} from "/@/hooks/three3d/lib/Interfaces";

export function useThree3d(el: HTMLElement) {
    const map = new Three3DMap(el)
    const _autoReboot = ref<boolean>(true)
    const option: IThree3DMapRenderGeoJsonOption = {
        areaGeoJsonUrl: "/geojson/dahua/geo.json",
        borderlineGeoJsonUrl: "https://geo.datav.aliyun.com/areas_v3/bound/451229.json"
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
