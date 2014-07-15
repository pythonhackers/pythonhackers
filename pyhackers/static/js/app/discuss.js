// Generated by CoffeeScript 1.6.3
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Discuss = (function() {
    function Discuss(discussion_id) {
      this.discussion_id = discussion_id;
      this.discussDialog = __bind(this.discussDialog, this);
      this.hideShowTrick = __bind(this.hideShowTrick, this);
      this.reload = __bind(this.reload, this);
      this.init = __bind(this.init, this);
      this.lastMessage = null;
      this.template = window.Handlebars.compile($.trim($("#message-template").html()));
      console.log("Discussion started " + this.discussion_id);
    }

    Discuss.prototype.init = function() {
      if (this.discussion_id == null) {
        return;
      }
      $(document).on("ajax:success", "#discussion-message", this.onDiscussionMessage);
      $(document).on("ajax:error", "#discussion-message", this.onDiscussionMessageError);
      window.setInterval(this.reload, 30000);
      return this.reload();
    };

    Discuss.prototype.reload = function() {
      var _this = this;
      return $.getJSON("/ajax/discuss/" + this.discussion_id + "/messages", {
        _: new Date().getTime(),
        after_id: this.lastMessage || -1
      }, function(data) {
        var current_user_id;
        console.log(data);
        _this.lastMessage = data.discussion.last_message;
        current_user_id = PythonHackers.session ? PythonHackers.session.id : -1;
        _.each(data.posts, function(p) {
          p.can_delete = p.user.id === current_user_id;
          return p.display_context = false;
        });
        $(".posts").append(_this.template({
          message: data.posts
        }));
        return _this.hideShowTrick();
      });
    };

    Discuss.prototype.hideShowTrick = function() {
      return $("[data-message-id]").on("mouseenter", function() {
        return $(this).find(".panel-footer").removeClass("hidden");
      }).on("mouseleave", function() {
        return $(this).find(".panel-footer").addClass("hidden");
      });
    };

    Discuss.prototype.onDiscussionMessageError = function(event) {
      return Messenger().post({
        message: "Something went wrong! Try again",
        type: "error"
      });
    };

    Discuss.prototype.onDiscussionMessage = function(event, data) {
      var $form;
      if (!data.id) {
        Messenger().post({
          message: "Something went wrong! Try again",
          type: "error"
        });
        return;
      }
      $form = $(event.currentTarget);
      $form.find("textarea").val("");
      return Messenger().post({
        message: "Message has been sent!",
        type: "success"
      });
    };

    Discuss.prototype.discussDialog = function() {
      var $template, topics_html;
      $template = $($("#discuss-template").html());
      topics_html = [];
      _.each(topics, function(t) {
        return topics_html.push("<option value='" + t.slug + "'>" + t.name + "</option>");
      });
      debugger;
      $template.find('[name="topic"]').html(topics_html.join(" "));
      $(body).append($template);
      return $template.modal();
    };

    Discuss.prototype.discussionFollowAction = function() {};

    return Discuss;

  })();

  $(function() {
    var discus_id, discuss;
    discus_id = $("#discussion_id").val();
    discuss = new Discuss(discus_id);
    discuss.init();
    return $(document).on('click', '[href="#discuss-dialog"]', discuss.discussDialog);
  });

}).call(this);
