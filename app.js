var columns;
var rows;
var gridW;
var color;
var current;
var painting;
var selecting;
var erasing;
var isDown;
var start;
var css;
var fileNameOriginal;
var fileName;
var margins;
var dividor;
var wrapperW;
var wrapperH;

function init() {
	start = {};
	css = {};
	margins = "ON";
	dividor = 27;
	painting = true;
	color = "#000000";
	fileNameOriginal = "Best drawing. Ever.";
	$(document).on("mouseup", function () {
		isDown = false;
	});
}

$(document).on("ready", init());

// painting function
function paint() {
	if (painting) {
		current.css("background-color", color);
		current.html("");
	}
}

// function that actually erases
function erase() {
	current.css("background-color", "#fff");
	current.html("x");
}

// grid events
function gridEvents() {
	$(".grid_square").on("mousedown", function () {
		current = $(this);
		if (painting) {
			paint();
			isDown = true;
		}
		if (erasing) {
			erase();
			isDown = true;
		}
	});

	$(".grid_square").on("mouseover", function () {
		current = $(this);
		current.css("opacity", 0.92);
		if (isDown) {
			if (painting) { paint(); }
			if (erasing) { erase(); }
		}
	});

	$(".grid_square").on("mouseout", function () {
		current.css("opacity", 1);
		current = undefined;
	});

	$(".grid_square").on("click", function () {
		if (selecting) {
			start.pixel = this;
			$("#submit_start_pixel").html("CHANGE START PIXEL");
			$("#export_alert").css("display", "block");
		}
	});
}

function drawGrid() {
	gridW = 0;
  // making sure grid is empy
	$("#grid").empty();

	// adding rows to grid
	for (i = 1; i < rows + 1; i += 1) {
		$("#grid").append("<div class='row'>");
	}

	// adding columns to grid (adding squares to rows)
	for (i = 1; i < columns + 1; i += 1) {
		$(".row").append("<div class='grid_square'>");
		gridW += 27;
	}

	// setting div of grid so that margin:auto works
	$("#grid").width(gridW);

	// adding x to squares
	$(".grid_square").html("x");

	gridEvents();
}

function newFile() {
	columns = $("#columns_nr").val();
	if (columns === "") {
		alert("how many columns will your file have?");
		return;
	}
	columns = parseInt(columns, 10);
	rows = $("#rows_nr").val();
	if (rows === "") {
		alert("how many rows will your file have?");
		return;
	}
	rows = parseInt(rows, 10);

	wrapperW = columns * 25;
	wrapperH = rows * 25;

	fileNameOriginal = $("#file_name").val();
	if (fileNameOriginal === "") {
		alert("you need to give your file a name!");
		return;
	}
	$("title").html(fileNameOriginal);

	$(".alert#new_alert").css("display", "none");
	actualAlert = undefined;
	drawGrid();
}

function selectColor() {
	// setting color to selected by user
	color = $("#select_color").val();
	$(".alert#color_alert").css("display", "none");
	actualAlert = undefined;
	painting = true;
	erasing = false;
	selecting = false;
}

// function to start the eraser
function startEraser() {
	painting = false;
	erasing = true;
	selecting = false;
}

// selecting the "start pixel", the pixel where the shadow will come from
function selectStartPixel() {
	selecting = true;
	erasing = false;
	painting = false;
	$("#export_alert").css("display", "none");
}

function downloadFile() {
	var download;
	start.pixel = $("#grid div:nth-child(1) div:nth-child(1)");

	// calculate distances between squares, works like a family where the center of the
	// family tree is the start pixel
	start.sib = $(start.pixel).siblings();
	start.papa = $(start.pixel).parent();
	start.papa.sib = $(start.papa).siblings();
	for (n = 0; n < start.papa.sib.length; n += 1) {
		start.papa.sib[n].sons = $(start.papa.sib[n]).children();
		for (i = 0; i < start.papa.sib[n].sons.length; i += 1) {
			start.papa.sib[n].sons[i].distance = {
				side: Math.round(($(start.pixel).offset().left - $(start.papa.sib[n].sons[i]).offset().left) / dividor),
				top: Math.round(($(start.pixel).offset().top - $(start.papa.sib[n].sons[i]).offset().top) / dividor)
			};
		}
	}

	for (i = 0; i < start.sib.length; i += 1) {
		start.sib[i].distance = {
			side: Math.round(($(start.pixel).offset().left - $(start.sib[i]).offset().left) / dividor),
			top: 0
		};
	}

	// creating css code
	css.code = [];
	for (i = 0; i < start.sib.length; i += 1) {
		if (!($(start.sib[i]).html() === "x")) {
			start.sib[i].code = ((-1 * start.sib[i].distance.side * 25) + "px") + " " + ((-1 * start.sib[i].distance.top * 25) + "px") + " 0 " + $(start.sib[i]).css("background-color") + " ";
			css.code.push(start.sib[i].code);
		}
	}
	for (n = 0; n < start.papa.sib.length; n += 1) {
		for (i = 0; i < start.papa.sib[n].sons.length; i += 1) {
			if (!($(start.papa.sib[n].sons[i]).html() === "x")) {
				start.papa.sib[n].sons[i].code = ((-1 * start.papa.sib[n].sons[i].distance.side * 25) + "px") + " " + ((-1 * start.papa.sib[n].sons[i].distance.top * 25) + "px") + " 0 " + $(start.papa.sib[n].sons[i]).css("background-color") + " ";
				css.code.push(start.papa.sib[n].sons[i].code);
			}
		}
	}

	// creating file to download and downloading it
	if ($(start.pixel).html() === "x") {
		html = "<div class='wrapper' id=\"wrapper\"><div class='pixel' id=\"startPixel\"></div></div><style>.wrapper#wrapper{width: " + wrapperW + "px; height: " + wrapperH + "px; } .pixel#startPixel{width: 25px; height: 25px; box-shadow: " + css.code + ";} </style>";
	} else {
		html = "<div class='wrapper' id=\"wrapper\"><div class='pixel' id=\"startPixel\"></div></div><style>.wrapper#wrapper{width: " + wrapperW + "px; height: " + wrapperH + "px; } .pixel#startPixel{background-color: " + $(start.pixel).css("background-color") + "; width: 25px; height: 25px; box-shadow: " + css.code + ";} </style>";
	}
	download = new File([html], "download.txt", { type: "text/plain;charset=utf-8" });
	saveAs(download, fileName);

	$("#export_alert").css("display", "none");
	actualAlert = undefined;
	selecting = false;
}

// to download file as html
function downloadHtml() {
	fileName = fileNameOriginal + ".html";
	downloadFile();
}

// to download file as txt
function downloadTxt() {
	fileName = fileNameOriginal + ".txt";
	downloadFile();
}

function toggleMargins() {
	if (margins === "ON") {
		margins = "OFF";
		$("#margins span").html("MARGINS " + margins);
		$(".row").css("height", "25px");
		$(".grid_square").css("border", "none");
		dividor = 25;
	} else {
		margins = "ON";
		$(".row").css("height", "27px");
		$(".grid_square").css("border", "1px solid #222");
		$("#margins span").html("MARGINS " + margins);
		dividor = 27;
	}
}
