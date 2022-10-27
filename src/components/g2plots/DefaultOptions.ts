export default {
    legend: false, // 关闭图例
    autoFit: true, // 自动缩放
    interactions: [{type: 'element-active'}],
    tooltip: {
        showTitle: false,
        formatter: (datum: any) => {
            return {name: datum.label, value: datum.value};
        },
        showNil: false,
    }
}
