import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'

import { MessageBox } from 'element-ui';

import Console from '@/components/index/Console'

import Goodlist from '@/components/Good/Goodlist'
import Goodtype from '@/components/Good/Goodtype'
import Goodformat from '@/components/Good/Goodformat'
import Goodnew from '@/components/Good/Goodnew'
import Goodrecycle from '@/components/Good/Goodrecycle'

import Igoodnew from '@/components/Integral/Igoodnew'
import Igoodlist from '@/components/Integral/Igoodlist'
import Idraw from '@/components/Integral/Idraw'

import Orderlist from '@/components/Order/Orderlist'
import Refund from '@/components/Order/Refund'

import Userlist from '@/components/User/Userlist'

import Memberpay from '@/components/Member/Memberpay'
import Memberlist from '@/components/Member/Memberlist'
import MemberSet from '@/components/Member/MemberSet'


import Proxyapply from '@/components/Agent/Proxyapply'
import Proxylist from '@/components/Agent/Proxylist'
import Withdraw from '@/components/Agent/Withdraw'
import Commission from '@/components/Agent/Commission'

import Cardnew from '@/components/Card/Cardnew'
import Cardgood from '@/components/Card/Cardgood'
import Cardcheck from '@/components/Card/Cardcheck'
import Cardchange from '@/components/Card/Cardchange'
import Cardpass from '@/components/Card/Cardpass'


import Kannew from '@/components/Kan/Kannew'
import Kangood from '@/components/Kan/Kangood'
import Kancheck from '@/components/Kan/Kancheck'
import Kanchange from '@/components/Kan/Kanchange'
import Kanpass from '@/components/Kan/Kanpass'


import Groupnew from '@/components/Group/Groupnew'
import Groupgood from '@/components/Group/Groupgood'
import Groupcheck from '@/components/Group/Groupcheck'
import Groupchange from '@/components/Group/Groupchange'
import Grouppass from '@/components/Group/Grouppass'


import Shoplist from '@/components/Shop/Shoplist'
import Newshop from '@/components/Shop/Newshop'
import Coupon from '@/components/Shop/Coupon'
import Shoptype from '@/components/Shop/Shoptype'
import Settleapply from '@/components/Shop/Settleapply'
import Withdrawls from '@/components/Shop/Withdrawls'
import Withdrawsq from '@/components/Shop/Withdrawsq'

import Adlist from '@/components/Advertise/Adlist'

import Adminlist from '@/components/Role/Adminlist'
import Rolelist from '@/components/Role/Rolelist'
import Roleedit from '@/components/Role/Roleedit'

import Baseset from '@/components/Setting/Baseset'
import Wechatset from '@/components/Setting/Wechatset'
import Document from '@/components/Setting/Document'

import Delivelist from '@/components/Delivery/Delivelist'
import Shopdelive from '@/components/Delivery/Shopdelive'

import Newslist from '@/components/News/Newslist'


// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/components/Login'], resolve)

Vue.use(Router)

