//elements and variables
const imageLoader = document.getElementById('imageLoader');
const canvascontainer = document.getElementById('canvascontainer');
const uploadcanvas = document.getElementById('uploadedimagecanvas');
const uploadcontext = uploadcanvas.getContext('2d');
const uploadedimagecontainer = document.getElementById('uploadedimagecontainer');

const uploadcontainer = document.getElementById('uploadcontainer');

const controls = document.getElementById('controls');
const sliders = document.getElementById('sliders');
const blocksize = document.getElementById('blocksize');
const usecolor = document.getElementById('usecolor');
const inputcolor = document.getElementById('inputcolor');
const colorpicker = document.getElementById('colorpicker');
const colorpickerlabel = document.getElementById('colorpickerlabel');
const shufflebtn = document.getElementById('paletteshuffle');

const buttons = document.getElementById('buttons');
const saveimg = document.getElementById('save');
const deleteimg = document.getElementById('deletebtn');
const startmintbtn = document.getElementById('startmintbtn');

const modalcross = document.getElementById('modalcross');
const loader = document.getElementById('loadercontainer');
const loaded = document.getElementById('loader');
const loaderanimation = document.getElementById('animation');
const installmetamask = document.getElementById('installmetamask');
const changenetwork = document.getElementById('changenetwork');
const details = document.getElementById('details');
const connectwallet = document.getElementById('connectwallet');
const approvemint = document.getElementById('approvemint');
const approvemint2 = document.getElementById('approvemint2');
const success = document.getElementById('success');
const success2 = document.getElementById('success2');

const retrymint = document.getElementById('retrymint');
const retrylazymint = document.getElementById('retrylazymint');
const startover = document.getElementById('startover');
const retryover = document.getElementById('retryover');

var uploadimgdata;
var filename;
var ihex;
var ohsl;
var harr = [];
var sarr = [];
var larr = [];
var hues = [];
var shades = [];
var neutrals = [];
var harrbaseindex;
var sarrbaseindex;
var larrbaseindex;
var paletteset = [];
var paletteindex = [];
var customset = [];
var custompalette = [];
var huessetindex;
var shadessetindex;
var huestartindex;
var shadestartindex;
var customstartindex;
var finalpalette = [];

//conversionfunctions
function rgbtohsl(r, g, b) {

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;
  
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
  
    h /= 6;
  }
  
  return {h: h, s: s, l: l};
}
  
function hsltorgb(h, s, l) {
  var r, g, b;
  
  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }
  
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
  
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return { r: r, g: g, b: b };
}
  
function rgbtohex(r, g, b) {
  r*= 255;
  r = Math.round(r);
  g*= 255;
  g = Math.round(g);
  b*= 255;
  b = Math.round(b);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
  
function hsltohex(h, s, l){
  var rgb = hsltorgb(h,s,l);
  var r = rgb.r;
  var g = rgb.g;
  var b = rgb.b;
  var hex = rgbtohex(r, g, b);
  return hex;
}
  
function hextohsl(hex){
  var rgb = hextorgb(hex);
  var r = rgb.r;
  var g = rgb.g;
  var b = rgb.b;
  var hsl = rgbtohsl(r, g, b);
  return hsl;
}
  
function hextorgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16)/255,
    g: parseInt(result[2], 16)/255,
    b: parseInt(result[3], 16)/255
  } : null;
}
  

//functions

function shuffle(array) {
  var i = array.length,
      j = 0,
      temp;

  while (i--) {

      j = Math.floor(Math.random() * (i+1));

      // swap randomly chosen element with current element
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;

  }

  return array;
}

function randomInteger(min, max) {  
  min = Math.ceil(min); 
  max = Math.floor(max); 
  return Math.floor(Math.random() * (max - min + 1)) + min; 
}

function goldenratio(h){
  const g = 0.618033988749895;
  var grarr = [];
  for (let i=0; i<65; i++){
    grarr[i] = h;
    h+= g;
    h%= 1;
  }
  grarr.sort(function(a, b){return a-b});
  return grarr;
}

function applycolor(){
  const check = usecolor.checked;
  if(check == true){
    generateuploadimage(uploadcanvas, uploadcontext, uploadimgdata);
  }else{
    drawuploadimage(uploadcanvas, uploadcontext, uploadimgdata);
  }
}

