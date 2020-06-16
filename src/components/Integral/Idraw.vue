<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>积分商城</el-breadcrumb-item>
        <el-breadcrumb-item>抽奖设置</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
     <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="奖品列表" name="list">

       <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" size="medium" @click="newone">新增奖品</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="prizelist" border stripe size="small" style="width:85%;">
        <el-table-column prop="name" label="奖品名称" width="130" align="center">
        </el-table-column>
        <el-table-column prop="score" label="获得积分" min-width="200" align="center">
        </el-table-column>

        <el-table-column prop="score" label="图标" min-width="200" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.icon" style="max-width:60px;max-height:60px;" />
          </template>
        </el-table-column>

        <el-table-column prop="count" label="获奖概率" min-width="200" align="center">
        </el-table-column>
        <el-table-column prop="num" label="奖品数量" min-width="200" align="center">
        </el-table-column>
        <el-table-column prop="created_at" label="修改时间" min-width="200" align="center">
        </el-table-column>
        <el-table-column label="操作" min-width="200" align="center">
         <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编 辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删 除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </el-tab-pane>

  <el-tab-pane label="其它设置" name="config">

    <el-form ref="scoreset" :model="scoreset" label-width="160px" class="form" status-icon size="small" style="width:600px;" :rules="setrule">

      <el-form-item label="注册获得积分：" prop="register_score">
        <el-input class="numinput" placeholder="请输入注册获得积分" v-model="scoreset.register_score" v-show="show"><template slot="append">积分</template></el-input>
        <div v-show="set" class="showlabel">
          <label v-show="set">{{setdata.register_score}}积分</label>
        </div>
      </el-form-item>

      <el-form-item label="抽奖消耗积分：" prop="prize_score">
        <el-input class="numinput" placeholder="请输入抽奖消耗积分" v-model="scoreset.prize_score" v-show="show"><template slot="append">积分</template></el-input>
        <div v-show="set" class="showlabel">
          <label v-show="set">{{setdata.prize_score}}积分</label>
        </div>
      </el-form-item>

      <el-form-item label="分享获得积分：" prop="share_score">
        <el-input class="numinput" placeholder="请输入分享获得积分" v-model="scoreset.share_score" v-show="show" ><template slot="append">积分</template></el-input>
        <div v-show="set" class="showlabel">
          <label v-show="set">{{setdata.share_score}}积分</label>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button v-if="set" size="small" type="primary" style="margin-left:0px;margin-top:20px;" @click="changeset" >编辑</el-button>
        <el-button v-if="show" size="small" type="primary" style="margin-left:0px;margin-top:20px;" @click="confirmset">提交</el-button>
        <el-button v-if="show" size="small" @click="cancelset">取消</el-button>
      </el-form-item>

    </el-form>

  </el-tab-pane>


</el-tabs>
</el-col>


<el-col>
  <el-dialog title="编辑奖品" :visible.sync="dialogNewVisible" width="500" center style="min-width: 500px">
    <el-form ref="newprize" :model="newprize" label-width="120px" :rules="rules">
      <el-form-item label="奖品名称:" prop="name">
        <el-input v-model="newprize.name" placeholder="请输入奖品名称"></el-input>
      </el-form-item>
      <el-form-item label="获得积分:" prop="score">
        <el-input v-model="newprize.score" type="number" placeholder="请输入获得积分"></el-input>
      </el-form-item>
      <el-form-item label="获奖概率:" prop="count">
        <el-input v-model="newprize.count" type="number" placeholder="请输入获奖概率"></el-input>
      </el-form-item>
      <el-form-item label="奖品数量:" prop="num">
        <el-input v-model="newprize.num" type="number" placeholder="请输入奖品数量"></el-input>
      </el-form-item>

      <el-form-item label="图标">
        <el-upload class="upload-demo" :action="upurl" :data="uptoken" :on-success="handleSuccess" :show-file-list="false" accept="image/*">
          <img :src="icon" class="pre-img" style="width:146px;height:146px;border:1px dashed #ccc;border-radius:6px;display: block">
          <p slot="tip" class="upload__tip">可上传JPG/PNG文件，建议图片长宽比为1:1</p>
        </el-upload>
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
      <el-button @click="dialogDelVisible  = false">取 消</el-button>
      <el-button type="primary" @click="submitdel()">确 定</el-button>
    </div>
  </el-dialog>
</el-col>



</el-row>
</template>

