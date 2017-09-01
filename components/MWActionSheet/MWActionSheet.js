
let config = {
  data: {
    actionsheet_data: {
      show: true
    }
  },

  functions: {
    showMWActionSheet: function(config) {
      if (!config.itemList || !config.itemList.length) {
        return;
      }
      let data = this.data.actionsheet_data;
      data.itemList = config.itemList;
      data.title = config.title;
      data.didSelectItem = config.didSelectItem;
      data.show = true;
      this.setData({
        actionsheet_data: data
      });
    }
  }

}

module.exports = config;