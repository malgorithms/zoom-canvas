class vec
  constructor: (x,y) ->
    @x = x
    @y = y
  zero: -> @x = @y = 0
  copy: -> new vec(@x, @y)

exports.vec = vec