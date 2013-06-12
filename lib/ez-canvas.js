// Generated by IcedCoffeeScript 1.6.2c
(function() {
  var ezCanvas, qtypes, rect, vec, zoomCanvas;



  zoomCanvas = require('./zoom-canvas').zoomCanvas;

  rect = require('./rect').rect;

  vec = require('./vec').vec;

  qtypes = {
    LINE: 10
  };

  ezCanvas = (function() {
    function ezCanvas(options) {
      /*
        options:
          fill:          fraction of canvas to keep filled; 0.8 means 20% margins
          spring_k:      spring constant for zoom snapping
          spring_damp:   spring dampening for zoom snapping
          step_dt_ms:    ms per step calculation
          canvas:        an actual html5 canvas to follow, so width, height updated automatically
      */

      this.zc = new zoomCanvas(options);
      this.bounds = null;
      this.canvas = options.canvas;
      this.queue = [];
      this.ctx = this.canvas.getContext("2d");
    }

    ezCanvas.prototype.line = function(o) {
      return this.queue.push([qtypes.LINE, o]);
    };

    ezCanvas.prototype.clear = function() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.bounds = null;
      return this.queue = [];
    };

    ezCanvas.prototype.paint = function() {
      var q, _i, _len, _ref;
      this.recalc_bounds();
      this.zc.setObjectBounds(this.bounds.ll.x, this.bounds.ll.y, this.bounds.ur.x, this.bounds.ur.y);
      this.zc.step(Date.now());
      _ref = this.queue;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        q = _ref[_i];
        this.paint_queued_item(q);
      }
      return this.queue = [];
    };

    ezCanvas.prototype.paint_queued_item = function(q_item) {
      var o, qt;
      qt = q_item[0];
      o = q_item[1];
      switch (qt) {
        case qtypes.LINE:
          return this.paint_queued_line(o);
        default:
          throw new Error("Dunno how to draw " + qt);
      }
    };

    ezCanvas.prototype.paint_queued_line = function(o) {
      this.ctx.beginPath();
      this.ctx.save();
      this.zc.applyToCtx(this.ctx);
      if (o.thickness != null) {
        this.ctx.lineWidth = o.thickness;
      }
      this.ctx.moveTo(o.start[0], o.start[1]);
      this.ctx.lineTo(o.end[0], o.end[1]);
      this.ctx.stroke();
      return this.ctx.restore();
    };

    ezCanvas.prototype.recalc_bounds = function() {
      var q, rects;
      rects = (function() {
        var _i, _len, _ref, _results;
        _ref = this.queue;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          q = _ref[_i];
          _results.push(this.get_q_bounds(q));
        }
        return _results;
      }).call(this);
      if (this.bounds != null) {
        rects.push(this.bounds);
      }
      return this.bounds = rect.bounding_rects(rects);
    };

    ezCanvas.prototype.get_q_bounds = function(q_item) {
      var o, qt;
      qt = q_item[0];
      o = q_item[1];
      switch (qt) {
        case qtypes.LINE:
          return rect.bounding_vecs([new vec(o.start[0], o.start[1]), new vec(o.end[0], o.end[1])]);
        default:
          throw new Error("Unknown q type: " + qt);
      }
    };

    return ezCanvas;

  })();

  exports.ezCanvas = ezCanvas;

}).call(this);