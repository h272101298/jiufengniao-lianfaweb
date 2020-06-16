<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商家管理</el-breadcrumb-item>
        <el-breadcrumb-item>商家列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
<!--      <el-form :inline="true">
<el-form-item>
   <el-button type="primary" size="medium" @click="newone">新增店铺</el-button>
 </el-form-item>
 <el-form-item>
   <el-input v-model="filter.name" placeholder="请输入店铺名称" style="min-width: 200px;" ></el-input>
 </el-form-item>
 <el-form-item>
   <el-button type="primary" size="medium" @click="search">搜索</el-button>
   <el-button size="medium" @click="clear">清空</el-button>
 </el-form-item>
</el-form> -->

<el-table :data="list" border stripe size="small" style="width: 60%">
  <el-table-column prop="id" label="编号" min-width="100" align="center">
  </el-table-column>

  <el-table-column prop="name" label="店铺名称" min-width="200" align="center">
  </el-table-column>
  <el-table-column prop="manager" label="掌柜名称" min-width="200" align="center">
  </el-table-column>
  <el-table-column prop="created_at" label="创建时间" min-width="200" align="center">
  </el-table-column>
<!--   <el-table-column prop="name" label="商品数量" min-width="200" align="center">
</el-table-column> -->
<!--       <el-table-column prop="type" label="店铺类型" min-width="200" align="center">
        <template slot-scope="scope">
          <span v-show="scope.row.type==1 ? true : false">个人认证</span>
          <span v-show="scope.row.type==2 ? true : false">平台自营</span>
          <span v-show="scope.row.type==3 ? true : false">企业认证</span>
        </template>
      </el-table-column> -->
<!--       <el-table-column prop="name" label="经营类目" min-width="200" align="center">
</el-table-column> -->

<!--       <el-table-column label="操作" min-width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="detail">店铺详情</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
    </el-pagination>
  </el-col>

  <el-col>
    <el-dialog title="店铺详情" :visible.sync="dialogInfoVisible" width="500" center style="min-width: 500px">
      <el-form :model="shopinfo" label-width="120px">
        <el-form-item label="店铺ID：" label-width="120px">
          <label>{{shopinfo.id}}</label>
        </el-form-item>
        <el-form-item label="店铺LOGO：" label-width="120px">
          <img src="/static/images/gold.jpg" alt="" class="logo">
        </el-form-item>
        <el-form-item label="用户名：" label-width="120px">
          <label>{{shopinfo.id}}</label>
        </el-form-item>
        <el-form-item label="密码：" label-width="120px">
          <label>{{shopinfo.id}}</label>
        </el-form-item>
        <el-form-item label="店铺名称：" label-width="120px">
          <label>{{shopinfo.id}}</label>
        </el-form-item>
        <el-form-item label="联系电话：" label-width="120px">
          <label>{{shopinfo.id}}</label>
        </el-form-item>
        <el-form-item label="客服电话：" label-width="120px">
          <label>{{shopinfo.id}}</label>
        </el-form-item>
        <el-form-item label="开户银行：" label-width="120px">
          <label>{{shopinfo.id}}</label>
        </el-form-item>
        <el-form-item label="银行卡号：" label-width="120px">
          <label>{{shopinfo.id}}</label>
        </el-form-item>
        <el-form-item label="收款人：" label-width="120px">
          <label>{{shopinfo.id}}</label>
        </el-form-item>
        <el-form-item label="创建时间：" label-width="120px">
          <label>{{shopinfo.id}}</label>
        </el-form-item>
        <el-form-item label="状态：" label-width="120px">
          <el-tag type="success" v-show="shopinfo.id==1 ? true : false">启用</el-tag>
          <el-tag type="danger" v-show="shopinfo.id==2 ? true : false">禁用</el-tag>
        </el-form-item>
        <el-button type="primary" size="small" @click="save" style="margin-left: calc(50% - 28px);">确定</el-button>
      </el-form>
    </el-dialog>
  </el-col>



</el-row>
</template>



<script>
  import { shopGet } from '../../api/api';


  export default {
    data() {
      return {
        filter:{
          name:''
        },
        list:[],
        currentPage: 1,
        count:0,
        limit:10,
        dialogInfoVisible:false,
        shopinfo:{
          id:1
        },
      };
    },

    methods:{
      getlist(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit;
        shopGet(allParams).then((res) => {
          this.list=res.data.data;
          this.count=res.data.count;
        });
      },

      detail(){
        this.dialogDelVisible=true
      },

      save(){
        this.dialogInfoVisible=false
      },

      search(){
        this.getlist()
      },

      clear(){
        this.filter={
          name:''
        }
      },

      newone(){
        this.$router.push({ path: '/Shop/Newshop' });
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
    }
  }
</script>


<style>
.logo{
  max-width: 300px;
  margin-left: 20px;
}
</style>
