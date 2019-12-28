import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui';
import { MessageBox } from 'element-ui';
import router from '../router/index'

axios.defaults.timeout = 1500000
axios.defaults.withCredentials = true
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'


//请求拦截器
axios.interceptors.request.use(config => {
	if (config.method === 'post') {
		config.data = qs.stringify(config.data)
	}
	return config
}, 
error => {

	console.log('错误的传参！')
})


//响应拦截器
axios.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		// console.log(error)
		if(error.response.status==401){
			var that=this;
			MessageBox.alert('请重新登录', '登录超时', {
				confirmButtonText: '确定',
				closeOnPressEscape:false,
				showClose:false,
				callback: action => {
					if(action=='confirm'){
						router.push('/login');
					}
				}
			});
		}else{
			Message({
				message: error.response.data.msg,
				type: 'error'
			});
		}
		return Promise.reject(error)
	})


// let base = 'http://192.168.1.172/Shop/public/v1'
// let base1 = 'http://192.168.1.172/Shop/public/v2'
// let base3 = 'http://192.168.1.172/Shop/public/v3'


// let hosturl = 'http://192.168.1.172/Shop/public/'
let hosturl ='https://niao.fengniaotuangou.cn/'
// let hosturl ='https://nx.pywoman.com/'

let base = hosturl+'v1'
let base1 = hosturl+'v2'
let base3 = hosturl+'v3'
let base4 = hosturl+'v4'

export default hosturl

//登录
export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data) }//登录

export const requestLogout = params => { return axios.get(`${base}/logout`+`${params}`).then(res => res.data)}//登出


//统计数据
export const countdataGet = params => { return axios.get(`${base}/count`+`${params}`).then(res => res.data)}


//广告
export const advertsGet = params => { return axios.get(`${base}/adverts`+`${params}`).then(res => res.data)}//轮播列表

export const advertPost = params => { return axios.post(`${base}/advert`, params).then(res => res.data)}//轮播提交

export const advertDel = params => { return axios.delete(`${base}/advert`+`${params}`).then(res => res.data)}//轮播删除

export const posterPost = params => { return axios.post(`${base}/poster/configs`, params).then(res => res.data)}//海报提交

export const posterGet = params => { return axios.get(`${base}/poster/configs`+`${params}`).then(res => res.data)}//海报获取

export const iconPost = params => { return axios.post(`${base}/icon/config`, params).then(res => res.data)}//图标提交

export const iconGet = params => { return axios.get(`${base}/icon/configs`+`${params}`).then(res => res.data)}//图标获取


//经营类目
export const categoriesGet = params => { return axios.get(`${base}/store/categories`+`${params}`).then(res => res.data)}

export const categoryPost = params => { return axios.post(`${base}/store/category`, params).then(res => res.data)}

export const categoryDel = params => { return axios.delete(`${base}/store/category`+`${params}`).then(res => res.data)}


//店铺
export const shopPost = params => { return axios.post(`${base}/store`, params).then(res => res.data)}

export const shopGet = params => { return axios.get(`${base}/stores`+`${params}`).then(res => res.data)}

//商家提现
export const shoptxPost = params => { return axios.post(`${base3}/store/withdraw`, params).then(res => res.data)}

export const shoptxGet = params => { return axios.get(`${base3}/store/withdraws`+`${params}`).then(res => res.data)}

export const shoptxCheck = params => { return axios.post(`${base3}/check/withdraw`, params).then(res => res.data)}



//入驻
export const sappliesGet = params => { return axios.get(`${base}/settle/applies`+`${params}`).then(res => res.data)}

export const sapplyPost = params => { return axios.post(`${base}/check/settle/apply`, params).then(res => res.data)}


//分销
export const aapplyGet = params => { return axios.get(`${base}/proxy/applies`+`${params}`).then(res => res.data)}

export const aapplyPass = params => { return axios.get(`${base}/proxy/pass`+`${params}`).then(res => res.data)}

export const aapplyReject = params => { return axios.get(`${base}/proxy/reject`+`${params}`).then(res => res.data)}

export const agentGet = params => { return axios.get(`${base}/proxy/users`+`${params}`).then(res => res.data)}

export const ratioPost = params => { return axios.post(`${base}/brokerage/ratio`, params).then(res => res.data)}

export const ratioGet = params => { return axios.get(`${base}/brokerage/ratio`+`${params}`).then(res => res.data)}

export const comGetAll = params => { return axios.get(`${base}/brokerages`+`${params}`).then(res => res.data)}

