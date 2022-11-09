import {onMounted, onUnmounted, ref} from "vue";
import FreeDo from "/@/hooks/freeDo/FreeDo";

export function useFreeDo(elementId: string) {
    const free = new FreeDo(elementId)
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
            free.onStart()
        },
        onDispose() {
            free.onDispose()
        }
    }
}
