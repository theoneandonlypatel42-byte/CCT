//TO DO LIST BEFORE SUBMISSION:

//CENTER LOSE SCREEN TEXT
//MAKE SURE ALL THE MAPS WORK FINE 
//ADD AUDIO OR SMTH FOR THE LOSE SCREEN


const backgroundMusic = new Audio("GamePlay.mp3");
const eatSound = new Audio("eat.wav");


let currentLevel = 1;
let gameStarted = false;
//check the 2 and 3 tilemaps to make sure no ghosts are getting stuck and add sounds, and check over code and show Mr.D and maybe add the speed thing and make it so it continues even if the person is alive on level 3
function startGame() {

    backgroundMusic.loop = true;
    backgroundMusic.currentTime = 0;
    backgroundMusic.volume = 0.3;
    backgroundMusic.play();

    gameStarted = true;

    document.getElementById("startMenu").style.display = "none";
    document.getElementById("board").style.display = "block";
    document.getElementById("winScreen").classList.add("hidden");

    loadMap1();
    resetPositions(); 
    update();
}

document.getElementById('startGame').onclick = startGame; //starts the game

//board
let board;

//height - 21, width - 19
const rowCount = 21;
const colCount = 19;
const tileSize = 32;
const boardWidth = colCount * tileSize;
const boardHeight = rowCount * tileSize;
let context; //holds the canvas's drawing API and can be accessed globally
//images
let blueGhostImage;
let orangeGhostImage;
let pinkGhostImage;
let redGhostImage;
let pacmanUpImage;
let pacmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;
let wallImage;

// X = wall, O = skip, P = pacman, 'blank' = food
//Ghosts = b = blue ghost, p = pink ghost, o = orange ghost, r = red ghost
// this is the layout of the board
const tileMap1 = [
"XXXXXXXXXXXXXXXXXXX",
"X        X        X",
"X XXXX   X   XXXX X",
"X                 X",
"X XXXX XXXXX XXXX X",
"X                 X",
"XXXX XXXX XXXX XXXX",
"X        X        X",
"X XXXX   r   XXXX X",
"X       bpo       X",
"X XXX   XXX   XXX X",
"X        X        X",
"XXX  XXXX XXXX  XXX",
"X                 X",
"X XXXX   X   XXXX X",
"X        P        X",
"X XXXX XXXXX XXXX X",
"X                 X",
"X        X        X",
"X                 X",
"XXXXXXXXXXXXXXXXXXX"
];

const tileMap2 = [
"XXXXXXXXXXXXXXXXXXX",
"XX               XX",
"X XXXX XXXXX XXXX X",
"X X               X",
"X X XXXX X XXXX X X",
"X X      X      X X",
"X XXXX XXXXX XXXX X",
"X                 X",
"X XXXX   r   XXXX X",
"X       bpo       X",
"X XXXX XXXXX XXXX X",
"X                 X",
"X XXXX   X   XXXX X",
"X                 X",
"X XXXX XXXXX XXXX X",
"X        P        X",
"X                 X",
"X XXXX   X   XXXX X",
"X                 X",
"XX               XX",
"XXXXXXXXXXXXXXXXXXX"
];

const tileMap3 = [
"XXXXXXXXXXXXXXXXXXX",
"X                 X",
"X XXXX XXXXX XXXX X",
"X                 X",
"X XXXX XXXXX XXXX X",
"X                 X",
"X XXXX XXXXX XXXX X",
"X                 X",
"X        r        X",
"X       bpo       X",
"X                 X",
"X XXXX XXXXX XXXX X",
"X                 X",
"X XXXX XXXXX XXXX X",
"X                 X",
"X        P        X",
"X                 X",
"X XXXX XXXXX XXXX X",
"X                 X",
"X                 X",
"XXXXXXXXXXXXXXXXXXX"
];

const walls = new Set();
const foods = new Set();
const ghosts =new Set();
let pacman;

const directions = ['U', 'D', 'L', 'R'];//up, down, left, right for the ghosts
let score = 0;//score variable
let lives = 3;//lives variable
let gameOver = false;//game over variable
let gameWon = false;
const keys = {};//stores keys pressed

//for win screen
function showWinScreen() {
    gameOver = true;

    // hide game board
    document.getElementById("board").style.display = "none";

    // show win screen
    const winScreen = document.getElementById("winScreen");
    winScreen.classList.remove("hidden");

    // show final score
    document.getElementById("WinScore").textContent = score;
}

//for lose screen
function showLoseScreen(){
    backgroundMusic.loop = false;

    gameOver = true;

    document.getElementById("board").style.display = "none";

    document.getElementById("LoseScreen").classList.remove("hidden");

    document.getElementById("finalScore").textContent = score;

    document.getElementById("LoseScreen").style.display = "block";
}

