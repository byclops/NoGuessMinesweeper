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
        // this.timerText ='000';
        // this.flagsText = this.formatNum(mineCount);
        this.timerHandler = null;
        this.flags = $('<span>')
            .attr('id','mine-counter')
            .text(this.formatNum(this.mineCount))
            .addClass('bombCount');
        this.html = $('<table>')
            .attr('id','game')
            .append($('<th>')
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
                .append(this.flags));

        this._init();

        // this.startTimer();

        // this.game = this.generateField();
        // this.getNeighbours(15,29).forEach(x=>x.toggleMark());
        // this.game[0][0].open();


        // this.plantMines();
        // this.updateFlagCount(1);
        // console.log(this.flagsText)


        // console.log(this.game);
        // this.game.forEach(
        //     line =>line.forEach(
        //         tile => tile.html.val(tile.bombCount)));
        // this.game.forEach(
        //     line =>line.forEach(
        //         tile =>{if (tile.hasMine) tile.open()}));

        // this.game.forEach(
        //     line =>line.forEach(
        //         tile =>tile.open()));
    }

    _init(){
        $('#btnNewGame').val(this.symbols.startGame);
        this.gameStarted = false;
        this.clearTimer();
        this.freeTilesLeft = this.maxRows * this.maxCols - this.mineCount;
        this.flags.text(this.formatNum(this.mineCount));
        this.board = this.generateField();
        // this.plantMines();
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
        this.html.find('tr').remove();
        this.gameOver = false;

        let result = [];
        for (let row=0; row<this.maxRows; row++){
            result[row]=[];
            let currentRow = $('<tr>');
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
		//console.log('hi')
		//console.dir($(this.selectedTiles.map(x=>x.html)));
		$(this.selectedTiles.map(x=>x.html))
			.toggleClass('closed-tile open-title');
	}

    updateFlagCount(delta){
        let newValue = Number(this.flags.text()) + delta;
        this.flags.text(this.formatNum(newValue));
    }

    startTimer(){
        this.timerHandler = window.setInterval(function(){
            let count = Number($('#time-counter').text());
            if (count<999){
                $('#time-counter').text(parseNumToStr(count+1));
            }
        }, 1000);
    }

    stopTimer(){
        window.clearInterval(this.timerHandler);
        this.timerHandler = null;
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

