<template>
  <div class="custom-component" ref="component">
    <!-- 三栏布局容器 -->
    <div class="layout-container">
      <!-- 左侧 Tab 栏 -->
      <div class="left-panel">
        <div class="tab-content">
          <div
            v-for="(tab, index) in tabs"
            :key="index"
            class="tab-item"
            :class="{
              active: activeTab === tab.key,
              warning:
                tabRawData[tab.key] && tabRawData[tab.key].status === 'warning',
            }"
            @click="selectTab(tab.key)"
          >
            <span class="tab-label">{{ tab.label }}</span>
            <!-- 添加异常状态图标 -->
            <img
              v-if="
                tabRawData[tab.key] && tabRawData[tab.key].status === 'warning'
              "
              class="warning-icon"
              src="./assets/img/abnormal.png"
              alt="warning"
            />
            <img
              v-if="activeTab === tab.key"
              class="arrow-icon"
              src="./assets/img/tab.png"
              alt="arrow"
            />
          </div>
        </div>
      </div>

      <!-- 中间 G6 画布 -->
      <div class="center-panel" ref="chartWrapper">
        <div ref="ringChart" class="ring-chart"></div>
      </div>
      <!-- 右侧 详情栏 -->
      <div class="right-panel">
        <div class="detail-header" :class="{ active: showDetailPanel }">
          <div class="title-container">
            <img class="title-icon" src="./assets/img/Frame.png" alt="icon" />
            <span class="detail-title">{{ selectedNodeLabel }}</span>
          </div>
        </div>
        <div class="detail-content">
          <div
            v-for="(item, index) in detailItems"
            :key="index"
            class="detail-item"
            :class="{ active: selectedItem === index }"
            @click="selectItem(index)"
          >
            <div class="item-name">{{ item.name }}</div>
            <div class="item-stats">
              <div class="stats-grid">
                <span
                  v-for="(stat, statIndex) in item.stats"
                  :key="statIndex"
                  :class="stat.className"
                >
                  {{ stat.name }}: {{ stat.value }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import G6 from "@antv/g6";
import "./customNode.js"; // 导入自定义节点定义文件
/**
 * 自定义层级布局
 */
class CustomLayerLayout {
  constructor(options = {}) {
    this.options = {
      layerHeight: 200, // 每层的高度
      nodeSpacing: 150, // 节点间水平间距
      startY: 50, // 起始Y坐标
      ...options,
    };
  }

  /**
   * 执行布局
   * @param {Object} data - 图数据
   * @returns {Object} 布局后的图数据
   */
  execute(data) {
    const { nodes, edges } = data;
    if (!nodes) return data;

    // 分类节点到不同层级
    const layers = this.categorizeNodes(nodes);

    // 为每个层级的节点分配坐标
    const positionedNodes = this.positionNodes(layers);

    return {
      nodes: positionedNodes,
      edges: edges || [],
    };
  }

  /**
   * 根据节点类型将节点分类到不同层级
   * @param {Array} nodes - 节点数组
   * @returns {Object} 分层后的节点
   */
  categorizeNodes(nodes) {
    const layers = {
      layer0: [], // 第一层：防火墙
      layer1: [], // 第二层：核心交换机、负载均衡器
      layer2: [], // 第三层：分组、ESB集群
    };

    nodes.forEach((node) => {
      if (node.label && node.label.includes("防火墙")) {
        layers.layer0.push(node);
      } else if (
        node.label &&
        (node.label.includes("负载均衡器") || node.label.includes("核心交换机"))
      ) {
        layers.layer1.push(node);
      } else if (
        node.label &&
        (node.label.includes("分组") || node.label.includes("ESB集群"))
      ) {
        layers.layer2.push(node);
      } else {
        // 默认放入第二层
        layers.layer1.push(node);
      }
    });

    return layers;
  }

  /**
   * 为节点分配坐标位置
   * @param {Object} layers - 分层节点
   * @returns {Array} 带坐标的节点数组
   */
  positionNodes(layers) {
    let allNodes = [];

    // 处理第一层（防火墙）
    if (layers.layer0.length > 0) {
      const layer0Nodes = this.layoutLayerFirst(layers.layer0, 0);
      allNodes = allNodes.concat(layer0Nodes);
    }

    // 处理第二层（核心交换机、负载均衡器）
    if (layers.layer1.length > 0) {
      const layer1Nodes = this.layoutLayerSecond(layers.layer1, 1);
      allNodes = allNodes.concat(layer1Nodes);
    }

    // 处理第三层（分组、ESB集群）
    if (layers.layer2.length > 0) {
      const layer2Nodes = this.layoutLayerThird(layers.layer2, 2);
      allNodes = allNodes.concat(layer2Nodes);
    }

    return allNodes;
  }

  /**
   * 为第一层节点布局（防火墙）
   * @param {Array} nodes - 节点数组
   * @param {Number} layerIndex - 层级索引
   * @returns {Array} 布局后的节点数组
   */
  layoutLayerFirst(nodes, layerIndex) {
    const { layerHeight, startY } = this.options;
    const positionedNodes = [];

    // 防火墙居中放置
    nodes.forEach((node) => {
      positionedNodes.push({
        ...node,
        x: 0, // 防火墙放在画布中央
        y: startY + layerIndex * layerHeight,
      });
    });

    return positionedNodes;
  }

  /**
   * 为第二层节点布局（核心交换机、负载均衡器）
   * @param {Array} nodes - 节点数组
   * @param {Number} layerIndex - 层级索引
   * @returns {Array} 布局后的节点数组
   */
  layoutLayerSecond(nodes, layerIndex) {
    const { layerHeight, nodeSpacing, startY } = this.options;
    const positionedNodes = [];

    // 分离核心交换机和负载均衡器
    const coreSwitches = nodes.filter(
      (node) => node.label && node.label.includes("核心交换机")
    );
    const loadBalancers = nodes.filter(
      (node) => node.label && node.label.includes("负载均衡器")
    );

    // 核心交换机放在与防火墙同一垂直线上（x=0）
    coreSwitches.forEach((node) => {
      positionedNodes.push({
        ...node,
        x: 0,
        y: startY + layerIndex * layerHeight,
      });
    });

    // 负载均衡器放在核心交换机左侧
    loadBalancers.forEach((node, index) => {
      positionedNodes.push({
        ...node,
        x: -(index + 1) * nodeSpacing,
        y: startY + layerIndex * layerHeight,
      });
    });

    return positionedNodes;
  }

  /**
   * 为第三层节点布局（分组、ESB集群）
   * @param {Array} nodes - 节点数组
   * @param {Number} layerIndex - 层级索引
   * @returns {Array} 布局后的节点数组
   */
  layoutLayerThird(nodes, layerIndex) {
    const { layerHeight, nodeSpacing, startY } = this.options;
    const positionedNodes = [];

    // 分离分组和ESB集群
    const groups = nodes.filter(
      (node) => node.label && node.label.includes("分组")
    );
    const esbClusters = nodes.filter(
      (node) => node.label && node.label.includes("ESB集群")
    );
    const otherNodes = nodes.filter(
      (node) =>
        !(
          node.label &&
          (node.label.includes("分组") || node.label.includes("ESB集群"))
        )
    );

    // 分组放在核心交换机下方（与核心交换机同一垂直线）
    groups.forEach((node) => {
      positionedNodes.push({
        ...node,
        x: 0,
        y: startY + layerIndex * layerHeight,
      });
    });

    // ESB集群放在分组右侧，但需要考虑连接线从上方连接
    // 为了使连接线从上方连接，我们需要将ESB集群节点位置适当调整
    esbClusters.forEach((node, index) => {
      positionedNodes.push({
        ...node,
        x: (index + 1) * nodeSpacing,
        y: startY + layerIndex * layerHeight,
      });
    });

    // 其他节点（如果有）放在分组左侧
    otherNodes.forEach((node, index) => {
      const leftOffset = groups.length > 0 ? groups.length : 0;
      positionedNodes.push({
        ...node,
        x: -(leftOffset + index + 1) * nodeSpacing,
        y: startY + layerIndex * layerHeight,
      });
    });

    return positionedNodes;
  }
}

// 在你的组件中使用这个自定义布局
export default {
  name: "custom-component",
  data() {
    return {
      /** 默认数据，不可删除 */
      id: "", // 组件唯一id标识
      configKv: {}, // 组件样式键值对
      // 自定义数据
      graph: null,
      options: null,

      // 添加面板控制状态
      showDetailPanel: true, // 控制右侧详情面板是否显示
      selectedNodeLabel: "Node 1111", // 默认选中的节点标签
      selectedItem: 0, // 默认选中第一个详情项
      tabRawData: {},
      // 详情项数据
      detailItems: [],

      // Tab相关数据
      tabs: [
        { key: "internal", label: "内联区" },
        { key: "external", label: "外联前置区" },
        { key: "internet", label: "互联网交易区" },
        { key: "transaction", label: "互联网非交易区" },
      ],
      activeTab: "internal", // 默认选中第一个tab
      tooltipElement: null,
      edgeTooltipElement: null,
    };
  },
  created() {
    this.color = [
      "#4D96FF",
      "#64D8A3",
      "#F8B73F",
      "#65789B",
      "#A96ED4",
      "#85E1FA",
      "#7268F0",
      "#29A397",
      "#BD7830",
      "#FF7A70",
    ];
  },
  /**
   * init、resize、setStyle、setData、destroy为内置函数，
   * 不可删除
   */
  mounted() {
    // 组件挂载后初始化默认ESB集群详情信息
    this.initDefaultESBInfo();
  },
  methods: {
    /** 组件初始化时触发 */
    init() {
      this.initGraph();
      // 在初始化图形后调用reverseScale处理外部缩放
      this.$nextTick(() => {
        this.reverseScale();
      });
    },
    // 新增方法：初始化默认ESB集群信息
    initDefaultESBInfo() {
      this.$nextTick(() => {
        // 设置默认选中的节点标签为"ESB集群"
        this.selectedNodeLabel = "ESB集群";

        // 获取当前tab的详情数据并设置ESB集群的信息
        const rawData = this.tabRawData[this.activeTab] || {};
        const detailData = this.convertToNodeDetailData(rawData);

        // 查找ESB集群的信息（通常source为"esb"或包含"esb"的节点）
        const esbSources = Object.keys(detailData).filter(
          (key) => key.includes("esb") || key.includes("ESB")
        );

        if (esbSources.length > 0) {
          // 使用第一个找到的ESB集群信息
          this.detailItems = detailData[esbSources[0]] || [];
        } else {
          // 如果没有找到ESB集群，使用默认数据或空数组
          this.detailItems = [];
        }

        // 确保详情面板显示
        this.showDetailPanel = true;
      });
    },

    /**
     * 将原始数据转换为G6图数据格式
     * @param {Object} rawData - 原始数据对象
     * @returns {Object} 转换后的G6图数据
     */
    convertToGraphData(rawData) {
      if (!rawData || !rawData.nodes) {
        return { nodes: [], edges: [] };
      }

      // 创建节点映射以便查找节点类型
      const nodeMap = {};
      const nodes = rawData.nodes.map((node) => {
        const processedNode = {
          id: node.key,
          label: node.text,
          type: "custom-node",
          draggable: true,
          status: node.status,
          source: node.source,
          Alerts: node.Alerts,
          detail: node.detail || [],
        };
        nodeMap[node.key] = processedNode;
        return processedNode;
      });

      // 转换边数据
      let edges = rawData.edges
        ? rawData.edges.map((edge) => {
            const newEdge = {
              source: edge.source,
              target: edge.target,
              detailValue: edge.detailValue || [],
              hoverValue: edge.hoverValue || [],
              type: "orthogonal-edge",
              status: edge.status,
              name: edge.name || `${edge.source} → ${edge.target}`, // 添加 name 字段，默认值
            };

            // 定义锚点映射关系表
            const anchorMap = {
              "firewall->coreSwitch": { sourceAnchor: 11, targetAnchor: 8 }, // 防火墙到核心交换机
              "coreSwitch->firewall": { sourceAnchor: 6, targetAnchor: 9 }, // 核心交换机到防火墙
              "esb->coreSwitch": { sourceAnchor: 8, targetAnchor: 3 },
              "coreSwitch->esb": { sourceAnchor: 5, targetAnchor: 6 },
              "coreSwitch->group": { sourceAnchor: 11, targetAnchor: 8 },
              "group->coreSwitch": { sourceAnchor: 6, targetAnchor: 9 },
              "loadBalancer->coreSwitch": { sourceAnchor: 3, targetAnchor: 0 },
              "coreSwitch->loadBalancer": { sourceAnchor: 2, targetAnchor: 5 },
            };

            // 构造当前边的标识符用于查找映射
            //
            const key = `${
              edge.source.includes("esb")
                ? "esb"
                : edge.source.includes("coreSwitch")
                ? "coreSwitch"
                : edge.source.includes("group")
                ? "group"
                : edge.source.includes("loadBalancer")
                ? "loadBalancer"
                : edge.source.includes("firewall")
                ? "firewall"
                : ""
            }->${
              edge.target.includes("esb")
                ? "esb"
                : edge.target.includes("coreSwitch")
                ? "coreSwitch"
                : edge.target.includes("group")
                ? "group"
                : edge.target.includes("loadBalancer")
                ? "loadBalancer"
                : edge.target.includes("firewall")
                ? "firewall"
                : ""
            }`;

            // 应用对应的锚点配置
            if (anchorMap[key]) {
              newEdge.sourceAnchor = anchorMap[key].sourceAnchor;
              newEdge.targetAnchor = anchorMap[key].targetAnchor;
            } else {
              // 可选：打印日志或设置默认锚点以防止意外情况
              console.warn(`未找到对应锚点配置: ${key}`);
            }
            return newEdge;
          })
        : [];

      return { nodes, edges };
    },
    /**
     * 处理tab切换
     * @param {String} tabKey - tab键值
     */
    selectTab(tabKey) {
      this.activeTab = tabKey;

      if (this.tabRawData[tabKey]) {
        const graphData = this.convertToGraphData(this.tabRawData[tabKey]);
        if (this.graph) {
          this.graph.changeData(graphData);
          this.$nextTick(() => {
            this.graph.fitView([200, 200, 200, 200]);

            // 强制刷新所有边以重启动画
            setTimeout(() => {
              const edges = this.graph.getEdges();
              edges.forEach((edge) => {
                this.graph.refreshItem(edge);
              });

              // 重新应用反缩放
              this.reverseScale();
            }, 100);
          });
        }
        // 添加这部分代码来更新右侧ESB信息
        this.updateESBDetailsForTab(tabKey);
      } else {
        if (this.graph) {
          this.graph.changeData({ nodes: [], edges: [] });
        }
      }
    },
    updateESBDetailsForTab(tabKey) {
      const rawData = this.tabRawData[tabKey] || {};
      const detailData = this.convertToNodeDetailData(rawData);

      // 查找ESB集群的信息
      const esbSources = Object.keys(detailData).filter((key) => {
        const node = rawData.nodes?.find((node) => node.key === key);
        return (
          node &&
          (node.source.includes("esb") ||
            node.source.includes("ESB") ||
            node.text.includes("ESB") ||
            node.text.includes("esb"))
        );
      });

      if (esbSources.length > 0) {
        // 使用第一个找到的ESB集群信息
        this.detailItems = detailData[esbSources[0]] || [];
      } else {
        // 如果没有找到ESB集群，使用默认数据或空数组
        this.detailItems = [];
      }

      // 更新选中的节点标签为ESB集群名称
      const esbNode = rawData.nodes?.find(
        (node) =>
          node.source.includes("esb") ||
          node.source.includes("ESB") ||
          node.text.includes("ESB") ||
          node.text.includes("esb")
      );

      if (esbNode) {
        this.selectedNodeLabel = esbNode.text || "ESB集群";
      } else {
        this.selectedNodeLabel = "ESB集群";
      }
    },
    selectItem(index) {
      this.selectedItem = index;
      // 这里可以添加选择详情项时的业务逻辑
    },
    /** 组件大小变更时触发 */
    resize() {
      if (this.graph) {
        this.$nextTick(() => {
          this.graph.changeSize(
            this.$refs.ringChart.clientWidth,
            this.$refs.ringChart.clientHeight
          );
          // 重新应用反向缩放
          this.reverseScale();
        });
      }
    },
    /** 调整画布大小并保持视图一致 */
    resizeGraphAndKeepView(newWidth, newHeight) {
      if (!this.graph) return;

      // 获取当前变换
      const transform = this.graph.get("group").getMatrix() || [
        1, 0, 0, 0, 1, 0, 0, 0, 1,
      ];

      // 保存当前视图中心点的世界坐标
      const oldWidth = this.graph.get("width");
      const oldHeight = this.graph.get("height");
      const scale = transform[0];
      const worldCenterX = (oldWidth / 2 - transform[6]) / scale;
      const worldCenterY = (oldHeight / 2 - transform[7]) / scale;

      // 调整画布大小
      this.graph.changeSize(newWidth, newHeight);

      // 保持视图中心一致
      const newTranslateX = newWidth / 2 - worldCenterX * scale;
      const newTranslateY = newHeight / 2 - worldCenterY * scale;

      const newTransform = [...transform];
      newTransform[6] = newTranslateX;
      newTransform[7] = newTranslateY;

      this.graph.get("group").setMatrix(newTransform);
      this.graph.refresh();

      // 重新应用反缩放
      this.reverseScale();
      // 重新启动所有边的动画
      this.$nextTick(() => {
        setTimeout(() => {
          const edges = this.graph.getEdges();
          edges.forEach((edge) => {
            this.graph.refreshItem(edge);
          });
        }, 50);
      });
    },
    /**
     * 创建或更新提示框
     */
    createTooltip(content, x, y) {
      // 如果已经存在提示框，先移除
      if (this.tooltip) {
        this.tooltip.remove();
      }

      // 创建提示框
      this.tooltip = new G6.Tooltip({
        offsetX: 10,
        offsetY: 10,
        getContent: () => {
          return content;
        },
        itemTypes: ["node"],
      });

      // 注册提示框插件
      this.graph.addPlugin(this.tooltip);
    },

    /**
     * 初始化图实例
     */
    initGraph() {
      // 如果图表已经存在，先销毁
      if (this.graph) {
        this.graph.destroy();
      }

      // 使用当前tab的数据
      const rawData = this.tabRawData[this.activeTab];
      let graphData = rawData
        ? this.convertToGraphData(rawData)
        : { nodes: [], edges: [] };

      // 应用自定义布局
      const customLayout = new CustomLayerLayout({
        layerHeight: 250,
        nodeSpacing: 250,
        startY: 100,
      });

      graphData = customLayout.execute(graphData);

      this.graph = new G6.Graph({
        container: this.$refs.ringChart,
        width: this.$refs.ringChart.clientWidth || 600,
        height: this.$refs.ringChart.clientHeight || 400,
        animate: true,
        animateCfg: {
          duration: 500,
          easing: "easeLinear",
        },
        modes: {
          default: ["drag-node", "zoom-canvas", "drag-canvas"],
        },
        layout: null,
        defaultNode: {
          shape: "custom-node",
          size: 80,
          color: "#333",
        },
        defaultEdge: {
          type: "orthogonal-edge",
          style: {
            endArrow: true,
          },
        },
        // 调整视图内边距，考虑左侧Tab栏宽度
        fitView: true,
        fitViewPadding: [200, 200, 200, 200], // [上, 右, 下, 左]
        edgeStateStyles: {
          hover: {
            lineWidth: 3,
          },
        },
      });

      this.graph.data(graphData);
      this.graph.render();
      // // 确保动画在渲染后启动
      // this.$nextTick(() => {
      //   if (this.graph) {
      //     this.graph.fitView([200, 200, 200, 200]);

      //     // 强制刷新以确保动画启动
      //     setTimeout(() => {
      //       this.graph.refresh();
      //     }, 100);
      //   }
      // });
      // 节点点击事件
      this.graph.on("node:click", (evt) => {
        const node = evt.item;
        const nodeId = node.get("id");
        const nodeModel = node.getModel();
        console.log(nodeModel, "nodeModel");

        // 设置选中节点的标签
        this.selectedNodeLabel = nodeModel.label || nodeId;

        // 获取当前tab的详情数据并设置
        const rawData = this.tabRawData[this.activeTab] || {};
        const detailData = this.convertToNodeDetailData(rawData);
        this.detailItems = detailData[nodeId] || [];

        // this.showDetailPanel = true;
        // this.$nextTick(() => {
        //   if (this.graph) {
        //     this.$nextTick(() => {
        //       this.resizeGraphAndKeepView(
        //         this.$refs.component.clientWidth * 0.6,
        //         this.$refs.component.clientHeight
        //       );

        //       // 重新启动所有边的动画
        //       setTimeout(() => {
        //         const edges = this.graph.getEdges();
        //         edges.forEach((edge) => {
        //           this.graph.refreshItem(edge);
        //         });
        //       }, 50);
        //     });
        //   }
        // });
      });

      // 节点鼠标悬浮事件
      this.graph.on("node:mouseenter", (evt) => {
        const node = evt.item;
        const nodeModel = node.getModel();

        // 构建提示内容
        let tooltipContent = `<div class="node-tooltip"><div class="tooltip-content">`;

        // 添加节点详情信息
        if (nodeModel.detail && nodeModel.detail.length > 0) {
          nodeModel.detail.forEach((detail) => {
            if (nodeModel.status === "异常") {
              tooltipContent += `<div class="tooltip-item" style="padding: 5px 0 !important;>
            <span class="item-name">${detail.name}:</span>
            <span class="item-value" style="color: #ff7478 !important;">${detail.value}</span>
            </div>`;
            } else {
              tooltipContent += `<div class="tooltip-item" style="padding: 5px 0 !important;>
            <span class="item-name">${detail.name}:</span>
            <span class="item-value" >${detail.value}</span>
            </div>`;
            }
          });
        } else {
          tooltipContent += `<div class="tooltip-item">暂无详细信息</div>`;
        }

        tooltipContent += `</div></div>`;

        // 创建提示框元素
        if (!this.tooltipElement) {
          this.tooltipElement = document.createElement("div");
          this.tooltipElement.className = "g6-node-tooltip";
          this.tooltipElement.style.position = "absolute";
          this.tooltipElement.style.backgroundColor = "#111B30";
          this.tooltipElement.style.color = "#fff";
          this.tooltipElement.style.padding = "10px";
          this.tooltipElement.style.borderRadius = "4px";
          this.tooltipElement.style.fontSize = "12px";
          this.tooltipElement.style.zIndex = "999";
          this.tooltipElement.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.3)";
          this.tooltipElement.style.pointerEvents = "none";
          document.body.appendChild(this.tooltipElement);
        }

        this.tooltipElement.innerHTML = tooltipContent;
        // 设置提示框位置为鼠标右侧
        this.tooltipElement.style.left = evt.canvasX + "px";
        this.tooltipElement.style.top = evt.canvasY + "px";
        this.tooltipElement.style.transform = "translate(80px, 0)";

        this.tooltipElement.style.display = "block";
      }),
        // 节点鼠标移出事件
        this.graph.on("node:mouseleave", (evt) => {
          if (this.tooltipElement) {
            this.tooltipElement.style.display = "none";
          }
        });

      // 添加画布点击事件（点击空白处）
      // this.graph.on("canvas:click", (evt) => {
      //   this.closeDetailPanel();
      // });

      // 边鼠标悬浮事件
      this.graph.on("edge:mouseenter", (evt) => {
        // 构建提示内容
        let tooltipContent = `<div class="node-tooltip"><div class="tooltip-content">
    <div class="tooltip-item">暂无接入数据</div>
  </div></div>`;

        // 创建提示框元素
        if (!this.edgeTooltipElement) {
          this.edgeTooltipElement = document.createElement("div");
          this.edgeTooltipElement.className = "g6-node-tooltip";
          this.edgeTooltipElement.style.position = "absolute";
          this.edgeTooltipElement.style.backgroundColor = "#111B30";
          this.edgeTooltipElement.style.color = "#fff";
          this.edgeTooltipElement.style.padding = "10px";
          this.edgeTooltipElement.style.borderRadius = "4px";
          this.edgeTooltipElement.style.fontSize = "12px";
          this.edgeTooltipElement.style.zIndex = "999";
          this.edgeTooltipElement.style.boxShadow =
            "0 2px 6px rgba(0, 0, 0, 0.3)";
          this.edgeTooltipElement.style.pointerEvents = "none";
          document.body.appendChild(this.edgeTooltipElement);
        }

        this.edgeTooltipElement.innerHTML = tooltipContent;
        // 设置提示框位置为鼠标右侧
        this.edgeTooltipElement.style.left = evt.canvasX + "px";
        this.edgeTooltipElement.style.top = evt.canvasY + "px";
        this.edgeTooltipElement.style.transform = "translate(80px, 0)";

        this.edgeTooltipElement.style.display = "block";
      });
      // 边鼠标点击事件
      this.graph.on("edge:click", (evt) => {
        const edge = evt.item;
        const edgeModel = edge.getModel();

        // 设置选中边的标签
        this.selectedNodeLabel =
          edgeModel.name || `${edgeModel.source} → ${edgeModel.target}`;

        // 构造边的详情数据
        const edgeDetailItems = [];
        if (edgeModel.detailValue && edgeModel.detailValue.length > 0) {
          edgeDetailItems.push({
            name: "连接详情",
            stats: edgeModel.detailValue.map((detail) => ({
              name: detail.name,
              value: detail.value,
            })),
          });
        } else {
          edgeDetailItems.push({
            name: "连接详情",
            stats: [
              { name: "源节点", value: edgeModel.source },
              { name: "目标节点", value: edgeModel.target },
              {
                name: "状态",
                value: edgeModel.status === "normal" ? "正常" : "异常",
              },
            ],
          });
        }

        this.detailItems = edgeDetailItems;
        this.showDetailPanel = true;
      });
      // 边鼠标移出事件
      this.graph.on("edge:mouseleave", (evt) => {
        if (this.edgeTooltipElement) {
          this.edgeTooltipElement.style.display = "none";
        }
      });

      // 鼠标移动事件，用于更新提示框位置
      this.graph.on("mousemove", (evt) => {
        // 更新节点tooltip位置（保持原有逻辑）
        if (
          this.tooltipElement &&
          this.tooltipElement.style.display !== "none"
        ) {
          this.tooltipElement.style.left = evt.canvasX + "px";
          this.tooltipElement.style.top = evt.canvasY + "px";
          this.tooltipElement.style.transform = "translate(80px, 0)";
        }

        // 更新边tooltip位置
        if (
          this.edgeTooltipElement &&
          this.edgeTooltipElement.style.display !== "none"
        ) {
          this.edgeTooltipElement.style.left = evt.canvasX + "px";
          this.edgeTooltipElement.style.top = evt.canvasY + "px";
          this.edgeTooltipElement.style.transform = "translate(80px, 0)";
        }
      });

      // 初始化后自动适配视图
      this.$nextTick(() => {
        if (this.graph) {
          this.graph.fitView([200, 200, 200, 200]);

          // 手动触发动画
          setTimeout(() => {
            const edges = this.graph.getEdges();
            edges.forEach((edge) => {
              // 重新应用边的样式以触发动画
              this.graph.refreshItem(edge);
            });
          }, 200);
        }
      });
    },
    /**
     * 反缩放
     */
    reverseScale() {
      // 在设计器中直接返回基础比率
      const isDesigner = window.location.href.indexOf("design") > -1;
      if (isDesigner) return;

      // 查找 preview-wrap 元素并检测其缩放
      const previewWrap = document.querySelector(".preview-wrap");
      if (previewWrap) {
        const computedStyle = window.getComputedStyle(previewWrap);
        const transform =
          computedStyle.transform || computedStyle.webkitTransform;

        if (transform && transform !== "none") {
          const matrix = new DOMMatrixReadOnly(transform);
          const scale = { scaleX: matrix.a, scaleY: matrix.d };

          // 对包装容器应用缩放而不是直接对G6画布缩放
          this.$refs.component.style.transform = `scale(${1 / scale.scaleX}, ${
            1 / scale.scaleY
          })`;
          // this.$refs.component.style.transformOrigin = "center center";
        } else {
          // 清除缩放
          this.$refs.component.style.transform = "";
        }
      }
    },
    // 关闭详情面板
    closeDetailPanel() {
      this.showDetailPanel = false;
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.graph) {
            this.$nextTick(() => {
              this.resizeGraphAndKeepView(
                this.$refs.component.clientWidth * 0.85 - 1,
                this.$refs.component.clientHeight
              );

              // 重新启动所有边的动画
              setTimeout(() => {
                const edges = this.graph.getEdges();
                edges.forEach((edge) => {
                  this.graph.refreshItem(edge);
                });
              }, 50);
            });
          }
        }, 100);
      });
    },
    /**
     * 将原始数据转换为节点详情数据
     * @param {Object} rawData - 原始数据
     * @returns {Object} 节点详情数据映射
     */
    convertToNodeDetailData(rawData) {
      const detailData = {};

      if (rawData && rawData.list) {
        rawData.list.forEach((item) => {
          // 将listdetail数据转换为组件需要的详情项格式
          detailData[item.source] = item.listdetail.map((detail) => {
            // 从detailValue数组中提取数据
            let values = detail.detailValue || [];

            // 直接使用提供的值，不添加默认值
            const stats = values.map((val, index) => ({
              name: val.name || `指标${index + 1}`,
              value: val.value || "--",
            }));

            return {
              name: detail.name || "未知项",
              stats: stats,
            };
          });
        });
      }

      return detailData;
    },
    /** 组件配置项变更时触发 */
    setStyle(k, v) {
      const keyList = k.split("$");
      if (keyList.length > 1) {
        this.configKv[keyList[0]][keyList[1]] = v;
      } else {
        this.configKv[keyList[0]] = v;
      }
      this.initGraph();
    },

    /** 组件数据变更时触发 */
    setData(data) {
      // 根据传入的数据结构处理
      if (data && typeof data === "object") {
        // 如果传入的是包含多个tab的数据结构
        if (
          data.internal ||
          data.external ||
          data.internet ||
          data.transaction
        ) {
          // 完整的tab数据结构
          this.tabRawData = data;
        } else {
          // 如果传入的是单个tab的数据（当前tab的数据）
          // 直接更新当前tab的数据
          this.$set(this.tabRawData, this.activeTab, data);
        }

        // 使用更新后的数据刷新画布
        const rawData = this.tabRawData[this.activeTab];
        if (rawData) {
          let graphData = this.convertToGraphData(rawData);

          // 应用自定义布局
          const customLayout = new CustomLayerLayout({
            layerHeight: 150,
            nodeSpacing: 200,
            startY: 100,
          });
          graphData = customLayout.execute(graphData);

          if (this.graph) {
            this.graph.changeData(graphData);
            // 数据更新后自动适配视图
            this.$nextTick(() => {
              this.graph.fitView([200, 200, 200, 200]);
            });
          } else {
            this.initGraph();
          }
          // 更新数据后重新初始化默认ESB信息
          this.initDefaultESBInfo();
        }
      }
    },

    /** 组件销毁时触发 */
    destroy() {
      if (!this.graph) {
        return;
      }

      // 清理节点tooltip
      if (this.tooltipElement) {
        this.tooltipElement.remove();
        this.tooltipElement = null;
      }

      // 清理边tooltip
      if (this.edgeTooltipElement) {
        this.edgeTooltipElement.remove();
        this.edgeTooltipElement = null;
      }

      this.graph.destroy();
      this.graph = null;
    },
  },
};
</script>
<style scoped lang="scss">
.custom-component {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .layout-container {
    display: flex;
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    // 中间面板 (G6画布) - 自适应剩余空间
    .center-panel {
      flex: 1; // 占据剩余空间
      // background-color: #000;
      box-sizing: border-box;

      .ring-chart {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
    }

    // 右侧面板 - 占据 25%
    .right-panel {
      flex: 0 0 20%; // 不放大不缩小，基础宽度 20%
      min-width: 150px; // 设置最小宽度防止过小
      background-color: #111d30;
      height: calc(100% - 100px);
      //   border-left: 1px solid #333;
      position: relative;
      box-sizing: border-box;
      margin: 20px 20px;
      .detail-header {
        height: 60px;
        display: flex;
        align-items: center;
        padding: 0 15px;
        position: relative;
        background:
        // linear-gradient(
        //   90deg,
        //   rgba(95, 199, 255, 0.3) 0%,
        //   rgba(95, 199, 255, 0.1) 100%
        // ),
          url("./assets/img/bg.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 100% 100%;
        // &.active {
        //   // 选中时添加上边框渐变
        //   &::before {
        //     content: "";
        //     position: absolute;
        //     top: 0;
        //     left: 0;
        //     right: 0;
        //     height: 2px;
        //     // 从左到右逐渐消失的渐变边框
        //     background: linear-gradient(
        //       90deg,
        //       #5fc7ff 0%,
        //       rgba(95, 199, 255, 0) 100%
        //     );
        //   }

        //   // 选中时添加下边框渐变
        //   &::after {
        //     content: "";
        //     position: absolute;
        //     bottom: 0;
        //     left: 0;
        //     right: 0;
        //     height: 2px;
        //     // 从左到右逐渐消失的渐变边框
        //     background: linear-gradient(
        //       90deg,
        //       #5fc7ff 0%,
        //       rgba(95, 199, 255, 0) 100%
        //     );
        //   }

        //   // 选中时添加左边框（纯色）
        //   border-left: 2px solid #5fc7ff;
        // }

        .title-container {
          display: flex;
          align-items: center;

          .title-icon {
            width: 16px;
            height: 23px;
            margin-right: 10px;
            flex-shrink: 0;
          }

          .detail-title {
            color: #5fc7ff;
            font-size: 16px;
            font-weight: bold;
          }
        }
      }

      .detail-content {
        width: 100%;
        height: calc(100% - 60px);
        color: #fff;
        box-sizing: border-box;
        overflow-y: auto; // 添加滚动条
        padding: 10px;

        // 滚动条样式（可选）
        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-track {
          background: #000;
        }

        &::-webkit-scrollbar-thumb {
          background: #10375d;
          border-radius: 3px;
        }
        .detail-item {
          background-color: #020c1d;
          border-radius: 4px;
          padding: 12px 15px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: background-color 0.3s;

          &:hover {
            background-color: #10375d;
          }

          //   &.active {
          //     background-color: #10375d;
          //   }

          .item-name {
            color: #00d9ff;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 8px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .item-stats {
            font-size: 12px;

            .stats-grid {
              display: grid;
              grid-template-columns: 1fr 1fr; /* 两列布局 */
              gap: 5px 10px; /* 行间距5px，列间距10px */

              span {
                color: #fff;
                padding: 2px 0;
              }
            }

            .success-rate,
            .response-rate,
            .p99-time,
            .status-4 {
              color: #fff;
            }
          }
        }
      }
    }
  }
}
.left-panel {
  flex: 0 0 15%; // 不放大不缩小，基础宽度 15%
  min-width: 100px; // 设置最小宽度防止过小
  // background-color: #000;
  box-sizing: border-box;
  display: flex;
  align-items: center; // 垂直居中
  justify-content: center; // 水平居中（如果需要）

  .tab-content {
    width: 80%;
    box-sizing: border-box;
    padding: 10px 0;
    display: flex;
    flex-direction: column;

    // 垂直居中关键：使用 margin auto
    margin: auto 0;

    .tab-item {
      height: 60px;
      // 设置从左到右的浅蓝色到透明的渐变背景
      background: linear-gradient(
        90deg,
        rgba(95, 199, 255, 0.2) 0%,
        rgba(95, 199, 255, 0) 100%
      );
      margin: 5px 10px 5px 10px;
      //   border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px;
      cursor: pointer;
      transition: background-color 0.3s;
      position: relative;
      // 添加警告状态样式
      &.warning {
        background: linear-gradient(
          90deg,
          rgba(255, 0, 0, 0.2) 0%,
          /* 淡红色 */ rgba(255, 0, 0, 0.05) 100%
        );

        // &:hover {
        //   background-color: rgba(255, 0, 0, 0.1); /* 悬停时加深 */
        // }

        // &.active {
        //   background: linear-gradient(
        //     90deg,
        //     rgba(255, 0, 0, 0.3) 0%,
        //     /* 淡红色 */ rgba(255, 0, 0, 0.1) 100%
        //   );
        // }
      }
      &:hover {
        background-color: rgba(68, 68, 68, 0.7);
      }

      &.active {
        background: url("./assets/img/tabbg.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;

        // 选中时添加上边框渐变
        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          // 从左到右逐渐消失的渐变边框
          background: linear-gradient(
            90deg,
            #5fc7ff 0%,
            rgba(95, 199, 255, 0) 100%
          );
        }

        // 选中时添加下边框渐变
        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          // 从左到右逐渐消失的渐变边框
          background: linear-gradient(
            90deg,
            #5fc7ff 0%,
            rgba(95, 199, 255, 0) 100%
          );
        }

        // 选中时添加左边框（纯色）
        border-left: 2px solid #5fc7ff;
        // 调整border-radius以适应左边框
        border-radius: 0 4px 4px 0;

        .tab-label {
          color: #5fc7ff;
        }
      }

      .tab-label {
        color: #fff;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .arrow-icon {
        width: 28px;
        height: 28px;
        flex-shrink: 0;
      }
      // 添加异常图标样式
      .warning-icon {
        width: 14px;
        height: 14px;
        position: absolute;
        top: -5px;
        right: 0px;
        z-index: 2;
        background-color: #2e0d0d; // 红色背景
        border-radius: 50%; // 圆形背景
        box-sizing: content-box;
        padding: 3px;
      }
    }
  }
}
.g6-node-tooltip {
  .tooltip-title {
    font-weight: bold;
    margin-bottom: 8px;
    color: #5fc7ff;
    border-bottom: 1px solid #5fc7ff;
    padding-bottom: 4px;
  }

  .tooltip-item {
    padding: 20px 0;
    margin: 4px 0;
    display: flex;
    justify-content: space-between;

    .item-name {
      margin-right: 10px;
      color: #ffffff;
    }

    .item-value {
      font-weight: bold;
    }
    .warning {
      color: #ff4d4f !important; // 红色警告色
    }
  }
}

// 全局样式确保提示框不会被其他元素遮挡
:global(.g6-node-tooltip) {
  z-index: 9999 !important;
}

// 添加更通用的警告样式
.warning {
  color: #ff4d4f !important;
}
</style>
