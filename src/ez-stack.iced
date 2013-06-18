{ezCanvas, draw_code} = require './ez-canvas'
{rect}                = require './rect'

class ezStack

  constructor: (options) ->
    ###
      same as ezCanvas except takes
      an array "layers" instead of canvas, which has:
      {
        canvas:  the html5 canvas
        clippable: (default = false); if true, 
            its boundaries will not be used to determine drawing/repainting, and some items may be clipped
      }

      canvases[0] = the bottom layer, and the bottom layer

    ###
    @ezs          = []  # the ezcanvases
    @bounds       = []  # of queued items in layer
    @total_bounds = null
    @layers       = []
    for l in options.layers
      @layers.push {
        needs_paint:  false
        clippable:    if l.clippable? then l.clippable else false
        canvas:       l.canvas
      }
      ez_opts = {canvas: l.canvas}
      ez_opts[k] = v for k, v of options when k isnt 'layers'
      @ezs.push new ezCanvas ez_opts

  line:   (o) -> 
    @ezs[o.layer].line   o
    @layers[o.layer].needs_paint = true
    @adjust_bounds o, draw_code.LINE

  lines:  (o) -> 
    @ezs[o.layer].lines  o
    @layers[o.layer].needs_paint = true
    @adjust_bounds o, draw_code.LINES

  circle: (o) -> 
    @ezs[o.layer].circle o
    @layers[o.layer].needs_paint = true
    @adjust_bounds o, draw_code.CIRCLE

  adjust_bounds: (o, dc) ->
    if (not o.clippable) and not (@layers[o.layer].clippable)
      b = ezCanvas.get_queued_item_bounds dc, o
      if not @bounds[o.layer]?
        @bounds[o.layer] = b.copy()
        @recalc_bounds()
      else
        if @bounds[o.layer].contain_rect b
          @recalc_bounds()
        else
          # we don't need to recalc bounds since they haven't expanded

  clear_layer: (layer_num) ->
    @ezs[layer_num].clear()
    @bounds[layer_num] = null
    @layers[layer_num].needs_paint = true
    @recalc_bounds()

  clear_all: ->
    @clear_layer i for layer, i in @layers

  paint: ->
    for layer, i in @layers when layer.needs_paint
      @ezs[i].clear_canvas()
      @ezs[i].paint {bounds: @total_bounds}
      layer.needs_paint = false

  recalc_bounds: ->
    bounds = rect.bounding_rects (b for b,i in @bounds when b? and not @layers[i].clippable)
    if (not @total_bounds?) or not (@total_bounds.is_same bounds)
      @total_bounds = bounds
      for l in @layers
        l.needs_paint = true
      return true
    return false

  world_pair_to_canvas_pair: (p) -> @ezs[0].world_pair_to_canvas_pair p
  canvas_pair_to_world_pair: (p) -> @ezs[0].canvas_pair_to_world_pair p

exports.ezStack = ezStack
