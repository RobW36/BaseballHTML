/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var strikeCount = 0;
var ballCount = 0;
var outCount = 0;
var runCount = 0;
var runsInPlay = 0;
var firstBase = false;
var secondBase = false;
var thirdBase = false;
var img = "BatterUp.png";
var team = "Top";
var inning = 1;
var awayScore = 0;
var homeScore = 0;

//Constants
var homerunSummary = "Homerun! ";
var singleSummary = "Single. ";
var doubleSummary = "Double. ";
var tripleSummary = "Triple. ";
var thirdScores = "Runner on third scores. ";
var secondScores = "Runner on second scores. ";
var firstScores = "Runner on first scores. ";
var batterScores = "Batter scores. ";
var secondToThird = "Runner advances from second to third. "
var firstToSecond = "Runner advances from first to second. ";
var firstToThird = "Runner advances from first to third. ";
var batterToFirst = "Batter to first. ";
var batterToSecond = "Batter to second. ";
var batterToThird = "Batter to third. ";


/**
 * Creates 1 of 21 random results of a pitch and routes it to the next function.
 * Calls function to end the play after routines processed
 * @returns void
 */
function pitch(){
    var num = Math.floor(Math.random() * 21) + 1;
    
    play = "";
    
    if(num >= 1 && num <= 6){
        play = playHit(num);
    }else if(num >= 7 && num <= 16){
        play = playOut(num);
    }else{
        play = playNoHit(num);
    }
    
    endPlay(play);
}

/**
 * Determines the results of a hit and returns a summary.
 * @param {int} num
 * @returns {string} play
 */
function playHit(num){
    play = "";
    
    if(num === 1){
        play = playHomerun();
    }else if (num === 2 || num === 3 || num === 4){
        play = playSingle();
    }else if (num === 5){
        play = playDouble();
    }else{
        play = playTriple();
    }
    
    return play;
}

/**
 * Determines the results of an out and returns a summary.
 * @param {int} num
 * @returns {string} play
 */
function playOut(num){
    play = "";
    
    if(num === 7 || num === 8){
        play = playPopOut();
        //play Popout
    }else if(num === 9 || num === 10 || num === 11 || num === 12){
        play = playGroundOut();
    }else{
        play = playFlyOut();
    }
    
    return play;
}

/**
 * Determines the results of a play with no hit or out and returns a summary.
 * @param {int} num
 * @returns {string} play
 */
function playNoHit(num){
    play = "";
    
    if(num === 15 || num === 16){
        play = playStrike("Strike");
    }else if(num === 17 || num === 18){
        play = playStrike("Foul");
    }else if(num === 19 || num === 20){
        play = playBall();
    }else{ //Base on Error
        play = playTakeBase("Base on Error. ");
    }
    
    return play;
}

/**
 * Determines results of specific hit: Homerun
 * Returns a summary.
 * @returns {string} summary
 */
function playHomerun(){
    clearBallsAndStrikes();
    var summary = homerunSummary;    
    summary += threeBaseAdvance();
    summary += batterScores;
    runsInPlay++;
    return summary;
}

/**
 * Determines results of specific hit: Single
 * Returns a summary.
 * @returns {string} summary
 */
function playSingle(){
    clearBallsAndStrikes();
    var summary = singleSummary;
    summary += oneBaseAdvance();
    summary += batterToFirst;
    firstBase = true;
    return summary;
}

/**
 * Determines results of specific hit: Double
 * Returns a summary.
 * @returns {string} summary
 */
function playDouble(){
    clearBallsAndStrikes();
    var summary = doubleSummary;
    summary += twoBaseAdvance();
    summary += batterToSecond;
    secondBase = true;
    return summary;
}

/**
 * Determines results of specific hit: Triple
 * Returns a summary.
 * @returns {string} summary
 */
