// Generated by CoffeeScript 1.6.3
(function() {
  var Application, img_quicky,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  img_quicky = function(path) {
    var oImg;
    oImg = document.createElement("img");
    oImg.setAttribute('src', 'http://pythonhackers.com/gitbeacon?_=1&#{path}');
    oImg.setAttribute('alt', 'na');
    oImg.setAttribute('height', '1px');
    oImg.setAttribute('width', '1px');
    return document.body.appendChild(oImg);
  };

  this.Watchdog = (function() {
    var constructor;

    function Watchdog() {
      this.track_click_quick = __bind(this.track_click_quick, this);
      this.track_links = __bind(this.track_links, this);
      this.track = __bind(this.track, this);
    }

    constructor = function(mx) {
      return this.mx = mx;
    };

    Watchdog.prototype.track = function(event, options) {
      if (options == null) {
        options = {};
      }
      console.log("Tracking " + event + " with " + options);
      return this.forward('track', event, options);
    };

    Watchdog.prototype.track_links = function(selector, event, options) {
      if (options == null) {
        options = {};
      }
      console.log("Tracking Links " + selector + " " + event + " " + options);
      return this.forward('track_links', selector, event, options);
    };

    Watchdog.prototype.track_click_quick = function() {
      return img_quicky("test=test");
    };

    Watchdog.prototype.forward = function(method) {
      var a, args, b, c, e, el, first, _i, _len;
      args = [];
      first = true;
      for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        el = arguments[_i];
        if (!first) {
          args.push(el);
        }
        if (first) {
          first = false;
        }
      }
      try {
        a = args.shift();
        b = args.shift();
        if (args.length >= 1) {
          c = args.shift();
        }
        debugger;
        if (args.length === 2) {
          return window.mixpanel[method](a, b);
        } else {
          return window.mixpanel[method](a, b, c);
        }
      } catch (_error) {
        e = _error;
        return console.log(e);
      }
    };

    return Watchdog;

  })();

  Application = (function() {
    function Application() {
      this.load = __bind(this.load, this);
      this.activityTrack = __bind(this.activityTrack, this);
      this;
    }

    Application.prototype.begin = function() {
      return $(this.load);
    };

    Application.prototype.activityTrack = function() {
      var _this = this;
      $("#mc_embed_signup").on("show.bs.modal", function() {
        return _this.dog.track("signup-popup");
      });
      $(document).on("click", ".navbar a", function(evt) {
        var href;
        href = $(evt.currentTarget).attr("href");
        if (href === "#mc_embed_signup") {
          return false;
        }
        _this.dog.track("navlink", {
          path: href.replace("#", ""),
          referrer: document.referrer
        });
        evt.stopPropagation();
        evt.preventDefault();
        window.setTimeout(function() {
          return document.location = href;
        }, 500);
        return false;
      });
      return _.defer(function() {
        return _this.dog.track("visit", {
          path: document.location.pathname
        });
      });
    };

    Application.prototype.load = function() {
      this.dog = window.mixpanel;
      this.formSubmitter();
      return this.activityTrack();
    };

    Application.prototype.captureSubmit = function($el) {
      var action, id, slug;
      action = $el.attr("action");
      if (!(action == null)) {
        action = action.replace("/ajax/", "");
      }
      id = $('[name="id"]', $el).val();
      slug = $('[name="slug"]', $el).val();
      return this.dog.track(action, {
        referrer: document.referrer,
        id: id,
        slug: slug
      });
    };

    Application.prototype.formSubmitter = function() {
      var _this = this;
      $('form[data-remote]').submit(function(evt) {
        var $this, action, postData;
        evt.preventDefault();
        evt.stopPropagation();
        _this.captureSubmit($(evt.currentTarget));
        if (!window.session.hasOwnProperty("id")) {
          document.location = '/authenticate';
          return;
        }
        $this = $(_this);
        action = $this.attr("action");
        postData = $this.serializeArray();
        return $.post(action, postData);
      });
      return $('[data-toggle="tooltip"]').tooltip();
    };

    return Application;

  })();

  window.PythonHackers = new Application();

  PythonHackers.begin();

}).call(this);
