var triangles = new TriangleTable();
var labels = 0;
var ww = 700;
var wh = 700;
var view = 0;
var st, s1, s2, s3;

var nodes = [];
var nodelimit = 15000;
var band = 1.75; 
var varience = 0.15;
var thresh = 0.00012;
var inc = 1;
var power = 2;
var seednoise = false;
// var nopt = 0;
var img;
var c;

function preload() {
  img = loadImage("sdf.jpg");
}

function setup(){
img.resize(640,0);
img.loadPixels();
c = createCanvas(img.width, img.height);
initElements();
stroke(255)
noLoop()
//image(img, 0, 0);
background(0)
drawDots();
}

function draw(){ 

}

function display(){ 
background(0);
noFill();
for(key in triangles.triangles){
var t = triangles.triangles[key]
if(view === 1){setNeighbors(t)}
if(!t.boundary){
	if(view === 0 || view === 2){
	stroke(255);
	// fill(t.center.r)
     triangle(t.a.x, t.a.y, t.b.x, t.b.y, t.c.x, t.c.y); 
     }
     if(view === 1 || view === 2){
	stroke(255, 0, 0);
	// ellipse(t.center.x, t.center.y, t.center.r*2, t.center.r*2)
	 line(t.center.x, t.center.y, t.vA.x, t.vA.y);
	 line(t.center.x, t.center.y, t.vB.x, t.vB.y);
	 line(t.center.x, t.center.y, t.vC.x, t.vC.y);
	 }
}
}

}

function drawDots(){
	background(0);
	stroke(255);
	if(seednoise){randomSeed(99);}
	doit(img, inc, inc);
	nodelabel.html('node count: '+nodes.length);
	if(nodes.length > nodelimit){
	 nodelabel.style('background-color', 'red');	
	}else{
	 nodelabel.style('background-color', 'transparent');	
	}
}

function buildDelaunay(){
	if(nodes.length < nodelimit){
	for (var i = 0; i < nodes.length; i++) {
		add_split(nodes[i].x, nodes[i].y);
	}  
	}
}

// function buildRandom(arr){
// var end = arr.length-1;
// while(end >= 0){
// var index = Math.floor(Math.random()*end+1);
// var val = arr[index];
// arr[index] = arr[end]
// arr[end] = val;
// end--;
// add_split(val.x, val.y);
// }
// }

function buildfunc(){
if(nodes.length < nodelimit){	
statuslabel.html('building...');
window.setTimeout(function(){
reset();
buildDelaunay();
background(0);
display();	
statuslabel.html('');
}, 50);
}
}

function doit(img, incx, incy){
	nodes = [];
	var w = img.width;
	var h = img.height;
	for(var y = 0; y < h; y+=incy){
		for (var x = 0; x < w; x+=incx) {
		var index = (y*w+x)*4;
	 if((pow(randomGaussian(band, varience) - reduce(img.pixels[index], img.pixels[index+1], img.pixels[index+2]), power) < thresh)){
	 	point(x,y);
	 	nodes.push({x:x, y:y});
	 }

    }
	
 }
	
}

// function noiseOpts(i, type){
// 	if(type == 0){
// 	return random(varience)+band;	
// 	}
// 	else if(type == 1){
// 	return rando(i)*varience+band;
// 	}
// 	else if(type == 2){
// 	return randomGaussian(band, varience);	
// 	}
// 	// else if(type == 1){
// 	// return (cos(i*i)*varience)+band;
// 	// }
// }

function rando(i) {
    var x = Math.sin(i) * 10000;
    return x - Math.floor(x);
}

function reduce(r, g, b){
	return (r/255+g/255+b/255);
}


function getHttpImg(url, cb){

httpimg( url, (data, err)=>{
if(err != undefined){
     cb();
}else{
	img = loadImage(data, ()=>{
		img.resize(640,0);
		img.loadPixels();
		resizeCanvas(img.width, img.height);
		background(0);
		drawDots();
	});
}
});

}

function httpimg(url, cb){
    var xhr = new XMLHttpRequest();
    
    xhr.open('GET', url ,true);	
    xhr.responseType = 'arraybuffer';
    // xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
    // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');

    xhr.onload = function()
    {
    var arr = new Uint8Array(this.response);
    var str = ''; 
    var len = arr.length;
    var index = 0; 
    var chunk = 32000;
    //in case huge image returned
    while(index < len){  
    str += String.fromCharCode.apply(null, arr.slice(index, index+chunk));
    index += chunk;
     } 
    var b64=btoa(str);
    var dataURL="data:image;base64,"+b64;  
    cb(dataURL);
    }

    xhr.onerror = function(){
    cb(null, this.status);
    }
    xhr.onreadystatechange = function(){
    	if(this.status === 403 || this.status === 413 || this.status === 500){
    		requestlabel.html('request was denied by server:');
    	}
    }	

    xhr.send();
}

function makeRequest(){
requestlabel.html('');
getHttpImg(urlbox.value(), function(err){


	getHttpImg(urlbox.value().replace(/http(?!s)/, 'https'), function(err){
	
		           //so wrong....
		getHttpImg('https://crossorigin.me/'+urlbox.value(), function(err){
				
								//:(
					getHttpImg('https://crossorigin.me/'+urlbox.value().replace(/http(?!s)/, 'https'), function(err){
						
							requestlabel.html('request was denied by server:');
						
			});				
				
		});

		   
	});
	
});
}


