class FrontLine {
	constructor(game){
		this._openSide = new SetArray();
		this._closedSide = new SetArray();
		this.game = game;
	}
	
	updateFront(tile){
		let neighbours = this.game.getNeighbours(tile)
		this._closedSide.delete(tile);
		this._openSide.delink(tile);		
		neighbours.filter(x=>!x.isOpen).forEach(x=>this._closedSide.add(x));
		this.linkNeighbours(tile, neighbours.filter(x=>x.isOpen));	
	}
	
	linkTiles(closedTile, openTile){
		this._closedSide.link(closedTile, openTile);
		this._openSide.link(openTile, closedTile);
	}
	
	linkNeighbours(closedTile, neighbours){
		for (let neighbour in neighbours){
			this._closedSide.link(closedTile, neighbour);
			this._openSide.link(neighbour, closedTile);
		}
	}
	
	cleanupOpenSide(){
		
	}
	
	get closedSide(){
		return this._closedSide.tiles;
	}
	
	get openSide(){
		return this._openSide.tiles;
	}
}