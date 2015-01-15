var colWidth = 101;
var rowHeight = 83;
var position = {
    "x": 0,
    "y": 0
};

// Enemies our player must avoid
//-------------- Enemy -----------------
//Input Parameters:
// * rowStart & colStart set the initial position of the Enemy sprite image
// * spped is a setting {'default' | 'fast' | 'warp'}
// * rowJumper set the initial value to {true | false}
var Enemy = function(rowStart, colStart, speed, rowJumper) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    this.speedFactor = 3; //Set the default speed factor
    if (speed == "fast")
        this.speedFactor = 6;  //Fast factor
    else if (speed == "warp")
        this.speedFactor = 12; //Double the speed for warp factor

    this.rowJumper = rowJumper; //Indicates whether the enemy jumps to other rows

    this.col = colStart; //Keep active track of the current row and col
    this.row = rowStart;

    position = calcGridPosition(this.row, this.col); //Convert row & col to X Y co-ordinates
    this.x = position.x;
    this.y = position.y;
 }

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var speed = 50 * this.speedFactor;  //Base speed is set to 50 which is multiplied
                                        //by the speedFactor property to alter speeds

    //dt: example avg value is .017
    this.x += speed * dt;

    if (this.x > (colWidth * 5)) {  //Image is off the canvas
        this.x = -50;  //Reposition image to enter canvas again from the left
        if (this.rowJumper == true) {
            this.y = enemyJumpRow(this.y); //Find a different row to prowl
            this.rowJumper = false;
        }
        else {
            this.rowJumper = true; //If not set as row jumper, set true for next iteration
        }
    }

    //Reevaluate current col and row positions
    this.col = calcColumn(this.x);
    this.row = calcRow(this.y);
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    var imgOffset = 30; //Clip the top portion of enemy bug image
    ctx.drawImage(Resources.get(this.sprite), this.x, (this.y - imgOffset) );
}

//-------------- Player -----------------
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.initPosition();

    //Determine row & column position
    this.row = calcRow(this.y); //1-6; 83px per row
    this.col = calcColumn(this.x); //1-5; 101px per col

}

//Position the player in start position
Player.prototype.initPosition = function() {
    this.x = colWidth * 2; //position middle column
    this.y = rowHeight * 5; //postion bottom "grass level"
}


Player.prototype.update = function() {
}

//Display player image sprite on canvas using X Y co-ordinates
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//Keyboard arrow keys move the player up, down, left, right one position
Player.prototype.handleInput = function(pressedKey) {
    //Up & Downs. Determine if there is at least a one row of space to move, if not do nothing
    if (pressedKey == 'up'){
        if ( (this.y - rowHeight) >= 0) {
            this.y -= rowHeight; //move up one row
            this.row = calcRow(this.y); //Determine the new row
            //this.y = -5; //Adjust image on grid to make look better
        }
    }
    else if (pressedKey == 'down'){
        if ( (this.y + rowHeight) < (rowHeight * 5)) {
            this.y += rowHeight;
            this.row = calcRow(this.y); //Determine what row the player is on
        }
    }
    //Left & Rights. Determine if there is at least a columns width of space to move, if not do nothing
    else if (pressedKey == 'right'){
        if ( (this.x + colWidth) < (colWidth * 5)) {
            this.x += colWidth;     //Move a full colWidth to right
            this.col = calcColumn(this.x);  //Determine new column
        }
    }
    else if (pressedKey == 'left'){
        if ( (this.x - colWidth) >= 0){
            this.x -= colWidth; //Move a full colWidth to left
            this.col = calcColumn(this.x); //Determine new column
        }
    }
}

//Determine if an enemy object and the player are in the same row and col.
Player.prototype.checkCollisions = function() {
    for(enemy in allEnemies)  //Traverse all active enemy objects
    {
        //check for enemy and player match
        if ( allEnemies[enemy].row == player.row  &&
             allEnemies[enemy].col == player.col) {
            this.initPosition(); //Reset the player to start position
        }
    }
}
//---------------------------------------------

//---------------------------------------------
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
allEnemies[0] = new Enemy(1, 1, "warp", true);
allEnemies[1] = new Enemy(2, 4, "default", false);
allEnemies[2] = new Enemy(3, 5, "fast", false);

// Place the player object in a variable called player
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//Receive a row and col position, determine X Y co-ordinates on canvas
function calcGridPosition(row, col){
    position.x = 0;
    position.y = 0;

    //Determine row position
    if (row == 1)
        position.y = rowHeight * 1;
    else if (row == 2)
        position.y = rowHeight * 2;
    else if (row == 3)
        position.y = rowHeight * 3;
    else if (row == 4)
        position.y = rowHeight * 4;

    //Determine col position
    if (col == 1)
        position.X = 0;
    else if (col == 2)
        position.X = colWidth * 1;
    else if (col == 3)
        position.X = colWidth * 2;
    else if (col == 4)
        position.X = colWidth * 3;
    else if (col == 5)
        position.X = colWidth * 4;

    return position;
}

//Receive an X co-ordinate, determine the matching column on the horizontal axis of the canvas.
function calcColumn(x){
    var col = 0;

    //Divide the X co-ord by the column width, discard remainder, and match
    if (Math.floor(x/colWidth) == 0)  //col is 1 when y between 0 and 101
        col = 1;
    else if (Math.floor(x/colWidth) == 1) //col is 2 when y between 101 and 202
        col = 2;
    else if (Math.floor(x/colWidth) == 2) //col is 3 when y between 202 and 303
        col = 3;
    else if (Math.floor(x/colWidth) == 3) //col is 4 when y between 303 and 404
        col = 4;
    else if (Math.floor(x/colWidth) == 4) //col is 5 when y between 404 and 505
        col = 5;

    return col;
}

//Receive a Y co-ordinate, determine the matching row on the vertical axis of the canvas.
function calcRow(y){
    var row = 0;

    //Divide the Y co-ord by the row height, discard remainder, and match
    if (Math.floor(y/rowHeight) == 0)  //col is 1 when y between 0 and 101
        row = 1;
    else if (Math.floor(y/rowHeight) == 1) //col is 2 when y between 101 and 202
        row = 2;
    else if (Math.floor(y/rowHeight) == 2) //col is 3 when y between 202 and 303
        row = 3;
    else if (Math.floor(y/rowHeight) == 3) //col is 4 when y between 303 and 404
        row = 4;
    else if (Math.floor(y/rowHeight) == 4) //col is 5 when y between 404 and 505
        row = 5;

    return row;
}

//Receive an Enemy Y co-ordinate property, reposition the Enemy on a new row
//on the three rows spanning the stone portion of the canvas.
function enemyJumpRow(y){
    if ((y + rowHeight) < (rowHeight * 4))
        return y + rowHeight;
    else
        return rowHeight;
}