function playTriple(){
    clearBallsAndStrikes();
    var summary = tripleSummary;
    summary += threeBaseAdvance();
    summary += batterToThird;
    thirdBase = true;
    return summary;
}

/**
 * Determines results of pitch called as a Ball
 * Returns a summary.
 * @returns {string} summary
 */
function playBall(){
    ballCount++;
    var summary = "";
    if(ballCount === 4){
        ballCount = 0;
        summary = playTakeBase("Walk. ");
    }else{
        summary = "Ball";
    }
    return summary;
}

/**
 * Determines the reults of a Walk.
 * Returns a summary
 * @param {string} play
 * @returns {string} summary
 */
function playTakeBase(play){
    clearBallsAndStrikes();
    var summary = play;
    if(firstBase){
        if(thirdBase && secondBase){
            summary += thirdScores + secondScores;
            runsInPlay++;
        }else if(!thirdBase && secondBase){
            summary += secondToThird;
            thirdBase = true;
        }else if(!thirdBase && !secondBase){
            summary += firstToSecond;
            secondBase = true;
        }
    }else{
        firstBase = true;
    }
    summary += batterToFirst;
    return summary;
}

/**
 * Processes the results of a pop out.
 * @returns {String} "Pop Out" as summary of the out.
 */
function playPopOut(){
    clearBallsAndStrikes();
    outCount++;
    return "Pop Out";
}

/**
 * Processes results of a fly out.
 * Determines if tagging up at a base is an option.
 * Returns summary of the play.
 * @returns {String} summary
 */
function playFlyOut(){
    clearBallsAndStrikes();
    outCount++;
    var summary = "Fly Out. ";
    //Tag up in reverse order: third, second, first
    if(outCount < 3){
        if(thirdBase){
            summary += tagUpThird();
        }
        if(!thirdBase && secondBase && outCount < 3){
            summary += tagUpSecond();
        }
        if(!secondBase && firstBase && outCount < 3){
            summary += tagUpFirst();
        }
    }    
    
    return summary;
}

/**
 * Determines the results of a tag up at third base.
 * Returns a summary of the play.
 * @returns {String} summary
 */
function tagUpThird(){
    var tagThird = confirm("Tag up third base?");
    var summary = "";
    
    if(tagThird){
        var tag = Math.floor(Math.random() * 2);
        if (tag < 1){
            runsInPlay++; 
            summary += "Runner at third tags up and scores. ";
        }else{
            outCount++;
            summary += "Runner at third tags up and is thrown out. ";
        }
        thirdBase = false;
    }
    return summary;
}

/**
 * Determines the results of a tag up at second base.
 * Returns a summary of the play.
 * @returns {String} summary
 */
function tagUpSecond(){
    var tagSecond = confirm("Tag up second base?");
    var summary = "";
    
    if(tagSecond){
        var tag = Math.floor(Math.random() * 2);
        if (tag < 1){
            thirdBase = true;   
            summary += "Runner at second tags up and makes it to third. ";
        }else{
            outCount++;           
            summary += "Runner at second tags up and is thrown out. ";
        }
        secondBase = false;
    }
    return summary;
}

/**
 * Determines the reults of a tag up at first base.
 * Returns a summary of the play.
 * @returns {String} summary
 */
function tagUpFirst(){
    var tagFirst = confirm("Tag up first base?");
    var summary = "";
    
    if(tagFirst){
        var tag = Math.floor(Math.random() * 2);
        if (tag < 1){
            secondBase = true;       
            summary += "Runner at first tags up and makes it to second. ";
        }else{
            outCount++;         
            summary += "Runner at first tags up and is thrown out. ";
        }
        firstBase = false;
    }
    return summary;
}

/**
 * Determines the results of a play being a strike or foul.
 * Returns a summary of the play.
 * @param {string} play
 * @returns {string} play
 */
