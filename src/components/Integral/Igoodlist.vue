<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>积分商城</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
     <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" size="small" @click="newone" v-if="checkper4">新增商品</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="filter.name" placeholder="请输入商品名称/商品分类" style="min-width: 260px;" size="small"></el-input>
      </el-form-item>

      <el-form-item label="商品状态：">
        <el-select v-model="filter.state" placeholder="全部" @change="changestate" size="small">
          <el-option label="上架" value="0"></el-option>
          <el-option label="下架" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="small" @click="getlist">搜索</el-button>
        <el-button size="small" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" border stripe size="small" style="width:95%;">
      <el-table-column prop="id" label="编号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="cover" label="图片" min-width="100" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.cover" style="max-width:80px;max-height:64px;" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" min-width="200" align="center">
      </el-table-column>
      <el-table-column prop="exchange" label="兑换次数" min-width="100" align="center">
      </el-table-column>

      <el-table-column prop="review" label="审核状态" min-width="100" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-show="scope.row.review==1">已审核</el-tag>
          <el-tag type="info" v-show="scope.row.review==0">未审核</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="state" label="上架状态" min-width="100" align="center" v-if="checkper2">
        <template slot-scope="scope">
          <el-button type="success" size="mini" v-show="scope.row.state==1&&scope.row.review==1" @click="changejia(scope.row)">上架</el-button>
          <el-button type="info" size="mini" v-show="scope.row.state==0&&scope.row.review==1" @click="changejia(scope.row)">下架</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="hot" label="推荐" min-width="100" align="center" v-if="checkper3">
        <template slot-scope="scope">
          <el-button type="success" size="mini" v-show="scope.row.hot==1&&scope.row.review==1&&scope.row.state==1" @click="changehot(scope.row)">是</el-button>
          <el-button type="info" size="mini" v-show="scope.row.hot==0&&scope.row.review==1&&scope.row.state==1" @click="changehot(scope.row)">否</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="created_at" label="创建时间" width="150" align="center">
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">
       <template slot-scope="scope">
        <el-tooltip class="icon" effect="dark" content="编辑" placement="top" v-if="checkper4">
          <img src="../../../static/images/icon/edit.png" @click="handleEdit(scope.$index, scope.row)">
        </el-tooltip>
        <el-tooltip class="icon" effect="dark" content="查看详情" placement="bottom">
          <img src="../../../static/images/icon/look.png" @click="handleSee(scope.$index, scope.row)">
        </el-tooltip>
        <el-tooltip class="icon" effect="dark" content="审核" placement="top" v-if="checkper2">
          <img src="../../../static/images/icon/check.png" v-show="scope.row.review==0" @click="handleCheck(scope.row)">
        </el-tooltip>
        <el-tooltip class="icon" effect="dark" content="删除" placement="bottom" v-if="checkper5">
          <img src="../../../static/images/icon/delete.png" @click="handleDelete(scope.$index, scope.row)">
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
  </el-pagination>
</el-col>


<el-col>
  <el-dialog title="确认删除该商品么？" :visible.sync="dialogDelVisible" width="30%">
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" @click="submitdel()">确 定</el-button>
      <el-button type="primary" @click="dialogDelVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</el-col>


<el-col>
  <el-dialog title="商品预览" :visible.sync="dialogSeeVisible" width="800px" @open="opendialog" center >
    <el-form label-width="100px" :model="currow" label-position='right'>
      <el-form-item label="名称：" class="fw6">
        <span class="fw4">{{currow.name}}</span>
      </el-form-item>

      <el-form-item label="描述：" class="fw6">
        <template slot-scope="scope">
          <span class="fw4">{{currow.description==null ? '暂无' : currow.description }}</span>    
        </template>
      </el-form-item>

      <el-form-item label="分享标题：" class="fw6">
        <template slot-scope="scope">
          <span class="fw4">{{currow.share_title==null ? '暂无' : currow.share_title }}</span>    
        </template>
      </el-form-item>

      <el-form-item label="详细内容：" class="fw6">
        <template slot-scope="scope">
          <div class="fw4" id="detail"></div>
        </template>
      </el-form-item>


    </el-form>
  </el-dialog>
</el-col>


</el-row>
</template>

<script>
  import { igoodGet } from '../../api/api';
  import { igoodDel } from '../../api/api';
  import { igoodhot } from '../../api/api';
  import { igoodCheck } from '../../api/api';
  import { igoodShelf } from '../../api/api';

  export default {
    data() {
      return {
        list:[],

        currentPage: 1,
        count:0,
        limit:10,

        dialogDelVisible:false,
        dialogSeeVisible:false,

        filter:{
          name:'',
          state:''
        },

        checkper1:false,
        checkper2:false,
        checkper3:false,
        checkper4:false,
        checkper5:false,



        currow:'',
        editId:'',
        delId:'',
      }

    },

    methods:{
     getlist(){
      var allParams = '?page='+ this.currentPage + '&limit=' + this.limit+ '&name=' + this.filter.name+ '&state=' + this.filter.state;
      igoodGet(allParams).then((res) => {
        this.list=res.data.data;
        this.count=res.data.count
      });
    },

    newone(){
      this.$router.push({ path: '/Integral/Igoodnew' });
      window.sessionStorage.removeItem('igoodeditid')
    },

    changestate(val){
      this.filter.state=val
    },

    clear(){
      this.filter={
        name:'',
        state:''
      }
      this.getlist();
    },

    changejia(index){
      var allParams = '?id='+ index.id;
      igoodShelf(allParams).then((res) => {
       console.log(res)
       this.getlist();
     });
    },

    handleCheck(index){
      var allParams = '?id='+ index.id;
      igoodCheck(allParams).then((res) => {
       console.log(res)
       this.getlist();
     });
    },

    changehot(index){
      var allParams = '?id='+ index.id;
      igoodhot(allParams).then((res) => {
       console.log(res)
       this.getlist();
     });
    },

    handleSee(index,row) {
      this.currow=row
      this.dialogSeeVisible = true;
    },

    opendialog(){
      setTimeout(() => {
        this.setdetail();
      }, 100);
    },

    setdetail(){
      var seeBox = document.getElementById("detail");
      // console.log(seeBox)
      seeBox.innerHTML=this.currow.detail;
    },

    handleEdit(index, row){
      sessionStorage.setItem('igoodeditid',row.id);
      this.$router.push({ path: '/Integral/Igoodnew' });
    },

    handleDelete(index, row) {
      this.dialogDelVisible = true;
      this.delId = row.id;
    },

    submitdel(){
      this.dialogDelVisible = false;
      var allParams='?id='+this.delId
      igoodDel(allParams).then((res) => {
        console.log(res)
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

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getlist();
    },

    handleSizeChange(val){
      this.limit = val;
      this.getlist();
    },

    checkPer(){
      var per = sessionStorage.getItem('permissions');
      if(per.indexOf('iproductReview')>-1){
        this.checkper1=true;
      }
      if(per.indexOf('iproductShelf')>-1){
        this.checkper2=true;
      }
      if(per.indexOf('iproductSet')>-1){
        this.checkper3=true;
      }
      if(per.indexOf('iproductAdd')>-1){
        this.checkper4=true;
      }
      if(per.indexOf('iproductDel')>-1){
        this.checkper5=true;
      }
    }
  },

  mounted: function () {
   this.getlist();
   this.checkPer()
 }
}
</script>


<style scoped>
.icon{
  width: 20px;
  height: 20px;
  margin: 2px;
}
.seeimg{
  max-width: 150px;
  max-height: 150px;
}
</style>