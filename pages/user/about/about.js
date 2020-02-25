Page({
  data: {
    barActive: "user"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取基础信息
    var base = wx.getStorageSync('base') || { data: "" }
    if (base.data) {
      this.setData({ base: base.data });
    } else {
      req.post('/getBase').then((result) => {
        wx.setStorageSync('base', result.data)
        this.setData({ base: result.data.data });
      });
    }
  },
})