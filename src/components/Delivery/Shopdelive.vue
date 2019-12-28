<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>快递设置</el-breadcrumb-item>
        <el-breadcrumb-item>运费设置</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">


      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="运费设置" name="list">
          <el-form label-width="100px" width="700px" center style="width: 800px" ref="config" :model="config" :rules="configrule">

            <el-form-item label="快递：" prop="express_id" >
              <!--           <el-input v-model="config.express_id" placeholder="请选择快递" v-show="noconfig==true"></el-input> -->
              <el-select v-model="config.express_id" placeholder="请选择快递" v-show="noconfig==true">
                <el-option v-for="item in list" :label="item.title" :value="item.id" :key="item.id"></el-option>
              </el-select>
              <span v-show="noconfig==false">{{configinfo.express.title}}</span>
            </el-form-item>

            <el-form-item label="运费："  prop="price">
              <el-input v-model="config.price" placeholder="请输入运费" v-show="noconfig==true"></el-input>
              <span v-show="noconfig==false">￥{{configinfo.price}}</span>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="save()" v-show="noconfig==true">保 存</el-button>
              <el-button type="primary" @click="putconfig()" v-show="noconfig==false">修 改</el-button>
            </el-form-item>
          </el-form>

        </el-tab-pane>
      </el-tabs>

    </el-col>

  </el-row>
</template>



<script>
  import { deliveryGet } from '../../api/api';

  import { shopkdGet } from '../../api/api';
  import { shopkdPost } from '../../api/api';

  export default {
    data() {
      return {
        activeName:'list',

        list:[],

        configrule:{
          express_id: [{required: true, trigger: 'blur',message: '请选择快递'}],
          price: [{required: true, trigger: 'blur',message: '请输入运费'}]
        },

        noconfig:false,
        config:{
          express_id:null,
          price:null
        },

        configinfo:{
          price:null,
          express:{
            title:null
          }
        }
      }
    },

    methods:{

      getlist(){
        var allParams = '?page=1&limit=10000'
        deliveryGet(allParams).then((res) => {
          this.list=res.data.data;
        });
      },


      putconfig(){
        this.noconfig=true
      },

      save(){
        console.log(this.config)

        this.$refs.config.validate((valid) => {
          if (valid) {
            var allParams=this.config
            shopkdPost(allParams).then((res) => {
              if (res.msg === "ok") {
               this.$message({
                message: '提交成功',
                type: 'success'
              });
               this.getconfig();
               this.noconfig = false;
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
      },

      getconfig(){
        var that = this;
        var allParams = '';
        shopkdGet(allParams).then((res) => {
          // console.log(res.data==null)
          if(res.data==null || res.data.express==null){
            that.noconfig = true
          }else{
            that.configinfo=res.data
            that.noconfig = false
          }
        });
      }

    },

    mounted: function () {
      this.getconfig();
      this.getlist()
    }
  }
</script>


<style>

</style>
