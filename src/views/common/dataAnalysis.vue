<template>
    <div class="analysis">
        <menu-navbar data="shujufenxi"></menu-navbar>
      <el-row class="home-card">
        <el-col :span="24">
          <div class="condition">
            <el-select v-model="cyValue" placeholder="请选择" @change="cySelectChange">
              <el-option
                v-for="item in cyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
        </el-col>
      </el-row>
      <el-row class="home-card">
        <el-col :span="24" class="chart-area">
          <el-select v-model="leftZbValue" placeholder="请选择" class="left-select"
            @change="zbSelectChange">
            <el-option
              v-for="item in zbOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="rightZbValue" placeholder="请选择" class="right-select"
            style="float:right;" @change="zbSelectChange">
            <el-option
              v-for="item in zbOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <chart-data
          class="chart-box"
          :times="times"
          :data="data"
          :ind="ind"
          :hour="hour"
          :width="documentClientWidth"
          :height="documentClientHeight"
          :multiple="multiple">
          </chart-data>
        </el-col>
      </el-row>
      <el-row class="home-card" style="min-height:400px;">
        <div id="layui_table"></div>
      </el-row>
    </div>
</template>
<script>

import chartData from '@/views/common/chartData.vue'
import menuNavbar from '@/views/common/menu.vue'

  export default {
    data(){
      return {
        // 获取界面宽度
        documentClientWidth: 0,
        ind: [
          {'key':'clickRate','type':'number','label':'点击量'},
          {'key':'exposure','type':'number','label':'曝光量'}
        ],
        times: [],
        data: [[0],[0]],
        multiple: false,
        hour: false,
        // 可供选择的默认值
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
        // 创意下拉框
        cyOptions: [{
          value: 'all',
          label: '全部创意计划'
        }],
        cyValue: 'all',
        cyData: {},
        // 时间段
        dateValue: [],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() >= Date.now() - 8.64e7;
          }
        },
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
        // 表格数据
        tableData: [],
        tableObj: '',
        tableCheck: false
      }
    },
    components: {
      chartData: chartData,
      menuNavbar
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight },
        set (val) { this.$store.commit('common/updateDocumentClientHeight', val) }
      },
    },
    methods: {
      // 重置窗口可视高度
      resetDocumentClientHeight () {
        this.documentClientHeight = document.documentElement['clientHeight']
        window.onresize = () => {
          this.documentClientHeight = document.documentElement['clientHeight']
          this.documentClientWidth = window.innerWidth
        }
      },
      // 创意下拉框发生改变
      cySelectChange (val) {
        // 更新图表数据
        this.initData()
        // 更新表格数据
        if (val === 'all') {
          //如果选择全部创意
          this.tableObj.reload({data:this.tableData})
        } else {
          // 如果选择的单个创意
          let data = []
          for (let i = 0 ; i < this.tableData.length; i++) {
            if (this.tableData[i].iname === this.cyData[val].iname) {
              data.push(this.tableData[i])
            }
          }
          this.tableObj.reload({data:data})
        }
      },
      // 获取表格数据
      getTableData () {
        let _this = this
        let username = this.$cookie.get('username')
        this.$axios({
          url: '/analysis/tableData',
          method: 'get',
          params: {
            'username': username,
            'starttime': this.dateValue[0],
            'endtime': this.dateValue[1]
          }
        }).then(res => {
          let data = res.data.data
          _this.tableData = data
          // console.log(data)
          _this.initTable (data)
        })
      },
      // 生成表格
      initTable (data) {
        var _this = this
        layui.use('table', function(){
          var table = layui.table;
          _this.tableObj = table.render({
            elem: '#layui_table'
            ,toolbar: '#aaa'
            ,text: {
              none: '暂无数据'
            }
            ,defaultToolbar: ["filter","exports"]
            ,cols: [[ //标题栏
              {field: 'date', title: '日期', minWidth: '110'}
              ,{field: 'iname', title: '创意名称', minWidth: '110'}
              ,{field: 'exposure', title: '曝光量', minWidth: '110'}
              ,{field: 'clickRate', title: '点击率', minWidth: '110'}  
              ,{field: 'click', title: '点击量', minWidth: '110'}
              ,{field: 'clickCost', title: '点击单价(元)', minWidth: '125'}
              ,{field: 'active', title: '激活量', minWidth: '110', sort: true}
              ,{field: 'activeRate', title: '激活率', minWidth: '110', sort: true}
              ,{field: 'activeCost', title: '激活单价(元)', minWidth: '150', sort: true}
              ,{field: 'cost', title: '消费(元)', minWidth: '120', sort: true}
            ]]
            ,data: data
            ,page: true
            ,even: true
            ,done: function(res, curr, count){
              var $ = layui.jquery
              var form = layui.form
              $($(".layui-table-tool-temp")[0]).html(`
                <div class="layui-form">
                  <input type="checkbox" title="过滤无消费数据" lay-skin="primary"
                   lay-filter="guolv" ${_this.tableCheck? 'checked' : ''}>
                </div>`)
              form.render()
              form.on('checkbox(guolv)', function(data){
                // console.log(data.elem.checked); //是否被选中，true或者false
                _this.tableCheck = data.elem.checked
                if (data.elem.checked) {
                  let data = []
                  for (let i = 0 ; i < _this.tableData.length; i++) {
                    if (_this.tableData[i].cost != 0) {
                      data.push(_this.tableData[i])
                    }
                  }
                  _this.tableObj.reload({data:data})
                } else {
                  _this.tableObj.reload({data:_this.tableData})
                }
              })
            }
          });
        });
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
      // 日期选择框值改变
      dateChange (val) {
        // console.log(val)
        let start = new Date(val[0])
        let end = new Date(val[1])
        this.createTime(start,end)
        this.initData()
        this.getTableData()
      },
      getTime (time) {
        let year = time.getFullYear()
        let month = time.getMonth() + 1
        let day = time.getDate()
        return `${year}-${month < 10? '0'+month:month}-${day<10?'0'+day:day}`
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
      // 获取表单对应的数据
      initData () {
        var _this = this
        if (this.cyValue === 'all' && this.cyOptions.length > 2) {// 创意数量在1个以上
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
            // console.log(res.data.data)
            let dataSetAry = []
            let result = res.data.data
            for (let i = 1;i < _this.cyOptions.length;i++) {
              let dataSetI = _this.initDataSet(result[_this.cyOptions[i].value][0])
              dataSetAry.push(dataSetI)
            }
            // console.log(dataSetAry)
            _this.dataSet = dataSetAry[0]
            for (let j = 1;j < dataSetAry.length;j++) {
              for (let k = 0;k < _this.times.length;k++) {
                _this.dataSet.exposure[k] = _this.dataSet.exposure[k]+dataSetAry[j].exposure[k]
                _this.dataSet.cost[k] = parseFloat(_this.dataSet.cost[k])+parseFloat(dataSetAry[j].cost[k])
                _this.dataSet.clickRate[k] = _this.dataSet.clickRate[k]+dataSetAry[j].clickRate[k]
                _this.dataSet.download[k] = _this.dataSet.download[k]+dataSetAry[j].download[k]
              }
            }
            _this.zbSelectChange (0)
          })
        } else if (this.cyOptions.length === 2) {// 创意数量只有1个
          let cyvalue = this.cyValue === 'all' ? this.cyOptions[1].value : this.cyValue
          // 如果是单个创意
          this.$axios({
            url: '/analysis/data',
            method: 'get',
            params: {
              idea_id: cyvalue,
              advert_code: this.cyData[cyvalue].advertCode,
              createDate: this.cyData[cyvalue].createDate,
              app_code: this.cyData[cyvalue].appCode,
              starttime: this.dateValue[0],
              endtime: this.dateValue[1]
            }
          }).then(res => {
            let DataSet = _this.initDataSet(res.data.data[0])
            _this.dataSet = DataSet
            _this.zbSelectChange (0)
          })
        } else {// 创意数量为0
          _this.setZeroDataSet()
        }

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
            _this.cyData[data[i].idea] = data[i]
          }
          _this.initData()
        })
      }
    },
    created () {
      this.initCy()
      this.initDateDefault()
    },
    mounted () {
      this.resetDocumentClientHeight()
      this.getTableData()
    }
  }
</script>
<style lang="scss">
    body{
      background:#EFEFEF;
    }
    .home-card{
      box-shadow: 0 2px 20px rgba(0,0,0,.05);
      border-radius: 4px;
      background-color: #fff;
      overflow: hidden;
      padding: 24px;
      margin-top: 7px;
      margin-left:1%;
      width: 98%;
    }
    .condition {
        height: 35px;
        .date-picker {
            width: 250px;
            margin-left: 30px;
        }
    }
    .chart-area{
        .left-select{
            margin-left: 30px;
            width: 150px;
        }
        .right-select{
            margin-right: 30px;
            width: 150px;
        }
        .chart-box{
            height: 450px;
            border:1px solid #dddddd;
            margin: 20px 30px 15px 30px;
        }

    }

</style>
<style>
    .analysis .el-date-editor .el-range-separator{
        width: 25px !important;
    }
</style>
