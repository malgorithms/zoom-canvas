{vec}  = require './vec'
{rect} = require './rect'

class zoomCanvas

  constructor: (options) ->
    ###
      options:
        canvas_width:  width of the canvas targeted
        canvas_height: height of the canvas targeted
        fill:          fraction of canvas to keep filled; 0.8 means 20% margins
        spring_k:      spring constant for zoom snapping
        spring_damp:   spring dampeining for zoom snapping
    ###
    options       |= {}
    @cw           = options.canvas_width  or null
    @ch           = options.canvas_height or null
    @fill         = options.fill          or 1.0
    @spring_k     = if options.spring_k? then options.spring_k else 1.0
    @spring_damp  = if options.spring_damp? then options.spring_damp else 1.0
    @drawScale    = null
    @bounds       =
      target: new @rect()
      actual: new @rect()
      vel:
        ll: new @vec 0,0
        ur: new @vec 0,0

  setObjectBounds: ->

  calcObjectBounds: ->


  instantZoom: ->
    # skips spring step
    @bounds.vel.ll.zero()
    @bounds.vel.ur.zero()
    @bounds.actual = @bounds.target.copy()

exports.zoomCanvas = zoomCanvas
