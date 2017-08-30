
let InfoColor = '#586C94';
let WarnColor = '#E44545';
let PrimaryColor = '#09BB07';

let TopTip = {
  data: {
    toptip_data: {
      title: null,
      type: 'Primary',
      types: {
        Info: InfoColor,
        Warning: WarnColor,
        Primary: PrimaryColor
      }
    }
  },
  functions: {
    /**
     * data: [object]
     * {title: String, type: 'Warning | Info | Primary', timeout: seconds}
     */
    showToptip: function(data) {
      let t = this;
      let toptip_data = t.data.toptip_data;

      // 使已存在的timeout无效
      clearTimeout(toptip_data.timeout);

      let type = data.type || 'Primary';
      console.log("type:", type);
      toptip_data.type = type;
      toptip_data.title = data.title;
      toptip_data.timeout = setTimeout(() => {
        toptip_data.title = null;
        t.setData({
          toptip_data: toptip_data
        });
      }, (data.timeout && data.timeout * 1000) || 1.5 * 1000);
      t.setData({
        toptip_data: toptip_data
      });
    } 
  }
}

module.exports = TopTip;