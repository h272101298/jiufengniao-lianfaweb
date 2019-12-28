<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>拼团</el-breadcrumb-item>
        <el-breadcrumb-item>编辑活动</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

      <el-form label-width="130px" width="900px" center style="width: 1000px" :rules="rules" ref="newone" :model="newone">


        <el-form-item label="活动标题：" prop="title">
          <el-input v-model="newone.title" placeholder="请输入活动标题（10字以内）" maxlength="10" style="width:500px;"></el-input>
        </el-form-item>

<!--         <el-form-item label="商品数量：" prop="number">
          <el-input v-model="newone.number" type="number" min="0" placeholder="请输入商品数量" style="width:500px;"></el-input>
        </el-form-item> -->

        <el-form-item label="拼团限时：" prop="time">
          <el-input v-model="newone.time" type="number" min="0" placeholder="请输入拼团限时（小时）" style="width:500px;"></el-input>
        </el-form-item>

<!--         <el-form-item label="拼团时间：" prop="date">
          <el-date-picker v-model="date" type="datetimerange" :picker-options="pickerOptions" range-separator="-" value-format="yyyy-MM-dd HH:mm:ss" @change="getSTime" style="width:500px;" :editable=false start-placeholder="开始时间" end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item> -->

        <el-form-item label="拼团人数：" prop="people_number">
          <el-input v-model="newone.people_number" type="number" min="0" placeholder="请输入拼团人数" style="width:500px;"></el-input>
        </el-form-item>

<!--         <el-form-item label="原价：" prop="origin_price">
          <el-input v-model="newone.origin_price" type="number" min="0" placeholder="请输入原价" style="width:500px;"></el-input>
        </el-form-item>

        <el-form-item label="拼团价：" prop="price">
          <el-input v-model="newone.price" type="number" min="0" placeholder="请输入拼团价" style="width:500px;"></el-input>
        </el-form-item> -->

        <el-form-item label="能否使用免单券：" prop="free">
          <el-switch v-model="newone.free" @change="changequan" active-value="1" inactive-value="0" active-text="是" inactive-text="否"></el-switch>
        </el-form-item>

        <el-form-item style=";margin-top: 20px;">
          <el-button type="primary" @click="save()" size="medium">提交</el-button>
          <el-button @click="golist()" size="medium">取 消</el-button>
        </el-form-item>
      </el-form>


    </el-col>




  </el-row>
</template>



<script>


  import { GrouponeGet } from '../../api/api';

  import { GrouponePut } from '../../api/api';

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

      var checkvalue1 = (rule, value, callback) => {
        // console.log(value=='')
        // console.log(!value)
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
        date:'',
        pickerOptions:{
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },


        selectgood:true,

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
          // {required: true, validator: checkvalue1, trigger: 'blur'},
          // ],
        },

      };
    },


    methods:{


      getoneGroup(){
       var id = sessionStorage.getItem('Groupcheckid');
       this.actid= id
       // sessionStorage.removeItem('cardcheckid');
       var allParams = '?id='+id;
       GrouponeGet(allParams).then((res) => {
        this.date=[res.data.start,res.data.end]
        this.newone=res.data;

        // console.log(res)

      });
     },

     changequan(val){
      console.log(val)

    },


    // getSTime(val){
    //   console.log(val[0])
    //     // var arr = val.split(",")
    //     this.newone.start=val[0];
    //     this.newone.end=val[1];
    //   },


      save(){

        // if(this.newone.stock_id==''){
        //   this.$message.error(`请选择商品`);
        //   return
        // }
        
        // if(this.newone.start=='' || this.newone.end==''){
        //   this.$message.error(`请选择活动时间`);
        //   return
        // }

        this.$refs.newone.validate((valid) => {
          if (valid) {

           var allParams = '?id='+this.actid+'&title='+this.newone.title+'&time='+this.newone.time+'&people_number='+this.newone.people_number+'&free='+this.newone.free;

           console.log(allParams)
           GrouponePut(allParams).then((res) => {
            console.log(res)
            if (res.msg === "ok") {
             this.$message({
              message: '提交成功',
              type: 'success'
            });

             this.$router.push({ path: '/Group/Groupcheck' });

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

       this.$router.push({ path: '/Group/Groupcheck' });
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
  // this.getdefcard()
  this.getoneGroup()
}
}
</script>



<style scope>


.default{
  width: 100px;
  height: 144px;
  /*display: block;*/
}
</style>
