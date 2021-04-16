<template>
    <div class="activate">
        <div class="box">
            <p class="content">您的账号正在激活中......</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "activate",
        data() {
            return {
                code:'',
            };
        },
        created(){
            this.code = this.$route.query.code;
            console.log(this.code);
        },
        mounted(){
            this.activate(this.code)
        },
        methods:{
            activate(code){
                this.$axios({
                    url: '/user/money/active',
                    method: 'get',
                    params: {
                        'code': code,
                    }
                }).then(({data}) => {
                    if (data.code == 0) {
                        this.$message.success('账号激活成功！')
                        this.$cookie.set('token', data.token)
                        this.$cookie.set('username', data.username)
                        this.$router.replace({ name: 'home' })
                    } else {
                        let msg = data.msg
                        this.$message.error('账号激活失败: '+msg)
                        this.$router.replace({ name: 'register' })
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .activate{
        width: 100%;
        height: 100%;
        /*background: #8bbbfa;*/
        .box{
            width: 330px;
            margin: 300px auto;
        }
        .content{
            font-size: 30px;
            font-weight: 400;

        }
    }
</style>
