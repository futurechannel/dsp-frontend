<template>
  <div>
    <el-container>
      <el-header class="mainHeader">
        <div class="logoBox">
            <img class="logo" src="~@/assets/img/login/logo_white.png">
        </div>
        <div class="userInfo" title="退出登录" @click="logout">
          <icon-svg name="yonghu" class="user-icon"></icon-svg>
          <p class="userName">{{username}}</p>
          <icon-svg name="logout" class="logout-icon"></icon-svg>
        </div>
      </el-header>
      <router-view></router-view>
    </el-container>
  </div>
</template>
<script>
export default {
  data () {
    return {
      username: ''
    }
  },
  created () {
    this.username = this.$cookie.get('username')
  },
  methods: {
    // 退出
    logout () {
      this.$confirm(`确定退出登录?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$cookie.delete('token')
        this.$cookie.delete('username')
        this.$router.push({ name: 'login' })
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss">
  .mainHeader{
      background: #282b30;
      height: 60px;
      font-family: PingFang SC;
      padding-left:5px;
      .logoBox{
          float: left;
          .logo{
              height: 50px;
              margin-top: 5px;
              /*margin-left: 20px;*/
          }
          /*.logo-name{*/
              /*height: 30px;*/
              /*margin-top: 8px;*/
          /*}*/
      }

      .userInfo{
          float: right;
          height: 60px;
          &:hover{
              background-color: #353940;
          }
          .user-icon{
              height:36px;
              width:36px;
              margin-top:12px;
              margin-right:10px;
              float: left;
          }
          .userName{
              max-width:134px;
              text-overflow:ellipsis;
              overflow: hidden;
              white-space: nowrap;
              margin: 0;
              height: 60px;
              line-height: 60px;
              color: #eceff8;
              font-size: 14px;
              float: left;
          }
          .logout-icon{
              float:right;
              width: 32px;
              height: 20px;
              margin-top: 20px;
              margin-left: 10px;
          }
      }

  }

</style>
