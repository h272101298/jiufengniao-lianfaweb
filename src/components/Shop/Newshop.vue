<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商家管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增店铺</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col>
      <el-form ref="newshop" :model="newshop" label-width="120px" :rules="rules" style="width: 700px;" status-icon>
        <el-form-item label="店铺名称:" prop="name">
          <el-input v-model="newshop.name" placeholder="请输入店铺名称"></el-input>
        </el-form-item>
        <el-form-item label="掌柜名称:" prop="manager">
          <el-input v-model="newshop.manager" placeholder="请输入掌柜名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save()">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-col>


  </el-row>
</template>


<script>

  import { shopPost } from '../../api/api';

  export default {
    data() {
      return {


        newshop:{
          name:'',
          manager:''
        },
        rules: {
          name: [{required: true, trigger: 'blur',message: '请输入店铺名称'}],
          manager: [{required: true, trigger: 'blur',message: '请输入掌柜名称'}]
        },
      };
    },

    methods:{
      save(){
        this.$refs.newshop.validate((valid) => {
          if (valid) {
            console.log(this.newshop)

            shopPost(this.newshop).then((res) => {
              if (res.msg === "ok") {
               this.$message({
                message: '提交成功',
                type: 'success'
              });
               this.$router.push({ path: '/Shop/Shoplist' });

             } else {
               this.$message({
                message: res.msg,
                type: 'error'
              });
             }
           });
          }else{
            return false;
          }
        })
      }

    },

    mounted: function () {

    }
  }
</script>


<style>

</style>
