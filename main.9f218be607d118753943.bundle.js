(()=>{"use strict";var e,t={387:(e,t,i)=>{var s,a,r,n=i(260);class d extends Phaser.Scene{constructor(){super({key:"BootScene"})}preload(){this.cameras.main.setBackgroundColor(10016391),this.createLoadingbar(),this.load.on("progress",(e=>{this.progressBar.clear(),this.progressBar.fillStyle(16774867,1),this.progressBar.fillRect(this.cameras.main.width/4,this.cameras.main.height/2-16,this.cameras.main.width/2*e,16)}),this),this.load.on("complete",(()=>{this.progressBar.destroy(),this.loadingBar.destroy()}),this),this.load.pack("preload","./assets/pack.json","preload"),this.load.spritesheet("lightning","./assets/images/lightning-sheet.png",{frameWidth:288,frameHeight:271});for(let e=1;e<=14;e++)this.load.image(`bg-${e}`,`./assets/images/bg/bg-${e}.webp`)}update(){this.scene.start("GameScene")}createLoadingbar(){this.loadingBar=this.add.graphics(),this.loadingBar.fillStyle(6139463,1),this.loadingBar.fillRect(this.cameras.main.width/4-2,this.cameras.main.height/2-18,this.cameras.main.width/2+4,20),this.progressBar=this.add.graphics()}}!function(e){e.CREATE="create",e.IDLE="idle",e.SWAP="swap",e.MATCH="match",e.FILL="fill",e.NO_MOVE="no-move",e.LEVEL_CLEAR="level-clear"}(s||(s={})),function(e){e.BLUE="blue",e.GREEN="green",e.ORANGE="orange",e.PURPLE="purple",e.RED="red",e.YELLOW="yellow",e.COLOR="color"}(a||(a={})),function(e){e.NONE="none",e.VERTICAL_STRIPED="vertical-striped",e.HORIZONTAL_STRIPED="horizontal-striped",e.WRAPPED="wrapped",e.COLOR_BOMB="color-bomb"}(r||(r={}));const o={blue:430079,green:1507072,orange:16736256,purple:14506198,red:16646144,yellow:16776960,color:16777215},c={score:0,highscore:0,gridWidth:10,gridHeight:12,tileWidth:64,tileHeight:64,candyTypes:[a.BLUE,a.GREEN,a.ORANGE,a.PURPLE,a.RED,a.YELLOW]};class h{static HexToRRB(e){return Phaser.Display.Color.IntegerToRGB(e)}static RGBtoHex(e){return(e.r<<16)+(e.g<<8)+e.b}static Shade(e,t){return e.r=Math.floor(e.r*(1-t)),e.g=Math.floor(e.g*(1-t)),e.b=Math.floor(e.b*(1-t)),e}}class l{static Float(e,t){return Math.random()*(t-e)+e}static Int(e,t){return Math.floor(Math.random()*(t-e+1)+e)}static Percent(e){return this.Float(0,100)<=e}static Color(e,t){const i=h.HexToRRB(e),s=h.HexToRRB(t),a=Math.random(),r=Phaser.Math.Linear(i.r,s.r,a),n=Phaser.Math.Linear(i.g,s.g,a),d=Phaser.Math.Linear(i.b,s.b,a);return h.RGBtoHex({r,g:n,b:d})}static shuffleArray(e){const t=[...e];for(let e=t.length-1;e>0;e--){const i=Math.floor(Math.random()*(e+1));[t[e],t[i]]=[t[i],t[e]]}return t}}const g=class{static init(e){this.scene=e,this.background1=e.add.image(e.scale.width/2,e.scale.height/2,`bg-${l.Int(1,14)}`).setDepth(-1),this.background1.setScale(e.scale.height/this.background1.displayHeight),this.background2=e.add.image(e.scale.width/2,e.scale.height/2,`bg-${l.Int(1,14)}`).setDepth(-1),this.background2.setScale(e.scale.height/this.background2.displayHeight)}static changeBackground(){const e=this.background1.texture.key;this.scene.add.tween({targets:this.background2,alpha:0,duration:2e3,onComplete:()=>{this.background2.setTexture(e),this.background2.setAlpha(1),this.background1.setTexture(`bg-${l.Int(1,14)}`)}})}},p=class{constructor(e,t){this.name=e,this.currentState=t,this.previousState=t,this.emitter=new Phaser.Events.EventEmitter}static getInstance(){return this.instance||(this.instance=new this),this.instance}updateState(e){this.currentState!==e&&(this.previousState=this.currentState,this.currentState=e,this.handleStateChange(),this.emitter.emit(this.name+"-state-changed",this.currentState,this.previousState))}getCurrentState(){return this.currentState}getPreviousState(){return this.previousState}},y=class extends p{constructor(){super("board",s.IDLE)}handleStateChange(){}},m=[{key:"broken-particle",texture:"particle-1",config:{lifespan:500,angle:{min:0,max:360},rotate:{start:l.Float(0,360),end:l.Float(0,360)},scale:{start:l.Float(.4,.5),end:0,ease:"Back.in"},speed:{min:100,max:120},gravityY:200,duration:300}},{key:"twinkle",texture:"particle-2",config:{lifespan:500,angle:{min:0,max:360},rotate:{min:0,max:360,start:l.Float(0,360),end:l.Float(0,360)},scale:{start:l.Float(1,2),end:0,ease:"Back.in"},speed:{min:100,max:120},gravityY:200,duration:300,blendMode:n.BlendModes.ADD}},{key:"ring-impact",texture:"particle-3",config:{lifespan:500,alpha:{start:1,end:0,ease:"Quad.in"},scale:{start:0,end:1,ease:"Quart.out"},duration:300,blendMode:n.BlendModes.ADD,stopAfter:1}},{key:"striped-line",texture:"striped-line",config:{lifespan:500,duration:300,alpha:{start:0,end:1,ease:"Quad.out"},scale:2,blendMode:n.BlendModes.ADD,stopAfter:1}},{key:"wrapped-shockwave",texture:"particle-5",config:{lifespan:500,duration:300,alpha:{start:1,end:0,ease:"Quirt.in"},scale:{start:0,end:4,ease:"Cubic.out"},blendMode:n.BlendModes.ADD,stopAfter:1}},{key:"left-confetti",texture:"square",config:{scaleY:{start:1,end:1},lifespan:5e3,alpha:{start:1,end:0,ease:"Quart.in"},rotate:{start:0,end:-3e3,random:!0},speedX:{min:500,max:2e3},speedY:{min:-500,max:-1500},bounce:{min:6,max:16},gravityY:800}},{key:"right-confetti",texture:"square",config:{scaleY:{start:1,end:1},lifespan:5e3,alpha:{start:1,end:0,ease:"Quart.in"},rotate:{start:0,end:3e3,random:!0},speedX:{min:-500,max:-2e3},speedY:{min:-500,max:-1500},bounce:{min:6,max:16},gravityY:800}},{key:"progress-bar-head",texture:"particle-3",config:{scale:.5,lifespan:5e3,alpha:{start:1,end:0,ease:"Quart.in"},rotate:{start:0,end:2e3,random:!0},speedX:{min:-500,max:-2e3},gravityY:800}}];class u extends Phaser.GameObjects.Particles.ParticleProcessor{constructor(e){var t,i;super(),this.dampingX=null!==(t=e.dampingX)&&void 0!==t?t:.95,this.dampingY=null!==(i=e.dampingY)&&void 0!==i?i:this.dampingX}update(e,t,i,s){e.velocityX*=this.dampingX,e.velocityY*=this.dampingY,e.scaleX=2*(s*Math.ceil(Math.abs(e.bounce))%1-.5)}}const f=u,C=[o.blue,o.green,o.yellow,o.purple,o.orange,o.red],S=class{static init(e){this.scene=e,this.particleEmitters=new Map,m.forEach((e=>{const t=this.scene.add.particles(void 0,void 0,e.texture,e.config).stop();this.particleEmitters.set(e.key,t),"left-confetti"!==e.key&&"right-confetti"!==e.key||t.addParticleProcessor(new f({dampingX:.976,dampingY:.99}))}))}static playCandyExplodeEffect(e,t,i){const s=this.particleEmitters.get("broken-particle"),a=this.particleEmitters.get("twinkle"),r=this.particleEmitters.get("ring-impact");s&&a&&r&&(s.particleTint=i,r.particleTint=i,s.setDepth(1).emitParticleAt(e,t,l.Int(2,3)),a.setDepth(1).emitParticleAt(e,t,l.Int(3,5)),r.emitParticleAt(e,t))}static playCandyExplodeByStriped(e,t,i,s){const a=this.particleEmitters.get("striped-line");a&&(a.particleTint=s,a.particleRotate=i===r.HORIZONTAL_STRIPED?90:0,a.setDepth(3),a.emitParticleAt(e,t))}static playWrappedExplode(e,t,i){const s=this.particleEmitters.get("wrapped-shockwave");s&&(s.particleTint=i,s.setDepth(3),s.emitParticleAt(e,t))}static playConfettiEffect(){const e=this.particleEmitters.get("left-confetti"),t=this.particleEmitters.get("right-confetti");if(e&&t){e.setDepth(1),t.setDepth(1);for(let t=0;t<50;t++)e.particleTint=C[l.Int(0,C.length-1)],e.emitParticleAt(0,this.scene.scale.height/2+100);for(let e=0;e<50;e++)t.particleTint=C[l.Int(0,C.length-1)],t.emitParticleAt(this.scene.scale.width,this.scene.scale.height/2+100)}}};class T extends Phaser.GameObjects.Sprite{constructor(e){super(e.scene,e.x,e.y,e.candyType,e.frame),this.gridX=e.gridX,this.gridY=e.gridY,this.candyType=e.candyType,this.setSpecialType(e.specialType),this.setScale(.35).setInteractive(),this.scene.add.existing(this),this.preFX&&(this.colorMatrix=this.preFX.addColorMatrix(),this.colorMatrix.active=!1)}playExplodeEffect(){var e,t;const i=null!==(e=this.getCenter().x)&&void 0!==e?e:0,s=null!==(t=this.getCenter().y)&&void 0!==t?t:0;S.playCandyExplodeEffect(i,s,o[this.candyType])}setGrid(e,t){this.gridX=e,this.gridY=t}getSpecialType(){return this.specialType}setSpecialType(e){switch(this.specialType=e,e){case r.NONE:this.setTexture(this.candyType);break;case r.VERTICAL_STRIPED:case r.HORIZONTAL_STRIPED:case r.WRAPPED:this.setTexture(`${this.candyType}-${this.specialType}`);break;case r.COLOR_BOMB:this.setTexture("color")}}getCandyType(){return this.candyType}setCandyType(e){this.candyType=e,this.setTexture(e)}setBrightnessEffect(e,t){this.preFX&&(this.colorMatrix.brightness(e),this.colorMatrix.active=t)}get isStriped(){return this.specialType===r.HORIZONTAL_STRIPED||this.specialType===r.VERTICAL_STRIPED}destroy(e){this.playExplodeEffect(),super.destroy(e)}}const v=class{static init(e){this.visited=[],this.matches=[],this.grid=e}static getMatches(){return this.visited=[],this.matches=[],this.initializeVisitedArray(),this.checkHorizontalMatches(),this.initializeVisitedArray(),this.checkVerticalMatches(),this.matches}static checkHorizontalMatches(){for(let e=0;e<this.grid.length;e++)for(let t=0;t<this.grid[e].length-2;t++){const i=this.grid[e][t];if(i&&!this.visited[e][t]){const s={candies:[i],type:"horizontal"};let a=1;for(let r=t+1;r<this.grid[e].length;r++){const t=this.grid[e][r];if(!t||t.getCandyType()!==i.getCandyType())break;s.candies.push(t),a++}a>=3&&(this.matches.push(s),this.markVisitedCandies(s))}}}static checkVerticalMatches(){for(let e=0;e<this.grid[0].length;e++)for(let t=0;t<this.grid.length-2;t++){const i=this.grid[t][e];if(i&&!this.visited[t][e]){const s={candies:[i],type:"vertical"};let a=1;for(let r=t+1;r<this.grid.length;r++){const t=this.grid[r][e];if(!t||t.getCandyType()!==i.getCandyType())break;s.candies.push(t),a++}a>=3&&(this.matches.push(s),this.markVisitedCandies(s))}}}static markVisitedCandies(e){e.candies.forEach((e=>{const t=e.gridY,i=e.gridX;this.visited[t]&&!1===this.visited[t][i]&&(this.visited[t][i]=!0)}))}static initializeVisitedArray(){for(let e=0;e<this.grid.length;e++){this.visited[e]=[];for(let t=0;t<this.grid[e].length;t++)this.visited[e][t]=!1}}},x=class{static init(e){this.scene=e,this.swapEffects=[]}static swapCandiesInternal(e,t){const i=I.grid;if(e&&t){const{x:s,y:a}=e,{x:r,y:n}=t,d=i[a][s],o=i[n][r],c=d;i[a][s]=o,i[n][r]=c,d&&d.setGrid(r,n),o&&o.setGrid(s,a)}}static swapCandies(e,t,i){y.getInstance().updateState(s.SWAP);const a=new Phaser.Math.Vector2(e.gridX,e.gridY),r=new Phaser.Math.Vector2(t.gridX,t.gridY),d=I.getCandyWorldPos(e),o=I.getCandyWorldPos(t);this.swapCandiesInternal(a,r),this.swapEffects.forEach((e=>e.destroy()));const c=this.scene.add.particles(d.x,d.y,"particle-3",{lifespan:500,alpha:{start:1,end:0,ease:"Quad.out"},scale:{start:1,end:0,ease:"Quad.out"},duration:200,blendMode:n.BlendModes.ADD,stopAfter:1}),h=this.scene.add.particles(o.x,o.y,"particle-3",{lifespan:500,alpha:{start:1,end:0,ease:"Quad.out"},scale:{start:1,end:0,ease:"Quad.out"},duration:200,blendMode:n.BlendModes.ADD,stopAfter:1});this.swapEffects.push(c,h),this.scene.add.tween({targets:e,x:o.x,y:o.y,ease:"Quad.out",duration:200,repeat:0,yoyo:!1,onUpdate:(e,t)=>{c.x=t.x,c.y=t.y}}),this.scene.add.tween({targets:t,x:d.x,y:d.y,ease:"Quad.out",duration:200,repeat:0,yoyo:!1,onUpdate:(e,t)=>{h.x=t.x,h.y=t.y},onComplete:()=>{i()}})}},E=class{static init(){this.currentScore=0,this.maxScore=100,this.emitter=new Phaser.Events.EventEmitter}static reset(e){this.maxScore=100*e,this.currentScore=0,this.emitter.emit("score-updated",this.currentScore,this.maxScore)}static addScore(e){this.currentScore>=this.maxScore||(this.currentScore+=e,this.emitter.emit("score-updated",this.currentScore,this.maxScore),this.currentScore>=this.maxScore&&this.emitter.emit("score-reached-max",this.currentScore,this.maxScore))}};class P extends Phaser.GameObjects.Rope{constructor(e){super(e,0,0,"lightning"),e.add.existing(this),this.setDepth(5).setColors(11987706).setBlendMode(n.BlendModes.ADD).play("lightning")}setLine(e,t){this.points[0]=e,this.points[this.points.length-1]=t}}var w;class R{static init(e){this.scene=e,this.firstSelectedCandy=void 0,this.secondSelectedCandy=void 0,this.selectedFrame=e.add.image(0,0,"selected-frame").setScale(.6).setVisible(!1).setDepth(5),e.add.tween({targets:this.selectedFrame,scale:.65,duration:600,repeat:-1,yoyo:!0}),e.input.on("gameobjectdown",this.candyDown,e)}static setFramePosition(e){const t=I.getCandyWorldPos(e);this.selectedFrame.setPosition(t.x,t.y).setVisible(!0)}static candyUp(){this.firstSelectedCandy=void 0,this.secondSelectedCandy=void 0}}w=R,R.candyDown=(e,t)=>{if(y.getInstance().getCurrentState()===s.IDLE&&t)if(w.firstSelectedCandy)if(w.firstSelectedCandy===t)w.firstSelectedCandy=void 0,w.selectedFrame.setVisible(!1);else{w.secondSelectedCandy=t;const e=Math.abs(w.firstSelectedCandy.gridX-w.secondSelectedCandy.gridX),i=Math.abs(w.firstSelectedCandy.gridY-w.secondSelectedCandy.gridY);1===e&&0===i||0===e&&1===i?(y.getInstance().updateState(s.SWAP),I.trySwapCandies(w.firstSelectedCandy,w.secondSelectedCandy)):w.firstSelectedCandy=void 0,w.selectedFrame.setVisible(!1)}else w.firstSelectedCandy=t,w.setFramePosition(w.firstSelectedCandy)};const M=R,O=class{static init(e){this.scene=e}static removeCandy(e,t){I.grid[e.gridY][e.gridX]=void 0,t?this.scene.tweens.addCounter({duration:t,onComplete:()=>{e.destroy()}}):e.destroy()}static removeColorCandyByColorBomb(e,t,i){for(let s=0;s<I.grid.length;s++)for(let a=0;a<I.grid[s].length;a++){const r=I.grid[s][a];r&&r.getCandyType()===t&&(i=Math.max(i,100*(a+1)+200),this.lightningCandy(e,r,100*a,(()=>{this.removeCandy(r)}))),E.addScore(1)}return i}static getWrappedCandies(e){const t=new Map;for(const i of e)for(const e of i.candies){const i=t.get(e)||0;t.set(e,i+1)}const i=[];return t.forEach(((e,t)=>{2===e&&i.push(t)})),i}static removeCandyByStriped(e,t,i,s){!t||t.getSpecialType()!==r.NONE&&t!==e?t&&t.getSpecialType()===r.COLOR_BOMB?(s.removeDelay=this.removeColorCandyByColorBomb(t,e.getCandyType(),s.removeDelay),s.candiesToRemove.delete(t),this.removeCandy(t,s.removeDelay)):t&&t!==e&&s.candiesToRemove.add(t):(s.removeDelay=Math.max(s.removeDelay,i),this.scene.tweens.addCounter({duration:i,onComplete:()=>{s.candiesToRemove.delete(t),this.removeCandy(t),S.playCandyExplodeByStriped(I.getCandyWorldPos(t).x,I.getCandyWorldPos(t).y,e.getSpecialType(),o[e.getCandyType()])}}))}static processCandiesToRemove(e){for(const t of e.candiesToRemove)if(t.getSpecialType()===r.HORIZONTAL_STRIPED){this.scene.cameras.main.shake(100,.02);for(let i=t.gridX;i>=0;i--){const s=I.grid[t.gridY][i];this.removeCandyByStriped(t,s,30*(t.gridX-i+1),e)}for(let i=t.gridX+1;i<I.grid[t.gridY].length;i++){const s=I.grid[t.gridY][i];this.removeCandyByStriped(t,s,30*(i+1-t.gridX),e)}E.addScore(8)}else if(t.getSpecialType()===r.VERTICAL_STRIPED){this.scene.cameras.main.shake(100,.02);for(let i=t.gridY;i>=0;i--){const s=I.grid[i][t.gridX];this.removeCandyByStriped(t,s,30*(t.gridY-i+1),e)}for(let i=t.gridY+1;i<I.grid.length;i++){const s=I.grid[i][t.gridX];this.removeCandyByStriped(t,s,30*(i+1-t.gridY),e)}E.addScore(8)}else if(t.getSpecialType()===r.WRAPPED){this.scene.cameras.main.shake(100,.02),S.playWrappedExplode(t.x,t.y,o[t.getCandyType()]);const i=I.getNeighborCandies(t);for(const s of i)s.getSpecialType()===r.NONE?(e.candiesToRemove.delete(s),this.removeCandy(s,0)):s.getSpecialType()===r.COLOR_BOMB?(e.removeDelay=this.removeColorCandyByColorBomb(s,t.getCandyType(),e.removeDelay),e.candiesToRemove.delete(s),this.removeCandy(s,e.removeDelay)):e.candiesToRemove.add(s);E.addScore(i.length)}}static removeCandyGroup(e){const t=this.getWrappedCandies(e),i={removeDelay:0,candiesToRemove:new Set};for(const s of e){for(let e=0;e<s.candies.length;e++){const a=s.candies[e];if(-1!==t.indexOf(a)){const t=[...s.candies];t.splice(e),this.scene.add.tween({targets:t,x:a.x,y:a.y,duration:50,ease:"Quad.out"}),a.setSpecialType(r.WRAPPED),i.candiesToRemove.delete(a),s.type="wrapped"}else i.candiesToRemove.add(a)}if(4===s.candies.length&&"wrapped"!==s.type){let e=l.Percent(50)?1:2;M.firstSelectedCandy&&-1!==s.candies.indexOf(M.firstSelectedCandy)?e=s.candies.indexOf(M.firstSelectedCandy):M.secondSelectedCandy&&-1!==s.candies.indexOf(M.secondSelectedCandy)&&(e=s.candies.indexOf(M.secondSelectedCandy));const t=[...s.candies];t.splice(e);const a=s.candies[e];S.playCandyExplodeEffect(a.x,a.y,o[a.getCandyType()]),a.setSpecialType("horizontal"===s.type?r.VERTICAL_STRIPED:r.HORIZONTAL_STRIPED),this.scene.add.tween({targets:t,x:a.x,y:a.y,duration:50,ease:"Quad.out"}),i.candiesToRemove.delete(a)}else if(5===s.candies.length){const e=s.candies[2];e.setCandyType(a.COLOR),e.setSpecialType(r.COLOR_BOMB),i.candiesToRemove.delete(e),S.playCandyExplodeEffect(e.x,e.y,o[e.getCandyType()]);const t=[...s.candies];t.splice(2),this.scene.add.tween({targets:t,x:e.x,y:e.y,duration:50,ease:"Quad.out"})}}this.processCandiesToRemove(i),this.scene.time.delayedCall(i.removeDelay+50,(()=>{y.getInstance().updateState(s.FILL),E.addScore(i.candiesToRemove.size);for(const e of i.candiesToRemove)e&&I.grid[e.gridY][e.gridX]&&this.removeCandy(e);I.resetCandy(),I.fillCandy().then((()=>{M.candyUp(),this.scene.checkMatches()}))}))}static lightningCandy(e,t,i,s){const a=new P(this.scene).setVisible(!1);a.setLine(new Phaser.Math.Vector2(e.x,e.y),new Phaser.Math.Vector2(t.x,t.y)),this.scene.tweens.addCounter({duration:i,onComplete:()=>{s&&s(),a.setVisible(!0),this.scene.tweens.addCounter({duration:200,onComplete:()=>{a.destroy()}})}})}},b=class{static init(e){this.scene=e;const t=new Phaser.Math.Vector2(e.scale.width/2,e.scale.height/2),i=Math.min(c.gridWidth*c.tileWidth,c.gridHeight*c.tileHeight);this.rectangle=new Phaser.Geom.Rectangle(t.x-i/2,t.y-i/2,i,i),this.circle=new Phaser.Geom.Circle(t.x,t.y,i/2),this.triangle=new Phaser.Geom.Triangle(t.x,t.y-i*Math.sqrt(3)/4,t.x-i/2,t.y+i*Math.sqrt(3)/4,t.x+i/2,t.y+i*Math.sqrt(3)/4)}static shuffle(e,t){y.getInstance().updateState(s.CREATE),e=l.shuffleArray(e);const i=[this.rectangle,this.circle,this.triangle][l.Int(0,2)],a=i.getPoints(e.length);for(let s=0;s<e.length;s++){const n=s/e.length,d=e[s];this.scene.add.tween({targets:d,x:a[s].x,y:a[s].y,duration:500,ease:"Quad.out",onComplete:()=>{t&&d.getSpecialType()!==r.COLOR_BOMB&&d.setCandyType(c.candyTypes[Phaser.Math.RND.between(0,c.candyTypes.length-1)]),this.scene.tweens.addCounter({from:n,to:n+1,duration:1e3,ease:"Linear",onComplete:()=>{this.scene.add.tween({targets:d,x:I.getCandyWorldPos(d).x,y:I.getCandyWorldPos(d).y,duration:500,ease:"Quad.out",delay:500})},onUpdate:e=>{let t=e.getValue();t>1&&(t-=1);const s=i.getPoint(t);d.setPosition(s.x,s.y)}})}})}return 2500}},B=class extends T{constructor(e){super(e),this.setScale(0)}show(e,t,i,s,a){this.setScale(0),this.setPosition(e,t),this.setCandyType(i),this.setSpecialType(s),this.scene.tweens.add({targets:this,scale:1,duration:300,ease:"Back.out",onComplete:()=>{a&&a()}})}};class D{static init(e){this.scene=e,this.grid=[],M.init(e),x.init(e),O.init(e),b.init(e),v.init(this.grid),this.candyGridOffset=new Phaser.Math.Vector2((e.scale.width-c.gridWidth*c.tileWidth+c.tileWidth)/2,(e.scale.height-c.gridHeight*c.tileHeight+c.tileWidth)/2),this.scene.add.nineslice(this.scene.scale.width/2,this.scene.scale.height/2,"grid",void 0,c.gridWidth*c.tileWidth+10,c.gridHeight*c.tileHeight+10,50,50,50,50),this.candyLayer=this.createLayerMask(),this.bigCandy=new B({x:50,y:50,gridX:0,gridY:0,scene:this.scene,candyType:a.BLUE,specialType:r.HORIZONTAL_STRIPED})}static createLayerMask(){const e=this.scene.add.layer(),t=this.scene.make.graphics();return t.fillRect(this.scene.scale.width/2-c.gridWidth*c.tileWidth/2,D.candyGridOffset.y-c.tileWidth/2,c.gridWidth*c.tileWidth,c.gridHeight*c.tileHeight),this.candyMask=t.createGeometryMask(),e.setMask(this.candyMask),e}static create(){const e=[];for(let t=0;t<c.gridHeight;t++){this.grid[t]=[];for(let i=0;i<c.gridWidth;i++){const s=D.addCandy(i,t);D.grid[t][i]=s,e.push(s)}}this.candyLayer.clearMask();const t=b.shuffle(e,!1);this.scene.time.delayedCall(t,(()=>{this.candyLayer.setMask(this.candyMask),this.scene.checkMatches()}))}static shuffle(){const e=[];for(let t=0;t<c.gridHeight;t++)for(let i=0;i<c.gridWidth;i++){const s=this.grid[t][i];s&&e.push(s)}this.candyLayer.clearMask();const t=b.shuffle(e,!0);this.scene.time.delayedCall(t,(()=>{this.candyLayer.setMask(this.candyMask),this.scene.checkMatches()}))}static clear(){for(let e=0;e<c.gridHeight;e++)for(let t=0;t<c.gridWidth;t++){const i=this.grid[e][t];i&&O.removeCandy(i)}}static playIdleEffect(){for(let e=0;e<this.grid.length;e++)for(let t=0;t<this.grid[e].length;t++){const i=this.grid[e][t];i&&this.scene.add.tween({targets:i,y:D.getCandyWorldPos(i).y-20,duration:200,delay:100*(e+t),ease:"Quad.out",yoyo:!0})}}static addCandy(e,t,i,s){const a=null!=i?i:c.candyTypes[Phaser.Math.RND.between(0,c.candyTypes.length-1)],n=null!=s?s:r.NONE,d=new T({scene:this.scene,candyType:a,specialType:n,x:e*c.tileWidth+this.candyGridOffset.x,y:t*c.tileHeight+this.candyGridOffset.y,gridX:e,gridY:t});return this.candyLayer.add(d),d}static fillCandy(){return new Promise((e=>{const t=[];for(let e=0;e<c.gridWidth;e++)t[e]=[];for(let e=0;e<this.grid.length;e++)for(let i=0;i<this.grid[e].length;i++)if(void 0===this.grid[e][i]){const s=this.addCandy(i,e);t[i].push(s),this.grid[e][i]=s}for(let e=0;e<t.length;e++)for(let i=0;i<t[e].length;i++){const s=t[e][i];s.y-=c.tileHeight*t[e].length,this.scene.add.tween({targets:s,y:s.y+c.tileHeight*t[e].length,ease:"Bounce.out",duration:500})}this.scene.tweens.addCounter({duration:550,onComplete:()=>{e()}})}))}static resetCandy(){var e;for(let t=this.grid.length-1;t>0;t--)for(let i=this.grid[t].length-1;i>=0;i--){const s=t;if(void 0===this.grid[s][i]&&void 0!==this.grid[s-1][i]){const a=this.grid[s-1][i];this.grid[s][i]=a,this.grid[s-1][i]=void 0,null==a||a.setGrid(i,s),null===(e=this.grid[s-1][i])||void 0===e||e.setGrid(i,s-1),this.scene.add.tween({targets:a,y:c.tileHeight*s+D.candyGridOffset.y,ease:"Bounce.out",duration:500}),i=this.grid[s].length,t=this.grid.length-1}}}static trySwapCandies(e,t){e&&t&&(y.getInstance().updateState(s.SWAP),x.swapCandies(e,t,(()=>{if(e.getSpecialType()===r.COLOR_BOMB||t.getSpecialType()===r.COLOR_BOMB){const i=e.getSpecialType()===r.COLOR_BOMB?e:t,s=e===i?t:e,a=[];let n=0;if(s.getSpecialType()===r.COLOR_BOMB){const e=Math.floor(c.gridWidth/2);for(let t=0;t<this.grid.length;t++){for(let s=0;s<e;s++){const e=this.grid[t][s];e&&e.getSpecialType()!==r.COLOR_BOMB&&(n=Math.max(n,100*(s+1)+200),O.lightningCandy(i,e,100*s,(()=>{O.removeCandy(e),E.addScore(1)})))}for(let i=this.grid[t].length-1;i>=e;i--){const e=this.grid[t][i];e&&e.getSpecialType()!==r.COLOR_BOMB&&(n=Math.max(n,100*(i+1)+200),O.lightningCandy(s,e,100*(this.grid[t].length-i-1),(()=>{O.removeCandy(e),E.addScore(1)})))}}a.push({candies:[s],type:"horizontal"})}else if(s.getSpecialType()===r.VERTICAL_STRIPED||s.getSpecialType()===r.HORIZONTAL_STRIPED||s.getSpecialType()===r.WRAPPED){const e=s.getSpecialType()===r.WRAPPED;for(let t=0;t<this.grid.length;t++)for(let d=0;d<this.grid[t].length;d++){const o=this.grid[t][d];if(o&&o.getCandyType()===s.getCandyType()&&o.getSpecialType()===r.NONE){n=Math.max(n,100*(d+1)+200);const t=e?r.WRAPPED:l.Percent(50)?r.VERTICAL_STRIPED:r.HORIZONTAL_STRIPED;O.lightningCandy(i,o,100*d,(()=>{o.setSpecialType(t),a.push({candies:[o],type:"horizontal"})}))}}}else n=O.removeColorCandyByColorBomb(i,s.getCandyType(),n);this.scene.time.delayedCall(n,(()=>{O.removeCandy(i),O.removeCandyGroup(a)}))}else if(e.isStriped&&t.isStriped){e.setSpecialType(r.VERTICAL_STRIPED),t.setSpecialType(r.HORIZONTAL_STRIPED);const i=[];i.push({candies:[e,t],type:"horizontal"}),O.removeCandyGroup(i)}else if(e.isStriped&&t.getSpecialType()===r.WRAPPED||t.isStriped&&e.getSpecialType()===r.WRAPPED){O.removeCandy(e),O.removeCandy(t);const i={removeDelay:0,candiesToRemove:new Set},s=[-1,0,1],{x:a,y:n}=this.getCandyWorldPos(e);this.bigCandy.show(a,n,e.getCandyType(),r.HORIZONTAL_STRIPED,(()=>{this.bigCandy.setScale(0),this.scene.cameras.main.shake(100,.02);for(const t of s){const s=e.gridY+t;if(!(s>=this.grid.length||s<0)){for(let t=e.gridX;t>=0;t--){const a=D.grid[s][t];O.removeCandyByStriped(this.bigCandy,a,30*(e.gridX-t+1),i)}for(let t=e.gridX+1;t<D.grid[s].length;t++){const a=D.grid[s][t];O.removeCandyByStriped(this.bigCandy,a,30*(t+1-e.gridX),i)}O.processCandiesToRemove(i),E.addScore(8)}}this.scene.tweens.addCounter({duration:500,onComplete:()=>{this.bigCandy.show(a,n,e.getCandyType(),r.VERTICAL_STRIPED,(()=>{this.bigCandy.setScale(0),this.scene.cameras.main.shake(100,.02);for(const t of s){const s=e.gridX+t;if(!(s>=this.grid[0].length||s<0)){for(let t=e.gridY;t>=0;t--){const a=D.grid[t][s];i.removeDelay=Math.max(i.removeDelay,30*(e.gridY-t+1)),O.removeCandyByStriped(this.bigCandy,a,30*(e.gridY-t+1),i)}for(let t=e.gridY+1;t<D.grid.length;t++){const a=D.grid[t][s];i.removeDelay=Math.max(i.removeDelay,30*(t+1-e.gridY)),O.removeCandyByStriped(this.bigCandy,a,30*(t+1-e.gridY),i)}O.processCandiesToRemove(i),E.addScore(8)}}this.scene.tweens.addCounter({duration:i.removeDelay,onComplete:()=>{O.removeCandyGroup([])}})}))}})}))}else this.scene.checkMatches()})))}static getHints(){for(let e=0;e<this.grid.length;e++)for(let t=0;t<this.grid[e].length-1;t++){const i=new Phaser.Math.Vector2(t,e),s=new Phaser.Math.Vector2(t+1,e);x.swapCandiesInternal(i,s);const a=v.getMatches();if(a.length>0)return x.swapCandiesInternal(i,s),a;x.swapCandiesInternal(i,s)}for(let e=0;e<this.grid[0].length;e++)for(let t=0;t<this.grid.length-1;t++){const i=new Phaser.Math.Vector2(e,t),s=new Phaser.Math.Vector2(e,t+1);x.swapCandiesInternal(i,s);const a=v.getMatches();if(a.length>0)return x.swapCandiesInternal(i,s),a;x.swapCandiesInternal(i,s)}return[]}static getNeighborCandies(e){const t=[[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]],i=[];for(let s=0;s<t.length;s++){const a=e.gridY+t[s][0],r=e.gridX+t[s][1];if(a<0||a>=this.grid.length)continue;if(r<0||r>=this.grid[0].length)continue;const n=this.grid[a][r];n&&i.push(n)}return i}static getCandyWorldPos(e){return new Phaser.Math.Vector2(e.gridX*c.tileWidth+this.candyGridOffset.x,e.gridY*c.tileHeight+this.candyGridOffset.y)}}const I=D;class k extends Phaser.GameObjects.Container{constructor(e){super(e),this.onScoreUpdated=(e,t)=>{this.updateProgress(e/t*100)},e.add.existing(this),this.createProgressbar(),this.createParticleEmitter(),this.createProgressBitmapText(),E.emitter.on("score-updated",this.onScoreUpdated)}createParticleEmitter(){this.particleEmitter=this.scene.add.particles(0,0,"particle-2",{color:[11987706],scale:{min:2,max:3},lifespan:200,alpha:{start:1,end:0,ease:"Quad.in"},rotate:{start:0,end:2e3,random:!0},angle:{min:120,max:240},speed:500,radial:!0,frequency:15,blendMode:n.BlendModes.ADD}),this.particleEmitter.setPosition(this.progressFill.getRightCenter().x,this.progressFill.getRightCenter().y),this.add(this.particleEmitter)}createProgressbar(){this.currentProgress=1,this.add(this.scene.add.image(-350,0,"progress-head")),this.progressFill=this.scene.add.image(-350,0,"progress-fill").setOrigin(0,.5).setScale(this.currentProgress,1),this.add(this.progressFill)}createProgressBitmapText(){this.progressBitmapText=this.scene.add.bitmapText(0,0,"bananasp","0%").setOrigin(.5).setTint(16173412,16173412,14908966,14908966),this.progressBitmapText.postFX.addGlow(7810313),this.add(this.progressBitmapText)}updateProgress(e){e<=100&&(this.scene.tweens.addCounter({from:this.currentProgress,to:e,duration:300,onUpdate:e=>{this.progressBitmapText.setText(e.getValue().toFixed(2)+"%")}}),this.currentProgress=e,this.scene.add.tween({targets:this.progressFill,scaleX:e/2,duration:300,ease:"Quad.out",onUpdate:()=>{this.particleEmitter.setPosition(this.progressFill.getRightCenter().x,this.progressFill.getRightCenter().y)}}))}}const L=k;class A extends Phaser.Scene{constructor(){super("GameScene"),this.onBoardStateChanged=e=>{switch(e){case s.CREATE:g.changeBackground();break;case s.IDLE:this.tryGetHint();case s.FILL:}},this.onScoreReachedMax=(e,t)=>{S.playConfettiEffect(),this.levelClear=!0}}init(){g.init(this),S.init(this),I.init(this),E.init()}create(){I.create(),this.createProgressBar(),this.cameras.main.setBackgroundColor(7908062),this.idleTimer=5e3,this.levelClear=!1,this.currentLevel=1,this.anims.create({key:"lightning",frames:this.anims.generateFrameNames("lightning",{prefix:"",start:0,end:60}),frameRate:30,yoyo:!0,repeat:-1}),y.getInstance().emitter.on("board-state-changed",this.onBoardStateChanged),E.emitter.on("score-reached-max",this.onScoreReachedMax)}createProgressBar(){new L(this).setDepth(2).setScale(.5).setPosition(this.scale.width/2,I.candyGridOffset.y-c.tileWidth/2-50)}checkMatches(){const e=v.getMatches();e.length>0?(y.getInstance().updateState(s.MATCH),O.removeCandyGroup(e)):this.levelClear?(this.currentLevel++,this.levelClear=!1,E.reset(this.currentLevel),I.shuffle()):(M.candyUp(),this.tweens.addCounter({duration:200,onComplete:()=>{y.getInstance().updateState(s.IDLE)}}))}tryGetHint(){this.hintTween&&!this.hintTween.isDestroyed()&&y.getInstance().getCurrentState()!==s.SWAP&&(this.hintTween.stop(),this.hintTween.destroy());const e=I.getHints()[0];e?(e.candies.forEach((e=>{e.setBrightnessEffect(1,!0)})),this.hintTween=this.tweens.addCounter({duration:300,repeat:-1,from:0,to:1,yoyo:!0,onUpdate:t=>{e.candies.forEach((e=>{const i=Phaser.Math.Easing.Sine.InOut(t.getValue());e.setBrightnessEffect(1+1.5*i,!0),e.setScale(.35+i*(.35-.38),.35+i*(.35-.32))}))},onStop:()=>{e.candies.forEach((e=>{e.setBrightnessEffect(0,!1),e.setScale(.35)}))}})):I.shuffle()}update(e,t){y.getInstance().getCurrentState()===s.IDLE?(this.idleTimer-=t,this.idleTimer<=0&&(this.idleTimer=3e3,I.playIdleEffect())):this.idleTimer=5e3}}const W={title:"Candy crush",url:"https://github.com/digitsensitive/phaser3-typescript",version:"2.0",scale:{width:720,height:window.innerHeight>window.innerWidth?720*window.innerHeight/window.innerWidth:1080,parent:"phaser-game",mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},type:Phaser.WEBGL,parent:"game",scene:[d,A],backgroundColor:"#de3412",render:{pixelArt:!1,antialias:!0}};class H extends Phaser.Game{constructor(e){super(e)}}window.addEventListener("load",(()=>{new H(W)}))}},i={};function s(e){var a=i[e];if(void 0!==a)return a.exports;var r=i[e]={exports:{}};return t[e].call(r.exports,r,r.exports,s),r.exports}s.m=t,e=[],s.O=(t,i,a,r)=>{if(!i){var n=1/0;for(h=0;h<e.length;h++){for(var[i,a,r]=e[h],d=!0,o=0;o<i.length;o++)(!1&r||n>=r)&&Object.keys(s.O).every((e=>s.O[e](i[o])))?i.splice(o--,1):(d=!1,r<n&&(n=r));if(d){e.splice(h--,1);var c=a();void 0!==c&&(t=c)}}return t}r=r||0;for(var h=e.length;h>0&&e[h-1][2]>r;h--)e[h]=e[h-1];e[h]=[i,a,r]},s.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={179:0};s.O.j=t=>0===e[t];var t=(t,i)=>{var a,r,[n,d,o]=i,c=0;if(n.some((t=>0!==e[t]))){for(a in d)s.o(d,a)&&(s.m[a]=d[a]);if(o)var h=o(s)}for(t&&t(i);c<n.length;c++)r=n[c],s.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return s.O(h)},i=self.webpackChunktype_project_template=self.webpackChunktype_project_template||[];i.forEach(t.bind(null,0)),i.push=t.bind(null,i.push.bind(i))})();var a=s.O(void 0,[216],(()=>s(387)));a=s.O(a)})();