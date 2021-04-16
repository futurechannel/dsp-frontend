<template>
    <div class="home-box">
        <menu-navbar data="index"></menu-navbar>
        <el-row class="home-card">
            <el-row  style="height:90px;">
                <div class="home-money">
                    <img class="home-money-img" src="~@/assets/img/home/dsp-yue.png">
                    <div class="home-money-font">
                        <p class="font01">总余额(元)&nbsp;&nbsp;&nbsp;&nbsp;</p>
                        <p class="font02"> {{balance}}</p>
                    </div>
                </div>
                <div class="home-money">
                    <img class="home-money-img" src="~@/assets/img/home/dsp-xiaofei.png">
                    <div class="home-money-font">
                        <p class="font01">今日消费(元)</p>
                        <p class="font02">{{userCost}}</p>
                    </div>
                </div>
            </el-row>
        </el-row>

        <el-row class="home-card">
            <div class="home-overview">
                <el-row>
                    <span class="font03">账户概览</span>
                    <div class="data-picker-box">
                        <el-date-picker
                          class="date-picker"
                          v-model="dateValue"
                          type="daterange"
                          range-separator="至"
                          value-format="yyyy-MM-dd"
                          @change="dateChange"
                          :picker-options="pickerOptions">
                        </el-date-picker>
                    </div>
                </el-row>
                <el-row class="data">
                    <div class="data-box">
                        <p class="data-type-font">曝光量(次)</p>
                        <p class="data-type-number">{{totalExposure}}</p>
                    </div>
                    <div class="data-box">
                        <p class="data-type-font">点击量(次)</p>
                        <p class="data-type-number">{{totalClick}}</p>
                    </div>
                    <div class="data-box">
                        <p class="data-type-font">激活量(次)</p>
                        <p class="data-type-number">{{totalDownload}}</p>
                    </div>
                    <div class="data-box">
                        <p class="data-type-font">消费金额(元)</p>
                        <p class="data-type-number">{{totalCost}}</p>
                    </div>
                </el-row>
                <el-row class="echart-condition">
                    <div class="condition01">
                        <el-select v-model="leftZbValue" placeholder="请选择" @change="zbSelectChange">
                            <el-option
                              v-for="item in zbOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="condition02">
                        <el-select v-model="rightZbValue" placeholder="请选择" @change="zbSelectChange">
                            <el-option
                                    v-for="item in zbOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-row>
                <chart-data
                    class="chart-box"
                    :times="times"
                    :data="data"
                    :ind="ind"
                    :hour="hour"
                    :multiple="multiple"
                    :width="documentClientWidth"
                    :height="documentClientHeight">
                </chart-data>

            </div>

        </el-row>
    </div>
</template>

