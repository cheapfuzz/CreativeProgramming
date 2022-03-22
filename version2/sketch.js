
let video; //connect webcam to the sketch
let model; // face sees machine learning model
let face; //face detection
let painting, photo, drawin
let maskL, maskR, maskC
let o1, o2, o3

function preload()
{
photo = loadImage('assets/photo.jpg')
painting = loadImage('assets/painting.jpg')
drawin = loadImage('assets/handDigital.jpg')
maskL = loadImage('assets/maskCrackL.png')
maskR = loadImage('assets/maskCrackR.png')
maskC = loadImage('assets/maskCrackT.png')
o1 = loadImage('assets/MCLOverlay.png')
o2 = loadImage('assets/MCROverlay.png')
o3 = loadImage('assets/MCTOverlay.png')
}
 
function setup() {
 createCanvas(640,480);
 
video = createCapture(VIDEO); //create the video capture
video.size(640,480); //resolution, lower it for less performance issues
video.hide(); //hides second video that might appear on screen

o1.resize(maskL.width+5, maskL.height)
o2.resize(maskR.width+5, maskR.height)
o3.resize(maskC.width+5, maskC.height)
drawin.mask(maskL)
photo.mask(maskC)
painting.mask(maskR)

while(!tf.ready()) {
 // this while-loop will just repeat until
 // everything is ready for us
}
 
console.log('loading model...');
loadFaceModel(); //load model in asynchronous function
 
}
 
async function loadFaceModel(){
 model = await faceLandmarksDetection.load(
   faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
   {maxFaces: 1} //tracks only 1 face
 );
 console.log('...done!');
}
 
function draw() {
 //if the face has data attached to it, print to the console in draw
if(video.loadedmetadata && model !== undefined) {
 getFace();
}
 
if (face!== undefined) {
 //open console.log to see arrays and points
 //  console.log(face);
 //  noLoop();
 
 image(video, 0,0,width,height);
 
 
 //white dots on the face for map
 noFill();
 noStroke();
 for (let pt of face.scaledMesh) {
   pt = scalePoint(pt);
   circle(pt.x, pt.y, 3);
 }
 
 endShape(CLOSE);
 
 //cheek test
 let leftCheek = scalePoint(face.annotations.leftCheek[0]);
 let rightCheek = scalePoint(face.annotations.rightCheek[0]);
 
 //between eyes test
 let midwayBetweenEyes = scalePoint(face.annotations.midwayBetweenEyes[0]);
 
 //bounding box to scale size forwards and backwards
 let topLeft = scalePoint(face.boundingBox.topLeft);
 let bottomRight = scalePoint(face.boundingBox.bottomRight);
 let w = bottomRight.x = topLeft.x;
 let dia = w/3; //change this number to change the size of the shape

 //draw the shape: cheeks
 imageMode(CENTER)
 image(drawin, leftCheek.x+20, leftCheek.y, dia, dia);
 image(o1, leftCheek.x+20, leftCheek.y-15, dia+5, dia)
 image(painting, rightCheek.x-10, rightCheek.y, dia, dia)
 image(o2, rightCheek.x-10, rightCheek.y-9, dia, dia-8)
 imageMode(CORNER)

 //draw the shape: between eyes
 imageMode(CENTER)
 image(photo, midwayBetweenEyes.x, midwayBetweenEyes.y/1.3, dia+10, dia/1.3);
 image(o3, midwayBetweenEyes.x, midwayBetweenEyes.y/1.3, dia+10, dia/1.3);
 imageMode(CORNER)
}
}
//convert coordinates from video to canvas
function scalePoint(pt){
 let x = map(pt[0], 0,video.width, 0,width);
 let y = map(pt[1], 0,video.height, 0,height);
return createVector(x,y);
}
 
//get the face
async function getFace(){
 const predictions = await model.estimateFaces({
   input: document.querySelector('video')
 
 });
 if (predictions.length === 0){
   face = undefined;
  }
 else{
   face = predictions[0];
 }
}

