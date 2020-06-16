<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商家管理</el-breadcrumb-item>
        <el-breadcrumb-item>提现申请</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
          <el-form-item>
            <el-button type="primary" @click="handleEdit()" size="small">申请提现</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <el-table :data="list" border stripe size="small" style="width: 95%;">
        <el-table-column prop="created_at" label="提现时间" min-width="100" align="center">
        </el-table-column>
        <el-table-column prop="price" label="提现金额" min-width="200" align="center">
        </el-table-column>
        <el-table-column prop="name" label="提现状态" min-width="200" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-show="scope.row.state==2">已拒绝</el-tag>
            <el-tag type="success" v-show="scope.row.state==1">已发放</el-tag>
            <el-tag type="info" v-show="scope.row.state==0">未发放</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bank" label="开户银行" min-width="200" align="center">
        </el-table-column>
        <el-table-column prop="account" label="银行卡号" min-width="200" align="center">
        </el-table-column>
      </el-table>

      <el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
      </el-pagination>
    </el-col>


    <el-col>
      <el-dialog title="申请提现" :visible.sync="dialogNewVisible" width="500" center style="min-width: 500px">
        <el-form ref="txapply" :model="txapply" label-width="120px" :rules="rules">
          <el-form-item label="总营业额:">
            <label>￥{{amount}}</label>
          </el-form-item>
          <el-form-item label="可提现:">
            <label>￥{{storeAmount}}</label>
          </el-form-item>

          <el-form-item label="开户银行:" prop="bank">
            <el-input v-model="txapply.bank" placeholder="请输入开户银行"></el-input>
          </el-form-item>
          <el-form-item label="银行账号:" prop="account">
            <el-input v-model="txapply.account" placeholder="请输入银行账号"></el-input>
          </el-form-item>
          <el-form-item label="提现金额:" prop="price">
            <el-input v-model="txapply.price" type="number" placeholder="请输入提现金额"></el-input>
          </el-form-item>
          <el-form-item style="margin-left: calc(50% - 200px);">
            <el-button type="primary" @click="handleconfirm()" size="small">确认申请</el-button>
            <el-button @click="dialogNewVisible = false" size="small">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-col>


    <el-col>
      <el-dialog title="确认申请提现？" :visible.sync="dialogDelVisible" width="30%">
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogDelVisible  = false" size="small">取 消</el-button>
          <el-button type="primary" @click="submit()" size="small">确 定</el-button>
        </div>
      </el-dialog>
    </el-col>

  </el-row>
</template>



<script>
  import { countdataGet } from '../../api/api';

  import { shoptxPost } from '../../api/api';
  import { shoptxGet } from '../../api/api';


  import { Message } from 'element-ui';


  export default {
    data() {
      return {
        currentPage: 1,
        count:0,
        limit:10,
        list:[],
        dialogDelVisible:false,
        dialogNewVisible:false,


        txapply:{
          bank:'',
          account:'',
          price:''
        },

        rules: {
          bank: [{required: true, trigger: 'blur',message: '请输入开户银行'}],
          account: [{required: true, trigger: 'blur',message: '请输入银行账号'}],
          price: [{required: true, trigger: 'blur',message: '请输入提现金额'}],
        },


        amount:0,
        storeAmount:0,

        checkper1:false,
      };
    },

    methods:{
      checkPer(){
        var per = sessionStorage.getItem('permissions');
        if(per.indexOf('withdrawCheck')>-1){
          this.checkper1=true;
        }
      },

      getdata(){
        var allParams = '';
        countdataGet(allParams).then((res) => {
          this.amount=res.data.amount
          this.storeAmount=res.data.storeAmount
        });
      },


      getlist(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit;
        shoptxGet(allParams).then((res) => {
          this.list=res.data.data;
          this.count=res.data.count;
        });
      },

      handleEdit(row){
        this.dialogNewVisible=true
      },

      handleconfirm(row){
        this.$refs.txapply.validate((valid) => {
         if (valid) {
          console.log(this.storeAmount<this.txapply.price)
          if(this.storeAmount<this.txapply.price){
            Message({
              message: "提现金额大于可提现金额",
              type: 'error'
            });
          }else{
            this.dialogDelVisible=true
          }
        }else{
          return false;
        }
      })
      },

      submit(){
        var allParams = this.txapply;
        shoptxPost(allParams).then((res) => {
          console.log(res)
          this.dialogDelVisible=false
          this.dialogNewVisible=false
          Message({
            message: "提交成功",
            type: 'success'
          });
          this.getlist();
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
      this.getdata();
      this.checkPer();
    }
  }
</script>


<style>

</style>
