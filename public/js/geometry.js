function Point(x, y) {
	this.x = x;
	this.y = y;
	
	this.toStandartSystem = function() {
		return new Point(this.x, -this.y);
	};
	
	this.inPositiveDirection = function(other) {
		var tmp1 = this.toStandartSystem();
		var tmp2 = other.toStandartSystem();
		return tmp1.x * tmp2.y - tmp2.x * tmp1.y > 0;
	};
	this.clone = function() {
		return new Point(this.x, this.y);
	};
	this.translate = function(vect) {
		return new Point(this.x + vect.x, this.y + vect.y);
	};
	this.anchor = function(p) {
		return new Point(this.x - p.x, this.y - p.y);
	};
}

function Hexagone(leftPoint, side) {
	this.leftPoint = leftPoint;
	this.side = side;
	
	this.sides = [];
	
	var v1 = new Point(0, side);
	var v2 = new Point(Math.sin(Math.PI / 3.0) * side, side / 2.0);
	var v3 = new Point(Math.sin(Math.PI / 3.0) * side, -side / 2.0);
	
	var v4 = new Point(0, -side);
	var v5 = new Point(-Math.sin(Math.PI / 3.0) * side, -side / 2.0);
	var v6 = new Point(-Math.sin(Math.PI / 3.0) * side, side / 2.0);
	
	var tmp = this.leftPoint.clone();
	this.sides.push({start: tmp, vect: v1});
	
	tmp = tmp.translate(v1);
	this.sides.push({start: tmp, vect: v2});
	
	tmp = tmp.translate(v2);
	this.sides.push({start: tmp, vect: v3});
	
	tmp = tmp.translate(v3);
	this.sides.push({start: tmp, vect: v4});
	
	tmp = tmp.translate(v4);
	this.sides.push({start: tmp, vect: v5});
	
	tmp = tmp.translate(v5);
	this.sides.push({start: tmp, vect: v6});
	
	this.drawFilled = function(context, color) {
		context.beginPath();
		context.moveTo(this.sides[0].start.x, this.sides[0].start.y);
		for (var i = 0; i < 5; i++) {
			context.lineTo(this.sides[i].start.x + this.sides[i].vect.x,
						   this.sides[i].start.y + this.sides[i].vect.y);
		}
		context.closePath();
		context.fillStyle = color;
		context.fill();
	};
	
	this.draw = function(context, colors) {
		if (colors === undefined) {
			var v1 = new Point(0, side);
			var v2 = new Point(Math.sin(Math.PI / 3.0) * side, side / 2.0);
			var v3 = new Point(Math.sin(Math.PI / 3.0) * side, -side / 2.0);
			var v4 = new Point(0, -side);
			var v5 = new Point(-Math.sin(Math.PI / 3.0) * side, -side / 2.0);
			
			var curX = this.leftPoint.x;
			var curY = this.leftPoint.y;
			
			context.beginPath();
			context.moveTo(curX, curY);
			
			curX = curX + v1.x;
			curY = curY + v1.y;
			
			context.lineTo(curX, curY);
			
			curX = curX + v2.x;
			curY = curY + v2.y;
			
			context.lineTo(curX, curY);
			
			curX = curX + v3.x;
			curY = curY + v3.y;
			
			context.lineTo(curX, curY);
			
			curX = curX + v4.x;
			curY = curY + v4.y;
			
			context.lineTo(curX, curY);
			
			curX = curX + v5.x;
			curY = curY + v5.y;
			
			context.lineTo(curX, curY);
			
			context.closePath();
			context.strokeStyle = 'black';
			context.lineWidth = 1;
			context.stroke();
		}
		else {
			for (var i = 0; i < this.sides.length; i++) {
				var cur = this.sides[i];
				context.beginPath();
				context.moveTo(cur.start.x, cur.start.y);
				context.lineTo(cur.start.x + cur.vect.x, cur.start.y + cur.vect.y);
				context.strokeStyle = colors[i];
				if (colors[i] !== 'black') {
					context.lineWidth = 5;
				}
				else {
					context.lineWidth = 1;
				}
				context.stroke();
			}
		}
		
	};
	
	this.contains = function(point) {
		
		for (var i in this.sides) {
			var curSide = this.sides[i];
			if (!curSide.vect.inPositiveDirection(point.anchor(curSide.start))) {
				return false;
			}
		}
		
		return true;
	};
	
	this.center = new Point(this.leftPoint.x + Math.sin(Math.PI / 3.0) * side, this.leftPoint.y + side / 2.0);	
}