function init(){

  ihex = inputcolor.value;
  colorpicker.value = rgbtohex(hextorgb(ihex).r, hextorgb(ihex).g, hextorgb(ihex).b);
  colorpickerlabel.style.backgroundColor = colorpicker.value;

  var orgb = hextorgb(ihex);
  ohsl = rgbtohsl(orgb.r, orgb.g, orgb.b);

  harr = goldenratio(ohsl.h);
  sarr = goldenratio(ohsl.s);
  larr = goldenratio(ohsl.l);

  for(let i=0; i<65; i++){
    if(harr[i] == ohsl.h){harrbaseindex = i;}
  }
  for(let i=0; i<65; i++){
    if(sarr[i] == ohsl.s){sarrbaseindex = i;}
  }
  for(let i=0; i<65; i++){
    if(larr[i] == ohsl.l){larrbaseindex = i;}
  }

 for(let j=0; j<65; j++){
   hues[j] = [];
  for(let i=0; i<65; i++){
    hues[j][i] = hsltohex(harr[i], ohsl.s, larr[j]);
  }
 }

 for(let j=0; j<65; j++){
  shades[j] = [];
  for(let i=0; i<65; i++){
    shades[j][i] = hsltohex(harr[j], ohsl.s, larr[i]);
  }
 }

huessetindex = larrbaseindex;
shadessetindex = harrbaseindex;

huestartindex = harrbaseindex;
shadestartindex = larrbaseindex;
customstartindex = harrbaseindex;

for(let i=0; i<65; i++){
  neutrals[i] = hsltohex(ohsl.h, 0, larr[i]);
}

generatepalette();

}

function generatepalette(){
  var harmony = randomInteger(1, 3);
  var gap = randomInteger(1, 6);

  if(harmony == 1){
    var x = shadestartindex;
    var y = gap;
    if(y==1){if(x>27){x=27;}}
    if(y==2){if(x>22){x=22;}}
    if(y==3){if(x>17){x=17;}}
    if(y==4){if(x>12){x=12;}}
    if(y==5){if(x>7){x=7;}}
    if(y==6){if(x>2){x=2;}}
    paletteset = shades[shadessetindex];
    paletteindex = [x, (x + y), (x + 2*y), (x + 3*y), (x + 4*y), (x + 5*y)];

    finalpalette = [paletteset[paletteindex[0]], paletteset[paletteindex[1]], paletteset[paletteindex[2]], paletteset[paletteindex[3]], paletteset[paletteindex[4]], paletteset[paletteindex[5]]];
  }

  if(harmony == 2){
    var x = huestartindex;
    var y = gap;
    paletteset = hues[huessetindex];
    paletteindex = [x%64, (x + y)%64, (x + 2*y)%64, (x + 3*y)%64, (x + 4*y)%64, (x + 5*y)%64];

    finalpalette = [paletteset[paletteindex[0]], paletteset[paletteindex[1]], paletteset[paletteindex[2]], paletteset[paletteindex[3]], paletteset[paletteindex[4]], paletteset[paletteindex[5]]];
  }

  if(harmony == 3){
    customset[0] = [];
    customset[1] = [];
    customset[2] = [];
    var x = customstartindex;
    var y = (x + 4)%33;
    var z = (x + 16)%33;

    if(larrbaseindex<8){
      customset[0] = hues[larrbaseindex];
      customset[1] = hues[larrbaseindex+8];
      customset[2] = hues[larrbaseindex+16];
      custompalette = [customset[0][x], customset[1][x], customset[0][y], customset[1][y], customset[0][z], customset[1][z]];
    }
    else if(larrbaseindex>24){
      customset[0] = hues[larrbaseindex-16];
      customset[1] = hues[larrbaseindex-8];
      customset[2] = hues[larrbaseindex];
      custompalette = [customset[2][x], customset[1][x], customset[2][y], customset[1][y], customset[2][z], customset[1][z]];
    }
    else if(larrbaseindex>=8 && larrbaseindex<=24){
      customset[0] = hues[larrbaseindex+8];
      customset[1] = hues[larrbaseindex];
      customset[2] = hues[larrbaseindex-8];
      custompalette = [customset[1][x], customset[0][x], customset[1][y], customset[0][y], customset[2][z], customset[1][z]];
    }
    finalpalette = custompalette;
  }
  

  document.getElementById('color1label').style.backgroundColor = finalpalette[0];
  document.getElementById('color2label').style.backgroundColor = finalpalette[1];
  document.getElementById('color3label').style.backgroundColor = finalpalette[2];
  document.getElementById('color4label').style.backgroundColor = finalpalette[3];
  document.getElementById('color5label').style.backgroundColor = finalpalette[4];
  document.getElementById('color6label').style.backgroundColor = finalpalette[5];

  applycolor();
  
}

