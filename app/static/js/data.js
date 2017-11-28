Vue.config.devtools = true;

var PAGE_LIMIT = 20;

var app = new Vue({
  el: '#app',
  data: {
    schoolRows: [],
    curSchoolRows: [],
    curPage: 1,
  },
  created: function() {
    this.getScores();
  },
  methods: {
    getScores: function(subject) {
      var _this = this;
      var dataObj = {};
      $.ajax({
        method: 'GET',
        url: '/data/scores',
        data: dataObj,
        success: function(resp) {
          _this.schoolRows = JSON.parse(resp);
          _this.curSchoolRows = [];
          _this.curPage = 1;
          for (var i = 0; i < PAGE_LIMIT; i++) {
            _this.curSchoolRows.push(_this.schoolRows[i]);
          }
        }
      });
    },
    changePage: function(pageNum) {
      this.curPage = pageNum;
    }
  },
  watch: {
    curPage: function(newVal) {
      this.curSchoolRows = [];
      for (var i = 0; i < PAGE_LIMIT; i++) {
        this.curSchoolRows.push(this.schoolRows[i + (newVal - 1) * PAGE_LIMIT]);
      }
    }
  }
});
