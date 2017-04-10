
function Node(x, y){

this.x = x;
this.y = y;
this.label = ++labels;

this.connect = function(node){   
edges.add(this, node);
}

this.disconnect = function(node){  
edges.remove(this, node);
}

this.getEdge = function(node){
return edges.get(this, node);	
}	
	
}


function Triangle(nodea, nodeb, nodec){
	this.a = nodea;
	this.b = nodeb;
	this.c = nodec;	
	this.boundary = false;

this.updateCenter = function(){
	var circ = circumCenter(this);
	this.center = {x: circ[0], y: circ[1], r: circ[2]};	
}

this.updateCenter();

this.hasEdge = function(a, b){
	var rtn = false;	
	if(this.a === a || this.b === a || this.c === a){
		if(this.a === b || this.b === b || this.c === b){
			rtn = true;
		}
	}	return rtn;
}

this.getOppositePoint = function(a, b){
	if(this.a !== a && this.a !== b){
		return this.a;
	}
    else if(this.b !== a && this.b !== b){
		return this.b;
	}
	else if(this.c !== a && this.c !== b){
		return this.c;
	}
	else{ return null; }		
}

}


function EdgeTable(){

this.edges = {};

this.add = function(a, b){
 var key =  a.label <= b.label ? a.label+' '+b.label : b.label+' '+a.label;
 this.edges[key] = {a: a, b: b};
}

this.get = function(a, b){
 var key =  a.label <= b.label ? a.label+' '+b.label : b.label+' '+a.label;	
 return this.edges[key];
}

this.remove = function(a, b){
 var key =  a.label <= b.label ? a.label+' '+b.label : b.label+' '+a.label;
 delete this.edges[key];	
}

}

//can lookup triangles or pairs by edge
function TriangleTable(){
this.triangles = {};
this.edgetriangles = {};

//hashes triangle and all edge combinations
this.add = function(t){
var key = t.a.label+','+t.b.label+','+t.c.label;   
this.triangles[key] = t;

var edgekeys = [
t.a.label+','+t.b.label, t.b.label+','+t.c.label, t.a.label+','+t.c.label,
t.b.label+','+t.a.label, t.c.label+','+t.b.label, t.c.label+','+t.a.label
];
 
for (var i = 0; i < edgekeys.length; i++) {
 if(this.edgetriangles[edgekeys[i]] === undefined){ 
  this.edgetriangles[edgekeys[i]] = []; }	
}
for (var i = 0; i < edgekeys.length; i++){
  	if(this.edgetriangles[edgekeys[i]].length < 2)
  	this.edgetriangles[edgekeys[i]].push(t);
}
  
}

//returns triangle or triangle array depending on arguments
this.get = function(t, b){
if(!b){
var key = t.a.label+','+t.b.label+','+t.c.label;   
 return this.triangles[key];
  }else{
    var key = t.label+','+b.label;
     return this.edgetriangles[key];
  }
}
//returns neighbor opposite ab   
this.getNeighbor = function(t, a, b){
	var key = a.label+','+b.label;
	var a = this.edgetriangles[key];
	for (var i = a.length-1; i >= 0; i--) {
		if(a[i] !== t){
			return a[i];
		}
	}
}
//unhashes triangle
this.remove = function(t){
var key = t.a.label+','+t.b.label+','+t.c.label;   
delete this.triangles[key];  

var edgekeys = [
t.a.label+','+t.b.label, t.b.label+','+t.c.label, t.a.label+','+t.c.label,
t.b.label+','+t.a.label, t.c.label+','+t.b.label, t.c.label+','+t.a.label
];

for (var i = 0; i < edgekeys.length; i++) {
if(this.edgetriangles[edgekeys[i]])	
for (var j = this.edgetriangles[edgekeys[i]].length; j >= 0; j--) {
	if(this.edgetriangles[edgekeys[i]][j] === t){ 
	this.edgetriangles[edgekeys[i]].splice(j, 1); break;}	 
 }
}
}


}