function shufflepalette(){
  shadestartindex = randomInteger(0,64);
  huestartindex = randomInteger(0,64);
  customstartindex = randomInteger(0,64);
  
  generatepalette();
}

function generateuploadimage(cvs, ctx, imgdata){

  ctx.clearRect(0, 0, cvs.width, cvs.height);
  drawuploadimage(cvs, ctx, imgdata);
  
  var imageData = ctx.getImageData(0, 0, cvs.width, cvs.height);
  var data = imageData.data;

  var hslpixels = [];
  for (var i = 0; i < data.length; i+= 4) {
    hslpixels[i/4] = rgbtohsl(data[i]/255, data[i+1]/255, data[i+2]/255);
  }
  
  var hslfinalpalette = [];
  for (var i = 0; i < finalpalette.length; i++) {
    hslfinalpalette[i] = hextohsl(finalpalette[i]);
  }
  var hfinalpalette = [];
  for (var i = 0; i < hslfinalpalette.length; i++) {
    hfinalpalette[i] = hslfinalpalette[i].h;
  }
  hfinalpalette.sort(function(a, b){return a-b});

  var sfinalpalette = [];
  for (var i = 0; i < hslfinalpalette.length; i++) {
    sfinalpalette[i] = hslfinalpalette[i].s;
  }
  sfinalpalette.sort(function(a, b){return a-b});

  var lfinalpalette = [];
  for (var i = 0; i < hslfinalpalette.length; i++) {
    lfinalpalette[i] = hslfinalpalette[i].l;
  }
  lfinalpalette.sort(function(a, b){return a-b});
  
  var avgpixell = 0;
  for (var i = 0; i < hslpixels.length; i++) {
    avgpixell += hslpixels[i].l;
  }
  avgpixell /= hslpixels.length;

  var avgpalettel = 0;
  for (var i = 0; i < hslfinalpalette.length; i++) {
    avgpalettel += hslfinalpalette[i].l;
  }
  avgpalettel /= hslfinalpalette.length;

  var r = avgpalettel/avgpixell;

  var avgpalettes = 0;
  for (var i = 0; i < hslfinalpalette.length; i++) {
    avgpalettes += hslfinalpalette[i].s;
  }
  avgpalettes /= hslfinalpalette.length;
  
  var avgpixels = 0;
  for (var i = 0; i < hslpixels.length; i++) {
    avgpixels += hslpixels[i].s;
  }
  avgpixels /= hslpixels.length;
  
  var s = avgpalettes/avgpixels;

  for (var i = 0; i < hslpixels.length; i++) {
      hslpixels[i].h *= (hfinalpalette[5] - hfinalpalette[0]);
      hslpixels[i].h += hfinalpalette[0];
      if(hslpixels[i].h <= (hfinalpalette[0] + hfinalpalette[1])/2){hslpixels[i].h = hfinalpalette[0];}
      else if((hfinalpalette[0] + hfinalpalette[1])/2 < hslpixels[i].h && hslpixels[i].h <= (hfinalpalette[1] + hfinalpalette[2])/2){hslpixels[i].h = hfinalpalette[1];}
      else if((hfinalpalette[1] + hfinalpalette[2])/2 < hslpixels[i].h && hslpixels[i].h <= (hfinalpalette[2] + hfinalpalette[3])/2){hslpixels[i].h = hfinalpalette[2];}
      else if((hfinalpalette[2] + hfinalpalette[3])/2 < hslpixels[i].h && hslpixels[i].h <= (hfinalpalette[3] + hfinalpalette[4])/2){hslpixels[i].h = hfinalpalette[3];}
      else if((hfinalpalette[3] + hfinalpalette[4])/2 < hslpixels[i].h && hslpixels[i].h <= (hfinalpalette[4] + hfinalpalette[5])/2){hslpixels[i].h = hfinalpalette[4];}
      else if((hfinalpalette[4] + hfinalpalette[5])/2 < hslpixels[i].h && hslpixels[i].h <= hfinalpalette[5]){hslpixels[i].h = hfinalpalette[5];}

      if(hslpixels[i].s!=0){
        hslpixels[i].s *= (sfinalpalette[5] - sfinalpalette[0]);
        hslpixels[i].s += sfinalpalette[0];
        if(hslpixels[i].s <= (sfinalpalette[0] + sfinalpalette[1])/2){hslpixels[i].s = sfinalpalette[0];}
        else if((sfinalpalette[0] + sfinalpalette[1])/2 < hslpixels[i].s && hslpixels[i].s <= (sfinalpalette[1] + sfinalpalette[2])/2){hslpixels[i].s = sfinalpalette[1];}
        else if((sfinalpalette[1] + sfinalpalette[2])/2 < hslpixels[i].s && hslpixels[i].s <= (sfinalpalette[2] + sfinalpalette[3])/2){hslpixels[i].s = sfinalpalette[2];}
        else if((sfinalpalette[2] + sfinalpalette[3])/2 < hslpixels[i].s && hslpixels[i].s <= (sfinalpalette[3] + sfinalpalette[4])/2){hslpixels[i].s = sfinalpalette[3];}
        else if((sfinalpalette[3] + sfinalpalette[4])/2 < hslpixels[i].s && hslpixels[i].s <= (sfinalpalette[4] + sfinalpalette[5])/2){hslpixels[i].s = sfinalpalette[4];}
        else if((sfinalpalette[4] + sfinalpalette[5])/2 < hslpixels[i].s && hslpixels[i].s <= sfinalpalette[5]){hslpixels[i].s = sfinalpalette[5];}
      }
  }

  for (var i = 0; i < data.length; i+= 4) {
    var rgb = hsltorgb(hslpixels[i/4].h, hslpixels[i/4].s, hslpixels[i/4].l);
    data[i] = Math.round(rgb.r*255);
    data[i+1] = Math.round(rgb.g*255);
    data[i+2] = Math.round(rgb.b*255);
  }

  ctx.putImageData(imageData, 0, 0);
}

