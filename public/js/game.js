var GAME = {
	loadBoard: function () {
		
		var wrap = $('<div></div>')
		
		var giveUp = $('<button id="give_up">Give Up</button>');
		giveUp.addClass('horizontal-centered button');
		giveUp.on('click', function() {
			env.peer.destroy();
			loadHome();
		});
		
		var board = $('<div id="graphics" style="width: 1220px; height: 800px"><canvas id="background" width="1220" height="800" style="position: absolute; margin-left: 0px; margin-top: 0px"></canvas><canvas id="foreground" width="1220" height="800" style="position: absolute; margin-left: 0px; margin-top: 0px"></canvas></div>');
		
		wrap.append(board);
		wrap.append(giveUp);
		
		var placeholder = $('<div></div>');
		
		placeholder.attr('id', 'placeholder');
		placeholder.attr('style', 'height: 70px; text-align: center;');
		
		$("#content").append(placeholder);
		
		$("#content").append(wrap);
		
		//$("#content").append(giveUp);
		//$("#content").append(board);
		
		var canvas = $("#background")[0];
		env.game.background = canvas;
		
		var context = $("#background")[0].getContext("2d");
		env.game.contextBackground = context;
			
		var side = 40;
		
		var boardWidth = 32 * Math.sin(Math.PI / 3.0) * side;
		
		var curPoint = new Point((canvas.width - boardWidth) / 2.0, 
								 canvas.height - (canvas.height - 17 * side) / 2.0 - 1.5 * side);
		
		env.game.hexs = [];
		
		for (var j = 0; j < 11; j++) {
			var row = [];
			var tmp = new Point(curPoint.x, curPoint.y);
			for (var i = 0; i < 11; i++) {
				row.push(new Hexagone(tmp, side));
				tmp = new Point(2 * Math.sin(Math.PI / 3.0) * side + tmp.x, tmp.y);
			}
			env.game.hexs.push(row);
			curPoint = new Point(Math.sin(Math.PI / 3.0) * side + curPoint.x, curPoint.y - 1.5 * side);
		}
		
		for (var i = 0; i < env.game.hexs.length; i++) {
			for (var j = 0; j < env.game.hexs[i].length; j++) {
				if (i === 0) {
					if (j === 0) {
						env.game.hexs[i][j].draw(context, ['green', 'red', 'red', 'black', 'black', 'green']);
					}
					else if (j === 10) {
						env.game.hexs[i][j].draw(context, ['black', 'red', 'red', 'green', 'black', 'black']);
					}
					else {
						env.game.hexs[i][j].draw(context, ['black', 'red', 'red', 'black', 'black', 'black']);
					}
				}
				else if (i === 10) {
					if (j === 0) {
						env.game.hexs[i][j].draw(context, ['green', 'black', 'black', 'black', 'red', 'red']);
					}
					else if (j === 10) {
						env.game.hexs[i][j].draw(context, ['black', 'black', 'green', 'green', 'red', 'red']);
					}
					else {
						env.game.hexs[i][j].draw(context, ['black', 'black', 'black', 'black', 'red', 'red']);
					}
				}
				else if (j === 0) {
					env.game.hexs[i][j].draw(context, ['green', 'black', 'black', 'black', 'black', 'green']);
				}
				else if (j === 10) {
					env.game.hexs[i][j].draw(context, ['black', 'black', 'green', 'green', 'black', 'black']);
				}
				else {
					env.game.hexs[i][j].draw(context);
				}
			}
		}
		
		var info = $('<h3></h3>');
		info.text('Connect the ' + ((env.myId === 0) ? 'red' : 'green') + ' sides');
		placeholder.append(info);
		
		var foreground = $("#foreground")[0];
		var contextForeground = foreground.getContext("2d");
		env.game.contextForeground = contextForeground;
		env.game.foreground = foreground;
		
		$("#foreground").mousemove(function (event) {
			//console.log(event.offsetX + ":" + event.offsetY);
			if (!env.game.myTurn) {
				return;
			}
			env.game.contextForeground.clearRect(0, 0, foreground.width, foreground.height);
			for (var i = 0; i < 11; i++) {
				for (var j = 0; j < 11; j++) {
					if (env.game.hexs[i][j].contains(new Point(event.offsetX, event.offsetY)) && env.game.hexs[i][j].owner === undefined) {
						//console.log(i + ":" + j);
						
						env.game.hexs[i][j].drawFilled(env.game.contextForeground, env.game.myColors[1]);
						
						
						//contextForeground.beginPath();
						//contextForeground.arc(hexs[i][j].center.x, hexs[i][j].center.y, 0.7 * Math.sin(Math.PI / 3.0) * side, 0, 2 * Math.PI, false);
						//contextForeground.fillStyle = (my == 0) ? 'red' : 'green';
						//contextForeground.fill();
					}
				}
			}
		});
		
		$("#foreground").click(function() {

			if (!env.game.myTurn) {
				return;
			}
			
			for (var i = 0; i < 11; i++) {
				for (var j = 0; j < 11; j++) {
					if (env.game.hexs[i][j].contains(new Point(event.offsetX, event.offsetY)) && env.game.hexs[i][j].owner === undefined) {
						console.log(i + ":" + j);
						
						env.game.myTurn = false;
						
						env.game.hexs[i][j].owner = env.myId;
						
						GAME.makeMove(i, j);
						
						var isFin = GAME.isFinal(i, j);
						if (isFin !== undefined) {
							if (isFin === env.myId) {
								loadVictory();
								return;
							}
							if (isFin !== 2) {
								loadLoss();
								return;
							}
						}
						
						
						env.game.hexs[i][j].drawFilled(env.game.contextBackground, env.game.myColors[0]);
						
						//context.beginPath();
						//context.arc(hexs[i][j].center.x, hexs[i][j].center.y, 0.7 * Math.sin(Math.PI / 3.0) * side, 0, 2 * Math.PI, false);
						//context.fillStyle = (my == 0) ? 'red' : 'green';
						//context.fill();
						
						env.game.contextForeground.clearRect(0, 0, env.game.foreground.width, env.game.foreground.height);
						
						return;
					}
				}
			}
		});
		
		/*
		$("#foreground").mousemove(function (event) {
			//console.log(event.offsetX + ":" + event.offsetY);
			if (!myTurn) {
				return;
			}
			contextForeground.clearRect(0, 0, foreground.width, foreground.height);
			for (var i in hexs) {
				for (var j in hexs[i]) {
					if (env.game.hexs[i][j].contains(new Point(event.offsetX, event.offsetY)) && game.hexs[i][j].owner === undefined) {
						console.log(i + ":" + j);
						contextForeground.beginPath();
						contextForeground.arc(hexs[i][j].center.x, hexs[i][j].center.y, 0.7 * Math.sin(Math.PI / 3.0) * side, 0, 2 * Math.PI, false);
						contextForeground.fillStyle = (my == 0) ? 'red' : 'green';
						contextForeground.fill();
					}
				}
			}
		})*/
	},
	
	makeMove: function (i, j) {
		env.peer.send(JSON.stringify({
			action: 'move',
			data: {i: i, j: j}
		}));
	},
	
	getHex: function(i, j) {
		if (i >= 0 && i < 11 && j >= 0 && j < 11) {
			return [i, j];
		}
	},
	
	getNeighboursC: function(i, j) {
		var res = [];
		var tmp;
		
		tmp = GAME.getHex(i-1,j);
		if (tmp != undefined) {
			res.push(tmp);	
		}
	
		tmp = GAME.getHex(i+1,j);
		if (tmp != undefined) {
			res.push(tmp);
		}
		
		tmp = GAME.getHex(i,j-1);
		if (tmp != undefined) {
			res.push(tmp);
		}
		
		tmp = GAME.getHex(i,j+1);
		if (tmp != undefined) {
			res.push(tmp);
		}
		
		tmp = GAME.getHex(i+1,j-1);
		if (tmp != undefined) {
			res.push(tmp);
		}
		
		tmp = GAME.getHex(i-1,j+1);
		if (tmp != undefined) {
			res.push(tmp);
		}
		
		var tmp = [];
		for (var k in res) {
			if (env.game.hexs[res[k][0]][res[k][1]].owner === env.game.hexs[i][j].owner) {
				tmp.push(res[k]);
			}
		}
			
		return tmp;
	},
	
	getNeighboursH: function(i, j) {
		var nei = GAME.getNeighboursC(i, j);
		var res = [];
		for (var i in nei) {
			res.push(env.game.hexs[nei[i][0]][nei[i][1]]);
		}
		return res;
	},
	
	spread: function(i, j) {
		var cur = env.game.hexs[i][j];
		var nei = GAME.getNeighboursC(i, j);
		for (var k in nei) {
			var n = env.game.hexs[nei[k][0]][nei[k][1]];
			if (cur.down && !n.down) {
				n.down = true;
				GAME.spread(nei[k][0], nei[k][1]);
			}
			if (cur.up && !n.up) {
				n.up = true;
				GAME.spread(nei[k][0], nei[k][1]);
			}
			if (cur.left && !n.left) {
				n.left = true;
				GAME.spread(nei[k][0], nei[k][1]);
			}
			if (cur.right && !n.right) {
				n.right = true;
				GAME.spread(nei[k][0], nei[k][1]);
			}
		}
	},
	
	isFinal: function(i, j) {
		var cur = env.game.hexs[i][j];
		if (cur.owner === 0) {
			if (i === 0) {
				cur.down = true;
			}
			if (i === 10) {
				cur.up = true;
			}
			
			var nei = GAME.getNeighboursH(i, j);
			
			for (var k in nei) {
				if (nei[k].down) {
					cur.down = true;
				}
				if (nei[k].up) {
					cur.up = true;
				}
			}
			
			if (cur.down && cur.up) {
				return 0;
			}
			GAME.spread(i, j);
		}
		if (cur.owner === 1) {
			if (j === 0) {
				cur.left = true;
			}
			if (j === 10) {
				cur.right = true;
			}
			
			var nei = GAME.getNeighboursH(i, j);
			
			for (var k in nei) {
				if (nei[k].left) {
					cur.left = true;
				}
				if (nei[k].right) {
					cur.right = true;
				}
			}
			
			if (cur.left && cur.right) {
				return 1;
			}
			GAME.spread(i, j);
		}
	},
	
	startTimer: function () {
		var placeholder = $("#placeholder");
		
		var timer = $('<span id="timer"></span>');
		timer.addClass("horizontal-centered");
		timer.append($('<h4>Make your move in <span id="left"></span> seconds!</h4>'));
		
		env.game.expiration = (new Date().getTime()) + 20100;
		
		placeholder.append(timer);
		
		function tmp() {
			var now = new Date().getTime();
			var left = Math.floor((env.game.expiration - now) / 1000);
			if (!env.game.myTurn) {
				$("#timer").remove();
				return;
			}
			if (left < 0) {
				env.game.contextForeground.clearRect(0, 0, env.game.foreground.width, env.game.foreground.height);
				GAME.makeMove(-1, -1);
				env.game.myTurn = false;
				$("#timer").remove();
				return;
			}
			$("#left").text(left.toString());
			setTimeout(tmp, 500);
		}
		
		tmp();
		
	}
	
}