{vec}     = require './vec'
{rect}    = require './rect'
{affine}  = require 'affine'

class zoomCanvas

  constructor: (options) ->
    ###
      options:
        fill:          fraction of canvas to keep filled; 0.8 means 20% margins
        spring_k:      spring constant for zoom snapping
        spring_damp:   spring dampeining for zoom snapping
        ---
        canvas:        an actual html5 canvas to follow, so width, height updated automatically
          - or -
        canvas_width:  width of the "canvas" targeted (say it's not html5 canvas but something else)
        canvas_height: height of the "canvas" targeted
    ###
    options        = options or {}
    if not (options.canvas) and not (options.canvas_width and options.canvas_height)
      throw new Error "zoomCanvas expects either a canvas or a canvas_width, canvas_height"
    @canvas        = options.canvas        or null
    @width         = options.canvas_width  or @canvas.width
    @height        = options.canvas_height or @canvas.height
    @fill          = options.fill          or 1.0
    @spring_k      = if options.spring_k? then options.spring_k else 1.0
    @spring_damp   = if options.spring_damp? then options.spring_damp else 1.0
    @drawScale     = null
    @affine        = new affine.affine2d()
    @lastStep      = null
    @bounds        =
      target: new rect()
      actual: new rect()
      vel:
        ll: new vec 0,0
        ur: new vec 0,0

  setObjectBounds: (xmin, ymin, xmax, ymax) ->
    @bounds.target.ll.x = xmin
    @bounds.target.ll.y = ymin
    @bounds.target.ur.x = xmax
    @bounds.target.ur.y = ymax

  step: ->

    @lastStep = @lastStep or Date.now()
    [dt, @lastStep] = [(Date.now() - @lastStep)/1000, Date.now()]

    tar = @bounds.target
    act = @bounds.actual
    fx0 = (tar.ll.x - act.ll.x) * @spring_k - @bounds.vel.ll.x * @spring_damp
    fy0 = (tar.ll.y - act.ll.y) * @spring_k - @bounds.vel.ll.y * @spring_damp
    fx1 = (tar.ur.x - act.ur.x) * @spring_k - @bounds.vel.ur.x * @spring_damp
    fy1 = (tar.ur.y - act.ur.y) * @spring_k - @bounds.vel.ur.y * @spring_damp

    @bounds.vel.ll.x += fx0 * dt
    @bounds.vel.ll.y += fy0 * dt
    @bounds.vel.ur.x += fx1 * dt
    @bounds.vel.ur.y += fy1 * dt

    act.ll.x += @bounds.vel.ll.x * dt
    act.ll.y += @bounds.vel.ll.y * dt
    act.ur.x += @bounds.vel.ur.x * dt
    act.ur.y += @bounds.vel.ur.y * dt

    if @canvas
      @width  = @canvas.width
      @height = @canvas.height

    unit_w  = act.ur.x - act.ll.x
    unit_h  = act.ur.y - act.ll.y
    x_scale = @width  / unit_w
    y_scale = @height / unit_h
    @drawScale = @fill * Math.min x_scale, y_scale

    @_updateAffine()

  instantZoom: ->
    # skips spring step
    @bounds.vel.ll.zero()
    @bounds.vel.ur.zero()
    @bounds.actual = @bounds.target.copy()

  _updateAffine: ->
    @affine = new affine.affine2d()
    @affine.translate @width/2, @height/2
    @affine.scale     @drawScale, -@drawScale
    ctrx = (@bounds.actual.ll.x + @bounds.actual.ur.x) / 2
    ctry = (@bounds.actual.ll.y + @bounds.actual.ur.y) / 2
    @affine.translate -ctrx, -ctry


exports.zoomCanvas = zoomCanvas
