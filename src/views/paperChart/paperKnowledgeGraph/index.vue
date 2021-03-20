<template>
  <div class="app-container">
    <div
      class="grid-content bg-purple-light"
      style="border: 1px solid #e4e7eb"
    >
      <div
        :class="className"
        id="drawChart"
        :style="{ height: height, width: width }"
      ></div>
    </div>
  </div>
</template>

<script>
  //导入echarts
  import echarts from "echarts";
  //设置图表大小
  import resize from "@/views/dashboard/mixins/resize";
  import {getKnowledgeGraphData} from "@/api/paper/paperInfo/paper";

  export default {
    name: "ColumnarChart",
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: "chart",
      },
      width: {
        type: String,
        default: "100%",
      },
      height: {
        type: String,
        default: "400px",
      },
      autoResize: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      // 遮罩层
      return {
        loading: false,
        techType: [],
        categories: [
          {
            "name": "HTML",
          },
          {
            "name": "Web",
          },
          {
            "name": "SVG",
          },
          {
            "name": "CSS",
          },
          {
            "name": "Other",
          }
        ],
        nodes: [
          {
            "name": "Web开发技术",
            "value": 10,
            "category": 1
          },
          {
            "name": "基于Web开发论文",
            "value": 11,
            "category": 1
          },
          {
            "name": "基于Web网站论文",
            "value": 12,
            "category": 1
          },
          {
            "name": "css",
            "value": 13,
            "category": 1
          }
        ],
        links: [
          {
            "source": 0,
            "target": 1
          },
          {
            "source": 0,
            "target": 2
          },
          {
            "source": 3,
            "target": 0
          }
        ]
      }
    },

    mounted() {
      this.drawChart();
    },
    methods: {
      getSourceData() {
        return getKnowledgeGraphData().then(
          response => {
            this.categories = response.data.categories;
            this.nodes = response.data.nodes;
            this.links = response.data.links;
            this.categories.forEach(v => this.techType.push(v.name));
            return Promise.resolve();
          });
      },

      async drawChart() {
        await this.getSourceData();
        const myChart = echarts.init(document.getElementById("drawChart"));
        myChart.setOption({
          tooltip : {
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: this.techType
          },
          series: [{
            type: 'graph',
            layout: 'force',
            animation: false,
            label: {
              show:true,
              position: 'right',
              formatter: '{b}'
            },
            draggable: true,
            data: this.nodes.map(function (node, idx) {
              node.id = idx;
              return node;
            }),
            categories: this.categories,
            force: {
              edgeLength: [150, 100],
              repulsion: 900,
              gravity: 0.2
            },
            edges: this.links
          }]
        });
      }
    }
  }
</script>
