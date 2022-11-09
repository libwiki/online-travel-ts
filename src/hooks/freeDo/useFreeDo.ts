import {onMounted, onUnmounted, ref} from "vue";
import FreeDo from "/@/hooks/freeDo/FreeDo";
import Markers from "/@/hooks/freeDo/lib/components/Markers";
import Configs from "/@/configs/Configs";

export function useFreeDo(elementId: string) {
    const free = new FreeDo(elementId, Configs.cloudRendering.DTS_HOST, Configs.cloudRendering.options[0])
    free.components.push(new Markers(free))
    const _autoReboot = ref<boolean>(true)

    onMounted(() => {
        // free.onStart()
    })
    onUnmounted(() => {
        free.onDispose()
    })
    return {
        free,
        onStart(autoReboot = true) {
            _autoReboot.value = autoReboot
            console.log(Configs)
            free.onStart()
        },
        onDispose() {
            free.onDispose()
        }
    }
}
