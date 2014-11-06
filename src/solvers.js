/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function(size){
  // console.log(n);
  var solution = [];
  // debugger;
  var newBoard = new Board({'n':size});
  var recurseRow = function(row, column){
    newBoard.togglePiece(row,column);
    if (newBoard.hasAnyRooksConflicts()){ 
      newBoard.togglePiece(row,column);
      if (column+1 < size){
        recurseRow(row, column+1);
      } else if (row+1 === size){
        // return solution;
        //counter++;
      } else {
        recurseRow(row+1, 0);
      }
    } else { // if it doesn't fail the tests, do this
      if (row+1 === size){ // if we're on row 1, then 2 is not greater than 2 --> false --> return solution
        // return solution;
      } else {
        recurseRow(row+1, 0);
      }
    }
  }; 
  recurseRow(0,0);
  var finalSolution = [];
  for (var i = 0; i < size; i++){
    finalSolution.push(newBoard.attributes[i]);
  }
   console.log('Single solution for ' + size + ' rooks:', finalSolution);
  return finalSolution;
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(size){
  var board = new Board({'n':size});
  var counter = size === 0? 1 : 0;
  function check(row){ 
    for (var column=0;column<size;column++){ 
      board.togglePiece(row,column);
      if(!board.hasColConflictAt(column)){
        if(row+1<size){  
          check(row+1); 
        } else {    
          counter++;
        }
      }
      board.togglePiece(row,column); 
    }
  }
  check(0);
  return counter;
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
