{zoomCanvas}      = require './zoom-canvas'
{rect}            = require './rect'
{vec}             = require './vec'


draw_code = exports.draw_code =  
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

  line:   (o) -> @queue.push [draw_code.LINE,   o]
  lines:  (o) -> @queue.push [draw_code.LINES,  o]
  circle: (o) -> @queue.push [draw_code.CIRCLE, o]

  clear: ->
    @clear_canvas()
    @bounds     = null
    @queue      = []

  clear_canvas: ->
    ###
    does not delete its queue
    ###
    @ctx.clearRect 0, 0, @canvas.width, @canvas.height

  paint: (opts) ->
    opts = opts or {}
    if (b = opts.bounds)
      @zc.setObjectBounds b.ll.x, b.ll.y, b.ur.x, b.ur.y
    else
      @recalc_bounds()
      @zc.setObjectBounds @bounds.ll.x, @bounds.ll.y, @bounds.ur.x, @bounds.ur.y

    @zc.step Date.now()
    @paint_queued_item q for q in @queue

  world_pair_to_canvas_pair: (p) -> @zc.worldPairToCanvasPair p
  canvas_pair_to_world_pair: (p) -> @zc.canvasPairToWorldPair p

  # ----------- PRIVATE -------------------------------

  paint_queued_item: (q_item) ->
    qt = q_item[0]
    o  = q_item[1]
    switch qt
      when draw_code.LINE
        @paint_queued_line o
      when draw_code.LINE
        @paint_queued_lines o
      when draw_code.CIRCLE
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
    if o.lineWidth? or o.strokeStyle?
      @ctx.stroke()
    if o.fillStyle?
      @ctx.fill()
    @ctx.restore()    

  apply_affine_to_ctx: ->
    if not @is_affine_applied
      @is_affine_applied = true
      @zc.applyToCtx @ctx

  recalc_bounds: ->
    d = Date.now()
    rects = (ezCanvas.get_queued_item_bounds q[0], q[1] for q in @queue when not q[1].clippable)
    if @bounds?
      rects.push @bounds # keep original bounds unless cleared
    @bounds = rect.bounding_rects rects

  # class members

  @get_queued_item_bounds: (dc, o) ->
    switch dc
      when draw_code.LINE
        return rect.bounding_vecs [new vec(o.start[0], o.start[1]), new vec(o.end[0], o.end[1])]
      when draw_code.CIRCLE
        return rect.bounding_circle { 
          center: new vec o.center[0], o.center[1]
          radius: o.radius
        }
      else throw new Error "Unknown q type: #{dc}"

exports.ezCanvas = ezCanvas
