import Three3DMap from "/@/hooks/three3d/lib/Three3DMap";
import {onMounted, onUnmounted, ref} from "vue";

export function useThree3d(el: HTMLElement) {
    const map = new Three3DMap(el)
    const _autoReboot = ref<boolean>(true)
    onMounted(() => {
        if (_autoReboot.value) {
            map.onStart()
            map.onRenderByGeoJson()
            // setTimeout(() => {
            //     map.loadJson("https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json")
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
            map.onRenderByGeoJson()
        },
        onDispose() {
            _autoReboot.value = false
            map.onDispose()
        }
    }
}
