// pages/mine/mine.js
const { $Toast } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户个人信息
    userIco:'',
    userName:'Elaine cc',
    name:'---',
    stu_number:'---',
    visible: false, //在线咨询遮罩层显示

    // 我的服务
    service:[{
      url:'iconwodezhiyuaun',
      title:'预约记录',
      page: '../../pages/record/record'
    },{
      url:'iconshoucnagzhuanye',
      title:'暂未开放',
      // page: '../../pages/collectMajor/collectMajor'
    },{
      url:'iconshoucangyuanxiao',
      title:'暂未开放',
      // page: '../../pages/collectCollege/collectCollege'
    },],
    // 系统服务
    // sysServe:[{
    //   url:'iconbaogaojilu2',
    //   title:'报告记录',
    //   src: '../../pages/myReport/myReport'
    // },{
    //   url:'iconwodequanyi',
    //   title:'我的权益',
    //   src: '../../pages/packageArea/packageArea'
    // },{
    //   url:'iconzaixianfankui',
    //   title:'在线反馈',
    //   src: ''
    // },{
    //   url:'iconzaixianzhixun',
    //   title:'在线咨询',
    //   src: ''
    // },{
    //   url:'iconjiamengfenxiao',
    //   title:'加盟分销',
    //   src: '../../pages/affiliateDistribute/affiliateDistribute'
    // },{
    //   url:'iconfenxiaoshangzhongxin',
    //   title:'分销商中心',
    //   src: '../../pages/memberCentre/memberCentre'
    // }],
    sysServe:[{
      url:'iconzaixianfankui',
      title:'在线反馈',
      src: ''
    },{
      url:'iconwodequanyi',
      title:'退出登录',
      src: ''
    }]
  },

  //退出登录取消按钮
  closeMask(){
    this.setData({
      visible: false
    })
  },

  //退出登录
  logout(){
    wx.clearStorageSync()
    this.setData({
      visible: false
    })
    $Toast({
      content: "注销登录成功",
      type: 'success'
    });
    wx.redirectTo({
      url: "../../pages/login/login",
    })
  },

  //我的报告、收藏专业、收藏院校点击跳转页面
  navSerTo(e){
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: this.data.service[index].page,
    })
  },

  //列表功能点击事件
  navTo(e){
    let url = e.currentTarget.dataset.url
    if(url){
      wx.navigateTo({
        url: url,
      })
    }else{
      this.setData({
        visible: true
      })
    }
  },

  //复制电话弹出拨打电话的界面
   // 电话拨打
   callUs(){
    wx.makePhoneCall({
      phoneNumber: '18816820717',
    })
    this.setData({
      visible: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!wx.getStorageSync('userId')){
      wx.redirectTo({
        url: '../login/login'
      })
    }else{
      this.setData({
        name: wx.getStorageSync('userName'),
        stu_number: wx.getStorageSync('userId')
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})