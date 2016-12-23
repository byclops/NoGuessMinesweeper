class DoubleLinkedList{
	constructor(startNode, endNode){
		this.start = new TerminatorNode();
		this.end = new TerminatorNode();
		this.start.next = this.end;
		this.end.prev = this.start;
		// if (startNode) this.insertAfter(start, startNode);
		if (startNode) {
			this.start.next = startNode;
			if (endNode) {
				this.end.prev = endNode;
			} else {
				this.end.prev = startNode;
			}
		}
	}
	
	get first(){
		return this.start.next;
	}
	
	get last(){
		return this.end.prev;
	}
	
	insertNode(existingNode, newNode){
		newNode.next = existingNode.next;
		newNode.prev = existingNode;
		existingNode.next = newNode;
	}
	
	insertChain(existingNode, chain){
		chain.first.prev = existingNode;
		existingNode.next = chain.first;
		
	}
	
	//insertBefore(existingNode, newNode){
	//	newNode.prev = existingNode.prev;
	//	newNode.next = existingNode;
	//	existingNode.prev = newNode;
	//}
	
	append(node){
		this.insertAfter(this.last,node);
	}
	
	prepend(node){
		this.insertBefore(this.first, node);
	}
	
	join(linkedList){
		this.last.next = linkedList.first;
		linkedList.first.prev = this.last;
	}
	
	split(node){
		let newList = new DoubleLinkedList(node.next, this.last);
		this.end.prev = node.prev;
		return newList;
		// let newStart = new TerminatorNode();
		// let newEnd = new TerminatorNode();
		// node.prev.next = new TerminatorNode();
		// node.next.prev = new TerminatorNode();
	}
	
	//splitAfter(node){
	//	
	//}
	
	containsNode(node){
		let target = node.payload;
		let currentNode = this.first
		while(currentNode.payload != target && !currentnode.terminator){
			currentNode = currentNode.next;
		}
		
		if (currentNode.payload == target) return true;
		else return false;
	}
	
	
}