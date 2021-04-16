<template>
    <div class="popularize-box">
        <menu-navbar data="tuiguang"></menu-navbar>
        <el-row class="statistics">
            <div class="consume">
                <div class="left">
                    <img class="statistics-img" src="~@/assets/img/home/dsp-xiaofei.png">
                    <p class="font01">&nbsp;&nbsp;今日账户消费（元）</p>
                </div>
                <div class="right">
                    <p class="font02">{{todayCost}}</p>
                </div>
            </div>
            <div class="advertisement">
                <div class="left">
                    <img class="statistics-img" src="~@/assets/img/home/dsp-tongji.png">
                    <p class="font01">&nbsp;&nbsp;广告统计</p>
                </div>
                <div class="right">
                    <span class="font03">广告创意数：</span>
                    <span class="font04">{{ideaNum}}</span>
                    <span class="font03">有效创意数：</span>
                    <span class="font04">{{ideaNum}}</span>
                </div>
            </div>
        </el-row>
        <el-row class="table">
            <el-row class="condition">
                <div class="condition-left">
                    <el-button class="add-button" @click="toAddPage">+ 新建创意</el-button>
                    <el-select v-model="modifyStateValue" size="mini" class="modify-state" placeholder="批量修改状态" @change="handleBatchChangeStatus">
                        <el-option label="启动" value=1></el-option>
                        <el-option label="暂停" value=0></el-option>
                    </el-select>
                    <el-button class="modify-price"  size="mini" @click="HandleBatchChangePrice" v-show="false">批量修改出价</el-button>
                    <span class="tip">备注：创意数据每15分钟更新一次</span>
                </div>

                <div class="condition-right">
                    <el-input v-model="inputName" size="mini" placeholder="创意名称" class="input-name"></el-input>
                    <el-select v-model="stateValue" size="mini" placeholder="全部状态" class="select-state">
                        <el-option label="全部状态" value=0></el-option>
                        <el-option label="启动" value=1></el-option>
                        <el-option label="暂停" value=2></el-option>
                        <el-option label="余额不足" value=4></el-option>
                    </el-select>
                    <el-date-picker
                            class="data-picker"
                            size="mini"
                            v-model="dateValue"
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            @change="dateChange"
                            :picker-options="pickerOptions">
                    </el-date-picker>
                </div>


            </el-row>
            <el-row class="table-data">
                <el-table
                        ref="ideaTable"
                        :data="ideaTableData"
                        tooltip-effect="dark"
                        style="width: 100%"
                        size="small"
                        :default-sort = "{prop: 'creatDate', order: 'descending'}"
                        show-summary
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection">
                    </el-table-column>
                    <el-table-column label="创意名称">
                        <template slot-scope="scope">
                            <span style="margin-right:3px" >{{ scope.row.ideaName }}</span>
                            <div style="cursor: pointer;display: inline-block" @click="editIdeaName(scope.row)">
                                <icon-svg name="edit"></icon-svg>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="投放">
                        <template slot-scope="scope">
                            <el-switch
                                    v-model="scope.row.ifPut"
                                    active-color="#3E8EF7"
                                    inactive-color="#dcdfe6"
                                    @change="handleSwitchChange(scope.row)">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="出价">
                        <template slot-scope="scope">
                            <span style="margin-right:3px">{{ scope.row.price }}</span>
                            <div style="cursor: pointer;display: inline-block" @click="editPrice(scope.row)">
                                <icon-svg name="edit"></icon-svg>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="exposure"
                            label="曝光量"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            prop="clicks"
                            label="点击量"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            prop="clickRate"
                            label="点击率"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            prop="clickPrice"
                            label="点击单价">
                    </el-table-column>
                    <el-table-column
                            prop="activate"
                            label="激活量"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            prop="activateRate"
                            label="激活率"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            prop="activatePrice"
                            label="激活单价">
                    </el-table-column>
                    <el-table-column
                            prop="consume"
                            label="消费"
                            sortable>
                    </el-table-column>
                    <el-table-column
                            prop="creatDate"
                            label="创建日期"
                            sortable
                            width="200">
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            label="状态">
                    </el-table-column>
                    <el-table-column
                            prop="operate"
                            label="操作"
                            width="100">
                        <template slot-scope="scope">
                            <el-button type="text" class="edit-btn" @click="handleEdit(scope.row.ideaId)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>

            <el-dialog title="创意名称" :visible.sync="editIdeaNameVisible" center width="400px" top="250px">
                <el-input v-model="tempIdeaName" autocomplete="off"></el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editIdeaNameVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveNewIdeaName">确 定</el-button>
                </div>
            </el-dialog>

            <el-dialog title="创意出价" :visible.sync="editPriceVisible" center width="400px" top="250px">
                <el-form :model="editPriceForm" :rules="editPriceRules" ref="editPriceForm" label-width="80px">
                    <el-form-item label="创意出价" prop="tempPrice">
                        <!--<el-input v-model="editPriceForm.tempPrice" placeholder="不低于0.3元"></el-input>-->
                        <el-input v-model="editPriceForm.tempPrice" id="price"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editPriceVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveNewPrice">确 定</el-button>
                </div>
            </el-dialog>


        </el-row>
    </div>
