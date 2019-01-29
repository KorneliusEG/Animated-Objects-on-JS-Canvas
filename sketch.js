var n=0;
var t1=0;
var t2=0;
var t3=0;
var t4=[];
var t5=0;
var selectedTank=0;

var aArray=[];
var myTanks=[];
var z;
var shotArray=[];

var mapHeight=1;
var mapWidth=1;

var myMap=[]; // 2D Map 
var mapDisplay; // 2D Map Graphics
var mapDivSize;
var mapXdivs=1;
var mapYdivs=1;

var xMapBias=0; // Moving the map over display
var yMapBias=0;

var objSize;
var objMatrix=[]; // Matrix of Objects' positions

var pointer = {
	x:0,
	y:0,
	size: 2,
	active: false,
	display: function(){
		if (this.size>15){
			this.active=false;
			this.size=2;
		}
		fill(0,255,0);
		strokeWeight(1);
		ellipse(this.x, this.y, this.size, this.size);
		this.size+=1;
	}
}

var text1 = document.getElementById("text1");
var text2 = document.getElementById("text2");

document.addEventListener('contextmenu', event => event.preventDefault());



function setup() {
  // put setup code here
  var cnv = createCanvas(1000, 600);
  cnv.parent("canvas-holder");
  frameRate(60);
  let a=0;

  objSize = 10;
  mapDivSize = Math.round(objSize*0.8);

  mapHeight = 1200;
  mapWidth = 2000;
 

  for (let i=0; i<25; i++){
  	for (let j=0; j<25; j++){
  		let newTankX = floor(mapWidth/26);
  		let newTankY = floor(mapHeight/26);
  		myTanks.push(new Tank(newTankX*j+50, newTankY*i+50, objSize, a));
  		a++;
  	}
  }

// Generating Matrix of Object Presence

for (let i=0; i<ceil(mapHeight/mapDivSize)+1; i++) {
	objMatrix.push([]);
	for (let j=0; j<ceil(mapWidth/mapDivSize)+1; j++){
		objMatrix[i].push(0);
	}
}



// Generating Map
	mapXdivs=ceil(mapWidth/50);
	mapYdivs=ceil(mapHeight/50);
  	for (let i=0; i<(mapYdivs+2); i++){
  		myMap.push([]);
  		for (let j=0; j<(mapXdivs+2); j++){
  			myMap[i].push(round(random(0,2)));
  		}
  	}
  	mapDisplay=createGraphics(1000,600);
  
  for (let i=0; i<mapYdivs; i++){
	for (let j=0; j<mapXdivs; j++){
		if (myMap[i][j]===2){
			mapDisplay.stroke(0);
			mapDisplay.fill(150);
			mapDisplay.rect(j*50,i*50,50,50);
			mapDisplay.fill(0);
			mapDisplay.textSize(10);
			mapDisplay.text("\n"+j*50+"\n"+i*50,j*50,i*50);
		}
	}
  }
  //fill(255);
  //rect(0,0,width, height);
  loadPixels();
} // !!!!!!!!!!!!!!!!!!!! END OF SETUP !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!





function draw() {
t1 = performance.now();


for (let i=0; i<myTanks.length; i++){
	myTanks[i].autoMove();
	myTanks[i].display();
}

if (pointer.active){pointer.display();}

updatePixels();


//Drawing Map
image(mapDisplay, 0, 0);


// Manual moving

	if (keyIsDown(DOWN_ARROW)) {
		if (myTanks[selectedTank].selected===true){
			myTanks[selectedTank].automove=false;
			myTanks[selectedTank].moveDown();
		}
	} 
	if (keyIsDown(UP_ARROW)) {
		if (myTanks[selectedTank].selected===true){
			myTanks[selectedTank].automove=false;
			myTanks[selectedTank].moveUp();
		}
	} 
	if (keyIsDown(LEFT_ARROW)) {
		if (myTanks[selectedTank].selected===true){
			myTanks[selectedTank].automove=false;
			myTanks[selectedTank].moveLeft();
		}
	} 
	if (keyIsDown(RIGHT_ARROW)) {
		if (myTanks[selectedTank].selected===true){
			myTanks[selectedTank].automove=false;
			myTanks[selectedTank].moveRight();
		}
	}

	//Random Moving
	randomDestination();
	objectManager();



	n++;
  	if (n===10){
	n=0;
	t4.push(performance.now()/1000);
	t5 = round(10/(t4[t4.length-1]-t4[t4.length-2]));
	text1.innerText = t3; //"X: "+myTanks[selectedTank].x + " Y: " + myTanks[selectedTank].y;
	text2.innerText = t5;
	}
	//text(frameRate(), 1000, 30);
  	t2 = performance.now();
  	t3 = round(t2-t1);
  	


} // END OF DRAW FUNCTION !!!


