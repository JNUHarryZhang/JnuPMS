<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts';
require('echarts/theme/macarons');
import resize from './mixins/resize';
import { getTechByYear } from "@/api/paper/paperInfo/paper";

export default {
  mixins: [resize],
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
      yearList: [],
      typeList: [],
      seriesList: [
        {
          name: '',
          itemStyle: {
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
          data: '',
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
      ],
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
    this.chart = null;
  },
  methods: {
    changeColor(num) {
      let colorList = [];
      let count = 0;
      for(let color = parseInt("0",16); color < parseInt("ffff00", 16); color+=parseInt("AA2",16)) {
        colorList.push("#"+color.toString(16));
        count+=1;
        if(count===num)
          break;
      }
      return colorList;
    },

    getTechByYear() {
      return getTechByYear().then(
        response => {
          this.yearList = response.data.years;
          let mapTypeData = response.data.typeList;
          let typeNum = 0;
          for(let key in response.data.typeList) {
            typeNum++;
            this.typeList.push(key);
          }

          const colorList = this.changeColor(typeNum);
          const typeList = this.typeList;
          // console.log(typeNum);
          console.log(colorList);
          // console.log(typeList);
          // console.log(mapTypeData);

          for(let i = 0; i < typeNum; i++) {
            let tmpItem = {
              name: '-',
              itemStyle: {
                normal: {
                  color: '#3',
                  lineStyle: {
                    color: '#3',
                    width: 2
                  }
                }
              },
              smooth: true,
              type: 'line',
              data: [],
              animationDuration: 2800,
              animationEasing: 'cubicInOut'
            };
            tmpItem.name = typeList[i];
            tmpItem.itemStyle.normal.color = colorList[i];
            tmpItem.data = mapTypeData[typeList[i]];
            tmpItem.itemStyle.normal.lineStyle.color = colorList[i];
            console.log(i, ": ", tmpItem);
            this.seriesList.push(tmpItem);
          }
          return Promise.resolve();
        });
    },

    async initChart() {
      await this.getTechByYear();

      this.chart = echarts.init(this.$el, 'macarons');
      this.setOptions(this.chartData);
    },

    setOptions() {
      this.chart.setOption({
        title: {
          text: '热门技术曲线图',
        },
        xAxis: {
          data: this.yearList,
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
          data: this.typeList,
        },
        series: this.seriesList,
      })
    }
  }
}
</script>
