<template>
 <el-row class="warp" style="padding:20px 0 0 20px;">
  <el-col :span="24" class="warp-breadcrum">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>微信设置</el-breadcrumb-item>
    </el-breadcrumb>
  </el-col>


  <el-col :span="24" class="warp-main">
    <el-row>

      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="微信配置" name="list">

          <el-form ref="wechatset" :model="wechatset" label-width="120px" class="form" status-icon size="small" :rules="rules1" style="width:600px;">

            <el-form-item label="小程序AppId：" prop="app_id">
              <el-input v-model="wechatset.app_id" placeholder="请输入小程序AppId" v-show="show"></el-input>
              <label v-show="set">{{wxset.app_id}}</label>
            </el-form-item>

            <el-form-item label="AppSecret：" prop="app_secret">
              <el-input v-model="wechatset.app_secret" placeholder="请输入AppSecret" v-show="show"></el-input>
              <label v-show="set">{{wxset.app_secret}}</label>
            </el-form-item>

            <el-form-item label="微信商户号：" prop="mch_id">
              <el-input v-model="wechatset.mch_id" placeholder="请输入微信商户号" v-show="show"></el-input>
              <label v-show="set">{{wxset.mch_id}}</label>
            </el-form-item>

            <el-form-item label="商户Api密钥：" prop="api_key">
              <el-input v-model="wechatset.api_key" placeholder="请输入AppKey" v-show="show"></el-input>
              <label v-show="set">{{wxset.api_key}}</label>
            </el-form-item>

            <el-form-item label="商户Api证书：">

              <label v-show="set">{{wxset.ssl_cert}}</label>
              <label v-show="set">{{wxset.ssl_key}}</label>

              <el-upload v-show="show" :action="base" :on-remove="handleRemove" :on-success="handleSuccess" :limit="2" :on-exceed="handleExceed" :on-error="handleError" :file-list="wechatset.File">
                <el-button size="small" type="primary">上传证书</el-button>
              </el-upload> 
              <span v-show="show">提示：证书为pem格式文件，第一个为证书部分，第二个为秘钥部分，请按顺序上传</span>
            </el-form-item>

            <el-form-item>
              <el-button v-if="set && checkper1" size="small" type="primary" style="margin-left:0px;margin-top:20px;" @click="changebase">编辑</el-button>
              <el-button v-if="show" size="small" type="primary" style="margin-left:0px;margin-top:20px;" @click="confirm">提交</el-button>
              <el-button v-if="show" size="small" @click="cancel">取消</el-button>
            </el-form-item>
          </el-form>

        </el-tab-pane>

        <el-tab-pane label="模板消息" name="config">

          <el-form ref="modeldata" :model="modeldata" label-width="170px" class="form" status-icon size="small" :rules="rules2" style="width:750px;">

            <el-form-item label="拼团成功：" prop="collage_notify">
              <el-input v-model="modeldata.collage_notify" placeholder="请输入模板消息ID" v-show="modelshow"></el-input>
              <label class="grey" v-show="modelshow">选择关键词：订单号、商家名称、开团时间、成团时间、商品名称、参团人数、订单金额</label>
              <label v-show="modelset">{{modeldata.collage_notify}}</label>
            </el-form-item>

            <el-form-item label="抢购成功：" prop="buying_notify">
              <el-input v-model="modeldata.buying_notify" placeholder="请输入模板消息ID" v-show="modelshow"></el-input>
              <label class="grey" v-show="modelshow">选择关键词：订单号、商户名称、商品名称、抢购时间、商品价格、抢购价、购买数量</label>
              <label v-show="modelset">{{modeldata.buying_notify}}</label>
            </el-form-item>

            <el-form-item label="卡牌收集完成：" prop="card_notify">
              <el-input v-model="modeldata.card_notify" placeholder="请输入模板消息ID" v-show="modelshow"></el-input>
              <label class="grey" v-show="modelshow">选择关键词：活动名称、集齐时间、获得奖励</label>
              <label v-show="modelset">{{modeldata.card_notify}}</label>
            </el-form-item>

            <el-form-item label="入驻成功：" prop="shop_notify">
              <el-input v-model="modeldata.shop_notify" placeholder="请输入模板消息ID" v-show="modelshow"></el-input>
              <label class="grey" v-show="modelshow">选择关键词：店铺名称、入驻时间、温馨提示</label>
              <label v-show="modelset">{{modeldata.shop_notify}}</label>
            </el-form-item>

            <el-form-item label="商品信息上传成功：" prop="product_notify">
              <el-input v-model="modeldata.product_notify" placeholder="请输入模板消息ID" v-show="modelshow"></el-input>
              <label class="grey" v-show="modelshow">选择关键词：商品名称、卖家信息、上传时间、原价、单价、商品简介</label>
              <label v-show="modelset">{{modeldata.product_notify}}</label>
            </el-form-item>

            <el-form-item label="已关注的商品降价：" prop="reduce_notify">
              <el-input v-model="modeldata.reduce_notify" placeholder="请输入模板消息ID" v-show="modelshow"></el-input>
              <label class="grey" v-show="modelshow">选择关键词：商品名称、商品原价、商品现价、温馨提示</label>
              <label v-show="modelset">{{modeldata.reduce_notify}}</label>
            </el-form-item>

            <el-form-item label="卡券领取成功：" prop="voucher_notify">
              <el-input v-model="modeldata.voucher_notify" placeholder="请输入模板消息ID" v-show="modelshow"></el-input>
              <label class="grey" v-show="modelshow">选择关键词：温馨提示、活动名称、商品信息、有效日期、优惠内容</label>
              <label v-show="modelset">{{modeldata.voucher_notify}}</label>
            </el-form-item>

            <el-form-item label="代理申请成功：" prop="proxy_notify">
              <el-input v-model="modeldata.proxy_notify" placeholder="请输入模板消息ID" v-show="modelshow"></el-input>
              <label class="grey" v-show="modelshow">选择关键词：申请类型、申请时间、状态、申请人</label>
              <label v-show="modelset">{{modeldata.proxy_notify}}</label>
            </el-form-item>


            <el-form-item label="活动推送：" prop="promotion_notify">
              <el-input v-model="modeldata.promotion_notify" placeholder="请输入模板消息ID" v-show="modelshow"></el-input>
              <label class="grey" v-show="modelshow">选择关键词：活动主题、活动时间、活动类型、温馨提示</label>
              <label v-show="modelset">{{modeldata.promotion_notify}}</label>
            </el-form-item>

            <el-form-item>
              <el-button v-if="modelset" size="small" type="primary" style="margin-top:20px;" @click="changemodel">编辑</el-button>
              <el-button v-if="modelshow" size="small" type="primary" style="margin-top:20px;" @click="postmodel">提交</el-button>
              <el-button v-if="modelshow" size="small" @click="cancelmodel">取消</el-button>     
            </el-form-item>
          </el-form>



        </el-tab-pane>
      </el-tabs>

    </el-row>
  </el-col>