function randomDestination(){
	for (let i=0; i<myTanks.length; i++){
		 
		if (myTanks[i].selected===false){ 
			if (abs(myTanks[i].destination[0]-myTanks[i].x)<=2 && abs(myTanks[i].destination[1]-myTanks[i].y)<=2){
			myTanks[i].destination[0]+=Math.floor(random(-3,4));
			myTanks[i].destination[1]+=Math.floor(random(-2,3));
			//pointer.x = myTanks[i].destination[0];
			//pointer.y = myTanks[i].destination[1];
			//pointer.active = true;
			}
			if (myTanks[i].stomped){
				myTanks[i].destination[0]=myTanks[i].x+Math.floor(random(-3,4));
				myTanks[i].destination[1]=myTanks[i].y+Math.floor(random(-2,3));
				myTanks[i].stomped=false;
			}
		}
	}
}


function mouseClicked(){
	
}

function mousePressed(){
	if (mouseButton===LEFT){
		for (i=0; i<myTanks.length; i++){
			myTanks[i].clicked(mouseX, mouseY);
		}
	}

	if (mouseButton===RIGHT){
		pointer.x = mouseX;
		pointer.y = mouseY;
		pointer.active = true;
		for (let tank of myTanks) {
			if (tank.selected===true){
				tank.automove=true;
				tank.destination=[mouseX, mouseY]; 
			}
		}
	}
	return false;
}

function mouseDragged(){
	if (mouseButton===LEFT){
		let yDrag=pmouseY-mouseY;
		let xDrag=pmouseX-mouseX;
		yMapBias-=yDrag;
		xMapBias-=xDrag;
		if (xMapBias>50){
			xMapBias=50;
		}
		if (yMapBias>50){
			yMapBias=50;
		}
		mapUpdate();
		for (let i=0; i<myTanks.length; i++){
			if (myTanks[i].xDisp>0 && myTanks[i].yDisp>0){
				drawFilledRect(myTanks[i].xDisp, myTanks[i].yDisp, myTanks[i].size+1, myTanks[i].size+1,0);
			}
			myTanks[i].xDisp=myTanks[i].x+xMapBias;
			myTanks[i].yDisp=myTanks[i].y+yMapBias;

		}
	}
	return false;

}

function objectManager(){
	
	for (let i=0; i<objMatrix.length; i++){
		for (let j=0; j<objMatrix[i].length; j++){
			objMatrix[i][j]=0;
		}
	}

	for (let i=0; i<myTanks.length; i++){
		
		myTanks[i].qx=floor(myTanks[i].cx/mapDivSize);
		myTanks[i].qy=floor(myTanks[i].cy/mapDivSize);
		objMatrix[myTanks[i].qy][myTanks[i].qx]=myTanks[i].ID;

		if (myTanks[i].newX!=myTanks[i].x || myTanks[i].newY!=myTanks[i].y){
			myTanks[i].newX=myTanks[i].x;
			myTanks[i].newY=myTanks[i].y;
			myTanks[i].notMoving=0;
		} else {
			myTanks[i].notMoving+=1;
		}
		if (myTanks[i].notMoving>60){
			myTanks[i].stomped=true;
		}
	}

	/*for (let i=0; i<myTanks.length; i++){
		if (myTanks[i].newQx!==myTanks[i].qx || myTanks[i].newQy!==myTanks[i].qy){
			objMatrix[floor(myTanks[i].cy/10)][floor(myTanks[i].cx/10)]=1;
		}
	}*/
}

function mapUpdate(){
mapDisplay.clear();
	for (let i=0; i<mapYdivs; i++){
		for (let j=0; j<mapXdivs; j++){
			if (myMap[i][j]===2){
				mapDisplay.stroke(0);
				mapDisplay.fill(200,200,200,255);
				mapDisplay.rect(j*50+xMapBias,i*50+yMapBias,50,50);
				//mapDisplay.fill(0);
				//mapDisplay.textSize(10);
				//mapDisplay.text("\n"+j*50+"\n"+i*50,j*50+xMapBias,i*50+yMapBias);
			}
		}
  	}
}

