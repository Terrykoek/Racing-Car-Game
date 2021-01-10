$(function() {

    var startGame;

    //saving dom objects to variables
    var container = $('#container');
    var car = $('#car');
    var car1 = $('#car1');
    var car2 = $('#car2');
    var car3 = $('#car3');
    var line1 = $('#firstLine');
    var line2 = $('#secondLine');
    var line3 = $('#thirdLine');
    var restartdiv = $('#restartdiv');
    var restartbtn = $('#restart');
    var score = $('#score');

    //saving some initial setup
    //The parseInt() function parses a string and returns an integer. In this case, it returns the value of the walls of the road into an integer
    var containerLeft = parseInt(container.css('left')); 
    var containerWidth = parseInt(container.width());
    var containerHeight = parseInt(container.height());
    //returns the value of the width and height of the car
    var carWidth = parseInt(car.width());
    var carHeight = parseInt(car.height());

    //some other declarations
    var endGame = false;

    var scoreCount = 1;

    var carSpeed = 2;
    var lineSpeed= 5;

    var moveRight = false;
    var moveLeft = false;
    var moveUp = false;
    var moveDown = false;

    /* ------------------------------GAME CODE STARTS HERE------------------------------------------- */

    /* Move the cars */
    //move cars down
    //requestAnimation to call function left over a period of time
    $(document).on('keydown', function(e) {    //keycode for keydown=40

        if (endGame === false ) {
            var key = e.keyCode;
            if (key === 37 & moveLeft === false) {
                moveLeft = requestAnimationFrame(left);
            } else if (key === 39  && moveRight === false) {
                moveRight = requestAnimationFrame(right);
            } else if (key === 38 && moveUp === false) {
                moveUp = requestAnimationFrame(up);
            } else if (key === 40 && moveDown === false) {
                moveDown = requestAnimationFrame(down);
            }
        }
    });

    //keycode for key up=38
    $(document).on('keyup', function(e) {
        if (endGame === false) {
            var key = e.keyCode;
            if (key === 37) {
                cancelAnimationFrame(moveLeft);
                moveLeft = false;
            } else if (key === 39) {
                cancelAnimationFrame(moveRight);
                moveRight = false;
            } else if (key === 38) {
                cancelAnimationFrame(moveUp);
                moveUp = false;
            } else if (key === 40) {
                cancelAnimationFrame(moveDown);
                moveDown = false;
            }
        }
    });
// define function of left, right, up and down
    function left() {
        if (endGame === false && parseInt(car.css('left')) > 0) {
            car.css('left', parseInt(car.css('left')) - 5); // left variable of class car will move 5 to the lft
            moveLeft = requestAnimationFrame(left); //request animation frame left will be activated
        }
    }

    function right() {
        if (endGame === false && parseInt(car.css('left')) < containerWidth - carWidth) {
            car.css('left', parseInt(car.css('left')) + 5);
            moveRight = requestAnimationFrame(right);
        }
    }

    function up() {
        if (endGame === false && parseInt(car.css('top')) > 0) {
            car.css('top', parseInt(car.css('top')) - 3); //top variable of class car will move 3 units upward
            moveUp = requestAnimationFrame(up);
        }
    }

    function down() {
        if (endGame === false && parseInt(car.css('top')) < containerHeight - carHeight) {
            car.css('top', parseInt(car.css('top')) + 3);
            moveDown = requestAnimationFrame(down);
        }
    }

    /* Move the opposite cars and lines */
    startGame = requestAnimationFrame(repeat);
    //define repeat function
    function repeat() {
        if (collision(car, car1) || collision(car, car2) || collision(car, car3)) {
            gameStop();
            return;
        }

        scoreCount++;

        if (scoreCount % 500 == 0) {
            carSpeed++;
            lineSpeed++;
        }
//defining car down function with parameters of car 1,2 and 3
        carDown(car1);
        carDown(car2);
        carDown(car3);

//defining line down function with parameters of line 1,2 and 3

        lineDown(line1);
        lineDown(line2);
        lineDown(line3);

        startGame = requestAnimationFrame(repeat);
    }
//creating the movement of opp cars
    function carDown(car) {
        var currentTopCar = parseInt(car.css('top')); //returns the value of the top of the car
        if (currentTopCar  > containerHeight) {
            currentTopCar  = -200;
            var carLeft = parseInt(Math.random() * (containerWidth - carWidth));
            car.css('left', carLeft);
        }
        car.css('top', currentTopCar + carSpeed);
    }

    function lineDown(line) {
        var currentTopLine = parseInt(line.css('top'));
        if (currentTopLine > containerHeight) {
            currentTopLine = -300;
        }
        line.css('top', currentTopLine + lineSpeed);
    }

    //restart button is clicked, reload the page and activate gameStop function to cancel animation
    restartbtn.click(function() {
        location.reload(); //refresh or reload the page when restart button is pressed
    });

    function gameStop() {
        endGame = true;
        cancelAnimationFrame(startGame);
        cancelAnimationFrame(moveRight);
        cancelAnimationFrame(moveLeft);
        cancelAnimationFrame(moveUp);
        cancelAnimationFrame(moveDown);
        restartdiv.slideDown();
        restartbtn.focus();
       
    }

   
//collision function
    function collision($div1, $div2) {
        var x1 = $div1.offset().left; //returns an object containing the properties top and left
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true); //Get the current computed outer height (including padding, border, and optionally margin) for the first element in the set of matched elements or set the outer height of every matched element.
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;
        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;

        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
        return true;
    }



});