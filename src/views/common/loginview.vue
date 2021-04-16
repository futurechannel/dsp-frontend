<template>
    <div class="login-page">
        <!--<header>-->
            <!--<div class="logoBox">-->
                <!--<img class="logo" src="~@/assets/img/login/logo_blcak.png">-->
                <!--&lt;!&ndash;<img class="logo-name" src="~@/assets/img/login/logo_name.png">&ndash;&gt;-->
            <!--</div>-->
        <!--</header>-->

        <div class="content" :style="{'height':documentClientHeight-80 +'px'}">
            <img class="logo" src="~@/assets/img/login/logo_white.png">
            <router-view :style="{'height':documentClientHeight-80 +'px'}"></router-view>
        </div>

        <footer>
            <div class="footer-content">
                <p class="footer-title">—————————   联系我们  Contact Us   —————————</p>
                <div class="contact">
                    <div class="wechat">
                        <img src="~@/assets/img/login/wechat.png">
                        <span>sitongciro</span>
                    </div>
                    <div class="email">
                        <img src="~@/assets/img/login/email.png">
                        <span>cirodong@stonggo.com</span>
                    </div>
                </div>
                <p class="footer-end">Copyright ©2018 stonggo all rights reserved</p>
            </div>
        </footer>

    </div>
</template>

<script>
  export default {
    name: 'loginview',
    data () {
      return {
      }
    },
    computed: {
      documentClientHeight: {
        get () {
          return this.$store.state.common.documentClientHeight
        },
        set (val) {
          this.$store.commit('common/updateDocumentClientHeight', val)
        }
      }
    },
    mounted () {
      this.resetDocumentClientHeight()
    },
    methods: {
      resetDocumentClientHeight () {
        this.documentClientHeight = document.documentElement['clientHeight']
        window.onresize = () => {
          this.documentClientHeight = document.documentElement['clientHeight']
        }
      }
    }

  }
</script>
<style>
    .loginBox .el-form-item {
        margin-bottom: 10px;
    }
</style>
<style lang="scss" scoped>
    .login-page{
        font-family: PingFangSC-Medium;
        header{
            width: 100%;
            height: 60px;
            /*.logo{*/
                /*height: 55px;*/
                /*margin-top: 3px;*/
                /*!*margin-left: 20px;*!*/
            /*}*/
            /*.logo-name{*/
                /*height: 35px;*/
                /*margin-top: 8px;*/
            /*}*/
        }
        .content{
            background: #375CE1 url("../../assets/img/login/login_bg.jpeg") no-repeat center;
            background-size: 100% ;
            /*height: 750px;*/
            width: 100%;
            overflow: hidden;
            position: relative;
            /*.background{*/

             /*}*/
            .logo{
                width: 400px;
                position: absolute;
                top: 40%;
                /*left: 18%;*/
                left: calc((100% - 870px)/2);
            }
        }
        footer{
            margin-top: 0;
            background-color: #39434E;
            height: 80px;
            width: 100%;
            .footer-content{
                width: 420px;
                height: 80px;
                padding-top: 5px;
                margin: 0 auto;
                & img{
                    width: 15px;
                }
                .footer-title{
                    font-size: 14px;
                    color: #50A131;
                    letter-spacing: 0;
                    text-align: center;
                    /*margin-bottom: 5px;*/
                    margin-top: 8px;
                }
                .contact{
                    height: 20px;
                    margin-bottom: 5px;
                    & span{
                        font-size: 12px;
                        color: #8A8F93;
                    }
                    .wechat{
                        float: left;
                        margin-left: 65px;
                    }
                    .email{
                        float: right;
                        margin-right: 65px;
                    }
                }
                .footer-end{
                    font-size: 12px;
                    color: #636874;
                    letter-spacing: 0;
                    text-align: center;
                    margin-top: 0;
                }


            }
        }
    }
</style>
