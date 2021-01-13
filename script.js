$(() => {
    //start game function
    let startGame;
    let endGame = false;

    //creating variable for scores
    let score = $('#score');
    let scoreCount = 1;

    
    //creating variables for buttons
    let restartbtn = $('#restart');
    let restartdiv = $('#restartdiv');

     //variable for joke and punchline function
     let jokes;
     let punchLine;
 
    
    //creating basic function for lines
    let line1 = $('#firstLine');
    let line2 = $('#secondLine');
    let line3 = $('#thirdLine');
    

    //creating basic function for cars 
    let car = $('#car');
    let car1 = $('#car1');
    let car2 = $('#car2');
    let car3 = $('#car3');


    //variables to guide the game
    let container = $('#container');

    let carSpeed = 2;
    let lineSpeed = 4;

    let moveUp = false;
    let moveDown = false;
    let moveRight = false;
    let moveLeft = false;
 


    //saving some initial setup
    //The parseInt() function parses a string and returns an integer. In this case, it returns the value of the walls of the road into an integer
    // let containerLeft = parseInt(container.css('left'));
    let containerWidth = parseInt(container.width());
    let containerHeight = parseInt(container.height());
    //returns the value of the width and height of the car
    let carWidth = parseInt(car.width());
    let carHeight = parseInt(car.height());



    //move player car
    //requestAnimation to call function left over a period of time
    //keydown is the action of pressing button down
    $(document).on('keydown', function (e) {    //keycode for keydown=40
        //The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser calls a specified function to update an animation before the next repaint. 
        //The method takes a callback as an argument to be invoked before the repaint.
        if (endGame === false) {
            let key = e.keyCode;
            if (key === 37) { //keycode for left key is 37
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

   
    //keyup is the action of releasing of button on keyboard

    $(document).on('keyup', function (e) {
        if (endGame === false) {
            let key = e.keyCode;
            // cancels an animation frame request previously scheduled through a call            
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
    function up() {
        if (endGame === false && parseInt(car.css('top')) > 0) {
            car.css('top', parseInt(car.css('top')) - 2); //top parameter of class car will move 3 units upward
            moveUp = requestAnimationFrame(up);
        }
    }

    function down() {
        if (endGame === false && parseInt(car.css('top')) < containerHeight - carHeight) {
            car.css('top', parseInt(car.css('top')) + 2);
            moveDown = requestAnimationFrame(down);
        }
    }
    function left() {
        if (endGame === false && parseInt(car.css('left')) > 0) { //if endGame is false(as defined earlier) and the value of left which is a css property of car element is >0
            car.css('left', parseInt(car.css('left')) - 4); // left parameter of car element will move 5 to the left 
            moveLeft = requestAnimationFrame(left); //request animation frame left will be assigned to moveLeft
        }
    }

    function right() {
        if (endGame === false && parseInt(car.css('left')) < containerWidth - carWidth) {
            car.css('left', parseInt(car.css('left')) + 4);
            moveRight = requestAnimationFrame(right);
        }
    }


    //assign startGame function to repeat this animation
    startGame = requestAnimationFrame(repeat);

    
    //creating the movement of opposite car
    function carDown(car) {
        let currentTopCar = parseInt(car.css('top')); //returns the value of the top of the opposite car with respect to the top currently
        if (currentTopCar > containerHeight) { // the distance of the top of the car is larger than the distance of the container height
            currentTopCar = -10; // which cause te car to come down
            let carLeft = parseInt(Math.random() * (containerWidth - carWidth)); //give carleft a value of math random so the cars always come down randomly
            car.css('left', carLeft);
        }
        car.css('top', currentTopCar + carSpeed); //css value of car will be the currentopcar + car speed
    }

    //creating movement of the lines
    function lineDown(line) {
        let currentTopLine = parseInt(line.css('top'));
        if (currentTopLine > containerHeight) {
            currentTopLine = -100;
        }
        line.css('top', currentTopLine + lineSpeed);
    }

    //collision function
    //2 parameters of player car and the opposite car will run in this function
    function collision($div1, $div2) {
     //retrieve a position of an element containing the properties of top respect to the bottom of container
    let y1 = $div1.offset().top; 
     //Get the current computed outer height (including padding, border, and optionally margin) 
    let h1 = $div1.outerHeight(true); 
    //to get the complete distance of the top of the player car with respect to the bottom of the container
     let b1 = y1 + h1;

    //do the same for left with respect to the left of the container
    let x1 = $div1.offset().left; 
    let w1 = $div1.outerWidth(true); //Get the outerwidth of the div including padding and margin
    //to get the complete distance of the left of the player car with respect to the left of the container
    let r1 = x1 + w1;

    //same thing for 2nd parameter
    let y2 = $div2.offset().top;
    let h2 = $div2.outerHeight(true);
    let x2 = $div2.offset().left;
    let w2 = $div2.outerWidth(true);
    let b2 = y2 + h2;
    let r2 = x2 + w2;

    //if displacement of player car(b1) < displacement of opp car (y2) relative to bottom of container, this means the opp car is always above player car, this will return false which means no collision. same thing for the left and right and bottom
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

    if (scoreCount % 30 == 0) {
        score.text(parseInt(score.text()) + 1);
    }

    if (scoreCount % 300 == 0) { //increase speed of opposite car
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


    //restart button is clicked, reload the page and activate gameStop function to cancel animation
    restartbtn.click(function () {
        location.reload(); //refresh or reload the page when restart button is pressed
    });

    function gameStop() {
        endGame = true;
        cancelAnimationFrame(startGame);
        // cancelAnimationFrame(moveUp);
        // cancelAnimationFrame(moveDown);
        // cancelAnimationFrame(moveRight);
        // cancelAnimationFrame(moveLeft);
        //reveal restart button
        restartdiv.show();
        //input jokes API
        fetchRandomJoke();

    }
    // input joke API
    
    fetchRandomJoke = () => {
        fetch('https://official-joke-api.appspot.com/random_joke', {// fetch from the API
            headers: {
                Accept: 'application/json'
            }
        }).then((response) => {
            // successful API
            return response.text();
        }).then((data) => {
            let parseData = JSON.parse(data); //parse the date to assign to jokes variable 
            console.log(parseData.setup)
            jokes = parseData.setup;
            punchLine = parseData.punchline;
            $('#joke').text(jokes);
            $('#punchline').text(punchLine);
        }).catch((err) => {
            // error
            console.warn('Something went wrong.', err);
        });
    }


});