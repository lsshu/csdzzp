const req = require('../../../utils/request.js');
const app = getApp();
Page({
  data: {
    barActive: "clan",
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    options: [
      {
        text: '族系',
        type: 'radio',
        model: 'series_id',
        options: []
      },
      {
        text: '村庄',
        type: 'radio',
        model: 'village_id',
        options: []
      }
    ],
    map_clans:{},
    title:'信息列表'

  },
  onLoad() {
    //获取基础信息
    var base = wx.getStorageSync('base') || {}
    this.setData({ base: base.data });
    //获取条件系
    req.post('/getClansSeries').then((result) => {
      this.setData({ 'options[0].options': result.data.data });
    });
    //获取用户信息
    req.post('/getClans').then((result) => {
      this.setData({ data: result.data.data});
    });

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var url = this.data.data.next_page_url;
    if (url != null){
      this.setData({
        isLoad: true
      })
      req.request(url).then((result) => {
        var this_data = this.data.data.data
        var new_data = result.data.data.data;
        result.data.data.data = this_data.concat(new_data);
        this.setData({ data: result.data.data, loadModal: false, isLoad: false});
      });
    }else{
      this.setData({
        isLoad: false
      });
      wx.showToast({
        title: '已经未有数据了！',
        icon: 'none',
        duration: 2000
      })
    }
    
  },
  

  toClanUser(e) {
    let clans_id = e.currentTarget.dataset.clans_id;
    wx.navigateTo({
      url: 'show?clans_id=' + clans_id
    })
  },

  handleChange(e) {
    var project = e.detail;
    if (project.item){
      this.setData({ 
        [('map_clans.' + project.model)]: project.item.id ,
      });

      if (project.model == 'series_id'){
        //取消先前设置的true
        var servies_options = this.data.options[0].options;
        for (var i = 0; i < servies_options.length;i++){
          this.setData({
            [("options[0].options[" + i + "].checked")]: false
          });
        }
        delete this.data.map_clans.village_id;
        //获取条件村
        req.post('/getClansVillages', this.data.map_clans).then((result) => {
          this.setData({ 
            'options[1].options': result.data.data ,
            [("options[0].options[" + project.key + "].checked")]: true
          });
        });
      }
      //获取用户信息
      req.post('/getClans', this.data.map_clans).then((result) => {
        this.setData({ data: result.data.data });
      });
    }
  },

  searchInput(e) {
    this.setData({ search: e.detail.value });
  },
  searchData(e) {
    let search = this.data.search;
    if (search == undefined || search == ''){
      wx.showToast({
        title: '搜索内容不能为空！',
        icon: 'none',
        duration: 2000
      })
    }else{
      req.post('/searchClans', { query: search}).then((result) => {
        this.setData({ search_title: '搜索 ' + search,search_data: result.data.data, SearchModal: true});
      });
      this.setData({  });
    }
    
  },
  hideSearchModal(e) {
    this.setData({ SearchModal: false });
  },
});