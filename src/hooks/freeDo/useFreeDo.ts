import FreeDo from "/@/hooks/freeDo/FreeDo";
import {Markers} from "/@/hooks/freeDo/lib/components/Markers";
import Configs from "/@/configs/Configs";

export function useFreeDo(elementId: string) {
    const freeDo = new FreeDo(elementId, Configs.cloudRendering.DTS_HOST, Configs.cloudRendering.options[0])
    const markerComponent = new Markers(freeDo)
    freeDo.components.push(markerComponent)

    return {
        freeDo,
        markerComponent,
        onStart() {
            freeDo.onStart()
        },
        onDispose() {
            freeDo.onDispose()
        }
    }
}