function drawuploadimage(cvs, ctx, idata){

    ctx.clearRect(0, 0, cvs.width, cvs.height);

    var sample_size = parseInt(blocksize.value);
    for (let y = 0; y < cvs.height; y += sample_size) {
      for (let x = 0; x < cvs.width; x += sample_size) {
        let p = (x + (y*cvs.width)) * 4;
        ctx.fillStyle = "rgba(" + idata.data[p] + "," + idata.data[p + 1] + "," + idata.data[p + 2] + "," + idata.data[p + 3] + ")";
        ctx.fillRect(x, y, sample_size, sample_size);
      }
    }
   
    idata = ctx.getImageData(0, 0, cvs.width, cvs.height);

    //cvs.width = 800;
    //cvs.height = 800;
    ctx.putImageData(idata, 0, 0);
}

function readeronload(event){
    var image = new Image();
    image.src = event.target.result;
    image.onload = function(){
      var w = image.width;
      var h = image.height;
      
      uploadcanvas.width = 800;
      uploadcanvas.height = (h/w)*800;
      
      uploadcontext.drawImage(image, 0, 0, uploadcanvas.width, uploadcanvas.height);
      uploadimgdata = uploadcontext.getImageData(0, 0, uploadcanvas.width, uploadcanvas.height);

      uploadedimagecontainer.style.display = 'block';
      buttons.style.display = 'block';
      uploadcontainer.style.display = 'none';
      applycolor();
    }
  }

function handleImage(e){
    filename = imageLoader.files[0].name;
    var type = imageLoader.files[0].type;
    var size = imageLoader.files[0].size / 1024 / 1024;

    var reader = new FileReader();
    reader.onload = function(event){
    readeronload(event);
    }
    reader.readAsDataURL(e.target.files[0]);    
}



//logic
window.addEventListener('load', init);
imageLoader.addEventListener('change', handleImage, false);
imageLoader.onclick = function () {
  this.value = null;
};

blocksize.onchange = () => {
  applycolor();
}

usecolor.onchange = () => {
  applycolor();
}
document.getElementById('colorsubmit').onclick = () => {
  init();
}
colorpicker.onchange = () => {
  inputcolor.value = colorpicker.value;
  init();
}
shufflebtn.onclick = () => {
  shufflepalette();
}

