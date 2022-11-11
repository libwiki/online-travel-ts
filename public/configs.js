/**
 * window._configs
 * 0、该文件可以没有，但是不能改名、并且应该永远位于项目域名根目录下
 * 1、是为了方便外部注入到项目中的配置项目
 * 2、使用此种方式是为了在项目中可以方便的同步使用配置项
 * 3、index.html 中第一个引入的 js脚本 即是该文件（故此该文件不可改名、不可更远位置->应该永远位于项目域名根目录下）
 * 4、window._configs在源码中具体使用到的位置位于src/config/Config.js中
 * 5、window._configs中的配置会覆盖源码中的配置项
 * 6、需要定制化设置可去掉下列注释后填写新的数值即可（刷新页面会重新加载）
 */
const eChartsAnimationDurationUpdate = 3000;
window._configs = {
    // isDev: false, // 是否开发环境
    // debug: false, // 是否开启debug
    // baseUrl: "/", // 请求的服务器api接口基础url
    // jsonBaseUrl: '/', // 请求的服务器json文件的接口基础url （实现多接口）
    // version: '1.0.0', // 当前版本号（暂未有实际用处）
    // siteName: '集团大屏', // 当前网站名称
    // eChartsAnimationDurationUpdate, // eCharts数据更新频率
    // updateDataTimeWheelInterval: eChartsAnimationDurationUpdate * 3, // 时间轮间隔（数据更新的大定时器），应该是eCharts数据更新频率的整倍数，并且不能过小(>1000)（因为每一次时间轮都有可能请求后台数据）

    freeDoCloudRendering: {
        host: '192.168.58.1:8080', // 飞渡链连接地址
        defaultScene: "dahua", // 默认显示的场景名称
        options: [
            {
                name: "liangqing",
                title: '南宁市良庆区',
                // 区域编码
                areaCode: 450108,
                // 飞渡看板id
                kanBanId: 21,
                // 飞渡工程实例id
                iid: '2482846585653',
                // 飞渡工程id
                dtsPid: 17,
                // 起始相机视角 地图起始坐标 x y z distance pitch yaw flyTime
                point: [541650.624375, 2523032.509219, 5803.175625, 1000, -24.152853, 114.310532, 1],
                // 标签聚焦时视角高度
                poiDistance: 1000,
                // 默认的标记点
                markers: [
                    {
                        pid: '4118683743825804236',
                        name: '大王滩风景区',
                        point: [532232.18, 2498557.20, 828.63],
                        iconSize: [154, 150],
                        lookAtPoint: [530288.532188, 2500642.998438, 2211.708906, 0, -30.682356, 29.244013, 1],
                        sort: 93
                    },
                    {
                        pid: "4118687944674322762",
                        name: '广西体育中心',
                        point: [542832.22, 2515215.57, 1000.79],
                        iconSize: [154, 150],
                        lookAtPoint: [543696.665195, 2514367.077578, 1369.705938, 0, -8.537538, -149.263092, 1],
                        sort: 96
                    },
                    {
                        pid: '4118687889162312478',
                        name: '南宁五象湖公园',
                        point: [539262.47, 2514331.68, 1628.71],
                        iconSize: [172, 150],
                        lookAtPoint: [540750.202187, 2515494.217188, 1231.852578, 0, 0.335123, 126.2808761, 1],
                        sort: 94
                    },
                    {
                        pid: "4118687519721654256",
                        name: '广西美术馆',
                        point: [536388.29, 2515887.78, 1272.78],
                        iconSize: [144, 150],
                        lookAtPoint: [537322.029375, 2514911.876562, 1648.807344, 0, -29.879782, -148.900604, 1],
                        sort: 95
                    },
                    {
                        pid: "4118687905757512752",
                        name: '广西规划馆',
                        point: [538448.07, 2517196.11, 1096.89],
                        iconSize: [144, 150],
                        lookAtPoint: [538495.549687, 2516062.77, 1372.498125, 0, -16.455811, -85.82132, 1],
                        sort: 98
                    },
                    {
                        pid: '4118688661482543085',
                        name: '广西文化艺术中心',
                        point: [535059.66, 2518360.06, 1038.16],
                        iconSize: [186, 150],
                        lookAtPoint: [534873.505625, 2519469.676992, 1358.54875, 0, -15.783617, 80.115891, 1],
                        sort: 97
                    },
                    {
                        pid: "4118688670417746828",
                        name: '南宁博物馆',
                        point: [540135.02, 2517730.53, 1091.95],
                        iconSize: [144, 150],
                        lookAtPoint: [540622.159219, 2519150.784687, 1275.831563, 0, -10.356997, 95.192917, 1],
                        sort: 99
                    },
                    {
                        pid: "4118688644262879221",
                        name: '绿地缤纷天地特色街区',
                        point: [537869.71, 2519241.23, 949.43],
                        iconSize: [216, 150],
                        lookAtPoint: [536784.2675, 2519656.219688, 1608.469063, 0, -16.520048, 23.323057, 1],
                        sort: 100
                    }
                ]
            },
            {
                name: "dahua",
                title: '大化',
                areaCode: 451229,
                kanBanId: 19,
                iid: '2482846585653',
                dtsPid: 18,
                // 起始相机视角 地图起始坐标 x y z distance pitch yaw flyTime
                point: [-252406.46, 2470639.54, 212325.74, 70000, -45.0084, -64.101761, 1],
                // 标签聚焦时视角高度
                poiDistance: 70000,
                markers: [
                    {
                        pid: '4118678345302674151',
                        name: '大化奇美水城景区',
                        point: [107.98238968421559, 23.733665301785607],
                        iconSize: [154, 150],
                    },
                    {
                        pid: '4118860138543036204',
                        name: '广西大化七百弄地质博物馆',
                        point: [107.64231403943, 24.071377126953],
                        iconSize: [154, 150],
                    },
                    {
                        pid: '4118862509186354469',
                        name: '大化瑶族自治县弄腾乡村旅游区',
                        point: [107.691286123366, 24.085870417806],
                        iconSize: [154, 150],
                    },
                    {
                        pid: '4118678337219568730',
                        name: '大化瑶族自治县民族博物馆',
                        point: [107.976881613744, 23.736469825635],
                        iconSize: [154, 150],
                    },
                    {
                        pid: '4118673044933167206',
                        name: '颠桂黔边纵队桂西区指挥部旧址',
                        point: [107.75033602157234, 23.890487124471733],
                        iconSize: [154, 150],
                    },
                    {
                        pid: '4118673045792561049',
                        name: '河池大化县古河革命纪念馆',
                        point: [107.75049207012201, 23.890604194303126],
                        iconSize: [154, 150],
                    },
                    {
                        pid: '4118678345300604618',
                        name: '大化奇石馆',
                        point: [107.981863, 23.733993],
                        iconSize: [154, 150],
                    },
                    {
                        pid: '4118863595517213850',
                        name: '七百弄国家地质公园',
                        point: [107.9351004144022, 23.77339646716498],
                        iconSize: [154, 150],
                    },
                    {
                        pid: '4118836103569701422',
                        name: '大化岩滩旅游景区',
                        point: [107.503363712527, 24.03283733702],
                        iconSize: [154, 150],
                    },
                    {
                        pid: '4118839681175570240',
                        name: '红水河东盟国际垂钓基地',
                        point: [107.522332830059, 24.164511211226],
                        iconSize: [154, 150],
                    },
                    {
                        pid: '4118678345719405329',
                        name: '大化“夜街”景区',
                        point: [107.987868818978, 23.737878598317],
                        iconSize: [154, 150],
                    },
                    {
                        pid: '4118675291783035962',
                        name: '红水河百里风情画廊景区',
                        point: [107.965440591174, 23.71738801082],
                        iconSize: [154, 150],
                    },
                ]
            }
        ]
    },

}
