const req = require('../../utils/request.js');
const app = getApp();
Page({
  data: {
    barActive: ""
  },
  onLoad: function (options) {
    let article_id = options.article_id;
    req.post('/article/' + article_id).then(({data}) => {
      var article = data.data;
      article.content = article.content.replace(/\<img(.*?)style/gi, '<img$1styleb ');
      article.content = article.content.replace(/\<img/gi, '<img style="width:100%;height:auto" ');
      this.setData({ article: article});
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});