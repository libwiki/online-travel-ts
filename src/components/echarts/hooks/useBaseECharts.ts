import {nextTick, onMounted, onUnmounted, reactive, ref} from "vue";
import * as echarts from "echarts"
import {ResizeObserver} from "@juggle/resize-observer";
import whiteTheme from "../theme/white.project.json"

export function useBaseECharts(el: HTMLElement, themeName = 'white') {
    echarts.registerTheme('white', whiteTheme);
    const resizeObserverRef = ref<ResizeObserver | null>()
    const chart = ref<echarts.ECharts | null>(echarts.init(el, themeName))
    const _chartOptions = reactive({});

    onMounted(() => {
        onRender();
    })
    onUnmounted(() => {
        onDispose();
    })

    function onDispose() {
        clearResizeObserver();
        if (chart.value) {
            chart.value.dispose();
            chart.value = null;
        }
    }

    function onRender() {
        if (chart.value) {
            chart.value.setOption(_chartOptions);
        } else {
            initCharts();
        }
    }

    function initCharts() {
        autoResize();
        chart.value = echarts.init(el, themeName);
        chart.value?.setOption(_chartOptions);

    }

    function autoResize() {
        const parentNode = el.parentNode;
        if (parentNode) {
            const resizeObserver = new ResizeObserver((entries, observer) => {
                if (chart.value) {
                    nextTick(() => {
                        chart.value?.resize();
                    })
                }
            });
            resizeObserver.observe(parentNode as Element); // Watch dimension changes on body
            resizeObserverRef.value = resizeObserver;
        }
    }

    function clearResizeObserver() {
        if (resizeObserverRef.value) {
            try {
                resizeObserverRef.value.disconnect()
            } catch (e) {

            }
            resizeObserverRef.value = null;
        }
    }

    return {
        chart,
        onRender,
        onDispose,
        autoResize,
        clearResizeObserver
    }
}
