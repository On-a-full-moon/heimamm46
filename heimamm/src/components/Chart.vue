<template>
  <div class="aoutBox">
    <div class="toplist">
      <ul>
        <li>
          <span class="circle primary">{{ topData.increment_users }}</span>
          <span>今日新增用户</span>
        </li>
        <li>
          <span class="circle primary">{{ topData.total_users }}</span>
          <span>总用户量</span>
        </li>
        <li>
          <span class="circle warning">{{ topData.increment_questions }}</span>
          <span>新增试题</span>
        </li>
        <li>
          <span class="circle warning">{{ topData.total_questions }}</span>
          <span>总试题量</span>
        </li>
        <li>
          <span class="circle success">{{ topData.total_done_questions }}</span>
          <span>总刷题量</span>
        </li>
        <li>
          <span class="circle success">{{ topData.personal_questions }}</span>
          <span>人均刷题量</span>
        </li>
      </ul>
    </div>
    <div id="main"></div>
  </div>
</template>

<script>
import { httpPost } from "@/utils/http.js";
import Echarts from "echarts";
export default {
  data() {
    return {
      topData: [],
      option: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          right: 280,
          data: [],
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: true,
              //   textStyle: {
              //     fontSize: "30",
              //     fontWeight: "bold",
              //   },
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [],
          },
        ],
      },
    };
  },
  created() {
    this.GetTitle();
    this.GetStatistics();
  },
  methods: {
    GetTitle() {
      httpPost(`/data/title`)
        .then((res) => {
          // console.log(res);
          let { data, code } = res;
          if (code == 200) {
            this.topData = data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    GetStatistics() {
      httpPost(`/data/statistics`)
        .then((res) => {
          // console.log(res);
          let { data, code } = res;
          if (code == 200) {
            data.forEach((ele) => {
              this.option.legend.data.push(ele.name);
            });
            this.option.series[0].data = data;

            var myChart = Echarts.init(document.getElementById("main"));
            myChart.setOption(this.option);
            console.log(this.option.legend.data, this.option.series[0].data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    // 初始化echarts
    var myChart = Echarts.init(document.getElementById("main"));
    // 通过配置 渲染折线图
    myChart.setOption(this.option);
  },
  components: {},
};
</script>

<style scoped>
.aoutBox {
  width: 100%;
  height: 100%;
}
.toplist {
  width: 100%;
  height: 150px;
  border-radius: 5px;
  margin-bottom: 12px;
  background-color: #fff;
}
ul {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  justify-content: space-around;
  list-style: none;
}

li span {
  display: block;
  color: #737373;
  text-align: center;
  font-size: 16px;
}
li .circle {
  width: 99px;
  height: 99px;
  /* border: 2px solid orange; */
  border-radius: 50%;
  font-size: 35px;
  text-align: center;
  line-height: 99px;
}
.primary {
  color: #409efe;
  border-color: #409efe;
  border: 2px solid #409efe;
}
.warning {
  color: #f86137;
  border-color: #f86137;
  border: 2px solid #f86137;
}
.success {
  color: #70c58b;
  border-color: #70c58b;
  border: 2px solid #70c58b;
}

#main {
  background-color: #fff;
  width: 100%;
  height: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
</style>