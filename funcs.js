function addVertices(args){
	var n;

	if(arguments.length == 2){
		n = new Node(arguments[0], arguments[1]);
	//	nodes.push(n);
		return n;
	}
	if(arguments.length == 6){
		var a = new Node(arguments[0], arguments[1]);
		var b = new Node(arguments[2], arguments[3]);
		var c = new Node(arguments[4], arguments[5]);
		//nodes.push(a); nodes.push(b); nodes.push(c);
		//a.connect(b); b.connect(c); a.connect(c);
		n = new Triangle(a, b, c);
		triangles.add(n);
		return n;
	}

}

function add_split(x, y){
	var t = null;
    var n = addVertices(x, y); 
    var index = null;

	var keys = Object.keys(triangles.triangles);	
	for (var i =  keys.length-1; i >= 0; i--) {
     if(isInTriangle(n, triangles.triangles[keys[i]])){
     	t = triangles.triangles[keys[i]]; index = i; break;
     }
	}
    if(t){ 
	 // n.connect(t.a);
	 // n.connect(t.b);
	 // n.connect(t.c);
	var a = t.a; 
	var b = t.b; 
	var c = t.c;

	if(n.x === a.x && n.y === a.y){return} //same point

    if(index > 0){ //dont delete supertriangle
	triangles.remove(t); 
    }

	var ta = new Triangle(n, a, b); 
	var tb = new Triangle(n, b, c); 
	var tc = new Triangle(n, a, c); 
   
	 triangles.add(ta);
	 triangles.add(tb);
	 triangles.add(tc);

   	 check(ta, a, b);
 	 check(tb, b, c);
	 check(tc, a, c);

    }
}



function check(triA, a, b){
// https://www.ti.inf.ethz.ch/ew/Lehre/CG13/lecture/Chapter%207.pdf	

	var p = triA.getOppositePoint(a, b); 
	   
	var triB = triangles.getNeighbor(triA, a, b);
	if(!triB){return}

	var d = triB.getOppositePoint(a, b); 
   
	if(isDelaunay(triA, d)){
	triA.boundary = isBoundary(triA);
	// setNeighbors(triA); 
	// setNeighbors(triB);
	return;
	}

	 triangles.remove(triA);
	 triangles.remove(triB); 
    
	 var t1 = new Triangle(p, a, d);
	 var t2 = new Triangle(p, b, d);

	 triangles.add(t1);
	 triangles.add(t2);

	 //not any faster than seperate loop
 	 // setNeighbors(triangles.getNeighbor(t1, a, p));
 	 // setNeighbors(triangles.getNeighbor(t2, b, p));

	 	 // a.disconnect(b);
	 	 // p.connect(d);

 	check(t1, a, d);
 	check(t2, b, d);
    
}


function isInTriangle(point, triangle){ 
//from: http://totologic.blogspot.fr/2014/01/accurate-point-in-triangle-test.html
var a, b, c, x, y, x1, x2, x3, y1, y2, y3;

x = point.x;
y = point.y;
x1 = triangle.a.x; 
x2 = triangle.b.x; 
x3 = triangle.c.x;
y1 = triangle.a.y; 
y2 = triangle.b.y; 
y3 = triangle.c.y;

a = ((y2 - y3)*(x - x3) + (x3 - x2)*(y - y3)) / ((y2 - y3)*(x1 - x3) + (x3 - x2)*(y1 - y3));
b = ((y3 - y1)*(x - x3) + (x1 - x3)*(y - y3)) / ((y2 - y3)*(x1 - x3) + (x3 - x2)*(y1 - y3));
c = 1 - a - b;

return ( (0 <= a && a <= 1) && (0 <= b && b <= 1) && (0 <= c && c <= 1) );

}


function circumCenter(tri){ 
// https://www.ics.uci.edu/~eppstein/junkyard/circumcenter.html
// https://en.wikipedia.org/wiki/Circumscribed_circle
var a = tri.a; var b = tri.b; var c = tri.c;

var D = (a.x - c.x) * (b.y - c.y) - (b.x - c.x) * (a.y - c.y);

var pX = (((a.x - c.x) * (a.x + c.x) + (a.y - c.y) * (a.y + c.y)) / 2 * (b.y - c.y) 
     -  ((b.x - c.x) * (b.x + c.x) + (b.y - c.y) * (b.y + c.y)) / 2 * (a.y - c.y)) / D;

var pY = (((b.x - c.x) * (b.x + c.x) + (b.y - c.y) * (b.y + c.y)) / 2 * (a.x - c.x)
     -  ((a.x - c.x) * (a.x + c.x) + (a.y - c.y) * (a.y + c.y)) / 2 * (b.x - c.x)) / D;
    
var r = dist(pX, pY, a.x, a.y);

return [pX, pY, r];    
}


function isDelaunay(tri, point){
return ((dist(tri.center.x, tri.center.y, point.x, point.y)-tri.center.r) >= 0);
}


function isBoundary(t){
return t.a === s1 || t.b === s1 || t.c === s1 || t.a === s2 || t.b === s2 || t.c === s2 || t.a === s3 || t.b === s3 || t.c === s3;
}


function setNeighbors(t){ 
var ta = triangles.getNeighbor(t, t.a, t.b);
var tb = triangles.getNeighbor(t, t.b, t.c);
var tc = triangles.getNeighbor(t, t.a, t.c);

// t.neighborA = ta;
// t.neighborB = tb;
// t.neighborC = tc;	
if(ta)
t.vA = ta.center;
if(tb)
t.vB = tb.center;
if(tc)
t.vC = tc.center;
}

function reset(){
triangles.triangles = [];
triangles.edgetriangles = [];
st = addVertices(-6000, wh+6000, ww/2, -6000, ww+6000, wh+6000);
st.boundary = true;
s1 = st.a; s2 = st.b; s3 = st.c;  
}

