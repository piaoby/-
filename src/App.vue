<template>
  <div id="panel">
    <div ref="container" id="com-container"></div>
  </div>
</template>
<script>
import CustomComponent from "../lib";
import "../lib/customNode.js"; // 导入自定义节点定义文件

// import CustomComponent from '../dist/index'

export default {
  name: "App",
  data() {
    return {
      container: null,
      com: null,
      tabRawData: {
        internal: {
          status: "normal", // 添加状态字段
          nodes: [
            {
              key: "firewall",
              text: "防火墙",
              status: "正常",
              combo: "A",
              source: "防火墙",
              detail: [
                {
                  name: "CPU利用率",
                  value: "11%",
                },
                {
                  name: "内存利用率",
                  value: "22%",
                },
              ],
              Alerts: null,
            },
            {
              key: "coreSwitch",
              text: "核心交换机",
              status: "正常",
              combo: "A",
              source: "交换机",
              detail: [
                {
                  name: "CPU利用率",
                  value: "15%",
                },
                {
                  name: "内存利用率",
                  value: "28%",
                },
              ],
              Alerts: null,
            },
            {
              key: "loadBalancer",
              text: "负载均衡器",
              status: "异常",
              combo: "B",
              source: "负载均衡器",
              detail: [
                {
                  name: "CPU利用率",
                  value: "75%",
                },
                {
                  name: "内存利用率",
                  value: "68%",
                },
              ],
              Alerts: "3",
            },
            {
              key: "group",
              text: "分组",
              status: "异常",
              combo: "B",
              source: "分组",
              detail: [
                {
                  name: "CPU利用率",
                  value: "75%",
                },
                {
                  name: "内存利用率",
                  value: "68%",
                },
              ],
              Alerts: "3",
            },
            {
              key: "esb",
              text: "ESB集群",
              status: "正常",
              combo: "B",
              source: "ESB集群信息",
              detail: [
                {
                  name: "CPU利用率",
                  value: "45%",
                },
                {
                  name: "内存利用率",
                  value: "38%",
                },
              ],
              Alerts: null,
            },
          ],
          edges: [
            {
              source: "firewall",
              target: "coreSwitch",
              status: "normal",
              name: "防火墙至核心交换机",
              detailValue: [
                { name: "带宽使用率", value: "45%" },
                { name: "延迟", value: "2ms" },
                { name: "丢包率", value: "0%" },
              ],
              hoverValue: [
                { name: "带宽使用率", value: "45%" },
                { name: "延迟", value: "2ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
            {
              source: "coreSwitch",
              target: "firewall",
              status: "normal",
              name: "核心交换机至防火墙",
              detailValue: [
                { name: "带宽使用率", value: "32%" },
                { name: "延迟", value: "2ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
            {
              source: "loadBalancer",
              target: "coreSwitch",
              status: "normal",
              name: "负载均衡器至核心交换机",
              detailValue: [
                { name: "带宽使用率", value: "68%" },
                { name: "延迟", value: "1ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
            {
              source: "coreSwitch",
              target: "loadBalancer",
              status: "normal",
              name: "核心交换机至负载均衡器",
              detailValue: [
                { name: "带宽使用率", value: "72%" },
                { name: "延迟", value: "1ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
            {
              source: "group",
              target: "coreSwitch",
              status: "warning",
              name: "分组至核心交换机",
              detailValue: [
                { name: "带宽使用率", value: "85%" },
                { name: "延迟", value: "5ms" },
                { name: "丢包率", value: "0.1%" },
              ],
            },
            {
              source: "coreSwitch",
              target: "group",
              status: "warning",
              name: "核心交换机至分组",
              detailValue: [
                { name: "带宽使用率", value: "78%" },
                { name: "延迟", value: "5ms" },
                { name: "丢包率", value: "0.1%" },
              ],
            },
            {
              source: "esb",
              target: "coreSwitch",
              status: "normal",
              name: "ESB集群至核心交换机",
              detailValue: [
                { name: "带宽使用率", value: "56%" },
                { name: "延迟", value: "3ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
            {
              source: "coreSwitch",
              target: "esb",
              status: "normal",
              name: "核心交换机至ESB集群",
              detailValue: [
                { name: "带宽使用率", value: "49%" },
                { name: "延迟", value: "3ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
          ],
          combos: [
            {
              id: "A",
            },
            {
              id: "B",
            },
          ],
          list: [
            {
              source: "firewall",
              listdetail: [
                {
                  name: "防火墙状态",
                  url: "http://firewall.com",
                  detailValue: [
                    { name: "状态1", value: "90%" },
                    { name: "状态2", value: "90%" },
                    { name: "状态3", value: "90%" },
                    { name: "状态4", value: "85%" }, // 添加状态4
                  ],
                },
              ],
            },
            {
              source: "coreSwitch",
              listdetail: [
                {
                  name: "交换机状态",
                  url: "http://switch.com",
                  detailValue: [
                    { name: "状态1", value: "95%" },
                    { name: "状态2", value: "85%" },
                    { name: "状态3", value: "75%" },
                    { name: "状态4", value: "80%" }, // 添加状态4
                  ],
                },
              ],
            },
            {
              source: "loadBalancer",
              listdetail: [
                {
                  name: "负载均衡",
                  url: "http://loadbalancer.com",
                  detailValue: [
                    { name: "状态1", value: "80%" },
                    { name: "状态2", value: "70%" },
                    { name: "状态3", value: "120%" },
                    { name: "状态4", value: "75%" }, // 添加状态4
                  ],
                },
              ],
            },
            {
              source: "group",
              listdetail: [
                {
                  name: "分组状态",
                  url: "http://group.com",
                  detailValue: [
                    { name: "状态1", value: "75%" },
                    { name: "状态2", value: "65%" },
                    { name: "状态3", value: "110%" },
                    { name: "状态4", value: "70%" }, // 添加状态4
                  ],
                },
              ],
            },
            {
              source: "esb",
              listdetail: [
                {
                  name: "ESB集群",
                  url: "http://esb.com",
                  detailValue: [
                    { name: "状态1", value: "85%" },
                    { name: "状态2", value: "75%" },
                    { name: "状态3", value: "90%" },
                    { name: "状态4", value: "1%" }, // 添加状态4
                  ],
                },
              ],
            },
          ],
        },
        external: {
          status: "warning", // 添加状态字段，设置为异常状态作为示例

          nodes: [
            {
              key: "firewall",
              text: "防火墙",
              status: "正常",
              combo: "A",
              source: "防火墙",
              detail: [
                {
                  name: "CPU利用率",
                  value: "11%",
                },
                {
                  name: "内存利用率",
                  value: "22%",
                },
              ],
              Alerts: null,
            },
            {
              key: "coreSwitch",
              text: "核心交换机",
              status: "正常",
              combo: "A",
              source: "交换机",
              detail: [
                {
                  name: "CPU利用率",
                  value: "15%",
                },
                {
                  name: "内存利用率",
                  value: "28%",
                },
              ],
              Alerts: null,
            },
            {
              key: "loadBalancer",
              text: "负载均衡器",
              status: "异常",
              combo: "B",
              source: "负载均衡器",
              detail: [
                {
                  name: "CPU利用率",
                  value: "75%",
                },
                {
                  name: "内存利用率",
                  value: "68%",
                },
              ],
              Alerts: "3",
            },
            {
              key: "group",
              text: "分组",
              status: "异常",
              combo: "B",
              source: "分组",
              detail: [
                {
                  name: "CPU利用率",
                  value: "75%",
                },
                {
                  name: "内存利用率",
                  value: "68%",
                },
              ],
              Alerts: "3",
            },
            {
              key: "esb",
              text: "ESB集群信息",
              status: "正常",
              combo: "B",
              source: "ESB集群信息",
              detail: [
                {
                  name: "CPU利用率",
                  value: "45%",
                },
                {
                  name: "内存利用率",
                  value: "38%",
                },
              ],
              Alerts: null,
            },
          ],
          edges: [
            {
              source: "firewall",
              target: "coreSwitch",
              status: "normal",
              name: "防火墙至核心交换机",
              detailValue: [
                { name: "带宽使用率", value: "45%" },
                { name: "延迟", value: "2ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
            {
              source: "coreSwitch",
              target: "firewall",
              status: "normal",
              name: "核心交换机至防火墙",
              detailValue: [
                { name: "带宽使用率", value: "32%" },
                { name: "延迟", value: "2ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
            {
              source: "loadBalancer",
              target: "coreSwitch",
              status: "normal",
              name: "负载均衡器至核心交换机",
              detailValue: [
                { name: "带宽使用率", value: "68%" },
                { name: "延迟", value: "1ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
            {
              source: "coreSwitch",
              target: "loadBalancer",
              status: "normal",
              name: "核心交换机至负载均衡器",
              detailValue: [
                { name: "带宽使用率", value: "72%" },
                { name: "延迟", value: "1ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
            {
              source: "group",
              target: "coreSwitch",
              status: "warning",
              name: "分组至核心交换机",
              detailValue: [
                { name: "带宽使用率", value: "85%" },
                { name: "延迟", value: "5ms" },
                { name: "丢包率", value: "0.1%" },
              ],
            },
            {
              source: "coreSwitch",
              target: "group",
              status: "warning",
              name: "核心交换机至分组",
              detailValue: [
                { name: "带宽使用率", value: "78%" },
                { name: "延迟", value: "5ms" },
                { name: "丢包率", value: "0.1%" },
              ],
            },
            {
              source: "esb",
              target: "coreSwitch",
              status: "normal",
              name: "ESB集群至核心交换机",
              detailValue: [
                { name: "带宽使用率", value: "56%" },
                { name: "延迟", value: "3ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
            {
              source: "coreSwitch",
              target: "esb",
              status: "normal",
              name: "核心交换机至ESB集群",
              detailValue: [
                { name: "带宽使用率", value: "49%" },
                { name: "延迟", value: "3ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
          ],
          combos: [
            {
              id: "A",
            },
            {
              id: "B",
            },
          ],
          list: [
            {
              source: "firewall",
              listdetail: [
                {
                  name: "防火墙状态",
                  url: "http://firewall.com",
                  detailValue: [
                    { name: "状态1", value: "90%" },
                    { name: "状态2", value: "90%" },
                    { name: "状态3", value: "90%" },
                    { name: "状态4", value: "85%" }, // 添加状态4
                  ],
                },
              ],
            },
            {
              source: "coreSwitch",
              listdetail: [
                {
                  name: "交换机状态",
                  url: "http://switch.com",
                  detailValue: [
                    { name: "状态1", value: "95%" },
                    { name: "状态2", value: "85%" },
                    { name: "状态3", value: "75%" },
                    { name: "状态4", value: "80%" }, // 添加状态4
                  ],
                },
              ],
            },
            {
              source: "loadBalancer",
              listdetail: [
                {
                  name: "负载均衡",
                  url: "http://loadbalancer.com",
                  detailValue: [
                    { name: "状态1", value: "80%" },
                    { name: "状态2", value: "70%" },
                    { name: "状态3", value: "120%" },
                    { name: "状态4", value: "75%" }, // 添加状态4
                  ],
                },
              ],
            },
            {
              source: "group",
              listdetail: [
                {
                  name: "分组状态",
                  url: "http://group.com",
                  detailValue: [
                    { name: "状态1", value: "75%" },
                    { name: "状态2", value: "65%" },
                    { name: "状态3", value: "110%" },
                    { name: "状态4", value: "70%" }, // 添加状态4
                  ],
                },
              ],
            },
            {
              source: "esb",
              listdetail: [
                {
                  name: "ESB集群",
                  url: "http://esb.com",
                  detailValue: [
                    { name: "状态1", value: "85%" },
                    { name: "状态2", value: "75%" },
                    { name: "状态3", value: "90%" },
                    { name: "状态4", value: "2" }, // 添加状态4
                  ],
                },
              ],
            },
          ],
        },
        internet: {
          status: "normal", // 添加状态字段

          nodes: [
            {
              key: "firewall",
              text: "防火墙",
              status: "正常",
              combo: "A",
              source: "防火墙",
              detail: [
                {
                  name: "CPU利用率",
                  value: "11%",
                },
                {
                  name: "内存利用率",
                  value: "22%",
                },
              ],
              Alerts: null,
            },
            {
              key: "coreSwitch",
              text: "核心交换机",
              status: "正常",
              combo: "A",
              source: "交换机",
              detail: [
                {
                  name: "CPU利用率",
                  value: "15%",
                },
                {
                  name: "内存利用率",
                  value: "28%",
                },
              ],
              Alerts: null,
            },
            {
              key: "loadBalancer",
              text: "负载均衡器",
              status: "异常",
              combo: "B",
              source: "负载均衡器",
              detail: [
                {
                  name: "CPU利用率",
                  value: "75%",
                },
                {
                  name: "内存利用率",
                  value: "68%",
                },
              ],
              Alerts: "3",
            },
            {
              key: "group",
              text: "分组",
              status: "异常",
              combo: "B",
              source: "分组",
              detail: [
                {
                  name: "CPU利用率",
                  value: "75%",
                },
                {
                  name: "内存利用率",
                  value: "68%",
                },
              ],
              Alerts: "3",
            },
            {
              key: "esb",
              text: "ESB集群",
              status: "正常",
              combo: "B",
              source: "ESB集群信息",
              detail: [
                {
                  name: "CPU利用率",
                  value: "45%",
                },
                {
                  name: "内存利用率",
                  value: "38%",
                },
              ],
              Alerts: null,
            },
          ],
          edges: [
            {
              source: "firewall",
              target: "coreSwitch",
              status: "normal",
              name: "防火墙至核心交换机",
              detailValue: [
                { name: "带宽使用率", value: "45%" },
                { name: "延迟", value: "2ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
            {
              source: "coreSwitch",
              target: "firewall",
              status: "normal",
              name: "核心交换机至防火墙",
              detailValue: [
                { name: "带宽使用率", value: "32%" },
                { name: "延迟", value: "2ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
            {
              source: "loadBalancer",
              target: "coreSwitch",
              status: "normal",
              name: "负载均衡器至核心交换机",
              detailValue: [
                { name: "带宽使用率", value: "68%" },
                { name: "延迟", value: "1ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
            {
              source: "coreSwitch",
              target: "loadBalancer",
              status: "normal",
              name: "核心交换机至负载均衡器",
              detailValue: [
                { name: "带宽使用率", value: "72%" },
                { name: "延迟", value: "1ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
            {
              source: "group",
              target: "coreSwitch",
              status: "warning",
              name: "分组至核心交换机",
              detailValue: [
                { name: "带宽使用率", value: "85%" },
                { name: "延迟", value: "5ms" },
                { name: "丢包率", value: "0.1%" },
              ],
            },
            {
              source: "coreSwitch",
              target: "group",
              status: "warning",
              name: "核心交换机至分组",
              detailValue: [
                { name: "带宽使用率", value: "78%" },
                { name: "延迟", value: "5ms" },
                { name: "丢包率", value: "0.1%" },
              ],
            },
            {
              source: "esb",
              target: "coreSwitch",
              status: "normal",
              name: "ESB集群至核心交换机",
              detailValue: [
                { name: "带宽使用率", value: "56%" },
                { name: "延迟", value: "3ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
            {
              source: "coreSwitch",
              target: "esb",
              status: "normal",
              name: "核心交换机至ESB集群",
              detailValue: [
                { name: "带宽使用率", value: "49%" },
                { name: "延迟", value: "3ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
          ],
          combos: [
            {
              id: "A",
            },
            {
              id: "B",
            },
          ],
          list: [
            {
              source: "firewall",
              listdetail: [
                {
                  name: "防火墙状态",
                  url: "http://firewall.com",
                  detailValue: [
                    { name: "状态1", value: "90%" },
                    { name: "状态2", value: "90%" },
                    { name: "状态3", value: "90%" },
                    { name: "状态4", value: "85%" }, // 添加状态4
                  ],
                },
              ],
            },
            {
              source: "coreSwitch",
              listdetail: [
                {
                  name: "交换机状态",
                  url: "http://switch.com",
                  detailValue: [
                    { name: "状态1", value: "95%" },
                    { name: "状态2", value: "85%" },
                    { name: "状态3", value: "75%" },
                    { name: "状态4", value: "80%" }, // 添加状态4
                  ],
                },
              ],
            },
            {
              source: "loadBalancer",
              listdetail: [
                {
                  name: "负载均衡",
                  url: "http://loadbalancer.com",
                  detailValue: [
                    { name: "状态1", value: "80%" },
                    { name: "状态2", value: "70%" },
                    { name: "状态3", value: "120%" },
                    { name: "状态4", value: "75%" }, // 添加状态4
                  ],
                },
              ],
            },
            {
              source: "group",
              listdetail: [
                {
                  name: "分组状态",
                  url: "http://group.com",
                  detailValue: [
                    { name: "状态1", value: "75%" },
                    { name: "状态2", value: "65%" },
                    { name: "状态3", value: "110%" },
                    { name: "状态4", value: "70%" }, // 添加状态4
                  ],
                },
              ],
            },
            {
              source: "esb",
              listdetail: [
                {
                  name: "ESB集群",
                  url: "http://esb.com",
                  detailValue: [
                    { name: "状态1", value: "85%" },
                    { name: "状态2", value: "75%" },
                    { name: "状态3", value: "90%" },
                    { name: "状态4", value: "3%" }, // 添加状态4
                  ],
                },
              ],
            },
          ],
        },
        transaction: {
          status: "normal", // 添加状态字段

          nodes: [
            {
              key: "firewall",
              text: "防火墙",
              status: "正常",
              combo: "A",
              source: "防火墙",
              detail: [
                {
                  name: "CPU利用率",
                  value: "11%",
                },
                {
                  name: "内存利用率",
                  value: "22%",
                },
              ],
              Alerts: null,
            },
            {
              key: "coreSwitch",
              text: "核心交换机",
              status: "正常",
              combo: "A",
              source: "交换机",
              detail: [
                {
                  name: "CPU利用率",
                  value: "15%",
                },
                {
                  name: "内存利用率",
                  value: "28%",
                },
              ],
              Alerts: null,
            },
            {
              key: "loadBalancer",
              text: "负载均衡器",
              status: "异常",
              combo: "B",
              source: "负载均衡器",
              detail: [
                {
                  name: "CPU利用率",
                  value: "75%",
                },
                {
                  name: "内存利用率",
                  value: "68%",
                },
              ],
              Alerts: "3",
            },
            {
              key: "group",
              text: "分组",
              status: "异常",
              combo: "B",
              source: "分组",
              detail: [
                {
                  name: "CPU利用率",
                  value: "75%",
                },
                {
                  name: "内存利用率",
                  value: "68%",
                },
              ],
              Alerts: "3",
            },
            {
              key: "esb",
              text: "ESB集群",
              status: "正常",
              combo: "B",
              source: "ESB集群信息",
              detail: [
                {
                  name: "CPU利用率",
                  value: "45%",
                },
                {
                  name: "内存利用率",
                  value: "38%",
                },
              ],
              Alerts: null,
            },
          ],
          edges: [
            {
              source: "firewall",
              target: "coreSwitch",
              status: "normal",
              name: "防火墙至核心交换机",
              detailValue: [
                { name: "带宽使用率", value: "45%" },
                { name: "延迟", value: "2ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
            {
              source: "coreSwitch",
              target: "firewall",
              status: "normal",
              name: "核心交换机至防火墙",
              detailValue: [
                { name: "带宽使用率", value: "32%" },
                { name: "延迟", value: "2ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
            {
              source: "loadBalancer",
              target: "coreSwitch",
              status: "normal",
              name: "负载均衡器至核心交换机",
              detailValue: [
                { name: "带宽使用率", value: "68%" },
                { name: "延迟", value: "1ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
            {
              source: "coreSwitch",
              target: "loadBalancer",
              status: "normal",
              name: "核心交换机至负载均衡器",
              detailValue: [
                { name: "带宽使用率", value: "72%" },
                { name: "延迟", value: "1ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
            {
              source: "group",
              target: "coreSwitch",
              status: "warning",
              name: "分组至核心交换机",
              detailValue: [
                { name: "带宽使用率", value: "85%" },
                { name: "延迟", value: "5ms" },
                { name: "丢包率", value: "0.1%" },
              ],
            },
            {
              source: "coreSwitch",
              target: "group",
              status: "warning",
              name: "核心交换机至分组",
              detailValue: [
                { name: "带宽使用率", value: "78%" },
                { name: "延迟", value: "5ms" },
                { name: "丢包率", value: "0.1%" },
              ],
            },
            {
              source: "esb",
              target: "coreSwitch",
              status: "normal",
              name: "ESB集群至核心交换机",
              detailValue: [
                { name: "带宽使用率", value: "56%" },
                { name: "延迟", value: "3ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
            {
              source: "coreSwitch",
              target: "esb",
              status: "normal",
              name: "核心交换机至ESB集群",
              detailValue: [
                { name: "带宽使用率", value: "49%" },
                { name: "延迟", value: "3ms" },
                { name: "丢包率", value: "0%" },
              ],
            },
          ],
          combos: [
            {
              id: "A",
            },
            {
              id: "B",
            },
          ],
          list: [
            {
              source: "firewall",
              listdetail: [
                {
                  name: "防火墙状态",
                  url: "http://firewall.com",
                  detailValue: [
                    { name: "状态1", value: "90%" },
                    { name: "状态2", value: "90%" },
                    { name: "状态3", value: "90%" },
                    { name: "状态4", value: "85%" }, // 添加状态4
                  ],
                },
              ],
            },
            {
              source: "coreSwitch",
              listdetail: [
                {
                  name: "交换机状态",
                  url: "http://switch.com",
                  detailValue: [
                    { name: "状态1", value: "95%" },
                    { name: "状态2", value: "85%" },
                    { name: "状态3", value: "75%" },
                    { name: "状态4", value: "80%" }, // 添加状态4
                  ],
                },
              ],
            },
            {
              source: "loadBalancer",
              listdetail: [
                {
                  name: "负载均衡",
                  url: "http://loadbalancer.com",
                  detailValue: [
                    { name: "状态1", value: "80%" },
                    { name: "状态2", value: "70%" },
                    { name: "状态3", value: "120%" },
                    { name: "状态4", value: "75%" }, // 添加状态4
                  ],
                },
              ],
            },
            {
              source: "group",
              listdetail: [
                {
                  name: "分组状态",
                  url: "http://group.com",
                  detailValue: [
                    { name: "状态1", value: "75%" },
                    { name: "状态2", value: "65%" },
                    { name: "状态3", value: "110%" },
                    { name: "状态4", value: "70%" }, // 添加状态4
                  ],
                },
              ],
            },
            {
              source: "esb",
              listdetail: [
                {
                  name: "ESB集群",
                  url: "http://esb.com",
                  detailValue: [
                    { name: "状态1", value: "85%" },
                    { name: "状态2", value: "75%" },
                    { name: "状态3", value: "90%" },
                    { name: "状态4", value: "4%" }, // 添加状态4
                  ],
                },
              ],
            },
          ],
        },
      },
    };
  },
  mounted() {
    this.com = new CustomComponent();
    this.com.init(this.$refs.container, {
      legend: {
        fontSize: 12,
        color: "#fff",
      },
      label: {
        show: false,
        color: "#ffffff",
        fontSize: 14,
        lineColor: "rgba(255, 255, 255, 0.45)",
      },
    });
    this.com.resize();
    this.com.setStyle("legend$color", "#ccc");
    this.com.setData(this.tabRawData);
  },
  methods: {},
};
</script>
<style lang="scss">
#panel {
  width: 90vw;
  height: 98vh;
  display: flex;
  align-items: center;
  justify-content: center;
  // 添加变换原点，确保缩放居中
  transform-origin: center center;
}
#com-container {
  width: 100%;
  height: 100%;
  background-color: #0b1421;
  // 确保容器可以正确应用变换
  transform-origin: center center;
}
</style>
