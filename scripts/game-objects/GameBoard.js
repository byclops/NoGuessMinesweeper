/**
 * Created by nikolai on 12/16/16.
 */
class GameBoard{
    constructor(maxRows,maxCols,mineCount,symbols){
        this.symbols = symbols;
        this.maxRows = maxRows;
        this.maxCols = maxCols;
        this.mineCount = mineCount;
        this.freeTilesLeft = maxRows*maxCols-mineCount;
        this.gameStarted = false;
        this.gameOver = false;
		this.leftClickActive = false
		this.rightClickActive = false;
		this.selectedTile =  null;
        this.timerHandler = null;
        this.flags = $('<span>')
            .attr('id','mine-counter')
            .text(this.formatNum(this.mineCount))
            .addClass('bombCount');
        this.html = $('<table>')
            .attr('id','game')
            .append($('<tr>')
                .append($('<th>')
                    .addClass('title-bar')
                    .text('NoGuess Minesweeper')))
            .append($('<tr>')
                .append($('<th>')
                    .addClass('menu-bar')
                    .append($('<ul>')
                        .append($('<li>')
                            .addClass('dropdown')
                            .append($('<a href="#">')
                                .addClass('dropdown')
                                .text('Game'))
                            .append($('<div>')
                                .addClass('dropdown-content')
                                .append($('<a href="#">')
                                    .text('New Game'))
                                .append($('<a href="#">')
                                    .text('Difficulty'))))
                        .append($('<li>')
                            .addClass('dropdown')
                            .append($('<a href="#">')
                                .addClass('dropdown')
                                .text('Help'))
                            .append($('<div>')
                                .addClass('dropdown-content')
                                .append($('<a href="#">')
                                    .text('About'))
                                .append($('<a href="#">')
                                    .text('How to play')))))))

                    // .append($('<a href=#>').text('Game').addClass('menu-item'))
					// .append($('<a href=#>').text('Difficulty').addClass('menu-item'))
					// .append($('<a href=#>').text('Statistics').addClass('menu-item'))
                    //
                    // .append($('<div>')
                     //    .addClass('dropdown-content')
                     //        .append($('<a href=#>')
                     //            .text('Help')
                     //            .addClass('menu-item')))
					// .append($('<a href=#>')
                     //    .text('Login')
                     //    .addClass('menu-item')
                     //    .css('float','right'))))
            .append($('<tr>')
                .append($('<th>')
                    .addClass('control-bar')
                    .attr("colspan",this.maxCols+1)
                    .append($('<span>')
                        .attr('id','time-counter')
                        .text('000')
                        .addClass('timer'))
                    .append($('<input type="button">')
                        .val(gameSymbols.startGame)
                        .attr('id','btnNewGame')
                        .addClass('btnNewGame')
                        .click(this._init.bind(this)))
                    .append(this.flags)));

        this._init();

    }

    _init(){
        $('#btnNewGame').val(this.symbols.startGame);
        this.gameStarted = false;
        this.clearTimer();
        this.freeTilesLeft = this.maxRows * this.maxCols - this.mineCount;
        this.flags.text(this.formatNum(this.mineCount));
        this.board = this.generateField();
    }

    plantMines(){
        let minesLeft = this.mineCount;
        while (minesLeft>0){
            let row = Math.round(Math.random()*(this.maxRows-1));
            let col = Math.round(Math.random()*(this.maxCols-1));
            if((!this.board[row][col].hasMine) && (!this.board[row][col].isOpen)){
                this.board[row][col].hasMine= true;
                minesLeft--;
            }

        }

        this.updateMineCounts();

    }

    startGame(){
        this.plantMines();
        this.startTimer();
        this.gameStarted = true;
    }

    updateMineCounts(){
        this.board.forEach(
            line =>line.forEach(
                tile => tile.bombCount=
                    (this.getNeighbours(tile.row,tile.col).filter(x=>x.hasMine)).length));
    }

    generateField(){
        this.html.find('.tile-row').remove();
        this.gameOver = false;

        let result = [];
        for (let row=0; row<this.maxRows; row++){
            result[row]=[];
            let currentRow = $('<tr>').addClass('tile-row');
            for (let col=0; col<this.maxCols; col++){
                let currentTile = new GameTile(row, col,this);
                result[row][col]= currentTile;
                currentRow.append(currentTile.html);

            }

            this.html.append(currentRow);
        }

        return result;
    }


    gameLost(){
        this.stopTimer();
        this.gameOver = true;
        this.gameStarted = false;
        $('#btnNewGame').val(this.symbols.lost);


        this.board.forEach(
            line=>line.filter(x=>x.hasMine)
                .forEach(tile=>tile.open()));
    }

    gameWon(){
        this.stopTimer();
        $('#btnNewGame').val(this.symbols.won);
        alert(`You won! Your time: ${Number(this.html.find('#time-counter').text())} seconds.`);
    }

    cascadeOpen(row, col){
        for (let neighbour of this.getNeighbours(row,col)){
            neighbour.open();
        }
    }

    getNeighbours(row, col){
        let result =[];
        let coordMap = [
            [row+1, col],
            [row+1, col-1],
            [row, col-1],
            [row-1, col-1],
            [row-1, col],
            [row-1, col+1],
            [row, col+1],
            [row+1, col+1]];

        for (let coordPair of coordMap){
            if (coordPair[0]>=0 &&
                coordPair[0]<this.maxRows &&
                coordPair[1]>=0 &&
                coordPair[1]<this.maxCols)
                    result.push(this.board[coordPair[0]][coordPair[1]])
        }

        return result;
    }
	
	uncoverSelection(){
		let neighbours = this.getNeighbours(this.selectedTile.row, this.selectedTile.col);
		if (neighbours.filter(x=>x.isMarked).length==this.selectedTile.bombCount){
			neighbours.forEach(x=>x.open());
		} else {
			this.deselectTiles();	
		}
	}
	
	selectNeighbours(tile){
		this.selectedTile = tile;
		let neighbours = this.getNeighbours(tile.row, tile.col);
		$(neighbours.filter(x=>!(x.isMarked || x.isOpen)).map(y=>y.html))
			.toggleClass('closed-tile open-title');
	}
	
	deselectTiles(){
		let neighbours = this.getNeighbours(this.selectedTile.row, this.selectedTile.col);
		$(neighbours.filter(x=>!(x.isMarked || x.isOpen)).map(y=>y.html))
			.toggleClass('closed-tile open-title');
		this.selectedTile =  null;
	}
	
	highlightTiles(){
		$(this.selectedTiles.map(x=>x.html))
			.toggleClass('closed-tile open-title');
	}

    updateFlagCount(delta){
        let newValue = Number(this.flags.text()) + delta;
        this.flags.text(this.formatNum(newValue));
    }

    startTimer(){
        this.timerHandler = window.setInterval(this.incrementTimer.bind(this), 1000);
    }

    stopTimer(){
        window.clearInterval(this.timerHandler);
        this.timerHandler = null;
    }

    incrementTimer(){
        let count = Number($('#time-counter').text());
        if (count<999){
            $('#time-counter').text(this.formatNum(count+1));
        }
    }

    clearTimer(){
        this.stopTimer();
        this.html.find('#time-counter').text('000');

    }

    flagsLeft(){
        if (this.flags.text()==0) return false;
        else return true;
    }

    formatNum(num){
        return ('00'+String(num)).slice(-3);
    }

}

