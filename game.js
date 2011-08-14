
var game = {
	init:function(){
		this.hiIan();
		this.watchKeys();
		this.spriteMovement();
		this.toolbarCharacterSelect();
		this.heartBeat();
	},
	state:{
		character:'sonic',
		top:0,
		left:0,
		speed:8,
		image:{
			direction:'l',
			event:null
		}
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
	spriteMovement:function(){
		var z = this
		,sprite = $(".sprite")[0]
		,spriteImg = $(".sprite img")[0]
		,maxLeft = $(".scenelayer").width()
		,spriteWidth = $(".sprite").width()
		,animating = animatingJump = animatingDig = false
		,facing = 'l';

		this.watchKey(37,'press',function(){
			var l = $(sprite).css('left')||'0px';
			l = +(l.replace('px',''));
			l = l-z.state.speed;

			if(facing == 'l') {
				z.state.image.direction = 'l';
				z.updateSpriteImage(spriteImg,'l');
				facing = 'r';
			}
			
			if(l > 0) $(sprite).css({left:l+'px'});
		});
		this.watchKey(39,'press',function(){
			var l = $(sprite).css('left')||'0px';
			l = +(l.replace('px',''));
			l= l+z.state.speed;

			if(facing == 'r') {
				z.state.image.direction = 'r';
				z.updateSpriteImage(spriteImg,'r');
				facing = 'l';
			}
			
			if(l+spriteWidth < maxLeft) $(sprite).css({left:l+'px'});
		});
		
		this.watchKey([32,38],'down',function(){
			if(animating || animatingJump) return;
			animating = animatingJump = true;
			
			$(sprite).animate({bottom:'+=200'},800,function(){
				$(this).animate({bottom:'0'},700,function(){
					animating = animatingJump = false;
				});
			});
		});

		this.watchKey(40,'down',function(){
			if(animating||animatingDig) return;
			animating = animatingDig = true;
			
			$(sprite).animate({bottom:'-=75'},500,function(){
				z.updateSpriteImage(spriteImg,null,'dig');
				setTimeout(function(){
					$(sprite).animate({bottom:'-=50'},500,function(){
						z.updateSpriteImage(spriteImg,null,'dug');
						setTimeout(function(){
							$(sprite).animate({bottom:'-=25'},500,function(){
								$(this).animate({bottom:'+=50'},500,function(){
									animating = animatingDig = false;
									z.updateSpriteImage(spriteImg,null,'dig');
									$(this).animate({bottom:'0'},500,function(){
										z.updateSpriteImage(spriteImg,false,null);
									});
								});
							});
						});
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
			z.updateSpriteImage($(".sprite img")[0],false,false);
			$(".toolbar-character-select .character").removeClass('selected');
			$(this).addClass('selected');
		});
		
		$.each(z.characters,function(k,v){
			$(".toolbar-character-select").append('<div class="character left" data-name="'+v+'">'
				+'<img src="sprites/select_'+v+'.png" alt="'+v+'"/>'
			+'</div>');
		});
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
	updateSpriteImage:function(img,facing,event){
		if(facing) this.spriteImageState.facing = facing;
		if(event || event === null) this.spriteImageState.event = event;

		suffix = this.spriteImageState.facing=='r'?'':'_'+this.spriteImageState.facing;
		suffix += this.spriteImageState.event?'_'+this.spriteImageState.event:'';
		
		img.src = 'sprites/'+this.state.character+suffix+'.png';
	},
	artifactSprite:function(img,top,left,life){
		//create a way create artifacts related to actions both above and below the sprite
	},
	heartBeatInterval:33,
	heartBeatListeners:[],
	onBeat:function(cb){
		heartBeatListeners.push(cb);
	},
	heartBeat:function(){
		var z = this;
		setTimeout(function(){
			for(var i =0,j=z.heartBeatListeners.length;i<j;i++) {
				z.heartBeatListeners[i]();
			}
		},this.heartBeatInterval);
	}
};

$(function(){
	game.init();
});