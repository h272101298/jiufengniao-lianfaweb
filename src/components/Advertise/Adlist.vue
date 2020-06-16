<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>广告管理</el-breadcrumb-item>
        <el-breadcrumb-item>广告列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
     <el-row>

      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="首页轮播" name="banner">

         <el-form :inline="true">
          <el-form-item>
            <el-button type="primary" size="medium" @click="newone" v-show="checkper1">新增轮播</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="list" border stripe size="small" style="width:1001px">
          <el-table-column prop="id" label="轮播编号" width="200" align="center">
          </el-table-column>
          <el-table-column prop="pic" label="轮播图片" width="500" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.pic" style="max-width:90px;max-height:90px;" />
            </template>
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
    </el-tab-pane>

    <el-tab-pane label="首页图标" name="icon">

      <el-table :data="iconarr" border size="small" style="width:1051px" :default-sort = "{prop: 'position'}">
        <el-table-column prop="position" label="图标编号" width="100" align="center">
        </el-table-column>
        <el-table-column prop="name" label="图标位置" width="150" align="center">
        </el-table-column>
        <el-table-column prop="url" label="图标图片" width="500" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.url" style="max-width:40px;max-height:40px;" />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="300" align="center">
         <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleiconEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-tab-pane>


  <el-tab-pane label="首页海报" name="poster">

    <el-table :data="indexpostarr" border size="small" style="width:1051px">
      <el-table-column prop="id" label="海报编号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="name" label="海报位置" width="150" align="center">
      </el-table-column>
      <el-table-column prop="pic" label="海报图片" width="500" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.pic" style="max-width:90px;max-height:90px;" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" align="center">
       <template slot-scope="scope">
        <el-button type="primary" size="small" @click="handlepostEdit(scope.$index, scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</el-tab-pane>


<el-tab-pane label="其它海报" name="otherpost">

  <el-table :data="otherpost" border size="small" style="width:1051px">
    <el-table-column type="index" label="海报编号" width="100" align="center">
    </el-table-column>
    <el-table-column prop="name" label="海报位置" width="150" align="center">
    </el-table-column>
    <el-table-column prop="pic" label="海报图片" width="500" align="center">
      <template slot-scope="scope">
        <img :src="scope.row.pic" style="max-width:90px;max-height:90px;border: 1px solid #ccc" />
      </template>
    </el-table-column>
    <el-table-column label="操作" width="300" align="center">
     <template slot-scope="scope">
      <el-button type="primary" size="small" @click="otherpostEdit(scope.$index, scope.row)">编辑</el-button>
    </template>
  </el-table-column>
</el-table>
</el-tab-pane>




</el-tabs>

</el-row>
</el-col>



