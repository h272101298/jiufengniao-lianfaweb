<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>集卡牌</el-breadcrumb-item>
        <el-breadcrumb-item>通过列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="通过列表" name="list">

          <el-table :data="list" border stripe style="width:95%" size="small">
            <el-table-column prop="product.name" label="商品名称" width="178" align="center">
            </el-table-column>

            <el-table-column prop="description" label="活动标题" width="178" align="center">
            </el-table-column>

            <el-table-column prop="list" label="卡牌图片" width="240" align="center">
              <template slot-scope="scope">
                <img v-for="item in scope.row.list" :src="item.cover" style="max-width:35px;max-height:60px;margin-right: 5px;" />
              </template>
            </el-table-column>

            <el-table-column prop="start" label="活动开始时间" width="140" align="center">
            </el-table-column>
            <el-table-column prop="end" label="活动结束时间" width="140" align="center">
            </el-table-column>
            <el-table-column prop="offer" label="折扣" width="75" align="center">
            </el-table-column>
            <el-table-column prop="number" label="库存" width="75" align="center">
            </el-table-column>

            <el-table-column prop="clickCount" label="总点击数" min-width="75" align="center">
            </el-table-column>
            <el-table-column prop="exchangeCount" label="已兑换数" min-width="75" align="center">
            </el-table-column>

            <el-table-column prop="" label="平均点击数" min-width="85" align="center">
              <template slot-scope="scope">
                <span v-show="scope.row.exchangeCount!==0">{{ scope.row.clickCount / scope.row.exchangeCount}}</span>
                <span v-show="scope.row.exchangeCount==0">0</span>
              </template>
            </el-table-column>

            <el-table-column prop="clickNum" label="期望平均点击数" min-width="110" align="center">
            </el-table-column>

            <el-table-column prop="enable" label="状态" min-width="80" align="center">
             <template slot-scope="scope">
              <el-button type="success" size="small" @click="handleEdit(scope.$index, scope.row)" v-show="scope.row.enable==1&&checkper1">上线</el-button>
              <el-button type="info" size="small" @click="handleEdit(scope.$index, scope.row)" v-show="scope.row.enable==0&&checkper1">下线</el-button>
            </template>
          </el-table-column>

          <el-table-column label="操作" min-width="140" align="center">
           <template slot-scope="scope">
            <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)" v-show="checkper2">删除</el-button>

            <el-button type="success" size="small" @click="handleNotify(scope.$index, scope.row)">推送</el-button>

          </template>
        </el-table-column>

      </el-table>

      <el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
      </el-pagination>

    </el-tab-pane>

    <el-tab-pane label="卡牌设置" name="base" :disabled="!checkper4">

      <el-form label-width="120px" width="900px" center style="width: 1000px" ref="defaultcard" :model="defaultcard" v-show="havecard">
        <el-form-item prop="images" label="上传图片：">
          <el-upload :action="upurl" :data="uptoken" list-type="picture-card" :on-remove="handleRemove" :on-success="handlelistSuccess" :file-list="defaultcard.images" :multiple="true" accept="image/*" :on-exceed="handleExceed" :limit="5">
            <img src="../../../static/images/default1.png" class="pre-img" style="width:145px;height:144px;display: block" >
          </el-upload>
        </el-form-item>

        <el-form-item style="">
          <el-button type="primary" @click="save()" size="medium">提交</el-button>
          <el-button @click="cancel" size="medium">取 消</el-button>
        </el-form-item>
      </el-form>



      <div v-show="!havecard" class="cardbox">

        <img v-for="item in defcard" :src="item.cover" class="card">

      </div>

      <!-- <p v-show="!havecard">请设置默认卡牌图片</p> -->
      <el-button type="primary" @click="editcard()" size="medium" v-show="!havecard">设置</el-button>

    </el-tab-pane>
  </el-tabs>
</el-col>




<el-col>
  <el-dialog title="活动推送" :visible.sync="dialogTzVisible" width="500" center style="min-width: 500px">
    <el-form ref="newnotify" :model="newnotify" label-width="120px" :rules="rules" status-icon>
      <el-form-item label="活动主题:" prop="title">
        <el-input v-model="newnotify.title" placeholder="请输入活动主题(20字以内)" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="活动时间:" prop="time">
        <el-date-picker v-model="date" type="daterange" range-separator="-" value-format="yyyy-MM-dd" @change="getSTime" style="width:500px;" :editable=false start-placeholder="开始时间" end-placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input v-model="newnotify.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-form-item style="margin-left: calc(50% - 200px);">
        <el-button type="primary" @click="submitnotify()">提 交</el-button>
        <el-button @click="dialogTzVisible = false">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</el-col>




<el-col>
  <el-dialog title="删除不可恢复，是否确定删除？" :visible.sync="dialogDelVisible" width="30%">
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitdel()">确 定</el-button>
      <el-button @click="dialogDelVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</el-col>

</el-row>
</template>



