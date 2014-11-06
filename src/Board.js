// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
     hasRowConflictAt: function(rowIndex){
      var total = _.reduce(this.get(rowIndex+''), function(sum, value){
        return sum + value;
      }, 0);
      return (total > 1);
    },

    hasAnyRowConflicts: function(){
      var conflicts = [];
      for (var i = 0; i < this.get('n'); i++){
        conflicts.push(this.hasRowConflictAt(i));
      }
      return _.some(conflicts);
      //iterate of all rows in the board. _.any with rowConflict
      //run hasRowConflictAt on n
    },

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex){
      var total = 0,
          n = this.get('n');

      for(var row = 0; row < n; row++){   //go through each row, and add cell value @colIndex to total
        total += this.get(row)[colIndex];
      }

      return total > 1;
    },

    hasAnyColConflicts: function(){
      var results = [];
      for (var i = 0; i < this.get('n'); i++){
        results.push(this.hasColConflictAt(i));
      }
      return _.some(results); 
    },







    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
     hasMajorDiagonalConflictAt: function(row,column,n,sum,flag){
      flag = flag || false;
      sum = sum || 0;

      sum += this.get(row)[column];
      flag = sum>1;
      if (!flag && row+1<n && column+1<n){
        flag = this.hasMajorDiagonalConflictAt(row+1,column+1,n,sum,flag);
      }
      return flag;
    },

    hasAnyMajorDiagonalConflicts: function(){
      var n = this.get('n');
      var flag = false;
      for (var column = 0; column < n-1; column++){
        flag = flag || this.hasMajorDiagonalConflictAt(0,column,n);
      }
      for (var row = 1; row < n-1; row++){
        flag = flag || this.hasMajorDiagonalConflictAt(row,0,n);
      }
      return flag;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(r,c,n,sum,flag){
      flag = flag || false;
      sum = sum || 0;

      sum += this.get(r)[c];
      flag = sum>1;
      if (!flag && r+1<n && c-1>=0){
        flag = this.hasMinorDiagonalConflictAt(r+1,c-1,n,sum,flag);
      }
      return flag;
    },

    hasAnyMinorDiagonalConflicts: function(){
      var n = this.get('n');
      var flag = false;
      for (var c = 1; c < n; c++){
        flag = flag || this.hasMinorDiagonalConflictAt(0,c,n);
      }
      for (var r = 1; r < n-1; r++){
        flag = flag || this.hasMinorDiagonalConflictAt(r,n-1,n);
      }
      return flag;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
