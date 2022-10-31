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
        },
    }
}
