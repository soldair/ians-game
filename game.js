
var game = {
	init:function(){
		//direct
		this.hiIan();
		this.watchKeys();
		this.spriteMovement();
		this.toolbarCharacterSelect();
		
		//on beats
		this.applyMovement();
		this.positionSprite();
		this.updateSpriteImage();

		// activate heartbeat
		this.heartBeat();
	},
	state:{
		character:'sonic',
		top:0,
		left:0,
		speed:8,
		image:{
			direction:'r',
			event:null
		},
		keys:{}
	},
	hiIan:function(){
		$(".field").click(function(){
			$(this).append("<h1>HI IAN!!!!!!</h1>");
				var z = this;
				setTimeout(function(){
				$(z).find("h1").fadeOut(function(){
					$(this).remove();
				});
			},4000);
		});
	},
	positionSprite:function(){
		var z = this
		,sprite = $(".sprite")
		,lastLeft;
		
		z.onBeat(function(){
			if(lastLeft != z.state.left) {
				$(sprite).css('left',z.state.left+'px');
				lastLeft = z.state.left;
			}
		});
	},
	applyMovement:function(){
		var z = this
		,spriteWidth = $(".sprite").width()
		,maxLeft = $(".scenelayer").width();
		
		z.onBeat(function(){
			if(z.state.keys.left && z.state.keys.right) {
				return;
			} else if (z.state.keys.left) {
				var l = z.state.left-z.state.speed;
				if(l > 0) z.state.left = l;
			} else if(z.state.keys.right){
				var l = z.state.left+z.state.speed;
				if(l+spriteWidth < maxLeft) z.state.left = l;
			}
		});
	},
	spriteMovement:function(){
		var z = this
		,sprite = $(".sprite")[0]
		,spriteImg = $(".sprite img")[0]
		,animating = animatingJump = animatingDig = false;

		this.watchKey(37,'down',function(){
			z.state.image.direction = 'l';
			z.state.keys.left = 1;
		});
		this.watchKey(39,'down',function(){
			z.state.keys.right = 1;
			z.state.image.direction = 'r';
		});

		this.watchKey(37,'up',function(){
			z.state.keys.left = 0;
		});
		this.watchKey(39,'up',function(){
			z.state.keys.right = 0;
		});
		
		//jumping
		this.watchKey([32,38],'down',function(){
			if(animating || animatingJump) return;
			animating = animatingJump = true;
			
			$(sprite).animate({bottom:'+=200'},800,function(){
				$(this).animate({bottom:'0'},700,function(){
					animating = animatingJump = false;
				});
			});
		});

		//digging
		this.watchKey(40,'down',function(){
			if(animating||animatingDig) return;
			animating = animatingDig = true;
			
			$(sprite).animate({bottom:'-=75'},500,function(){
				z.state.image.event = 'dig';
				setTimeout(function(){
					$(sprite).animate({bottom:'-=50'},500,function(){
						z.state.image.event = 'dug';
						setTimeout(function(){
							$(sprite).animate({bottom:'-=25'},500,function(){
								$(this).animate({bottom:'+=50'},500,function(){
									animating = animatingDig = false;
									z.state.image.event = 'dig';
									$(this).animate({bottom:'0'},500,function(){
										z.state.image.event = null;
									});
								});
							});
						},200);
					});
				},200);
			});
		});
	},
	characters:['sonic','tales','knuckles'],
	toolbarCharacterSelect:function(){
		var z = this;
		// init characters
		$(".toolbar-character-select .character").live('click',function(){
			z.state.character = $(this).attr('data-name');

			$(".toolbar-character-select .character").removeClass('selected');
			$(this).addClass('selected');
		});
		
		$.each(z.characters,function(k,v){
			$(".toolbar-character-select").append('<div class="character left" data-name="'+v+'">'
				+'<img src="sprites/select_'+v+'.png" alt="'+v+'"/>'
			+'</div>');
		});
		
		$(".toolbar-character-select .character[data-name="+z.state.character+"]").addClass('selected');
	},
	watchers:{},
	watchKeys:function(){
		var z = this
		,fn = function(ev){
			var code = ev.which||ev.keyCode
			,type = ev.type.replace('key','');
					
			if(z.watchers[code] && z.watchers[code][type]) {
				$.each(z.watchers[code][type],function(k,cb){
					cb(ev,type);
				});
			}
		};

		$(document).bind('keydown',fn);
		$(document).bind('keyup',fn);
		$(document).bind('keypress',fn);
	},
	watchKey:function(key,type,cb){
		if(key instanceof Array) {
			var z = this;
			$.each(key,function(k,v){z.watchKey(v,type,cb)});
			return;
		}
		if(!this.watchers[key]) this.watchers[key] = [];
		if(!this.watchers[key][type]) this.watchers[key][type] = [];
		this.watchers[key][type].push(cb);
	},
	spriteImageState:{
		facing:'l',
		event:null
	},
	updateSpriteImage:function(){
		var z = this
		,img = $(".sprite img")[0];
		
		z.onBeat(function(){
			var src = z.state.image.direction=='r'?'':'_'+z.state.image.direction;
			src += z.state.image.event?'_'+z.state.image.event:'';
			src = 'sprites/'+z.state.character+src+'.png'
			if(img.src != src) {
				img.src = src;
			}
		});
	},
	artifactSprite:function(img,top,left,life){
		//create a way create artifacts related to actions both above and below the sprite
	},
	heartBeatInterval:28,
	heartBeatListeners:[],
	onBeat:function(cb){
		this.heartBeatListeners.push(cb);
	},
	heartBeat:function(){
		var z = this
		,interval;
		
		interval = setInterval(function(){
			try{
				for(var i =0,j=z.heartBeatListeners.length;i<j;i++) {
					z.heartBeatListeners[i]();
				}
			} catch(e) {
				clearInterval(interval);
				console.warn("ERROR in heartbeat. stopping interval");
				console.error(e);
			}
		},this.heartBeatInterval);
	}
};

$(function(){
	game.init();
});