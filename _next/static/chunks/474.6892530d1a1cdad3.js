"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[474],{6474:function(o,e,r){r.r(e),r.d(e,{default:function(){return p}});var t=r(7437),a=r(2265),s=r(4769),c=r(8936),n=r(7414),i=r(6747),l=r(5692);let u=`#version 300 es
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_pixelRatio;

uniform vec4 u_colorFront;
uniform vec4 u_colorMid;
uniform vec4 u_colorBack;
uniform float u_brightness;
uniform float u_contrast;

in vec2 v_patternUV;

out vec4 fragColor;

${l.EO}

float neuroShape(vec2 uv, float t) {
  vec2 sine_acc = vec2(0.);
  vec2 res = vec2(0.);
  float scale = 8.;

  for (int j = 0; j < 15; j++) {
    uv = rotate(uv, 1.);
    sine_acc = rotate(sine_acc, 1.);
    vec2 layer = uv * scale + float(j) + sine_acc - t;
    sine_acc += sin(layer);
    res += (.5 + .5 * cos(layer)) / scale;
    scale *= (1.2);
  }
  return res.x + res.y;
}

void main() {
  vec2 shape_uv = v_patternUV;
  shape_uv *= .13;

  float t = .5 * u_time;

  float noise = neuroShape(shape_uv, t);

  noise = (1. + u_brightness) * noise * noise;
  noise = pow(noise, .7 + 6. * u_contrast);
  noise = min(1.4, noise);

  float blend = smoothstep(0.7, 1.4, noise);

  vec4 frontC = u_colorFront;
  frontC.rgb *= frontC.a;
  vec4 midC = u_colorMid;
  midC.rgb *= midC.a;
  vec4 blendFront = mix(midC, frontC, blend);

  float safeNoise = max(noise, 0.0);
  vec3 color = blendFront.rgb * safeNoise;
  float opacity = clamp(blendFront.a * safeNoise, 0., 1.);

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1. - opacity);
  opacity = opacity + u_colorBack.a * (1. - opacity);

  ${l.yP}

  fragColor = vec4(color, opacity);
}
`,f={name:"Default",params:{...n.j5,speed:1,frame:0,colorFront:"#ffffff",colorMid:"#47a6ff",colorBack:"#000000",brightness:.05,contrast:.3}};n.j5,n.j5,n.j5;let d=(0,a.memo)(function({speed:o=f.params.speed,frame:e=f.params.frame,colorFront:r=f.params.colorFront,colorMid:a=f.params.colorMid,colorBack:c=f.params.colorBack,brightness:l=f.params.brightness,contrast:d=f.params.contrast,fit:m=f.params.fit,scale:p=f.params.scale,rotation:_=f.params.rotation,originX:h=f.params.originX,originY:v=f.params.originY,offsetX:g=f.params.offsetX,offsetY:b=f.params.offsetY,worldWidth:F=f.params.worldWidth,worldHeight:k=f.params.worldHeight,...y}){let C={u_colorFront:(0,i.f)(r),u_colorMid:(0,i.f)(a),u_colorBack:(0,i.f)(c),u_brightness:l,u_contrast:d,u_fit:n.MI[m],u_scale:p,u_rotation:_,u_offsetX:g,u_offsetY:b,u_originX:h,u_originY:v,u_worldWidth:F,u_worldHeight:k};return(0,t.jsx)(s.b,{...y,speed:o,frame:e,fragmentShader:u,uniforms:C})},c.r),m={void:{colorBack:"#0A0908",colorMid:"#1a0e08",colorFront:"#3a1a0d",brightness:.25,contrast:.55,speed:.35},mesh:{colorBack:"#0A0908",colorMid:"#5c2510",colorFront:"#FF5A1F",brightness:.55,contrast:.7,speed:.6},rupture:{colorBack:"#140302",colorMid:"#8a1206",colorFront:"#FF2E1F",brightness:.9,contrast:.85,speed:1.4},release:{colorBack:"#0A0908",colorMid:"#4a2210",colorFront:"#FF8A4C",brightness:.45,contrast:.6,speed:.4}};function p(){let[o,e]=(0,a.useState)("void"),[r]=(0,a.useState)(()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches);if((0,a.useEffect)(()=>{if(r)return;let o=Array.from(document.querySelectorAll("[data-ember-stage]"));if(!o.length)return;let t=new IntersectionObserver(o=>{let r=null;for(let e of o){if(!e.isIntersecting)continue;let o=e.target.getAttribute("data-ember-stage");o&&(!r||e.intersectionRatio>r.ratio)&&(r={ratio:e.intersectionRatio,stage:o})}r&&e(r.stage)},{threshold:[.15,.4,.6,.85]});return o.forEach(o=>t.observe(o)),()=>t.disconnect()},[r]),r)return null;let s=m[o];return(0,t.jsx)("div",{"aria-hidden":!0,className:"pointer-events-none fixed inset-0 z-0 opacity-90",style:{contain:"strict"},children:(0,t.jsx)(d,{style:{width:"100%",height:"100%",transition:"opacity 900ms ease"},colorBack:s.colorBack,colorMid:s.colorMid,colorFront:s.colorFront,brightness:s.brightness,contrast:s.contrast,speed:s.speed})})}}}]);