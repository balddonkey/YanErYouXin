// xincell.js

let XinCellConfig = {
  data: {
    xincell_init: function(e) {
      let item = e.target.dataset.item;
      
    }
  },
  functions: {
    // 
    tapVoice: function (e) {
      console.log('tap voice', e);
    }
  }
};

module.exports = XinCellConfig;