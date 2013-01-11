###

  To test this, just run 'iced quick_test.iced' from the command line

###

{zoomCanvas} = require '../src/zoom-canvas'

zc = new zoomCanvas {
  fill:           0.8
  spring_k:       5
  spring_damp:    5
  canvas_width:   400
  canvas_height:  400
}

zc.setObjectBounds -1, -1, 1, 1

console.log zc.affine

for i in [0...1000]
  await setTimeout defer(), 10
  if (i % 10) is 0
    console.log zc.affine.toPosRotScale()
  zc.step()