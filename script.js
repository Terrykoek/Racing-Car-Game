$(() => {

    let startGame;


    //saving dom objects to variables
    let container = $('#container');
    let car = $('#car');
    let car1 = $('#car1');
    let car2 = $('#car2');
    let car3 = $('#car3');
    let line1 = $('#firstLine');
    let line2 = $('#secondLine');
    let line3 = $('#thirdLine');
    let restartbtn = $('#restart');
    let restartdiv = $('#restartdiv');
    let score = $('#score');


    //some other declarations
    let endGame = false;

    let scoreCount = 1;

    let carSpeed = 1;
    let lineSpeed = 4;

    let moveRight = false;
    let moveLeft = false;
    let moveUp = false;
    let moveDown = false;


    //saving some initial setup
    //The parseInt() function parses a string and returns an integer. In this case, it returns the value of the walls of the road into an integer
    let containerLeft = parseInt(container.css('left'));
    let containerWidth = parseInt(container.width());
    let containerHeight = parseInt(container.height());
    //returns the value of the width and height of the car
    let carWidth = parseInt(car.width());
    let carHeight = parseInt(car.height());



    /* Move the cars */
    //move cars down
    //requestAnimation to call function left over a period of time
    //keydown is the action of pressing button down
    $(document).on('keydown', function (e) {    //keycode for keydown=40
        //The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser calls a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.
        if (endGame === false) {
            let key = e.keyCode;
            if (key === 37) {
                moveLeft = requestAnimationFrame(left);
            } else if (key === 39) {
                moveRight = requestAnimationFrame(right);
            } else if (key === 38) {
                moveUp = requestAnimationFrame(up);
            } else if (key === 40) {
                moveDown = requestAnimationFrame(down);
            }
        }
    });

    //keycode for up key=38
    //keyup is the action of releasing of button on keyboard

    $(document).on('keyup', function (e) {
        if (endGame === false) {
            let key = e.keyCode;
            //requestAnimationFrame returns an ID you can use to cancel it,
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
            car.css('left', parseInt(car.css('left')) - 5); // left letiable of class car will move 5 to the lft
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
            car.css('top', parseInt(car.css('top')) - 3); //top letiable of class car will move 3 units upward
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


    //collision function
    function collision($div1, $div2) {
        let x1 = $div1.offset().left; //retrieve a position of an element containing the properties top and left
        let y1 = $div1.offset().top; //get the top position of the div1
        let h1 = $div1.outerHeight(true); //Get the current computed outer height (including padding, border, and optionally margin) for the first element in the set of matched elements or set the outer height of every matched element.
        let w1 = $div1.outerWidth(true); //Get the outerwidth of the div
        let b1 = y1 + h1;
        let r1 = x1 + w1;
        let x2 = $div2.offset().left;
        let y2 = $div2.offset().top;
        let h2 = $div2.outerHeight(true);
        let w2 = $div2.outerWidth(true);
        let b2 = y2 + h2;
        let r2 = x2 + w2;
        //if displacement of player car(b1) < displacement of opp car (y2), means the opp car is above player car, hence it is false
        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) {
            return false;
        }
       
        return true;
    }


    //define repeat function
    function repeat() {
        if (collision(car, car1) || collision(car, car2) || collision(car, car3)) { //if main car collide with car 1, 2 or 3, gamestop funciton will kick in which will stop the game
            gameStop();
            return;
        }

        scoreCount++;
        
        if (scoreCount % 10 == 0) {
            score.text(parseInt(score.text()) + 1);
        }

        if (scoreCount % 500 == 0) {
            carSpeed+=2;
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
    //creating the movement of car
    function carDown(car) {
        let currentTopCar = parseInt(car.css('top')); //returns the value of the top of the car
        if (currentTopCar > containerHeight) {
            currentTopCar = -200;
            let carLeft = parseInt(Math.random() * (containerWidth - carWidth));
            car.css('left', carLeft);
        }
        car.css('top', currentTopCar + carSpeed);
    }

    function lineDown(line) {
        let currentTopLine = parseInt(line.css('top'));
        if (currentTopLine > containerHeight) {
            currentTopLine = -300;
        }
        line.css('top', currentTopLine + lineSpeed);
    }

    //restart button is clicked, reload the page and activate gameStop function to cancel animation
    restartbtn.click(function () {
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



});