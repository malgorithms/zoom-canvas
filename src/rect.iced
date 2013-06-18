{vec} = require './vec'

class rect
  constructor: (ll, ur)->
    @ll = ll or new vec(0,0)# lower left vec
    @ur = ur or new vec(0,0)# upper right vec

  copy: ->
    r = new rect @ll.copy(), @ur.copy()

  is_same: (r) -> @ll.is_same(r.ll) and @ur.is_same(r.ur)

  contain_vec: (v) ->
    # returns true if the bounds had to be expanded
    expanded = false
    if v.x < @ll.x then (expanded = true) and (@ll.x = v.x) 
    if v.x > @ur.x then (expanded = true) and (@ur.x = v.x) 
    if v.y < @ll.y then (expanded = true) and (@ll.y = v.y) 
    if v.y > @ur.y then (expanded = true) and (@ur.y = v.y) 
    expanded

  contain_rect: (r) ->
    # returns true if the bounds had to be expanded
    expanded = false
    if r.ll.x < @ll.x then (expanded = true) and (@ll.x = r.ll.x)
    if r.ur.x > @ur.x then (expanded = true) and (@ur.x = r.ur.x)
    if r.ll.y < @ll.y then (expanded = true) and (@ll.y = r.ll.y)
    if r.ur.y > @ur.y then (expanded = true) and (@ur.y = r.ur.y)
    expanded    


  @bounding_vecs: (vec_array) ->
    res = new rect()
    for v, i in vec_array
      if (i is 0) or v.x < res.ll.x then res.ll.x = v.x
      if (i is 0) or v.x > res.ur.x then res.ur.x = v.x
      if (i is 0) or v.y < res.ll.y then res.ll.y = v.y
      if (i is 0) or v.y > res.ur.y then res.ur.y = v.y
    return res

  @bounding_rects: (rects_array) ->
    if not rects_array.length
      return new rect()
    else
      res = rects_array[0].copy()
      res.contain_rect r for r in rects_array[1...]
      return res

  @bounding_circle: (circle) ->
    c = circle.center
    r = circle.radius
    return new rect(
      new vec(c.x-r, c.y-r),
      new vec(c.x+r, c.y+r)
    )

exports.rect = rect