<script>
  import menuNavbar from '@/views/common/menu.vue'
  import chartData from '@/views/common/chartData.vue'
  export default {
    name: 'home',
    components: {
      chartData: chartData,
      menuNavbar
    },
    created () {
      this.getUserBalance()
      this.initCy ()
      this.initDateDefault()
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight },
        set (val) { this.$store.commit('common/updateDocumentClientHeight', val) }
      },
    },
    mounted () {
      this.resetDocumentClientHeight()
    },
    data () {
      return {
        // 获取界面宽度
        documentClientWidth: 0,
        // 用户概览数据
        totalExposure: 0,
        totalClick: 0,
        totalDownload: 0,
        totalCost: 0,
        userCost: 0,
        balance: 0,
        // 时间段
        dateValue: [],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() >= Date.now() - 8.64e7;
          }
        },
        // 图默认值
        dataSet: {
          exposure: [],
          clickRate: [],
          download: [],
          cost: []
        },
        selectSet: {
          exposure: {
            value: 'exposure',
            type: 'number',
            index: 1,
            label: '曝光量'
          },
          clickRate: {
            value: 'clickRate',
            type: 'number',
            index: 0,
            label: '点击量'
          },
          download: {
            value: 'download',
            type: 'number',
            index: 2,
            label: '激活量'
          },
          cost: {
            value: 'cost',
            type: 'price',
            index: 3,
            label: '消费（元）'
          }
        },
        cyOptions: [{
          value: 'all',
          label: '全部创意计划'
        }],
        // 图标左右下拉框
        zbOptions: [
          {
            value: 'exposure',
            label: '曝光量'
          }, {
            value: 'clickRate',
            label: '点击量'
          }, {
            value: 'download',
            label: '激活量'
          }, {
            value: 'cost',
            label: '消费（元）'
          }
        ],
        leftZbValue: 'clickRate',
        rightZbValue: 'exposure',
        ind: [
          {'key':'clickRate','type':'number','label':'点击量'},
          {'key':'exposure','type':'number','label':'曝光量'}
        ],
        times: [],
        data: [[0],[0]],
        multiple: false,
        hour: false
      }
    },
    methods:{
      // 重置窗口可视高度
      resetDocumentClientHeight () {
        this.documentClientHeight = document.documentElement['clientHeight']
        window.onresize = () => {
          this.documentClientHeight = document.documentElement['clientHeight']
          this.documentClientWidth = window.innerWidth
        }
      },
      // 获取用户余额与今日消费
      getUserBalance () {
        let _this = this
        let username = this.$cookie.get('username')
        this.$axios({
          url: '/analysis/userBalance',
          method: 'get',
          params: {
            username: username,
          }
        }).then(res => {
          _this.balance = res.data.data.balance
          _this.userCost = res.data.data.userCost
        })
      },
      // 初始化创意
      initCy () {
        let username = this.$cookie.get('username')
        var _this = this
        this.$axios({
          url: '/analysis/userIdea',
          method: 'get',
          params: {
            'username': username
          }
        }).then(res => {
          let data = res.data.data
          for (let i = 0; i < data.length; i++){
            _this.cyOptions.push({
              label: data[i].iname,
              value: data[i].idea
            })
          }
          _this.initData()
        })
      },
      getTime (time) {
        let year = time.getFullYear()
        let month = time.getMonth() + 1
        let day = time.getDate()
        return `${year}-${month < 10? '0'+month:month}-${day<10?'0'+day:day}`
      },
      // 生成默认一周的时间
      initDateDefault () {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
        let startTime = this.getTime(start)
        let endTime = this.getTime(end)
        this.dateValue = [startTime,endTime]
        this.createTime(start,end);
      },
      // 根据收尾计算内部时间
      createTime (start, end) {
        let times = [];
        let i = (end-start) / (3600 * 1000 * 24)
        times.push(this.getTime(start))
        for (let j=0;j < i; j++) {
          start.setTime(start.getTime() + 3600 * 1000 * 24)
          let timeStr = this.getTime(start)
          times.push(timeStr)
        }
        this.times = times
      },
      // 给空数据
      setZeroDataSet () {
        let start = new Date(this.dateValue[0])
        let end = new Date(this.dateValue[1])
        let i = (end-start) / (3600 * 1000 * 24)
        for (let j=0;j < i; j++) {
          this.dataSet.exposure.push(0)
          this.dataSet.cost.push(0)
          this.dataSet.clickRate.push(0)
          this.dataSet.download.push(0)
        }
      },
      // 日期选择框值改变
      dateChange (val) {
        // console.log(val)
        let start = new Date(val[0])
        let end = new Date(val[1])
        this.createTime(start,end)
        this.initData()
      },
      // 计算用户概览
      setTotalValue () {
        let exposure = 0
        let click = 0
        let download = 0
        let cost = 0
        for (let i = 0; i < this.dataSet.exposure.length; i++) {
          exposure += this.dataSet.exposure[i]
          click += this.dataSet.clickRate[i]
          download += this.dataSet.download[i]
          cost += parseFloat(this.dataSet.cost[i])
        }
        this.totalCost = cost.toFixed(2)
        this.totalDownload = download
        this.totalClick = click
        this.totalExposure = exposure
      },
      // 获取表单对应的数据
      initData () {
        var _this = this
        // 如果是全部创意
        let username = this.$cookie.get('username')
        this.$axios({
          url: '/analysis/allData',
          method: 'get',
          params: {
            username: username,
            starttime: this.dateValue[0],
            endtime: this.dateValue[1]
          }
        }).then(res => {
          let dataSetAry = []
          let result = res.data.data
          for (let i = 1;i < _this.cyOptions.length;i++) {
            let dataSetI = _this.initDataSet(result[_this.cyOptions[i].value][0])
            dataSetAry.push(dataSetI)
          }
          if (dataSetAry.length === 0) {
            _this.setZeroDataSet()
          } else {
            _this.dataSet = dataSetAry[0]
            for (let j = 1;j < dataSetAry.length;j++) {
              for (let k = 0;k < _this.times.length;k++) {
                _this.dataSet.exposure[k] = _this.dataSet.exposure[k]+dataSetAry[j].exposure[k]
                _this.dataSet.cost[k] = parseFloat(_this.dataSet.cost[k])+parseFloat(dataSetAry[j].cost[k])
                _this.dataSet.clickRate[k] = _this.dataSet.clickRate[k]+dataSetAry[j].clickRate[k]
                _this.dataSet.download[k] = _this.dataSet.download[k]+dataSetAry[j].download[k]
              }
            }
          }
          
          _this.setTotalValue()
          _this.zbSelectChange (0)
        })
      },
      // 指标下拉框值改变
      zbSelectChange (val) {
        let indData = []
        indData.push(this.selectSet[this.leftZbValue])
        indData.push(this.selectSet[this.rightZbValue])
        this.ind = indData
        let dataAry = []
        dataAry.push(this.dataSet[this.leftZbValue])
        dataAry.push(this.dataSet[this.rightZbValue])
        this.data = dataAry
      },
      // 生成dataSet
      initDataSet (data) {
        let dataSet = {
          exposure: [],
          clickRate: [],
          download: [],
          cost: []
        }
        // 获取历史曝光和消费
        let exposureResult = data.exposure
        // 获取历史点击和下载
        let clickResult = data.click
        for (let i = 0;i < this.times.length;i++) {
          let time = this.times[i]
          let exFlag = false
          for (let j = 0;j<exposureResult.length;j++){
            if (exposureResult[j].createDate === time) {
              exFlag = true
              dataSet.exposure.push(exposureResult[j].exposure)
              dataSet.cost.push(exposureResult[j].totalCost)
            }
          }
          if (exFlag === false) {
            dataSet.exposure.push(0)
            dataSet.cost.push(0)
          }
          let clFlag = false
          for (let k = 0;k<clickResult.length;k++){
            if (clickResult[k].bizDate === time) {
              clFlag = true
              dataSet.clickRate.push(clickResult[k].clickCnt)
              dataSet.download.push(clickResult[k].activeCnt)
            }
          }
          if (clFlag === false) {
            dataSet.clickRate.push(0)
            dataSet.download.push(0)
          }
        }
        return dataSet
      }
    }
  }