//saving
saveimg.onclick = () => {
  const url = uploadcanvas.toDataURL();
  console.log(url);
  const link = saveimg;
  link.href = url;
  link.target = "_blank";
  link.download = "pixelated_image.png";
}

//deleting
deleteimg.onclick = () => {
  uploadcontext.clearRect(0, 0, uploadcanvas.width, uploadcanvas.height);
  uploadedimagecontainer.style.display = 'none';
  uploadcontainer.style.display = 'block';
  buttons.style.display = 'none';
}

//sliders
  
var isChanging = false;
  
function setCSSProperty(x){
  const percent =
    ((x.value - x.min) / (x.max - x.min)) * 100;
    x.style.setProperty("--webkitProgressPercent", `${percent}%`);
}

function handleMove(x){
  if (!isChanging) return;
  setCSSProperty(x);
}
function handleUpAndLeave(){isChanging = false;}
function handleDown(){isChanging = true;}

blocksize.onmousemove = () => {handleMove(blocksize)};
blocksize.onmousedown = () => {handleDown()};
blocksize.onmouseup = () => {handleUpAndLeave()};
blocksize.onmouseleave = () => {handleUpAndLeave()};
blocksize.onclick = () => {setCSSProperty(blocksize)};


setCSSProperty(blocksize);


//Minting logic
startmintbtn.onclick = () => {
  document.getElementById('modal').style.display = 'block';
  reset();
  login();
  document.getElementById('flexcontainer').style.overflowY = "hidden";
}
startover.onclick = () => {
  reset();
  login();
}
retrymint.onclick = () => {
  reset();
  mint();
}
retrylazymint.onclick = () => {
  reset();
  lazymint();
}
retryover.onclick = () => {
  reset();
  login();
}
modalcross.onclick = () => {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('flexcontainer').style.overflowY = "";
}

const serverUrl = "https://xr5ctimypvdb.usemoralis.com:2053/server";
const appId = "bWhkMUsRqSQDvD7pxi41zuPTbpqTNz4l4JZJt2ns";
Moralis.start({ serverUrl, appId });

/*Moralis.initialize("66gAbHfrnRHkjofXJwjAy4QNbj1TmSbC5cEFQq5e");
Moralis.serverURL = "https://qhv3d9jdemwl.usemoralis.com:2053/server";*/

const nft_contract_address = "0x434ab39fd72cc9f2a452920f4ca358e334d7839a" //NFT Minting Contract Use This One "Batteries Included", code of this contract is in the github repository under contract_base for your reference.
/*
Available deployed contracts
Ethereum Rinkeby 0x85b643f2aa972b6937d29e362a89db821cc9f409
Ethereum Mainnet 0x434ab39fd72cc9f2a452920f4ca358e334d7839a
*/

const web3 = new Web3(window.ethereum);
var chainID;
var network;