<script>

  import { CardcheckGet } from '../../api/api';
  import { DefaultCardPost } from '../../api/api';
  import { DefaultCardGet } from '../../api/api';
  import { Cardupdown } from '../../api/api';
  import { Carddelete } from '../../api/api';
  import { Cardhot } from '../../api/api';

  import qiniu from '../../api/qiniu';

  import { hdnotify } from '../../api/api';


  import { Message } from 'element-ui';

  export default {
    data() {
      return {
        uptoken:{
          token:qiniu.token,
        },
        upurl:qiniu.upurl,

        activeName:'list',

        currentPage: 1,

        list:[],

        count:0,
        limit:10,
        dialogNewVisible:false,
        dialogDelVisible:false,
        filter:{

        },
        editId:'',
        delId:'',

        checkper1:false,
        checkper2:false,
        checkper3:false,
        checkper4:false,

        defcard:[
        {cover:'../static/images/default1.png'},
        {cover:'../static/images/default1.png'},
        {cover:'../static/images/default1.png'},
        {cover:'../static/images/default1.png'},
        {cover:'../static/images/default1.png'}
        ],
        havecard:false,

        defaultcard:{
          images:[]
        },




        dialogTzVisible:false,

        notifyid:0,
        date:'',

        newnotify:{
          id:'',
          type:'card',
          title:'',
          time:'',
          remark:'' 
        },
        rules:{
          title:[
          {required: true, message: '请输入活动主题', trigger: 'blur'},
          ],  
          remark: [
          {required: true, message: '请输入备注', trigger: 'blur'},
          ],
        },


      };
    },

    methods:{

     handleNotify(index, row){
      this.newnotify.id=row.id
      this.dialogTzVisible=true
    },

    getSTime(val){
      this.newnotify.time=""+val[0]+"——"+val[0]+"";
      console.log(this.newnotify.time)

    },

    submitnotify(){
      console.log(this.newnotify)

      if(this.newnotify.time==''){
        this.$message.error(`请选择活动时间`);
        return
      }

      this.$refs.newnotify.validate((valid) => {
        if (valid) {
          var allParams=this.newnotify
          hdnotify(allParams).then((res) => {

            this.$message.success(`提交成功`);
            this.dialogTzVisible=false
            this.newnotify={
              type:'bargain',
              title:'',
              time:'',
              remark:''
            }
          });

        }else{
          return false;
        }
      })
    },




    checkPer(){
      var per = sessionStorage.getItem('permissions');
      if(per.indexOf('enableCardPromotion')>-1){
        this.checkper1=true;
      }

      if(per.indexOf('delCardPromotion')>-1){
        this.checkper2=true;
      }

      if(per.indexOf('hotCardPromotion')>-1){
        this.checkper3=true;
      }

      if(per.indexOf('addDefaultCards')>-1){
        this.checkper4=true;
      }
    },


    getlist(){
      var allParams = '?page='+ this.currentPage + '&limit=' + this.limit + '&state=2';
      CardcheckGet(allParams).then((res) => {
        this.list=res.data.data;
        this.count=res.data.count
      });
    },


    clear(){
      this.filter={
        title:'',
        level:''
      }
    },


    handleEdit(index, row){
      // Cardupdown

      var allParams = '?id='+row.id;
      Cardupdown(allParams).then((res) => {
        this.$message.success(`修改成功`);
        this.getlist()
      });
    },

    handleDelete(index, row) {
      this.dialogDelVisible = true;
      this.delId = row.id;
    },

    submitdel(){
      this.dialogDelVisible = false;
      var allParams='?id='+this.delId
      Carddelete(allParams).then((res) => {
        // console.log(res)
        if (res.msg === "ok") {
         this.$message({
          message: '删除成功',
          type: 'success'
        });
         this.getlist();
         this.dialogDelVisible = false;
       } else {
         this.$message({
          message: res.msg,
          type: 'error'
        });
       }
     });
    },

    changehot(index){
      var allParams = '?id='+ index.id;
      Cardhot(allParams).then((res) => {
       console.log(res)
       if (res.msg === "ok") {
         this.$message({
          message: '设置成功',
          type: 'success'
        });
         this.getlist();
       } else {
         this.$message({
          message: res.msg,
          type: 'error'
        });
       }
     })
    },



    beforeUpload(file) {
      // const isLt1M = file.size / 1024 / 1024 < 1;
      // if (!isLt1M) {
      //   this.$message.error('图片大小不能超过 1MB!');
      // }
      // return isLt1M;
    },


    handlelistSuccess(res, file,fileList){
      this.defaultcard.images=[]
      for(var i=0;i<fileList.length;i++){
        this.defaultcard.images.push(qiniu.showurl+ fileList[i].response.key)
      }
    },

    handleRemove(file, fileList) {
      this.defaultcard.images=[]
      for(var i=0;i<fileList.length;i++){
        this.defaultcard.images.push(qiniu.showurl+ fileList[i].response.key)
      }
    },

    handleExceed(files, fileList) {
      this.$message.warning(`只能上传5张图片`);
    },

    editcard(){
      var that= this
      that.havecard=true
    },


    getdefcard(){//DefaultCardGet
      var allParams = '';
      DefaultCardGet(allParams).then((res) => {

        if(res.data==''){
          this.havecard=false
        }else{
          this.defcard=res.data;
          this.havecard=false
        }
      });
    },

    save(){//DefaultCardPost
      // console.log(this.defaultcard.images)

      var allParams={list:this.defaultcard.images}
      console.log(typeof allParams)
      DefaultCardPost(allParams).then((res) => {
        // console.log(res)
        if (res.msg === "ok") {
         this.$message({
          message: '提交成功',
          type: 'success'
        });
         this.havecard=false
         this.getdefcard();
       } else {
         this.$message({
          message: res.msg,
          type: 'error'
        });
       }
     });
    },


    cancel(){
      this.havecard=false
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getlist();
    },


    handleSizeChange(val){
      this.limit = val;
      this.getlist();
    },
  },

  mounted: function () {

    this.getlist();

    this.getdefcard();
    this.checkPer();
  }
}
</script>


<style scoped>
.icon{
  width: 20px;
  height: 20px;
  margin: 2px;
}
.cardbox{
  width: 600px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content:flex-start;
}
.card{
  width: 100px;
  height: 150px;
  margin-right: 20px;
  border:1px solid #aaa; 
}

</style>
