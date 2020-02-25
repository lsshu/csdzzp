const req = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    barActive: "clan"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息 
    wx.getSetting({
      success: res => {
        //如果失败跳到授权
        if (!res.authSetting['scope.userInfo']) {
          wx.redirectTo({
            url: '/pages/auth/auth'
          })
        }
      }
    });
    
    let clans_id = options.clans_id;
    req.post('/getClan/' + clans_id).then((result) => {
      if (result.statusCode == 200) {
        this.setData({ info: result.data.data.info, family: result.data.data.family });
      }
    });
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