//frontend logic
function setWeb3Environment(){
  getNetwork();
  monitorNetwork();
}
async function getNetwork(){
  chainID = await web3.eth.net.getId();
  network = getNetworkName(chainID);
  console.log(network);
  if(network !== "Ethereum Mainnet"){
    changenetwork.style.display = "block";
    retryover.style.display = "block";
  }else{
    details.style.display = "block";
  }
}
async function getNetworkmint(){
  chainID = await web3.eth.net.getId();
  network = getNetworkName(chainID);
  console.log(network);
  if(network !== "Ethereum Mainnet"){
    changenetwork.style.display = "block";
    details.style.display = "none";
    retrymint.style.display = "block";
    startover.style.display = "block";
  }else{
    details.style.display = "none";
    connectwallet.style.display = "block";
    loader.style.display = "block";

    Moralis.Web3.authenticate({ signingMessage: "Non Fungible Pixels Authentication" }).then(
      async function (user){
        console.log(user);
        connectwallet.style.display = "none";
        approvemint.style.display = "block";
        loaded.style.width = "66%";
  
        const base64url = uploadcanvas.toDataURL();
        const imageFile = new Moralis.File(filename, { base64: base64url });
        await imageFile.saveIPFS();
        const imageURI = imageFile.ipfs();
        console.log(imageURI);
        const metadata = {
          "name":document.getElementById("name").value,
          "description":document.getElementById("description").value,
          "image":imageURI
        }
        const metadataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
        await metadataFile.saveIPFS();
        const metadataURI = metadataFile.ipfs();
        console.log(metadataURI);

        const txt = await mintToken(metadataURI).then(
          notify,
          (onRejected) => {
            document.getElementById('approvemintsubheading').innerHTML = "Something went wrong while minting! Don't worry, your artwork is still intact."
            document.getElementById('approvemintsubheading').style.color = "#FF1818";
            document.getElementById('approvemintsubheading').style.fontWeight = "500";
            loaderanimation.style.display = "none";
            document.getElementById('approvemintill').style.display = "none";
            retrymint.style.display = "block";
            startover.style.display = "block";
          }
        );
    }, 
    (onRejected) => {
      document.getElementById('connectwalletsubheading').innerHTML = "Sign in request was cancelled. Please retry to continue minting your NFT."
      document.getElementById('connectwalletsubheading').style.color = "#FF1818";
      document.getElementById('connectwalletsubheading').style.fontWeight = "500";
      loaderanimation.style.display = "none";
      document.getElementById('connectwalletill').style.display = "none";
      retrymint.style.display = "block";
      startover.style.display = "block";
    }
  );

  }
}
async function getNetworklazymint(){
  chainID = await web3.eth.net.getId();
  network = getNetworkName(chainID);
  console.log(network);
  if(network !== "Ethereum Mainnet"){
    changenetwork.style.display = "block";
    details.style.display = "none";
    retrylazymint.style.display = "block";
    startover.style.display = "block";
  }else{
    details.style.display = "none";
    connectwallet.style.display = "block";
    loader.style.display = "block";

    Moralis.Web3.authenticate({ signingMessage: "Non Fungible Pixels Authentication" }).then(
      async function (user){
        console.log(user);
        connectwallet.style.display = "none";
        approvemint2.style.display = "block";
        loaded.style.width = "66%";
  
        const base64url = uploadcanvas.toDataURL();
        const imageFile = new Moralis.File(filename, { base64: base64url });
        await imageFile.saveIPFS();
        const imageURI = imageFile.ipfs();
        console.log(imageURI);
        const metadata = {
          "name":document.getElementById("name").value,
          "description":document.getElementById("description").value,
          "image":imageURI
        }
        const metadataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
        await metadataFile.saveIPFS();
        const metadataURI = metadataFile.ipfs();
        console.log(metadataURI);

        let res = await Moralis.Plugins.rarible.lazyMint({
          chain: 'eth',
          userAddress: user.get('ethAddress'),
          tokenType: 'ERC721',
          tokenUri: metadataURI,
        }).then(
          notify2,
          (onRejected) => {
            document.getElementById('approvemint2subheading').innerHTML = "Something went wrong while minting! Don't worry, your artwork is still intact."
            document.getElementById('approvemint2subheading').style.color = "#FF1818";
            document.getElementById('approvemint2subheading').style.fontWeight = "500";
            loaderanimation.style.display = "none";
            document.getElementById('approvemint2ill').style.display = "none";
            retrylazymint.style.display = "block";
            startover.style.display = "block";
          }
        );

    }, 
    (onRejected) => {
      document.getElementById('connectwalletsubheading').innerHTML = "Sign in request was cancelled. Please retry to continue minting your NFT."
      document.getElementById('connectwalletsubheading').style.color = "#FF1818";
      document.getElementById('connectwalletsubheading').style.fontWeight = "500";
      loaderanimation.style.display = "none";
      document.getElementById('connectwalletill').style.display = "none";
      retrylazymint.style.display = "block";
      startover.style.display = "block";
    }
  );
  }
}
function getNetworkName(chainid){
  networks = {
    1: "Ethereum Mainnet",
    4: "Ethereum Rinkeby",
    97: "Binance Smart Chain Testnet",
    80001: "Polygon Mumbai Testnet"
  }
  return networks[chainid];
}
async function monitorNetwork(){
  Moralis.onChainChanged(function(){
    console.log('chain changed');
  })
}


async function login(){
  if (typeof web3 !== 'undefined') {
    console.log('web3 is enabled');
    if(web3.currentProvider !== null){
      if (web3.currentProvider.isMetaMask === true) {
        await getNetwork();
      }else{
        console.log('MetaMask is not available');
        installmetamask.style.display = "block";
      }
    }else{
      console.log('No provider found');
      installmetamask.style.display = "block";
    }
  }else {
    console.log('web3 is not found');
  }
}

