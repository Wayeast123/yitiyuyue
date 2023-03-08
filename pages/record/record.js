// pages/record/record.js
const app = getApp();
const { $Toast } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // list: [{    //预约列表
    //   booking_date: '2021-06-16',
    //   session_time: '19:40-21:00',
    //   name: '张三',
    //   gender: '男',
    //   stu_number: '3220000719',
    //   college: '智能制造学部'
    // },{
    //   booking_date: '2021-06-15',
    //   session_time: '19:40-21:00',
    //   name: '张三',
    //   gender: '男',
    //   stu_number: '3220000719',
    //   college: '智能制造学部'
    // },{
    //   booking_date: '2021-06-13',
    //   session_time: '16:30-18:00',
    //   name: '张三',
    //   gender: '男',
    //   stu_number: '3220000719',
    //   college: '智能制造学部'
    // }],
    list: [],
  },

  //获取预约记录信息
  getHistory(){
    this.setData({
      list: []
    })

    let params = {
      stu_number: wx.getStorageSync('userId')
    }

    wx.showLoading({
      title: '正在加载',
    })

    //获取场次信息
    let url = '/booking/history';
    app.wxRequest('POST',url,params, 
      (res) => {
        if(res.resultCode == "200"){
          wx.hideLoading()
          this.setData({
            list: res.data
          })
        }
        else if(res.resultCode == "606"){
          wx.hideLoading()
          $Toast({
            content: "暂无历史记录",
            type: 'warning'
         });
        }
        else{
          wx.hideLoading()
          $Toast({
            content: "加载失败",
            type: 'warning'
         });
        }
      },
      (err) => {
        wx.hideLoading()
        $Toast({
          content: "请求失败",
          type: 'error'
       });
      }
    ); 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!wx.getStorageSync('userId')){
      wx.redirectTo({
        url: '../login/login'
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
    this.getHistory()
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