</script>

<style lang="scss" scoped>
    .home-box{
        background:#efefef;
        .home-card{
            box-shadow: 0 2px 20px rgba(0,0,0,.05);
            border-radius: 4px;
            background-color: #fff;
            overflow: hidden;
            /*padding: 24px;*/
            margin-top: 7px;
            margin-left: 1%;
            width: 98%;
        }
        .home-money{
            min-width: 155px;
            height: 90px;
            float: left;
            margin-left: 30px;
            margin-right: 20px;
            .home-money-img{
                height: 50px;
                margin-top: 20px;
                float: left;
            }
            .home-money-font{
                float: right;
                height: 70px;
                margin-top: 15px;
                .font01{
                    font-size: 14px;
                    line-height: 14px;
                    color: rgba(0,0,0,.4);
                    margin: 10px;
                }
                .font02{
                    font-size: 18px;
                    color: #2b2d33;
                    margin: 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-wrap: normal;
                }
            }
        }

        .home-overview{
            .font03{
                line-height: 38px;
                font-size: 16px;
                font-weight: 500;
                padding-left: 30px;
            }
            .data-picker-box{
                float: right;
                margin: 10px 30px 10px 10px;
                .data-picker{
                    width: 250px;
                }
            }
            .data{
                height:60px;
                /*background-color: #dfe6ee;*/
                .data-box{
                    height: 50px;
                    width: 160px;
                    float: left;
                    margin-left: 30px;
                    margin-right: 20px;
                    border: 1px solid rgba(0,0,0,.1);
                    padding-top: 5px;
                    padding-bottom: 5px;
                    .data-type-font{
                        font-size: 14px;
                        line-height: 14px;
                        color: rgba(0,0,0,.4);
                        margin: 0 0 0 10px;
                    }
                    .data-type-number{
                        font-size: 18px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        word-wrap: normal;
                        margin: 5px 0 0 10px;
                        color: #ca2b2b
                    }

                }
            }
            .echart-condition{
                height: 40px;
                margin: 0 30px 0 30px;
                .condition01{
                    float:left;
                }
                .condition02{
                    float: right;
                }
            }
            .chart-box{
                height: 450px;
                border:1px solid #dddddd;
                margin: 0 30px 15px 30px;
            }
        }
    }
</style>
<style>
    .home-box .el-date-editor .el-range-separator{
        width: 25px !important;
    }
</style>
