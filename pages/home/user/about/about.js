Page({
  data: {
    barActive: "user"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取基础信息
    var base = wx.getStorageSync('base') || {}
    this.setData({ base: base.data });
  },
})