const req = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    barActive: "index",
    cardCur: 0,
    DotStyle: true,
    text: '',
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
            url: '/pages/home/auth/auth'
          })
        }
      }
    });
    //获取基础信息
    var base = wx.getStorageSync('base') || {}
    this.setData({ base: base.data });

    //获取文章列表
    var index_articles = wx.getStorageSync('index_articles') || {};
    if (undefined == index_articles.timestamp || index_articles.timestamp < Date.now() - 1000 * 60 * 10) {
      req.post('/articles').then((result) => {
        wx.setStorageSync('index_articles', result.data)
        this.setData({ articles: result.data.data });
      });
    } else {
      this.setData({ articles: index_articles.data });
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