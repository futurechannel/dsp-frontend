<template>
<div class="addIdea-box">
    <menu-navbar data="tuiguang"></menu-navbar>
    <div class="home-card">
        <el-row class="addIdea-title">
            <p>新建创意</p>
        </el-row>
        <el-row class="info-area">
            <el-form :model="addIdeaform" :rules="rules" ref="addIdeaform" label-width="100px" class="form">
                <el-form-item label="创意名称" prop="ideaName">
                    <el-input v-model="addIdeaform.ideaName"></el-input>
                </el-form-item>
                <el-form-item label="创意类型" prop="type">
                    <el-radio-group v-model="addIdeaform.type" @change="handleTypeChange">
                        <el-radio :label="1">样式1</el-radio>
                        <el-radio :label="2">样式2</el-radio>
                        <el-radio :label="3">样式3</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="上传图片" class="upload-item">
                    <el-upload
                            class="avatar-uploader"
                            :action="url"
                            ref="upload"
                            :show-file-list="false"
                            :auto-upload="false"
                            :on-change="changeImg"
                            :on-success="handleAvatarSuccess">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else slot="trigger" class="el-icon-plus avatar-uploader-icon" ></i>
                    </el-upload>
                    <i v-if="imageUrl" class="el-icon-close delete-icon" @click="handleRemove"></i>
                    <p class="upload-tip">建议图片尺寸为{{imgWidthLimit}}x{{imgHeighttLimit}},格式为jpg、png、jpeg并且大小在100kb以内</p>
                </el-form-item>

                <!--<el-form-item label="创意预算" prop="budget">-->
                    <!--<el-input v-model="addIdeaform.budget"></el-input>-->
                <!--</el-form-item>-->

                <!--<el-form-item label="应用包名" prop="appName">-->
                    <!--<el-input v-model="addIdeaform.appName"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="应用ID" prop="appId">
                    <el-input v-model="addIdeaform.appId" @change="HandleAppIdChange" placeholder="请输入AppStore的AppID"></el-input>
                </el-form-item>

                <el-form-item label="广告媒体" prop="advMedia" class="adver">
                    <el-select v-model="addIdeaform.advMedia" placeholder="请选择广告媒体">
                        <el-option v-for="(item,index) in adverterCodes"
                                   :key="index"
                                   :label="item.name"
                                   :value="item.value">
                        </el-option>
                        <!--<el-option label="广告媒体1" value="adverter1"></el-option>-->
                        <!--<el-option label="广告媒体2" value="adverter2"></el-option>-->
                        <!--<el-option label="广告媒体3" value="adverter3"></el-option>-->
                        <!--<el-option label="广告媒体4" value="adverter4"></el-option>-->
                    </el-select>
                </el-form-item>

                <el-form-item label="创意出价" prop="price">
                    <!--<el-input v-model="addIdeaform.price" placeholder="不低于0.3元"></el-input>-->
                    <el-input v-model="addIdeaform.price" id="price" @focus="beforeInputPrice" @change="afterInputPrice"></el-input>
                </el-form-item>

                <el-form-item class="btn-box">
                    <el-button @click="prev" class="cancle-btn">取消</el-button>
                    <el-button type="primary" class="confirm-btn" @click="submitForm('addIdeaform')">保存</el-button>
                </el-form-item>
            </el-form>
        </el-row>
    </div>
</div>
</template>

