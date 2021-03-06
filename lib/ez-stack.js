// Generated by IcedCoffeeScript 1.6.2c
(function() {
  var draw_code, ezCanvas, ezStack, rect, _ref;



  _ref = require('./ez-canvas'), ezCanvas = _ref.ezCanvas, draw_code = _ref.draw_code;

  rect = require('./rect').rect;

  ezStack = (function() {
    function ezStack(options) {
      /*
        same as ezCanvas except takes
        an array "layers" instead of canvas, which has:
        {
          canvas:  the html5 canvas
          clippable: (default = false); if true, 
              its boundaries will not be used to determine drawing/repainting, and some items may be clipped
        }
      
        canvases[0] = the bottom layer, and the bottom layer
      */

      var ez_opts, k, l, v, _i, _len, _ref1;
      this.ezs = [];
      this.bounds = [];
      this.total_bounds = null;
      this.layers = [];
      _ref1 = options.layers;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        l = _ref1[_i];
        this.layers.push({
          needs_paint: false,
          clippable: l.clippable != null ? l.clippable : false,
          canvas: l.canvas
        });
        ez_opts = {
          canvas: l.canvas
        };
        for (k in options) {
          v = options[k];
          if (k !== 'layers') {
            ez_opts[k] = v;
          }
        }
        this.ezs.push(new ezCanvas(ez_opts));
      }
    }

    ezStack.prototype.line = function(o) {
      this.ezs[o.layer].line(o);
      this.layers[o.layer].needs_paint = true;
      return this.adjust_bounds(o, draw_code.LINE);
    };

    ezStack.prototype.lines = function(o) {
      this.ezs[o.layer].lines(o);
      this.layers[o.layer].needs_paint = true;
      return this.adjust_bounds(o, draw_code.LINES);
    };

    ezStack.prototype.circle = function(o) {
      this.ezs[o.layer].circle(o);
      this.layers[o.layer].needs_paint = true;
      return this.adjust_bounds(o, draw_code.CIRCLE);
    };

    ezStack.prototype.adjust_bounds = function(o, dc) {
      var b;
      if ((!o.clippable) && !this.layers[o.layer].clippable) {
        b = ezCanvas.get_queued_item_bounds(dc, o);
        if (this.bounds[o.layer] == null) {
          this.bounds[o.layer] = b.copy();
          return this.recalc_bounds();
        } else {
          if (this.bounds[o.layer].contain_rect(b)) {
            return this.recalc_bounds();
          } else {

          }
        }
      }
    };

    ezStack.prototype.clear_layer = function(layer_num) {
      this.ezs[layer_num].clear();
      this.bounds[layer_num] = null;
      this.layers[layer_num].needs_paint = true;
      return this.recalc_bounds();
    };

    ezStack.prototype.clear_all = function() {
      var i, layer, _i, _len, _ref1, _results;
      _ref1 = this.layers;
      _results = [];
      for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
        layer = _ref1[i];
        _results.push(this.clear_layer(i));
      }
      return _results;
    };

    ezStack.prototype.paint = function() {
      var i, layer, _i, _len, _ref1, _results;
      _ref1 = this.layers;
      _results = [];
      for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
        layer = _ref1[i];
        if (!layer.needs_paint) {
          continue;
        }
        this.ezs[i].clear_canvas();
        this.ezs[i].paint({
          bounds: this.total_bounds
        });
        _results.push(layer.needs_paint = false);
      }
      return _results;
    };

    ezStack.prototype.recalc_bounds = function() {
      var b, bounds, i, l, _i, _len, _ref1;
      bounds = rect.bounding_rects((function() {
        var _i, _len, _ref1, _results;
        _ref1 = this.bounds;
        _results = [];
        for (i = _i = 0, _len = _ref1.length; _i < _len; i = ++_i) {
          b = _ref1[i];
          if ((b != null) && !this.layers[i].clippable) {
            _results.push(b);
          }
        }
        return _results;
      }).call(this));
      if ((this.total_bounds == null) || !(this.total_bounds.is_same(bounds))) {
        this.total_bounds = bounds;
        _ref1 = this.layers;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          l = _ref1[_i];
          l.needs_paint = true;
        }
        return true;
      }
      return false;
    };

    ezStack.prototype.world_pair_to_canvas_pair = function(p) {
      return this.ezs[0].world_pair_to_canvas_pair(p);
    };

    ezStack.prototype.canvas_pair_to_world_pair = function(p) {
      return this.ezs[0].canvas_pair_to_world_pair(p);
    };

    return ezStack;

  })();

  exports.ezStack = ezStack;

}).call(this);