</el-row>
</template>



<script>


  import qiniu from '../../api/qiniu';

  import hosturl from '../../api/api';

  import { wxconfigPost } from '../../api/api';
  import { wxconfigGet } from '../../api/api';
  import { wxmodelPost } from '../../api/api';
  import { wxmodelGet } from '../../api/api';

  import { Message } from 'element-ui';


  export default {
    data() {
      return {
        base:hosturl+'v1'+'/upload',
        activeName:'list',

        show:false,
        set:true,
        checkper1:false,
        uptoken:{
          token:qiniu.token,
        },
        upurl:qiniu.upurl,


        wechatset:{
          // app_id:'wx5671bd47b7d2166c',
          // app_secret:'4b213482683bc98f412d2f6e37494070',
          // mch_id:'1507375401',
          // api_key:'babihu20180327geckopaymentsecret',
          app_id:'',
          app_secret:'',
          mch_id:'',
          api_key:'',
          File:[],
          // ssl_cert:'',
          // ssl_key:''
        },

        wxset:{  
          // app_id:'',
          // app_secret:'',
          // mch_id:'',
          // api_key:'',
          // ssl_cert:'',
          // ssl_key:''
        },

        rules1:{
          app_id: [
          {required: true, message: '请输入AppId', trigger: 'blur'},
          ],
          app_secret: [
          {required: true, message: '请输入AppSecret', trigger: 'blur'},
          ],
          mch_id: [
          {required: true, message: '请输入商户号', trigger: 'blur'},
          ],
          api_key: [
          {required: true, message: '请输入AppKey', trigger: 'blur'},
          ],

        },


        modelshow:false,
        modelset:true,
        modeldata:{
          collage_notify:'',
          buying_notify:'',
          card_notify:'',
          shop_notify:'',
          product_notify:'',
          reduce_notify:'',
          voucher_notify:'',
          proxy_notify:'',
          promotion_notify:''
        },

        rules2:{
          collage_notify: [
          {required: true, message: '请输入模板消息ID', trigger: 'blur'},
          ],
          buying_notify: [
          {required: true, message: '请输入模板消息ID', trigger: 'blur'},
          ],
          card_notify: [
          {required: true, message: '请输入模板消息ID', trigger: 'blur'},
          ],
          shop_notify: [
          {required: true, message: '请输入模板消息ID', trigger: 'blur'},
          ],
          product_notify: [
          {required: true, message: '请输入模板消息ID', trigger: 'blur'},
          ],
          reduce_notify: [
          {required: true, message: '请输入模板消息ID', trigger: 'blur'},
          ],
          voucher_notify: [
          {required: true, message: '请输入模板消息ID', trigger: 'blur'},
          ],
          proxy_notify: [
          {required: true, message: '请输入模板消息ID', trigger: 'blur'},
          ],
          promotion_notify: [
          {required: true, message: '请输入模板消息ID', trigger: 'blur'},
          ],
        }


      };
    },

    methods:{
      checkPer(){
        var per = sessionStorage.getItem('permissions');
        if(per.indexOf('txConfig')>-1){
          this.checkper1=true;
        }
      },

      getconfig(){
        var allParams = '';
        wxconfigGet(allParams).then((res) => {
          if(res.data==null){
            this.show=true
            this.set=false
          }else{
            this.wxset=res.data
          }
        });
      },

      getmodel(){
        var allParams = '';
        wxmodelGet(allParams).then((res) => {
          // console.log(res.data=='')
          if(res.data==''){
            this.modelshow=true
            this.modelset=false
          }else{
            this.modeldata=res.data
          }
        });
      },

      handleSuccess(res, file) {
        this.wechatset.File.push(res.data.url)
        console.log(res.data.url)
      },


      handleRemove(file, fileList) {
        this.wechatset.File=[]
        for(var i=0;i<fileList.length;i++){
          this.wechatset.File.push(res.data.url)
        }
      },

      handleExceed(files, fileList) {
        this.$message.warning(`只能上传 2 个文件`);
      },

      handleError(err, file, fileLis){
        Message({
          message: "请上传pem格式文件",
          type: 'error'
        });
        // console.log(typeof err)
        //  err=err.Remove(0,6);
        // console.log(JSON.parse(err))
      },
      
      changebase(){
        this.show=true
        this.set=false
      },

      confirm(){
        this.$refs.wechatset.validate((valid) => {
          if (valid) {
           // console.log(this.wechatset.File.length!==2)
           if(this.wechatset.File.length!==2){
            Message({
              message: "请上传两个证书",
              type: 'error'
            });
          }else{
            var allParams={
              app_id:this.wechatset.app_id,
              app_secret:this.wechatset.app_secret,
              mch_id:this.wechatset.mch_id,
              api_key:this.wechatset.api_key,
              ssl_cert:this.wechatset.File[0],
              ssl_key:this.wechatset.File[1],
            }
            console.log(allParams)
            wxconfigPost(allParams).then((res) => {
              console.log(res)
              if (res.msg === "ok") {
               this.$message({
                message: '提交成功',
                type: 'success'
              });
               this.getconfig()
               this.show=false
               this.set=true
             } else {
               this.$message({
                message: res.msg,
                type: 'error'
              });
             }
           });
          }
        }else{
          return false;
        }
      })
      },

      cancel(){
        this.show=false
        this.set=true
      },

      changemodel(){
        this.modelshow=true
        this.modelset=false
      },

      postmodel(){//wxmodelPost

        this.$refs.modeldata.validate((valid) => {
          if (valid) {

            var allParams=this.modeldata
            console.log(allParams)
            wxmodelPost(allParams).then((res) => {
              console.log(res)
              if (res.msg === "ok") {
               this.$message({
                message: '提交成功',
                type: 'success'
              });
               this.modelshow=false
               this.modelset=true
               this.getmodel()
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


      cancelmodel(){
        this.modelshow=false
        this.modelset=true
      },
    },

    mounted: function(){
      this.getconfig();
      this.getmodel();
      this.checkPer();
    }
  }
</script>

<style scoped>
.grey{
  color: #aaa;
  float: left;
}
</style>