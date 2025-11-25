// customNode.js
import G6 from '@antv/g6'
// 导入Base64图片资源
import { Base64Img } from './imageResources'

// 注册自定义节点
G6.registerNode(
    'custom-node',
    {
        draw (cfg, group) {
            const size = cfg.size || 50
            const status = cfg.status // 正常/异常
            const source = cfg.source // 数据来源
            const alerts = cfg.Alerts || null // 获取告警数

            // 底座图片
            const baseImage = group.addShape('image', {
                attrs: {
                    x: -size / 2,
                    y: -size / 2,
                    width: size,
                    height: size,
                    // 根据状态选择不同的底座图片
                    img:
            status === '异常'
                ? Base64Img.abbaseImagelBase64
                : Base64Img.baseImageBase64
                },
                name: 'base-image'
            })

            // 类型图片 - 根据source和status分为前三种类型
            let typeImageSource
            if (source === '防火墙') {
                // 防火墙类型图片，根据状态选择
                typeImageSource
          = status === '异常'
                        ? Base64Img.firewallErrorBase64
                        : Base64Img.firewallBase64
            } else if (source === '负载均衡器' || source === 'ESB集群信息') {
                // F5类型图片，根据状态选择
                typeImageSource
          = status === '异常' ? Base64Img.F5ErrorBase64 : Base64Img.F5Base64
            } else {
                // 默认类型图片，根据状态选择
                typeImageSource
          = status === '异常'
                        ? Base64Img.topologyImageErrorBase64
                        : Base64Img.topologyImageBase64
            }

            // 类型图片 - 统一尺寸，居中显示
            const typeImage = group.addShape('image', {
                attrs: {
                    x: -size * 0.37,
                    y: -size * 0.5,
                    width: size * 0.8, // 统一宽度为节点大小的80%
                    height: size * 0.7, // 统一高度为节点大小的80%
                    img: typeImageSource
                },
                name: 'type-image'
            })

            // 判断是否需要显示告警数（不为null且不为"0"）
            const showAlerts
        = alerts !== null && alerts !== '0' && alerts !== undefined

            // 计算背景宽度和内部元素位置，使图片和数字在背景中居中
            const statusImageSize = size / 9
            const alertsTextWidth = showAlerts ? 15 : 0 // 估算告警数字宽度
            const padding = 5 // 内边距
            const totalContentWidth = showAlerts
                ? statusImageSize + alertsTextWidth // 图片 + 间距 + 数字宽度
                : statusImageSize // 只有图片宽度
            const backgroundWidth = totalContentWidth + padding * 2 // 总宽度 = 内容宽度 + 左右内边距

            // 状态背景（居中显示内容）
            const statusBackground = group.addShape('rect', {
                attrs: {
                    x: size / 8 - 5, // 状态图片左侧留出边距
                    y: -size / 2.4 - 5, // 状态图片上方留出边距
                    width: backgroundWidth,
                    height: statusImageSize + 10, // 状态图片高度 + 边距
                    fill: status === '异常' ? '#2e0d0d' : '#0d2d2e', // 根据状态设置背景色
                    stroke: status === '异常' ? '#2e0d0d' : '#0d2d2e', // 边框颜色与背景色一致
                    lineWidth: 1, // 边框粗细
                    radius: 10 // 圆角
                },
                name: 'status-background'
            })

            // 状态图片（在背景内居中）
            const statusImage = group.addShape('image', {
                attrs: {
                    x: size / 8 - 5 + padding, // 背景左侧 + 内边距
                    y: -size / 2.4,
                    width: statusImageSize,
                    height: statusImageSize,
                    img:
            status === '异常'
                ? Base64Img.abnormalBase64
                : Base64Img.normalImageBase64
                },
                name: 'status-image'
            })

            // 如果是异常状态且有告警数，显示告警数（居中对齐）
            if (status === '异常' && showAlerts) {
                // 告警数文本（在背景内居中）
                group.addShape('text', {
                    attrs: {
                        x: size / 8 - 5 + padding + statusImageSize + 8, // 图片右侧 + 间距
                        y: -size / 2.4 + statusImageSize / 2,
                        textAlign: 'center',
                        textBaseline: 'middle',
                        text: alerts,
                        fill: '#ffffff',
                        fontSize: 12,
                        fontWeight: 'bold'
                    },
                    name: 'alerts-text'
                })
            }

            if (cfg.label) {
                group.addShape('text', {
                    attrs: {
                        x: 0,
                        y: size / 2 + 18,
                        textAlign: 'center',
                        textBaseline: 'top',
                        text: cfg.label,
                        fill: '#fff',
                        fontSize: 12
                    },
                    name: 'custom-node-label'
                })
            }

            // 添加透明覆盖层，用于捕获鼠标事件
            const dragArea = group.addShape('rect', {
                attrs: {
                    x: -size / 2,
                    y: -size / 2,
                    width: size,
                    height: size,
                    fill: 'transparent',
                    stroke: 'transparent'
                },
                name: 'drag-area',
                draggable: true
            })

            return dragArea
        },

        // 设置锚点
        getAnchorPoints () {
            // 每条边设置3个锚点，总共12个锚点
            return [
                // 左侧边的3个锚点 (x=0)
                [0, 0.4], // 左侧上部
                [0, 0.5], // 左侧中间
                [0, 0.6], // 左侧下部

                // 右侧边的3个锚点 (x=1)
                [1, 0.4], // 右侧上部
                [1, 0.5], // 右侧中间
                [1, 0.6], // 右侧下部

                // 上侧边的3个锚点 (y=0)
                [0.4, 0], // 上侧左侧
                [0.5, 0], // 上侧中间
                [0.6, 0], // 上侧右侧

                // 下侧边的3个锚点 (y=1)
                [0.4, 1], // 下侧左侧
                [0.5, 1], // 下侧中间
                [0.6, 1] // 下侧右侧
            ]
        },

        // 更新节点时的处理
        update (cfg, item) {
            const group = item.getContainer()
            const children = group.get('children')
            const status = cfg.status
            const source = cfg.source
            const alerts = cfg.Alerts || null
            const nodeSize = cfg.size || 50

            // 更新底座图片
            if (children[0]) {
                children[0].attr(
                    'img',
                    status === '异常'
                        ? Base64Img.abbaseImagelBase64
                        : Base64Img.baseImageBase64
                )
            }

            // 更新类型图片
            if (children[1]) {
                let typeImageSource
                if (source === '防火墙') {
                    typeImageSource
            = status === '异常'
                            ? Base64Img.firewallErrorBase64
                            : Base64Img.firewallBase64
                } else if (source === '负载均衡器' || source === 'ESB集群信息') {
                    typeImageSource
            = status === '异常' ? Base64Img.F5ErrorBase64 : Base64Img.F5Base64
                } else {
                    typeImageSource
            = status === '异常'
                            ? Base64Img.topologyImageErrorBase64
                            : Base64Img.topologyImageBase64
                }
                children[1].attr({
                    img: typeImageSource,
                    width: nodeSize * 0.8,
                    height: nodeSize * 0.7,
                    x: -nodeSize * 0.37,
                    y: -nodeSize * 0.5
                })
            }

            // 判断是否需要显示告警数（不为null且不为"0"）
            const showAlerts
        = alerts !== null && alerts !== '0' && alerts !== undefined

            // 计算背景宽度和内部元素位置，使图片和数字在背景中居中
            const statusImageSize = nodeSize / 9
            const alertsTextWidth = showAlerts ? 15 : 0 // 估算告警数字宽度
            const padding = 5 // 内边距
            const totalContentWidth = showAlerts
                ? statusImageSize + alertsTextWidth // 图片 + 间距 + 数字宽度
                : statusImageSize // 只有图片宽度
            const backgroundWidth = totalContentWidth + padding * 2 // 总宽度 = 内容宽度 + 左右内边距

            // 更新状态背景（根据是否有告警数调整大小）
            if (children[2]) {
                children[2].attr({
                    x: nodeSize / 8 - 5,
                    y: -nodeSize / 2.4 - 5,
                    width: backgroundWidth,
                    height: statusImageSize + 10,
                    fill: status === '异常' ? '#2e0d0d' : '#0d2d2e',
                    stroke: status === '异常' ? '#2e0d0d' : '#0d2d2e',
                    lineWidth: 1,
                    radius: 10
                })
            }

            // 更新状态图片
            const statusImageIndex = 3
            if (children[statusImageIndex]) {
                children[statusImageIndex].attr({
                    x: nodeSize / 8 - 5 + padding, // 背景左侧 + 内边距
                    y: -nodeSize / 2.4,
                    width: statusImageSize,
                    height: statusImageSize,
                    img:
            status === '异常'
                ? Base64Img.abnormalBase64
                : Base64Img.normalImageBase64
                })
            }

            // 更新或添加告警文本
            let alertsTextIndex = -1
            for (let i = 0; i < children.length; i++) {
                if (children[i].get('name') === 'alerts-text') {
                    alertsTextIndex = i
                    break
                }
            }

            if (status === '异常' && showAlerts) {
                if (alertsTextIndex !== -1) {
                    // 更新现有告警文本（居中对齐）
                    children[alertsTextIndex].attr({
                        x: nodeSize / 8 - 5 + padding + statusImageSize + 8, // 图片右侧 + 间距
                        y: -nodeSize / 2.4 + statusImageSize / 2,
                        text: alerts,
                        fill: '#ffffff',
                        fontSize: 12,
                        fontWeight: 'bold'
                    })
                } else {
                    // 创建新的告警文本（居中对齐）
                    group.addShape('text', {
                        attrs: {
                            x: nodeSize / 8 - 5 + padding + statusImageSize + 8, // 图片右侧 + 间距
                            y: -nodeSize / 2.4 + statusImageSize / 2,
                            textAlign: 'left',
                            textBaseline: 'middle',
                            text: alerts,
                            fill: '#ffffff',
                            fontSize: 12,
                            fontWeight: 'bold'
                        },
                        name: 'alerts-text'
                    })
                }
            } else {
                // 如果不是异常状态或没有告警，移除告警文本
                if (alertsTextIndex !== -1) {
                    children[alertsTextIndex].remove()
                }
            }

            // 更新标签
            const labelIndex = children.length > 4 ? 4 : children.length - 1
            if (
                cfg.label
        && children[labelIndex]
        && children[labelIndex].get('name') === 'custom-node-label'
            ) {
                children[labelIndex].attr('text', cfg.label)
            }
        },

        // 添加状态交互
        setState (name, value, item) {
            if (name === 'hover') {
                const group = item.getContainer()
                const children = group.get('children')
                // 可以在这里添加hover状态的样式变化
            }
        }
    },
    'single-node'
)

