<template>
  <el-row class="container">

    <!--头部-->
    <el-col :span="24" class="topbar-wrap">

      <div class="topbar-title">
        <span style="font-size: 18px;color: #fff;">商城后台</span>
      </div>
      <el-button class="clear" size="mini" type='primary' @click="quanping()">{{fstext}}</el-button>
      <div class="topbar-account topbar-btn">
        <!-- <el-button class="clear" size="mini" type='primary' @click="">清除缓存</el-button> -->

        <el-dropdown trigger="click">
          <span class="el-dropdown-link userinfo-inner"><i class="iconfont menu-yonghu" style="margin-right: 10px;"></i> {{username}} <i class="iconfont icon-down" style="margin-left: 10px;"></i></span>
          <el-dropdown-menu slot="dropdown" style="top: 38px!important">
            <el-dropdown-item  @click.native="logout"><span style="color: #555;font-size: 14px;">退出登录</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>

    <!--中间-->
    <el-col :span="24" class="main">
      <!--左侧导航-->
      <aside :class="{showSidebar:!collapsed}">
        <!--展开折叠开关-->
        <div class="menu-toggle" @click.prevent="collapse">
          <i class="iconfont menu-angleleft" v-show="!collapsed"></i>
          <i class="iconfont menu-angleright" v-show="collapsed"></i>
        </div>
        <!--导航菜单-->
        <!-- <el-menu default-active="0" router :collapse="collapsed"> -->
          <el-menu default-active="0" router :collapse="collapsed" unique-opened>
            <template v-for="(item,index) in $router.options.routes" v-if="item.menuShow">
              <el-submenu v-if="!item.leaf" :index="index+''">
                <template slot="title"><i :class="item.iconCls"></i>
                  <span slot="title">{{item.name}}</span>
                </template>
                <el-menu-item v-for="term in item.children" :key="term.path" :index="term.path" v-if="term.menuShow" :class="$route.path==term.path?'is-active':''" v-per="term.meta.permission">
                  <i :class="term.iconCls"></i>
                  <span slot="title">{{term.name}}</span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else-if="item.leaf&&item.children&&item.children.length" :index="item.children[0].path" :class="$route.path==item.children[0].path?'is-active':''" v-per="item.children[0].meta.permission">
                <i :class="item.iconCls"></i>
                <span slot="title">{{item.children[0].name}}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </aside>

        <!--右侧内容区-->
        <section class="content-container">
          <canvas id="canvas"></canvas>
          <div class="grid-content bg-purple-light">
            <el-col :span="24" class="content-wrapper">
              <transition name="fade" mode="out-in">
                <router-view></router-view>
              </transition>
            </el-col>
          </div>
        </section>
      </el-col>
    </el-row>



  </template>

  <script>
    import { requestLogout } from '../api/api';

    import Vue from 'vue'

    Vue.directive('per',function(el,binding){
      let permissions = window.sessionStorage.getItem('permissions')
      if(permissions.indexOf(binding.value)<0){
        el.style="display:none"
      }
    })

    export default {
      name: 'home',
      created(){


      },
      data () {
        return {
          collapsed: false,
          fullscreen: false,
          fstext:'全屏',
          username:''
        }
      },
      props: {
        dotsNum: {
          type: Number,
          default: 0
        },
        isColor: {
          type: Boolean,
          default: true
        },
        roundColor: {
          type: String,
          default: "#999"
        },
        lineColor: {
          type: String,
          default: "#ccc"
        }
      },
      methods: {
        quanping(){
          let element = document.documentElement;
          if (this.fullscreen) {
            this.fstext='全屏'
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.webkitCancelFullScreen) {
              document.webkitCancelFullScreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            }
          } else {
           this.fstext='退出全屏'
           if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if (element.msRequestFullscreen) {

            element.msRequestFullscreen();
          }
        }
        this.fullscreen = !this.fullscreen;
      },

      collapse: function () {
        this.collapsed = !this.collapsed;
      },

      showMenu(i, status){
        this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
      },

      logout(){
        var _this = this;
        this.$confirm('确认退出吗?', '提示', {
          type: 'warning',
          center: true,
          // showCancelButton:false,
          cancelButtonClass:'cancelButton'

        }).then(() => {
          var allParams = '';
          requestLogout(allParams).then((res) => {
            sessionStorage.removeItem('permissions');
            sessionStorage.removeItem('username');
          });
          _this.$router.push('/login');
        }).catch(() => {
        });
      }
    },
    mounted() {
      var name = sessionStorage.getItem('username');
      var arr =name.split('"');
      this.username=arr[1];

      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      const rndCl = () => Math.floor(Math.random() * 225);
      const width = window.innerWidth;
      const height = window.innerHeight;
      var base_list = [];
      canvas.width = width;
      canvas.height = height;
        // 绘制园
        const drawRounds = (obj, index) => {
          let { x, y, r, color } = obj;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, 2 * Math.PI);
          if (this.isColor) {
            ctx.fillStyle = color;
          } else {
            ctx.fillStyle = this.roundColor
          }
          ctx.fill();
          ctx.closePath();
        }
        //判断移动方向
        const controlDirection = (obj) => {
          if (obj.x >= (width - obj.r)) {
            obj.controlX = "left";
          } else if (obj.x <= parseInt(obj.r / 2)) {
            obj.controlX = "right";
          }
          if (obj.y >= (height - obj.r)) {
            obj.controlY = "bottom";
          } else if (obj.y <= parseInt(obj.r / 2)) {
            obj.controlY = "top"
          }
          return obj
        }
        //划线
        const drawLine = (list) => {
          list.map((item, index) => {
                // console.log("item:", item);
                ctx.beginPath();
                ctx.moveTo(item.x1, item.y1);
                ctx.lineTo(item.x2, item.y2);
                ctx.LineWeight = 1;
                if (this.isColor) {
                  ctx.strokeStyle = item.color;
                } else {
                  ctx.strokeStyle = this.lineColor
                }
                ctx.stroke();
                ctx.closePath();
              })
        }
        //绘制
        const draw = (list) => {
          let dots_arr = [];
          let line_arr = [];
          list.map((item, index) => {
            let xy = controlDirection(item);
            let obj = roundMove(xy);
            dots_arr.push(obj);
          });
          dots_arr.map((item1, index1) => {
            dots_arr.map((item2, index2) => {
              if (item1 !== item2) {
                let x = item1.x - item2.x;
                let y = item1.y - item2.y;
                if (Math.abs(x) < 150 && Math.abs(y) < 150) {
                  let obj = {
                    x1: item1.x,
                    y1: item1.y,
                    x2: item2.x,
                    y2: item2.y,
                    color: item1.color
                  }
                  line_arr.push(obj)
                }
              }
            })
          })
          drawLine(line_arr);
          dots_arr.map((item, index) => {
            drawRounds(item, index)
          })
          base_list = dots_arr;
          setTimeout(() => {
                // if(this.paused){
                  reDraw()
                // }
              }, 50)
        }
        const reDraw = () => {
          ctx.clearRect(0, 0, width, height);
          draw(base_list)
        }
        //移动
        const roundMove = (obj) => {
          switch (obj.controlX) {
            case "right":
            obj.x++;
            break;
            case "left":
            obj.x--;
            break;
            default:
          }
          switch (obj.controlY) {
            case "top":
            obj.y++;
            break;
            case "bottom":
            obj.y--;
            break;
            default:
          }
          return obj
        }
        //创造圆点
        const creatDots = () => {
          let arr = [];
          for (let i = 0; i < this.dotsNum; i++) {
            let obj = {};
            obj.x = parseInt(Math.random() * width);
            obj.y = parseInt(Math.random() * height);
            obj.r = parseInt(Math.random() * 10);
            obj.controlX = parseInt(Math.random() * 10) > 5 ? "left" : "right"
            obj.controlY = parseInt(Math.random() * 10) > 5 ? "bottom" : "top"
            obj.color = `rgba(${rndCl()},${rndCl()},${rndCl()},.3)`
            arr.push(obj)
          }
          return arr
        }
        draw(creatDots())
        //鼠标移动
        const moveXY = (event) => {
          let obj = {};
          obj.x = event.clientX;
          obj.y = event.clientY;
          obj.r = 0;
          base_list[0] = obj;
          base_list[0]["r"] = 1;
        }
        //鼠标点击
        const addXY = (event) => {
          let obj = {};
          obj.x = event.clientX;
          obj.y = event.clientY;
          obj.r = parseInt(Math.random() * 10);
          obj.color = `rgba(${rndCl()},${rndCl()},${rndCl()},.3)`;
          obj.controlX = parseInt(Math.random() * 10) > 5 ? 'left' : 'right'
          obj.controlY = parseInt(Math.random() * 10) > 5 ? 'bottom' : 'top'
          base_list.push(obj);
        }
        window.addEventListener("mousemove", moveXY);
        window.addEventListener("click", addXY)
      }

    }
  </script>


  <style>
  
  .cancelButton{
    margin-right: 10px!important;
  } 
