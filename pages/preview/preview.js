// preview.js

let fetcher = require('../../utils/Fetcher.js');
let xincell = require('../../components/xincell/xincell.js');
let TopTip = require('../../components/TopTip/TopTip.js');

let util = require('../../utils/util.js');

let PreviewInitial = {

  /**
   * 页面的初始数据
   */
  data: {
    item: {
      id: 0,
      text: "日狗少年史大彪",
      location: "高高的骨灰旁边"
    }
  },

  // 发送
  onSend: function () {
    let postcard = this.data.postcard;
    let params = {
      postcardId: postcard.id,
      receiverPhone: postcard.recevierPhone,
      address: postcard.address,
      longitudeLatitude: postcard.longitude && postcard.latitude ? postcard.longitude + ',' + postcard.latitude : null
    };
    fetcher.create(params, (res) => {
      if (res.success) {
        wx.reLaunch({
          url: '../my/my?type=0',
        });
      } else {
        console.log('创建失败:', res.msg);
        this.showToptip({
          title: '创建失败: ' + res.msg,
          type: 'Warning'
        });
      }
    })
  },

  // 返回编辑
  onEdit: function () {
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let postcard = JSON.parse(options.postcard);
    postcard.createTime = util.formatTime(new Date());
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
}

Object.assign(PreviewInitial, xincell.functions);
Object.assign(PreviewInitial.data, xincell.data);

Object.assign(PreviewInitial, TopTip.functions);
Object.assign(PreviewInitial.data, TopTip.data);

Page(PreviewInitial);