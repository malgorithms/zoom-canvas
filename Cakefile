{spawn, exec} = require 'child_process'
fs            = require 'fs'
path          = require 'path'
stitch        = require 'stitch'
browserify    = require 'browserify'
icsify        = require 'icsify'
uglify        = require 'uglify-js'
through       = require 'through'
stitch        = require 'stitch'

# -------------

task 'build', 'build the whole jam', (cb) ->  

  await 
    browserify_it {
      expose:       'zoomCanvas' # sets require('zoomCanvas') in browser same as require('./src/browser-main.iced')
      p:            './src/browser-main.iced'
      out:          './zoom-canvas.js'
      min:          './zoom-canvas-min.js'
      cb:           defer()
    }

# -------------

# -------------

browserify_it = ({p, expose, out, min, bundle_opts, cb}) ->
  b = browserify()
  b.transform browserify_transform

  if expose?
    b.require p, {expose}
  else
    b.require p

  await b.bundle (bundle_opts or {}), defer err, src
  if err then throw err

  await fs.writeFile out, src, defer err
  if err then throw err  

  await fs.writeFile min, src, defer err # cover the min for a second, just so we can use it
  if err then throw err

  console.log "generating #{out}: success (#{src.length} chars)"
  mcode = uglify.minify(out).code
  await fs.writeFile min, mcode, defer err
  if err then throw err

  console.log "generating #{min}: success (#{mcode.length} chars)"
  cb()

# -------------

browserify_transform = (file) ->
  console.log "...browserify transforming #{file}"
  if file.match /\.(coffee|iced)$/
    icsify file
  else if file.match /\.js$/
    through file
    # just pass it through using through
    data  = ''
    write = (buf) -> data += buf
    end   = ->
      this.queue data
      this.queue null
    return through write, end
  else
    throw new Error "Don't know how to browserify (#{file})"  

