const req = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    birth_at: '0000-00-00',
    buried_at: '0000-00-00',
    region: ['广东省', '揭阳市'],
    villages: [],
    parents:[],
    is_marry:false,
    is_buried:false,
    code_button_txt:'验证码',
    phone_code:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取基础信息
    var base = wx.getStorageSync('base') || {}
    this.setData({ base: base.data });
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

  },
  regionChange: function(e) {
    console.log(e.detail);
    var _this = this;
    var region_title = e.detail.value.map((n) => n).join('/');
    _this.setData({
      region: e.detail.value
    })
    req.post('/region_series', { region_title: region_title }).then((result) => {
      var result = result.data.data;
      _this.setData({ villages: result});
    });
  },
  DateChange:function (e) {
    this.setData({
      birth_at: e.detail.value
    })
  },
  changeVillage:function (e) {
    this.setData({
      village_index: e.detail.value
    })
  },
  tapVillage: function (e) {
    if(this.data.villages.length ==0 ){
      wx.showToast({
        title: '请选择地区!',
        icon: 'none',
        duration: 2000
      })
    }
  },
  changeParent: function (e){
    this.setData({
      parent_index: e.detail.value
    })
  },
  tapParent: function (e) {
    if(this.data.parents.length ==0 ){
      wx.showToast({
        title: '请填写搜索父亲进行选择!',
        icon: 'none',
        duration: 2000
      })
    }
  },
  formSubmit: function (e) {
    var errors = [];
    var data = e.detail.value;

    console.log(data)
    if(data.village_id == null){
      errors.push('请选择村庄信息!');
    }
    if(data.parent_id == null){
      errors.push('请选择你父亲信息!');
    }
    if(data.name == ''){
      errors.push('请填写你的姓名!');
    }
    if(data.birth_at == '0000-00-00'){
      errors.push('请选择你的生日日期!');
    }
    if(data.phone == ''){
      errors.push('请填写你的手机!');
    }
    if(data.code == '' || data.code!=this.data.phone_code ){
      errors.push('请填写正确的手机验证码!');
    }
    if(data.is_marry == true && data.wife == ''){
      errors.push('请填写你的妻子(丈夫)姓名!');
    }
    if(data.is_buried == true && data.buried_at == '0000-00-00'){
      errors.push('请选择他的离世日期');
    }

    if(errors.length != 0){
      wx.showToast({
        title: errors.join(';'),
        icon: 'none',
        duration: 10000
      })
    }else{

    }

  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  isMarry:function(e){
    this.setData({
      is_marry: e.detail.value
    })
  },
  isBuried: function (e){
    this.setData({
      is_buried: e.detail.value
    })
  },
  searchParent: function (e){
    var _this = this;
    var parent_name = _this.data.parent_name
    if(parent_name){
      req.post('/get_parent', { parent_name: parent_name }).then((result) => {
        var result = result.data.data;
        _this.setData({ parents: result});
      });
    }else{
      wx.showToast({
        title: '请输入父亲名字!',
        icon: 'none',
        duration: 2000
      })
    }
  },
  inputParent: function (e){
    this.setData({
      parent_name: e.detail.value
    })
  },
  inputPhone: function (e){
    this.setData({
      phone_number: e.detail.value
    })
  },
  tapGetCode: function (e){
    var _this = this;
    var phone_number = _this.data.phone_number

    if(phone_number && (/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone_number))){
      
      req.post('/send_phone_code', { phone_number: phone_number }).then((result) => {
        _this.setData({ phone_code: result.data.data});
        if(result.data.status){
          wx.showToast({
            title: result.data.txt,
            icon: result.data.status,
            duration: 2000
          })
        }
        if(result.data.status === 'success'){
          _this.setData({ code_button_disabled: true});
          var timer_num = 60;
          var timer_num_txt = '';
          var timeClock=setInterval(function(){
              timer_num--;
              timer_num_txt = timer_num + '秒';
              _this.setData({ code_button_txt: timer_num_txt});
            
              if (timer_num == 0) {
                  clearInterval(timeClock);
                  _this.setData({ code_button_txt: '验证码',code_button_disabled:false});
              } 
          },1000)
        }

      });
    }else{
      wx.showToast({
        title: '请输入正确的手机号码!',
        icon: 'none',
        duration: 2000
      })
    }
  }
})