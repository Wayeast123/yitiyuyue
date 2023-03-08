// pages/login/login.js
const { $Toast } = require('../../dist/base/index');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',         //账号
    pwd: '',             //密码
    pwdCertain: '',     //确认密码
    pwdType: 'password', //显示密码输入框
    isShow: false,  //明文、暗文密码切换
    iconColor: 'DCDCDC',
    list: [{             //账号提示规则
      icon: 'warning',
      errorInfo: '长度需为6-24个字符',
      color: '#A7C6F7'
    }, {
      icon: 'warning',
      errorInfo: '不能包含中文',
      color: '#A7C6F7'
    }, {
      icon: 'warning',
      errorInfo: "不能包含除'_'、'@'、'.'之外的特殊符号",
      color: '#A7C6F7'
    }],
    listPwd: [{        //密码提示规则
      icon: 'warning',
      errorInfo: '长度需为6-32个字符',
      color: '#A7C6F7'
    }, {
      icon: 'warning',
      errorInfo: '至少包含一个大写字母、小写字母和数字',
      color: '#A7C6F7'
    }],
    userShow: 'none',         //用户账号输入规则提示
    pwdShow: 'none',          //用户密码输入规则提示
    certainShow: false,       //输入框确认密码是否显示
    checkAccountUrl: {            //请求后台查看用户是否存在接口
      url: '/dms/user/checkAccount'    //账号是否存在
    },
    checkAccountparams: {},            //请求后台用户是否存在传送参数
    binduUserParams: {},               //请求后台绑定用户传送的参数
  },

  //账号输入数值
  userInput: function (e) {
    var user = e.detail.value;

    this.setData({
      userName: user,
    })

    if (!user) {
      this.setData({
        'list[0].icon': 'warning',
        'list[0].color': '#A7C6F7',
        'list[1].icon': 'warning',
        'list[1].color': '#A7C6F7',
        'list[2].icon': 'warning',
        'list[2].color': '#A7C6F7',
      })
      return;
    }

    //判断中文
    if (!(/[\u4e00-\u9fa5]/.test(user))) {
      //更改图标跟颜色
      this.setData({
        'list[1].icon': 'checked',
        'list[1].color': '#46E670'
      })
    } else {
      this.setData({
        'list[1].icon': 'clear',
        'list[1].color': 'red'
      })
    }

    //判断长度
    if ((/[0-9a-zA-Z\u4e00-\u9fa5@_.]{6,24}/.test(user))) {
      //更改图标跟颜色
      this.setData({
        'list[0].icon': 'checked',
        'list[0].color': '#46E670'
      })
    } else {
      this.setData({
        'list[0].icon': 'clear',
        'list[0].color': 'red'
      })
    }

    //判断特殊字符
    if (!(/[`~!#$%^&*()\-+=<>?:"{}|,\/;'\\[\]·~！#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im.test(user))) {
      //更改图标跟颜色
      this.setData({
        'list[2].icon': 'checked',
        'list[2].color': '#46E670'
      })
    } else {
      this.setData({
        'list[2].icon': 'clear',
        'list[2].color': 'red'
      })
    }

    console.log(user);
  },
  //用户聚焦
  userFocus: function (e) {
    this.setData({
      userShow: 'block'
    })
  },

  //密码输入数值
  pwdInput: function (e) {
    var user = e.detail.value;

    if (!user) {
      this.setData({
        'listPwd[0].icon': 'warning',
        'listPwd[0].color': '#A7C6F7',
        'listPwd[1].icon': 'warning',
        'listPwd[1].color': '#A7C6F7'
      })
      return;
    }

    this.setData({
      pwd: e.detail.value
    })

    //判断长度
    if ((/[0-9a-zA-Z\u4e00-\u9fa5@_.]{6,32}/.test(user))) {
      //更改图标跟颜色
      this.setData({
        'listPwd[0].icon': 'checked',
        'listPwd[0].color': '#46E670'
      })
    } else {
      this.setData({
        'listPwd[0].icon': 'clear',
        'listPwd[0].color': 'red'
      })
    }

    //至少包含一个大小写字母和数字
    if ((/^(?:(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])).*$/.test(user))) {
      //更改图标跟颜色
      this.setData({
        'listPwd[1].icon': 'checked',
        'listPwd[1].color': '#46E670'
      })
    } else {
      this.setData({
        'listPwd[1].icon': 'clear',
        'listPwd[1].color': 'red'
      })
    }

    console.log(e.detail.value)
  },
  //密码聚焦
  pwdFocus: function (e) {
    this.setData({
      pwdShow: 'block'
    })
  },
  //密码取消聚焦
  pwdBlur: function (e) {
    this.setData({
      pwdShow: 'none'
    })
    //确认密码没有显示时，确认密码跟密码赋相同值
    if (!this.data.certainShow) {
      this.setData({
        pwdCertain: this.data.pwd
      })
    }
  },

  //确认密码输入数值
  pwdCertainInput: function (e) {
    this.setData({
      pwdCertain: e.detail.value
    })
    console.log(e.detail.value)
  },

  //明文、暗文切换密码
  //点击小眼睛图标
  showPwd() {
    if (!this.data.isShow) {
      this.setData({
        isShow: !this.data.isShow,
        pwdType: 'text',
        iconColor: '5996FF'
      })
    } else {
      this.setData({
        isShow: !this.data.isShow,
        pwdType: 'password',
        iconColor: 'DCDCDC'
      })
    }
  },

  //用户登录
  bindUser: function (e) {
    wx.login().then(codeObj => {
      var userName = this.data.userName;
      var pwd = this.data.pwd;


      if (userName != '' && pwd != '') {
        wx.showLoading({
          title: '正在登录',
        })

        let params = {
          name: this.data.userName,
          stu_number: this.data.pwd,
          code: codeObj.code
        }
        //登录用户
        let url = '/booking/login';
        app.wxRequest('POST', url, params,
          (res) => {
            if (res.resultCode == "200") {
              wx.hideLoading()
              $Toast({
                content: "登录成功",
                type: 'success'
              });
              wx.setStorageSync('userId', this.data.pwd)
              wx.setStorageSync('userName', this.data.userName)
              wx.reLaunch({
                url: '../index/index',
              })
            } else if (res.resultCode == "601") {
              wx.hideLoading()
              $Toast({
                content: res.resultMsg,
                type: 'warning'
              })
            } else {
              wx.hideLoading()
              $Toast({
                content: "登录失败",
                type: 'error'
              })
            }
            console.log(res)
          },
          (err) => {
            wx.hideLoading()
            $Toast({
              content: "登录失败",
              type: 'error'
            });
            console.log(err)
          }
        );
      }
      else {
        $Toast({
          content: '姓名学号不能为空！',
          type: 'warning'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('userId'))
    if (wx.getStorageSync('userId') && wx.getStorageSync('userName')) {
      wx.switchTab({
        url: '../index/index'
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
    wx.hideHomeButton()
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