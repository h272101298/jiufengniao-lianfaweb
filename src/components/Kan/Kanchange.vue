<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>限时砍价</el-breadcrumb-item>
        <el-breadcrumb-item>发布活动</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

      <el-form label-width="120px" width="900px" center style="width: 1000px" :rules="rules" ref="newgood" :model="newgood">


       <el-form-item label="活动标题：" prop="description">
        <el-input v-model="newgood.description" placeholder="请输入活动标题（10字以内）" maxlength="10" style="width:500px;"></el-input>
      </el-form-item>

      <el-form-item label="商品数量：" prop="number">
        <el-input v-model="newgood.number" type="number" min="0" placeholder="" style="width:500px;"></el-input>
      </el-form-item>

<!--       <el-form-item label="活动时间：" prop="date">
        <el-date-picker v-model="date" type="datetimerange" :picker-options="pickerOptions" range-separator="-" value-format="yyyy-MM-dd HH:mm:ss" @change="getSTime" style="width:500px;" :editable=false start-placeholder="开始时间" end-placeholder="结束时间">
        </el-date-picker>
      </el-form-item> -->

      <el-form-item label="砍价限时：" prop="time">
        <el-input v-model="newgood.time" type="number" min="1" placeholder="请输入砍价限时（小时）(整数)" style="width:500px;"></el-input>
      </el-form-item>

      <el-form-item label="砍价次数：" prop="clickNum">
        <el-input v-model="newgood.clickNum" type="number" min="0" placeholder="请输入砍价次数" style="width:500px;"></el-input>
      </el-form-item>

<!--       <el-form-item label="原价：" prop="origin_price">
        <el-input v-model="newgood.origin_price" type="number" min="0" placeholder="请输入原价" style="width:500px;"></el-input>
      </el-form-item>

      <el-form-item label="底价：" prop="min_price">
        <el-input v-model="newgood.min_price" type="number" min="0" placeholder="请输入底价" style="width:500px;"></el-input>
      </el-form-item> -->

      <el-form-item style=";margin-top: 20px;">
        <el-button type="primary" @click="save()" size="medium">提交</el-button>
        <el-button @click="golist()" size="medium">取 消</el-button>
      </el-form-item>
    </el-form>


  </el-col>




</el-row>
</template>



<script>


  import { KanoneGet } from '../../api/api';

  import { KanonePut } from '../../api/api';

  import { Message } from 'element-ui';


  export default {
    data() {
      var checkvalue = (rule, value, callback) => {
        // console.log(value)
        if (!value) {
          if(value==0){

          }else{
            return callback(new Error('此项不能为空'));
          }
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
        }else{
          callback(new Error('请输入数字'));
        }
      }, 100);
      };

      var checkvalue1 = (rule, value, callback) => {
        if (!value) {
          if(value==0){

          }else{
            return callback(new Error('此项不能为空'));
          }
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

        newgood:{          
          time:'',
          stock_id:'',
          description:'',
          number:'',
          clickNum:'',
          // start:'',
          // end:'',
          origin_price:'',
          min_price:''
        },

        type_id:'',

        goodguige:'',
        // date:'',
        // pickerOptions:{
        //   disabledDate(time) {
        //     return time.getTime() < Date.now() - 8.64e7;
        //   }
        // },


        selectgood:true,

        rules:{
          description: [
          {required: true, message: '请输入活动标题', trigger: 'blur'},
          ],
          number: [
          {required: true, validator: checkvalue, trigger: 'blur'},
          ],
          min_price: [
          {required: true, validator: checkvalue1, trigger: 'blur'},
          ],
          origin_price: [
          {required: true, validator: checkvalue, trigger: 'blur'},
          ],
          clickNum: [
          {required: true, validator: checkvalue, trigger: 'blur'},
          ],          
          time: [
          {required: true, validator: checkvalue, trigger: 'blur'},
          ],
        },

      };
    },


    methods:{


      getonekan(){
       var id = sessionStorage.getItem('kancheckid');
       this.actid= id
       // sessionStorage.removeItem('cardcheckid');
       var allParams = '?id='+id;
       KanoneGet(allParams).then((res) => {
        this.date=[res.data.start,res.data.end]
        this.newgood=res.data;

        // console.log(res)

      });
     },


     // getSTime(val){
     //  console.log(val[0])
     //    // var arr = val.split(",")
     //    this.newgood.start=val[0];
     //    this.newgood.end=val[1];
     //  },


     save(){

      if(this.newgood.stock_id==''){
        this.$message.error(`请选择商品`);
        return
      }

        // if(this.newgood.start=='' || this.newgood.end==''){
        //   this.$message.error(`请选择活动时间`);
        //   return
        // }

        this.$refs.newgood.validate((valid) => {
          if (valid) {
            var stocks=JSON.stringify(this.newgood.stocks)
            // console.log(stocks)
            var allParams = '?id='+this.actid+'&description='+this.newgood.description+'&number='+this.newgood.number+'&clickNum='+this.newgood.clickNum+'&time='+this.newgood.time;

            // var allParams = {
            //   id:this.actid,
            //   stock_id:this.newgood.stock_id,
            //   description:this.newgood.description,
            //   number:this.newgood.number,
            //   clickNum:this.newgood.clickNum,
            //   start:this.newgood.start,
            //   end:this.newgood.end,
            //   min_price:this.newgood.min_price,
            //   origin_price:this.newgood.origin_price,
            // };

            console.log(allParams)
            KanonePut(allParams).then((res) => {
              console.log(res)
              if (res.msg === "ok") {
               this.$message({
                message: '提交成功',
                type: 'success'
              });

               this.$router.push({ path: '/Kan/Kancheck' });

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
       this.$router.push({ path: '/Kan/Kancheck' });
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
    this.getonekan()
  }
}
</script>



<style scope>
.default{
  width: 100px;
  height: 144px;
}
</style>
