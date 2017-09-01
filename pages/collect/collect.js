// collect.js

let xincell = require('../../components/xincell/xincell.js');

let util = require('../../utils/util.js');
let fetcher = require('../../utils/Fetcher.js');

let CollectInitial = {

  /**
   * 页面的初始数据
   */
  data: {
    postcard: {
      id: 0,
      poster: {
        nickName: '日狗少年史三彪',
        avatarUrl: 'https://wx.qlogo.cn/mmopen/yicNtvz6vYypl5ZChssLr5WXzrLm9QfzKJaFVLpDcxvxyZlWWQ2PdiceAcffbjELOghyb0A1t2Bx2n5sOV4HicejEfpEGAtWPxI/0'
      },
      time: util.formatTime(new Date()),
      location: {
        name: "高高的骨灰旁边"
      }
    }
  },

  onCollect: function(e) {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let postcard = JSON.parse(options.postcard);
    if (!postcard) {
      console.log('错误的明信片信息');
      return;
    }
    console.log('collect pp:', options.postcard);
    this.setData({
      postcard: postcard
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
};


// 注入模板JS回调
Object.assign(CollectInitial, xincell.functions);
// 注入模板data
Object.assign(CollectInitial.data, xincell.data);

Page(CollectInitial);