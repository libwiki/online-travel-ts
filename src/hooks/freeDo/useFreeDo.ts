import {FreeDo} from "/@/hooks/freeDo/FreeDo";
import {Markers} from "/@/hooks/freeDo/lib/components/Markers";
import Configs from "/@/configs/Configs";

export function useFreeDo(elementId: string, sceneName: string) {

    const cloudRenderingOption = Configs.freeDoCloudRendering
    const sceneOption = cloudRenderingOption.options.find(v => v.name === sceneName)
    if (!sceneOption) {
        throw new Error('场景配置不存在')
    }
    const freeDo = new FreeDo(cloudRenderingOption.host, sceneOption, elementId)
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
