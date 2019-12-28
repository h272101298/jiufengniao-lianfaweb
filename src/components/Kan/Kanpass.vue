<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>限时砍价</el-breadcrumb-item>
        <el-breadcrumb-item>通过列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">


      <el-table :data="list" border stripe style="width:95%" size="small">
        <el-table-column prop="product.name" label="商品名称" width="200" align="center">
        </el-table-column>

        <el-table-column prop="description" label="活动标题" width="200" align="center">
        </el-table-column>


        <el-table-column prop="time" label="砍价限时（小时）" min-width="120" align="center">
        </el-table-column>
        <el-table-column prop="number" label="库存" width="100" align="center">
        </el-table-column>

        <el-table-column prop="clickNum" label="砍价次数" width="100" align="center">
        </el-table-column>

        <el-table-column prop="count" label="参与人数" width="100" align="center">
        </el-table-column>
        <el-table-column prop="updated_at" label="活动开始时间" min-width="100" align="center">
        </el-table-column>


        <el-table-column prop="enable" label="状态" min-width="90" align="center">
         <template slot-scope="scope">
          <el-button type="success" size="small" @click="handleEdit(scope.$index, scope.row)" v-show="scope.row.enable==1&&checkper1">上线</el-button>
          <el-button type="info" size="small" @click="handleEdit(scope.$index, scope.row)" v-show="scope.row.enable==0&&checkper1">下线</el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="100" align="center">
       <template slot-scope="scope">
        <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)" v-show="checkper2">删除</el-button>

        <el-button type="success" size="small" @click="handleNotify(scope.$index, scope.row)">推送</el-button>

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



</el-row>
</template>



<script>

  import { KancheckGet } from '../../api/api';
  import { Kanupdown } from '../../api/api';
  import { Kandelete } from '../../api/api';
  import { Kanhot } from '../../api/api';

  import { hdnotify } from '../../api/api';


  import { Message } from 'element-ui';

  export default {
    data() {
      return {

        currentPage: 1,
        list:[],
        count:0,
        limit:10,

        dialogDelVisible:false,
        filter:{

        },
        editId:'',
        delId:'',




        dialogTzVisible:false,

        notifyid:0,
        date:'',

        newnotify:{
          id:'',
          type:'bargain',
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



        checkper1:false,
        checkper2:false,

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
        if(per.indexOf('enableBargainPromotion')>-1){
          this.checkper1=true;
        }
        if(per.indexOf('delBargainPromotion')>-1){
          this.checkper2=true;
        }
      },

      getlist(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit + '&state=2';
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
        var allParams = '?id='+row.id;
        Kanupdown(allParams).then((res) => {
          this.$message.success(`修改成功`);
          this.getlist()
        });
      },

      handleDelete(index, row) {
        this.dialogDelVisible = true;
        this.delId = row.id;
      },

      changehot(index){
        var allParams = '?id='+ index.id;
        Kanhot(allParams).then((res) => {
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

      submitdel(){
        this.dialogDelVisible = false;
        var allParams='?id='+this.delId
        Kandelete(allParams).then((res) => {
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
.cardbox{
  width: 600px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content:flex-start;
}
.card{

  /*float: left;*/
  width: 100px;
  height: 150px;
  margin-right: 20px;
  border:1px solid #aaa; 
}


.el-button+.el-button {
  margin-left: 0px!important;
}
</style>
