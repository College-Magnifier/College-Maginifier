Vue.config.devtools = true;

var app = new Vue({
  el: '#app',
  data: {
    schoolRows: []
  },
  create: function() {
    this.getScores();
  },
  methods: {
    getScores: function(subject) {
      var _this = this;
      $.ajax({
        
      });
    }
  }
});