function playStrike(play){
    if(play === "Foul" && strikeCount < 2){
        strikeCount++;        
    }else if(play === "Foul" && strikeCount > 1){
        return play;
    }else{
        strikeCount++;
    }    
    
    if(strikeCount > 2){
        outCount++;
        strikeCount = 0;
    }
    return play;
}

/**
 * Determines the reults of a ground out.
 * Returns a summary of the play.
 * @returns {String} summary
 */
function playGroundOut(){
    clearBallsAndStrikes();
    var summary = "";
    if(firstBase && secondBase){
        outCount += 3;        
        summary += "Triple Play! Runner out at third.  Runner out at second. Runner out at first.";
    }else if(firstBase){
        outCount += 2;
        summary += "Double Play! Runner out at second. Runner out at first.";
    }else{
        summary += "Ground out.";
        outCount++;
    }
    
    return summary;
}

/**
 * Determines the results of an attempt to steal second base.
 * Ends the play with a summary.
 * @returns void
 */
function stealSecond(){
    firstBase = false;
    var summary = "";
    var steal = Math.floor(Math.random() * 2); 
    if(steal < 1){
        //runner caught        
        outCount++;
        summary = "Runner caught stealing.";
    }else{
        //runner advances
        secondBase = true;
        summary = "Runner steals second.";
    }
    endPlay(summary);
}

/**
 * Determines the results of an attempt to steal second base.
 * Ends the play with a summary.
 * @returns void
 */
function stealThird(){
    secondBase = false;
    var summary = "";
    var steal = Math.floor(Math.random() * 2); 
    if(steal < 1){
        //runner caught        
        outCount++;
        summary = "Runner caught stealing.";
    }else{
        //runner advances
        thirdBase = true;
        summary = "Runner steals third.";
    }
    endPlay(summary);
}

/**
 * Updates the image of the field depending on the men on base.
 * @returns void
 */
function updateImage(){
    if (!firstBase && !secondBase && !thirdBase){
        img = "BatterUp.png";
    }else if(firstBase && !secondBase && !thirdBase){
        img = "OneOn.png";
    }else if(firstBase && secondBase && !thirdBase){
        img = "TwoOn.png";
    }else if(firstBase && secondBase && thirdBase){
        img = "Loaded.png";
    }else if(!firstBase && secondBase && !thirdBase){
        img = "Double.png";
    }else if(!firstBase && !secondBase && thirdBase){
        img = "Triple.png";
    }else if(firstBase && !secondBase && thirdBase){
        img = "Corners.png";
    }else if(!firstBase && secondBase && thirdBase){
        img = "SecondAndThird.png";
    }    
    document.getElementById("field").src = "images/" + img;
}

/**
 * Updates global variables and UI based on results of a play.
 * @param {string} play
 * @returns void
 */
function endPlay(play){ 
    incrementRunCounts();
    updateScoreBoard(play);
    
    if(outCount > 2){
        clearBases();
        clearBallsAndStrikes();
        outCount = 0;
        
        alert (play + "Inning Change!");
        
        switchInnings();
    }
    
    runsInPlay = 0;
    updateCountsDisplay();
    updateStealing();
    updateImage();
    
}

/**
 * Clears all men from bases.
 * @returns void
 */
function clearBases(){
    firstBase = false;
    secondBase = false;
    thirdBase = false;
}

/**
 * Updates UI to show which half of the inning is being played.
 * Triggers end game calculations at end of 9th inning.
 * TODO: Add logic for not playing bottom of 9th when home team is winning.
 * TODO: Add logic for extra innings.
 * TODO: break out trigger for end game functions.
 * @returns void
 */
function switchInnings(){
    document.getElementById(team).style.backgroundColor = "";
    document.getElementById(inning).style.backgroundColor = "";
    runCount = 0;
    
    if(team === "Top"){
        team = "Bottom";
    }else{
        team = "Top";
        inning++;
    }

    if(inning < 10){
        document.getElementById(team).style.backgroundColor = "yellow";
        document.getElementById(inning).style.backgroundColor = "yellow";
    }else{
        endRegularGame();
    }    
}

