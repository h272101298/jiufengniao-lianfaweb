<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>限时砍价</el-breadcrumb-item>
        <el-breadcrumb-item>活动审核</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <el-table :data="list" border stripe style="width:95%" size="small">
        <el-table-column prop="product.name" label="商品名称" min-width="250" align="center">
        </el-table-column>
        <el-table-column prop="description" label="活动标题" min-width="250" align="center">
        </el-table-column>
        <el-table-column prop="time" label="砍价限时（小时）" min-width="120" align="center">
        </el-table-column>
<!--         <el-table-column prop="origin_price" label="原价" min-width="100" align="center">
        </el-table-column>
        <el-table-column prop="min_price" label="底价" min-width="100" align="center">
        </el-table-column> -->
        <el-table-column prop="clickNum" label="砍价次数" min-width="100" align="center">
        </el-table-column>
        <el-table-column prop="state" label="状态" min-width="100" align="center">
          <template slot-scope="scope">
            <el-tag type="info" v-show="scope.row.state==1">待审核</el-tag>
            <el-tag type="success" v-show="scope.row.state==2">已通过</el-tag>
            <el-tag type="danger" v-show="scope.row.state==3">不通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="300" align="center">
         <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)" v-show="scope.row.state==1&&checkper1">编辑</el-button>
          <el-button type="success" size="small" @click="handlePass(scope.$index, scope.row)" v-show="scope.row.state==1&&checkper2" data-state="2">通过</el-button>
          <el-button type="info" size="small" @click="handleReject(scope.$index, scope.row)" v-show="scope.row.state==1&&checkper2" data-state="3">不通过</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)" v-show="checkper3">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
    </el-pagination>
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
  import { KancheckGet } from '../../api/api';
  import { Kancheck } from '../../api/api';
  import { Kandelete } from '../../api/api';

  import { Message } from 'element-ui';

  export default {
    data() {
      return {
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
      };
    },

    methods:{
      checkPer(){
        var per = sessionStorage.getItem('permissions');
        if(per.indexOf('modifyBargainPromotion')>-1){
          this.checkper1=true;
        }

        if(per.indexOf('checkBargainPromotion')>-1){
          this.checkper2=true;
        }

        if(per.indexOf('delBargainPromotion')>-1){
          this.checkper2=true;
        }
      },

      getlist(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit+ '&state=1';
        KancheckGet(allParams).then((res) => {
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
        console.log(row.id)
        sessionStorage.setItem('kancheckid', row.id);
        this.$router.push({ path: '/Kan/Kanchange' });
      },

      handlePass(index, row){
        var allParams = '?id='+row.id+'&state=2';
        Kancheck(allParams).then((res) => {
          console.log(res)
          this.$message.success(`审核成功`);
          this.getlist()
        });
      },

      handleReject(index, row){
        var allParams = '?id='+row.id+'&state=3';
        Kancheck(allParams).then((res) => {
          this.$message.success(`审核成功`);
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
        Kandelete(allParams).then((res) => {
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
      }
    },

    mounted: function () {
      this.getlist();
      this.checkPer();
    }
  }
</script>

<style scope>
.icon{
  width: 20px;
  height: 20px;
  margin: 2px;
}
</style>
