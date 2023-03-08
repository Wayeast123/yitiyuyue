// app.js
App({
  onLaunch(options) {
    //新版本自动更新小程序
    this.autoUpdate()
    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
  },
  autoUpdate:function(){
    console.log(new Date())
    var self=this
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //2. 小程序有新版本，则静默下载新版本，做好更新准备
          updateManager.onUpdateReady(function () {
            console.log(new Date())
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  //3. 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                  if(!wx.getStorageSync('userName') || !wx.getStorageSync('userId')){
                    wx.clearStorageSync()
                    wx.redirectTo({
                      url: 'pages/login/login',
                    })
                  }          
                } else if (res.cancel) {
                  //如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                  wx.showModal({
                    title: '温馨提示~',
                    content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                    success: function (res) {     
                      self.autoUpdate()
                      return;                 
                      //第二次提示后，强制更新                      
                      if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                      } else if (res.cancel) {
                        //重新回到版本更新提示
                        self.autoUpdate()
                      }
                    }
                  })
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  globalData: {
    userInfo: null,
    URL: 'https://www.jmiesp.com',
  },
  //接口请求封装
  wxRequest(method, url, data, callback, errFun) {
    wx.request({
      url: this.globalData.URL+url,
      method: method,
      data: data,
      // header: {
      //   "content-type": "application/json"
      // },
      // header: {
      //   'content-type': method == 'GET' ? 'application/json':'application/x-www-form-urlencoded',
      //   'Accept': 'application/json'
      // },
      // dataType: 'json',
      success: function (res) {
        callback(res.data);
      },
      fail: function (err) {
        errFun(err);
      }
    })
  }
  // autoUpdate: function() {
  //   let _this = this
  //   // 获取小程序更新机制的兼容，由于更新的功能基础库要1.9.90以上版本才支持，所以此处要做低版本的兼容处理
  //   if (wx.canIUse('getUpdateManager')) {
  //     // wx.getUpdateManager接口，可以获知是否有新版本的小程序、新版本是否下载好以及应用新版本的能力，会返回一个UpdateManager实例
  //     const updateManager = wx.getUpdateManager()
  //     // 检查小程序是否有新版本发布，onCheckForUpdate：当小程序向后台请求完新版本信息，会通知这个版本告知检查结果
  //     updateManager.onCheckForUpdate(function(res) {
  //       // 请求完新版本信息的回调
  //       if (res.hasUpdate) {
  //         // 检测到新版本，需要更新，给出提示
  //         wx.showModal({
  //           title: '更新提示',
  //           content: '检测到新版本，是否下载新版本并重启小程序',
  //           success: function(res) {
  //             if (res.confirm) {
  //               // 用户确定更新小程序，小程序下载和更新静默进行
  //               _this.downLoadAndUpdate(updateManager)
  //             } else if (res.cancel) {
  //               // 若用户点击了取消按钮，二次弹窗，强制更新，如果用户选择取消后不需要进行任何操作，则以下内容可忽略
  //               wx.showModal({
  //                 title: '提示',
  //                 content:
  //                   '本次版本更新涉及到新功能的添加，旧版本将无法正常使用',
  //                 showCancel: false, // 隐藏取消按钮
  //                 confirmText: '确认更新', // 只保留更新按钮
  //                 success: function(res) {
  //                   if (res.confirm) {
  //                     // 下载新版本，重启应用
  //                     _this.downLoadAndUpdate(updateManager)
  //                   }
  //                 }
  //               })
  //             }
  //           }
  //         })
  //       }
  //     })
  //   } else {
  //     // 在最新版本客户端上体验小程序
  //     wx.showModal({
  //       title: '提示',
  //       content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试'
  //     })
  //   }
  // },
  // // 下载小程序最新版本并重启
  // downLoadAndUpdate: function(updateManager) {
  //   wx.showLoading()
  //   // 静默下载更新小程序新版本，onUpdateReady：当新版本下载完成回调
  //   updateManager.onUpdateReady(function() {
  //     wx.hideLoading()
  //     // applyUpdate：强制当前小程序应用上新版本并重启
  //     updateManager.applyUpdate()
  //   })
  //   // onUpdateFailed：当新版本下载失败回调
  //   updateManager.onUpdateFailed(function() {
  //     // 下载新版本失败
  //     wx.showModal({
  //       title: '已有新版本',
  //       content: '新版本已经上线了，请删除当前小程序，重新搜索打开'
  //     })
  //   })
  // }
})
