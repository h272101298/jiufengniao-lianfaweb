<template>
 <el-row class="warp" style="padding:20px 0 0 20px;">
  <el-col :span="24" class="warp-breadcrum">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
      <el-breadcrumb-item>资讯管理</el-breadcrumb-item>
      <el-breadcrumb-item>资讯列表</el-breadcrumb-item>
    </el-breadcrumb>
  </el-col>

  <el-col :span="24" class="warp-main">

   <el-form :inline="true">
    <el-form-item>
      <el-button type="primary" size="small" @click="newone">新增资讯</el-button>
    </el-form-item>
  </el-form>

  <el-table :data="list" border stripe style="width:95%">
    <el-table-column prop="id" label="编号" width="100" align="center">
    </el-table-column>

    <el-table-column prop="title" label="标题" min-width="300" align="center">
    </el-table-column>

    <el-table-column prop="pic" label="封面图" min-width="200" align="center">
      <template slot-scope="scope">
        <img :src="scope.row.pic" style="width:80px;height:80px;" />
      </template>
    </el-table-column>

    <el-table-column prop="heat" label="浏览量" min-width="100" align="center">
    </el-table-column>

<!--     <el-table-column prop="title" label="更新时间" min-width="200" align="center">
</el-table-column> -->

<el-table-column label="操作" min-width="200" align="center">
 <template slot-scope="scope">
  <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
  <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
</template>
</el-table-column>

</el-table>

<el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
</el-pagination>
</el-col>


<el-col>
  <el-dialog :title="diatitle" :visible.sync="dialogNewVisible" width="60%" center style="min-width: 1000px">
    <el-form ref="nedoc" :model="nedoc" label-width="120px" :rules="rules" status-icon>

      <el-form-item label="标题:" prop="title">
        <el-input v-model="nedoc.title" style="max-width: 300px;" placeholder="请输入标题"></el-input>
      </el-form-item>


      <el-form-item label="封面图片：">
       <el-upload class="upload-demo" :action="upurl" :data="uptoken" :on-success="handleSuccess" :show-file-list="false" accept="image/*">
        <img :src="nedoc.pic" class="pre-img" style="width:146px;height:146px;border:1px dashed #ccc;border-radius:6px;display: block;margin-top: 1px;">
        <!-- <p slot="tip" class="upload__tip">可上传JPG/PNG文件，建议图片长宽比为2:1</p> -->
      </el-upload>
    </el-form-item>


    <el-form-item label="详细内容:" prop="content" style="margin-bottom: 40px">
      <div class="edit_container">
        <quill-editor v-model="nedoc.content" style="height:600px;" ref="myQuillEditor" :options="editorOption" class="editer" placeholder= '请输入详细内容'></quill-editor>
        <el-upload class="avatar-uploader quill-img" :action="upurl" :data="uptoken" :on-success='quillImgSuccess' style="display: none">
          <el-button size="small" type="primary" id="imgInput" element-loading-text="插入中,请稍候">点击上传</el-button>
        </el-upload>
      </div>
    </el-form-item>

    <el-form-item style="margin-left: calc(50% - 200px);">
      <el-button type="primary" @click="save()">提 交</el-button>
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

<style>
.fw4{
  font-weight: 400;
}
.fw6{
  font-weight: 600;
}
</style>

<script>

  import qiniu from '../../api/qiniu';

  import {newsGet} from '../../api/api';
  import {newGet} from '../../api/api';
  import {newsPost} from '../../api/api';
  import {newsPut} from '../../api/api';
  import {newsDel} from '../../api/api';

  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';

  import { quillEditor } from 'vue-quill-editor' //调用编辑器

  export default {
    data() {
      return {
        uptoken:{
          token:qiniu.token,
        },
        upurl:qiniu.upurl,

        checkper1:false,
        checkper2:false,

        currentPage: 1,
        list:[],
        count:0,
        limit:10,
        dialogNewVisible:false,
        dialogDelVisible:false,

        editId:'',
        delId:'',
        diatitle:'新增资讯',
        nedoc:{
          title:'',
          content:'',
          pic:'../static/images/default1.png'
        },
        rules: {
          title: [{required: true, trigger: 'blur',message: '请输入资讯标题'}],
          content: [{required: true, trigger: 'blur',message: '请输入详细内容'}]
        },
        currow:'',


        editorOption:{
          placeholder: '请输入详细内容（添加图片请点击上方第一个按钮）',
          theme: 'snow',
          modules: {
            toolbar: {
              container: [
              ['image'],
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'font': [] }],
              [{ 'align': [] }],
              ['clean']
              ],
              handlers: {
                'image': function (value) {
                  if (value) {
                    document.querySelector('.quill-img input').click()
                  } else {
                    this.quill.format('image', false);
                  }
                }
              }
            }
          }
        },
      };
    },


    components: {
      quillEditor,
    },

    methods:{

      quillImgSuccess(res, file) {
        console.log(res)
        let quill = this.$refs.myQuillEditor.quill
        if (res.key) {
          let length = quill.getSelection().index;
          quill.insertEmbed(length, 'image', qiniu.showurl+ res.key)
          quill.setSelection(length + 1)
        } else {
          this.$message.error('图片插入失败')
        }
      },

      getlist(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit;
        newsGet(allParams).then((res) => {
          this.list=res.data;
          this.count=res.total
        });
      },

      newone(){
       this.putorup='up';
       this.diatitle='新增资讯',
       this.dialogNewVisible=true,
       this.nedoc={
         title:'',
         content:'',
         pic:'../static/images/default1.png'
       }
     },

     handleEdit(index, row){
      this.diatitle='编辑资讯';
      this.dialogNewVisible = true;
      this.putorup='put';
      this.editId = row.id;

      var allParams = '?id='+ this.editId;
      newGet(allParams).then((res) => {
        console.log(res)
        this.nedoc={
          title:res.data.title,
          content:res.data.content,
          pic:res.data.pic
        }
      });
    },

    handleSuccess(res, file) {
      this.nedoc.pic = qiniu.showurl+ res.key
    },

    save(){
      // console.log(this.nedoc.content)

      if(this.nedoc.title==''){
        this.$message({
          message: '请输入标题',
          type: 'error'
        });
      }else if(this.nedoc.pic==[]){
        this.$message({
          message: '请输入详细内容',
          type: 'error'
        });
      }else if(this.nedoc.content==''){
        this.$message({
          message: '请输入详细内容',
          type: 'error'
        });
      }
      else{
        if( this.putorup=='put'){
          var allParams = '?title=' + this.nedoc.title + '&id=' + this.editId + '&content=' + this.nedoc.content + '&pic=' + this.nedoc.pic     
          newsPut(allParams).then((res) => {
            if (res.msg === "success") {
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
          var allParams = {
            title:this.nedoc.title,
            content:this.nedoc.content,
            pic:this.nedoc.pic
          };
          newsPost(allParams).then((res) => {
            if (res.msg === "success") {
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
      }
    },

    handleDelete(index, row) {
      this.dialogDelVisible = true;
      this.delId = row.id;
    },

    submitdel(){
      this.dialogDelVisible = false;
      var allParams='?id='+this.delId
      newsDel(allParams).then((res) => {
        // console.log(res)
        if (res.msg === "success") {
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

  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },

  mounted: function () {
    this.getlist();
  }
}
</script>