export const withdrawGet = params => { return axios.get(`${base}/withdraw/applies`+`${params}`).then(res => res.data)}

export const withdrawPass = params => { return axios.get(`${base}/withdraw/pass`+`${params}`).then(res => res.data)}

export const withdrawReject = params => { return axios.get(`${base}/withdraw/reject`+`${params}`).then(res => res.data)}



//商品分类
export const typeGet = params => { return axios.get(`${base}/product/types`+`${params}`).then(res => res.data)}

export const typePost = params => { return axios.post(`${base}/product/type`, params).then(res => res.data)}

export const typeDel = params => { return axios.delete(`${base}/product/type`+`${params}`).then(res => res.data)}

export const typehot = params => { return axios.get(`${base}/hot/type`+`${params}`).then(res => res.data)}//热门


//商品规格
export const guigeGet = params => { return axios.get(`${base}/product/categories`+`${params}`).then(res => res.data)}

export const guigePost = params => { return axios.post(`${base}/product/category`, params).then(res => res.data)}

export const guigeGai = params => { return axios.post(`${base}/edit/product/category`, params).then(res => res.data)}

export const guigeDel = params => { return axios.delete(`${base}/product/category`+`${params}`).then(res => res.data)}



//商品列表
export const goodGet = params => { return axios.get(`${base}/products`+`${params}`).then(res => res.data)}

export const goodnotify = params => { return axios.post(`${base}/product/notify`, params).then(res => res.data)}

export const goodPost = params => { return axios.post(`${base}/product`, params).then(res => res.data)}

export const goodoneGet = params => { return axios.get(`${base}/product`+`${params}`).then(res => res.data)}

export const goodRecycle = params => { return axios.get(`${base}/del/product`+`${params}`).then(res => res.data)}//加入回收站

export const goodDel = params => { return axios.delete(`${base}/product`+`${params}`).then(res => res.data)}//回收站永久删除

export const goodCheck = params => { return axios.get(`${base}/check/product`+`${params}`).then(res => res.data)}//审核

export const goodShelf = params => { return axios.get(`${base}/shelf/product`+`${params}`).then(res => res.data)}//上下架

// export const goodhot = params => { return axios.get(`${base}/hot`+`${params}`).then(res => res.data)}//热门
// export const goodnew = params => { return axios.get(`${base}/new`+`${params}`).then(res => res.data)}//新品
export const goodoffer = params => { return axios.get(`${base}/offer`+`${params}`).then(res => res.data)}//首页推荐




//订单
export const allorderGet = params => { return axios.get(`${base}/orders`+`${params}`).then(res => res.data)}

export const oneorderGet = params => { return axios.get(`${base}/order`+`${params}`).then(res => res.data)}

export const shipgoods = params => { return axios.post(`${base}/ship/order`, params).then(res => res.data)}

export const refundGet = params => { return axios.get(`${base}/refuses`+`${params}`).then(res => res.data)}

export const refundPost = params => { return axios.get(`${base}/refuse`+`${params}`).then(res => res.data)}

// export const orderDel = params => { return axios.delete(`${base}/order/list`+`${params}`).then(res => res.data)}

// export const exportOrder = params => { return axios.get(`${base3}/export/orders`+`${params}`).then(res => res.data)}



//快递
export const deliveryGet = params => { return axios.get(`${base}/expresses`+`${params}`).then(res => res.data)}

export const deliveryPost = params => { return axios.post(`${base}/express`, params).then(res => res.data)}

export const deliveryDel = params => { return axios.delete(`${base}/express`+`${params}`).then(res => res.data)}

//快递配置
export const kdconfigGet = params => { return axios.get(`${base}/express/config`+`${params}`).then(res => res.data)}

export const kdconfigPost = params => { return axios.post(`${base}/express/config`, params).then(res => res.data)}

//商铺设置快递
export const shopkdGet = params => { return axios.get(`${base3}/store/express`+`${params}`).then(res => res.data)}

export const shopkdPost = params => { return axios.post(`${base3}/store/express`, params).then(res => res.data)}




//用户
export const userGet = params => { return axios.get(`${base}/wechat/users`+`${params}`).then(res => res.data)}

export const usertohy = params => { return axios.post(`${base1}/member/user`, params).then(res => res.data)}//用户成为会员、续费

export const bindshop = params => { return axios.get(`${base3}/bind/user`+`${params}`).then(res => res.data)}

export const unbindshop = params => { return axios.get(`${base3}/unbind/user`+`${params}`).then(res => res.data)}



//会员
export const mconfigPost = params => { return axios.post(`${base1}/member/level`, params).then(res => res.data)}//设置会员等级

