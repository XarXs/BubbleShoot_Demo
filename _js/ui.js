var BubbleShoot = window.BubbleShoot || {};
BubbleShoot.ui = (function ($) {
  var ui = {
    BUBBLE_DIMS: 44,
    ROW_HEIGHT: 40,
    init: function () {
    },
    drawScore: function (score) {
      $("#score").text(score);
    },
    drawHighScore: function (highScore) {
      $("#high_score").text(highScore);
    },
    drawLevel: function (level) {
      $("#level").text(level + 1);
    },
    hideDialog: function () {
      $(".dialog").fadeOut(300);
    },
    getMouseCoords: function (e) {
      var coords = { x: e.pageX, y: e.pageY };
      return coords;
    },
    getBubbleCoords: function (bubble) {
      var bubbleCoords = bubble.position();
      bubbleCoords.left += ui.BUBBLE_DIMS / 2;
      bubbleCoords.top += ui.BUBBLE_DIMS / 2;
      return bubbleCoords;
    },
    getBubbleAngle: function (bubble, e) {
      var mouseCoords = ui.getMouseCoords(e);
      var bubbleCoords = ui.getBubbleCoords(bubble);
      var gameCoords = $("#game").position();
      var boardLeft = 120;
      var angle = Math.atan((mouseCoords.x - bubbleCoords.left - boardLeft)
        / (bubbleCoords.top + gameCoords.top - mouseCoords.y));
      if (mouseCoords.y > bubbleCoords.top + gameCoords.top) {
        angle += Math.PI;
      }
      return angle;
    },
    fireBubble: function (bubble, coords, duration) {
      bubble.setState(BubbleShoot.BubbleState.FIRING);
      var complete = function () {
        if (typeof (bubble.getRow()) != 'undefined') {
          bubble.getSprite().css(Modernizr.prefixed("transition"), "");
          bubble.getSprite().css({
            left: bubble.getCoords().left - ui.BUBBLE_DIMS / 2,
            top: bubble.getCoords().top - ui.BUBBLE_DIMS / 2
          });
          bubble.setState(BubbleShoot.BubbleState.ON_BOARD);
        } else {
          bubble.setState(BubbleShoot.BubbleState.FIRED);
        }
      };
      if (Modernizr.csstransitions && !BubbleShoot.Renderer) {
        bubble.getSprite().css(Modernizr.prefixed("transition"), "all " +
          (duration / 1000) + "s linear");
        bubble.getSprite().css({
          left: coords.x - ui.BUBBLE_DIMS / 2,
          top: coords.y - ui.BUBBLE_DIMS / 2
        });
        setTimeout(complete, duration);
      } else {
        bubble.getSprite().animate({
          left: coords.x - ui.BUBBLE_DIMS / 2,
          top: coords.y - ui.BUBBLE_DIMS / 2
        },
          {
            duration: duration,
            easing: "linear",
            complete: complete
          });
      }
    },
    drawBoard: function (board) {
      var rows = board.getRows();
      var gameArea = $("#board");
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        for (var j = 0; j < row.length; j++) {
          var bubble = row[j];
          if (bubble) {
            var sprite = bubble.getSprite();
            gameArea.append(sprite);
            var left = j * ui.BUBBLE_DIMS / 2;
            var top = i * ui.ROW_HEIGHT;
            sprite.css({
              left: left,
              top: top
            });
          };
        };
      };
    },
    drawBubblesRemaining: function (numBubbles) {
      $("#bubbles_remaining").text(numBubbles);
    },
    endGame: function (hasWon, score) {
      $("#game").unbind("click");
      BubbleShoot.ui.drawBubblesRemaining(0);
      if (hasWon) {
        $(".level_complete").show();
        $(".level_failed").hide();
      } else {
        $(".level_complete").hide();
        $(".level_failed").show();
      }
      $("#end_game").fadeIn(500);
      $("#final_score_value").text(score);
    }
  };
  return ui;
})(jQuery);