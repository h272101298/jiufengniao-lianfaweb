<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>集卡牌</el-breadcrumb-item>
        <el-breadcrumb-item>活动审核</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

      <el-table :data="list" border stripe style="width:95%" size="small">
        <el-table-column prop="product.name" label="商品名称" width="200" align="center">
        </el-table-column>

        <el-table-column prop="description" label="活动标题" width="200" align="center">
        </el-table-column>

        <el-table-column prop="list" label="卡牌图片" width="240" align="center">
          <template slot-scope="scope">
            <img v-for="item in scope.row.list" :src="item.cover" style="max-width:35px;max-height:60px;margin-right: 5px;" />
          </template>
        </el-table-column>

        <el-table-column prop="start" label="活动开始时间" width="150" align="center">
        </el-table-column>
        <el-table-column prop="end" label="活动结束时间" width="150" align="center">
        </el-table-column>
        <el-table-column prop="offer" label="折扣" min-width="95" align="center">
        </el-table-column>
        <el-table-column prop="number" label="库存" min-width="95" align="center">
        </el-table-column>

<!--         <el-table-column prop="" label="总点击数" min-width="95" align="center">
        </el-table-column>
        <el-table-column prop="" label="已兑换数" min-width="95" align="center">
        </el-table-column>
        <el-table-column prop="" label="平均点击数" min-width="95" align="center">
        </el-table-column> -->
        <el-table-column prop="clickNum" label="期望平均点击数" min-width="110" align="center">
        </el-table-column>
        <el-table-column prop="state" label="状态" min-width="90" align="center">
          <template slot-scope="scope">
            <el-tag type="info" v-show="scope.row.state==1">未审核</el-tag>
            <el-tag type="success" v-show="scope.row.state==2">已通过</el-tag>
            <el-tag type="danger" v-show="scope.row.state==3">不通过</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="280" align="center">
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


  import { CardcheckGet } from '../../api/api';
  import { Cardcheck } from '../../api/api';
  import { Carddelete } from '../../api/api';

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
        if(per.indexOf('modifyCardPromotion')>-1){
          this.checkper1=true;
        }

        if(per.indexOf('checkCardPromotion')>-1){
          this.checkper2=true;
        }

        if(per.indexOf('delCardPromotion')>-1){
          this.checkper3=true;
        }
      },


      getlist(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit+ '&state=1';
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
      // console.log(row.id)
      sessionStorage.setItem('cardlist', JSON.stringify(row.list));
      sessionStorage.setItem('cardcheckid', row.id);
      this.$router.push({ path: '/Card/Cardchange' });
    },

    handlePass(index, row){
      var allParams = '?id='+row.id+'&state=2';
      Cardcheck(allParams).then((res) => {
        console.log(res)
        this.$message.success(`审核成功`);
        this.getlist()
      });
    },

    handleReject(index, row){
      var allParams = '?id='+row.id+'&state=3';
      Cardcheck(allParams).then((res) => {
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


<style scope>
.icon{
  width: 20px;
  height: 20px;
  margin: 2px;
}
</style>
