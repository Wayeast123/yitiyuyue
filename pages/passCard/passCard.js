// pages/passCard/passCard.js
const app = getApp();
const {
  $Toast
} = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listMe: [{
      booking_date: '',
      session_time: '19:40 - 21:00',
      name: '苏奕娜',
      gender: '女',
      stu_number: '3220000719',
      number: 40,
      college: '智能制造学部'
    }, {
      booking_date: '',
      session_time: '19:40 - 21:00',
      name: '邹娟娜',
      gender: '女',
      stu_number: '3220000880',
      number: 40,
      college: '智能制造学部'
    }, {
      booking_date: '',
      session_time: '19:40 - 21:00',
      name: '冯嘉雯',
      gender: '女',
      stu_number: '3220000786',
      number: 40,
      college: '智能制造学部'
    }],
    stuNum: '',
    visible: false, //显示是否取消预约  
    attentionAnim: '', //图标动画效果
    list: []
  },

  //获取今天预约信息
  reservationInfo() {
    this.setData({
      list: []
    })

    //时间戳
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //当前日期
    var n = timestamp * 1000;
    var date = new Date(n);
    //获取年  
    var Y = date.getFullYear();
    //获取月  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    console.log("当前日期：" + Y + '年' + M + '月' + D + '日');
    let dateTime = Y + '-' + M + '-' + D

    // let dateTime = date.toLocaleDateString().replace(/\//g, '-')

    let params = {
      stu_number: wx.getStorageSync('userId'),
      booking_date: dateTime
    }

    wx.showLoading({
      title: '正在加载',
    })

    //获取场次信息
    let url = '/booking/today';
    app.wxRequest('POST', url, params,
      (res) => {
        if (res.resultCode == "200") {
          wx.hideLoading()
          this.setData({
            list: res.data
          })
          wx.setStorageSync('userName', res.data[0].name)
        } else if (res.resultCode == "606") {
          wx.hideLoading()
          $Toast({
            content: "暂无预约",
            type: 'warning'
          });
        } else {
          wx.hideLoading()
          $Toast({
            content: "加载失败",
            type: 'error'
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

  //取消预约弹窗
  cancelCertain(e) {
    this.setData({
      visible: true
    })
    // this.cancelReservation(e)
  },

  //取消预约弹窗消失
  handleCancel() {
    this.setData({
      visible: false
    })
  },

  //取消预约
  cancelReservation(e) {
    let params = {
      booking_id: e.target.dataset.id
    }

    wx.showLoading({
      title: '正在取消预约',
    })

    //取消预约
    let url = '/booking/cancel';
    app.wxRequest('POST', url, params,
      (res) => {
        if (res.resultCode == "200") {
          wx.hideLoading()
          wx.showToast({
            icon: 'success',
            title: '取消预约成功',
          })
          this.reservationInfo()
        } else {
          wx.hideLoading()
          $Toast({
            content: res.resultMsg,
            type: 'warning'
          });
        }
        this.setData({
          visible: false
        })
      },
      (err) => {
        wx.hideLoading()
        $Toast({
          content: "请求失败",
          type: 'error'
        });
        this.setData({
          visible: false
        })
      }
    );
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.getStorageSync('userId')) {
      wx.redirectTo({
        url: '../login/login'
      })
    } else if (wx.getStorageSync('userId') == '3220000719' || wx.getStorageSync('userId') == '3220000786' || wx.getStorageSync('userId') == '3220000880') {
      //时间戳
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      //当前日期
      var n = timestamp * 1000;
      var date = new Date(n);

      let week = date.getDay()
      //获取年  
      var Y = date.getFullYear();
      //获取月  
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      //获取当日 
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      console.log("当前日期：" + Y + '年' + M + '月' + D + '日');
      let dateTime = Y + '-' + M + '-' + D
      this.setData({
        stuNum: wx.getStorageSync('userId'),
        ['listMe[0].booking_date']: dateTime,
        ['listMe[1].booking_date']: dateTime,
        ['listMe[2].booking_date']: dateTime
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //行程卡图片动画
    var attentionAnim = wx.createAnimation({
      duration: 700,
      timingFunction: 'linear',
      delay: 0
    })
    //设置循环动画
    this.attentionAnim = attentionAnim
    var next = true;
    setInterval(function () {
      if (next) {
        //根据需求实现相应的动画
        this.attentionAnim.scale(1.1).step()
        next = !next;
      } else {
        this.attentionAnim.scale(0.9).step()
        next = !next;
      }
      this.setData({
        //导出动画到指定控件animation属性
        attentionAnim: attentionAnim.export()
      })
    }.bind(this), 700)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.reservationInfo()
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