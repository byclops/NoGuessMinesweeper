const gameSymbols = {
	startGame:'😊',
	// startGame:'☻',
	lost:'😱',
	won:'😃',
	mine:'☀',
	mineDetailed:'💣',
	flag:'⚑',
	flag2:'⚐',
	xMark: '✖',

};

let timer=null;

function startApp(){
	let game = new GameBoard(16,30,99, gameSymbols)
	$('#game').append(game.html);
	$('#game').append($(`
	<div id="myModal" class="modal">
		<div class="modal-content">
			<p>Game paused. Click anywhere to resume.</p>
		</div>
	</div>
	`));
	
	$('.x-button').click(game.pauseGame.bind(game));
	$('.modal').click(game.pauseGame.bind(game));
	$('#show-borderBtn').on('mousedown', function(){
		$(Array.from(game.border.closedTiles).map(x=>x.html)).toggleClass('highlighted-tile');
		console.log(Array.from(game.border.closedTiles));
	})
	$('#show-borderBtn').on('mouseup', function(){
		$(Array.from(game.border.closedTiles).map(x=>x.html)).toggleClass('highlighted-tile');
			console.log('up');
	})
	$(window).blur(game.pauseGame.bind(game));
	//window.resizeTo(800, 600);
}

