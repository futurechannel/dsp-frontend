<template>
    <div class="loginBox">
        <p class="login-title">账号登录</p>
        <el-form :model="loginForm"  ref="loginForm" >
            <el-form-item label="用户名">
                <el-input class="form-control" v-model="loginForm.username" type="text"
                          placeholder="用户名" autofocus></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input class="form-control" v-model="loginForm.password" type="password"
                          @keyup.enter.native="submitForm"
                          placeholder="密码"></el-input>
            </el-form-item>
            <div>
                <el-button class="login-btn" type="primary" @click="submitForm">登录</el-button>
            </div>
            <div class="transferField">
                <!--<a class="linkABlue" href="/#/register">注册账号</a>-->
                <router-link :to="{name:'register'}">注册账号</router-link>
            </div>
        </el-form>
    </div>
</template>

<script>
    export default {
      name: 'login',
      data () {
        return {
          loginForm: {
            username: '',
            password: ''
          }
        }
      },
      computed: {
      },
      mounted () {
      },
      methods: {
        submitForm () {
          var _this = this
          let data= {
             'username': this.loginForm.username,
             'password': this.loginForm.password
          }
          this.$axios({
            url: '/user/money/login',
            method: 'post',
            headers: {
               'Content-Type': 'application/json;charset=UTF-8'
            },
            data: JSON.stringify(data),
            dataType: "json",
          }).then(res => {
            let data = res.data
            // console.log(data)
            if (data && data.code === 0) {
              _this.$cookie.set('token', data.token)
              _this.$cookie.set('username', _this.loginForm.username)
              _this.$router.replace({ name: 'home' })
            } else {
              _this.$message.error(data.msg)
            }
          })
        }
      }
    }
</script>

<style lang="scss" scoped>
    .loginBox{
        width: 470px;
        position: absolute;
        /*top: 25%;*/
        right: 0;
        background-color: #FFF;
        border-radius: 2px;
        /*padding: 20px;*/
        padding: 50px;
        font-family: "Microsoft Yahei", Arial, Helvetica, sans-serif;
        .login-title {
            text-align: center;
            margin: 0;
            padding-top: 50px;
            padding-bottom: 35px;
            font-size: 18px;
        }
        el-form{
            /*width: 280px;*/
        }
        .login-btn{
            width: 370px;
            margin-top: 40px;
            /*margin-left: 20px;*/
        }
        .transferField{
            margin-top: 50px;
            margin-bottom: 0px;
            a{
                color: #387aff;
                text-decoration: none;
                &:hover{
                    color: #3058df
                }
            }
        }

    }
</style>