let router = new Router({
    mode: 'history', 
    routes: [{
        path: '/Login',
        name: '登录',
        component: Login
    }, {
        leaf: true,
        path: '/',
        name: '控制',
        component: Home,
        redirect: '/index/Console',
        menuShow: true,
        iconCls: 'iconfont menu-kongzhi',
        children: [
        {path: '/index/Console',component: Console,name: '控制台',menuShow: true,meta:{permission: ''}},
        ]
    },{
        path: '/',
        name: '商家管理',
        component: Home,
        redirect: '/Shop/Shoplist',
        menuShow: true,
        iconCls: 'iconfont menu-shangjia',
        children: [
        {path: '/Shop/Newshop',component: Newshop,name: '我的店铺',menuShow: true,meta:{permission: 'myStore'}}, 
        {path: '/Shop/Shoplist',component: Shoplist,name: '商家列表',menuShow: true,meta:{permission: 'storeList'}}, 
        {path: '/Shop/Settleapply',component: Settleapply,name: '入驻申请',menuShow: true,meta:{permission: 'settleList'}},
        {path: '/Shop/Shoptype',component: Shoptype,name: '经营类目',menuShow: true,meta:{permission: 'storeCategoryList'}},
        {path: '/Shop/Coupon',component: Coupon,name: '优惠券',menuShow: true,meta:{permission: 'quanList'}},
        {path: '/Shop/Withdrawsq',component: Withdrawsq,name: '提现申请',menuShow: true,meta:{permission: ''}},
        {path: '/Shop/Withdrawls',component: Withdrawls,name: '提现审批',menuShow: true,meta:{permission: 'StoreWithdrawcheck'}}
        ]
    }, {
        path: '/',
        name: '商品管理',
        component: Home,
        redirect: '/Good/Goodlist',
        menuShow: true,
        iconCls: 'iconfont menu-good',
        children: [
        {path: '/Good/Goodnew',component: Goodnew,name: '添加商品',menuShow: false,meta:{permission: 'productAdd'}}, 
        {path: '/Good/Goodlist',component: Goodlist,name: '商品列表',menuShow: true,meta:{permission: ''}}, 
        {path: '/Good/Goodtype',component: Goodtype,name: '商品分类',menuShow: true,meta:{permission: 'productTypeList'}}, 
        {path: '/Good/Goodformat',component: Goodformat,name: '商品规格',menuShow: true,meta:{permission: 'productCategoryList'}}, 
        {path: '/Good/Goodrecycle',component: Goodrecycle,name: '商品回收站',menuShow: true,meta:{permission: 'productRecycle'}}
        ]
    }, {
        path: '/',
        name: '订单管理',
        component: Home,
        redirect: '/Order/Orderlist',
        menuShow: true,
        iconCls: 'iconfont menu-dingdan',
        children: [
        {path: '/Order/Orderlist',component: Orderlist,name: '购物订单',menuShow: true,meta:{permission: ''}}, 
        {path: '/Order/Refund',component: Refund,name: '退款',menuShow: true,meta:{permission: ''}},
        ]
    }, {
        path: '/',
        name: '积分商城',
        component: Home,
        redirect: '/Integral/Igoodlist',
        menuShow: true,
        iconCls: 'iconfont menu-card',
        children: [
        {path: '/Integral/Igoodnew',component: Igoodnew,name: '添加商品',menuShow: false,meta:{permission: ''}}, 
        {path: '/Integral/Igoodlist',component: Igoodlist,name: '积分商品',menuShow: true,meta:{permission: ''}}, 
        {path: '/Integral/Idraw',component: Idraw,name: '抽奖设置',menuShow: true,meta:{permission: ''}}, 
        ]
    },{
        leaf: true,
        path: '/',
        name: '用户管理',
        component: Home,
        redirect: '/User/Userlist',
        menuShow: true,
        iconCls: 'iconfont menu-yonghu',
        children: [
        {path: '/User/Userlist',component: Userlist,name: '用户列表',menuShow: true,meta:{permission: 'userList'}},
        ]
    },  {
        path: '/',
        name: '会员管理',
        component: Home,
        redirect: '/Member/Memberlist',
        menuShow: true,
        iconCls: 'iconfont menu-yonghu',
        children: [
        {path: '/Member/Memberlist',component: Memberlist,name: '会员列表',menuShow: true,meta:{permission: 'memberList'}},
        {path: '/Member/MemberSet',component: MemberSet,name: '等级设置',menuShow: true,meta:{permission: 'memberLevelList'}},
        {path: '/Member/Memberpay',component: Memberpay,name: '会员充值',menuShow: true,meta:{permission: 'memberRecords'}}
        ]
    },{
        path: '/',
        name: '代理管理',
        component: Home,
        redirect: '/Agent/Proxyapply',
        menuShow: true,
        iconCls: 'iconfont menu-agent',
        children: [
        {path: '/Agent/Proxyapply',component: Proxyapply,name: '分销申请',menuShow: true,meta:{permission: 'proxyApplyList'}}, 
        {path: '/Agent/Proxylist',component: Proxylist,name: '代理列表',menuShow: true,meta:{permission: 'proxyList'}}, 
        {path: '/Agent/Commission',component: Commission,name: '佣金管理',menuShow: true,meta:{permission: 'brokerageList'}}, 
        {path: '/Agent/Withdraw',component: Withdraw,name: '提现管理',menuShow: true,meta:{permission: 'withdrawList'}}
        ]
    }, {
        path: '/',
        name: '集卡牌',
        component: Home,
        redirect: '/Card/Cardgood',
        menuShow: true,
        iconCls: 'iconfont menu-card',
        children: [
        {path: '/Card/Cardnew',component: Cardnew,name: '发布活动',menuShow: false,meta:{permission: ''}}, 
        {path: '/Card/Cardgood',component: Cardgood,name: '活动列表',menuShow: true,meta:{permission: 'storeCardPromotions'}}, 
        {path: '/Card/Cardcheck',component: Cardcheck,name: '待审核',menuShow: true,meta:{permission: 'checkCardPromotions'}}, 
        {path: '/Card/Cardchange',component: Cardchange,name: ' 编辑活动',menuShow: false,meta:{permission: ''}}, 
        {path: '/Card/Cardpass',component: Cardpass,name: '通过列表',menuShow: true,meta:{permission: 'allCardPromotions'}}
        ]
    }, 

    {
        path: '/',
        name: '限时拼团',
        component: Home,
        redirect: '/Group/Groupgood',
        menuShow: true,
        iconCls: 'iconfont menu-pintuan',
        children: [
        {path: '/Group/Groupnew',component: Groupnew,name: '发布活动',menuShow: false,meta:{permission: ''}},
        {path: '/Group/Groupgood',component: Groupgood,name: '活动列表',menuShow: true,meta:{permission: 'storePintuanPromotions'}},
        {path: '/Group/Groupcheck',component: Groupcheck,name: '待审核',menuShow: true,meta:{permission: 'checkPintuanPromotions'}},
        {path: '/Group/Groupchange',component: Groupchange,name: '编辑活动',menuShow: false,meta:{permission: ''}},
        {path: '/Group/Grouppass',component: Grouppass,name: '通过列表',menuShow: true,meta:{permission: 'allPintuanPromotions'}},
        ]
    }, 

    {
        path: '/',
        name: '限时砍价',
        component: Home,
        redirect: '/Kan/Kangood',
        menuShow: true,
        iconCls: 'iconfont menu-kanjia',
        children: [
        {path: '/Kan/Kannew',component: Kannew,name: '发布活动',menuShow: false,meta:{permission: ''}}, 
        {path: '/Kan/Kangood',component: Kangood,name: '活动列表',menuShow: true,meta:{permission: 'storeBargainPromotions'}}, 
        {path: '/Kan/Kancheck',component: Kancheck,name: '待审核',menuShow: true,meta:{permission: 'checkBargainPromotions'}}, 
        {path: '/Kan/Kanchange',component: Kanchange,name: ' 编辑活动',menuShow: false,meta:{permission: ''}}, 
        {path: '/Kan/Kanpass',component: Kanpass,name: '通过列表',menuShow: true,meta:{permission: 'allBargainPromotions'}}
        ]
    }, {
        leaf: true,
        path: '/',
        name: '广告管理',
        component: Home,
        redirect: '/Advertise/Adlist',
        menuShow: true,
        iconCls: 'iconfont menu-guanggao',
        children: [
        {path: '/Advertise/Adlist',component: Adlist,name: '广告设置',menuShow: true,meta:{permission: 'advertList'}}
        ]
    }, {
        // leaf: true,
        path: '/',
        name: '快递配置',
        component: Home,
        redirect: '/Delivery/Delivelist',
        menuShow: true,
        iconCls: 'iconfont menu-kuaidi',
        children: [
        {path: '/Delivery/Delivelist',component: Delivelist,name: '快递列表',menuShow: true,meta:{permission: 'expressList'}},
        {path: '/Delivery/Shopdelive',component: Shopdelive,name: '运费配置',menuShow: true,meta:{permission: 'shopdelive'}},
        ]
    },
    {
        path: '/',
        name: '资讯管理',
        component: Home,
        redirect: '/News/Newslist',
        menuShow: true,
        iconCls: 'iconfont menu-kuaidi',
        children: [
        {path: '/News/Newslist',component: Newslist,name: '资讯列表',menuShow: true,meta:{permission: ''}},
        ]
    },

    {
        path: '/',
        name: '权限管理',
        component: Home,
        redirect: '/Role/Adminlist',
        menuShow: true,
        iconCls: 'iconfont menu-quanxian',
        children: [
        {path: '/Role/Adminlist',component: Adminlist,name: '管理员列表',menuShow: true,meta:{permission: 'adminList'}}, 
        {path: '/Role/Rolelist',component: Rolelist,name: '角色列表',menuShow: true,meta:{permission: 'roleList'}},
        {path: '/Role/Roleedit',component: Roleedit,name: '编辑角色',menuShow: false,meta:{permission: 'roleAdd'}} 
        ]
    }, {
        path: '/',
        name: '系统设置',
        component: Home,
        redirect: '/Setting/Baseset',
        menuShow: true,
        iconCls: 'iconfont menu-xitong',
        children: [
        {path: '/Setting/Baseset',component: Baseset,name: '基本设置',menuShow: true,meta:{permission: 'baseConfig'}},
        {path: '/Setting/Wechatset',component: Wechatset,name: '微信设置',menuShow: true,meta:{permission: 'txConfig'}},
        {path: '/Setting/Document',component: Document,name: '关于我们',menuShow: true,meta:{permission: 'documentList'}}]
    }, ]
})





router.beforeEach((to, from, next) => {
    if (to.path.startsWith('/Login')) {
        next()
    } else {
        let permissions = window.sessionStorage.getItem('permissions')
        if(!permissions){
            next({path: '/Login'})
        }
        // console.log(permissions.indexOf(to.meta.permission))
        if (to.meta.permission && permissions) {
            if (permissions.indexOf(to.meta.permission)>-1) {
              next()
          } else {
             MessageBox.alert('没有访问权限', '提示', {
                confirmButtonText: '确定',
                closeOnPressEscape:false,
                showClose:false,
                callback: action => {

                }
            });
         }
     }else{
       next() 
   }
}
})

router.afterEach((transition) => {

// console.log(transition)

})

export default router