class Tank {
	constructor(xpos, ypos, size, id){
		this.ID = id;
		this.x = xpos;
		this.y = ypos;
		this.xDisp = xpos;
		this.yDisp = ypos;

		this.newX = xpos;
		this.newY = ypos;
		this.size = size;
		this.overSize = size+2;
		this.w = 2;
		this.cx = this.x+this.size/2;
		this.cy = this.y+this.size/2;
		this.qx = floor(this.cx/mapDivSize);
		this.qy = floor(this.cy/mapDivSize);
		
		this.direction = 1;
		this.selected = false;
		this.destination=[this.x,this.y];
		this.automove=true;
		this.stomped=false;
		this.notMoving=0;
	}

	clicked(px, py){
		let distX = px-this.x;
		let distY = py-this.y;
						
			if(distX<=this.size && distY<=this.size && distX>=0 && distY>=0){
				this.selected=true;
				selectedTank = this.ID;
				console.log(selectedTank);
			} else {
				this.selected=false;
			}
		
	}

	moveUp(){
		if (this.checkIntersect(0,-1) && this.y>this.size){
			drawFilledRect(this.xDisp, this.yDisp, this.size+1, this.size+1,0);
			this.y-=1;
			this.cy-=1;
			this.yDisp-=1;
		}
	}
	moveDown(){
		if (this.checkIntersect(0,1) && this.y<mapHeight-this.overSize){
			drawFilledRect(this.xDisp, this.yDisp, this.size+1, this.size+1,0);
			this.y+=1;
			this.cy+=1;
			this.yDisp+=1;
		}
	}
	moveRight(){
		if (this.checkIntersect(1,0) && this.x<mapWidth-this.overSize){
			drawFilledRect(this.xDisp, this.yDisp, this.size+1, this.size+1,0);
			this.x+=1;
			this.cx+=1;
			this.xDisp+=1;
		}
	}
	moveLeft(){
		if (this.checkIntersect(-1,0) && this.x>this.size){
			drawFilledRect(this.xDisp, this.yDisp, this.size+1, this.size+1,0);
			this.x-=1;
			this.cx-=1;
			this.xDisp-=1;
		}
	}

	autoMove(){
		
		if (this.automove===true){
		if (this.destination[0]-this.x>=2){
			this.moveRight();
		}	else if (this.destination[0]-this.x<=-2) {
			this.moveLeft();
		}
		if (this.destination[1]-this.y>=2){
			this.moveDown();
		} else if (this.destination[1]-this.y<=-2){
			this.moveUp();
		}
	}
	}
	

	checkIntersect(moveRightLeft=0, moveUpDown=0){
		// We can do another thing. We can determine in which quadrant of the map every Tank is
		// and put this information into array myMap. Then during moving we can just check if 
		// a quadrant where we are going to move is "taken" or "busy" by another Tank or if it 
		// is forbidden to walk through
		let checkingTank=0;
		if (moveUpDown!==0){
			if (objMatrix[this.qy+moveUpDown][this.qx]!==0){
				checkingTank = objMatrix[this.qy+moveUpDown][this.qx];
				
				if (abs(this.cx-myTanks[checkingTank].cx)<this.size && abs(this.cy+moveUpDown-myTanks[checkingTank].cy)<this.size) {
					return false;
				}	
			}
			if (objMatrix[this.qy+moveUpDown][this.qx-1]!==0){
				checkingTank = objMatrix[this.qy+moveUpDown][this.qx-1];
				if (abs(this.cx-myTanks[checkingTank].cx)<this.size && abs(this.cy+moveUpDown-myTanks[checkingTank].cy)<this.size) {
					return false;
				}	
			}
			if (objMatrix[this.qy+moveUpDown][this.qx+1]!==0){
				checkingTank = objMatrix[this.qy+moveUpDown][this.qx+1];
				if (abs(this.cx-myTanks[checkingTank].cx)<this.size && abs(this.cy+moveUpDown-myTanks[checkingTank].cy)<this.size) {
					return false;
				}	
			}

		}

		if (moveRightLeft!==0){
			if (objMatrix[this.qy][this.qx+moveRightLeft]!==0){
				checkingTank = objMatrix[this.qy][this.qx+moveRightLeft];
				if (abs(this.cx+moveRightLeft-myTanks[checkingTank].cx)<this.size && abs(this.cy-myTanks[checkingTank].cy)<this.size) {
					return false;
				}	
			}
			if (objMatrix[this.qy-1][this.qx+moveRightLeft]!==0){
				checkingTank = objMatrix[this.qy-1][this.qx+moveRightLeft];
				if (abs(this.cx+moveRightLeft-myTanks[checkingTank].cx)<this.size && abs(this.cy-myTanks[checkingTank].cy)<this.size) {
					return false;
				}	
			}
			if (objMatrix[this.qy+1][this.qx+moveRightLeft]!==0){
				checkingTank = objMatrix[this.qy+1][this.qx+moveRightLeft];
				if (abs(this.cx+moveRightLeft-myTanks[checkingTank].cx)<this.size && abs(this.cy-myTanks[checkingTank].cy)<this.size) {
					return false;
				}	
			}
		}
		/*for (let i=0; i<myTanks.length; i++){
			if (i!=this.ID){
				//let r = (this.size+myTanks[i].size)/2;
				if (abs(this.cx+moveRightLeft-myTanks[i].cx)<this.size && abs(this.cy+moveUpDown-myTanks[i].cy)<this.size) {
					return false;
				}
			}
		}*/

		let xQuadrant = floor((this.x+moveRightLeft)/50);
		let yQuadrant = floor((this.y+moveUpDown)/50);
		let xQuadrant2 = floor((this.x+this.size+moveRightLeft)/50);
		let yQuadrant2 = floor((this.y+this.size+moveUpDown)/50);
		if (this.x+moveRightLeft>=0 && this.y+moveUpDown>=0){
			if (myMap[yQuadrant][xQuadrant]===2 || myMap[yQuadrant2][xQuadrant2]===2){
			return false;
			}
		}
		return true;
	}

