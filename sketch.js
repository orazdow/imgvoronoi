var img, webimg;
var controls, row, urlbox, urllabel, urlbutton;
var httptry = 0;

function preload() {
  img = loadImage("sdfb.jpg");
}

function setup(){
pixelDensity(1);
noiseDetail(5, 0.3);
//background(0)
 //image(img, 0, 0);
 img.loadPixels();
 img.resize(640,0);
 createCanvas(img.width, img.height);
 initElements();
//console.log(pixels[200])
//d = pixelDensity();
//noStroke();
frameRate(30)
stroke(255)
//noStroke()
noLoop()
//var url = "https://images-na.ssl-images-amazon.com/images/I/61GX0E3wxaL._SL256_.jpg";
// httpGet(url, (data)=>{
// 	if(data){
// 	//console.log(btoa(unescape(encodeURIComponent(data))))
// 	 //  var ii = "data:image;base64,"+btoa(unescape(encodeURIComponent(data)));
// 		// webimg = loadImage(ii, ()=>{ 
// 		// 	console.log('ok');
// 		// 	//image(webimg, 0, 0);
// 		// });
// 		// image(img, 0, 0);
// 	}
// }, (err)=>{
// if(err){console.log('there was an error', err)}

// });

image(img, 0, 0);

// httpimg(url, (data, err)=>{

// if(err){
// 	console.log(err);
// }else{
// 	//console.log(data);
// 	img = loadImage(data, ()=>{
// 		image(img, 0,0);
// 	});
// }

// });

 }

function getHttpImg(url, replace){

httpimg( replace ? url.replace(/http(?!s)/, 'https') : url, (data, err)=>{

if(err != undefined){

if(httptry === 0){
httptry++;	
getHttpImg(url, true);	
}
if(httptry === 1){
httptry++;	
getHttpImg('https://crossorigin.me/'+url);	
}
if(httptry === 2){
httptry++;	
getHttpImg('https://crossorigin.me/'+url, true);	
}
}else{
	img = loadImage(data, ()=>{
		img.resize(640,0);
		resizeCanvas(img.width, img.height);
		image(img, 0,0);
	});
}

});

}

function httpimg(url, cb){
    var xhr = new XMLHttpRequest();
  //  
    //xhr.setRequestHeader('Content-type', 'application/ecmascript');
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
    //incase huge image returned
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
    	if(this.status != 200){
    		cb(null, this.status);
    	}
    }

    xhr.send();
}

function draw(){ 
	// background(0)
	// doit(img, 4, 4);

}

// function mouseMoved(){
// background(img)
// //c = get(mouseX, mouseY)
// // fill(c)
// // rect(mouseX, mouseY, 30, 30)
// var i = (mouseX + mouseY*width)*4;
// fill(pixels[i], pixels[i+1], pixels[i+2])
// rect(mouseX, mouseY, 30, 30)
// }
function doit(img, incx, incy){
	var w = img.width;
	var h = img.height;
	for(var y = 0; y < h; y+=incy){
		for (var x = 0; x < w; x+=incx) {
		var index = (y*w+x)*4;
	 if(randomGaussian(1, 0.3) - reduce(img.pixels[index], img.pixels[index+1], img.pixels[index+2]) <0.01){
	 	point(x,y);
	 }
	   // fill(img.pixels[index], img.pixels[index+1], img.pixels[index+2])
	   // rect(x, y,incx,incy)

		}
	}
}
function doit2(img, incx, incy){
	var w = img.width;
	var h = img.height;
	for(var y = 0; y < h; y+=incy){
		for (var x = 0; x < w; x+=incx) {
		var index = (y*w+x)*4;
	 // if(reduce(img.pixels[index], img.pixels[index+1], img.pixels[index+2]) > 1){
	 //	point(x,y);
	 }
	   fill(img.pixels[index], img.pixels[index+1], img.pixels[index+2])
	   rect(x, y,incx,incy)

		}
	}



function reduce(r, g, b){
	return (r/255+g/255+b/255);
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

urlbutton.mousePressed(function(){
//console.log(urlbox.value());
httptry = 0;
getHttpImg(urlbox.value());

});

}