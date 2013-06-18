class vec
  constructor: (x,y) ->
    @x = x
    @y = y
  zero: -> @x = @y = 0
  copy: -> new vec(@x, @y)
  is_same: (v) -> (v.x is @x) and (v.y is @y)

exports.vec = vec