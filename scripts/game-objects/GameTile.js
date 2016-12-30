/**
 * Created by nikolai on 12/16/16.
 */
class GameTile{
    constructor(row, col, game){
        this.row = row;
        this.col = col;
        this.id = row*game.maxCols+col;
        this.game = game;
        this.bombCount = 0;
        this.hasMine = false;
        this.isOpen = false;
        this.isMarked = false;
		this.isFront = false;
        this.html= $('<input type="button">')
            .addClass("game-tile closed-tile")
            .attr("row",row)
            .attr("col",col)
            .val(' ')
			.on("mousedown", this._handleMouseDown.bind(this, arguments))
            .on("mouseup", this._handleMouseUp.bind(this, arguments));

    }

    toggleMark(){

        if (this.isOpen) return;

        if (this.isMarked){
            this.isMarked =false;
            this.html.val(' ');
            this.html.toggleClass('marked-tile closed-tile');
            this.game.updateFlagCount(1);
        } else {
            if (!this.game.flagsLeft()) return;
            this.isMarked = true;
            this.html.val(this.game.symbols.flag);
            this.html.toggleClass('marked-tile closed-tile');
            this.game.updateFlagCount(-1);
        }
    }

    open(){
		//console.dir(this.game.getTileById(this.id));
        if (this.isMarked || this.isOpen) return;
        if (this.hasMine) {
            this.isOpen = true;
            this.html.val(this.game.symbols.mineDetailed);
            if (!this.game.gameOver){
                this.html.toggleClass('exploded-tile-origin closed-tile');
                this.game.gameOver=true;
                this.game.gameLost();
            } else {
                this.html.toggleClass('exploded-tile closed-tile');
            }

        } else {

			this.game.frontLine.updateFront(this);
			
			//for (let tile of this.game.frontline.openside) {
			//	if (this.game.getneighbours(tile).filter(x=>this.game.frontline.closedside.has(x)).length==0) {
			//		this.game.frontline.openside.delete(tile);
			//	}
			//}
			
            this.isOpen=true;
            if (!this.game.timerHandler && !this.game.gameOver) this.game.startGame();
            this.game.freeTilesLeft--;
            if (this.game.freeTilesLeft==0) this.game.gameWon();
            if (this.bombCount) this.html.val(this.bombCount);
            this.html.toggleClass('closed-tile');
            this.html.addClass(`open-tile open-tile-${this.bombCount}`);
            if (this.bombCount==0) this.game.cascadeOpen(this);
        }
    }

	_handleMouseDown(bindObj, evt){
        if(this.game.gameOver) return;

        switch(evt.which){
            case 1:
                this.game.leftClickActive = true;
				//console.log('leftDown');
                break;
            case 3:
                this.game.rightClickActive = true;
				//console.log('rightDown');
                break;
        }
		if (this.game.leftClickActive && 
			this.game.rightClickActive)
			this.game.selectNeighbours(this);
    }
	
    _handleMouseUp(bindObj, evt){
        if(this.game.gameOver) return;
		//let primaryAction = true;
		if(this.game.leftClickActive && this.game.rightClickActive) {
			//primaryAction= false;
			//alert('double');
			this.game.leftClickActive = false;
			this.game.rightClickActive = false;
			this.game.uncoverSelection();
		}
		
        switch(evt.which){
            case 1:
                //if (primaryAction) this.open();
				this.open();
				this.game.leftClickActive = false;
				//console.log('leftUp');
                break;
            case 3:
                //if (primaryAction) this.toggleMark();
				this.toggleMark();
				this.game.rightClickActive = false;
				//console.log('rightUp');
                break;
        }
    }


}