function initElements(){
document.querySelector('#defaultCanvas0').style.float = 'left';
document.querySelector('#defaultCanvas0').style.display = 'inline-block';

controls = createDiv('');
controls.style('margin', '5px');
controls.style('padding', '4px');
controls.style('display', 'inline-block');
controls.style('margin-left', '15px');

urllabel = createDiv('enter image url:');
urllabel.parent(controls);

row = createDiv('');
row.parent(controls);
row.style('width', '100%');

urlbox = createInput('');
urlbox.parent(row);
urlbox.style('width', '200px');

urlbutton = createButton('get image');
urlbutton.parent(row);

row2 = createDiv('');
row2.parent(controls);
row2.style('width', '100%');

requestlabel = createDiv('');
requestlabel.parent(row2);

urlbutton.mousePressed(function(){
	makeRequest();
});

row3 = createDiv('');
row3.parent(controls);
row3.style('width', '100%');

droplabel = createDiv('drag and drop file:');
droplabel.parent(row3);
droplabel.style('margin-top', '3px');

droparea = createDiv('');
droparea.parent(row3);
droparea.style('height', '20px');
droparea.style('border', '0.5px dotted black');
droparea.dragOver(function(){
	this.style('background-color', '#dbdbdb');
});
droparea.dragLeave(function(){
	this.style('background-color', 'transparent');
});
droparea.drop(function(file){
	img = loadImage(file.data, ()=>{
		img.resize(640,0);
		img.loadPixels();
		resizeCanvas(img.width, img.height);
		background(0)
		drawDots();
	});	droparea.style('background-color', 'transparent');
});
droparea.style('margin-bottom', '10px')

controls1 = createDiv('');
controls1.parent(controls);
controls1.style('width', '100%')

bandlabel = createDiv('band:');
bandlabel.style('float', 'left');
bandlabel.parent(controls1)

bandslider = createSlider(0, 3, band, 0.01);
bandslider.style('margin-left', '15px');
bandslider.style('margin-right', '15px');
bandslider.style('float', 'left');
bandslider.parent(controls1);

bandvallabel = createDiv(band);
bandvallabel.parent(controls1);
bandvallabel.style('float', 'left');

bandslider.input(function(){
band = bandslider.value();
bandvallabel.html(band);
drawDots();
});

controls2 = createDiv('');
controls2.parent(controls);
controls2.style('width', '100%')
controls2.style('clear', 'both')

varlabel = createDiv('varience:')
varlabel.parent(controls2);
varlabel.style('float', 'left');

varslider = createSlider(0.001, 1, varience, 0.01);
varslider.style('margin-left', '15px');
varslider.style('margin-right', '15px');
varslider.style('float', 'left');
varslider.parent(controls2);

varvallabel = createDiv(varience);
varvallabel.parent(controls2);
varvallabel.style('float', 'left');

varslider.input(function(){
varience = varslider.value();
varvallabel.html(varience);
drawDots();
});

controls3 = createDiv('');
controls3.parent(controls);
controls3.style('width', '100%')
controls3.style('clear', 'both')

threshlabel = createDiv('threshold:')
threshlabel.parent(controls3);
threshlabel.style('float', 'left');

threshslider = createSlider(0.000001, 0.0008, thresh, 0.00001);
threshslider.style('margin-left', '15px');
threshslider.style('margin-right', '15px');
threshslider.style('float', 'left');
threshslider.parent(controls3);

threshvallabel = createDiv(thresh);
threshvallabel.parent(controls3);
threshvallabel.style('float', 'left');

threshslider.input(function(){
thresh = threshslider.value();
threshvallabel.html(thresh);
drawDots();
});

controls8 = createDiv('');
controls8.parent(controls);
controls8.style('width', '100%');
controls8.style('clear', 'both');

nodelabel = createDiv('node count:')
nodelabel.parent(controls8);
nodelabel.style('float', 'left');


seedcheck = createCheckbox('seed noise');
seedcheck.parent(controls8);
seedcheck.style('float', 'left');
seedcheck.style('margin-left', '7px');
seedcheck.changed(function(){
seednoise = !seednoise;	
})

controls9 = createDiv('');
controls9.parent(controls);
controls9.style('width', '100%');
controls9.style('clear', 'both');
controls9.style('padding-top', '5px')
controls9.style('padding-bottom', '5px')

buildbutton = createButton('build diagram');
buildbutton.parent(controls9);
buildbutton.style('float', 'left');
// buildbutton.style('margin-left', '7px');
buildbutton.mousePressed(function(){
buildfunc();
});


savebutton = createButton('save');
savebutton.parent(controls9);
savebutton.style('float', 'left');
 savebutton.style('margin-left', '4px');
savebutton.mousePressed(function(){
 saveCanvas(c);
});

statuslabel = createDiv('');
statuslabel.parent(controls9);
statuslabel.style('float', 'left');
statuslabel.style('margin-left', '6px');

controls10 = createDiv('');
controls10.parent(controls);
controls10.style('width', '100%');
controls10.style('clear', 'both');
controls10.style('padding-top', '7px');

viewlabel = createDiv('view:');
viewlabel.parent(controls10);
viewlabel.style('float', 'left');

delcheck = createCheckbox('delaunay', true);
delcheck.parent(controls10);
delcheck.changed(function(){
vorcheck.checked(!this.checked());
view = 0; 
display();
});
delcheck.style('float', 'left');

vorcheck = createCheckbox('voronoi', false);
vorcheck.parent(controls10);
vorcheck.changed(function(){
delcheck.checked(!this.checked());
view = 1; 
display();
});
vorcheck.style('float', 'left');
}