export const mconfigGet = params => { return axios.get(`${base1}/member/levels`+`${params}`).then(res => res.data)}//获取会员等级

export const mconfigDel = params => { return axios.delete(`${base1}/member/level`+`${params}`).then(res => res.data)}//删除会员等级

export const memberGet = params => { return axios.get(`${base1}/member/users`+`${params}`).then(res => res.data)}//会员列表

export const memberpay = params => { return axios.get(`${base1}/member/records`+`${params}`).then(res => res.data)}//会员充值记录


//管理员
export const adminGet = params => { return axios.get(`${base}/users`+`${params}`).then(res => res.data)}

export const adminPost = params => { return axios.post(`${base}/user`, params).then(res => res.data)}

export const adminDel = params => { return axios.delete(`${base}/user`+`${params}`).then(res => res.data)}


//角色
export const permissionGet = params => { return axios.get(`${base}/permissions`+`${params}`).then(res => res.data)}

export const roleGet = params => { return axios.get(`${base}/roles`+`${params}`).then(res => res.data)}

export const rolePost = params => { return axios.post(`${base}/role`, params).then(res => res.data)}

export const roleDel = params => { return axios.delete(`${base}/role`+`${params}`).then(res => res.data)}

export const defaultrole = params => { return axios.get(`${base}/default/role`+`${params}`).then(res => res.data)}



//基本设置
export const signPost = params => { return axios.post(`${base3}/sign/configs`, params).then(res => res.data)}

export const signGet = params => { return axios.get(`${base3}/sign/configs`+`${params}`).then(res => res.data)}

export const integralPost = params => { return axios.post(`${base3}/score/config`, params).then(res => res.data)}

export const integralGet = params => { return axios.get(`${base3}/score/config`+`${params}`).then(res => res.data)}



export const zitiPost = params => { return axios.post(`${base3}/pickup/config`, params).then(res => res.data)}

export const zitiGet = params => { return axios.get(`${base3}/pickup/config`+`${params}`).then(res => res.data)}




//微信设置
export const wxconfigPost = params => { return axios.post(`${base}/tx/config`, params).then(res => res.data)}

export const wxconfigGet = params => { return axios.get(`${base}/tx/config`+`${params}`).then(res => res.data)}

export const wxmodelPost = params => { return axios.post(`${base}/notify/config`, params).then(res => res.data)}

export const wxmodelGet = params => { return axios.get(`${base}/notify/configs`+`${params}`).then(res => res.data)}


//帮助文档
export const documentGet = params => { return axios.get(`${base}/documents`+`${params}`).then(res => res.data)}

export const documentPost = params => { return axios.post(`${base}/document`, params).then(res => res.data)}

export const documentDel = params => { return axios.delete(`${base}/document`+`${params}`).then(res => res.data)}




//活动通知
export const hdnotify = params => { return axios.post(`${base3}/notify/promotion`, params).then(res => res.data)}



//卡牌
export const CardgoodGet = params => { return axios.get(`${base}/type/products`+`${params}`).then(res => res.data)}

export const CardtypeGet = params => { return axios.get(`${base1}/product/stocks`+`${params}`).then(res => res.data)}

export const CardshopPost = params => { return axios.post(`${base1}/card/promotion`, params).then(res => res.data)}

export const CardshopPut = params => { return axios.put(`${base1}/card/promotion`+`${params}`).then(res => res.data)}

export const CardcheckGet = params => { return axios.get(`${base1}/card/promotions`+`${params}`).then(res => res.data)}

export const CardoneGet = params => { return axios.get(`${base1}/card/promotion`+`${params}`).then(res => res.data)}

export const CardonePut = params => { return axios.put(`${base1}/card/promotion`+`${params}`).then(res => res.data)}

export const Cardcheck = params => { return axios.get(`${base1}/check/promotion`+`${params}`).then(res => res.data)}

export const Carddelete = params => { return axios.delete(`${base1}/card/promotion`+`${params}`).then(res => res.data)}

export const Cardupdown = params => { return axios.get(`${base1}/enable/promotion`+`${params}`).then(res => res.data)}

export const DefaultCardPost = params => { return axios.post(`${base1}/default/card`, params).then(res => res.data)}

export const DefaultCardGet = params => { return axios.get(`${base1}/default/cards`+`${params}`).then(res => res.data)}

export const Cardhot = params => { return axios.get(`${base1}/hot/card/promotion`+`${params}`).then(res => res.data)}//推荐


// 砍价
export const KanshopPost = params => { return axios.post(`${base1}/bargain/promotion`, params).then(res => res.data)}