</style>

<style scoped>
#canvas{
  position: fixed;
  z-index: -999;
  top: 50px;
  left: 180px;
  width: calc(100%-50px);
  height: calc(100%-180px);
  opacity: 0;
}

.clear{
  float: right;
  /*position: absolute;*/
  margin-right: 10px;
  margin-top: 11px;
}
.fullscreen{
  position: absolute;
  right: 220px;
  top: 11px;
}

.el-dropdown-menu, .el-popper{
  top: 38px!important;
  min-width: 100px;
}

/*  .el-button+.el-button {
    margin-left: 10px!important;
    }*/
  </style>

  <style scoped lang="scss">

  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;

    .topbar-wrap {
      height: 50px;
      line-height: 50px;
      background: #373d41;
      padding: 0px;

      .topbar-btn {
        color: #fff;
      }
      .topbar-btn:hover {
        background-color: #373d41;
      }
      .topbar-logo {
        float: left;
        width: 59px;
        line-height: 26px;
      }
      .topbar-logos {
        float: left;
        width: 120px;
        line-height: 26px;
      }
      .newmsg :hover{
        background-color: #373d41;
      }
      .topbar-logo img, .topbar-logos img {
        height: 40px;
        margin-top: 5px;
        margin-left: 2px;
      }
      .topbar-title {
        float: left;
        text-align: left;
        width: 200px;
        padding-left: 10px;
        border-left: 1px solid #000;
      }
      .topbar-account {
        float: right;
        padding-right: 12px;
      }
      .userinfo-inner {
        cursor: pointer;
        color: #fff;
        padding-left: 10px;
      }
    }
    .main {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      position: absolute;
      top: 50px;
      bottom: 0px;
      /*padding-bottom: 50px;*/
      overflow: hidden;
    }

    aside {
      min-width: 50px;
      background: #333744;
      &::-webkit-scrollbar {
        display: none;
      }

      &.showSidebar {
        overflow-x: hidden;
        overflow-y: auto;
      }

      .el-menu {
        height: 100%; /*写给不支持calc()的浏览器*/
        height: -moz-calc(100% - 80px);
        height: -webkit-calc(100% - 80px);
        height: calc(100% - 80px);
        border-radius: 0px;
        background-color: #333744;
      }

      .el-submenu .el-menu-item {
        min-width: 60px;
      }
      .el-menu {
        width: 180px;
      }
      .el-menu--collapse {
        width: 60px;
      }

      .el-menu .el-menu-item, .el-submenu .el-submenu__title {
        height: 46px;
        line-height: 46px;
      }

      .el-menu-item:hover, .el-submenu .el-menu-item:hover, .el-submenu__title:hover {
        background-color: #7ed2df;
      }
    }

    .menu-toggle {
      background: #4A5064;
      text-align: center;
      color: white;
      height: 26px;
      line-height: 30px;
    }

    .content-container {
      background: #fff;
      flex: 1;
      overflow-y: auto;
      padding: 10px;
      padding-bottom: 1px;

      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
</style>