<script>

  import qiniu from '../../api/qiniu';

  import { drawSet } from '../../api/api';
  import { drawGet } from '../../api/api';
  import { drawDel } from '../../api/api';


  import { drawsetSet } from '../../api/api';
  import { drawsetGet } from '../../api/api';

  import { Message } from 'element-ui';




  export default {
    data() {

      var checkvalue = (rule, value, callback) => {
        if (!value && value!==0) {
          return callback(new Error('此项不能为空'));
        }
        setTimeout(() => {
          if (Math.sign(value) == 1) {
           if(value%1 === 0){     
            callback();  
          }else{
            callback(new Error('请输入整数'));
          }
        } else if(Math.sign(value) == 0) {
         // callback(new Error('不能为0'));
         callback();  
       } else if(Math.sign(value) == -1) {
        callback(new Error('请输入正数'));
      }else{
        callback(new Error('请输入数字'));
      }
    }, 100);
      };

      return {
        activeName:'list',

        uptoken:{
          token:qiniu.token,
        },
        upurl:qiniu.upurl,

        currentPage: 1,
        list:[],
        count:0,
        limit:10,
        prizelist:[],

        dialogNewVisible:false,
        dialogDelVisible:false,

        newprize:{
          name:'', 
          score:'',
          count:'',
          num:'',
        },

        icon:'../static/images/default1.png',

        rules: {
          name: [{required: true, trigger: 'blur',message: '请输入奖品名称'}],
          score: [{required: true, trigger: 'blur',validator: checkvalue}],
          count: [{required: true, trigger: 'blur',validator: checkvalue}],
          num: [{required: true, trigger: 'blur',validator: checkvalue}],
        },

        show:false,
        set:true,

        scoreset:{
          register_score:'',
          prize_score:'',
          share_score:''
        },

        setdata:{
          register_score:0,
          prize_score:0,
          share_score:0
        },

        setrule:{
          register_score: [{required: true, trigger: 'blur',validator: checkvalue}],
          prize_score: [{required: true, trigger: 'blur',validator: checkvalue}],
          share_score: [{required: true, trigger: 'blur',validator: checkvalue}],
        }

      }      
    },



    methods:{

      getlist(){
        var allParams = '';
        drawGet(allParams).then((res) => {
          this.prizelist=res.data.data
          this.count=res.data.count
        });
      },

      newone(){
        this.putorup='up';
        this.dialogNewVisible=true
        this.newprize={
          name:'',
          score:'',
          count:'',
          num:''
        }
        this.icon='../static/images/default1.png'
      },

      save(){
        this.$refs.newprize.validate((valid) => {
          if (valid) {
            // console.log(this.newadmin)
            // console.log(this.icon=='../static/images/default1.png')
            if(this.icon=='../static/images/default1.png'){
             this.$message({
              message: '请选择图标',
              type: 'error'
            });
             return
           }else{
            this.newprize.icon=this.icon
          }
          if( this.putorup=='put'){
            this.newprize.id=this.editId
          }
          drawSet(this.newprize).then((res) => {
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
        }else{
          return false;
        }
      })
      },

      handleEdit(index, row){
        this.editId = row.id;
        this.dialogNewVisible = true;
        this.putorup='put'
        this.newprize={
          name:row.name,
          score:row.score,
          count:row.count,
          num:row.num
        }
        this.icon=row.icon
      },

      handleDelete(index, row) {
        this.dialogDelVisible = true;
        this.delId = row.id;
      },

      submitdel(){
        var allParams='?id='+this.delId
        console.log(allParams)
        drawDel(allParams).then((res) => {

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




      getset(){
        var allParams = '';
        drawsetGet(allParams).then((res) => {
          // console.log(res.data==null)
          if(res.data==null){
            this.show=true
            this.set=false
          }else{
            this.setdata=res.data
          }
        });
      },

      changeset(){
        this.show=true
        this.set=false
      },

      handleSuccess(res, file) {
        this.icon = qiniu.showurl+ res.key
        // console.log(this.icon)
      },

      confirmset(){
        this.$refs.scoreset.validate((valid) => {
          if (valid) {
           var allParams=this.scoreset
           console.log(allParams)
           drawsetSet(allParams).then((res) => {
            if (res.msg === "ok") {
             this.$message({
              message: '提交成功',
              type: 'success'
            });
             this.getset();

             this.cancelset()

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

      cancelset(){
        this.show=false
        this.set=true
      }


    },

    mounted: function () {
      this.getlist();
      this.getset();
    }
  }
</script>

<style scope>

.numinput{
  width: 320px;
}


.showlabel{
  width:320px;
  border-radius: 4px;
  border: 1px solid #00BB29;
  padding-left: 8px;
}


.upload__tip{
  font-size: 12px;
  color: #606266;
}
</style>
