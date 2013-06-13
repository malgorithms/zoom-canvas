{zoomCanvas}      = require './zoom-canvas'
{rect}            = require './rect'
{vec}             = require './vec'


qtypes = 
  LINE:   10
  LINES:  11
  CIRCLE: 12

class ezCanvas

  constructor: (options) ->
    ###
      options:
        fill:          fraction of canvas to keep filled; 0.8 means 20% margins
        spring_k:      spring constant for zoom snapping
        spring_damp:   spring dampening for zoom snapping
        step_dt_ms:    ms per step calculation
        canvas:        an actual html5 canvas to follow, so width, height updated automatically
    ###
    @zc                 = new zoomCanvas options
    @bounds             = null # will be a rect
    @canvas             = options.canvas
    @queue              = []
    @ctx                = @canvas.getContext "2d"
    @is_affine_applied  = false

  line: (o)   -> @queue.push [qtypes.LINE, o]
  lines: (o)  -> @queue.push [qtypes.LINES, o]
  circle: (o) -> @queue.push [qtypes.CIRCLE, o]

  clear: ->
    @ctx.clearRect 0, 0, @canvas.width, @canvas.height
    @bounds = null
    @queue  = []

  paint: ->
    @recalc_bounds()
    @zc.setObjectBounds @bounds.ll.x, @bounds.ll.y, @bounds.ur.x, @bounds.ur.y
    @zc.step Date.now()
    @paint_queued_item q for q in @queue
    @queue = []

  # ----------- PRIVATE -------------------------------

  paint_queued_item: (q_item) ->
    qt = q_item[0]
    o  = q_item[1]
    switch qt
      when qtypes.LINE
        @paint_queued_line o
      when qtypes.LINE
        @paint_queued_lines o
      when qtypes.CIRCLE
        @paint_queued_circle o
      else throw new Error "Dunno how to draw #{qt}"

  set_ctx_from_cmd: (o) ->
    if o.lineWidth?   then  @ctx.lineWidth   = o.lineWidth
    if o.strokeStyle? then  @ctx.strokeStyle = o.strokeStyle
    if o.fillStyle?   then  @ctx.fillStyle   = o.fillStyle
    if o.lineCap?     then  @ctx.lineCap     = o.lineCap

  paint_queued_line: (o) ->
    @ctx.save()
    @ctx.beginPath()
    @zc.applyToCtx @ctx
    @set_ctx_from_cmd o
    @ctx.moveTo o.start[0], o.start[1]
    @ctx.lineTo o.end[0],   o.end[1]
    @ctx.stroke()
    @ctx.restore()

  paint_queued_lines: (o) ->
    @ctx.save()
    @ctx.beginPath()
    @apply_affine_to_ctx()
    @set_ctx_from_cmd o
    @ctx.moveTo o.points[0][0], o.points[0][1]
    for p in o.points[1...]
      @ctx.lineTo p[0], p[1]
    @ctx.stroke()
    @ctx.restore()

  paint_queued_circle: (o) ->
    @ctx.save()
    @ctx.beginPath()
    @zc.applyToCtx @ctx
    @set_ctx_from_cmd o
    @ctx.arc o.center[0], o.center[1], o.radius, 0, 2*Math.PI, false
    @ctx.fill()
    @ctx.stroke()
    @ctx.restore()    

  apply_affine_to_ctx: ->
    if not @is_affine_applied
      @is_affine_applied = true
      @zc.applyToCtx @ctx

  recalc_bounds: ->
    d = Date.now()
    rects = (@get_q_bounds q for q in @queue when not q[1].clippable)
    if @bounds?
      rects.push @bounds # keep original bounds unless cleared
    @bounds = rect.bounding_rects rects

  get_q_bounds: (q_item) ->
    qt = q_item[0]
    o  = q_item[1]
    switch qt
      when qtypes.LINE
        return rect.bounding_vecs [new vec(o.start[0], o.start[1]), new vec(o.end[0], o.end[1])]
      when qtypes.CIRCLE
        return rect.bounding_circle { 
          center: new vec o.center[0], o.center[1]
          radius: o.radius
        }
      else throw new Error "Unknown q type: #{qt}"

exports.ezCanvas = ezCanvas
