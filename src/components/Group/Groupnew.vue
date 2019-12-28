<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>拼团</el-breadcrumb-item>
        <el-breadcrumb-item>发布活动</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

      <el-form label-width="130px" width="900px" center style="width: 1000px" :rules="rules" ref="newone" :model="newone">

        <el-form-item label="商品分类：" prop="type_id">
          <el-select v-model="type1" placeholder="请选择一级分类" @change="gettype2">
            <el-option v-for="item in typeArr1" :label="item.title" :value="item.id" :key="item.id"></el-option>
          </el-select>
          <el-select v-model="type2" placeholder="请选择二级分类" v-show="type1" @change="gettype3">
            <el-option v-for="item in typeArr2" :label="item.title" :value="item.id" :key="item.id"></el-option>
          </el-select>
          <el-select v-model="type_id" placeholder="请选择三级分类" v-show="type2" @change="confirmtype">
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
            <el-table-column prop="norm" label="规格" min-width="150" align="center">
              <template slot-scope="scope">
                <el-tag type="success" v-show="scope.row.norm=='fixed'">统一规格</el-tag>
                <el-tag type="primary" v-show="scope.row.norm=='change'">多规格</el-tag>
                <el-tag type="primary" v-show="scope.row.norm!=='fixed' && scope.row.norm!=='change'">{{ goodguige }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作" min-width="150" align="center">
             <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleSelect(scope.$index, scope.row)">填写价格</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination v-show="selectgood" style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
        </el-pagination>
      </el-form-item>

      <el-form-item label="活动标题：" prop="title">
        <el-input v-model="newone.title" placeholder="请输入活动标题（20字以内）" maxlength="20" style="width:500px;"></el-input>
      </el-form-item>

<!--       <el-form-item label="商品数量：" prop="number">
        <el-input v-model="newone.number" type="number" min="1" placeholder="请输入商品数量" style="width:500px;"></el-input>
      </el-form-item> -->

      <el-form-item label="拼团限时：" prop="time">
        <el-input v-model="newone.time" type="number" min="1" placeholder="请输入拼团限时（小时）(整数)" style="width:500px;"></el-input>
      </el-form-item>


      <el-form-item label="拼团人数：" prop="people_number">
        <el-input v-model="newone.people_number" type="number" min="1" placeholder="请输入拼团人数" style="width:500px;"></el-input>
      </el-form-item>


      <el-form-item label="能否使用免单券：" prop="free">
        <el-switch v-model="newone.free" @change="changequan" active-value="1" inactive-value="0" active-text="是" inactive-text="否"></el-switch>
      </el-form-item>

      <el-form-item style="margin-top: 20px;">
        <el-button type="primary" @click="save()" size="medium">提交</el-button>
        <el-button @click="golist()" size="medium">取 消</el-button>
      </el-form-item>
    </el-form>

  </el-col>


  <el-col>
    <el-dialog title="选择规格" :visible.sync="dialogVisible" width="1000" center :close-on-click-modal='false' :close-on-press-escape='false'>
      <el-table :data="guigelist" style="width: 100%" border size="mini" stripe>
        <el-table-column prop="detail" label="规格名称" min-width="150" align="center">
          <template slot-scope="scope">
            <el-tag type="success" size="small" v-show="scope.row.product_detail=='fixed'">统一规格</el-tag>
            <el-tag type="primary" size="small" v-show="scope.row.product_detail!=='fixed'">{{ scope.row.detail }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cover" label="图片" min-width="150" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.cover" style="max-width:60px;max-height:60px;" />
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单买价" min-width="150" align="center">
        </el-table-column>
        <el-table-column prop="" label="拼团价" min-width="150" align="center">
          <template slot-scope="scope">
            <el-input placeholder="请输入拼团价" v-model="scope.row.ptprice" min="0" type="number"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmprice()" size="medium">确定</el-button>
      </div>
    </el-dialog>
  </el-col>

</el-row>
</template>

<script>

  import { typeGet } from '../../api/api';

  import { CardgoodGet } from '../../api/api';
  import { CardtypeGet } from '../../api/api';
  import { GroupshopPost } from '../../api/api';

  import { Message } from 'element-ui';

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
            callback(new Error('请输入整数'));
          }
        } else if(Math.sign(value) == 0) {
          callback(new Error('不能为0'));
        } else if(Math.sign(value) == -1) {
          callback(new Error('请输入正数'));
        } else{
          callback(new Error('请输入数字'));
        }
      }, 100);
      };

      var checkvalue1 = (rule, value, callback) => {
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
         callback();
       } else if(Math.sign(value) == -1) {
        callback(new Error('请输入正数'));
      }else{
        callback(new Error('请输入数字'));
      }
    }, 100);
      };

      return {
        newone:{
          product_id:'',
          // stock_id:'',
          title:'',
          number:'',
          time:'',
          people_number:'',
          // start:'',
          // end:'',
          // origin_price:'',
          // price:'',
          free:0
        },

        rules:{
          title: [
          {required: true, message: '请输入活动标题', trigger: 'blur'},
          ],
          // number: [
          // {required: true, validator: checkvalue, trigger: 'blur'},
          // ],
          people_number: [
          {required: true, validator: checkvalue, trigger: 'blur'},
          ],
          time: [
          {required: true, validator: checkvalue, trigger: 'blur'},
          ],
          // origin_price: [
          // {required: true, validator: checkvalue, trigger: 'blur'},
          // ],
          // price: [
          // {required: true, validator: checkvalue, trigger: 'blur'},
          // ],
        },



        dialogVisible:false,
        goodguige:'',
        date:'',
        pickerOptions:{
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },

        guigelist:[],

        typeArr1:[],
        type1:'',
        typeArr2:[],
        type2:'',
        typeArr3:[],
        type_id:'',

        goodData:[],

        selectgood:true,

        checkOptions:[],
        checkList:[],
        checkList1:[],
        checkList2:[],

        stockarr:[],

        dialogVisible:false,


        currentPage:1,
        limit:10,
        count:0,

        allParams:null,
      };
    },


    methods:{

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

        var allParams = '?product_id='+ row.id;
        CardtypeGet(allParams).then((res) => {
          this.newone.product_id=row.id;
          this.goodData=[row]
          // console.log(res.data)
          this.goodname=row.name
          this.guigelist=res.data
          this.dialogVisible=true
        });
      },


      confirmprice(){
        // console.log(this.guigelist)
        var stockarr=[]
        for(var i=0;i<this.guigelist.length;i++){
          if(this.guigelist[i].ptprice== undefined){
            this.$message.error(`请填写拼团价格`);
            return
          }
          stockarr.push({
            stock_id:this.guigelist[i].id,
            group_price:this.guigelist[i].ptprice
          })
        }
        console.log(stockarr)

        this.stockarr=stockarr
        this.guigelist=[]
        this.dialogVisible=false
      },

      // guigeSelect(index, row){
      //   // console.log(row)
      //   this.goodData=[{
      //     name:this.goodname,
      //     cover:row.cover,
      //     id:row.product_id
      //   }]
      //   if(row.product_detail=='fixed'){
      //     this.goodData[0].norm='fixed'
      //   }
      //   this.goodguige=row.detail
      //   this.selectgood=false
      //   this.newone.stock_id=row.id
      //   this.dialogVisible=false
      // },

      changequan(val){
        console.log(val)
      },

      save(){
        if(this.stockarr.length==0){
          this.$message.error(`请选择商品`);
          return
        }
        // console.log(this.stockarr)

        for(var i=0;i<this.stockarr.length;i++){
          // console.log(this.stockarr[i].group_price)
          if(this.stockarr[i].group_price== undefined){
            this.$message.error(`请填写拼团价格`);
            return
          }
        }

        this.$refs.newone.validate((valid) => {
          // console.log(this.newone)
          if (valid) {

            var allParams = {
              product_id:this.newone.product_id,
              title:this.newone.title,
              // number:this.newone.number,
              time:this.newone.time,
              people_number:this.newone.people_number,
              free:this.newone.free,
              stocks:this.stockarr
            };
            // console.log(allParams)

            GroupshopPost(allParams).then((res) => {
              console.log(res)
              if (res.msg === "ok") {
               this.$message({
                message: '提交成功',
                type: 'success'
              });
               this.$router.push({ path: '/Group/Groupgood' });

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

      golist(){
       this.$router.push({ path: '/Group/Groupgood' });
     },

     handleCurrentChange(val) {
      this.currentPage = val;
      this.getgood();
    },


    handleSizeChange(val){
      this.limit = val;
      this.getgood();
    },
  },


  mounted: function () {
    this.gettype1()
  }
}
</script>



<style scope>

</style>
