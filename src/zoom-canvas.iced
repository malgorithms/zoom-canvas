{vec}     = require './vec.iced'
{rect}    = require './rect.iced'
{affine}  = require 'affine'

class zoomCanvas

  constructor: (options) ->
    ###
      options:
        fill:          fraction of canvas to keep filled; 0.8 means 20% margins
        spring_k:      spring constant for zoom snapping
        spring_damp:   spring dampeining for zoom snapping
        step_dt_ms:    ms per step calculation
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
    @step_dt       = if options.step_dt_ms? then (options.step_dt_ms/1000) else 0.01
    @fill          = options.fill          or 1.0
    @spring_k      = if options.spring_k? then options.spring_k else 1.0
    @spring_damp   = if options.spring_damp? then options.spring_damp else 1.0
    @drawScale     = null
    @affine        = new affine.affine2d()
    @inv_affine    = new affine.affine2d()
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

  getPosRotScale: -> @affine.toPosRotScale()
  getPosRotScaleInv: -> @inv_affine.toPosRotScale()

  setCtxTransform: (ctx) ->
    ###
    given the context of an html5 canvas,
    this applies the affine to it, so you can
    start drawing shapes in word coordinates
    ###
    @affine.setCtxTransform ctx

  applyToCtx: (ctx) ->
    @affine.applyToCtx ctx

  step: (gametime_ms) ->
    ###
    pass it your game time, in milliseconds; 
    so that it is smooth jumping, even when a game pauses.
    if you don't care about that or your game is unpausable,
    pass it Date.now()
    ###

    t             = gametime_ms / 1000
    @lastStep     = @lastStep or t
    safety_check  = Date.now()
    count         = 0
    done          = false
    while not done
      count++
      dt         = @step_dt
      if @lastStep < t
        @lastStep += dt
      else
        done = true

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
      if (Date.now() - safety_check) > 10 # never let this take more than 10ms
        console.log "Bypassing smoothness for speed reasons after #{count} steps"
        @instantZoom()
        break

    @_updateAffine()

  worldPairToCanvasPair: (p) ->
    @affine.transformPair p[0], p[1]

  canvasPairToWorldPair: (p) ->
    @inv_affine.transformPair p[0], p[1]

  instantZoom: ->
    # skips spring step
    @bounds.vel.ll.zero()
    @bounds.vel.ur.zero()
    @bounds.actual = @bounds.target.copy()
    @lastStep = null
    @_updateAffine()

  _updateAffine: ->

    ctrx = (@bounds.actual.ll.x + @bounds.actual.ur.x) / 2
    ctry = (@bounds.actual.ll.y + @bounds.actual.ur.y) / 2

    # affine
    @affine = new affine.affine2d()
    @affine.translate @width/2, @height/2
    @affine.scale     @drawScale, -@drawScale
    @affine.translate -ctrx, -ctry

    # inverse
    @inv_affine = new affine.affine2d()
    @inv_affine.translate ctrx, ctry
    @inv_affine.scale (1 / @drawScale), -(1 / @drawScale)
    @inv_affine.translate -@width/2, -@height/2


exports.zoomCanvas = zoomCanvas
