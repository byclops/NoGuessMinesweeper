class TileLink{
	constructor(){
		this.db = {};
		
	}
	
	add(tile){
		this.db[tile.id] = [];
	}
	
	delete(tile){
		delete this.db[tile.id];
	}
	
	link(keyTile, linkTile){
		this.db[keyTile.id].push(linkTile);
		
	}
	
	delink(linkTile){
		for (let key in db){
			let index = this.db[key].indexOf(linkTile);
			this.db[key].splice(index,1);
			if (this.db[key].length == 0){
				delete this.db[key];
			}
		}
	}

}