	//Write fire function , so our tank could shoot
	fire(){

	}

	display(){
		if (this.selected===true){
			this.w=3;	// Line Width 
		} else {
			this.w=2;	// Line Width
		}
		
		if (this.xDisp>0 && this.xDisp<width-this.size && this.yDisp>0){
		drawFilledRect(this.xDisp, this.yDisp, this.size, this.size, 255);
		drawRect(this.xDisp, this.yDisp, this.size, this.size, this.w, 255);
	}
	}

}


function drawRect(xRect,yRect,rectWidth,rectHeight,lineWidth,rectAlpha){
	//drawing 2 horizontal lines of a Rectangle
	for (let k=0; k<2; k++){
		for (let i=0;i<lineWidth; i++){
			for (let j=0; j<=rectWidth*4; j+=4){
				pixels[xRect*4+j+(i+yRect+k*(rectHeight-lineWidth+1))*width*4]=0;
				pixels[xRect*4+j+(i+yRect+k*(rectHeight-lineWidth+1))*width*4+1]=0;
				pixels[xRect*4+j+(i+yRect+k*(rectHeight-lineWidth+1))*width*4+2]=0;
				pixels[xRect*4+j+(i+yRect+k*(rectHeight-lineWidth+1))*width*4+3]=rectAlpha;
			}
		}
	}
	//drawing 2 vertical lines of a Rectangle
	for (let k=0; k<2; k++){
		for (let i=0;i<rectHeight; i++){
			for (let j=0; j<lineWidth*4; j+=4){
				pixels[xRect*4+k*(rectWidth-lineWidth+1)*4+j+(i+yRect)*width*4]=0;
				pixels[xRect*4+k*(rectWidth-lineWidth+1)*4+j+(i+yRect)*width*4+1]=0;
				pixels[xRect*4+k*(rectWidth-lineWidth+1)*4+j+(i+yRect)*width*4+2]=0;
				pixels[xRect*4+k*(rectWidth-lineWidth+1)*4+j+(i+yRect)*width*4+3]=rectAlpha;
			}
		}
	}
}

function drawFilledRect(xFilledRect, yFilledRect, rectWidth, rectHeight,rectAlpha){
	if (xFilledRect>0 && yFilledRect>0 && xFilledRect<width-rectWidth+4){ // && yFilledRect<height-rectHeight
	for (let i=0; i<rectHeight; i+=1){
		for (let j=0; j<rectWidth*4; j+=4){
			pixels[xFilledRect*4+j+(i+yFilledRect)*width*4]=255;
			pixels[xFilledRect*4+j+(i+yFilledRect)*width*4+1]=255;
			pixels[xFilledRect*4+j+(i+yFilledRect)*width*4+2]=255;
			pixels[xFilledRect*4+j+(i+yFilledRect)*width*4+3]=rectAlpha;
		}
	}
}
}



