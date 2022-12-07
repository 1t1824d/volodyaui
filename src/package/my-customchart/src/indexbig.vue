<template>
  <div class="chart"></div>
</template>
<script>
import { debounce } from "@/utils";
import Bus from "@/utils/bus.js";

export default {
  name: "MyCustomChartbig",
  props: ["itemChart","ToFixedData"],
  data() {
    return {
      autoResize: {
        type: Boolean,
        default: true,
      },
      chart: null,
      sidebarElm: null,
      chartData: {},
    };
  },
  watch: {
    itemChart: {
      handler(newName, oldName) {
        try {
          this.DrawChart(this.itemChart);
        } catch (error) {}
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.resetSizefun();
    // this.MutationObserverStyleFun();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    if (this.autoResize) {
      window.removeEventListener("resize", this.__resizeHandler);
    }

    this.sidebarElm &&
      this.sidebarElm.removeEventListener(
        "transitionend",
        this.sidebarResizeHandler
      );

    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    DrawChart(e) {
      if (this.chart) {
        this.chart = this.$echarts.init(this.$el, "macarons");
        this.chart.clear();
      }
      if (!!e.LineData.length) {
        let LegendArray = [];
        let LineTimeArray = e.LineTime;
        let SeriesArray = [];
        let MaxDecimal = e.MaxDecimal;
        let MinDecimal = e.MinDecimal;
        let MaxLarge = e.MaxLarge;
        let MinLarge = e.MinLarge;
        let NowTime = e.NowTime;
        let DispatchArray = [];
        let UpDownChartType = e.UpDownChartType;
        let DataZoomIsShow = e.DataZoomIsShow;
        let ChartTitleIsShow = e.ChartTitleIsShow;
        let UpDownAreaList = e.UpDownAreaList;
        let UpDownAreaColor = e.UpDownAreaColor;
        let UpDownAreaZIndex = e.UpDownAreaZIndex;
        e.LineData.map((ele, index) => {
          if (!ele.IsDispatch) {
            LegendArray.push(
              !!UpDownChartType &&
                (ele.LegendName == "上限" || ele.LegendName == "下限")
                ? ""
                : ele.LegendName
            );

            let LineData = [];
            ele.ChartLineList.map((el, i) => {
              LineData.push(el.Data);
            });
            // console.log("LineData", LineData);
            SeriesArray.push(
              ele.ChartType == "line"
                ? {
                    name: ele.LegendName,
                    type: ele.ChartType,
                    symbol: "none",
                    smooth: false,
                    smoothMonotone: "x",
                    id: `line${index}`,
                    data: LineData,
                    yAxisIndex: ele.OrderMagnitudeType,
                    itemStyle: {
                      color:
                        !!UpDownChartType &&
                        (ele.LegendName == "上限" || ele.LegendName == "下限")
                          ? "transparent"
                          : ele.LegendColor,
                    },
                    emphasis: {
                      itemStyle: {
                        color:
                          !!UpDownChartType &&
                          (ele.LegendName == "上限" || ele.LegendName == "下限")
                            ? "transparent"
                            : ele.LegendColor,
                      },
                    },

                    lineStyle: {
                      color:
                        !!UpDownChartType &&
                        (ele.LegendName == "上限" || ele.LegendName == "下限")
                          ? "transparent"
                          : ele.LegendColor,
                      width: 2,
                    },
                  }
                : {
                    name: ele.LegendName,
                    type: ele.ChartType,
                    symbol: "none",
                    id: `bar${index}`,
                    data: LineData,
                    yAxisIndex: ele.OrderMagnitudeType,
                    itemStyle: {
                      color: ele.LegendColor,
                    },
                    emphasis: {
                      itemStyle: {
                        color: ele.LegendColor,
                      },
                    },
                  }
            );
          } else {
            let DispatchMakeLineArray = [];
            DispatchArray = ele.ChartLineList;
            ele.ChartLineList.map((el, i) => {
              DispatchMakeLineArray.push({
                xAxis: el.Time,
                lineStyle: {
                  normal: {
                    color: el.Color,
                    type: "solid",
                    width: 2,
                  },
                },
                label: {
                  normal: {
                    formatter: "", //,el.Time,
                  },
                },
              });
            });
            /*
             */
            if (!!UpDownChartType) {
              let LineData = [];
              UpDownAreaList.map((ele, i) => {
                LineData.push([ele.Time, ele.Data]);
              });
              SeriesArray.push({
                name: "上下限色带",
                type: "custom",
                yAxisIndex: UpDownAreaZIndex,
                smooth: 1,
                renderItem: (params, api) => {
                  if (params.context.rendered) {
                    return;
                  }
                  params.context.rendered = true;
                  let points = [];
                  for (let i = 0; i < LineData.length; i++) {
                    points.push(api.coord(LineData[i]));
                  }
                  return {
                    type: "polygon",
                    // transition: ["shape"],
                    shape: {
                      points: points,
                      smooth: 1,
                    },
                    style: {
                      fill: UpDownAreaColor,
                      stroke: UpDownAreaColor,
                    },
                  };
                },
                clip: true,
                data: LineData,
                itemStyle: {
                  color: UpDownAreaColor,
                },
                emphasis: {
                  itemStyle: {
                    color: UpDownAreaColor,
                  },
                },
              });
            }
            LegendArray.push("上下限色带");
            /*  */
            let LineTimeDataArray = new Array(LineTimeArray.length).fill(
              MaxLarge
            );
            //  let LineTimeDataArray =[]

            // LineTimeArray.map((el,i)=>{
            //   if(ele.ChartLineList.find((value) => value.Time==el)){
            //     LineTimeDataArray.push(MaxLarge)
            //   }else{
            //      LineTimeDataArray.push("")
            //   }
            // })
            LegendArray.push("");
            // !!chartData.MaxLarge && !!chartData.MaxDecimal
            SeriesArray.push({
              name: "",
              type: "line",
              smooth: false,
              smoothMonotone: "x",
              symbol: "none",
              id: `linemakeline`,
              data: LineTimeDataArray,
              yAxisIndex: 0,
              itemStyle: {
                color: "transparent",
              },
              emphasis: {
                itemStyle: {
                  color: "transparent",
                },
              },

              lineStyle: {
                color: "transparent",
                width: 0,
              },
              markLine: {
                silent: true,
                symbol: "none",

                label: {
                  formatter: function (val) {
                    return (val.value = "");
                  },
                },
                data: [
                  ...DispatchMakeLineArray,
                  {
                    xAxis: NowTime,
                    lineStyle: {
                      normal: {
                        color: "red",
                        type: "dashed",
                        //width: 6
                      },
                    },
                    label: {
                      normal: {
                        formatter: "",
                      },
                    },
                  },
                ],
              },
            });
          }
        });

        //  console.log("LineTimeDataArray", LineTimeDataArray);
        var a = {
          LegendArray,
          LineTimeArray,
          SeriesArray,
          MaxDecimal,
          MinDecimal,
          MaxLarge,
          MinLarge,
          DispatchArray,
          DataZoomIsShow,
        };
        this.chartData = a;
        this.$nextTick(() => {
          this.initChart();
        });
      } else {
        this.chart = this.$echarts.init(this.$el, "macarons");
        this.chart.clear();
      }
    },
    initChart() {
      this.chart = this.$echarts.init(this.$el, "macarons");
      this.chart.clear();
      this.setOptions(this.chartData);
      this.chart.on("click", (e) => {
        if (!!this.chart) {
          console.log("dblclick双击事件", e, this.chartData);
        }
      });
    },

    setOptions(chartData) {
      this.chart.setOption({
        grid: [
          {
            left: 75,
            right: !!chartData.MaxLarge && !!chartData.MaxDecimal ? 35 : 15,
            top: 55,
            bottom: 30,
            backgroundColor: "#F0F0F0",
            show: true,
          },
        ],
        // title: [
        //   {
        //     text: "m³/h",
        //     left: 8,
        //     top: 15,
        //     textStyle: {
        //       color: "#222222",
        //       fontSize: 12,
        //     },
        //   },
        //   {
        //     text: "m",
        //     right: 20,
        //     top: 25,
        //     textStyle: {
        //       color: " #222222",
        //       fontSize: 12,
        //     },
        //   },
        // ],
        legend: {
          show: false,
          data: chartData.LegendArray.filter((value) => !!value),
          type: "scroll",
          width: "auto",
          left: "center",
          top: 5,
          bottom: 35,
          textStyle: {
            color: "#222222",
            fontSize: 18,
          },
        },
        tooltip: {
          trigger: "axis",
          confine: true,
          textStyle: {
            color: "#222222",
            fontSize: 18,
          },
          formatter: (params) => {
            // console.log("params", params);
            let res = "<div> <p> 时间：" + params[0].name + " </p> </div>";
            let IsHave = !!chartData.DispatchArray.find(
              (val) => val.Time == params[0].name
            );
            // console.log("IsHave",IsHave)
            // console.log("params[0].name",params[0].name)
            // console.log("chartData.DispatchArray",chartData.DispatchArray)
            if (IsHave) {
              res += "<div>" + "调度时刻" + ":" + params[0].name + "</div>";
            }
            for (var i = 0; i < params.length; i++) {
              if (
                params[i].seriesName == "" ||
                params[i].seriesName == "上下限色带"
              ) {
                res += "";
              } else {
                res +=
                  "<div>" +
                  params[i].marker +
                  params[i].seriesName +
                  ":" +
                  params[i].data +
                  "</div>"; /* m³/h */
              }
            }
            return res;
          },
        },

        xAxis: [
          {
            data: chartData.LineTimeArray,
            boundaryGap: false,
            axisPointer: {
              type: "line",
            },
            axisLabel: {
              inside: false,
              interval: 60,

              //rotate: 45,
              textStyle: {
                color: "#222222",
                fontSize: 18,
              },
              formatter: (value) => {
                return value.split(":")[0]; //this.$echarts.format.formatTime("h", value);
              },
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: "solid",
                color: "#E4E6E8",
                opacity: 0.5,
              },
            },
            minorSplitLine: {
              show: true,
              lineStyle: {
                type: "solid",
                color: "#E4E6E8",
                opacity: 0.5,
              },
            },
            z: 10,
          },
        ],
        yAxis:
          !!chartData.MaxLarge && !!chartData.MaxDecimal
            ? [
                {
                  type: "value",
                  max: chartData.MaxLarge,
                  min: chartData.MinLarge,
                  splitLine: {
                    show: true,
                    lineStyle: {
                      type: "solid",
                      color: "#E4E6E8",
                      opacity: 0.5,
                    },
                  },
                  minorSplitLine: {
                    show: true,
                    lineStyle: {
                      type: "solid",
                      color: "#E4E6E8",
                      opacity: 0.5,
                    },
                  },
                  axisLine: {
                    show: false,
                    lineStyle: {
                      color: "#222222",
                      opacity: 0,
                    },
                  },
                  axisTick: {
                    show: false,
                  },

                  axisLabel: {
                    show: true,
                    //formatter: '{value} m³/h',
                    textStyle: {
                      color: "#222222",
                      fontSize: 18,
                    },
                  },
                },
                {
                  type: "value",
                  max: chartData.MaxDecimal,
                  min: chartData.MinDecimal,
                  position: "right",
                  splitLine: {
                    show: false,
                    lineStyle: {
                      type: "solid",
                      color: "#222222",
                      opacity: 0.5,
                    },
                  },
                  axisLine: {
                    show: false,
                    lineStyle: {
                      color: "#222222",
                    },
                  },
                  axisTick: {
                    show: false,
                  },

                  axisLabel: {
                    show: true,
                    formatter: (value, index)=> {
                      return this.ToFixedData? Number(value).toFixed(this.ToFixedData):Number(value)
                    },
                    textStyle: {
                      color: "#222222",
                      fontSize: 18,
                    },
                  },
                },
              ]
            : !!chartData.MaxLarge
            ? [
                {
                  type: "value",
                  max: chartData.MaxLarge,
                  min: chartData.MinLarge,
                  splitLine: {
                    show: true,
                    lineStyle: {
                      type: "solid",
                      color: "#E4E6E8",
                      opacity: 0.5,
                    },
                  },
                  minorSplitLine: {
                    show: true,
                    lineStyle: {
                      type: "solid",
                      color: "#E4E6E8",
                      opacity: 0.5,
                    },
                  },
                  axisLine: {
                    show: false,
                    lineStyle: {
                      color: "#222222",
                      opacity: 0,
                    },
                  },
                  axisTick: {
                    show: false,
                  },

                  axisLabel: {
                    show: true,
                    //formatter: '{value} m³/h',
                    textStyle: {
                      color: "#222222",
                      fontSize: 18,
                    },
                  },
                },
              ]
            : !!chartData.MaxDecimal
            ? [
                {
                  type: "value",
                  max: chartData.MaxDecimal,
                  min: chartData.MinDecimal,
                  //position: "right",
                  splitLine: {
                    show: false,
                    lineStyle: {
                      type: "solid",
                      color: "#222222",
                      opacity: 0.5,
                    },
                  },
                  axisLine: {
                    show: false,
                    lineStyle: {
                      color: "#222222",
                    },
                  },
                  axisTick: {
                    show: false,
                  },

                  axisLabel: {
                    show: true,
                    formatter: (value, index)=> {
                      return this.ToFixedData? Number(value).toFixed(this.ToFixedData):Number(value)
                    },
                    textStyle: {
                      color: "#222222",
                      fontSize: 18,
                    },
                  },
                },
              ]
            : [],
        dataZoom: chartData.DataZoomIsShow
          ? [
              {
                type: "slider",
                realTime: false,
                start: 0,
                end: 100,
                bottom: 10,
                height: 22,
                handleIcon:
                  "path://M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
                handleSize: "120%",
                labelFormatter: function (value) {
                  return "";
                },
                xAxisIndex: [0],
                filterMode: "empty",
              },
              {
                type: "inside",
                start: 0,
                end: 100,
                bottom: 10,
                height: 22,
                xAxisIndex: [0],
                filterMode: "empty",
              },
            ]
          : null,
        series: chartData.SeriesArray,
      });
    },
    sidebarResizeHandler(e) {
      if (e.propertyName === "width") {
        this.__resizeHandler();
      }
    },
    //窗口改变执行方法
    resetSizefun() {
      if (this.autoResize) {
        this.__resizeHandler = debounce(() => {
          if (this.chart) {
            this.chart.resize();
          }
        }, 100);
        window.addEventListener("resize", this.__resizeHandler);
      }

      // 监听侧边栏的变化
      this.sidebarElm = document.getElementsByClassName("sidebar-container")[0];
      this.sidebarElm &&
        this.sidebarElm.addEventListener(
          "transitionend",
          this.sidebarResizeHandler
        );
    },
    //div--style样式变化
    MutationObserverStyleFun() {
      var observer = new MutationObserver((mutations, observer) => {
        mutations.forEach((mutation) => {
          // console.log(mutation);
          if (this.chart) {
            this.chart.resize();
          }
        });
      });
      var config = {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["style"],
      };
      var el = document.getElementsByClassName(
        "PipeNetworkDiagnosisPages_rightoutbox"
      )[0];
      observer.observe(el, config);
    },
  },
};
</script>
<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>



