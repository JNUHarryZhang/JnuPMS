<template>
  <div class="dashboard-editor-container">
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>
    <h3>论文题目词云图</h3>
    <el-row>
      <img v-bind:src=this.cloudImg />
    </el-row>
  </div>
</template>

<script>
import LineChart from './dashboard/LineChart';
import { getTechByYear, getCloud } from "@/api/paper/paperInfo/paper";

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161],
    actualData: [120, 82, 91]
  },
};

export default {
  name: 'Index',
  components: {
    LineChart,
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      cloudImg: process.env.VUE_APP_BASE_API + "/profile/test.png",
    }
  },
  mounted() {
    // this.getCloud();
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    getCloud() {
      getCloud().then(
        res => {
          this.cloudImg = res.msg;
        }
      );
    },
    getTechByYear() {
      getTechByYear().then(res => {
        if(res.code === 1) {
          this.yearList = res.data.years;
        } else {
          console.log("网络不好");
        }
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
