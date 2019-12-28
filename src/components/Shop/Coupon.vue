<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商家管理</el-breadcrumb-item>
        <el-breadcrumb-item>优惠券</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
     <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" size="small" @click="newone" v-show="checkper2">新增优惠券</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" border stripe size="small" style="width:95%">
      <el-table-column prop="store.name" label="店铺名称" min-width="200" align="center" v-if="1">
      </el-table-column>

      <el-table-column prop="name" label="优惠券标题" min-width="200" align="center">
      </el-table-column>

      <el-table-column prop="end" label="过期时间" min-width="200" align="center">
      </el-table-column>

      <el-table-column prop="limit_price" label="使用条件" min-width="200" align="center">
      </el-table-column>

      <el-table-column prop="price" label="优惠金额" min-width="200" align="center">
      </el-table-column>

      <el-table-column prop="created_at" label="创建时间" min-width="200" align="center">
      </el-table-column>

      <el-table-column label="状态" min-width="200" align="center">
       <template slot-scope="scope">
        <el-button type="success" size="mini" v-show="scope.row.enable==1&&checkper1" @click="changestate(scope.$index, scope.row)">启用</el-button>
        <el-button type="info" size="mini" v-show="scope.row.enable==0&&checkper1" @click="changestate(scope.$index, scope.row)">停用</el-button>
      </template>
    </el-table-column>

    <el-table-column label="操作" min-width="200" align="center">
     <template slot-scope="scope">
      <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)" v-show="checkper2">编辑</el-button>
      <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)" v-show="checkper3">删除</el-button>
    </template>
  </el-table-column>

</el-table>

<el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
</el-pagination>
</el-col>

<el-col>
  <el-dialog :title="diatitle" title="新增优惠券" :visible.sync="dialogNewVisible" width="500" center style="min-width: 500px">
    <el-form ref="newcoupon" :model="newcoupon" label-width="120px" :rules="rules">
      <el-form-item label="标题:" prop="title">
        <el-input v-model="newcoupon.title" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="过期时间:">
        <el-date-picker v-model="newcoupon.end" type="date" :picker-options="pickerOptions" value-format="yyyy-MM-dd" @change="getSTime" style="width:500px;" :editable=false placeholder="请选择过期时间(至少两天后过期)">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="使用条件:" prop="man">
        <el-input v-model="newcoupon.man" placeholder="请输入使用条件"></el-input>
      </el-form-item>

      <el-form-item label="优惠金额:" prop="jian">
        <el-input v-model="newcoupon.jian" placeholder="请输入优惠金额"></el-input>
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


  import { couponPost } from '../../api/api';
  import { couponGet } from '../../api/api';
  import { couponDel } from '../../api/api';
  import { couponstate } from '../../api/api';

  export default {
    data() {
      var checkvalue = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('此项不能为空'));
        }
        setTimeout(() => {
          if (Math.sign(value) == 1) {
            if(value%1 === 0){
             callback();
           }else{
            callback();
          }
        } else if(Math.sign(value) == 0) {
          callback(new Error('不能为0'));
        } else if(Math.sign(value) == -1) {
          callback(new Error('请输入正数'));
        }else{
          callback(new Error('请输入数字'));
        }
      }, 100);
      };

      return {
        diatitle:'新增优惠券',
        putorup:'new',
        editId:'',
        delId:'',

        currentPage: 1,
        list:[],
        count:0,
        limit:10,
        dialogNewVisible:false,
        dialogDelVisible:false,
        newcoupon:{
          title:'',
          man:'',
          jian:'',
          end:''
        },
        date:'',
        rules: {
          title: [{required: true, trigger: 'blur',message: '请输入标题'}],
          man: [{required: true, validator: checkvalue, trigger: 'blur'}],
          jian: [{required: true, validator: checkvalue, trigger: 'blur'}],
        },

        pickerOptions:{
          disabledDate(time) {
            // return time.getTime() < Date.now() - 8.64e7;
            let curDate = (new Date()).getTime();
            let two = 2 * 24 * 3600 * 1000;
            let twoday = curDate + two;
            return time.getTime() < Date.now() || time.getTime() < twoday;
          }
        },


        checkper1:false,
        checkper2:false,
        checkper3:false,
      };
    },

    methods:{
      getlist(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit;
        couponGet(allParams).then((res) => {
          // console.log(res.data.data)
          this.list=res.data.data;
          this.count=res.data.count;
        });
      },

      newone(){
        this.dialogNewVisible=true
        this.newcoupon={
          title:'',
          man:'',
          jian:'',
          end:''
        };
      },

      getSTime(val){
        // console.log(val)
        this.newcoupon.end=val;
      },

      save(){
        if(this.newcoupon.end==''){
          this.$message.error(`请选择有效时间`);
          return
        }

        this.$refs.newcoupon.validate((valid) => {
          if (valid) {
            console.log(this.newcoupon)
            var allParams={
              end:this.newcoupon.end,
              name:this.newcoupon.title,
              price:this.newcoupon.jian,
              limit_price:this.newcoupon.man
            }

            if(this.editId!==0){
              allParams.id=this.editId
            }

            couponPost(allParams).then((res) => {
              if (res.msg === "ok") {
               this.$message({
                message: '提交成功',
                type: 'success'
              });
               this.getlist();
               this.newcoupon={
                title:'',
                man:'',
                jian:'',
                end:''
              };
              this.editId=0

              this.dialogNewVisible=false
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

      handleEdit(index, row){
        // console.log(row.end.split(' ')[0])
        this.diatitle='编辑优惠券';
        this.putorup='put';
        this.dialogNewVisible=true
        this.editId = row.id;
        this.newcoupon={
          title:row.name,
          man:row.limit_price,
          jian:row.price,
          end:row.end.split(' ')[0],
          id:row.id
        }
      },

      handleDelete(index, row) {
        this.dialogDelVisible = true;
        this.delId = row.id;
      },

      submitdel(){
        this.dialogDelVisible = false;
        var allParams='?id='+this.delId
        couponDel(allParams).then((res) => {
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


      changestate(index,row){
        var allParams = '?id='+ row.id;
        couponstate(allParams).then((res) => {
         console.log(res)
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

      checkPer(){
        var per = sessionStorage.getItem('permissions');

        if(per.indexOf('quanSet')>-1){
          this.checkper1=true;
        }
        if(per.indexOf('quanAdd')>-1){
          this.checkper2=true;
        }
        if(per.indexOf('quanDel')>-1){
          this.checkper3=true;
        }
      },
    },

    mounted: function () {
      this.getlist();
      this.checkPer();
    }
  }
</script>


<style>

</style>