<el-col>
  <el-dialog :title="diatitle" :visible.sync="dialogNewVisible" width="500" center style="min-width: 500px">
    <el-form ref="newadv" :model="newadv" label-width="120px">

      <el-form-item label="上传图片：">
        <el-upload class="upload-demo" list-type="picture-card" :action="upurl" :data="uptoken" :on-success="handleSuccess" :on-exceed="handleExceed" :file-list="postarr" :limit="1" :show-file-list="true" accept="image/*">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">可上传JPG/PNG文件，建议图片比例为16:9</div>
        </el-upload>
      </el-form-item>

      <el-form-item label="商品分类：" prop="type_id">
        <el-select v-model="type1" placeholder="请选择一级分类" filterable @change="gettype2">
          <el-option v-for="item in typeArr1" :label="item.title" :value="item.id" :key="item.id"></el-option>
        </el-select>
        <el-select v-model="type2" placeholder="请选择二级分类" filterable v-show="type1" @change="gettype3">
          <el-option v-for="item in typeArr2" :label="item.title" :value="item.id" :key="item.id"></el-option>
        </el-select>
        <el-select v-model="type_id" placeholder="请选择三级分类" filterable v-show="type2" @change="confirmtype">
          <el-option v-for="item in typeArr3" :label="item.title" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="选择商品：" prop="origin_price">
        <el-table :data="goodData"style="width: 100%" border empty-text="请先选择分类" size="mini" stripe>
          <el-table-column prop="name" label="名称" min-width="150" align="center">
          </el-table-column>
          <el-table-column prop="cover" label="图片" min-width="150" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.cover" style="max-width:60px;max-height:60px;" />
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" min-width="150" align="center">
           <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleSelect(scope.$index, scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item style="margin-left: calc(50% - 200px);">
      <el-button type="primary" @click="save()">保 存</el-button>
      <el-button @click="dialogNewVisible = false">取 消</el-button>
    </el-form-item>
  </el-form>
</el-dialog>
</el-col>


<el-col>
  <el-dialog title="编辑海报" :visible.sync="dialogNewpostVisible" width="500" center style="min-width: 500px">
    <el-form ref="newadv" :model="newadv" label-width="120px">

      <el-form-item label="上传图片：">
        <el-upload class="upload-demo" list-type="picture-card" :action="upurl" :data="uptoken" :on-success="phandleSuccess" :on-exceed="phandleExceed" :file-list="indexpost" :limit="1" :show-file-list="true" accept="image/*">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">可上传JPG/PNG文件，建议图片比例为5:2</div>
        </el-upload>
      </el-form-item>

      <el-form-item style="margin-left: calc(50% - 200px);">
        <el-button type="primary" @click="savepost()">保 存</el-button>
        <el-button @click="dialogNewpostVisible = false">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</el-col>


<el-col>
  <el-dialog title="编辑海报" :visible.sync="dialogotherpostVisible" width="500" center style="min-width: 500px">
    <el-form ref="newadv" :model="newadv" label-width="120px">

      <el-form-item label="上传图片：">
        <el-upload class="upload-demo" list-type="picture-card" :action="upurl" :data="uptoken" :on-success="otherleSuccess" :on-exceed="otherleExceed" :file-list="otherarr" :limit="1" :show-file-list="true" accept="image/*">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">可上传JPG/PNG文件，建议图片比例为16:9</div>
        </el-upload>
      </el-form-item>

      <el-form-item style="margin-left: calc(50% - 200px);">
        <el-button type="primary" @click="savepost()">保 存</el-button>
        <el-button @click="dialogotherpostVisible = false">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</el-col>



<el-col>
  <el-dialog title="编辑图标" :visible.sync="dialogiconVisible" width="500" center style="min-width: 500px">
    <el-form ref="newadv" :model="newadv" label-width="120px">

      <el-form-item label="上传图片：">
        <el-upload class="upload-demo" list-type="picture-card" :action="upurl" :data="uptoken" :on-success="iconSuccess" :on-exceed="iconExceed" :file-list="icon" :limit="1" :show-file-list="true" accept="image/*">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">可上传JPG/PNG文件，建议图片比例为1:1</div>
        </el-upload>
      </el-form-item>

      <el-form-item style="margin-left: calc(50% - 200px);">
        <el-button type="primary" @click="saveicon()">保 存</el-button>
        <el-button @click="dialogiconVisible = false">取 消</el-button>
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

  import { typeGet } from '../../api/api';

  import { CardgoodGet } from '../../api/api';


  import {advertsGet} from '../../api/api';
  import {advertPost} from '../../api/api';
  import {advertDel} from '../../api/api';
  import {posterGet} from '../../api/api';
  import {posterPost} from '../../api/api';
  import {iconPost} from '../../api/api';
  import {iconGet} from '../../api/api';

  import qiniu from '../../api/qiniu';


  export default {
    data() {
      return {
        // activeName:'otherpost',
        activeName:'banner',

        uptoken:{
          token:qiniu.token,
        },
        upurl:qiniu.upurl,

        currentPage: 1,
        list:[],
        count:0,
        limit:10,
        dialogNewVisible:false,
        dialogDelVisible:false,

        putorup:'up',
        imgSrc:"",
        product_id:"",
        newadv:{},
        diatitle:'新增广告',
        postarr:[],
        editId:'',
        delId:'',


        typeArr1:[],
        type1:'',
        typeArr2:[],
        type2:'',
        typeArr3:[],

        type_id:'',

        goodData:[],


        checkper1:false,
        checkper2:false,


        postimgSrc:"",


        dialogNewpostVisible:false,
        indexpostarr:[{
          id:1,          
          name:'砍价海报',
          pic:'../../../static/images/default.png'
        },{
          id:2,          
          name:'集卡牌海报',
          pic:'../../../static/images/default.png'
        },{
          id:3,          
          name:'拼团海报',
          pic:'../../../static/images/default.png'
        },
        // {
        //   id:4,          
        //   name:'商品海报',
        //   pic:'../../../static/images/default.png'
        // }
        ],
        indexpost:[],


        dialogotherpostVisible:false,
        otherpost:[{
          id:5,
          name:'集卡牌海报',
          pic:'../../../static/images/default.png'
        },{
          id:6,
          name:'拼团海报',
          pic:'../../../static/images/default.png'
        },{
          id:7,
          name:'免单海报',
          pic:'../../../static/images/default.png'
        },{
          id:8,
          name:'砍价海报',
          pic:'../../../static/images/default.png'
        },{
          id:9,
          name:'分销海报',
          pic:'../../../static/images/default.png'
        },{
          id:10,
          name:'积分商城海报',
          pic:'../../../static/images/default.png'
        },{
          id:11,
          name:'抽奖背景',
          pic:'../../../static/images/default.png'
        },{
          id:12,
          name:'登录背景',
          pic:'../../../static/images/default.png'
        },

        ],
        otherarr:[],


        dialogiconVisible:false,
        iconarr:[{
          id:1,
          position:1,          
          name:'全部分类',
          url:'../../../static/images/icon.png'
        },{
          id:2,
          position:2,          
          name:'新品推荐',
          url:'../../../static/images/icon.png'
        },{
          id:3,
          position:3,          
          name:'0元活动',
          url:'../../../static/images/icon.png'
        },{
          id:4,
          position:4,          
          name:'积分商城',
          url:'../../../static/images/icon.png'
        },{
          id:5,
          position:5,          
          name:'全免团',
          url:'../../../static/images/icon.png'
        }
        ],
        icon:[],

      };
    },

    methods:{
      getposter(){
        var allParams = ''
        posterGet(allParams).then((res) => {
          // console.log(res.data.card_poster)
          if(res.data.card_poster){
            this.otherpost[0].pic=res.data.card_poster
          }else{
            this.otherpost[0].pic='../../../static/images/default.png'
          }

          if(res.data.group_poster){
            this.otherpost[1].pic=res.data.group_poster
          }else{
            this.otherpost[1].pic='../../../static/images/default.png'
          }

          if(res.data.group_free){
            this.otherpost[2].pic=res.data.group_free
          }else{
            this.otherpost[2].pic='../../../static/images/default.png'
          }

          if(res.data.bargain_poster){
            this.otherpost[3].pic=res.data.bargain_poster
          }else{
            this.otherpost[3].pic='../../../static/images/default.png'
          }

          if(res.data.proxy_poster){
            this.otherpost[4].pic=res.data.proxy_poster
          }else{
            this.otherpost[4].pic='../../../static/images/default2.png'
          }

          if(res.data.score_poster){
            this.otherpost[5].pic=res.data.score_poster
          }else{
            this.otherpost[5].pic='../../../static/images/default.png'
          }

          if(res.data.prize_poster){
            this.otherpost[6].pic=res.data.prize_poster
          }else{
            this.otherpost[6].pic='../../../static/images/default.png'
          }

          if(res.data.idnex_poster){
            this.otherpost[7].pic=res.data.idnex_poster
          }else{
            this.otherpost[7].pic='../../../static/images/default.png'
          }



          if(res.data.index_bargain){
            this.indexpostarr[0].pic=res.data.index_bargain
          }else{
            this.indexpostarr[0].pic='../../../static/images/default.png'
          }

          if(res.data.index_card){
            this.indexpostarr[1].pic=res.data.index_card
          }else{
            this.indexpostarr[1].pic='../../../static/images/default.png'
          }

          if(res.data.index_group){
            this.indexpostarr[2].pic=res.data.index_group
          }else{
            this.indexpostarr[2].pic='../../../static/images/default.png'
          }

          // if(res.data.index_origin){
          //   this.indexpostarr[3].pic=res.data.index_origin
          // }else{
          //   this.indexpostarr[3].pic='../../../static/images/default.png'
          // }
        });
      },


      geticon(){
        var allParams = ''
        iconGet(allParams).then((res) => {
          if(res.data!==''){
            var arr=res.data
            var iconarr=this.iconarr
            for (var i = 0;i <iconarr.length;  i++) {
              for (var j = 0;j <arr.length;  j++) {
                if(arr[j].position==iconarr[i].position){
                 iconarr[i].url= arr[j].url
               }
             }
           }
           this.iconarr=iconarr
         }
       });
      },

      handleiconEdit(index, row){
        this.dialogiconVisible = true;
        this.iconId = parseInt(row.position);
        // console.log(this.iconId)
        this.icon=[];
      },

      iconSuccess(res, file){
        this.iconimgSrc = qiniu.showurl+ res.key
      },

      iconExceed(files, fileList) {
        this.$message.warning(`一次只能上传1张图片`);
      },

      saveicon(){
        // console.log(this.iconId)
        var allParams = {
         position :this.iconId,
         url:this.iconimgSrc
       }
       iconPost(allParams).then((res) => {
        if (res.msg === "ok") {
         this.$message({
          message: '提交成功',
          type: 'success'
        });
         this.iconimgSrc=''
         this.geticon();
         this.dialogiconVisible=false
       } else {
         this.$message({
          message: res.msg,
          type: 'error'
        });
       }
     });
     },



     checkPer(){
      var per = sessionStorage.getItem('permissions');
      if(per.indexOf('advertAdd')>-1){
        this.checkper1=true;
      }
      if(per.indexOf('advertDel')>-1){
        this.checkper2=true;
      }
    },


    getlist(){

      var allParams = '?page='+ this.currentPage + '&limit=' + this.limit;
      advertsGet(allParams).then((res) => {
          // console.log(res.msg)
          this.list=res.data.data;
          this.count=res.data.count;
        });
    },

    newone(){
     this.putorup='up';
     this.postarr=[];
     this.diatitle='新增广告',
     this.dialogNewVisible=true
   },

    // 分类
    gettype1(){
      var allParams = '?level=1';
      typeGet(allParams).then((res) => {
        this.typeArr1=res.data.data;
      });
    },

    gettype2(e){
      this.type2='';
      this.type_id='';

      var allParams = '?parent='+ e;
      typeGet(allParams).then((res) => {
        this.typeArr2=[];
        this.typeArr2=res.data.data;
      });
    },

    gettype3(e){
      var allParams = '?parent='+ e;
      typeGet(allParams).then((res) => {
        this.typeArr3=res.data.data;
      });
    },

    confirmtype(e){
      this.getgood()
    },

    getgood(){
      var allParams = '?page='+ this.currentPage + '&limit=' + this.limit+ '&type=' + this.type_id;
      CardgoodGet(allParams).then((res) => {
        this.goodData=res.data.data;
        this.count=res.data.count
      });
    },

    handleSelect(index, row){
      this.product_id = row.id;
      var goodData=[]
      goodData.push(row)
      this.goodData=goodData
    },

    handleSuccess(res, file) {
      this.imgSrc =qiniu.showurl+ res.key
    },

    handleExceed(files, fileList) {
      this.$message.warning(`一次只能上传1张图片`);
    },

    save(){
      if(this.imgSrc==''){
        this.$message({
          message: '请选择图片',
          type: 'error'
        });
      }else{
        if( this.putorup=='put'){
          var allParams = {
            pic:this.imgSrc,
            id:this.editId,
            product_id:this.product_id
          };
        }else{
          var allParams = {
            pic:this.imgSrc,
            product_id:this.product_id
          };
        }
        advertPost(allParams).then((res) => {
          if (res.msg === "ok") {
           this.$message({
            message: '提交成功',
            type: 'success'
          });
           this.imgSrc=''
           this.getlist();
           this.dialogNewVisible=false
           this.goodData=[]
         } else {
           this.$message({
            message: res.msg,
            type: 'error'
          });
         }
       });
      }
    },

    handleEdit(index, row){
      this.diatitle='编辑广告';
      this.dialogNewVisible = true;
      this.putorup='put';
      this.editId = row.id;
      this.postarr=[]
      this.product_id = row.id;
      this.imgSrc=row.pic
      this.postarr.push(Object.assign({},{"url":row.pic}));
    },

    handleDelete(index, row) {
      this.dialogDelVisible = true;
      this.delId = row.id;
    },

    submitdel(){
      this.dialogDelVisible = false;
      var allParams='?id='+this.delId
      advertDel(allParams).then((res) => {
        console.log(res)
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

    handlepostEdit(index, row){
      this.dialogNewpostVisible = true;
      this.postId = row.id;
      this.indexpost=[];
    },

    phandleSuccess(res, file){
      this.postimgSrc = qiniu.showurl+ res.key
    },

    phandleExceed(files, fileList) {
      this.$message.warning(`一次只能上传1张图片`);
    },



    otherpostEdit(index, row){
      this.dialogotherpostVisible = true;
      this.postId = row.id;
      this.otherarr=[];
    },

    otherleSuccess(res, file){
      this.postimgSrc = qiniu.showurl+ res.key
    },

    otherleExceed(files, fileList) {
      this.$message.warning(`一次只能上传1张图片`);
    },


    savepost(){

      if(this.postimgSrc==''){
        this.$message({
          message: '请选择图片',
          type: 'error'
        });
      }else {

       if( this.postId==1){
        var allParams={
          index_bargain:this.postimgSrc
        }
      }else if( this.postId==2){
        var allParams={
          index_card:this.postimgSrc
        }
      }else if( this.postId==3){
        var allParams={
          index_group:this.postimgSrc
        }
      }else if( this.postId==4){
        var allParams={
          index_origin:this.postimgSrc
        }
      }else if( this.postId==5){
        var allParams={
          card_poster:this.postimgSrc
        }
      }else if( this.postId==6){
        var allParams={
          group_poster:this.postimgSrc
        }
      }else if( this.postId==7){
        var allParams={
          group_free:this.postimgSrc
        }
      }else if( this.postId==8){
        var allParams={
          bargain_poster:this.postimgSrc
        }
      }else if( this.postId==9){
        var allParams={
          proxy_poster:this.postimgSrc
        }
      }else if( this.postId==10){
        var allParams={
            score_poster:this.postimgSrc//
          }
        }else if( this.postId==11){
          var allParams={
            prize_poster:this.postimgSrc//
          }
        }else if( this.postId==12){
          var allParams={
            idnex_poster:this.postimgSrc//
          }
        }
      }

      // console.log(this.postId)
      posterPost(allParams).then((res) => {
        // console.log(res)
        if (res.msg === "ok") {
         this.$message({
          message: '提交成功',
          type: 'success'
        });
         this.postimgSrc=''
         this.getposter();
         this.dialogNewpostVisible=false
         this.dialogotherpostVisible = false;
       } else {
         this.$message({
          message: res.msg,
          type: 'error'
        });
       }
     });
    }
  },

  mounted: function () {
    this.gettype1()
    this.getlist();
    this.geticon();
    this.getposter();
    this.checkPer();
  }
}
</script>


<style scoped>

.cardbox{
  width: 600px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content:flex-start;
}

.cardpost{
  width:320px;
  height:180px;
  border:1px dashed #ccc;
  border-radius:6px;
  display: block;
}

.kanbox{
  width: 600px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content:flex-start;
}

.kanpost{
  width:320px;
  height:180px;
  border:1px dashed #ccc;
  border-radius:6px;
  display: block;
}

.agentbox{
  width: 600px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content:flex-start;
}

.agentpost{
  width:180px;
  height:320px;
  border:1px dashed #ccc;
  border-radius:6px;
  display: block;
}

.pinbox{
  width: 600px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content:flex-start;
}

.pinpost{
  width:320px;
  height:180px;
  border:1px dashed #ccc;
  border-radius:6px;
  display: block;
}



/*.el-form-item {
  margin-bottom: 0px!important;
  }*/
</style>
