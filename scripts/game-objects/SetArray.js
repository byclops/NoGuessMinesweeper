class SetArray{
	constructor(){
		this._set = new Set();
		this._links = {};
		
	}
	
	add(tile){
		this._set.add(tile)
		this._links[tile.id] = [];
	}
	
	delete(tile){
		this._set.delete(tile);
		delete this._links[tile.id];
	}
	
	link(keyTile, linkTile){
		if (!this._set.has(keyTile)) this.add(keyTile);
		this._links[keyTile.id].push(linkTile);
	}
	
	// linkMultiple(keyTile, tileArray){
		// tileArray.forEach(x=>this.link(keyTile,x));
	// }
	
	delink(linkTile){	
		for (let key in this._links){
			let index = this._links[key].indexOf(linkTile);
			this._links[key].splice(index,1);
			if (this._links[key].length == 0){
				delete this._links[key];
				this._set.delete(linkTile);
			}
		}
	}
	
	get tiles(){
		return this.set;
	}

}