{spawn, exec}          = require 'child_process'
fs                     = require 'fs'
path                   = require 'path'
stitch                 = require 'stitch'

task 'build', 'build the whole jam', (cb) ->  
  console.log "Building"
  files = fs.readdirSync 'src'
  files = ('src/' + file for file in files when file.match(/\.coffee$/))
  clearLibJs ->
    runCoffee ['-c', '-o', 'lib/'].concat(files), ->
      stitchIt ->
        runCoffee ['-c', 'index.coffee'], ->
          console.log "Done building."
          cb() if typeof cb is 'function'

stitchIt = (cb) ->
  s = stitch.createPackage { paths: ['./lib', './node_modules'] }
  s.compile (err, source) ->
    if err
      console.log err
      process.exit 1
    fs.writeFile 'zoom-canvas.js', source, (err) ->
      if err then throw err
      console.log "Stitched."
      cb()

runCoffee = (args, cb) ->
  proc =  spawn 'coffee', args
  console.log args
  proc.stderr.on 'data', (buffer) -> console.log buffer.toString()
  proc.on        'exit', (status) ->
    process.exit(1) if status isnt 0
    cb() if typeof cb is 'function'

clearLibJs = (cb) ->
  files = fs.readdirSync 'lib'
  files = ("lib/#{file}" for file in files when file.match(/\.js$/))
  fs.unlinkSync f for f in files
  cb()