//Create variables here
var dog,happyDog;
var database,foodS,foodStock;
var dogImg,happyDog;
var addFood;
var foodObj;
var lastFed;
var gameState="Hungry";
var changeSTate,readState;
var bedroom,garden,washroom;
var bedroomImg,gardenImg,washroomImg;
var deadDogImg,helloDogImg,dogVaccinateImg,stockImg,smileDogImg,smileImg,injectionImg,sadDog,livingRoomImg,milkImg,runningImg,runningLeftImg,vaccinateImg;

function preload()
{
	//load images here
  dogImg=loadImage("images/Dog.png");
  happyDog=loadImage("images/happy dog.png");
  
  bedroomImg=loadImage("images/BedRoom.png");
  gardenImg=loadImage("images/Garden.png");
  washroomImg=loadImage("images/WashRoom.png");
  livingRoomImg=loadImage("images/Living Room.png");

  sadDog=loadImage("images/Lazy.png");
  runningImg=loadImage("images/running.png");
}

function setup() {
  database=firebase.database();
	createCanvas(1000, 400);

  readState=database.ref('gameState');
  readState.on('value',function(data){
    gameState=data.val();
  });
  foodObj=new Food();
  foodStock=database.ref('Food');
  foodStock.on('value',readStock);

  dog=createSprite(800,200,10,60);
  dog.addImage(dogImg);
  dog.scale=0.15;

  addFood=createButton("ADD FOOD");
  addFood.position(900,95);
  addFood.mousePressed(addFoods);

  feed=createButton("FEED THE DOG");
  feed.position(700,95);
  feed.mousePressed(feedDog);
}


function draw() {  
  currentTime=hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  foodObj.getFoodStock();


  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }



  drawSprites();
}

function readStock(data){
foodS=data.val();
foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  var food_stock_hal = foodObj.getFoodStock();

  if(food_stock_hal <= 0){
    foodObj.updateFoodStock(food_stock_hal * 0 );
  }else{
    foodObj.updateFoodStock(food_stock_hal -1);
  }

  database.ref('/').update({
  Food:foodObj.getFoodStock(),
  FeedTime:hour()
  });
}

function addFoods(){
  foodS=foodS+1;
  database.ref('/').update({
  Food:foodS
});
}