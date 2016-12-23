class FrontLine {
	constructor(game){
		this.openSide = new Set();
		this.closedSide = new Set();
		this.links = {};
		this.game = game;
	}
	
	addNeighbours(tile){
		let neighbours = this.game.getNeighbours(tile)
		this.closedSide.delete(tile);
		for (let key in this.links){
			let index = this.links[key].indexOf(tile);
			this.links[key].splice(index,1);
			if (this.links[key].length == 0){
				//alert('0!')
				delete this.links[key];
				this.openSide.delete(tile);
				console.log(tile)
			}
		}
		//this.openSide.foreEach(x=>x.delete(tile));
		//this.openSide.foreEach(x=>if ());
		neighbours.filter(x=>!x.isOpen).forEach(x=>this.closedSide.add(x));
		for (let neighbour of neighbours.filter(x=>x.isOpen)){
			this.openSide.add(tile);
			let key = `${neighbour.row},${neighbour.col}`;
			if (this.links[key]) this.links[key].push(tile);
			else this.links[key] = [tile];	
			//this.links[key] = tile;
		
		}
		//neighbours.filter(x=>x.isOpen).forEach(y=>this.openSide.add(y));
		
	}
	
	//get openSide(){
	//	let result = new Set();
	//	for (let tile of this.closedSide){
	//		this.game.getNeighbours(tile).filter(x=>x.isOpen).forEach(y=>result.add(y));
	//	}
	//	return result;
	//}

}