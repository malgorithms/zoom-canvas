{vec} = require './vec'

class rect
  constructor: (ll, ur)->
    @ll = ll or new vec(0,0)# lower left vec
    @ur = ur or new vec(0,0)# upper right vec

  copy: ->
    r = new rect @ll.copy(), @ur.copy()

  @bounding_vecs: (vec_array) ->
    res = new rect()
    for v, i in vec_array
      if (i is 0) or v.x < res.ll.x then res.ll.x = v.x
      if (i is 0) or v.x > res.ur.x then res.ur.x = v.x
      if (i is 0) or v.y < res.ll.y then res.ll.y = v.y
      if (i is 0) or v.y > res.ur.x then res.ur.y = v.y
    return res

  @bounding_rects: (rects_array) ->
    if not rects_array.length
      return new rect()
    else
      res = rects_array[0].copy()
      for r in rects_array[1...]
        if r.ll.x < res.ll.x then res.ll.x = r.ll.x
        if r.ur.x > res.ur.x then res.ur.x = r.ur.x
        if r.ll.y < res.ll.y then res.ll.y = r.ll.y
        if r.ur.y > res.ur.y then res.ur.y = r.ur.y
      return res

exports.rect = rect