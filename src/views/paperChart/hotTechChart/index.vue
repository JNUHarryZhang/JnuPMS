<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import echarts from 'echarts'
  import { getHotTechnology } from "@/api/paper/paperInfo/paper";

  export default {
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '350px'
      },
      autoResize: {
        type: Boolean,
        default: true
      },
      chartData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        chart: null,
        years: [],
        hotTechData: []
      }
    },
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart();
      })
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose();
      this.chart = null
    },
    methods: {

      getTopTechnology() {
        return getHotTechnology().then(
          response => {
            this.hotTechData = response.data;
            this.years = response.years;
            return Promise.resolve();
          });
      },

      async initChart() {

        await this.getTopTechnology();

        this.chart = echarts.init(this.$el, 'hotTechChart');
        this.setOptions(this.chartData)
      },
      setOptions({ expectedData, actualData } = {}) {
        this.chart.setOption({
          title: {
            text: '热门技术曲线趋势图',
          },
          xAxis: {
            data: this.years,
            boundaryGap: false,
            axisTick: {
              show: false
            }
          },
          grid: {
            left: 10,
            right: 10,
            bottom: 20,
            top: 30,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            padding: [5, 10]
          },
          yAxis: {
            axisTick: {
              show: false
            }
          },
          legend: {
            data: this.years,
          },
          series: [{
            name: 'java', itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: expectedData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
            {
              name: 'jsp',
              smooth: true,
              type: 'line',
              itemStyle: {
                normal: {
                  color: '#3888fa',
                  lineStyle: {
                    color: '#3888fa',
                    width: 2
                  },
                  areaStyle: {
                    color: '#f3f8ff'
                  }
                }
              },
              data: actualData,
              animationDuration: 2800,
              animationEasing: 'quadraticOut'
            }]
        })
      }
    }
  }
</script>
