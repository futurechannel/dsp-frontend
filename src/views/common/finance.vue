<template>
    <div class="finace">
        <menu-navbar data="caiwu"></menu-navbar>
        <div class="home-card">
            <el-row class="table-title">
                <p>充值记录</p>
            </el-row>

            <el-table
                class="record-table"
                :data="tableData"
                border
                style="width: 800px">
              <el-table-column
                prop="username"
                label="用户名"
                width="">
              </el-table-column>
              <el-table-column
                prop="money"
                width=""
                label="充值金额(元)"
                sortable>
              </el-table-column>
              <el-table-column
                prop="saveDate"
                label="充值日期"
                width=""
                sortable>
              </el-table-column>
            </el-table>
      </div>
    </div>
</template>
<script>
  import menuNavbar from '@/views/common/menu.vue'
  export default {
    data(){
      return {
        tableData: []
      }
    },
    components:{menuNavbar},
    created () {
      let username = this.$cookie.get('username')
      // console.log(username)
      var _this = this
      this.$axios({
        url: '/user/money/list',
        method: 'get',
        params: {
          'userId': username
        }
      }).then(res => {
        _this.tableData = res.data.data
      })
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
      padding: 10px 24px 24px;
      margin-top: 7px;
      margin-left: 1%;
      width: 98%;
        .table-title{
            height: 50px;
            font-size: 20px;
            line-height: 20px;
            p{
                margin-top: 15px;
                margin-left: 5px;
            }
        }
        .record-table .cell{
            color: #303133;
            font-weight: normal;
        }
    }

</style>