/**
 * Clears global variables for balls and strikes.
 * @returns void
 */
function clearBallsAndStrikes(){
    ballCount = 0;
    strikeCount = 0;
}

/**
 * Enables UI options to steal bases as determined by player positions.
 * @returns void
 */
function updateStealing(){
    //update stealing options
    if(firstBase && !secondBase){
        document.getElementById("secondSteal").disabled = false;
    }else{
        document.getElementById("secondSteal").disabled = true;
    }
    
    if(secondBase && !thirdBase){
        document.getElementById("thirdSteal").disabled = false;
    }else{
        document.getElementById("thirdSteal").disabled = true;
    }
}

/**
 * Updates UI of scoreboard and summary of last play.
 * @param {string} play
 * @returns void
 */
function updateScoreBoard(play){
    
    document.getElementById("play").innerHTML = "Last Play: " + play;
       
    document.getElementById(team+inning).innerHTML = runCount;       
    
    if(team === "Top"){
        document.getElementById("TopTotal").innerHTML = awayScore;
    }else{
        document.getElementById("BottomTotal").innerHTML = homeScore;
    }   
}

/**
 * Updates UI displays of counts for strikes, balls, and outs.
 * @returns void
 */
function updateCountsDisplay(){
    document.getElementById("strikes").innerHTML = "Strikes: " + strikeCount;
    document.getElementById("balls").innerHTML = "Balls: " + ballCount;
    document.getElementById("outs").innerHTML = "Outs: " + outCount; 
}

/**
 * Determines results of advancement for up to three bases off a hit, walk, or BOE.
 * Returns summary of the play.
 * @returns {String} summary
 */
function threeBaseAdvance(){
    var summary = "";
    if(thirdBase){
        summary += thirdScores;
        runsInPlay++;
        thirdBase = false;
    }
    if(secondBase){
        summary += secondScores;
        runsInPlay++;
        secondBase = false;
    }
    if(firstBase){
        summary += firstScores;
        runsInPlay++;
        firstBase = false;
    }
    
    return summary;
}

/**
 * Determines results of advancement for up to two bases off a hit.
 * Returns summary of the play.
 * @returns {String} summary
 */
function twoBaseAdvance(){
    var summary = "";
    if(thirdBase){
        summary += thirdScores;
        runsInPlay++;
        thirdBase = false;
    }
    if(secondBase){
        summary += secondScores;
        runsInPlay++;
        secondBase = false;
    }
    if(firstBase){
        summary += firstToThird;
        thirdBase = true;
        firstBase = false;
    }
    return summary;
}

/**
 * Determines results of advancement for one base off a hit.
 * Returns summary of the play.
 * @returns {String} summary
 */
function oneBaseAdvance(){
    var summary = "";
    if(thirdBase){
        summary += thirdScores;
        runsInPlay++;
        thirdBase = false;
    }
    if(secondBase){
        summary += secondToThird;
        thirdBase = true;
        secondBase = false;
    }
    if(firstBase){
        summary += firstToSecond;
        secondBase = true;
    }
    return summary;
}

/**
 * Calculates winner of the game based on total score of each team.
 * Alerts player(s).
 * @returns void.
 */
function endRegularGame(){    
    document.getElementById("pitch").disabled = true;
    
    if(awayScore > homeScore){
        alert("Away Team Wins!");
    }else{
        alert("Home Team Wins!");
    }
}
 
 /**
  * Increments global variable for run count for a team for the inning.
  * Increments global variable for run count for a team's total score.
  * Both are determined by gloabl variable for the number of runs in a play.
  * @returns void
  */
function incrementRunCounts(){
    runCount += runsInPlay;
    
    if(team === "Top"){
        awayScore += runsInPlay;
    }else{
        homeScore += runsInPlay;
    }
}
