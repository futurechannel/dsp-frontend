<template>
    <div class="loginBox">
        <p class="login-title">注册账号</p>
        <el-form :model="loginForm"  ref="loginForm" :rules="rules">
            <el-form-item label="用户名" prop="username">
                <el-input class="form-control" v-model="loginForm.username" type="text"
                          placeholder="用户名" autofocus></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input class="form-control" v-model="loginForm.password" type="password"
                          placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="passwordAgain">
                <el-input class="form-control" v-model="loginForm.passwordAgain" type="password"
                          placeholder="确认密码"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input class="form-control" v-model="loginForm.email" type="text"
                          @keyup.enter.native="submitForm"
                          placeholder="邮箱"></el-input>
            </el-form-item>
            <div>
                <el-button class="login-btn" :disabled="buttonDisable" type="primary" @click="submitForm">{{buttonValue}}</el-button>
            </div>
            <div class="transferField">
                <!--<a class="linkABlue" href="/#/login">登录</a>-->
                <router-link :to="{name:'login'}">登录</router-link>
            </div>
        </el-form>
    </div>

</template>

<script>
  export default {
    name: 'register',
    data () {
      return {
        loginForm: {
          username: '',
          password: '',
          passwordAgain: '',
          email: ''
        },
        type: 0, // 0表示首次注册，1表示重发邮件
        buttonValue: '立即注册',
        buttonDisable: false,
        rules: {
          username: [
              { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
              { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          passwordAgain: [
             { required: true, message: '请输入确认密码', trigger: 'blur' }
          ],
          email: [
              { required: true, message: '请输入邮箱', trigger: 'blur' },
              {pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/, message: '请输入正确的邮箱地址'}
          ]
        }
      }
    },
    created () {
      this.type = 0
      this.buttonValue = '立即注册'
      this.buttonDisable = false
    },
    methods: {
      submitForm () {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            let data = {
              'userid': this.loginForm.username,
              'password': this.loginForm.password,
              'email': this.loginForm.email,
              'type': this.type
            }
            if (this.loginForm.password === this.loginForm.passwordAgain) {
                this.buttonDisable = true
                this.$axios({
                url: '/user/money/addUser',
                method: 'post',
                headers: {
                  'Content-Type': 'application/json;charset=UTF-8'
                },
                data: JSON.stringify(data),
                dataType: 'json'
              }).then(({data}) => {
                  this.buttonDisable = false
                if (data.code === 0) {
                  this.insertUserToBalance(this.loginForm.username)
                  this.$message.success('用户创建成功！')

                  this.$confirm('账号激活邮件已发送,请您激活', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'success'
                  }).then(() => {
                    this.$router.push({name: 'login'})
                  }).catch(() => {
                    this.$router.push({name: 'login'})
                  })
                  this.type = 0
                  this.buttonValue = '立即注册'
                } else {
                    if(data.code === 601){
                        this.buttonValue = '重发邮件'
                        this.type = 1
                    }else{
                        this.type = 0
                        this.buttonValue = '立即注册'
                    }
                    this.$message.error(data.msg)
                }
                  // console.log(data)
              })
            } else {
              this.$message.error('确认密码与密码不一致！')
            }
          }
        })
      },
      insertUserToBalance (userName) {
        this.$axios({
          url: '/user/money/insertUserToBalance',
          method: 'post',
          params: {
            'username': userName,
            'balance': 0
          }
        }).then(({data}) => {
          if (data.code === 500) {
          } else if (data.code === 0) {
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
    .loginBox{
        width: 470px;
        overflow: auto;
        position: absolute;
        /*top: 20%;*/
        right: 0px;
        background-color: #FFF;
        border-radius: 2px;
        padding: 40px;
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
            width: 390px;
            margin-top: 40px;
        }
        .transferField{
            margin-top: 40px;
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
