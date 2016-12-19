/**
 * Created by nikolai on 12/16/16.
 */
class GameTile{
    constructor(row, col, game){
        this.row = row;
        this.col = col;
        this.game = game;
        this.bombCount = ' ';
        this.hasMine = false;
        this.isOpen = false;
        this.isMarked = false;
        this.html= $('<input type="button">')
            .addClass("game-tile closed-tile")
            .attr("row",row)
            .attr("col",col)
            .val(' ')
            .on("mousedown", this._handleMouseClick.bind(this, arguments));

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
            this.isOpen=true;
            if (!this.game.timerHandler && !this.game.gameOver) this.game.startGame();
            this.game.freeTilesLeft--;
            if (this.game.freeTilesLeft==0) this.game.gameWon();
            if (this.bombCount) this.html.val(this.bombCount);
            this.html.toggleClass('closed-tile');
            this.html.addClass(`open-tile open-tile-${this.bombCount}`);
            if (this.bombCount==0) this.game.cascadeOpen(this.row, this.col);
        }
    }

    _handleMouseClick(bindObj, evt){
        if(this.game.gameOver) return;

        switch(evt.which){
            case 1:
                this.open();
                break;
            case 3:
                this.toggleMark();
                break;
        }
    }


}