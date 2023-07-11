(()=>{"use strict";var e,t={241:(e,t,s)=>{var i,a,r=s(260);class n extends Phaser.Scene{constructor(){super({key:"BootScene"})}preload(){this.cameras.main.setBackgroundColor(10016391),this.createLoadingbar(),this.load.on("progress",(e=>{this.progressBar.clear(),this.progressBar.fillStyle(16774867,1),this.progressBar.fillRect(this.cameras.main.width/4,this.cameras.main.height/2-16,this.cameras.main.width/2*e,16)}),this),this.load.on("complete",(()=>{this.progressBar.destroy(),this.loadingBar.destroy()}),this),this.load.pack("preload","./assets/pack.json","preload")}update(){this.scene.start("GameScene")}createLoadingbar(){this.loadingBar=this.add.graphics(),this.loadingBar.fillStyle(6139463,1),this.loadingBar.fillRect(this.cameras.main.width/4-2,this.cameras.main.height/2-18,this.cameras.main.width/2+4,20),this.progressBar=this.add.graphics()}}!function(e){e.IDLE="idle",e.SWAP="swap",e.MATCH="match",e.NO_MOVE="no-move"}(i||(i={}));class d{constructor(e,t){this.name=e,this.currentState=t,this.previousState=t,this.emitter=new Phaser.Events.EventEmitter}static getInstance(){return this.instance||(this.instance=new this),this.instance}updateState(e){this.currentState!==e&&(this.previousState=this.currentState,this.currentState=e,this.handleStateChange(),this.emitter.emit(this.name+"state-changed",this.currentState,this.previousState))}getCurrentState(){return this.currentState}getPreviousState(){return this.previousState}}class c extends d{constructor(){super("board",i.IDLE)}handleStateChange(){}}!function(e){e.BLUE="blue",e.GREEN="green",e.ORANGE="orange",e.PURPLE="purple",e.RED="red",e.YELLOW="yellow"}(a||(a={}));const o={blue:430079,green:1507072,orange:16736256,purple:14506198,red:16646144,yellow:16776960},h={score:0,highscore:0,gridWidth:8,gridHeight:8,tileWidth:64,tileHeight:64,candyTypes:[a.BLUE,a.GREEN,a.ORANGE,a.PURPLE,a.RED,a.YELLOW]};class l{static Float(e,t){return Math.random()*(t-e)+e}static Int(e,t){return Math.floor(Math.random()*(t-e+1)+e)}static Percent(e){return this.Float(0,100)<=e}}class g extends Phaser.GameObjects.Image{constructor(e){super(e.scene,e.x,e.y,e.texture,e.frame),this.candyType=e.candyType,this.setOrigin(0,0).setScale(.7).setInteractive(),this.scene.add.existing(this)}destroy(e){this.playDestroyEffect(),super.destroy(e)}playDestroyEffect(){const{x:e,y:t}=this.getCenter();this.scene.add.particles(e,t,"particle-1",{color:[o[this.candyType]],lifespan:500,angle:{min:0,max:360},rotate:{start:l.Float(0,360),end:l.Float(0,360)},scale:{start:l.Float(.4,.5),end:0,ease:"Back.in"},speed:{min:100,max:120},gravityY:200,duration:300,stopAfter:Phaser.Math.RND.between(2,3)}),this.scene.add.particles(e,t,"particle-2",{lifespan:500,angle:{min:0,max:360},rotate:{min:0,max:360,start:l.Float(0,360),end:l.Float(0,360)},scale:{start:l.Float(1,2),end:0,ease:"Back.in"},speed:{min:100,max:120},gravityY:200,duration:300,blendMode:r.BlendModes.ADD,stopAfter:Phaser.Math.RND.between(3,5)}),this.scene.add.particles(e,t,"particle-3",{color:[o[this.candyType]],lifespan:500,alpha:{start:1,end:0,ease:"Quad.out"},scale:{start:0,end:1,ease:"Quart.out"},duration:300,blendMode:r.BlendModes.ADD,stopAfter:1})}}var y;class p{static init(e){this.scene=e,this.firstSelectedCandy=void 0,this.secondSelectedCandy=void 0,this.selectedFrame=e.add.image(0,0,"selected-frame").setScale(.6).setVisible(!1),e.add.tween({targets:this.selectedFrame,scale:.65,duration:600,repeat:-1,yoyo:!0}),e.input.on("gameobjectdown",this.candyDown,e)}static setFramePosition(e){this.selectedFrame.setPosition(e.getCenter().x,e.getCenter().y).setVisible(!0)}static candyUp(){this.firstSelectedCandy=void 0,this.secondSelectedCandy=void 0}}y=p,p.candyDown=(e,t)=>{if(c.getInstance().getCurrentState()===i.IDLE&&t)if(y.firstSelectedCandy)if(y.firstSelectedCandy===t)y.firstSelectedCandy=void 0,y.selectedFrame.setVisible(!1);else{y.secondSelectedCandy=t;const e=Math.abs(y.firstSelectedCandy.x-y.secondSelectedCandy.x)/h.tileWidth,s=Math.abs(y.firstSelectedCandy.y-y.secondSelectedCandy.y)/h.tileHeight;(1===e&&0===s||0===e&&1===s)&&(c.getInstance().updateState(i.SWAP),u.swapCandies(y.firstSelectedCandy,y.secondSelectedCandy)),y.selectedFrame.setVisible(!1)}else y.firstSelectedCandy=t,y.setFramePosition(y.firstSelectedCandy)};class u{static init(e){this.scene=e,this.grid=[],this.candyGridOffset=new Phaser.Math.Vector2((e.scale.width-h.gridWidth*h.tileWidth)/2,(e.scale.height-h.gridHeight*h.tileHeight)/2)}static create(){for(let e=0;e<h.gridHeight;e++){this.grid[e]=[];for(let t=0;t<h.gridWidth;t++)this.grid[e][t]=this.addCandy(t,e)}return this.grid}static addCandy(e,t){const s=h.candyTypes[Phaser.Math.RND.between(0,h.candyTypes.length-1)];return new g({scene:this.scene,candyType:s,x:e*h.tileWidth+this.candyGridOffset.x,y:t*h.tileHeight+this.candyGridOffset.y,texture:s})}static fillCandy(){return new Promise((e=>{const t=[];for(let e=0;e<h.gridHeight;e++)t[e]=[];for(let e=0;e<this.grid.length;e++)for(let s=0;s<this.grid[e].length;s++)if(void 0===this.grid[e][s]){const i=this.addCandy(s,e);t[s].push(i),this.grid[e][s]=i}for(let e=0;e<t.length;e++)for(let s=0;s<t[e].length;s++){const i=t[e][s];i.y-=h.tileHeight*t[e].length,this.scene.add.tween({targets:i,y:i.y+h.tileHeight*t[e].length,ease:"Bounce.out",duration:500})}this.scene.tweens.addCounter({duration:500,onComplete:()=>{e()}})}))}static resetCandy(){for(let e=this.grid.length-1;e>0;e--)for(let t=this.grid[e].length-1;t>=0;t--){const s=e;if(void 0===this.grid[s][t]&&void 0!==this.grid[s-1][t]){const i=this.grid[s-1][t];this.grid[s][t]=i,this.grid[s-1][t]=void 0,this.scene.add.tween({targets:i,y:h.tileHeight*s+u.candyGridOffset.y,ease:"Bounce.out",duration:500}),t=this.grid[s].length,e=this.grid.length-1}}}static swapCandies(e,t){if(e&&t){c.getInstance().updateState(i.SWAP);const s=e.x-u.candyGridOffset.x,a=t.x-u.candyGridOffset.x,n=e.y-u.candyGridOffset.y,d=t.y-u.candyGridOffset.y;this.grid[n/h.tileHeight][s/h.tileWidth]=t,this.grid[d/h.tileHeight][a/h.tileWidth]=e;const o=this.scene.add.particles(32,32,"particle-3",{color:[1048575],lifespan:500,alpha:{start:1,end:0,ease:"Quad.out"},scale:{start:1,end:0,ease:"Quart.in"},duration:300,blendMode:r.BlendModes.ADD,stopAfter:1}),l=this.scene.add.particles(32,32,"particle-3",{color:[1048575],lifespan:500,alpha:{start:1,end:0,ease:"Quad.out"},scale:{start:1,end:0,ease:"Quart.in"},duration:300,blendMode:r.BlendModes.ADD,stopAfter:1});this.scene.add.tween({targets:p.firstSelectedCandy,x:t.x,y:t.y,ease:"Quad.out",duration:200,repeat:0,yoyo:!1,onUpdate:(e,t)=>{var s,i;o.x=null!==(s=t.getCenter().x)&&void 0!==s?s:0,o.y=null!==(i=t.getCenter().y)&&void 0!==i?i:0}}),this.scene.add.tween({targets:p.secondSelectedCandy,x:e.x,y:e.y,ease:"Quad.out",duration:200,repeat:0,yoyo:!1,onUpdate:(e,t)=>{var s,i;l.x=null!==(s=t.getCenter().x)&&void 0!==s?s:0,l.y=null!==(i=t.getCenter().y)&&void 0!==i?i:0},onComplete:()=>{this.scene.checkMatches()}}),p.firstSelectedCandy=this.grid[n/h.tileHeight][s/h.tileWidth],p.secondSelectedCandy=this.grid[d/h.tileHeight][a/h.tileWidth]}}static removeCandyGroup(e){const t=e.flat();for(const e of t){const t=this.getTilePos(e);-1!==t.x&&-1!==t.y&&(e.destroy(),this.grid[t.y][t.x]=void 0)}}static getTilePos(e){const t=new Phaser.Math.Vector2(-1,-1);for(let s=0;s<this.grid.length;s++)for(let i=0;i<this.grid[s].length;i++)if(e===this.grid[s][i]){t.x=i,t.y=s;break}return t}static getMatches(){const e=[],t=[];for(let e=0;e<this.grid.length;e++){t[e]=[];for(let s=0;s<this.grid[e].length;s++)t[e][s]=!1}for(let s=0;s<this.grid.length;s++)for(let i=0;i<this.grid[s].length-2;i++){const a=this.grid[s][i];if(a&&!t[s][i]){const r=[a];let n=1;for(let e=i+1;e<this.grid[s].length;e++){const t=this.grid[s][e];if(!t||t.candyType!==a.candyType)break;r.push(t),n++}n>=3&&(e.push(r),r.forEach((e=>{const s=e.y,i=e.x;t[s]&&!1===t[s][i]&&(t[s][i]=!0)})))}}for(let s=0;s<this.grid[0].length;s++)for(let i=0;i<this.grid.length-2;i++){const a=this.grid[i][s];if(a&&!t[i][s]){const r=[a];let n=1;for(let e=i+1;e<this.grid.length;e++){const t=this.grid[e][s];if(!t||t.candyType!==a.candyType)break;r.push(t),n++}n>=3&&(e.push(r),r.forEach((e=>{const s=e.y,i=e.x;t[s]&&!1===t[s][i]&&(t[s][i]=!0)})))}}return e}}class f extends Phaser.Scene{constructor(){super("GameScene")}init(){u.init(this),p.init(this),this.cameras.main.setBackgroundColor(7908062),this.add.rectangle(0,0,this.scale.width,u.candyGridOffset.y,7908062).setOrigin(0).setDepth(1),u.create(),this.checkMatches()}checkMatches(){const e=u.getMatches();e.length>0?(c.getInstance().updateState(i.MATCH),u.removeCandyGroup(e),u.resetCandy(),u.fillCandy().then((()=>{p.candyUp(),this.checkMatches()}))):(u.swapCandies(p.firstSelectedCandy,p.secondSelectedCandy),p.candyUp(),this.tweens.addCounter({duration:200,onComplete:()=>{c.getInstance().updateState(i.IDLE)}}))}}const m={title:"Candy crush",url:"https://github.com/digitsensitive/phaser3-typescript",version:"2.0",scale:{width:520,height:window.innerHeight>window.innerWidth?520*window.innerHeight/window.innerWidth:700,parent:"phaser-game",mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},type:Phaser.WEBGL,parent:"game",scene:[n,f],backgroundColor:"#de3412",render:{pixelArt:!1,antialias:!0}};class C extends Phaser.Game{constructor(e){super(e)}}window.addEventListener("load",(()=>{new C(m)}))}},s={};function i(e){var a=s[e];if(void 0!==a)return a.exports;var r=s[e]={exports:{}};return t[e].call(r.exports,r,r.exports,i),r.exports}i.m=t,e=[],i.O=(t,s,a,r)=>{if(!s){var n=1/0;for(h=0;h<e.length;h++){for(var[s,a,r]=e[h],d=!0,c=0;c<s.length;c++)(!1&r||n>=r)&&Object.keys(i.O).every((e=>i.O[e](s[c])))?s.splice(c--,1):(d=!1,r<n&&(n=r));if(d){e.splice(h--,1);var o=a();void 0!==o&&(t=o)}}return t}r=r||0;for(var h=e.length;h>0&&e[h-1][2]>r;h--)e[h]=e[h-1];e[h]=[s,a,r]},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={179:0};i.O.j=t=>0===e[t];var t=(t,s)=>{var a,r,[n,d,c]=s,o=0;if(n.some((t=>0!==e[t]))){for(a in d)i.o(d,a)&&(i.m[a]=d[a]);if(c)var h=c(i)}for(t&&t(s);o<n.length;o++)r=n[o],i.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return i.O(h)},s=self.webpackChunktype_project_template=self.webpackChunktype_project_template||[];s.forEach(t.bind(null,0)),s.push=t.bind(null,s.push.bind(s))})();var a=i.O(void 0,[216],(()=>i(241)));a=i.O(a)})();