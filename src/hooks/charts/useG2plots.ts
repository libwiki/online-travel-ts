import {isReactive, isRef, onMounted, onUnmounted, ref, toRaw, watch} from "vue";
import _ from "lodash";

export function useG2plots(factoryFunc: Function, options: any) {
    const chart = ref()
    const container = ref<HTMLElement>();
    onMounted(() => {
        initChart(); // 初始化图表实例
    })
    onUnmounted(() => {
        releaseChart(); // 销毁图表实例
    })
    watch(options, () => {
        initChart(); // 初始化图表实例或者更新数据
    })

    function initChart() {
        if (container.value) {
            if (chart.value) {
                update();
            } else {
                chart.value = factoryFunc(container.value, options.value);
                if (chart.value) {
                    chart.value.render();
                }
            }
        }

    }


    function update(data?: any) {
        if (!chart.value) {
            return
        }
        if (_.isArray(data)) {
            options.value.data = data;
        } else if (isRef(data) && _.isArray(data.value)) {
            options.value.data = data.value;
        } else if (isReactive(data)) {
            const v = toRaw(data)
            if (_.isArray(v)) {
                options.value.data = v;
            }
        }
        chart.value.update(options.value);
    }

    function releaseChart() {
        if (chart.value) {
            if (!chart.value.isDisposed) {
                chart.value.destroy();
            }
            chart.value = undefined;
        }
    }

    return {
        chart,
        container,
        initChart,
        releaseChart,
        update,
    }
}

const DefaultMergeConfigs = {
    wordsSize: 12, // 一个字体的单位大小
    reversed: false, // 是否进行倒序
}

export function mergeG2plotsComponentProps(defaultProps: any, props: any, configs: any = {}) {
    console.log(props)
    configs = _.merge(DefaultMergeConfigs, configs)
    const DefaultKey = {
        x: 'value',
        y: 'label',
        series: 'label',
    }
    const maxValueHandle = (data: any[], key: string) => {
        const maxValue = _.maxBy(data, key)[key];
        // 最大数量 + 30%的最大数量 （这是最好看的）
        return maxValue + maxValue * 0.3;
    }
    const oKey = props.key || DefaultKey;

    // 开始合并
    const options = _.merge(
        _.cloneDeep(defaultProps),
        {
            data: props.data,
            xField: oKey.x,
            yField: oKey.y,
            seriesField: oKey.series,
            colorField: oKey.series,
        },
        props.options,
    )
    // 坐标轴隐藏
    if (props.hideXAxis) {
        options.xAxis = false;
    }
    if (props.hideYAxis) {
        options.yAxis = false;
    }
    if (props.xAxisLabelAlign) {
        _.set(options, 'xAxis.label.style.textAlign', props.xAxisLabelAlign)
    }
    // 标签左对齐的时候需要处理标签的偏移量，否则label将被遮挡（每个字默认占用12单位宽度）
    if (_.get(options, 'xAxis.label.style.textAlign') === 'left') {
        _.set(options, 'xAxis.label.offset', (configs.wordsSize || 0) * (props.maxLabelWords || 0))
    }
    if (props.yAxisLabelAlign) {
        _.set(options, 'yAxis.label.style.textAlign', props.yAxisLabelAlign)
    }
    // 标签左对齐的时候需要处理标签的偏移量，否则label将被遮挡（每个字默认占用12单位宽度）
    if (_.get(options, 'yAxis.label.style.textAlign') === 'left') {
        _.set(options, 'yAxis.label.offset', (configs.wordsSize || 0) * (props.maxLabelWords || 0))
    }
    if (props.hideXAxisLabel) { // 隐藏x轴的标签
        _.set(options, 'xAxis.label', false)
    }
    if (props.hideYAxisLabel) { // 隐藏y轴的标签
        _.set(options, 'yAxis.label', false)
    }
    if (props.hideLabel) { // 隐藏label
        options.label = false;
    }
    if (props.hideTooltip) { // 隐藏tooltip
        options.tooltip = false;
    }

    // 最大值
    if (_.isNumber(props.maxX)) {
        _.set(options, 'xAxis.max', props.maxX)
    }
    if (_.isFunction(props.maxX)) {
        if (props.data.length > 0) {
            _.set(options, 'xAxis.max', props.maxX(props.data, oKey.x))
        }
    }
    if (_.isNumber(props.maxY)) {
        _.set(options, 'yAxis.max', props.maxY)
    }
    if (_.isFunction(props.maxY)) {
        if (props.data.length > 0) {
            _.set(options, 'yAxis.max', props.maxY(props.data, oKey.y))
        }
    }
    if (configs.reversed) {
        options.data = options.data.reverse();

    }
    return options;
}