//for the play again button
function playAgain() {
    // reset game state
    currentLevel = 1;
    score = 0;
    lives = 3;
    gameOver = false;
    gameWon = false;

    // hide win screen
    document.getElementById("winScreen").classList.add("hidden");

    // show game board
    document.getElementById("board").style.display = "block";

    document.getElementById("playAgainBtn").onclick = playAgain;

    // reload level 1
    loadMap1();
    resetPositions();
    update();
}


function loadMap() {
    if (currentLevel === 1) {
        loadMap1();
    } else if (currentLevel === 2) {
        loadMap2();
    } else if (currentLevel === 3) {
        loadMap3();
    }
}

//this is what runs when the page loads
window.onload = function(){

    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // used for drawing on the board and makes the board a 2d canvas
    loadImages();


    for (let ghost of ghosts.values()){
        const newDirection = directions[Math.floor(Math.random() * 4)]; //random direction for ghost to move 
        ghost.updateDirection(newDirection);
    }

    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);

    function keyDown(e){
        keys[e.code] = true;
    }
    
    function keyUp(e){
        keys[e.code] = false;
    }

  document.getElementById("winScreen").classList.add("hidden");//make sure win screen is hidden when game loads
  document.getElementById("LoseScreen").classList.add("hidden");//make sure lose screen is hidde when game loads

}


function loadImages(){ //gets all the images using there id/source, stores them in a variable, so we can use them later
    wallImage  = new Image();
    wallImage.src = "./wall.png";

    blueGhostImage = new Image();
    blueGhostImage.src = "./blueGhost.png";

    orangeGhostImage = new Image();
    orangeGhostImage.src = "./orangeGhost.png";

    pinkGhostImage = new Image();
    pinkGhostImage.src = "./pinkGhost.png";

    redGhostImage = new Image();
    redGhostImage.src = "./redGhost.png";

    pacmanUpImage = new Image();
    pacmanUpImage.src = "./pacmanup.png";
    pacmanDownImage = new Image();
    pacmanDownImage.src = "./pacmandown.png";
    pacmanLeftImage = new Image();
    pacmanLeftImage.src = "./pacmanleft.png";
    pacmanRightImage = new Image();
    pacmanRightImage.src = "./pacmanright.png";

}