async function mint(){
  if (typeof web3 !== 'undefined') {
    console.log('web3 is enabled');
    if(web3.currentProvider !== null){
      if (web3.currentProvider.isMetaMask === true) {
        await getNetworkmint();
      } else {
        console.log('MetaMask is not available');
        installmetamask.style.display = "block";
      }
    } else{
      console.log('No provider found');
      installmetamask.style.display = "block";
    }
  } else {
    console.log('web3 is not found');
  }
}


async function lazymint(){
  if (typeof web3 !== 'undefined') {
    console.log('web3 is enabled');
    if(web3.currentProvider !== null){
      if (web3.currentProvider.isMetaMask === true) {
        await getNetworklazymint();
      } else {
        console.log('MetaMask is not available');
        installmetamask.style.display = "block";
      }
    } else{
      console.log('No provider found');
      installmetamask.style.display = "block";
    }
  } else {
    console.log('web3 is not found');
  }
}

async function mintToken(_uri){
  const encodedFunction = web3.eth.abi.encodeFunctionCall({
    name: "mintToken",
    type: "function",
    inputs: [{
      type: 'string',
      name: 'tokenURI'
      }]
  }, [_uri]);

  const transactionParameters = {
    to: nft_contract_address,
    from: ethereum.selectedAddress,
    data: encodedFunction
  };
  const txt = await ethereum.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters]
  });

  const info = {
    useradd: ethereum.selectedAddress,
    txn: txt,
  }

  return info
}

async function notify(info){
  approvemint.style.display = "none";
  success.style.display = "block";

  loaded.style.width = "100%";
  loaded.style.backgroundColor = "#3AECB7";
  loaderanimation.style.display = "none";

  document.getElementById("resultspace").innerHTML = "Transaction ID: " + info.txn;
  document.getElementById("checkonetherscananchor").href = "https://etherscan.io/tx/" + info.txn;
  document.getElementById("checkonopenseaanchor").href = "https://opensea.io/" + info.useradd + "?tab=created";
  document.getElementById('checkonraribleanchor').href = "https://rarible.com/user/" + info.useradd + "/created";
} 

async function notify2(res){
  approvemint2.style.display = "none";
  success2.style.display = "block";

  loaded.style.width = "100%";
  loaded.style.backgroundColor = "#3AECB7";
  loaderanimation.style.display = "none";

  document.getElementById('checkonrarible2anchor').href = "https://rarible.com/token/" + res.data.result.tokenAddress + ":" + res.data.result.tokenId;
} 

function reset(){
  installmetamask.style.display = "none";
  changenetwork.style.display = "none";
  details.style.display = "none";
  connectwallet.style.display = "none";
  approvemint.style.display = "none";
  approvemint2.style.display = "none";
  success.style.display = "none";
  success2.style.display = "none";
  loader.style.display = "none";
  loaded.style.width = "33%";
  loaded.style.backgroundColor = "#EC603A";
  loaderanimation.style.display = "block";
  document.getElementById("resultspace").innerHTML = "";

  document.getElementById('connectwalletsubheading').innerHTML = "Please approve the sign in request from your Metamask Wallet."
  document.getElementById('connectwalletsubheading').style.color = "#1A171D";
  document.getElementById('connectwalletsubheading').style.fontWeight = "400";
  
  document.getElementById('approvemintsubheading').innerHTML = "Please confirm mint request from your Metamask Wallet."
  document.getElementById('approvemintsubheading').style.color = "#1A171D";
  document.getElementById('approvemintsubheading').style.fontWeight = "400";
  document.getElementById('approvemint2subheading').innerHTML = "Please confirm mint request from your Metamask Wallet."
  document.getElementById('approvemint2subheading').style.color = "#1A171D";
  document.getElementById('approvemint2subheading').style.fontWeight = "400";

  document.getElementById('connectwalletill').style.display = "block";
  document.getElementById('approvemintill').style.display = "block";
  document.getElementById('approvemint2ill').style.display = "block";
  retrymint.style.display = "none";
  retrylazymint.style.display = "none";
  startover.style.display = "none";
  retryover.style.display = "none";

  document.getElementById('checkonrarible2anchor').href = "";
  document.getElementById("checkonetherscananchor").href = "";
  document.getElementById("checkonopenseaanchor").href = "";
  document.getElementById('checkonraribleanchor').href = "";
}