$(function() {
  _.templateSettings = {
      interpolate: /\{\{\=(.+?)\}\}/g,
      evaluate: /\{\{(.+?)\}\}/g
  };

  var qrCode = new QRCode('qrCode');

  var Rippler = Backbone.Model.extend({
    lookup: function(name) {
      this.fetch({
        url: 'https://id.ripple.com/v1/authinfo?username='+name
      });
    }
  });

  var rippler = new Rippler();

  rippler.on('change:address', showRippler);

  var Router = Backbone.Router.extend({
    routes: {
      ":name": "nameLookup",
    },  
    nameLookup: function(name) {
      rippler.lookup(name);
    }
  });

  var router = new Router;

  var showNameTemplate = _.template($('#nameTemplate').html());

  function showRippler(rippler) {
    $('#centerContainer').html(showNameTemplate(rippler.toJSON()));
    qrCode.makeCode(rippler.get('address'));
  }

  function handleSubmit(event) {
    event.preventDefault();
    var name = $('input[type="search"]').val();
    router.navigate(name, { trigger: true });
  }

  $('form').on('submit', handleSubmit);
  $('button').on('click', handleSubmit);

  Backbone.history.start({ pushState: true });

  var websocket = new WebSocket('wss://s1.ripple.com');
  console.log(websocket);

  websocket.onmessage = function(message) {
    try {
      console.log(JSON.parse(message));
    } catch(error) {
      console.log(message, error);
    }
  }
  websocket.onopen = function() {
    websocket.send(JSON.stringify({
      "command": "subscribe",
      "accounts": ["r4EwBWxrx5HxYRyisfGzMto3AT8FZiYdWk"],
      "streams": [
        "server",
        "ledger"
      ]
    })); 
  }
});
