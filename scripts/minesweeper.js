const gameSymbols = {
	startGame:'😊',
	// startGame:'☻',
	lost:'😱',
	won:'😃',
	mine:'☀',
	mineDetailed:'💣',
	flag:'⚑',
	flag2:'⚐',

};

let timer=null;

function startApp(){
	let game = new GameBoard(16,30,99, gameSymbols)
	$('#game').append(game.html);
	//window.resizeTo(800, 600);
}