export const KancheckGet = params => { return axios.get(`${base1}/bargain/promotions`+`${params}`).then(res => res.data)}

export const KanoneGet = params => { return axios.get(`${base1}/bargain/promotion`+`${params}`).then(res => res.data)}

export const KanonePut = params => { return axios.put(`${base1}/bargain/promotion`+`${params}`).then(res => res.data)}

export const Kancheck = params => { return axios.get(`${base1}/check/bargain/promotion`+`${params}`).then(res => res.data)}

export const Kandelete = params => { return axios.delete(`${base1}/bargain/promotion`+`${params}`).then(res => res.data)}

export const Kanupdown = params => { return axios.get(`${base1}/enable/bargain/promotion`+`${params}`).then(res => res.data)}

export const Kanhot = params => { return axios.get(`${base1}/hot/bargain/promotion`+`${params}`).then(res => res.data)}//推荐


//拼团
export const GroupshopPost = params => { return axios.post(`${base3}/group/buy/promotion`, params).then(res => res.data)}

export const GroupcheckGet = params => { return axios.get(`${base3}/group/buy/promotions`+`${params}`).then(res => res.data)}

export const GrouponeGet = params => { return axios.get(`${base3}/group/buy/promotion`+`${params}`).then(res => res.data)}

export const GrouponePut = params => { return axios.put(`${base3}/group/buy/promotion`+`${params}`).then(res => res.data)}

export const Groupcheck = params => { return axios.get(`${base3}/check/group/buy/promotion`+`${params}`).then(res => res.data)}

export const Groupdelete = params => { return axios.delete(`${base3}/group/buy/promotion`+`${params}`).then(res => res.data)}

export const Groupupdown = params => { return axios.get(`${base3}/enable/group/buy/promotion`+`${params}`).then(res => res.data)}

export const Grouphot = params => { return axios.get(`${base3}/hot/group/buy/promotion`+`${params}`).then(res => res.data)}//推荐


//优惠券
export const couponPost = params => { return axios.post(`${base3}/coupon`, params).then(res => res.data)}

export const couponGet = params => { return axios.get(`${base3}/coupons`+`${params}`).then(res => res.data)}

export const couponDel = params => { return axios.delete(`${base3}/coupon`+`${params}`).then(res => res.data)}

export const couponstate = params => { return axios.get(`${base3}/enable/coupon`+`${params}`).then(res => res.data)}



//积分商城
export const igoodGet = params => { return axios.get(`${base3}/score/products`+`${params}`).then(res => res.data)}

export const igoodPost = params => { return axios.post(`${base3}/score/product`, params).then(res => res.data)}

export const igoodDel = params => { return axios.delete(`${base3}/score/product`+`${params}`).then(res => res.data)}

export const igoodCheck = params => { return axios.get(`${base3}/review/score/product`+`${params}`).then(res => res.data)}//审核

export const igoodShelf = params => { return axios.get(`${base3}/enable/score/product`+`${params}`).then(res => res.data)}//上下架

export const igoodhot = params => { return axios.get(`${base3}/hot/score/product`+`${params}`).then(res => res.data)}//推荐

export const igoodoneGet = params => { return axios.get(`${base3}/score/product`+`${params}`).then(res => res.data)}

export const scoreSet = params => { return axios.post(`${base3}/score/set`, params).then(res => res.data)}

export const scoreGet = params => { return axios.get(`${base3}/score/set`+`${params}`).then(res => res.data)}


export const drawSet = params => { return axios.post(`${base3}/prize`, params).then(res => res.data)}

export const drawGet = params => { return axios.get(`${base3}/prizes`+`${params}`).then(res => res.data)}

export const drawDel = params => { return axios.delete(`${base3}/prize`+`${params}`).then(res => res.data)}

export const drawsetSet = params => { return axios.post(`${base3}/prize/config`, params).then(res => res.data)}

export const drawsetGet = params => { return axios.get(`${base3}/prize/config`+`${params}`).then(res => res.data)}



//资讯
export const newsGet = params => { return axios.get(`${base4}/article`+`${params}`).then(res => res.data)}

export const newGet = params => { return axios.get(`${base4}/article/detail`+`${params}`).then(res => res.data)}

export const newsPost = params => { return axios.post(`${base4}/article`, params).then(res => res.data)}

export const newsPut = params => { return axios.put(`${base4}/article`+`${params}`).then(res => res.data)}

export const newsDel = params => { return axios.delete(`${base4}/article`+`${params}`).then(res => res.data)}