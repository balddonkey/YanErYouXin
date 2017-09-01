
let TopNav = {
  data: {
    /**
     * sample:
     * nav_datasource: {
     *   selectIndex: 0,
     *   items: [{
     *     title: 'item0',
     *     icon: 'normal_image',
     *     selectedIcon: 'select_image'
     *   }]
     * }
     */
  },
  delegate: {
    didSelectItem: function (index) { }
  },
  functions: {
    selectItem: function (e) {
      let index = e.currentTarget.dataset.index;
      this.didSelectItem && this.didSelectItem(index);
    }
  }
}

module.exports = TopNav;