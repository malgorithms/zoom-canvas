{vec} = require './vec'

class rect
  constructor: (ll, ur)->
    @ll = ll or new vec(0,0)# lower left vec
    @ur = ur or new vec(0,0)# upper right vec

  copy: ->
    r = new rect @ll.copy(), @lr.copy()

exports.rect = rect