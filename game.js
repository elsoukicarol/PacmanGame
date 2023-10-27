class Game{
    constructor(){
        this.canvas = document.getElementById("canvas");
        this.context = canvas.getContext("2d");
        this.sprites = []
        this.board = [];
        this.boardHeight = 10;
        this.boardWidth = 10;
        this.cellSize = 40;
    }

    update(){
        for(var i = 0 ; i < this.sprites.length ; i ++){
            this.score = this.sprites[i].update(this.context);
        }
    }

    draw(){
        this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.drawBoard();
        for(var i = 0 ; i<this.sprites.length ; i ++){
            this.sprites[i].draw(this.context, this.board);
        }
    }

    setBoardValues(){
        for(var row = 0 ; row < this.boardWidth ; row++){
            this.board[row] = [];
            for(var col = 0 ; col < this.boardHeight ; col++){

                if(col == 0 || col == this.boardWidth - 1 || row == 0){
                    this.board[row][col] = "wall";
                }
                else if(row==1 && col==0 || row == this.boardHeight-1 && row == this.boardWidth-1){
                    this.board[row][col] = "wall";
                }
                else if((row==2 || row==this.boardHeight-3) && (col==0 || col==2 || col==3 || col==6 || col==7 || col==this.boardWidth-1)){
                    this.board[row][col] = "wall";
                }
                else if((row==3 || row==this.boardHeight-4) && (col==0 || col==2 || col==7 || col==9)){
                    this.board[row][col] = "wall";
                }
                else if((row==4 || row==this.boardHeight-5) && (col==0 || col==2 || col==4 || col==5 || col==7 || col==9)){
                    this.board[row][col] = "wall";
                }
                else{
                    this.board[row][col] = "food";
                }
            }
        }
    }

    drawBoard(){
        for(var row = 0 ; row < this.boardWidth ; row++){
            for(var col = 0 ; col < this.boardHeight ; col++){
                this.context.lineWidth = 1;
                this.context.strokeStyle = "blue";
                if(this.board[row][col] == "wall"){
                    this.context.fillStyle = "black";
                    this.context.fillRect(row*this.cellSize , col*this.cellSize , this.cellSize, this.cellSize);
                    this.context.strokeRect(row*this.cellSize , col*this.cellSize , this.cellSize, this.cellSize);
                }
                else if(this.board[row][col] == "food"){
                    this.context.fillStyle = "blue";
                    this.context.fillRect(row*this.cellSize , col*this.cellSize , this.cellSize, this.cellSize);
                    this.context.strokeRect(row*this.cellSize , col*this.cellSize , this.cellSize, this.cellSize);
    
                    this.context.beginPath();
                    this.context.arc(row * 40 + 20, col * 40 + 20, 3,0, Math.PI* 2 );
                    this.context.fillStyle = "red";
                    this.context.fill();
                    this.context.closePath();
                }
                else{
                    this.context.fillStyle = "blue";
                    this.context.fillRect(row*this.cellSize , col*this.cellSize , this.cellSize, this.cellSize);
                    this.context.strokeRect(row*this.cellSize , col*this.cellSize , this.cellSize, this.cellSize);
                }
            
            }
        }
    }
}

class Sprites{
    constructor(){

    }
    draw(){

    }
    update(){

    }
}

class Pacman extends Sprites{

    constructor(positionX, positionY, game){
        super();
        this.radius = 20;
        /// Position equal to positiion times cell size. We add + 20 so it will be in the middle of the cell
        this.positionX = positionX * 40 + 20;
        this.positionY = positionY * 40 + 20;

        //angles to draw the pacman
        this.startingAngle = 0.2 * Math.PI;
        this.endingAngle = 1.8 * Math.PI;

        // speed to move the pacman
        this.speed = 2;

        // taking the gameboard from the parameter game
        this.board = game.board;
        this.boardHeight = game.boardHeight;
        this.boardWidth = game.boardWidth;
        // -10 because the pacman already collides with one food
        this.score = -10 ;

        // all keys are set to false because the game hasnt started
        this.canMoveRight = false;
        this.canMoveLeft = false;
        this.canMoveDown = false;
        this.canMoveUp = false;

        //waiting time to tell the user he won
        this.seconds = 0;
    }

    draw(context){
        context.beginPath();
        context.arc(this.positionX, this.positionY, this.radius,this.startingAngle, this.endingAngle);
        context.fillStyle = "yellow";
        context.strokeStyle = "yellow";
        context.lineTo(this.positionX,this.positionY);
        context.stroke();
        context.fill();
        context.closePath();
    }

