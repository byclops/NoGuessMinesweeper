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
	//initGame();

	let game = new GameBoard(16,30,15, gameSymbols)
	$('#game').append(game.html);
	// console.log(a.game);

	

}

function generateField(rows, cols, fieldDb){
	let result = $('<table>').attr('id','game');
	//.val('😊☻') sun: ☀
	result.append($('<th>')
		.attr("colspan",cols+1)
		.append($('<span>')
			.attr('id','time-counter')
			.text('000')
			.addClass('timer'))
		.append($('<input type="button">')
			.val(gameSymbols.startGame)
			.attr('id','btnNewGame')
			.addClass('btnNewGame'))
		.append($('<span>')
			.attr('id','mine-counter')
			.text(parseNumToStr(fieldDb.mineCount))
			.addClass('bombCount')))
	for (let row=0; row<rows; row++){
		let currentRow = $('<tr>').attr("row-num",row);
		for (let col=0; col<cols; col++){
			currentRow.append($('<td>')
				.append($('<input type="button">')
					.val(fieldDb.game[row][col].hasMine?gameSymbols.mine:' ')
					.addClass("game-tile closed-tile")
					.attr("row",row)
					.attr("col",col)
					.on("mousedown",function(event){
						switch(event.which){
							case 1: 	//leftClick
								if (!timer) startTimer();
								if ($(this).is('.marked-tile, .open-tile')) break;
								$(this)
									.toggleClass('closed-tile open-tile')
									.val(" ");
								break;
							case 3:		//rightClick
								let markedBombs = Number($('#mine-counter').text());
								if ($(this).hasClass('open-tile')) break;
								if ($(this).val()==gameSymbols.flag){
									$(this).val(" ");
									$('#mine-counter').text(parseNumToStr(markedBombs+1));
								} else {
									if(markedBombs==0) break;
									$(this).val(gameSymbols.flag);
									$('#mine-counter').text(parseNumToStr(markedBombs-1));
								}
								
								
								$(this).toggleClass('marked-tile closed-tile');
								break;
						}						
					})
				)
			);
		}
		
		result.append(currentRow);
	}
	return result;
}

function initGame(){

	window.clearInterval(timer);
	timer = null;
    let fieldDb = new GameBoard(16,30,99);
    fieldDb.plantMines();
	let fieldHtml = generateField(15,30,fieldDb);
	$('#game').empty();
	$('#game').append(fieldHtml);
	$('#btnNewGame').click(initGame);
}

function startTimer(){

	timer = window.setInterval(function(){
	let count = Number($('#time-counter').text());
	if (count<999){
		$('#time-counter').text(parseNumToStr(count+1));
	}
	}, 1000);
}

function parseNumToStr(num){
	return ('00'+String(num)).slice(-3);
}
