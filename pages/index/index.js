// index.js
// 获取应用实例
const { $Toast } = require('../../dist/base/index');
const app = getApp()

Page({
  data: {
    todayDate: '',
    todayWeek: '',
    visible: false,  //显示是否取消预约  
    weekArr: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
    list: [],
    noticeContent: '',
    bookingId: 0
  },

  //获取通告
  getNotice(){
    this.setData({
      noticeContent: ''
    })
    wx.showLoading({
      title: '正在加载',
    })
    let params = {}
    //获取通知
    let url = '/booking/notice';
    app.wxRequest('GET',url,params, 
      (res) => {
        if(res.resultCode == "200"){
          wx.hideLoading()
          this.setData({
            noticeContent: res.data[0].content
          })
        }else{
          wx.hideLoading()
          $Toast({
            content: "请求失败",
            type: 'error'
          });
        }
        console.log(res)
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

  //获取场次信息
  getData(){
    this.setData({
      list: []
    })
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
    //  let dateTime = date.toLocaleDateString().replace(/\//g, '-')

    //  console.log("date",dateTime,Y+M+D)
     let weekDay = this.data.weekArr[week]
     this.setData({
       todayWeek: weekDay,
       todayDate: dateTime
     })

    let params = {
      stu_number: wx.getStorageSync('userId'),
      weekday: week,
      booking_date: dateTime
    }

    wx.showLoading({
      title: '正在加载',
    })

    //获取场次信息
    let url = '/booking/session';
    app.wxRequest('POST',url,params, 
      (res) => {
        if(res.resultCode == "200"){
          wx.hideLoading()
          this.setData({
            list: res.data
          })
        }else{
          wx.hideLoading()
          $Toast({
            content: "请求失败",
            type: 'error'
          });
        }
        console.log(res)
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
  cancelCertain(e){
    this.setData({
      visible: true,
      bookingId: e.target.dataset.id
    })
    // this.cancelReservation(e)
  },

  //取消预约弹窗消失
  handleCancel(){
    this.setData({
      visible: false,
      bookingId: 0
    })
  },
  

  //预约场次
  reservation(e){
    let params = {
      session_id: e.target.dataset.id,
      booking_date: this.data.todayDate,
      stu_number: wx.getStorageSync('userId'),
    }

    wx.showLoading({
      title: '正在预约',
    })

    //预约场次
    let url = '/booking/book';
    app.wxRequest('POST',url,params, 
      (res) => {
        if(res.resultCode == "200"){
          wx.hideLoading()
          $Toast({
            content: '预约成功',
            type: 'success'
          });
          this.getData()
        }else if(res.resultCode == "604"){
          wx.hideLoading()
          $Toast({
            content: "请勿重复预约！",
            type: 'warning'
          });
        }
        else{
          wx.hideLoading()
          $Toast({
            content: res.resultMsg,
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

  //取消预约
  cancelReservation(e){
    let params = {
      booking_id: this.data.bookingId
    }

    wx.showLoading({
      title: '正在取消预约',
    })

    //取消预约
    let url = '/booking/cancel';
    app.wxRequest('POST',url,params, 
      (res) => {
        if(res.resultCode == "200"){
          wx.hideLoading()
          $Toast({
            content: '取消预约成功',
            type: 'success'
          });
          this.setData({
            visible: false,
            bookingId: 0
          })
          this.getData()
        }else{
          wx.hideLoading()
          $Toast({
            content: res.resultMsg,
            type: 'warning'
         });
         this.setData({
          visible: false,
          bookingId: 0
        })
        }
      },
      (err) => {
        wx.hideLoading()
        $Toast({
          content: "请求失败",
          type: 'error'
       });
       this.setData({
        visible: false,
        bookingId: 0
      })
    }
    ); 
  },

  onLoad() {
    if(!wx.getStorageSync('userId')){
      wx.redirectTo({
        url: '../login/login'
      })
    }
  },

   /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取开放场次信息
    this.getData()
    this.getNotice()
  },
})
