import Three3DMap from "/@/hooks/three3d/lib/Three3DMap";

export function useThree3d(el: HTMLElement) {
    const map = new Three3DMap(el)
    return {
        map,
        onRender() {
            map.onStart()
        },
        loadJson() {
            map.loadJson()
            // setTimeout(() => {
            //     map.loadJson("https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json")
            // }, 2000)
        },

    }
}
