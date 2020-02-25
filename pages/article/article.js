const req = require('../../utils/request.js');
const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    ColorList: app.globalData.ColorList,
    barActive: ""
  },
  onLoad: function (options) {
    let encryptid = options.encryptid;
    req.post('/article/' + encryptid).then((result) => {
      this.setData({ article: result.data });
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});
