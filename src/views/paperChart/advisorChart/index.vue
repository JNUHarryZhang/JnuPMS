<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import { getTeacherSource } from "@/api/paper/paperInfo/paper"
  import echarts from 'echarts'

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
        // teacherNames: []
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
        return getTeacherSource().then(
          response => {
            this.sourceData = response.data;
            // this.teacherNames = response.teachers;
            return Promise.resolve();
          });
      },

      async initChart() {

        await this.getSourceData();
        this.chart = echarts.init(this.$el, 'advisorChart');

        this.chart.setOption({
          title: {
            text: '指导教师所占比例',
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '10',
            // data: this.teacherNames,
          },
          series: [
            {
              name: '指导教师所占比例',
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
