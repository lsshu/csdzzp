const req = require('../../utils/request.js');
const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
  },
  onLoad:function(){

    req.post('/getBase').then((result) => {
      wx.setStorageSync('base', result.data)
      this.setData({ base: result.data.data });
    });


  },
  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  }
});
