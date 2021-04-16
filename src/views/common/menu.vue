<template>
    <div class="nav-box">
        <el-tabs class="nav" v-model="navActive" @tab-click="handleClick">
            <el-tab-pane name="index">
                <span slot="label"><icon-svg name="index" class="nav-icon"></icon-svg> <span class="nav-font">首页</span> </span>
            </el-tab-pane>
            <el-tab-pane name="tuiguang">
                <span slot="label"><icon-svg name="tuiguang" class="nav-icon"></icon-svg>  <span class="nav-font">推广管理</span></span>
            </el-tab-pane>
            <el-tab-pane name="shujufenxi">
                <span slot="label"><icon-svg name="shujufenxi" class="nav-icon"></icon-svg><span class="nav-font">数据分析</span>  </span>
            </el-tab-pane>
            <el-tab-pane name="caiwu">
                <span slot="label"><icon-svg name="caiwu" class="nav-icon"></icon-svg>  <span class="nav-font">财务管理</span> </span>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
  export default {
    name: "menu",
    data () {
      return {
        navActive:'',
      }
    },
    props:['data'],
    created(){
      this.navActive = this.data
    },
    methods: {
      handleClick (tab) {
        let tabName = tab.name
        if (tabName == 'index') {
          this.$router.push({name: 'home'})
        } else if (tabName == 'tuiguang') {
          this.$router.push({name: 'popularize'})
        } else if (tabName == 'shujufenxi') {
          this.$router.push({name: 'dataAnalysis'})
        } else if (tabName == 'caiwu') {
          this.$router.push({name: 'finance'})
        }
      }
    }
  }
</script>

<style lang="scss">
    .nav-box{
        width: 100%;
        height: 40px;
        border-bottom: 1px #dfe6ee solid;
        .nav{
            height: 40px;
            padding-left: 40px;
            .icon-svg{
                width: 24px !important;
                height: 24px !important;
                margin-top: 8px;
            }
            .nav-font{
                font-size: 14px;
                line-height: 40px;
                display: block;
                float: right;
                margin-right: 20px;
            }
        }
    }
    .el-tabs__active-bar {
        display: none
    }
    .el-tabs__nav-wrap::after{
        display: none;
    }
</style>