    update(context){

        if(this.canMoveDown == true){

            //changing position of the mouth by changing angles
            this.startingAngle = 0.75 * Math.PI;
            this.endingAngle = 2.25 * Math.PI;

            this.positionY += this.speed;
        } 
        else if(this.canMoveRight == true){

            this.startingAngle = 0.2 * Math.PI;
            this.endingAngle = 1.8 * Math.PI;

            this.positionX += this.speed;
        }
        else if(this.canMoveLeft == true){

            this.startingAngle = 1.25 * Math.PI;
            this.endingAngle = 0.75 * Math.PI;

            this.positionX -= this.speed;
        }
        else if(this.canMoveUp == true){

            this.startingAngle = 3.75 * Math.PI;
            this.endingAngle = 1.2 * Math.PI;

            this.positionY -= this.speed;
        }
        
        this.checkCollisionWithBorder();
        this.checkCollisionWithWall();
        this.checkCollisionWithFood(context);

        }

        checkCollisionWithFood(context){
            for(var row = 0 ; row < this.boardWidth ; row++){
                for(var col = 0 ; col < this.boardHeight ; col++){
    
                    if(this.board[row][col] == "food"){
    
                        var foodX = row * 40 + 20;
                        var foodY = col * 40 + 20;
    
                        // DISTANCE FORMULA
                        var distance = Math.sqrt((foodX - this.positionX) * (foodX - this.positionX) + (foodY - this.positionY) * 
                            (foodY - this.positionY));

                        if (distance < this.radius) {
                            this.board[row][col] = "empty";
                            this.score += 10;
                        }
                    }
                }
            }
            /// Displaying score 
            if(this.score < 430){
                context.fillText("Score: " + this.score, 160, 30);
                context.font = "25px Arial";
            }
            else{
                context.fillText("Congratulations you have won ", 40, 30);
                this.canMoveDown = false;
                this.canMoveUp = false;
                this.canMoveLeft = false;
                this.canMoveRight = false;
            }
        }

    checkCollisionWithBorder(){
        if (this.positionX - 45 <= this.radius){
            this.canMoveLeft = false;
        } 
        else if(this.positionX >= (this.boardWidth - 1) * 40 - this.radius) {
            this.canMoveRight = false;
        }

        if(this.positionY - 45 <= this.radius) {
            this.canMoveUp = false;
        } 
        else if(this.positionY >= (this.boardHeight - 1) * 40 - this.radius){
            this.canMoveDown = false;
        }
    }

    checkCollisionWithWall(){

        var currentRow = Math.floor(this.positionY/ 40);
        var currentCol = Math.floor(this.positionX/ 40);

        if(this.board[currentCol][currentRow] == "wall"){
            if (this.canMoveRight) {
                    this.positionX = this.positionX - this.speed - this.radius;
                    this.canMoveRight = false;
                  }
            if (this.canMoveUp) {
                this.positionY = this.positionY + this.speed + this.radius;
                this.canMoveUp = false;
              }
              if (this.canMoveDown) {
                this.positionY = this.positionY - this.speed - this.radius;
                this.canMoveDown = false;
              }
              if (this.canMoveLeft) {
                this.positionX = this.positionX + this.speed + this.radius;
                this.canMoveLeft = false;
              }
            }
    }
    
}

class Ghosts extends Sprites {
	constructor(x) {
		super();
		this.positionX = x;
		this.positionY = 60;
        this.initialY = 60;
        this.moved = false;
        this.speed = 1;
	}

	draw(context) {
        context.beginPath();
		context.fillStyle = "cyan";
		context.arc(this.positionX, this.positionY, 12, 0, 2 * Math.PI);
		context.fill();
        context.closePath();
	}

    update(){
        if(this.moved==false && this.positionY > this.initialY - 20){
            this.positionY -= this.speed;
            if(this.positionY==55){
                this.moved = true;
            }
        }
        else if(this.moved == true && this.positionY >= 40){
            this.positionY += this.speed;
            if(this.positionY==340){
                this.moved = false;
            }
        }
    }
}

var myGame = new Game();
myGame.setBoardValues();
var pacman = new Pacman(2,1, myGame);
var ghost = new Ghosts(340);
var ghost2 = new Ghosts(60);

document.addEventListener("keydown", function(e){
    if(e.keyCode == 37){
        pacman.canMoveLeft = true;

        pacman.canMoveDown = false;
        pacman.canMoveRight = false;
        pacman.canMoveUp = false;
    }
    else if(e.keyCode == 38){
        pacman.canMoveUp = true;

        pacman.canMoveDown = false;
        pacman.canMoveRight = false;
        pacman.canMoveLeft = false;
    }
    else if(e.keyCode == 39){
        pacman.canMoveRight = true;

        pacman.canMoveDown = false;
        pacman.canMoveLeft = false;
        pacman.canMoveUp = false;
    }
    else if(e.keyCode == 40){
        pacman.canMoveDown = true;

        pacman.canMoveRight = false;
        pacman.canMoveLeft = false;
        pacman.canMoveUp = false;
    }
});

myGame.sprites.push(pacman);
myGame.sprites.push(ghost);
myGame.sprites.push(ghost2);

let requestAnimFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
})();

gameEngineLoop();

function gameEngineLoop() {
    myGame.draw();
    myGame.update();
    requestAnimFrame(gameEngineLoop);
}