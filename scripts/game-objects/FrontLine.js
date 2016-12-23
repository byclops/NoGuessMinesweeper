class FrontLine {
	constructor(gameBoard){
		this.db =[];
		this.gameBoard = gameBoard;
	}
	
	contains(tile){
		for (let fragment of db){
			if (fragment.contains(tile)) {
				return true;
			}
		}

		return false;
	}
	
	
	add(tile){
		let closedNeighbours = this.gameBoard.getNeighbours(tile).filter(x=>!x.isOpen);
		//if (this.contains(tile))
		for (let fragment of db) {
			if ()
		}

		
	}

}