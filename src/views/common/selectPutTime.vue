<template>
    <div class="select-box">
        <div class="hour-box">
            <span>00:00</span>
            <span>01:00</span>
            <span>02:00</span>
            <span>03:00</span>
            <span>04:00</span>
            <span>05:00</span>
            <span>06:00</span>
            <span>07:00</span>
            <span>08:00</span>
            <span>09:00</span>
            <span>10:00</span>
            <span>11:00</span>
            <span>12:00</span>
            <span>13:00</span>
            <span>14:00</span>
            <span>15:00</span>
            <span>16:00</span>
            <span>17:00</span>
            <span>18:00</span>
            <span>19:00</span>
            <span>20:00</span>
            <span>21:00</span>
            <span>22:00</span>
            <span>23:00</span>
            <span>24:00</span>
        </div>
        <div class="week-box">
            <div class="left">
                <div class="weekDay"> <span>一</span></div>
                <div class="weekDay"> <span>二</span></div>
                <div class="weekDay"> <span>三</span></div>
                <div class="weekDay"> <span>四</span></div>
                <div class="weekDay"> <span>五</span></div>
                <div class="weekDay"> <span>六</span></div>
                <div class="weekDay"> <span>日</span></div>
            </div>
            <div class="right">
                <div v-for="(week,indexRow) in selectedTime" :key="indexRow" class="week-row">
                    <div v-for="(item,index) in week" :key="index" class="every-hour" @click="selectHour(indexRow,index)">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "selecePutTime",
    data:function () {
      return{
        selectedTime:[]
      }
    },
    props:['data'],
    created(){
      this.selectedTime = this.data
    },
    mounted(){
      this.initSelectedTime();
    },
    methods:{
      initSelectedTime(){
        for (let i = 0;i<this.selectedTime.length;i++){
          for(let j = 0;j<this.selectedTime[i].length;j++){
            let littleBox = document.getElementsByClassName("every-hour")[i*24+j];
            if(this.selectedTime[i][j]==1){
              // console.log(littleBox);
              littleBox.setAttribute("class","every-hour active")
            }else{
              littleBox.setAttribute("class","every-hour")
            }
          }
        }
      },
      selectHour(row,col){
        // let littleBox = document.getElementsByClassName("every-hour")[row*24+col];
        if(this.selectedTime[row][col]==1){
          this.selectedTime[row][col]=0;
        }else{
          this.selectedTime[row][col]=1;
        }
        this.initSelectedTime();
      }
    }
  }
</script>

<style lang="scss" scoped>
    .select-box{
        width: 950px;
        height: 241px;
        margin: 50px auto;
        border: #e6e6e6 1px solid;
        .hour-box{
            height: 30px;
            line-height: 30px;
            padding-left: 16px;
            span{
                margin-left: 7px;
                font-size: 10px;
            }
        }
        .week-box{
            .left{
                float: left;
                .weekDay{
                    height: 30px;
                    width: 40px;
                    border: #e6e6e6 1px solid;
                    border-bottom: 0;
                    line-height: 30px;
                    text-align: center;
                }
            }
            .right{
                float: left;
                .week-row{
                    width: 900px;
                    height: 30px;
                    .every-hour{
                        display: inline-block;
                        width: 37px;
                        height: 30px;
                        float: left;
                        border: #e6e6e6 1px solid;
                        border-bottom: 0px;
                        border-left: 0;
                        &:hover{
                            background-color: #499cfb;
                            opacity: 0.3;
                        }
                    }
                    .active{
                        background-color: #278cff;
                        opacity: 0.8;
                        &:hover{
                            background-color: #278cff;
                            opacity: 0.8;
                        }
                    }
                }

            }
        }

    }
</style>

