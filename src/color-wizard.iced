#
# a color is an RGB array triple, for example [0,128,255]
#   OR
# an RGBA quad, for example [255,255,255,127]
#

cw = 
  darken: (c, frac) ->
    res = [
      c[0] * (1 - frac)
      c[1] * (1 - frac)
      c[2] * (1 - frac)
    ]
    if c[3]? then res[3] = c[3] * (1 - frac)
    res

  lighten: (c, frac) ->
    res = [
      c[0] + (255 - c[0]) * frac
      c[1] + (255 - c[1]) * frac
      c[2] + (255 - c[2]) * frac
    ]
    if c[3]? then res[3] = c[3] + (255 - c[3]) * frac
    res

  hex255: (n) -> Math.floor(n / 16).toString(16) + (n % 16).toString(16)
  hex   : (c) -> 
    res = "#{cw.hex255 ~~c[0]}#{cw.hex255 ~~c[1]}#{cw.hex255 ~~c[2]}"
    if c[3]? then res += cw.hex255 ~~c[3]
    res

exports[k] = v for k,v of cw
