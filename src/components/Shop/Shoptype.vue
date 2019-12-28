<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商家管理</el-breadcrumb-item>
        <el-breadcrumb-item>经营类目</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
     <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" size="medium" @click="newone" v-show="checkper1">新增类目</el-button>
      </el-form-item>
<!--       <el-form-item>
        <el-input v-model="filter.name" placeholder="请输入用户名/编号" style="min-width: 200px;" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="newone">搜索</el-button>
        <el-button size="medium" @click="newone">清空</el-button>
      </el-form-item> -->
    </el-form>

    <el-table :data="list" border stripe size="small" style="width: 1001px">
      <el-table-column prop="id" label="类目编号" width="200" align="center">
      </el-table-column>
      <el-table-column prop="title" label="类目名称" width="500" align="center">
      </el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)" v-show="checkper1">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)" v-show="checkper2">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
    </el-pagination>
  </el-col>

  <el-col>
    <el-dialog :title="diatitle" :visible.sync="dialogNewVisible" width="500" center style="min-width: 500px">
      <el-form ref="newadv" :model="newadv" label-width="120px">

        <el-form-item label="类目名称:">
          <el-input v-model="newadv.link" placeholder="请输入类目名称"></el-input>
        </el-form-item>

        <el-form-item style="margin-left: calc(50% - 200px);">
          <el-button type="primary" @click="save()">保 存</el-button>
          <el-button @click="dialogNewVisible = false">取 消</el-button>
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
  import {categoriesGet} from '../../api/api';
  import {categoryPost} from '../../api/api';
  import {categoryDel} from '../../api/api';



  export default {
    data() {
      return {
        currentPage: 1,
        list:[],
        loading: false,
        count:0,
        limit:10,
        dialogNewVisible:false,
        dialogDelVisible:false,
        // filter:{
        //   name:''
        // },
        putorup:'up',
        newadv:{
          link:''
        },
        diatitle:'新增类目',
        editId:'',
        delId:'',


        checkper1:false,
        checkper2:false,
      };
    },

    methods:{
      checkPer(){
        var per = sessionStorage.getItem('permissions');
      // console.log(per)
      if(per.indexOf('storeCategoryAdd')>-1){
        this.checkper1=true;
      }

      var per = sessionStorage.getItem('permissions');
      // console.log(per)
      if(per.indexOf('storeCategoryDel')>-1){
        this.checkper2=true;
      }
    },


    getlist(){
      var allParams = '?page='+ this.currentPage + '&limit=' + this.limit;
      categoriesGet(allParams).then((res) => {
        this.list=res.data.data;
        this.count=res.data.count;
      });
    },

    newone(){
     this.putorup='up';
     this.diatitle='新增类目'
     this.dialogNewVisible=true
     this.newadv.link=''
   },

   handleEdit(index, row){
     this.putorup='put';
     this.diatitle='编辑类目'
     this.dialogNewVisible=true
     this.newadv.link=row.title
     this.editId = row.id;
   },


   save(){

    if(this.newadv.link==''){
      this.$message({
        message: '请输入类目名称',
        type: 'error'
      });
    }else{
      if( this.putorup=='put'){
        var allParams = {
          title:this.newadv.link,
          id:this.editId
        };
      }else{
        var allParams = {
          title:this.newadv.link
        };
      }
      categoryPost(allParams).then((res) => {
        if (res.msg === "ok") {
         this.$message({
          message: '提交成功',
          type: 'success'
        });
         this.getlist();
         this.dialogNewVisible=false
       } else {
         this.$message({
          message: res.msg,
          type: 'error'
        });
       }
     });
    }
  },

  handleDelete(index, row) {
    this.dialogDelVisible = true;
    this.delId = row.id;
  },

  submitdel(){
    this.dialogDelVisible = false;
    var allParams='?id='+this.delId
    categoryDel(allParams).then((res) => {
      console.log(res)
      if (res.msg === "ok") {
       this.$message({
        message: '提交成功',
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
},

mounted: function () {
  this.getlist();
  this.checkPer();
}
}
</script>


<style>
.logo{
  max-width: 300px;
  margin-left: 20px;
}
</style>
