<template>
    <div>
      <div id="mychart"></div>
    </div>
</template>
<script>
  export default {
    data(){
      return {
        chart: null
      }
    },
    props: ['ind', 'times', 'data', 'multiple', 'hour','width','height'],
    methods: {
      getMax: function(e) {
        return Math.max.apply(null, this.data[e])
      },
      getUnit: function(e) {
        return "rate" === e ? "{value}%" : null
      },
      generateOptions: function() {
        var t = this.data
        var e = this.ind
        return {
          color: ["rgba(81,148,235, 0.9)", "rgba(238,85,143, 0.9)"],
          grid: {
            top: "38px",
            left: "85px",
            right: "85px",
            bottom: "80px"
          },
          tooltip: {
            backgroundColor: "rgba(31,33,38,.8)",
            padding: 18,
            trigger: "axis",
            axisPointer: {
                type: "cross"
            },
            textStyle: {
                color: "rgba(255,255,255,.7)",
                fontSize: 14
            },
            extraCssText: "width: 240px;line-height: 36px"
          },
          toolbox: {
            feature: {
              dataView: {
                show: false,
                readOnly: !1
              },
              restore: {
                show: false
              },
              saveAsImage: {
                show: false
              }
            }
          },
          xAxis: [
            {
              type: "category",
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                fontSize: 14,
                margin: 30
              },
              data: this.times
            }
          ],
          yAxis: [
            {
              type: "value",
              position: "left",
              offset: -10,
              min: 0,
              max: t[0].length === 1 && t[1].length === 1 ? this.getMax(0)+10 :this.getMax(0),
              splitLine: {
                  lineStyle: {
                      color: "#000",
                      type: "dashed",
                      width: 2,
                      opacity: .1
                  }
              },
              axisLabel: {
                  fontSize: 14,
                  margin: 20,
                  formatter: this.getUnit(this.ind[0].type)
              },
              axisLine: {
                  show: false
              },
              axisTick: {
                  show: false
              }
            }, 
            {
              type: "value",
              position: "right",
              min: 0,
              max: this.getMax(1),
              splitLine: {
                  lineStyle: {
                      color: "#000",
                      type: "dashed",
                      width: 2,
                      opacity: .1
                  }
              },
              axisLabel: {
                  fontSize: 14,
                  margin: 20,
                  formatter: this.getUnit(this.ind[1].type)
              },
              axisLine: {
                  show: false
              },
              axisTick: {
                  show: false
              }
            }
          ],
          series: [
            {
              name: e[0].label,
              type:  "line",
              smooth: true,
              showSymbol: t[0].length === 1 && t[1].length === 1 ? true : false,
              symbolSize: 10,
              yAxisIndex: 0,
              lineStyle: {
                  width: 6,
                  shadowColor: "rgba(0, 0, 0, 0.08)",
                  shadowBlur: 10
              },
              data: t[0]
            }, 
            {
              name: e[1].label,
              type: "line",
              smooth: true,
              showSymbol: t[0].length === 1 && t[1].length === 1 ? true : false,
              symbolSize: 10,
              yAxisIndex: 1,
              lineStyle: {
                  width: 6,
                  shadowColor: "rgba(0, 0, 0, 0.08)",
                  shadowBlur: 10
              },
              data: t[1]
            }
          ]
        }
      },
    },
    mounted () {
      this.chart = echarts.init(document.getElementById('mychart'))
      this.chart.setOption(this.generateOptions())
    },
    watch: {
      data: function() {
        this.chart.setOption(this.generateOptions())
      },
      width: function() {
        this.chart.resize()
      }
    }
  }
</script>
<style>
    #mychart{
      width: 100%;
      height: 100%;
    }
</style>