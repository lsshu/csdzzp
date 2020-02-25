const req = require('../../utils/request.js');
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
    store_status:"",
    model:{
      title:"提交成功！",
      content:"因为需要维护程序成本，这样才可以长远！希望亲友们的支持！"
      },
    chooses_pay:"",
    chooses_pay_item: [{
      value: 6,
      name: '6元',
      checked: false,
      hot: false,
    }, {
      value: 10,
      name: '10元',
      checked: false,
      hot: true,
    }, {
      value: 15,
      name: '15元',
      checked: false,
      hot: false,
    }, {
      value: 30,
      name: '30元',
      checked: false,
      hot: true,
    }, {
      value: 50,
      name: '50元',
      checked: false,
      hot: false,
    }, {
      value: 100,
      name: '100元',
      checked: false,
      hot: false,
    }],
    pay_count: 6,
    pay_model:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    //获取基础信息
    var base = wx.getStorageSync('base') || {}
    this.setData({ base: base.data });

    var auth_info = wx.getStorageSync('auth_info') || {}
    if (auth_info.data == undefined){
      wx.login({
        success(res) {
          if (res.code) {
            //发起网络请求
            req.post('/code2Session', { code: res.code }).then((result) => {
              wx.setStorageSync('auth_info', result.data)
              _this.setData({ openid: result.data.data.openid })
            });
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }else{
      this.setData({ openid: auth_info.data.openid})
    }

    // 检查信息是否已经填写过未支付成功
    req.post('/check_store_clan', { openid: auth_info.data.openid }).then((result) => {
      _this.setData({
        store_status: result.data.status,
        examine_clan_id: result.data.examine_clan_id,
        model: {
          title: "查找成功！",
          content: "你有一条审核信息还未有完成！上一次申请审核者为 " + result.data.examine_clan_name+"; 因为需要维护程序成本，这样才可以长远！希望亲友们的支持！"
        }
      })
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
  birthAtDateChange:function (e) {
    this.setData({
      birth_at: e.detail.value
    })
  },
  buriedAtDateChange: function (e) {
    this.setData({
      buried_at: e.detail.value
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
    var _this = this;
    var errors = [];
    var data = e.detail.value;

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
    if (data.code == this.phone_code){
      errors.push('手机验证码不正确！');
    }

    //处理数据
    data.sex = data.sex?1:0;
    data.is_marry = data.is_marry ? 1 : 0;
    data.is_buried = data.is_buried ? 1 : 0;
    data.openid = _this.data.openid;

    if(errors.length != 0){
      wx.showToast({
        title: errors.join(';'),
        icon: 'none',
        duration: 10000
      });
      return false;
    }else{
      req.post('/store_clan', data).then((result) => {
        _this.setData({
          store_status: result.data.status,
          examine_clan_id: result.data.examine_clan_id,
          model: {
            title: "提交成功！",
            content: "因为需要维护程序成本，这样才可以长远！希望亲友们的支持！"
          }
        })
      });
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
        wx.showToast({
          title: '搜索成功!请选择！',
          icon: 'success',
          duration: 2000
        })
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
  },
  hideModal(e) {
    this.setData({
      store_status: null
    })
  },
  deleteExamineClan(){
    var _this = this;
    var examine_clan_id = _this.data.examine_clan_id;
    var openid = _this.data.openid;
    req.post('/delete_examine_clan', { openid: openid, examine_clan_id: examine_clan_id}).then((result) => {
      _this.setData({
        store_status: null
      })


      wx.showToast({
        title: '放弃审核成功!',
        icon: 'success',
        duration: 2000
      })

    });
  },

  choosesPayItem(e) {
    let items = this.data.chooses_pay_item;
    let values = e.currentTarget.dataset.value;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value == values) {
        items[i].checked = true;
        // break
      }else{
        items[i].checked = false;
      }
    }
    this.setData({
      chooses_pay_item: items,
      pay_count: values
    })
  },
  closePayItem(e) {
    this.setData({
      store_status: "success",
      chooses_pay: null
    })
  },
  // 莫名的警告 所以添加了这个方法
  true(e){
    console.log(e);
  },
  openChoosesPayModal(e){
    this.setData({
      store_status: null,
      chooses_pay: "ChoosePay"
    })
  },
  hidePayModal(e){
    this.setData({
      pay_model: null
    });
    wx.reLaunch({
      url: '/pages/user/about/about',
    })
  },
  requestPay(e){
    var openid = this.data.openid;
    var examine_clan_id = this.data.examine_clan_id
    try {
      if (openid) {
        var total_fee = this.data.pay_count;
        req.post('/payment/recharge', { openid: openid, total_fee: total_fee, examine_clan_id: examine_clan_id }).then((result) => {
          var result = result.data.data;
          result.success = this.PaymentSuccess;
          result.fail = this.PaymentFail;
          wx.requestPayment(result);
        });
      }
    } catch (e) {

    }
  },
  PaymentSuccess(res) {
    this.setData({
      store_status: null,
      chooses_pay: null,
      pay_model:"success"
    })
  },
  PaymentFail(res) {
    console.log(res);
  }





})