</template>

<script>
  import menuNavbar from '@/views/common/menu.vue'
  export default {
    name: 'popularize',
    components:{menuNavbar},
    data: function () {
      return {
        // 今日消费
        todayCost: 0,
        // 创意数量
        ideaNum: 0,
        modifyStateValue: '',
        stateValue: '0',
        inputName: '',
        // 时间相关
        dateValue: [],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() >= Date.now();
          }
        },
        // 创意表格数据
        ideaTableData: [],
        multipleSelection: [],
        editIdeaNameVisible: false,
        editPriceVisible:false,
        tempIdeaName: '',
        edittingRow: '',
        balance:0,
        batchPrice:false,//是否是批量修改价格
        lowestPrice:'',
        editPriceForm:{
          tempPrice:''
        },
        editPriceRules: {
          tempPrice: [
            { required: true, message: '请输入创意出价', trigger: 'blur' },
            {pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '请输入正确价格'},
            // {pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0\.[3-9]([0-9])?$)/, message: '出价不低于0.3元'}
          ]
        },
      }
    },
    created () {
      this.initDateDefault()
      this.getBalance()
      this.getIdeaNum()
      this.getIdeaInfo()
    },
    methods: {
      // 获取用户创意数量
      getIdeaNum () {
        let _this = this
        let username = this.$cookie.get('username')
        this.$axios({
          url: '/addIdea/ideaNum',
          method: 'get',
          params: {
            username: username
          }
        }).then(res => {
          _this.ideaNum = res.data.data
        })
      },
      // 获取时间段内的创意数据
      getIdeaInfo () {
        let _this = this
        // _this.ideaTableData = []
        let time = new Date()
        let isToday = false
        let starttime = _this.dateValue[0]
        let endTime = _this.dateValue[1]
        if (endTime === _this.getTime(time)) {
          isToday = true
          time.setTime(time.getTime()-24*60*60*1000);
          endTime = _this.getTime(time)
        }
        let username = this.$cookie.get('username')
        this.$axios({
          url: '/addIdea/tableData',
          method: 'get',
          params: {
            username: username,
            starttime: starttime,
            endtime: endTime,
            isToday: isToday,
            searchIName: _this.inputName,
            status: _this.stateValue
          }
        }).then(res => {
          // console.log(res.data.data)
          for(let i = 0;i<res.data.data;i++){
            res.data.data[i].consume = parseFloat(res.data.data[i].consume).toFixed(2)
          }
          _this.ideaTableData = res.data.data
        })
      },
      // 生成默认一周的时间
      initDateDefault () {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
        end.setTime(end.getTime())
        let startTime = this.getTime(start)
        let endTime = this.getTime(end)
        // this.dateValue = [startTime,endTime]
        this.dateValue = [endTime,endTime]
      },
      getTime (time) {
        let year = time.getFullYear()
        let month = time.getMonth() + 1
        let day = time.getDate()
        return `${year}-${month < 10? '0'+month:month}-${day<10?'0'+day:day}`
      },
      // 日期选择改变
      dateChange (val) {
        this.getIdeaInfo()
      },
      toAddPage () {
        this.$router.push({name: 'addIdea'})
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
        // console.log(this.multipleSelection)
      },
      editIdeaName (row) {
        this.editIdeaNameVisible = true
        this.edittingRow = row
      },
      editPrice (row) {
        this.editPriceVisible = true
        this.edittingRow = row
        this.editPriceForm.tempPrice = row.price;
        this.getLowestPrice(row.appId)
      },
      getLowestPrice(value){
        this.$axios({
          url: '/appInfo/getAppCodeAndLstPrice',
          method: 'get',
          params: {
            'appId': value
          }
        }).then(({data}) => {
          if(!data.data){
            this.lowestPrice = 0.3    //待确认
          }else{
            if (!data.data.lowestPrice) {
              this.lowestPrice = 0.3    //待确认
            } else {
              this.lowestPrice = data.data.lowestPrice
            }
            let priceInput = document.getElementById('price')
            priceInput.setAttribute('placeholder','不低于'+this.lowestPrice+'元')
          }
        })
      },
      saveNewIdeaName () {
        this.edittingRow.ideaName = this.tempIdeaName//可删除？
        let ideaId = this.edittingRow.ideaId;
        let newIdeaName = this.tempIdeaName;
        this.$axios({
          url: '/addIdea/updateIdeaName',
          method: 'post',
          params: {
            'ideaName': newIdeaName,
            'ideaID':ideaId
          }
        }).then(({data}) => {
          if (data.code == 0) {
            const h = this.$createElement
            this.$message({
              showClose: true,
              message: h('span', null, '修改成功'),
              type: 'success',
              offset: 80,
              center: true,
              duration: 1500
            })
            // this.$router.push({name: 'popularize'})
            this.getIdeaInfo()
          } else {
            this.$message.error('修改失败，请稍后再试')
          }
        })
        this.tempIdeaName = ''
        this.editIdeaNameVisible = false
      },
      saveNewPrice () {
        let _this = this;
        this.$refs.editPriceForm.validate((valid) => {
          if (valid) {
            if(_this.editPriceForm.tempPrice < _this.lowestPrice){
              this.$confirm('出价不低于'+this.lowestPrice+'元', '', {
                confirmButtonText: '确定',
                showCancelButton:false,
                type: 'info'
              }).then(() => {
                _this.editPriceForm.tempPrice=''
                return;
              }).catch(() => {
                _this.editPriceForm.tempPrice=''
                return;
              });
            }else{
              let row = _this.multipleSelection;
              // this.edittingRow.price = this.editPriceForm.tempPrice;//可删除
              let newPrice = _this.editPriceForm.tempPrice;
              if(_this.batchPrice){
                for(let i=0;i<row.length;i++){
                  let tempRow = row[i];
                  _this.updateIdeaCost(newPrice,tempRow.ideaId);
                }
                _this.batchPrice = false;
                layui.use('layer',function(){
                  var layer = layui.layer
                  let layerIndex = layer.load(1)
                  setTimeout(function(){
                    _this.getIdeaInfo()
                    layer.close(layerIndex)
                  },500)
                })
                _this.getIdeaInfo()
              }else{
                let ideaId = _this.edittingRow.ideaId;
                _this.updateIdeaCost(newPrice,ideaId);
                layui.use('layer',function(){
                  var layer = layui.layer
                  let layerIndex = layer.load(1)
                  setTimeout(function(){
                    _this.getIdeaInfo()
                    layer.close(layerIndex)
                  },500)
                })
                _this.getIdeaInfo()
              }
              _this.editPriceVisible = false
              _this.editPriceForm.tempPrice = ''
            }
          }
        });
      },
      updateIdeaCost(newPrice,ideaId){
        this.$axios({
          url: '/addIdea/updateIdeaCost',
          method: 'post',
          params: {
            'ideaCost': newPrice,
            'ideaID':ideaId
          }
        }).then(({data}) => {
          if (data.code == 0) {
            const h = this.$createElement
            this.$message({
              showClose: true,
              message: h('span', null, '修改成功'),
              type: 'success',
              offset: 80,
              center: true,
              duration: 1500
            })
          } else {
            this.$message.error('修改失败，请稍后再试')
          }
        })
      },
      handleSwitchChange(row){
        let newPutStatus = row.ifPut;
        let ideaId = row.ideaId;
        let status = 1;
        // console.log('---b',this.balance)
        if(newPutStatus){
          if(this.balance < 0){
            status = 4;
          }else {
            status=1;
          }
        }else{
          status=2;
        }
        if(newPutStatus == false){
          this.$confirm('注意：点击创意关闭按钮，需要一个工作日后完全关闭，在此期间仍有消耗，请确认是否关闭？', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.updateIdeaPriceAndStatus(newPutStatus,status,ideaId);
          }).catch(() => {
            row.ifPut = !newPutStatus;
            return;
          });
        }else{
          this.updateIdeaPriceAndStatus(newPutStatus,status,ideaId);
        }
      },
      updateIdeaPriceAndStatus(newPutStatus,status,ideaId){
        this.$axios({
          url: '/addIdea/updateIdeaPriceAndStatus',
          method: 'post',
          params: {
            'isOpen':newPutStatus?'Y':'N',
            'status': status,
            'ideaID':ideaId
          }
        }).then(({data}) => {
          if (data.code == 0) {
            const h = this.$createElement
            this.$message({
              showClose: true,
              message: h('span', null, '修改成功'),
              type: 'success',
              offset: 80,
              center: true,
              duration: 1500
            })
          } else {
            row.ifPut = !newPutStatus;
            this.$message.error('修改失败，请稍后再试')
          }
        })
      },
      getBalance() {
        let _this = this
        let username = this.$cookie.get('username')
        this.$axios({
          url: '/analysis/userBalance',
          method: 'get',
          params: {
            username: username
          }
        }).then(res => {
          _this.balance = res.data.data.balance
          _this.todayCost = res.data.data.userCost
        })
      },
      handleEdit(ideaId){
        this.$router.push({name: 'editIdea',params:{'ideaId': ideaId}})
      },
      handleBatchChangeStatus(){
        let _this = this;
        let rows = _this.multipleSelection;
        if(this.multipleSelection.length==0){
          this.$alert('请选择要修改的创意', '', {
            confirmButtonText: '确定',
            callback: action => {
              this.modifyStateValue = '';
              return;
            }
          });
        }else{
          if(this.modifyStateValue == 0){
            this.$confirm('注意：点击创意关闭按钮，需要一个工作日后完全关闭，在此期间仍有消耗，请确认是否关闭？', '', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              for(let i=0;i<rows.length;i++){
                let tempRow = rows[i];
                _this.updateIdeaPriceAndStatus(false,2,tempRow.ideaId);
              }
              _this.modifyStateValue = '';
              layui.use('layer',function(){
                var layer = layui.layer
                let layerIndex = layer.load(1)
                setTimeout(function(){
                  _this.getIdeaInfo()
                  layer.close(layerIndex)
                },1000)
              })
            }).catch(() => {
              _this.modifyStateValue = '';
              return;
            });
          }else{
            for(let i=0;i<this.multipleSelection.length;i++){
              let tempRow = _this.multipleSelection[i];
              let status = 1;
              if(_this.balance<0){
                status = 4;
              }
              _this.updateIdeaPriceAndStatus(true,status,tempRow.ideaId);
            }
            _this.modifyStateValue = '';
            layui.use('layer',function(){
              var layer = layui.layer
              let layerIndex = layer.load(1)
              setTimeout(function(){
                _this.getIdeaInfo()
                layer.close(layerIndex)
              },1000)
            })
          }

        }
      },
      HandleBatchChangePrice(){
        if(this.multipleSelection.length==0){
          this.$alert('请选择要修改的创意', '', {
            confirmButtonText: '确定',
            callback: action => {
              this.modifyStateValue = '';
              return;
            }
          });
        }else {
          // this.editPriceForm.tempPrice = 0;
          this.batchPrice = true;
          this.editPriceVisible = true;
        }
      }
    },
    watch: {
      inputName (val) {
        this.getIdeaInfo()
      },
      stateValue (val) {
        this.getIdeaInfo()
      }
    }
  }