//scans the board layouyt and creates walls, food, pacman, and ghosts at their positions
function loadMap1(){
    walls.clear(); //clears the sets so there are no duplicates when reloading the map
    foods.clear();
    ghosts.clear();

    //loops every tile in themap and creates the appropriate image based on the pixel coordinates
    for (let row = 0; row < rowCount; row++){
        for (let col = 0; col < colCount; col++){
            const rowStr = tileMap1[row];//gets the string at that row, eg, 'x'
            const tile = rowStr[col];//reads the character at that column, eg, 'x' and is used for the if statements below

            const x = col * tileSize;//convert grid coordinates to pixel coordinates, so the canvas can draw the images
            const y = row * tileSize;//convert grid coordinates to pixel coordinates, so the canvas can draw the images

            if (tile == 'X'){ //block wall
                const wall = new Block(wallImage, x, y, tileSize, tileSize);
                walls.add(wall);
            }
            else if (tile == 'b'){ // blue ghost
                const ghost = new Block(blueGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tile == 'o'){ // orange ghost (lowercase o)
                const ghost = new Block(orangeGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tile == 'p'){ // pink ghost
                const ghost = new Block(pinkGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tile == 'r'){ // red ghost
                const ghost = new Block(redGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tile == 'P'){ // pacman
                pacman = new Block(pacmanRightImage, x, y, tileSize, tileSize, true);
            }
            else if (tile == ' '){ // food
                const food = new Block(null, x + 14, y + 14, 4, 4); //we add 14 because, for example if square is 32 by 32 pixels we subtract by 4 because the food is gonna be 4X4 pixels, and divide by 2 to center
                foods.add(food);
            }
        }
    }
}

//scans the board layouyt and creates walls, food, pacman, and ghosts at their positions
function loadMap2(){
    walls.clear(); //clears the sets so there are no duplicates when reloading the map
    foods.clear();
    ghosts.clear();

    //loops every tile in themap and creates the appropriate image based on the pixel coordinates
    for (let row = 0; row < rowCount; row++){
        for (let col = 0; col < colCount; col++){
            const rowStr2 = tileMap2[row];//gets the string at that row, eg, 'x'
            const tile2 = rowStr2[col];//reads the character at that column, eg, 'x' and is used for the if statements below

            const x = col * tileSize;//convert grid coordinates to pixel coordinates, so the canvas can draw the images
            const y = row * tileSize;//convert grid coordinates to pixel coordinates, so the canvas can draw the images

            if (tile2 == 'X'){ //block wall
                const wall = new Block(wallImage, x, y, tileSize, tileSize);
                walls.add(wall);
            }
            else if (tile2 == 'b'){ // blue ghost
                const ghost = new Block(blueGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tile2 == 'o'){ // orange ghost (lowercase o)
                const ghost = new Block(orangeGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tile2 == 'p'){ // pink ghost
                const ghost = new Block(pinkGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tile2 == 'r'){ // red ghost
                const ghost = new Block(redGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tile2 == 'P'){ // pacman
                pacman = new Block(pacmanRightImage, x, y, tileSize, tileSize, true);
            }
            else if (tile2 == ' '){ // food
                const food = new Block(null, x + 14, y + 14, 4, 4); //we add 14 because, for example if square is 32 by 32 pixels we subtract by 4 because the food is gonna be 4X4 pixels, and divide by 2 to center
                foods.add(food);
            }
        }
    }
}

//scans the board layouyt and creates walls, food, pacman, and ghosts at their positions
function loadMap3(){
    walls.clear(); //clears the sets so there are no duplicates when reloading the map
    foods.clear();
    ghosts.clear();

    //loops every tile in themap and creates the appropriate image based on the pixel coordinates
    for (let row = 0; row < rowCount; row++){
        for (let col = 0; col < colCount; col++){
            const rowStr3 = tileMap3[row];//gets the string at that row, eg, 'x'
            const tile3 = rowStr3[col];//reads the character at that column, eg, 'x' and is used for the if statements below

            const x = col * tileSize;//convert grid coordinates to pixel coordinates, so the canvas can draw the images
            const y = row * tileSize;//convert grid coordinates to pixel coordinates, so the canvas can draw the images

            if (tile3 == 'X'){ //block wall
                const wall = new Block(wallImage, x, y, tileSize, tileSize);
                walls.add(wall);
            }
            else if (tile3 == 'b'){ // blue ghost
                const ghost = new Block(blueGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tile3 == 'o'){ // orange ghost (lowercase o)
                const ghost = new Block(orangeGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tile3 == 'p'){ // pink ghost
                const ghost = new Block(pinkGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tile3 == 'r'){ // red ghost
                const ghost = new Block(redGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);
            }
            else if (tile3 == 'P'){ // pacman
                pacman = new Block(pacmanRightImage, x, y, tileSize, tileSize, true);
            }
            else if (tile3 == ' '){ // food
                const food = new Block(null, x + 14, y + 14, 4, 4); //we add 14 because, for example if square is 32 by 32 pixels we subtract by 4 because the food is gonna be 4X4 pixels, and divide by 2 to center
                foods.add(food);
            }
        }
    }
}

function update(){
    if(gameOver) return //stops the loop if game is over
    move();
    draw();
    setTimeout(update, 50);
}

function draw(){
    context.clearRect(0, 0, board.width, board.height);//clears the board before redrawing everything
    context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height); //draws pacman

    for (let ghost of ghosts.values()){
       context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);//draws ghosts
    }

    for (let wall of walls.values()){
        context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);//draws walls
    }

    context.fillStyle = "white";//color of food
    for (let food of foods.values()){
        context.fillRect(food.x, food.y, food.width, food.height);//draws food as white rectangles
    }

    //score and displaying lives/text to screen
    context.fillStyle = "white";
    context.font = '20px Arial';
    if (gameOver!= true){
        context.fillText("❤️ " + lives +  " " +  "POINTS: " +  score, tileSize/2, tileSize/2);
    }
    
}


function move(){

    if (keys["ArrowUp"] || keys["KeyW"]) {
    pacman.updateDirection("U");
    }   
    else if (keys["ArrowDown"] || keys["KeyS"]) {
    pacman.updateDirection("D");
    }
    else if (keys["ArrowLeft"] || keys["KeyA"]) {
    pacman.updateDirection("L");
    }
    else if (keys["ArrowRight"] || keys["KeyD"]) {
    pacman.updateDirection("R");
    }

    // move Pac-Man according to current velocity
    pacman.x += pacman.velocityX;
    pacman.y += pacman.velocityY;

    for (let wall of walls.values()){
        if (collision(pacman, wall)){ //if pacman collides with a wall
            pacman.x -= pacman.velocityX; //
            pacman.y -= pacman.velocityY; //move pacman back to where it was
            break; //exit loop
        }
    }

    if (pacman.x < 0 || pacman.x + pacman.width > boardWidth ||
        pacman.y < 0 || pacman.y + pacman.height > boardHeight){
        pacman.x -= pacman.velocityX; //
        pacman.y -= pacman.velocityY; //move pacman back to where it was  
        }
    

    for (let ghost of ghosts.values()){
        if(collision(ghost, pacman)){
            lives -= 1;
            if (lives === 0){
                setTimeout(showLoseScreen, 200);
                return;
            }
            resetPositions();
        }
       if (Math.random() < 0.02) { // 2% chance each frame to change direction
        const newDir = directions[Math.floor(Math.random() * 4)];
        ghost.updateDirection(newDir);
}


        ghost.x += ghost.velocityX; 
        ghost.y += ghost.velocityY; 
        for (let wall of walls.values()){
            if (collision(ghost, wall) || ghost.x <= 0 || ghost.x + ghost.width >= boardWidth){ //if ghost collides with a wall or goes out of bounds
                ghost.x -= ghost.velocityX; 
                ghost.y -= ghost.velocityY; 
                const newDirection = directions[Math.floor(Math.random() * 4)];
                ghost.updateDirection(newDirection);
            
        }    
    }
}

    //this is for the food/points counter    
    let food_points = null;
    for(let food of foods.values()){
        if (collision(pacman, food)){
            food_points = food;
            score += 10;

            backgroundMusic.currentTime = 1;
            eatSound.play();
            break;
        }
    }
    foods.delete(food_points);
 
// NEW LEVEL / WIN CHECK
if (gameStarted && foods.size === 0 && score > 0 && !gameWon) {

    if (currentLevel === 3 && foods.size === 0){ 
        gameWon = true;
        gameOver = true;

        setTimeout(showWinScreen, 2000);
        return;
    }

    // otherwise go to next level
    currentLevel++;

    if (currentLevel === 2) {
        alert("Level 2");
        loadMap2();
    }
    else if (currentLevel === 3) {
        alert("Level 3");
        loadMap3();
    }

    resetPositions();
    return;
}
}


function collision(a, b){
    return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;    
}

function resetPositions(){
    pacman.reset();
    pacman.velocityX = 0;
    pacman.velocityY = 0;
    for (let ghost of ghosts.values()){
        ghost.reset();
        const newDirection = directions[Math.floor(Math.random() * 4)];
        ghost.updateDirection(newDirection);
    }
}

//this class helps to create walls, pacman, ghosts, and food using the fucntion loadMap above
class Block {
    constructor(image, x, y, width, height, isPacman = false){
        this.image = image;//image to draw
        this.x = x;//x position(top left corner)
        this.y = y;//y position(top left corner)
        this.width = width;//size
        this.height = height;//size
        this.isPacman = isPacman;

        this.startX = x;//starting position
        this.startY = y;//starting position

        this.direction = 'R';//pacmans default direction
        this.velocityX = 0;// 0 = no change in X postion 
        this.velocityY = 0;// 0 = no change in Y position
        // set initial velocity according to default direction
        this.updateVelocity();
    }
    updateDirection(direction){ //tell the Pacman piece which direction to go and how much to move
        const prevDirection = this.direction; 
        this.direction = direction;
        this.updateVelocity();//updates velocity based on new direction
        
    
        for (let wall of walls.values()){
            if(collision(this, wall)){
                this.x -= this.velocityX;//move pacman back to where it was
                this.y -= this.velocityY;
                this.direction = prevDirection;//revert to previous direction if there is a wall
                this.updateVelocity();
                return;//exits the function 
            }
        }    
    }   

    updateVelocity(){
        if (this.direction == 'U'){
            this.velocityX = 0;
            this.velocityY = -tileSize/4
            if (this.isPacman) this.image = pacmanUpImage;
        }

        else if (this.direction == 'D'){
            this.velocityX = 0;
            this.velocityY = tileSize/4;
            if (this.isPacman) this.image = pacmanDownImage;
        }
        else if (this.direction == 'L'){
            this.velocityX = -tileSize/4;
            this.velocityY = 0;
            if (this.isPacman) this.image = pacmanLeftImage;
        }
         else if (this.direction == 'R'){
            this.velocityX = tileSize/4;
            this.velocityY = 0;
            if (this.isPacman) this.image = pacmanRightImage;
        }
    } 
        //reset postitions
        reset(){
            this.x = this.startX;
            this.y = this.startY;
   
        }
}

document.getElementById("PlayagainLose").onclick = function () {
    location.reload();
};

document.getElementById("Playagain").onclick = function () {
    location.reload();
};
