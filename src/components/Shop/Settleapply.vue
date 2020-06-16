<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商家管理</el-breadcrumb-item>
        <el-breadcrumb-item>入驻申请</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

      <el-table :data="list" border stripe size="small">
        <el-table-column prop="name" label="申请人姓名" min-width="100" align="center">
        </el-table-column>
        <el-table-column prop="phone" label="申请人电话" min-width="150" align="center">
        </el-table-column>
        <el-table-column prop="storeName" label="店铺名称" min-width="180" align="center">
        </el-table-column>
        <el-table-column prop="category" label="主营类目" min-width="150" align="center">
        </el-table-column>
        <el-table-column prop="type" label="申请类型" min-width="150" align="center">
        </el-table-column>
        <el-table-column prop="pictuer" label="营业执照" min-width="180" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.pictuer" style="max-width:100px;max-height:100px;" />
          </template>
        </el-table-column>
        <el-table-column prop="city" label="所在城市" min-width="180" align="center">
        </el-table-column>
        <el-table-column prop="created_at" label="申请时间" min-width="180" align="center">
        </el-table-column>
        <el-table-column prop="state" label="申请状态" min-width="150" align="center">
        </el-table-column>
        <el-table-column label="操作" min-width="180" align="center" v-show="checkper1">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)" v-show="scope.row.state=='待审核' ? true : false">通过</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)" v-show="scope.row.state=='待审核' ? true : false">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
      </el-pagination>
    </el-col>


    <el-col>
      <el-dialog title="拒绝不可恢复，是否确定拒绝？" :visible.sync="dialogDelVisible" width="30%">
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitdel()">确 定</el-button>
          <el-button @click="dialogDelVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </el-col>

  </el-row>
</template>



<script>

  import { sappliesGet } from '../../api/api';
  import { sapplyPost } from '../../api/api';


  export default {
    data() {
      return {
        list:[],
        currentPage: 1,
        count:0,
        limit:10,
        dialogDelVisible:false,
        delId:'',

        checkper1:false,
      };
    },

    methods:{
      checkPer(){
        var per = sessionStorage.getItem('permissions');

        if(per.indexOf('settleCheck')>-1){
          this.checkper1=true;
        }
      },



      getlist(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit;
        sappliesGet(allParams).then((res) => {
          this.list=res.data;
          this.count=res.count;
        });
      },

      handleEdit(index, row){
        var allParams={
          id:row.check_id,
          state:1
        }
        sapplyPost(allParams).then((res) => {
          console.log(res)
          if (res.msg === "ok") {
           this.$message({
            message: '审核成功',
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

      handleDelete(index, row) {
        this.dialogDelVisible = true;
        this.delId = row.check_id;
      },

      submitdel(){
        this.dialogDelVisible = false;
        var allParams={
          id:this.delId,
          state:2
        }
        sapplyPost(allParams).then((res) => {
          console.log(res)
          if (res.msg === "ok") {
           this.$message({
            message: '审核成功',
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