</script>

<style lang="scss" scoped>
    .popularize-box{
        background:#efefef;
        .statistics{
            height: 90px;
            box-shadow: 0 2px 20px rgba(0,0,0,.05);
            overflow: hidden;
            /*padding: 24px;*/
            margin-top: 7px;
            margin-left: 1%;
            width: 98%;
            .consume{
                height: 90px;
                width: 49.5%;
                margin-right: 5px;
                float: left;
                background-color: #fff;
            }
            .advertisement{
                height: 90px;
                width: 49.5%;
                float: right;
                background-color: #fff;

            }
            .left{
                float: left;
                width: 250px;
                padding-left: 20px;
                .statistics-img{
                    height: 50px;
                    margin-top: 20px;
                    float: left;
                }
                .font01{
                    font-size: 16px;
                    line-height: 90px;
                    color: #2b2d33;
                }
            }
            .right{
                float: right;
                .font02{
                    font-size: 30px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-wrap: normal;
                    color: #ca2b2b;
                    line-height: 90px;
                    margin-right: 30px;
                }
                .font03{
                    font-size: 14px;
                    line-height: 90px;
                    color: #2b2d33;
                }
                .font04{
                    font-size: 14px;
                    line-height: 90px;
                    color: #3a75ff;
                    margin-right: 30px;
                }
            }
        }
        .table{
            height: 500px;
            box-shadow: 0 2px 20px rgba(0,0,0,.05);
            overflow: auto;
            margin-top: 7px;
            margin-left: 1%;
            width: 98%;
            background: #ffffff;
            .condition{
                margin-top: 15px;
                .condition-left{
                    float: left;
                    margin-left: 20px;
                    .add-button{
                        background: #278cff;
                        color: #fff;
                        padding: 10px 29px;
                        border-radius: 0;
                        border: 0;
                        font-weight: 500;
                        margin-right: 10px;
                        &:hover{
                            background: #499cfb;
                        }

                    }
                    .modify-state{
                        width: 120px;
                        margin-right: 10px;
                    }
                    .modify-price{

                    }
                    .tip{
                        line-height: 28px;
                        margin-left: 5px;
                        color: rgba(0, 0, 0, 0.4);
                    }
                }

                .condition-right{
                    float: right;
                    margin-right: 30px;
                    .input-name{
                        width: 120px;
                        margin-right: 10px;
                    }
                    .select-state{
                        width: 100px;
                        margin-right: 10px;
                    }
                    .data-picker{
                        width: 230px;
                        margin-right: 10px;
                    }
                    .delete-select{
                        font-size: 12px !important;
                        font-weight: normal !important;
                        color: #000000 !important;
                    }
                }
            }
            .table-data{
                margin-top: 20px;
                .edit-btn,.delete-btn{
                    display: inline-block;
                }
            }
        }
    }

</style>
<style>
    .popularize-box .el-date-editor .el-range-separator{
        width: 25px !important;
    }
    .popularize-box .el-switch__label * {
        line-height: 1;
        font-size: 13px;
        display: inline-block;
    }
    .popularize-box .el-switch__label.is-active {
         color: #000000;
    }
    .popularize-box .el-table thead {
        color: #2b2d33 !important;
        font-size: 12px;
    }
    .popularize-box .table-data th {
        font-weight: normal;
    }
    .popularize-box .el-table-column--selection .cell {
         padding-right: 0px;
    }
    .popularize-box .table-data .el-table__footer-wrapper tbody td:nth-child(5) .cell{
        display: none;
    }

</style>