<script>
  import menuNavbar from '@/views/common/menu.vue'

  export default {
    name: 'addIdea',
    components: {menuNavbar},
    data () {
      return {
        addIdeaform: {
          ideaName: '',
          type: 1,
          imgUrl: '',
          // budget: '',
          price: '',
          // appName: '',
          appId: '',
          appCode:'',
          advMedia: '',
          adveters: [],
        },
        lowestPrice:'',
        balance:0,
        adverterCodes:[],
        imageUrl: '',
        imgWidthLimit: 750,
        imgHeighttLimit: 360,
        url:'http://39.105.55.23:8089/addsp/popularize/upload',
        rules: {
          ideaName: [
            { required: true, message: '请输入创意名称', trigger: 'blur' },
          ],
          type: [
            { required: true, message: '请选择创意类型', trigger: 'change' }
          ],
          // budget: [
          //   { required: true, message: '请输入创意预算', trigger: 'blur' },
          //   {pattern:  /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/,message: '请输入正确价格'}
          // ],
          price: [
            { required: true, message: '请输入创意出价', trigger: 'blur' },
            {pattern:  /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/,message: '请输入正确价格'},
            // {pattern:  /(^[1-9]\d*(\.\d{1,2})?$)|(^0\.[3-9]([0-9])?$)/,message: '出价不低于0.3元'}

          ],
          // appName: [
          //   { required: true, message: '请输入创意名称', trigger: 'blur' },
          // ],
          appId: [
            { required: true, message: '请输入创意名称', trigger: 'blur' },
          ],
          advMedia: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ]
        }
      }
  },
    methods: {
      beforeSubmit(){
        let _this = this;
        let username = this.$cookie.get('username');
        this.$axios({
          url: '/analysis/userBalance',
          method: 'get',
          params: {
            username: username,
          }
        }).then(res => {
          _this.balance = res.data.data.balance
        })
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.addIdeaform.price < this.lowestPrice){
              this.$confirm('出价不低于'+this.lowestPrice+'元', '', {
                confirmButtonText: '确定',
                showCancelButton:false,
                type: 'info'
              }).then(() => {
                this.addIdeaform.price=''
                return;
              }).catch(() => {
                this.addIdeaform.price=''
                return;
              });
            }else{
              this.beforeSubmit();
              let status = 1;
              // if(this.addIdeaform.budget<this.addIdeaform.price){
              //   status = 3;
              // }
              if(this.balance<0){
                status = 4;
              }
              let user = this.$cookie.get('username');
              this.$axios({
                url: '/addIdea/saveIdea',
                method: 'post',
                params: {
                  'ideaID':user+Date.now().toString(),
                  'ideaName':this.addIdeaform.ideaName,
                  'userName':user,
                  "ideaCost":this.addIdeaform.price,
                  'isOpen':"Y",
                  "status":status,
                  // 'appPackageName':this.addIdeaform.appName,
                  'advertCode':this.addIdeaform.advMedia,//1111
                  'appCode':this.addIdeaform.appCode,
                  'appId':this.addIdeaform.appId,
                  'imgUrl':this.addIdeaform.imgUrl,
                  'type':this.addIdeaform.type
                }
              }).then(({data}) => {
                if(data.code == 0){
                  const h = this.$createElement;
                  this.$message({
                    showClose: true,
                    message: h('span', null, '保存成功'),
                    type: 'success',
                    offset:80,
                    center:true,
                    duration:1500
                  });
                  this.$router.push({name: 'popularize'})
                }else{
                  this.$message.error('保存失败，请稍后再试')
                }
              })
            }
          } else {
            // console.log('error submit!!')
            return false
          }
        })

      },
      prev () {
        this.$router.go(-1)
      },
      handleTypeChange(value){
        if(value == 1){
          this.imgWidthLimit = 750;
          this.imgHeighttLimit = 360;
        }else if(value == 2){
          this.imgWidthLimit = 750;
          this.imgHeighttLimit = 285;
        }else if(value == 3){
          this.imgWidthLimit = 1224;
          this.imgHeighttLimit = 507;
        }
      },
      changeImg (file, fileList){
        this.beforeAvatarUpload(file.raw)
      },
      handleAvatarSuccess(res, file) {
        console.log('上传图片成功')
        this.imageUrl = URL.createObjectURL(file.raw);
        let temp = res.split('/')
        this.addIdeaform.imgUrl = temp[temp.length-1];
      },
      beforeAvatarUpload(file) {
        let _this = this;
        let isType = false;
        let isLt100KB = false;
        let isSize = false;
        if(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'){
          isType = true;
        }
        if(file.size / 1024  <= 100){
          isLt100KB = true;
        }
        if (!isType) {
          this.$message.error('上传图片只能是jpg、png、jpeg格式！');
          _this.$refs.upload.clearFiles();
          return isType && isLt100KB && isSize;
        }
        if (!isLt100KB) {
          this.$message.error('上传图片大小不能超过100KB !');
          _this.$refs.upload.clearFiles();
          return isType && isLt100KB && isSize;
        }
        new Promise(function () {
          let _URL = window.URL || window.webkitURL
          let img = new Image()
          img.onload = function () {
            // console.log(img.width,img.height,_this.imgHeighttLimit,_this.imgWidthLimit)
            if(img.width == _this.imgWidthLimit && img.height == _this.imgHeighttLimit){
              isSize = true;
              _this.$refs.upload.submit();
            }
            if (!isSize) {
              _this.$message.error('只能上传'+_this.imgWidthLimit+'x'+_this.imgHeighttLimit+'的图片');
              _this.$refs.upload.clearFiles();
              return isType && isLt100KB && isSize;
            }
          }
          img.src = _URL.createObjectURL(file)
        }).then(() => {
          return file
        }, () => {
        })
      },
      handleRemove(){
        this.imageUrl = '';
        return;
      },
      HandleAppIdChange(value){
        this.$axios({
          url: '/appInfo/getAppCodeAndLstPrice',
          method: 'get',
          params: {
            'appId': value
          }
        }).then(({data}) => {
          if(!data.data){
            this.adverterCodes = [];
            this.$alert('请输入正确appID,或与商务联系', '', {
              confirmButtonText: '确定',
              callback: action => {
              }
            });
          }else{
            this.addIdeaform.appCode = data.data.appCode
            if (!data.data.lowestPrice) {
              this.lowestPrice = 0.3    //待确认
            } else {
              this.lowestPrice = data.data.lowestPrice
            }
            this.getAdverterCodes()
            let priceInput = document.getElementById('price')
            priceInput.setAttribute('placeholder','不低于'+this.lowestPrice+'元')
          }
        })
      },
      getAdverterCodes(){
        this.adverterCodes=[];
        this.$axios({
          url: '/advertInfo/getAdverterCode',
          method: 'get',
          params: {
            'appCode': this.addIdeaform.appCode
          }
        }).then(({data}) => {
          if(data.data){
            let result = data.data;
            for(let i = 0;i<result.length;i++){
              // let codeTempName = "广告媒体"+(i+1);
              let advert={};
              // advert.name = codeTempName;
              if(result[i].mediaName){
                advert.name = result[i].mediaName;
              }else{
                advert.name = "未命名广告媒体"+(i+1)
              }
              advert.value = result[i].adverterCode;
              this.adverterCodes.push(advert)
            }
            // console.log(JSON.stringify(this.adverterCodes));
            this.getUsableAdverterCodes();
          }
        })
      },
      getUsableAdverterCodes(){
        this.$axios({
          url: '/addIdea/queryUsedAdverterCode',
          method: 'get',
          params: {
            'username':this.$cookie.get('username'),
            'appCode': this.addIdeaform.appCode
          }
        }).then(({data}) => {
          if(data.data){
            let result = data.data;
            let sameIndex = [];
            let tempAdCodes = [];
            for (let i=0;i<this.adverterCodes.length;i++){
              let tempCode = this.adverterCodes[i];
              for(let j=0;j<result.length;j++){
                if(tempCode.value == result[j]){
                  sameIndex.push(i);
                }
              }
            };
            for (let k=0;k<this.adverterCodes.length;k++){
              let flag = true;
              for(let m=0;m<sameIndex.length;m++){
                if(k == sameIndex[m]){
                  flag = false;
                }
              }
              if(flag){
                tempAdCodes.push(this.adverterCodes[k]);
              }
            }
            this.adverterCodes = tempAdCodes;
            // console.log(JSON.stringify(this.adverterCodes));
          }
        })
      },
      beforeInputPrice(){
        let _this = this;
        if(!_this.lowestPrice){
          this.$confirm('请先输入应用ID', '', {
            confirmButtonText: '确定',
            showCancelButton:false,
            type: 'info'
          }).then(() => {
          }).catch(() => {
          });
          document.getElementById('price').blur()
        }
      },
      afterInputPrice(){
        let _this = this;
        if(this.addIdeaform.price < _this.lowestPrice){
          this.$confirm('出价不低于'+_this.lowestPrice+'元', '', {
            confirmButtonText: '确定',
            showCancelButton:false,
            type: 'info'
          }).then(() => {
            this.addIdeaform.price=''
          }).catch(() => {
            this.addIdeaform.price=''
          });
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
    .addIdea-box{
        .home-card{
            box-shadow: 0 2px 20px rgba(0,0,0,.05);
            border-radius: 4px;
            background-color: #fff;
            overflow: hidden;
            padding: 24px;
            margin-top: 7px;
            margin-left:1%;
            width: 98%;
            .addIdea-title{
                height: 50px;
                font-size: 20px;
                line-height: 20px;
                margin-left: 5px;
            }
            .form{
                width: 600px;
                .adver .el-select{
                    width: 500px;
                }
                .upload-tip{
                    color: rgba(0, 0, 0, 0.4);
                    font-size: 12px;
                    line-height: 18px;
                }
                .btn-box{
                    height: 50px;
                    margin-top: 40px;
                    .cancle-btn{
                        width: 150px;
                        border-radius: 0;
                        margin-left: 50px;
                        margin-right: 50px;
                    }
                    .confirm-btn{
                        width: 150px;
                        border-radius: 0;
                    }
                    .el-form-item {
                        margin-bottom: 25px;
                    }
                }
                .upload-item{
                    position: relative;
                    .avatar-uploader-icon {
                        font-size: 28px;
                        color: #8c939d;
                        width: 178px;
                        height: 178px;
                        line-height: 178px;
                        text-align: center;
                    }
                    .avatar {
                        width: 178px;
                        height: 178px;
                        display: block;
                    }
                    .delete-icon{
                        position: absolute;
                        top: 10px;
                        left: 155px;
                        color: #dddddd;
                    }
                }
            }
        }
    }
</style>

<style>

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }


</style>
