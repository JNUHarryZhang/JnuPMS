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
  import { getHotTechnology } from "@/api/paper/paperInfo/paper";

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
      loading: false
      techType: ['A']
      techNum: [12]

    },

    mounted() {
      this.drawChart();
    },
    methods: {
      getSourceData() {
        return getHotTechnology().then(
          response => {
            this.techType = response.data.techType;
            this.techNum = response.data.techNum;
            return Promise.resolve();
          });
      },

      async drawChart() {
        await this.getSourceData();
        const myChart = echarts.init(document.getElementById("drawChart"));
        myChart.setOption({
          title: {
            text: "历年热门技术统计图",
          },
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          xAxis: {
            name: '使用技术',
            type: 'category',
            data: this.techType,   // 技术类别的数据
            axisLabel:{
              textStyle:{
                fontSize: 12 // 让字体变小
              },
              rotate: -20,    // 字体倾斜30度
            },
          },
          yAxis: {
            type: 'value',
            name: '使用数量', // 论文使用该技术的数量
          },
          series: [{
            data: this.techNum,
            type: 'bar'
          }]
        });
      }
    }
  }
</script>