G6.registerEdge(
    'orthogonal-edge',
    {
        draw (cfg, group) {
            const { startPoint, endPoint } = cfg
            const offset = cfg.style && cfg.style.offset ? cfg.style.offset : 0

            // 创建折线路径
            const path = this.createPath(startPoint, endPoint, offset, cfg)

            // 创建主线（实线）
            const mainLine = group.addShape('path', {
                attrs: {
                    path: path,
                    stroke: '#264d85',
                    lineWidth: 2
                },
                name: 'main-path-shape'
            })

            return mainLine
        },

        afterDraw (cfg, group) {
            const { startPoint, endPoint } = cfg
            const offset = cfg.style && cfg.style.offset ? cfg.style.offset : 0

            // 创建折线路径
            const path = this.createPath(startPoint, endPoint, offset, cfg)

            // 创建带渐变的流动效果线
            const flowLine = group.addShape('path', {
                attrs: {
                    path: path,
                    // 亮蓝色到透明的渐变
                    stroke:
            'l(0) 0:rgba(0,191,255,0.1) 0.3:rgba(0,191,255,0.5) 0.7:rgba(0,191,255,0.8) 1:rgba(0,191,255,1)',
                    lineWidth: 2,
                    lineDash: [10, 10],
                    lineDashOffset: 0
                },
                name: 'flow-path-shape'
            })

            // 将flowLine存储到group上，方便后续访问
            group.set('flowLine', flowLine)

            // 启动动画
            this.startAnimation(flowLine)
        },

        // 新增：统一的动画启动方法
        startAnimation (flowLine) {
            if (flowLine && flowLine.animate) {
                // G6 4.0 动画API
                flowLine.animate(
                    (ratio) => {
                        const diff = ratio * -20
                        return {
                            lineDashOffset: diff
                        }
                    },
                    {
                        repeat: true,
                        duration: 1000
                    }
                )
            }
        },

        update (cfg, edge) {
            const group = edge.getContainer()
            const children = group.get('children')
            const { startPoint, endPoint } = cfg
            const offset = cfg.style && cfg.style.offset ? cfg.style.offset : 0

            // 创建折线路径
            const path = this.createPath(startPoint, endPoint, offset, cfg)

            // 更新所有子形状
            if (children) {
                children.forEach((child) => {
                    if (child.attr) {
                        child.attr({
                            path: path
                        })
                    }
                })
            }

            // 从group中获取flowLine而不是通过过滤children
            const flowLine = group.get('flowLine')

            // 重新启动流动线的动画
            if (flowLine) {
                // 停止现有动画
                flowLine.stopAnimate()

                // 重新启动动画
                this.startAnimation(flowLine)
            }
        },
        /**
     * 创建路径（直线或折线）
     * @param {Object} start - 起点坐标
     * @param {Object} end - 终点坐标
     * @param {Number} offset - 偏移量
     * @param {Object} cfg - 边的配置信息
     * @returns {Array} 路径数组
     */
        createPath (start, end, offset, cfg) {
            const startX = start.x
            const startY = start.y
            const endX = end.x
            const endY = end.y

            // 特殊处理：ESB集群到核心交换机的连接
            const sourceNodeLabel = cfg.source
            const targetNodeLabel = cfg.target

            if (
                sourceNodeLabel
        && sourceNodeLabel.includes('esb')
        && targetNodeLabel
        && targetNodeLabel.includes('coreSwitch')
            ) {
                // 从ESB集群(右侧)到核心交换机(左侧)
                // 由于我们指定了锚点，路径应该是先水平移动，再垂直移动
                const offsetX = offset || 0
                return [
                    ['M', startX, startY],
                    ['L', startX + offsetX, endY],
                    ['L', endX, endY] // 垂直移动到目标Y位置
                ]
            }

            // 检查是否存在反向边（双向连接的情况）
            let hasReverseEdge = false
            let edgeIndex = 0

            if (cfg.edges) {
                // 查找是否存在反向边
                hasReverseEdge = cfg.edges.some(
                    (edge) => edge.source === cfg.target && edge.target === cfg.source
                )

                // 获取当前边在相同节点对中的索引
                if (hasReverseEdge) {
                    const sameEdges = cfg.edges.filter(
                        (edge) =>
                            (edge.source === cfg.source && edge.target === cfg.target)
              || (edge.source === cfg.target && edge.target === cfg.source)
                    )

                    edgeIndex = sameEdges.findIndex(
                        (edge) => edge.source === cfg.source && edge.target === cfg.target
                    )
                }
            }

            // 如果存在双向连接，则添加偏移量（创造"粗线分裂"效果）
            let offsetValue = 0
            if (hasReverseEdge) {
                // 使用较小的偏移量，创造"粗线分裂"的感觉
                offsetValue = edgeIndex === 0 ? -3 : 3
            }

            // 判断是否在同一水平线或垂直线上（容差为1像素）
            const isHorizontal = Math.abs(startY - endY) < 1
            const isVertical = Math.abs(startX - endX) < 1

            // 如果在同一水平线或垂直线上，直接绘制直线
            if (isHorizontal || isVertical) {
                if (isHorizontal) {
                    // 水平线使用Y轴偏移
                    return [
                        ['M', startX, startY + offsetValue],
                        ['L', endX, endY + offsetValue]
                    ]
                } else {
                    // 垂直线使用X轴偏移
                    return [
                        ['M', startX + offsetValue, startY],
                        ['L', endX + offsetValue, endY]
                    ]
                }
            }

            // 默认路径创建逻辑：先垂直移动，再水平移动
            if (Math.abs(startX - endX) > Math.abs(startY - endY)) {
                // 水平距离更大，先水平再垂直
                return [
                    ['M', startX, startY + offsetValue],
                    ['L', endX, startY + offsetValue],
                    ['L', endX, endY]
                ]
            } else {
                // 垂直距离更大，先垂直再水平
                return [
                    ['M', startX + offsetValue, startY],
                    ['L', startX + offsetValue, endY],
                    ['L', endX, endY]
                ]
            }
        }
    },
    'polyline' // 使用polyline作为基类
)
