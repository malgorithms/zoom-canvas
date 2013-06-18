require=function(t,i,n){function s(n,r){if(!i[n]){if(!t[n]){var o="function"==typeof require&&require;if(!r&&o)return o(n,!0);if(e)return e(n,!0);throw new Error("Cannot find module '"+n+"'")}var h=i[n]={exports:{}};t[n][0].call(h.exports,function(i){var e=t[n][1][i];return s(e?e:i)},h,h.exports)}return i[n].exports}for(var e="function"==typeof require&&require,r=0;r<n.length;r++)s(n[r]);return s}({zoomCanvas:[function(t,i){i.exports=t("HLD9Zx")},{}],HLD9Zx:[function(t,i,n){!function(){n.zoomCanvas=t("./zoom-canvas").zoomCanvas,n.ezCanvas=t("./ez-canvas").ezCanvas,n.ezStack=t("./ez-stack").ezStack,n.colorWizard=t("./color-wizard").colorWizard}.call(this)},{"./zoom-canvas":1,"./ez-canvas":2,"./ez-stack":3,"./color-wizard":4}],4:[function(t,i,n){!function(){var t,i,s;t={darken:function(t,i){var n;return n=[t[0]*(1-i),t[1]*(1-i),t[2]*(1-i)],null!=t[3]&&(n[3]=t[3]*(1-i)),n},lighten:function(t,i){var n;return n=[t[0]+(255-t[0])*i,t[1]+(255-t[1])*i,t[2]+(255-t[2])*i],null!=t[3]&&(n[3]=t[3]+(255-t[3])*i),n},hex255:function(t){return Math.floor(t/16).toString(16)+(t%16).toString(16)},hex:function(i){var n;return n=""+t.hex255(~~i[0])+t.hex255(~~i[1])+t.hex255(~~i[2]),null!=i[3]&&(n+=t.hex255(~~i[3])),n}};for(i in t)s=t[i],n[i]=s}.call(this)},{}],2:[function(t,i,n){!function(){var i,s,e,r,o;o=t("./zoom-canvas").zoomCanvas,e=t("./rect").rect,r=t("./vec").vec,i=n.draw_code={LINE:10,LINES:11,CIRCLE:12},s=function(){function t(t){this.zc=new o(t),this.bounds=null,this.canvas=t.canvas,this.queue=[],this.ctx=this.canvas.getContext("2d"),this.is_affine_applied=!1}return t.prototype.line=function(t){return this.queue.push([i.LINE,t])},t.prototype.lines=function(t){return this.queue.push([i.LINES,t])},t.prototype.circle=function(t){return this.queue.push([i.CIRCLE,t])},t.prototype.clear=function(){return this.clear_canvas(),this.bounds=null,this.queue=[]},t.prototype.clear_canvas=function(){return this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)},t.prototype.paint=function(t){var i,n,s,e,r,o;for(t=t||{},(i=t.bounds)?this.zc.setObjectBounds(i.ll.x,i.ll.y,i.ur.x,i.ur.y):(this.recalc_bounds(),this.zc.setObjectBounds(this.bounds.ll.x,this.bounds.ll.y,this.bounds.ur.x,this.bounds.ur.y)),this.zc.step(Date.now()),r=this.queue,o=[],s=0,e=r.length;e>s;s++)n=r[s],o.push(this.paint_queued_item(n));return o},t.prototype.world_pair_to_canvas_pair=function(t){return this.zc.worldPairToCanvasPair(t)},t.prototype.canvas_pair_to_world_pair=function(t){return this.zc.canvasPairToWorldPair(t)},t.prototype.paint_queued_item=function(t){var n,s;switch(s=t[0],n=t[1],s){case i.LINE:return this.paint_queued_line(n);case i.LINE:return this.paint_queued_lines(n);case i.CIRCLE:return this.paint_queued_circle(n);default:throw new Error("Dunno how to draw "+s)}},t.prototype.set_ctx_from_cmd=function(t){return null!=t.lineWidth&&(this.ctx.lineWidth=t.lineWidth),null!=t.strokeStyle&&(this.ctx.strokeStyle=t.strokeStyle),null!=t.fillStyle&&(this.ctx.fillStyle=t.fillStyle),null!=t.lineCap?this.ctx.lineCap=t.lineCap:void 0},t.prototype.paint_queued_line=function(t){return this.ctx.save(),this.ctx.beginPath(),this.zc.applyToCtx(this.ctx),this.set_ctx_from_cmd(t),this.ctx.moveTo(t.start[0],t.start[1]),this.ctx.lineTo(t.end[0],t.end[1]),this.ctx.stroke(),this.ctx.restore()},t.prototype.paint_queued_lines=function(t){var i,n,s,e;for(this.ctx.save(),this.ctx.beginPath(),this.apply_affine_to_ctx(),this.set_ctx_from_cmd(t),this.ctx.moveTo(t.points[0][0],t.points[0][1]),e=t.points.slice(1),n=0,s=e.length;s>n;n++)i=e[n],this.ctx.lineTo(i[0],i[1]);return this.ctx.stroke(),this.ctx.restore()},t.prototype.paint_queued_circle=function(t){return this.ctx.save(),this.ctx.beginPath(),this.zc.applyToCtx(this.ctx),this.set_ctx_from_cmd(t),this.ctx.arc(t.center[0],t.center[1],t.radius,0,2*Math.PI,!1),(null!=t.lineWidth||null!=t.strokeStyle)&&this.ctx.stroke(),null!=t.fillStyle&&this.ctx.fill(),this.ctx.restore()},t.prototype.apply_affine_to_ctx=function(){return this.is_affine_applied?void 0:(this.is_affine_applied=!0,this.zc.applyToCtx(this.ctx))},t.prototype.recalc_bounds=function(){var i,n,s;return i=Date.now(),s=function(){var i,s,e,r;for(e=this.queue,r=[],i=0,s=e.length;s>i;i++)n=e[i],n[1].clippable||r.push(t.get_queued_item_bounds(n[0],n[1]));return r}.call(this),null!=this.bounds&&s.push(this.bounds),this.bounds=e.bounding_rects(s)},t.get_queued_item_bounds=function(t,n){switch(t){case i.LINE:return e.bounding_vecs([new r(n.start[0],n.start[1]),new r(n.end[0],n.end[1])]);case i.CIRCLE:return e.bounding_circle({center:new r(n.center[0],n.center[1]),radius:n.radius});default:throw new Error("Unknown q type: "+t)}},t}(),n.ezCanvas=s}.call(this)},{"./zoom-canvas":1,"./rect":5,"./vec":6}],3:[function(t,i,n){!function(){var i,s,e,r,o;o=t("./ez-canvas"),s=o.ezCanvas,i=o.draw_code,r=t("./rect").rect,e=function(){function t(t){var i,n,e,r,o,h,a;for(this.ezs=[],this.bounds=[],this.total_bounds=null,this.layers=[],a=t.layers,o=0,h=a.length;h>o;o++){e=a[o],this.layers.push({needs_paint:!1,clippable:null!=e.clippable?e.clippable:!1,canvas:e.canvas}),i={canvas:e.canvas};for(n in t)r=t[n],"layers"!==n&&(i[n]=r);this.ezs.push(new s(i))}}return t.prototype.line=function(t){return this.ezs[t.layer].line(t),this.layers[t.layer].needs_paint=!0,this.adjust_bounds(t,i.LINE)},t.prototype.lines=function(t){return this.ezs[t.layer].lines(t),this.layers[t.layer].needs_paint=!0,this.adjust_bounds(t,i.LINES)},t.prototype.circle=function(t){return this.ezs[t.layer].circle(t),this.layers[t.layer].needs_paint=!0,this.adjust_bounds(t,i.CIRCLE)},t.prototype.adjust_bounds=function(t,i){var n;if(!t.clippable&&!this.layers[t.layer].clippable){if(n=s.get_queued_item_bounds(i,t),null==this.bounds[t.layer])return this.bounds[t.layer]=n.copy(),this.recalc_bounds();if(this.bounds[t.layer].contain_rect(n))return this.recalc_bounds()}},t.prototype.clear_layer=function(t){return this.ezs[t].clear(),this.bounds[t]=null,this.layers[t].needs_paint=!0,this.recalc_bounds()},t.prototype.clear_all=function(){var t,i,n,s,e,r;for(e=this.layers,r=[],t=n=0,s=e.length;s>n;t=++n)i=e[t],r.push(this.clear_layer(t));return r},t.prototype.paint=function(){var t,i,n,s,e,r;for(e=this.layers,r=[],t=n=0,s=e.length;s>n;t=++n)i=e[t],i.needs_paint&&(this.ezs[t].clear_canvas(),this.ezs[t].paint({bounds:this.total_bounds}),r.push(i.needs_paint=!1));return r},t.prototype.recalc_bounds=function(){var t,i,n,s,e,o,h;if(i=r.bounding_rects(function(){var i,s,e,r;for(e=this.bounds,r=[],n=i=0,s=e.length;s>i;n=++i)t=e[n],null==t||this.layers[n].clippable||r.push(t);return r}.call(this)),null==this.total_bounds||!this.total_bounds.is_same(i)){for(this.total_bounds=i,h=this.layers,e=0,o=h.length;o>e;e++)s=h[e],s.needs_paint=!0;return!0}return!1},t.prototype.world_pair_to_canvas_pair=function(t){return this.ezs[0].world_pair_to_canvas_pair(t)},t.prototype.canvas_pair_to_world_pair=function(t){return this.ezs[0].canvas_pair_to_world_pair(t)},t}(),n.ezStack=e}.call(this)},{"./ez-canvas":2,"./rect":5}],6:[function(t,i,n){!function(){var t;t=function(){function t(t,i){this.x=t,this.y=i}return t.prototype.zero=function(){return this.x=this.y=0},t.prototype.copy=function(){return new t(this.x,this.y)},t.prototype.is_same=function(t){return t.x===this.x&&t.y===this.y},t}(),n.vec=t}.call(this)},{}],5:[function(t,i,n){!function(){var i,s;s=t("./vec").vec,i=function(){function t(t,i){this.ll=t||new s(0,0),this.ur=i||new s(0,0)}return t.prototype.copy=function(){var i;return i=new t(this.ll.copy(),this.ur.copy())},t.prototype.is_same=function(t){return this.ll.is_same(t.ll)&&this.ur.is_same(t.ur)},t.prototype.contain_vec=function(t){var i;return i=!1,t.x<this.ll.x&&(i=!0)&&(this.ll.x=t.x),t.x>this.ur.x&&(i=!0)&&(this.ur.x=t.x),t.y<this.ll.y&&(i=!0)&&(this.ll.y=t.y),t.y>this.ur.y&&(i=!0)&&(this.ur.y=t.y),i},t.prototype.contain_rect=function(t){var i;return i=!1,t.ll.x<this.ll.x&&(i=!0)&&(this.ll.x=t.ll.x),t.ur.x>this.ur.x&&(i=!0)&&(this.ur.x=t.ur.x),t.ll.y<this.ll.y&&(i=!0)&&(this.ll.y=t.ll.y),t.ur.y>this.ur.y&&(i=!0)&&(this.ur.y=t.ur.y),i},t.bounding_vecs=function(i){var n,s,e,r,o;for(s=new t,n=r=0,o=i.length;o>r;n=++r)e=i[n],(0===n||e.x<s.ll.x)&&(s.ll.x=e.x),(0===n||e.x>s.ur.x)&&(s.ur.x=e.x),(0===n||e.y<s.ll.y)&&(s.ll.y=e.y),(0===n||e.y>s.ur.y)&&(s.ur.y=e.y);return s},t.bounding_rects=function(i){var n,s,e,r,o;if(i.length){for(s=i[0].copy(),o=i.slice(1),e=0,r=o.length;r>e;e++)n=o[e],s.contain_rect(n);return s}return new t},t.bounding_circle=function(i){var n,e;return n=i.center,e=i.radius,new t(new s(n.x-e,n.y-e),new s(n.x+e,n.y+e))},t}(),n.rect=i}.call(this)},{"./vec":6}],1:[function(t,i,n){!function(){var i,s,e,r;e=t("./vec").vec,s=t("./rect").rect,i=t("affine").affine,r=function(){function t(t){if(t=t||{},!(t.canvas||t.canvas_width&&t.canvas_height))throw new Error("zoomCanvas expects either a canvas or a canvas_width, canvas_height");this.canvas=t.canvas||null,this.width=t.canvas_width||this.canvas.width,this.height=t.canvas_height||this.canvas.height,this.step_dt=null!=t.step_dt_ms?t.step_dt_ms/1e3:.01,this.fill=t.fill||1,this.spring_k=null!=t.spring_k?t.spring_k:null,this.spring_damp=null!=t.spring_damp?t.spring_damp:null,this.drawScale=null,this.affine=new i.affine2d,this.inv_affine=new i.affine2d,this.lastStep=null,this.bounds={target:new s,actual:new s,vel:{ll:new e(0,0),ur:new e(0,0)}}}return t.prototype.setObjectBounds=function(t,i,n,s){return this.bounds.target.ll.x=t,this.bounds.target.ll.y=i,this.bounds.target.ur.x=n,this.bounds.target.ur.y=s},t.prototype.getPosRotScale=function(){return this.affine.toPosRotScale()},t.prototype.getPosRotScaleInv=function(){return this.inv_affine.toPosRotScale()},t.prototype.setCtxTransform=function(t){return this.affine.setCtxTransform(t)},t.prototype.applyToCtx=function(t){return this.affine.applyToCtx(t)},t.prototype.step=function(t){var i,n,s,e,r,o,h,a,u,c,l;if(null==this.spring_damp||null==this.spring_k)return this.instantZoom();for(c=t/1e3,this.lastStep=this.lastStep||c,u=Date.now(),n=0,s=!1;!s;)if(n++,e=this.step_dt,this.lastStep<c?this.lastStep+=e:s=!0,l=this.bounds.target,i=this.bounds.actual,r=(l.ll.x-i.ll.x)*this.spring_k-this.bounds.vel.ll.x*this.spring_damp,h=(l.ll.y-i.ll.y)*this.spring_k-this.bounds.vel.ll.y*this.spring_damp,o=(l.ur.x-i.ur.x)*this.spring_k-this.bounds.vel.ur.x*this.spring_damp,a=(l.ur.y-i.ur.y)*this.spring_k-this.bounds.vel.ur.y*this.spring_damp,this.bounds.vel.ll.x+=r*e,this.bounds.vel.ll.y+=h*e,this.bounds.vel.ur.x+=o*e,this.bounds.vel.ur.y+=a*e,i.ll.x+=this.bounds.vel.ll.x*e,i.ll.y+=this.bounds.vel.ll.y*e,i.ur.x+=this.bounds.vel.ur.x*e,i.ur.y+=this.bounds.vel.ur.y*e,Date.now()-u>10){console.log("Bypassing smoothness for speed reasons after "+n+" steps"),this.instantZoom();break}return this._updateAffine()},t.prototype.worldPairToCanvasPair=function(t){return this.affine.transformPair(t[0],t[1])},t.prototype.canvasPairToWorldPair=function(t){return this.inv_affine.transformPair(t[0],t[1])},t.prototype.instantZoom=function(){return this.bounds.vel.ll.zero(),this.bounds.vel.ur.zero(),this.bounds.actual=this.bounds.target.copy(),this.lastStep=null,this._updateAffine()},t.prototype._updateAffine=function(){var t,n,s,e,r,o,h;return this.canvas&&(this.width=this.canvas.width,this.height=this.canvas.height),t=this.bounds.actual,r=t.ur.x-t.ll.x,e=t.ur.y-t.ll.y,o=this.width/r,h=this.height/e,this.drawScale=this.fill*Math.min(o,h),n=(t.ll.x+t.ur.x)/2,s=(t.ll.y+t.ur.y)/2,this.affine=new i.affine2d,this.affine.translate(this.width/2,this.height/2),this.affine.scale(this.drawScale,-this.drawScale),this.affine.translate(-n,-s),this.inv_affine=new i.affine2d,this.inv_affine.translate(n,s),this.inv_affine.scale(1/this.drawScale,-(1/this.drawScale)),this.inv_affine.translate(-this.width/2,-this.height/2)},t}(),n.zoomCanvas=r}.call(this)},{"./vec":6,"./rect":5,affine:7}],7:[function(t,i,n){!function(){n.affine=t("./lib/affine"),n.polygon=t("./lib/polygon")}.call(this)},{"./lib/affine":8,"./lib/polygon":9}],8:[function(t,i,n){!function(){var t,i,s,e,r,o,h,a,u,c=[].slice,l={}.hasOwnProperty,p=function(t,i){function n(){this.constructor=t}for(var s in i)l.call(i,s)&&(t[s]=i[s]);return n.prototype=i.prototype,t.prototype=new n,t.__super__=i.prototype,t};n.compose=function(t,i){var n;return n=i.copy(),n.rightComposeWith(t),n},t=function(){function t(){var t;t=1<=arguments.length?c.call(arguments,0):[],0===t.length?(this.m00=1,this.m01=0,this.m10=0,this.m11=1,this.v0=0,this.v1=0):1===t.length?(this.m00=t[0].m00,this.m01=t[0].m01,this.m10=t[0].m10,this.m11=t[0].m11,this.v0=t[0].v0,this.v1=t[0].v1):(this.m00=t[0],this.m01=t[1],this.m10=t[2],this.m11=t[3],this.v0=t[4],this.v1=t[5])}return t.prototype.oneLineSummary=function(){return"M = ["+this.m00.toPrecision(3)+(" "+this.m01.toPrecision(3))+(" "+this.m10.toPrecision(3))+(" "+this.m11.toPrecision(3)+"]   V = (")+(""+this.v0.toPrecision(3)+", ")+(" "+this.v1.toPrecision(3)+")   scale = ")+this.getXScale().toPrecision(3)+" x "+this.getYScale().toPrecision(3)},t.prototype.copy=function(){return new t(this)},t.prototype.setCtxTransform=function(t){return t.setTransform(this.m00,this.m10,this.m01,this.m11,this.v0,this.v1)},t.prototype.applyToCtx=function(t){return t.transform(this.m00,this.m10,this.m01,this.m11,this.v0,this.v1)},t.prototype.transformPair=function(t,i){var n,s;return n=this.m00*t+this.m01*i+this.v0,s=this.m10*t+this.m11*i+this.v1,[n,s]},t.prototype.transformVec=function(t){var i,n;return i=this.m00*t[0]+this.m01*t[1]+this.v0,n=this.m10*t[0]+this.m11*t[1]+this.v1,t[0]=i,t[1]=n},t.prototype.rightComposeWith=function(t){var i,n,s,e,r,o;return s=t.m00*this.m10+t.m10*this.m11,e=t.m01*this.m10+t.m11*this.m11,o=t.v0*this.m10+t.v1*this.m11+this.v1,i=t.m00*this.m00+t.m10*this.m01,n=t.m01*this.m00+t.m11*this.m01,r=t.v0*this.m00+t.v1*this.m01+this.v0,this.m00=i,this.m01=n,this.m10=s,this.m11=e,this.v0=r,this.v1=o},t.prototype.leftComposeWith=function(t){var i,n,s,e,r,o;return s=this.m00*t.m10+this.m10*t.m11,e=this.m01*t.m10+this.m11*t.m11,o=this.v0*t.m10+this.v1*t.m11+t.v1,i=this.m00*t.m00+this.m10*t.m01,n=this.m01*t.m00+this.m11*t.m01,r=this.v0*t.m00+this.v1*t.m01+t.v0,this.m00=i,this.m01=n,this.m10=s,this.m11=e,this.v0=r,this.v1=o},t.prototype.deconstruct=function(){var t,i,n,s,e,r;return i=Math.sqrt(this.m00*this.m00+this.m10*this.m10),s=(this.m00*this.m11-this.m10*this.m01)/i,e=(this.m00*this.m01+this.m10*this.m11)/(this.m00*this.m11-this.m10*this.m01),t=Math.atan2(this.m10,this.m00),n=this.v0,r=this.v1,[i,s,e,t,n,r]},t.prototype.toPosRotScale=function(){var t;return t=Math.sqrt(this.m00*this.m00+this.m10*this.m10),{pos:[this.v0,this.v1],rot:Math.atan2(this.m10,this.m00),scale:[t,(this.m00*this.m11-this.m10*this.m01)/t]}},t.prototype.getXCenter=function(){return this.v0},t.prototype.getYCenter=function(){return this.v1},t.prototype.scale=function(t,i){return null==i&&(i=t),this.rightComposeWith(new a(t,i))},t.prototype.rotate=function(t){return this.rightComposeWith(new h(t))},t.prototype.translate=function(t,i){return this.rightComposeWith(new u(t,i))},t.prototype.flipX=function(){return this.rightComposeWith(new i)},t.prototype.flipY=function(){return this.rightComposeWith(new s)},t.prototype.reflect=function(t,i){return null!=i?this.rightComposeWith(new o(t,i)):this.rightComposeWith(new r(t))},t}(),h=function(t){function i(t){i.__super__.constructor.call(this,Math.cos(t),-Math.sin(t),Math.sin(t),Math.cos(t),0,0)}return p(i,t),i}(t),a=function(t){function i(t,n){i.__super__.constructor.call(this,t,0,0,n,0,0)}return p(i,t),i}(t),u=function(t){function i(t,n){i.__super__.constructor.call(this,1,0,0,1,t,n)}return p(i,t),i}(t),o=function(t){function i(t,n){i.__super__.constructor.call(this,2*t*t-1,2*t*n,2*t*n,2*n*n-1,0,0)}return p(i,t),i}(t),r=function(t){function i(t){i.__super__.constructor.call(this,Math.cos(t,Math.sin(t)))}return p(i,t),i}(o),i=function(t){function i(){i.__super__.constructor.call(this,-1,0,0,1,0,0)}return p(i,t),i}(t),s=function(t){function i(){i.__super__.constructor.call(this,1,0,0,-1,0,0)}return p(i,t),i}(t),e=function(t){function i(t){var n,s,e;n=t.pos,s=t.rot,e=t.scale,i.__super__.constructor.call(this),this.translate(n[0],n[1]),this.rotate(s),"number"==typeof e?this.scale(e):1===e.length?this.scale(e[0]):this.scale(e[0],e[1])}return p(i,t),i}(t),n.affine2d=t,n.rotation=h,n.scaling=a,n.translation=u,n.reflectionUnit=o,n.reflection=r,n.flipX=i,n.flipY=s,n.posRotScale=e}.call(this)},{}],9:[function(t,i,n){!function(){var i,s;i=t("./affine"),s=function(){function t(t){this.vertices=null!=t?t:[]}return t.prototype.copy=function(){var i,n,s,e,r;for(i=[],r=this.vertices,s=0,e=r.length;e>s;s++)n=r[s],i.push(n.copy());return new t(i)},t.prototype.addVertex=function(t){return this.vertices.push(t)},t.prototype.transform=function(t){var i,n,s,e,r;for(e=this.vertices,r=[],n=0,s=e.length;s>n;n++)i=e[n],r.push(t.transformVec(i));return r},t.prototype.getBoundingRectangle=function(){var t,i,n,s,e,r;for(n=null,r=this.vertices,t=s=0,e=r.length;e>s;t=++s)i=r[t],0===t?n=[[i[0],i[1]],[i[0],i[1]]]:(i[0]<n[0][0]&&(n[0][0]=i[0]),i[0]>n[1][0]&&(n[1][0]=i[0]),i[1]<n[0][1]&&(n[0][1]=i[1]),i[1]>n[1][1]&&(n[1][1]=i[1]));return n},t}(),n.polygon=s,n.factory={unitSquare:function(){return new s([[.5,.5],[-.5,.5],[-.5,-.5],[.5,-.5]])},unitCircleApprox:function(t){var i,n,e,r,o;for(e=2*Math.PI/t,r=0,n=new s,i=o=0;t>=0?t>o:o>t;i=t>=0?++o:--o)r+=e,n.addVertex([.5*Math.cos(r),.5*Math.sin(r)]);return n}}}.call(this)},{"./affine":8}]},{},[]);