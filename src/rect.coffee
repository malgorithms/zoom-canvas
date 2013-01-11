
class rect
  constructor: ({ll, ur})-> 
    @ll = ll or null # lower left vec
    @ur = ur or null # upper right vec
  copy: ->
    r = new boundingRect {
      ll: @ll.copy()
      lr: @lr.copy()
    }

exports.rect = rect