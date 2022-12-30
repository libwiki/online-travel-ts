import Configs from "/@/configs/Configs";
import {onUnmounted} from "vue";
import {Cloud51} from "/@/hooks/cloud51/Cloud51";

export function useCloud51(elementId: string, sceneName: string) {
    const cloudRenderingOption = Configs.cloud51Rendering
    const sceneOption = cloudRenderingOption.options.find(v => v.name === sceneName)
    if (!sceneOption) {
        throw new Error('场景配置不存在')
    }
    const cloud51 = new Cloud51(cloudRenderingOption.host, sceneOption, elementId)
    // const markerComponent = new Markers(cloud51, 'Markers', true)
    // cloud51.components.push(markerComponent)

    onUnmounted(() => {
        cloud51.onDispose()
    })
    return {
        cloud51,
        // markerComponent,
        onStart() {
            cloud51.onStart()
        },
        onDispose() {
            cloud51.onDispose()
        }
    }
}
