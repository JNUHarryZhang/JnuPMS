<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import { getTitleSource } from "@/api/paper/paperInfo/paper"
  import echarts from 'echarts'
  require('echarts/theme/macarons');

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
        default: '300px'
      }
    },
    data() {
      return {
        loading: false,
        chart: null,
        sourceData: []
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.initChart();
        console.log(this.sourceData);
      })
    },

    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {

      getSourceData() {
        return getTitleSource().then(
          response => {
            this.sourceData = response.data;
            return Promise.resolve();
          });
      },

      async initChart() {

        await this.getSourceData();
        this.chart = echarts.init(this.$el, 'teacherChart');

        this.chart.setOption({
          title: {
            text: '课题来源所占比重',
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '10',
            data: ['教师科研', '社会生产实践', '教学', '其他']
          },
          series: [
            {
              name: '课题来源所占比重',
              type: 'pie',
              roseType: 'radius',
              radius: [15, 95],
              center: ['50%', '38%'],
              data: this.sourceData,
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        })
      }
    }
  }
</script>
