/* DICHIARAZIONE VARIABILI GLOBALI */
var w;
var h;
var upfix_h;
var dwfix_h;
var main_h;
var loader_h;
var loader_top;
var loader_w;
var loader_left;
var modale_h;
var modale_top;
var modale_w;
var modale_left;
/* Toggle-ing #docarea and #proprieties  */
/* Screen state variable */
var screenState;
var screenStateResponsive;
var is_main;
/* = 0 ---> normal */
/* = 1 ---> no #docarea */
/* = 2 ---> no #proprieties */
/* = 3 ---> no #docarea and no #proprieties */

/* Selection */
var sel_text;
var selected;

var savedSpan = "";
var spancount = 0;
/*ajax*/
var elenco=[];/*conterrà l'elenco dei link per accedere ai documenti*/
var tab_id;/*serve per associare ad ogni titolo della docarea una tab su cui inserire il contenuto*/
var totale;
var colortabid;
var scroll_text;
var annotadocumento;
var annotaframmento;
var classi=[];
var switcher_bool;
var user_annota_doc=[];/*qui mi salvo le annotazioni da salvare*/
var id_user_annota_doc;/*un id per distinguere ogni singola annotazione da salvare*/
var user_annota_fram=[];/*qui mi salvo le annotazioni da salvare*/
var id_user_annota_fram;/*un id per distinguere ogni singola annotazione da salvare*/
var user_actual_document;


/*$(document).bind('touchmove', function(e) {
	e.preventDefault();
});*/

$(document).ready(function(){
	id_user_annota_fram=0;
	id_user_annota_doc=0;
	is_main = 1;
	getDim();/*imposto le misure*/	
	caricalista();/*carica la lista dei documenti (chiama molte funzioni importanti)*/
	switcher();/* reader/annotator (da completare)*/
	animations();
	filtrodocumento();
	filtroframmento();
	user_newdocnote();
	user_newframnote();
	saveall();


});
/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
ROBE PREVALENTEMENTE GRAFICHE
switcher()=mdoalità reader/annotator
animations()=gestisce le animazioni
cambiacolore()=per la docarea
scorritesto()=per la docarea
getDim()=fantastica. Responsive fatto completamente a mano con metodo onresize (chiamato nell'html sul body)
*/

function switcher() {
	switcher_bool=0;
	$("#reader_ico").click(function(){
		switcher_bool=0;
		$("#reader_ico").css("background-color","#99CCCC");
		$("#annotator_ico").css("background-color","#E0E0E0");
		$("#reader_ico").attr("src","images/reader_ico.png");
		$("#annotator_ico").attr("src","images/annotator_disabled_ico.png");
		$("#mode_txt").text("Reader Mode");
		$("#minihelp-save").css("display","none");
		$("#user_saveall").css("display","none");
		$("#user_removeall").css("display","none");
		$("#menu_ico").css("visibility","hidden");
		$("#menuframmento").addClass("ui-state-disabled");
   		$("#menudocumento").addClass("ui-state-disabled");
  	});
	$("#annotator_ico").click(function(){
	switcher_bool=1;
		$("#reader_ico").css("background-color","#E0E0E0");
		$("#annotator_ico").css("background-color","#99CCCC");
		$("#reader_ico").attr("src","images/reader_disabled_ico.png");
		$("#annotator_ico").attr("src","images/annotator_ico.png");
		$("#mode_txt").text("Annotator Mode");
   		$("#menudocumento").removeClass("ui-state-disabled");
   		$("#minihelp-save").css("display","block");
   		$("#menu_ico").css("visibility","visible");
   		$(".nano").nanoScroller();
   		$.each(user_annota_doc, function(i,obj){if(obj!=0){$("#user_saveall").fadeIn();$("#user_removeall").fadeIn();}});
   		$.each(user_annota_fram, function(i,obj){if(obj!=0){$("#user_saveall").fadeIn();$("#user_removeall").fadeIn();}});
   		

   		
	});
}

function animations() {
	/* Layout Effects Begin */
	screenState = 0;

	$("#mainToggle").click(function(){
		if (is_main){
			$("#docToggle").fadeOut(500);
			$("#docIco").fadeOut(500);
			$("#mainToggle").text("Vai all'Articolo");
			$('html, body').animate({scrollTop:$(document).height()}, 1250);
			is_main = 0;
		}
		else if (!is_main){
			$("#docToggle").fadeIn(500);
			$("#docIco").fadeIn(500);
			$("#mainToggle").text("Vai ai Metadati");
			$('html, body').animate({scrollTop:0}, 500);
			is_main = 1;
		}
	});

	$("#about_btn").click(function (){
		$("#main").fadeOut(625);
		$("#main-meta").fadeOut(625);
		$("header").delay(500).slideUp(500);
		$("#widgetarea").delay(250).slideUp(250);
		$("#main-about").delay(625).fadeIn(625);
	});

	$("#help_btn").click(function (){
		$("header").css("min-height","0");
		$("#widgetarea").css("min-height","0");
		$("#main").fadeOut(625);
		$("#main-meta").fadeOut(625);
		$("header").delay(500).slideUp(500);
		$("#widgetarea").delay(250).slideUp(250);
		$("#main-help").delay(625).fadeIn(450);
	});

	$("#about-return").click(function(){
		$("#main").fadeIn(625);
		$("#main-meta").fadeIn(625);
		$("header").slideDown(500);
		$("#widgetarea").slideDown(250);
		$("#main-about").fadeOut(625);
	});
	$("#help-return").click(function(){
		$("#main").fadeIn(625);
		$("#main-meta").fadeIn(625);
		$("header").slideDown(500);
		$("#widgetarea").slideDown(250);
		$("#main-help").fadeOut(625);
	});
	
	/* Controls on #docToggle button click */
	$("#docIco").click(function (){
		if(screenState == 0 || screenState == 2){
			$("#docIco").attr("src", "images/toggle_ico_right.png");
			$("#docToggle").fadeOut(250).delay(350).fadeIn(250);
			$("#tabs section .nano-content").fadeOut(250).delay(350).fadeIn(250);
			$("#docmain .nano-content").delay(250).toggle("slide", { direction: "left" }, 250);
			$("#tabs section").delay(350).queue(function(){ 
		   		$(this).css("width","100%");
				$("#tabs section").dequeue();
				$("#docToggle").text("Mostra Documenti");
			});
			screenState = screenState + 1;
		}
		else if(screenState == 1 || screenState == 3){
			$("#docIco").attr("src", "images/toggle_ico_left.png");
			$("#docToggle").fadeOut(250).delay(350).fadeIn(250);
			$("#tabs section .nano-content").fadeOut(250).delay(350).fadeIn(250);
			$("#docmain .nano-content").delay(250).toggle("slide", { direction: "left" }, 250);
			$("#tabs section").delay(350).queue(function(){ 
		   		$(this).css("width","80%");
				$("#tabs section").dequeue();
				$("#docToggle").text("Nascondi Documenti");
			});
			screenState = screenState - 1;
		}
	});	

	/* Controls on #proToggle button click */
	$("#proIco").click(function(){
		if(screenState == 0 || screenState == 1){
			$("#proIco").attr("src", "images/toggle_ico_left.png");
			$("#proToggle").fadeOut(250).delay(350).fadeIn(250);
			$("#tabs section .nano-content").fadeOut(250).delay(350).fadeIn(250);
			$("#metaarea .nano-content").fadeOut(250).delay(350).fadeIn(250);
			$("#properties").delay(250).toggle("slide", { direction: "right" }, 250);
			$("#sidemeta").delay(250).toggle("slide", { direction: "right" }, 250);
			$("#tabs").delay(350).queue(function(){ 
				$(this).css("width","100%");
				$("#tabs").dequeue();
				$("#proToggle").text("Mostra Filtri Annotazioni");
			});
			$("#metaarea").delay(350).queue(function(){ 
			 	$(this).css("width","100%");
				$("#metaarea").dequeue();
			});
			screenState = screenState + 2;
		}
		else if(screenState == 2 || screenState == 3){
			$("#proIco").attr("src", "images/toggle_ico_right.png");
			$("#proToggle").fadeOut(250).delay(350).fadeIn(250);
			$("#tabs section .nano-content").fadeOut(250).delay(350).fadeIn(250);
			$("#metaarea .nano-content").fadeOut(250).delay(350).fadeIn(250);
			$("#properties").delay(250).toggle("slide", { direction: "right" }, 250);
			$("#sidemeta").delay(250).toggle("slide", { direction: "right" }, 250);
			$("#tabs").delay(350).queue(function(){ 
			 	$(this).css("width","80%");
				$("#tabs").dequeue();
				$("#proToggle").text("Nascondi Filtri Annotazioni");
			});
			$("#metaarea").delay(350).queue(function(){ 
			 	$(this).css("width","65%");
				$("#metaarea").dequeue();
			});
			screenState = screenState - 2;
		}
	});
	/* Layout Effects End */

	$("#menu_ico").click(function(){
		$("#menu").slideDown(200);
		if( (getSelectionText()=="") || (getSelectionText()==" ") ) $("#menu div").css("display","none");
		else $("#menu div").fadeIn(200);
	});
	$("#menu img").click(function(){
		$("#menu").slideUp(200);
	});
	    /*svuoto il contenitore con l'help perchè mi serve quello spazio per inserire le annotazioni fatte ma da salvare*/
    $('.inseriscidoc').click(function() { 
    	$('.darimuovere').remove();
    	$("#user_removeall").click(function(){
    		removeall();
    	});
	});
    $('.inseriscifram').click(function() { 
    	$('.darimuovere').remove();
    	$("#user_removeall").click(function(){
    		removeall();
    	});
     });

    /*BACKMODAL*/
    /*imopsto la backmodal per far scomparire la modale una volta cliccata e disabilitare ogni evento sui bottoni delle modali*/
    $("#backmodal").click(function(){
	$("#modale").fadeOut(200);
	$("#modale .nano-content").empty();/*ricontrollare se da problemi*/
	$("#backmodal").fadeOut(200);
	$( "#aggiungi").unbind( "click" );
	$("#user_salva").unbind( "click" );
	$("#user_elimina").unbind( "click" );
	});

    /*DATEPIcker*/
	$( "#filter-doc-date" ).datepicker();
	$( "#filter-fram-date" ).datepicker();
}

function avoidhref(){
	$("#documento a").attr("href","javascript: void(0)");
	$("#metadati a").attr("href","javascript: void(0)");
}

/*gestisce i colori della docarea, il documento selezionato è azzurro, gli altri sono piu scuri*/
function cambiacolore(id) {
	var temp= "#" + id;
	var temp2= "#" + colortabid;
	$(temp2).css("background",'url("../images/bg.gif") repeat scroll 0 0 #222930');
	$(temp).css("background",'url("../images/fixed.gif") repeat-x scroll center top #5EAEB7');
	colortabid=id;
}

function scorritesto(){
	$('.scrtxtcontainer').hover(
		function () {
			var $elmt = $(this);
			$elmt.find('.scrtxtholder').css({ "overflow":"visible", "text-decoration":"underline" });
			scroll_text = setInterval(function(){scrollText($elmt);}, 20);
		},
		function () {
			clearInterval(scroll_text);
			$(this).find('.scrtxtholder').css({ "left":"0", "overflow":"hidden", "text-overflow":"ellipsis", "text-decoration":"none" });
		}
	);
	var scrollText = function($elmt){
		var limit = 1200;
		var left = $elmt.find('.scrtxtholder').position().left - 1;
		if (-left >= limit) {
			left = -limit;
		}
		$elmt.find('.scrtxtholder').css({ left: left });
	};
}
function getDim() {
	w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	upfix_h = $("header").outerHeight(true);
	dwfix_h = $("#widgetarea").outerHeight(true);
	loader_h = $("#loader").outerHeight(true);
	loader_w = $("#loader").outerWidth(true);
	modale_h = $("#modale").outerHeight(true);
	modale_w = $("#modale").outerWidth(true);
	main_h = h - upfix_h - dwfix_h;
	loader_top = (h - loader_h)/2;
	loader_left = (w - loader_w)/2;
	modale_top = (h - modale_h)/2;
	modale_left = (w - modale_w)/2;
	$("body").css("height",h + main_h);
	$("body").css("width",w);
	$("#main").css("top",upfix_h);
	$("#main").css("height",main_h);
	$("#main-meta").css("top",upfix_h + main_h);
	$("#main-meta").css("height",main_h);
	$("#ann-document").css("height",$("#sidemeta").outerHeight(true) - $("#ann-filters").outerHeight(true));
	$("#loader").css("top",loader_top);
	$("#loader").css("left",loader_left);
	$("#modale").css("top",modale_top);
	$("#modale").css("left",modale_left);
	$("#minihelp-save").css("height", ( $("#properties").outerHeight(true) - ( $("#fram-filters").outerHeight(true) + $("#save-remove_btn").outerHeight(true) ) ) );
	if (is_main) { $('html, body').animate({scrollTop:0}, 0); }
	if (!is_main) { $('html, body').animate({scrollTop:$(document).height()}, 0); }
	if (w > 800){
		$("#proIco").attr("src", "images/toggle_ico_right.png");
		$("#proToggle").text("Nascondi Filtri Annotazioni");
		$("#docIco").attr("src", "images/toggle_ico_left.png");
		$("#docToggle").text("Nascondi Documenti");
		screenStateResponsive = 2;
	}
	else if (512 < w <= 800){
		$("#proIco").attr("src", "images/toggle_ico_left.png");
		$("#proToggle").text("Mostra Filtri Annotazioni");
		$("#docIco").attr("src", "images/toggle_ico_left.png");
		$("#docToggle").text("Nascondi Documenti");
		screenStateResponsive = 1;
	}
	else if (w <= 512){
		$("#proIco").attr("src", "images/toggle_ico_left.png");
		$("#proToggle").text("Mostra Filtri Annotazioni");
		$("#docIco").attr("src", "images/toggle_ico_right.png");
		$("#docToggle").text("Mostra Documenti");
		screenStateResponsive = 0;
	}
	$(".nano").nanoScroller();
}
/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
OFFSETs, SELEZIONI 
#####getSelectionParentElement()=da titolo
#####getSelectionOffsets(elem)=passiamo la precedente a questa, ed abbiamo gli offsets start e end calcolati 
								sul div padre.
####Getselectiontext()=alla fine ci serve solo per discriminare se c'è o meno selezione attiva (per gestire
						il menu e disabilitare o abilitare la possibilità di annotare sul frammento)

####Wraptext()=serve a parsare l'html e ad inserire gli span per le annotazioni sul frammento. Viene chiamata
				dalla annotafram e chiama la offsetconversion
####Offsetconversion()=converte l'offset relativo al text in offset relativo all'html
*/
/*  Valori vettore offsets   */
/*  0 = startOffset dopo     */
/*  1 = endOffset dopo       */
/*  2 = Situazione           */
/*  3 = tempOffset_1         */
/*  4 = tempOffset_2         */

var savedSpan = "";
var spancount = 0;
function wrapText(divid, fstart, fend, tipo, univoco){
    $("#" + divid).html(function(i,oldHtml) {
    	var offsets = [];
    	offsets = offsetConversion(oldHtml,fstart,fend,divid);
    	var fstartdopo = offsets[0];
    	var fenddopo = offsets[1];
    	var length = fenddopo - fstartdopo;
    	var newSpan = '<span id="' + univoco + '" class="' + tipo + '">';
    	var annidateSpan = '<span style="background-color:#FFFF8D" class="annidate">';
        var closedspan = "";
    	if (offsets[2] === 0){ /* Annotazione Semplice */
          
    		return 	oldHtml.substr(0,fstartdopo) + newSpan +
            		oldHtml.substr(fstartdopo, length) + "</span>" +
            		oldHtml.substr(fenddopo);
        }
        if (offsets[2] === 1){ /* startOffset fuori, endOffset dentro ad annotazione presente */
           
        	return	oldHtml.substr(0,fstartdopo) + newSpan +
        			oldHtml.substr(fstartdopo, offsets[3] - fstartdopo) + annidateSpan +
        			oldHtml.substr(offsets[3], fenddopo - offsets[3]) + "</span></span></span>" + savedSpan +
        			oldHtml.substr(fenddopo);
        }
        if (offsets[2] === 2){ /* startOffset + endOffset fuori ad annotazione presente */
          
        	return 	oldHtml.substr(0,fstartdopo) + newSpan +
        			oldHtml.substr(fstartdopo, offsets[3] - fstartdopo) + annidateSpan +
        			oldHtml.substr(offsets[3], offsets[4] - offsets[3]) + "</span>" +
        			oldHtml.substr(offsets[4], fenddopo - offsets[4]) + "</span>" +
        			oldHtml.substr(fenddopo);
        }
        if (offsets[2] === 3){ /* startOffset dentro, endOffset fuori ad annotazione presente */
           
        	return	oldHtml.substr(0,fstartdopo) + closedspan + newSpan + annidateSpan +
        			oldHtml.substr(fstartdopo, offsets[3] - fstartdopo) + "</span>" + newSpan +
        			oldHtml.substr(offsets[3], fenddopo - offsets[3]) + "</span>" +
        			oldHtml.substr(fenddopo);
        }
        if (offsets[2] === 4){ /* startOffset + endOffset dentro ad annotazione presente */
          
        	return	oldHtml.substr(0,fstartdopo) + newSpan + annidateSpan +
        			oldHtml.substr(fstartdopo, length) + "</span></span>" +
        			oldHtml.substr(fenddopo);
        }
    });
}

function offsetConversion(content,fstart,fend,divid){
	var i, j, k;
    var primo = 0;
    var tempCount = 0;
	var res = [];
    savedSpan = "";
    bool_chiusoaperto = 0;
    bool_chiusoapertoend = 0;
    spancount = 0;
    for (k = 0; k <= 4; k++) res[k]=0;
	for (j = 0; j < fstart; j++){
		if ( ((content[j] === "<" ) && (content[j+1] !== " ")) || (bool_chiusoaperto === 1) ){
			if ( content.substr(j+1, 9 + divid.length) == ('span id="' + divid ) ) {
                spancount++;
                res[2] = 4;
            }
			if ( content.substr(j+1, 5) == "/span" ){
                spancount--;
				if ( (res[2] === 4) && (spancount == 0) ) {
                    res[2] = 0;
                }
			}
			while (content[j-1]!== ">") { 
                fstart++; 
                fend++; 
                j++; 
            } 
            if (bool_chiusoaperto === 1){
                fstart++; 
                fend++; 
                j++;
                bool_chiusoaperto = 0;
            }
            if (content[j] === "<")
                bool_chiusoaperto = 1;
		}
	}
	res[0] = j;
	for (i = j; i < fend; i++){
		if ( ((content[i] === "<") && (content[i+1] !== " ")) || (bool_chiusoapertoend === 1) ) {
			if ( content.substr(i+1, 9 + divid.length) == ('span id="' + divid ) ) { if (!primo) { res[2] = 1; res[3] = i; primo = 1; } }
			if ( content.substr(i+1, 5) == "/span" ){
				if ( (res[2] === 1) || (res[2] === 2) ) { res[2] = 2; res[4] = i; }
				if (res[2] === 4) { res[2] = 3; res[3] = i + 7; }
			}
			while (content[i-1]!==">") { 
				fend++; i++;
				if (res[2] === 1) { tempCount++; savedSpan += content[i-1]; }
			} 
            if (bool_chiusoapertoend === 1){
                fstart++; 
                fend++; 
                j++;
                bool_chiusoapertoend = 0;
            }
            if (content[i] === "<")
                bool_chiusoapertoend = 1;
		}
	}
    if (res[2] === 1) { res[3]+=tempCount; }
	res[1] = i;
	return res;
}

function getSelectionParentElement() {
    var parentEl = null, sel;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            parentEl = sel.getRangeAt(0).commonAncestorContainer;
            if (parentEl.nodeType != 1) {
                parentEl = parentEl.parentNode;
            }
        }
    } else if ( (sel = document.selection) && sel.type != "Control") {
        parentEl = sel.createRange().parentElement();
    }
    return parentEl;
}
function getSelectionOffsets(element) {
    var start = 0, end = 0;
    var sel, range, priorRange;
    if (typeof window.getSelection != "undefined") {
        range = window.getSelection().getRangeAt(0);
        priorRange = range.cloneRange();
        priorRange.selectNodeContents(element);
        priorRange.setEnd(range.startContainer, range.startOffset);
        start = priorRange.toString().length;
        end = start + range.toString().length;
    } else if (typeof document.selection != "undefined" &&
            (sel = document.selection).type != "Control") {
        range = sel.createRange();
        priorRange = document.body.createTextRange();
        priorRange.moveToElementText(element);
        priorRange.setEndPoint("EndToStart", range);
        start = priorRange.text.length;
        end = start + range.text.length;
    }
    return {
        start: start,
        end: end
    };
}
function getSelectionText() {
	var text = "";
	if (window.getSelection) {
		text = window.getSelection().toString();
	} else if (document.selection && document.selection.type != "Control") {
		text = document.selection.createRange().text;
	}
	return text;
}

/*!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
CARICAMENTO LISTA DOCUMENTI E DOCUMENTI STESSI
caricadocumento()=serve a caricare i documenti
caricalista()=serve a caricare la lista dei titoli
*/

function caricadocumento(data) {
	user_actual_document=data;
	$("#tabs section .nano-content").empty();/*svuoto eventuale roba contenuta nella tab*/
	$("#loader").fadeIn("fast");
	$.ajax({
		type: 'GET',/*prima get. serve per riempire la mainarea con l'articolo (solo con quello, senza metadati)*/
		dataType: 'html',
		url: "../cgi-bin/maindoc.py",
		data: {link:data},/*passo il link con cui fare la open*/
		success: function (d) {
			$("#tabs section .nano-content").append(d);/*inserisco l'articolo*/
			$("#loader").fadeOut("fast");
			$(".nano").nanoScroller(); /*solito scroller che si aggiorna*/  
			annotadoc(data);
			annotafram(data);
			getDim();
			avoidhref();        
		},
		error: function (request, status, error) {
			alert("errore");
		}
	});
	$.ajax({
		type: 'GET', /*con questa chiedo solo i metadati*/
		dataType: 'html',
		url: "../cgi-bin/metadoc.py",
		data: {link:data},
		success: function (d) {
			$('#metaarea section .nano-content').empty();
			$('#metaarea section .nano-content').append(d);
			$(".nano").nanoScroller();
			getDim();
			avoidhref();
		},
		error: function (request, status, error) {
			alert("errore");
		}
	});
}

function caricalista() {
	$("#loader").fadeIn("fast");
	$.ajax({
		type: 'GET', /*richiedo lista link documenti*/
		dataType: 'json',
		url: "../cgi-bin/getlinks.py",        
		success: function (d) {
			$.each(d, function(idx,obj) {
				totale=d.length;
				elenco[idx]=obj.linkss;
				$.ajax({
					type: 'GET', /*prima get. serve per riempire la mainarea con l'articolo (solo con quello, senza metadati)*/
					dataType: 'json',
					url: "../cgi-bin/gettitle.py",
					data: {link:elenco[idx]},
			        /*passo il link con cui fare la open*/
					success: function (d2) {
						$.each(d2, function(idx2,obj2) {
							$('#docarea').append('<li id="' + idx + '" class="scrtxtcontainer"><a class="scrtxtholder" href="#tab-' + idx + '" title="' + obj2.titolo + '">' + obj2.titolo + "</a></li>");
							getDim();
							if(idx==totale-1){
								tab_id=$("#docarea li a").first().attr("href");
								tab_id= parseInt(tab_id.substring(5));/*ottengo dalla stringa es. "#tab-13"  l'intero "13"*/						
								$("#docarea li").first().css("background",'url("../images/fixed.gif") repeat-x scroll center top #5EAEB7');
								colortabid=tab_id;
								caricadocumento(elenco[tab_id]); /*carico il primo documento come doc di default*/  
								$("#docarea li a").click(function(){/*al click di ogni link appeso corrisponde la giusta richiesta al server*/
									tab_id=$(this).attr("href");/*acquisisco l'attributo #tab-id dal link cliccato dall'utente*/
									tab_id= parseInt(tab_id.substring(5));/*ottengo dalla stringa es. "#tab-13"  l'intero "13"*/
									cambiacolore(tab_id);
									caricadocumento(elenco[tab_id]);/*faccio la richiesta al server passando il link. passo anche l'id per fare l'append nella tab*/
								});
								scorritesto();
								$("#main").css({ "visibility":"visible" });
								$("#main-meta").css({ "visibility":"visible" });
							}
						});
					},
			        error: function (request, status, error) {
						alert("errore in caricalista, dopo il gettitle.py" + idx);
					}
				});
			});
			$(".nano").nanoScroller();/*solo ORA chiamo il nanoscoller che si adatterà al contenuto della docarea*/
		},
		error: function (request, status, error) {
			alert("errore in caricalista, dopo il getlinks.py");
		}
	});
}


function annotadoc(data){
	$.ajax({
		type: 'GET', 
		dataType: 'json',
		data: {link:data},
		url: "../cgi-bin/annotazionidocumento.py",
		success: function (d) {
			annotadocumento=d;
			$("#filter-doc-author").empty();
			$("#filter-doc-author").append("<option>Tutti gli autori</option>");
			$(".sidecontentdinamic").empty();
			$("#numdoc").empty();
			$("#numdoc").append("N° Annotazioni sull' intero documento: " + d.length );
			var autoriaggiunti=[];
			$.each(d, function(idx,obj) {
				if (autoriaggiunti.indexOf(obj.annotatore["value"])<0){
						autoriaggiunti.push(obj.annotatore["value"]);
						$("#filter-doc-author").append("<option>" + obj.annotatore["value"] + "</option>");
				}
				switch (obj.tipo["value"]) {
			        case "hasAuthor":
				        if (obj.nomevero){
				            $("#autore").append(obj.nomevero["value"] + '<br>');
				            break;
				         }
				         else break;
			        case "hasPublisher":
			            if (obj.nomevero){
			            	$("#editore").append(obj.nomevero["value"] + '<br>');
			            }
			            else $("#editore").append(obj.ann["value"] + "ANNOTATOMALE" + '<br>');
			            break;
			        case "hasPublicationYear":
			            $("#annopubblicazione").append(obj.ann["value"] + '<br>' );
			            break;
			        case "hasTitle":
			            $("#titolodocumento").append(obj.ann["value"] + '<br>' );
			            break;
			        case "hasAbstract":
			            $("#abstract").append(obj.ann["value"] + '<br><br>' );
			            break;
			        case "hasShortTitle":
			            $("#titolobreve").append(obj.ann["value"] + '<br>' );
			            break;
			        case  "hasComment":
			            $("#commento").append(obj.ann["value"] + '<br><br>' );
			            break;
			    }
				var x="annotazione : " + obj.ann["value"] + "tipo : " + obj.tipo["value"] + "annotatore : " + obj.annotatore["value"] + "data : " + obj.dataann["value"];
			});
			$(".nano").nanoScroller();
		},
		error: function (request, status, error) {
			alert("errore");
		}
	});

	}




function filtrodocumento(){
	$("#filter-doc-date").change(function(){
		var filtdata= $("#filter-doc-date").datepicker("option","dateFormat", "yy-mm-dd").val();
		$(".sidecontentdinamic").empty();
		$.each(annotadocumento, function(idx,obj) {
			var str= obj.dataann["value"];
			var temp3=str.substring(0,10); 
			if (filtdata <= temp3){
				switch (obj.tipo["value"]) {
					case "hasAuthor":
						if (obj.nomevero) $("#autore").append(obj.nomevero["value"] + '<br>' );
			            break;
					case "hasPublisher":
						if (obj.nomevero) $("#editore").append(obj.nomevero["value"] + '<br>' );
						break;
					case "hasPublicationYear":
						$("#annopubblicazione").append(obj.ann["value"] + '<br>' );
						break;
					case "hasTitle":
						$("#titolodocumento").append(obj.ann["value"] + '<br>' );
						break;
					case "hasAbstract":
						$("#abstract").append(obj.ann["value"]) + '<br>' ;
						break;
					case "hasShortTitle":
						$("#titolobreve").append(obj.ann["value"]) + '<br>' ;
						break;
					case  "hasComment":
						$("#commento").append(obj.ann["value"]) + '<br>' ;
						break;
				}
			}
		});
	});
	
	$("#filter-doc-author").change(function(){
		$(".sidecontentdinamic").empty();
		$.each(annotadocumento, function(idx,obj){
				
		    if ((obj.annotatore["value"] == $("#filter-doc-author").val() ) || ( $("#filter-doc-author").val() == "Tutti gli autori") ) {
         		switch (obj.tipo["value"]) {
					case "hasAuthor":
			            $("#autore").append(obj.nomevero["value"] + '<br>' );
			            break;
					case "hasPublisher":
					    $("#editore").append(obj.nomevero["value"] + '<br>' );
					    break;
					case "hasPublicationYear":
					    $("#annopubblicazione").append(obj.ann["value"] + '<br>' );
					    break;
					case "hasTitle":
					    $("#titolodocumento").append(obj.ann["value"] + '<br>' );
					    break;
					case "hasAbstract":
					    $("#abstract").append(obj.ann["value"] + '<br>' );
					    break;
					case "hasShortTitle":
					    $("#titolobreve").append(obj.ann["value"] + '<br>' );
					    break;
					case  "hasComment":
					    $("#commento").append(obj.ann["value"] + '<br>' ); 
					    break;
				}
         	}
		});
	});
}


/* "annotazione : " + obj.ann["value"] + "tipo : " + obj.tipo["value"] + "frammento : " + obj.frammento["value"] "annotatore : " + obj.annotatore["value"] + "data : " + obj.dataann["value"];*/


function annotafram(data){
	$.ajax({
		type: 'GET', 
		dataType: 'json',
		data: {link:data},
		url: "../cgi-bin/annotazioniframmento.py",
		success: function (d) {
			totale=d.length;
			$("#num-ann-fram span").empty();
			$("#num-ann-fram span").append(totale);
			annotaframmento = d;
			$("#filter-fram-author").empty();
			$("#filter-fram-author").append("<option>Tutti gli autori</option>");
			var autoriaggiunti=[];
			$.each(annotaframmento, function(idx,obj){
				if (autoriaggiunti.indexOf(obj.annotatore["value"])<0){
						autoriaggiunti.push(obj.annotatore["value"]);
						$("#filter-fram-author").append("<option>" + obj.annotatore["value"] + "</option>");
				}
				var poscancelletto = obj.framunivoco["value"].indexOf("#");
				poscancelletto += 1;
				var framunivoco = obj.framunivoco["value"].substr(poscancelletto) + '-' +  idx ;
				
				wrapText(obj.divid["value"],obj.fstart["value"],obj.fend["value"],obj.tipo["value"],framunivoco);  /*Inserisci Span */
				if(idx==d.length-1)visualizza_annota_fram(); /*permetti di visualizzare dialogo modale per ogni annotazione */
				$('#filter-fram-type').val( 'Tutti i tipi' );
				 $("#num-ann-fram_type").empty();
			 	    $("#num-ann-fram_date").empty();
			 	    $("#num-ann-fram_author").empty();
				
			});
		},
		error: function (request, status, error) {
			alert("errore");
		}
	});

}

function filtroframmento(){
	$("#filter-fram-date").change(function(){
		var filtdata= $("#filter-fram-date").datepicker("option","dateFormat", "yy-mm-dd").val();
		var conta=0;
		console.log("stringafiltrata:" + filtdata);

		$.each(annotaframmento, function(idx,obj) {			
			var tipo= obj.tipo["value"];
			var str= obj.dataann["value"];
			
			var temp3 = str.split("T");

			var poscancelletto = obj.framunivoco["value"].indexOf("#");
			poscancelletto += 1;
			var framunivoco = obj.framunivoco["value"].substring(poscancelletto) + '-' + idx ;
			if (filtdata <= temp3[0]) {
	  				$("#" + framunivoco).removeClass( "bianca" ).addClass(tipo);
	  				conta++
	  				$("#num-ann-fram_type").empty();
				 	$("#num-ann-fram_date").empty();
				    $("#num-ann-fram_author").empty();
					$("#num-ann-fram_date").append(conta); 

  				
  			}
  			else {
  				    $("#" + framunivoco).removeClass( tipo ).addClass( "bianca" );  	
					if (conta==0)	{
					 	    $("#num-ann-fram_type").empty();
					 	    $("#num-ann-fram_date").empty();
					 	    $("#num-ann-fram_author").empty();
							$("#num-ann-fram_date").append(conta); 
					}
			}
			
		});
		
	});
	
	$("#filter-fram-author").change(function(){
		var filtauto= $("#filter-fram-author").val();
		var conta=0;
		$.each(annotaframmento, function(idx,obj){
			var tipo= obj.tipo["value"];
			var str= obj.dataann["value"];
			var temp3=str.substring(0,10); 
			var poscancelletto = obj.framunivoco["value"].indexOf("#");
			poscancelletto += 1;
			var framunivoco = obj.framunivoco["value"].substring(poscancelletto) + '-' + idx ;
			console.log(framunivoco);
			 if ((obj.annotatore["value"] == filtauto ) || ( filtauto == "Tutti gli autori") )  {
			 		$( "#" + framunivoco ).removeClass( "bianca" ).addClass( tipo );  
			 		conta++;	
			 	    $("#num-ann-fram_type").empty();
			 	    $("#num-ann-fram_date").empty();
			 	    $("#num-ann-fram_author").empty();
					$("#num-ann-fram_author").append("<span class=" + filtauto + ">" + conta + "</span>"); 
  			}
  			else {
  				$( "#" + framunivoco ).removeClass( tipo ).addClass( "bianca" );
  				if (conta == 0){
  					$("#num-ann-fram_type").empty();
			 	    $("#num-ann-fram_date").empty();
			 	    $("#num-ann-fram_author").empty();
					$("#num-ann-fram_author").append(conta); 

  				}
  			}
  			
		});
	});


	$("#filter-fram-type").change(function(){
		var filttipo=$("#filter-fram-type").val();
		console.log(filttipo);
		var conta=0;
		$.each(annotaframmento, function(idx,obj){
			var tipo= obj.tipo["value"];
			var poscancelletto = obj.framunivoco["value"].indexOf("#");
			poscancelletto += 1;
			var framunivoco = obj.framunivoco["value"].substring(poscancelletto) + '-' + idx ;
			if ( filttipo != "Tutti i tipi") $(".annidate").removeClass( "annidate" ).addClass( "biancaannidate" );			
			else $(".biancaannidate").removeClass( "biancaannidate" ).addClass( "annidate" );
			if ((tipo == filttipo ) || ( filttipo == "Tutti i tipi") ) {
			 	    $( "#" + framunivoco ).removeClass( "bianca" ).addClass( tipo );			 	     
			 	    conta++;	
			 	    $("#num-ann-fram_type").empty();
			 	    $("#num-ann-fram_date").empty();
			 	    $("#num-ann-fram_author").empty();
					$("#num-ann-fram_type").append("<span class=" + filttipo + ">" + conta + "</span>"); 		 	    			
  			}
  			else {
  				$( "#" + framunivoco ).removeClass( tipo ).addClass( "bianca" );
  				if (conta == 0){
  					$("#num-ann-fram_type").empty();
			 	    $("#num-ann-fram_date").empty();
			 	    $("#num-ann-fram_author").empty();
					$("#num-ann-fram_type").append("<span class=" + filttipo + ">" + conta + "</span>"); 

  				}
  			}
  			
		});
	
		  
	});
}



/*questa funzione si occupa di visualizzare nella finestra modale le annotazioni sul frammento*/
function visualizza_annota_fram() {
	classi=[".denotesPerson", ".denotesPlace", ".denotesDisease", ".hasSubject", ".relatesTo", ".hasClarityScore", ".hasOriginalityScore", ".hasFormattingScore", ".cites", ".hasComment"];
	for(var i=0; i<classi.length; i++){
		$(".nano-content " + classi[i]).click(function(){ 
			if( (getSelectionText()=="") || (getSelectionText()==" ") ) {
				var temp_idunivoco=$(this).attr("id");/*per ogni span aggiunto da noi prendo il suo id univoco, associato all'anotazione*/
				$("#modale .nano-content").empty(); 
				$("#modale").fadeIn(200);
				$("#backmodal").fadeIn(200);
				$.each(annotaframmento, function(idx,obj){
					var poscancelletto = obj.framunivoco["value"].indexOf("#");
					poscancelletto += 1;
					var framunivoco = obj.framunivoco["value"].substr(poscancelletto) + '-' +  idx ; /*ricostruisco l'id univoco per confrontarlo*/
			    	if (framunivoco == temp_idunivoco ) {
    	     		switch (obj.tipo["value"]) {
						case "hasComment":
				            $("#modale .nano-content").append('<p><b>Autore annotazione:</b> ' + obj.annotatore["value"] + '</p><p><b>Data annotazione:</b> ' + obj.dataann["value"] + '</p><p><b>Tipo annotazione:</b> ' + obj.tipo["value"] + "<h3>Commento: " + obj.ann["value"] + "</h3><br><br><hr><br><br>");
			    	        break;
						case "hasOriginalityScore":
						    $("#modale .nano-content").append('<p><b>Autore annotazione:</b> ' + obj.annotatore["value"] + '</p><p><b>Data annotazione:</b> ' + obj.dataann["value"] + '</p><p><b>Tipo annotazione:</b> ' + obj.tipo["value"] + "<h3>Originalità del contenuto: " + obj.cites["value"] + "</h3><br><br><hr><br><br>");
						    break;
						case "hasFormattingScore":
						    $("#modale .nano-content").append('<p><b>Autore annotazione:</b> ' + obj.annotatore["value"] + '</p><p><b>Data annotazione:</b> ' + obj.dataann["value"] + '</p><p><b>Tipo annotazione:</b> ' + obj.tipo["value"] + "<h3>Qualità formattazione e presentazione: " + obj.cites["value"] + "</h3><br><br><hr><br><br>");
						    break;
						case "hasClarityScore":
						    $("#modale .nano-content").append('<p><b>Autore annotazione:</b> ' + obj.annotatore["value"] + '</p><p><b>Data annotazione:</b> ' + obj.dataann["value"] + '</p><p><b>Tipo annotazione:</b> ' + obj.tipo["value"] + "<h3>Chiarezza del contenuto: " + obj.cites["value"] + "</h3><br><br><hr><br><br>");
						    break;
						case "relatesTo":
							$.ajax({
								type: 'GET', 
								dataType: 'json',
								data: {link:obj.ann["value"]},
								url: "../cgi-bin/DBPedia.py",
								success: function (dbp) {
									var contenuto;
									var img;
									$.each(dbp, function(dbp_idx,dbp_obj){
										contenuto = dbp_obj.contenuto["value"];
										if(dbp_obj.img) img = dbp_obj.img["value"];
									});
									$("#modale .nano-content").append('<img src="' + img + '"><p><b>Autore annotazione:</b> ' + obj.annotatore["value"] + '</p><p><b>Data annotazione:</b> ' + obj.dataann["value"] + '</p><p><b>Tipo annotazione:</b> ' + obj.tipo["value"] + '<h3>Risorsa collegata a questo frammento: </h3> <a href="' + obj.ann["value"] + '">' + obj.ann["value"] + "</a><br><br><p><b>Qualche info</b> (non garantita): " + contenuto + '</p><br><br><hr><br><br>');
								},
								error: function (request, status, error) {
									$("#modale .nano-content").append('<p><b>Autore annotazione:</b> ' + obj.annotatore["value"] + '</p><p><b>Data annotazione:</b> ' + obj.dataann["value"] + '</p><p><b>Tipo annotazione:</b> ' + obj.tipo["value"] + '<h3>Risorsa collegata a questo frammento: </h3> <a href="' + obj.ann["value"] + '">' + obj.ann["value"] + "</a><br><br><hr><br><br>");
								}
							});					    									
						    break;
						case "cites":
						    $("#modale .nano-content").append('<p><b>Autore annotazione:</b> ' + obj.annotatore["value"] + '</p><p><b>Data annotazione:</b> ' + obj.dataann["value"] + '</p><p><b>Tipo annotazione:</b> ' + obj.tipo["value"] + '<h4>Articolo citato in questo frammento: '+ obj.cites["value"] + ' </h4><a src=" ' + obj.ann["value"] + '">' + obj.ann["value"] + '</a>' + ' <iframe src=" ' + obj.ann["value"] + '"></iframe><br><br><hr><br><br>' );
						    break;
						case "denotesPlace":
							$.ajax({
								type: 'GET', 
								dataType: 'json',
								data: {link:obj.ann["value"]},
								url: "../cgi-bin/DBPedia.py",
								success: function (dbp) {
									var contenuto;
									var img;
									$.each(dbp, function(dbp_idx,dbp_obj){
										contenuto = dbp_obj.contenuto["value"];
										if(dbp_obj.img) img=dbp_obj.img["value"];
									});
									$("#modale .nano-content").append('<img src="' + img + '"><p><b>Autore annotazione:</b> ' + obj.annotatore["value"] + '</p><p><b>Data annotazione:</b> ' + obj.dataann["value"] + '</p><p><b>Tipo annotazione:</b> ' + obj.tipo["value"] + "<h3>Luogo denotato: " + obj.nomevero["value"] + '</h3><a href="' + obj.ann["value"] + '">' + obj.ann["value"] + "</a><br><br><p><b>Qualche info</b> (non garantita): " + contenuto + '</p><br><br><hr><br><br>');
								},
								error: function (request, status, error) {
									$("#modale .nano-content").append('<p><b>Autore annotazione:</b> ' + obj.annotatore["value"] + '</p><p><b>Data annotazione:</b> ' + obj.dataann["value"] + '</p><p><b>Tipo annotazione:</b> ' + obj.tipo["value"] + "<h3>Luogo denotato: " + obj.nomevero["value"] + '</h3><a href="' + obj.ann["value"] + '">' + obj.ann["value"] + "</a><br><br><hr><br><br>");
								}
							});
						    break;
						case "denotesPerson":
							if(obj.linkdbp["value"]){
								$.ajax({
									type: 'GET', 
									dataType: 'json',
									data: {link:obj.linkdbp["value"]},
									url: "../cgi-bin/DBPedia.py",
									success: function (dbp) {
										var contenuto;
										var img;
										$.each(dbp, function(dbp_idx,dbp_obj){
											contenuto = dbp_obj.contenuto["value"];
											if(dbp_obj.img) img = dbp_obj.img["value"];
										});
										$("#modale .nano-content").append('<p><b>Autore annotazione:</b> ' + obj.annotatore["value"] + '</p><p><b>Data annotazione:</b> ' + obj.dataann["value"] + '</p><p><b>Tipo annotazione:</b> ' + obj.tipo["value"] + "<h3>Persona denotata: " + obj.nomevero["value"] +  "</h3></a><br><br><p><b>Qualche info</b> (non garantita): " + contenuto + "</p><br><br><hr><br><br>");
									},
									error: function (request, status, error) {
										$("#modale .nano-content").append('<p><b>Autore annotazione:</b> ' + obj.annotatore["value"] + '</p><p><b>Data annotazione:</b> ' + obj.dataann["value"] + '</p><p><b>Tipo annotazione:</b> ' + obj.tipo["value"] + "<h3>Persona denotata: " + obj.nomevero["value"] + '</h3></a><br><br><hr><br><br>');
									}
								});
							}
							else { $("#modale .nano-content").append('<p><b>Autore annotazione:</b> ' + obj.annotatore["value"] + '</p><p><b>Data annotazione:</b> ' + obj.dataann["value"] + '</p><p><b>Tipo annotazione:</b> ' + obj.tipo["value"] + "<h3>Luogo denotato: " + obj.nomevero["value"] + '</h3><a href="' + obj.ann["value"] + '">' + obj.ann["value"] + "</a><br><br><hr><br><br>"); }
							break;					    	
						case "denotesDisease":
					    	$("#modale .nano-content").append('<p><b>Autore annotazione:</b> ' + obj.annotatore["value"] + '</p><p><b>Data annotazione:</b> ' + obj.dataann["value"] + '</p><p><b>Tipo annotazione:</b> ' + obj.tipo["value"] + "<h3>Malattia: " + obj.nomevero["value"] + "</h3>");
						    break;
						case "hasSubject":
						    $("#modale .nano-content").append('<p><b>Autore annotazione:</b> ' + obj.annotatore["value"] + '</p><p><b>Data annotazione:</b> ' + obj.dataann["value"] + '</p><p><b>Tipo annotazione:</b> ' + obj.tipo["value"] + "<h3>Argomento principale trattato in questo frammento di testo: " + obj.nomevero["value"] + "</h3><br><br><hr><br><br>");
						    break;
					}
					$(".nano").nanoScroller();
         		}
			});
			}

			
			
		});
	}
}

/*questa funzione permette all'utente di creare nuove annotazioni sul documento. le lista a sinistra, ma non le salva*/
function user_newdocnote(){
	$('.inseriscidoc').click(function() {
		$("#menu").slideUp(200);
		switch ($(this).attr("value")) {
			case "hasAuthor":
				$("#modale .nano-content").empty();
				$("#modale .nano-content").append("<h4>Inserisci l'autore del documento</h4>" + '<input id="user_author" type="text" maxlength="30"></input><br><br><a id="aggiungi" align="right" class="button blue">Aggiungi</a>');
				$("#modale").fadeIn(200);
				$("#backmodal").fadeIn(200);
				$('#aggiungi').click(function() {
					if($("#user_author").val().length<3) alert("Valore non accettato");
					else{	
						var getvalue=$("#user_author").val();
						user_annota_doc[id_user_annota_doc]={tipo:"hasAuthor",annotazione:getvalue,link:user_actual_document};
						$("#minihelp-save ol").append('<li> Tipo: Autore<a id="annot_doc' + id_user_annota_doc + '" class="button blue tosave">Modifica</a></li><br>');
						$( "#aggiungi").unbind( "click" );/*disattivo l'evento click sul pulsante aggiungi*/
						$("#modale").fadeOut(200);
						$("#backmodal").fadeOut(200);
						$(".nano").nanoScroller();
						id_user_annota_doc++;
						user_editdocnote();
						$("#user_removeall").fadeIn(200);
						$("#user_saveall").fadeIn(200);
						console.log(user_annota_doc);
					}
				});
		        break;
			case "hasPublisher":
				$("#modale .nano-content").empty();
				$("#modale .nano-content").append("<h4>Inserisci l'editore del documento</h4>" + '<input id="user_publisher" type="text" maxlength="50"></input><br><br>' + "<h3>Inserisci il sito della casa editrice</h4>" + '<input id="user_publisher_mail" type="text" maxlength="50"><br><br></input><a id="aggiungi" align="right" class="button blue">Aggiungi</a>');
				$("#modale").fadeIn(200);
				$("#backmodal").fadeIn(200);
				$('#aggiungi').click(function() {
					if(($("#user_publisher").val().length<3)||($("#user_publisher_mail").val().length<3)) alert("Valore non accettato");
					else{
						var getvalue=$("#user_publisher").val();
						var getvalue2=$("#user_publisher_mail").val();
						user_annota_doc[id_user_annota_doc]={tipo:"hasPublisher",annotazione:getvalue,link:user_actual_document,extra:getvalue2};
						$("#minihelp-save ol").append('<li> Tipo: Editore<a id="annot_doc' + id_user_annota_doc + '" class="button blue tosave">Modifica</a></li><br>');
						$( "#aggiungi").unbind( "click" );/*disattivo l'evento click sul pulsante aggiungi*/
						$("#modale").fadeOut(200);
						$("#backmodal").fadeOut(200);
						$("#user_removeall").fadeIn(200);
						$("#user_saveall").fadeIn(200);
						$(".nano").nanoScroller();
						id_user_annota_doc++;
						user_editdocnote();
					}
				});
				break;
			case "hasPublicationYear":
				$("#modale .nano-content").empty();
				$("#modale .nano-content").append("<h4>Inserisci la data di pubblicazione del documento.</h4><p>Formato accettato: YYYY. Es. 2008</p><br><br>" + '<input id="user_publication_year" value="2000" type="number" maxlength="4"></input><br><br><a id="aggiungi" align="right" class="button blue">Aggiungi</a>');
				$("#modale").fadeIn(200);
				$("#backmodal").fadeIn(200);
				$('#aggiungi').click(function() {
					    var d = new Date();
    					var n = d.getFullYear();
					if(($("#user_publication_year").val().length==4) && ($("#user_publication_year").val()<=n) && ($("#user_publication_year").val()>1984)){
						var getvalue=$("#user_publication_year").val();
						user_annota_doc[id_user_annota_doc]={tipo:"hasPublicationYear",annotazione:getvalue,link:user_actual_document};
						$("#minihelp-save ol").append('<li> Tipo: Anno pubblicazione<a id="annot_doc' + id_user_annota_doc + '" class="button blue tosave">Modifica</a></li><br>');
						$( "#aggiungi").unbind( "click" );/*disattivo l'evento click sul pulsante aggiungi*/
						$("#modale").fadeOut(200);
						$("#backmodal").fadeOut(200);
						$("#user_removeall").fadeIn(200);
						$("#user_saveall").fadeIn(200);
						$(".nano").nanoScroller();
						id_user_annota_doc++;
						user_editdocnote();
					}
					else alert("Formato non valido. La data deve essere compresa tra 1985 e " + n);
				});
				break;
			case "hasTitle":
				$("#modale .nano-content").empty();
				$("#modale .nano-content").append("<h4>Inserisci il titolo del documento</h4>" + '<textarea id="user_title" cols="80" rows="8" maxlength="600" placeholder="Lunghezza massima 600 caratteri..."></textarea><br><br><a id="aggiungi" align="right" class="button blue">Aggiungi</a>');
				$("#modale").fadeIn(200);
				$("#backmodal").fadeIn(200);
				$('#aggiungi').click(function() {
					if($("#user_title").val().length<3) alert("Valore non accettato");
					else{
						var getvalue=$("#user_title").val();
						user_annota_doc[id_user_annota_doc]={tipo:"hasTitle",annotazione:getvalue,link:user_actual_document};
						$("#minihelp-save ol").append('<li> Tipo: Titolo<a id="annot_doc' + id_user_annota_doc + '" class="button blue tosave">Modifica</a></li><br>');
						$( "#aggiungi").unbind( "click" );/*disattivo l'evento click sul pulsante aggiungi*/
						$("#modale").fadeOut(200);
						$("#backmodal").fadeOut(200);
						$("#user_removeall").fadeIn(200);
						$("#user_saveall").fadeIn(200);
						$(".nano").nanoScroller();
						id_user_annota_doc++;
						user_editdocnote();
					}
				});
				break;
			case "hasAbstract":
				$("#modale .nano-content").empty();
				$("#modale .nano-content").append("<h4>Inserisci riassunto relativo al documento</h4>" + '<textarea id="user_abstract" cols="80" rows="8" maxlength="600" placeholder="Lunghezza massima 600 caratteri..."></textarea><br><br><a id="aggiungi" align="right" class="button blue">Aggiungi</a>');
				$("#modale").fadeIn(200);
				$("#backmodal").fadeIn(200);
				$('#aggiungi').click(function() {
					if($("#user_abstract").val().length<3) alert("Valore non accettato")
					else{	
						var getvalue=$("#user_abstract").val();
						user_annota_doc[id_user_annota_doc]={tipo:"hasAbstract",annotazione:getvalue,link:user_actual_document};
						$("#minihelp-save ol").append('<li> Tipo: Riassunto<a id="annot_doc' + id_user_annota_doc + '" class="button blue tosave">Modifica</a></li><br>');
						$( "#aggiungi").unbind( "click" );/*disattivo l'evento click sul pulsante aggiungi*/
						$("#modale").fadeOut(200);
						$("#backmodal").fadeOut(200);
						$("#user_removeall").fadeIn(200);
						$("#user_saveall").fadeIn(200);
						$(".nano").nanoScroller();
						id_user_annota_doc++;
						user_editdocnote();
					}
				});
				break;
			case "hasShortTitle":
				$("#modale .nano-content").empty();
				$("#modale .nano-content").append("<h4>Inserisci un titolo breve relativo al documento</h4>" + '<textarea id="user_short_title" cols="20" rows="5" maxlength="80" placeholder="Lunghezza massima 80 caratteri..."></textarea><br><br><a id="aggiungi" align="right" class="button blue">Aggiungi</a>');
				$("#modale").fadeIn(200);
				$("#backmodal").fadeIn(200);
				$('#aggiungi').click(function() {
					if($("#user_short_title").val().length<3) alert("Valore non accettato")
					var getvalue=$("#user_short_title").val();
					user_annota_doc[id_user_annota_doc]={tipo:"hasShortTitle",annotazione:getvalue,link:user_actual_document};
					$("#minihelp-save ol").append('<li> Tipo: Titolo breve<a id="annot_doc' + id_user_annota_doc + '" class="button blue tosave">Modifica</a></li><br>');
					$( "#aggiungi").unbind( "click" );/*disattivo l'evento click sul pulsante aggiungi*/
					$("#modale").fadeOut(200);
					$("#backmodal").fadeOut(200);
					$("#user_removeall").fadeIn(200);
						$("#user_saveall").fadeIn(200);
					$(".nano").nanoScroller();
					id_user_annota_doc++;
					user_editdocnote();
				});
				break;
			case  "hasComment":
				$("#modale .nano-content").empty();
				$("#modale .nano-content").append("<h4>Inserisci un commento relativo al documento</h4>" + '<textarea id="user_comment_doc" cols="80" rows="8" maxlength="600" placeholder="Lunghezza massima 600 caratteri..."></textarea><br><br><a id="aggiungi" align="right" class="button blue">Aggiungi</a>');
				$("#modale").fadeIn(200);
				$("#backmodal").fadeIn(200);
				$('#aggiungi').click(function() {
					if($("#user_comment_doc").val().length<3) alert("Valore non accettato")
					else{
						var getvalue=$("#user_comment_doc").val();
						user_annota_doc[id_user_annota_doc]={tipo:"hasComment",annotazione:getvalue,link:user_actual_document};
						$("#minihelp-save ol").append('<li> Tipo: Commento(doc)<a id="annot_doc' + id_user_annota_doc + '" class="button blue tosave">Modifica</a></li><br>');
						$( "#aggiungi").unbind( "click" );/*disattivo l'evento click sul pulsante aggiungi*/
						$("#modale").fadeOut(200);
						$("#backmodal").fadeOut(200);
						$("#user_removeall").fadeIn(200);
						$("#user_saveall").fadeIn(200);
						$(".nano").nanoScroller();
						id_user_annota_doc++;
						user_editdocnote();
					}
				});	
				break;
		} 
		$("#modale input").keyup(function(event){ /*clicca il pulsante aggiungi anche premendo ENTER dove non c'e una texarea*/
    		if(event.keyCode == 13){
        	$("#aggiungi").click();

    		}
		});
	});
}

function get_date() {
	var yyyy = new Date(); var mm = new Date(); var dd = new Date(); var hh = new Date(); var min = new Date();                               
	yyyy = yyyy.getFullYear().toString();                                    
	mm = (mm.getMonth()+1).toString();         
	dd  = dd.getDate().toString(); 
	hh = hh.getHours().toString();
	min = min.getMinutes().toString();
	if(hh>=10){
		if(min>=10)
			return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]) + "T" + hh + ":" + min;
		else
			return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]) + "T" + hh + ":0" + min;
	}
	if(hh<10){
		if(min>=10)
			return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]) + "T0" + hh + ":" + min;
		else
			return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]) + "T0" + hh + ":0" + min;
	}
} 


function removeall(){
		while(user_annota_doc.length > 0) {
    		user_annota_doc.pop();
		}
		while(user_annota_fram.length > 0) {
    		user_annota_fram.pop();
		}
		$("#minihelp-save .nano-content").empty();
		$("#user_removeall").fadeOut(200);
		$("#user_saveall").fadeOut(200);
		$("#backmodal").fadeOut(200);
		$("#modale").fadeOut(200);
		id_user_annota_doc=0;
		id_user_annota_fram=0;

		
}
function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 
function saveall(){
	$("#user_saveall").click(function() {
		$("#modale .nano-content").empty();
		$("#modale .nano-content").append('<h3>Inserisci i tuoi dati</h3><p><b>Nome e Cognome:</b><input type="text" id="user_prov_nome"><br><br><p><b>Email:</b><input type="email" id="user_prov_email"><br><br><a style="float:right" id="user_saveall_definitivo" class="button blue">Conferma</a>');
		$("#modale").fadeIn(200);
		$("#backmodal").fadeIn(200);	
			$("#user_saveall_definitivo").click(function() {
				if(($("#user_prov_nome").val()<3) || (!validateEmail($("#user_prov_email").val()))) alert("Il formato dei dati inseriti non è valido");
				else{
					$("#modale").fadeOut(1);/*evitiamo che l'utente faccia partire troppi click*/
					$("#backmodal").fadeOut(1);
					caricadocumento(user_actual_document);
					$.each(user_annota_doc, function(idx,obj){
							var right_now_time=get_date();
							if(user_annota_doc[idx]!=0){
								
								$.ajax({
									type: 'POST', 
									data: {user_link:obj.link, user_type:obj.tipo, user_ann:obj.annotazione, user_time:right_now_time, user_user:$("#user_prov_nome").val(), user_mail:$("#user_prov_email").val(), user_extra:obj.extra},
									url: "../cgi-bin/user_anndoc.py",
									dataType: "json",
									success: function (d) {
										$("#user_saveall_definitivo").unbind("click");
										removeall();
									},
									error: function (request, status, error) {
										alert("Errore nel salvataggio. Error: " + error );
										removeall();
										$("#user_saveall_definitivo").unbind("click");
									}
								});
							}
					});
					$.each(user_annota_fram, function(idx2,obj2){
							var right_now_time=get_date();
							if(user_annota_fram[idx2]!=0){
								$.ajax({
									type: 'POST', 
									data: {user_link:obj2.link, user_type:obj2.tipo, user_ann:obj2.annotazione, user_time:right_now_time, user_user:$("#user_prov_nome").val(), user_mail:$("#user_prov_email").val(), user_div:obj2.divid, user_start:obj2.start, user_end:obj2.end, user_extra:obj2.extra, },
									url: "../cgi-bin/user_annfram.py",
									dataType: "json",
									success: function (d) {
										$("#user_saveall_definitivo").unbind("click");
										removeall();
									},
									error: function (request, status, error) {
										alert("Errore nel salvataggio. Error: " + error );
										removeall();
										$("#user_saveall_definitivo").unbind("click");
									}
								});
							}
					});
				}
			});
		
	});
}

function user_editdocnote(){
	$('.tosave').click(function() {
		var temp=$(this).attr("id").substring(9);
		console.log(temp,user_annota_doc);
			switch (user_annota_doc[temp].tipo){
				case "hasAuthor":
					$("#modale .nano-content").empty();
					$("#modale .nano-content").append("<h4>Inserisci l'autore del documento</h4>" + '<input value="' + user_annota_doc[temp].annotazione + '" id="user_author" type="text" maxlength="30"></input><br><br><a id="user_salva" class="button green">Salva</a><a id="user_elimina" class="button red">Elimina</a>');
					$("#modale").fadeIn(200);
					$("#backmodal").fadeIn(200);
					$('#user_salva').click(function() {
						if($("#user_author").val().length<3) alert("Valore non accettato");
						else{	
							user_annota_doc[temp].annotazione=$("#user_author").val();
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
						}
					});

					$('#user_elimina').click(function() {
							var temp_selector="#annot_doc"+ temp;
							$(temp_selector).parent().next().remove();
							$(temp_selector).parent().remove();
							user_annota_doc[temp]=0;
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
							$(".nano").nanoScroller();
					});
			        break;

				case "hasPublisher":
					$("#modale .nano-content").empty();
					$("#modale .nano-content").append("<h4>Inserisci l'editore del documento</h4>" + '<input value="' + user_annota_doc[temp].annotazione + '" id="user_publisher" type="text" maxlength="50"></input><br><br>' + "<h3>Inserisci l'email della casa editrice</h4>" + '<input value="' + user_annota_doc[temp].extra + '" id="user_publisher_mail" type="text" maxlength="50"><br><br><a id="user_salva" class="button green">Salva</a><a id="user_elimina" class="button red">Elimina</a>');
					$("#modale").fadeIn(200);
					$("#backmodal").fadeIn(200);
					$('#user_salva').click(function() {
						if($("#user_publisher").val().length<3) alert("Valore non accettato");
						else{
							user_annota_doc[temp].annotazione=$("#user_publisher").val();
							user_annota_doc[temp].annotazione=$("#user_publisher_mail").val();
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
						}
					});
					$('#user_elimina').click(function() {
							var temp_selector="#annot_doc"+ temp;
							$(temp_selector).parent().next().remove();
							$(temp_selector).parent().remove();
							user_annota_doc[temp]=0;
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
							$(".nano").nanoScroller();
					});
					break;
				
				case "hasPublicationYear":
					$("#modale .nano-content").empty();
					$("#modale .nano-content").append("<h4>Inserisci la data di pubblicazione del documento.</h4><p>Formato accettato: YYYY. Es. 2008</p><br><br>" + '<input value="' + user_annota_doc[temp].annotazione + '" id="user_publication_year" type="number" maxlength="4"></input><br><br><a id="user_salva" class="button green">Salva</a><a id="user_elimina" class="button red">Elimina</a>');
					$("#modale").fadeIn(200);
					$("#backmodal").fadeIn(200);
					$('#user_salva').click(function() {
						    var d = new Date();
	    					var n = d.getFullYear();
						if(($("#user_publication_year").val().length==4) && ($("#user_publication_year").val()<=n) && ($("#user_publication_year").val()>1984)){
							user_annota_doc[temp].annotazione=$("#user_publication_year").val();
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
						}
						else alert("Formato non valido. La data deve essere compresa tra 1985 e " + n);
					});
					$('#user_elimina').click(function() {
							var temp_selector="#annot_doc"+ temp;
							$(temp_selector).parent().next().remove();
							$(temp_selector).parent().remove();
							user_annota_doc[temp]=0;
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
							$(".nano").nanoScroller();
					});
					break;
				
				case "hasTitle":
					$("#modale .nano-content").empty();
					$("#modale .nano-content").append("<h4>Inserisci il titolo del documento</h4>" + '<textarea id="user_title" cols="80" rows="8" maxlength="600">' + user_annota_doc[temp].annotazione + '</textarea><br><br><a id="user_salva" class="button green">Salva</a><a id="user_elimina" class="button red">Elimina</a>');
					$("#modale").fadeIn(200);
					$("#backmodal").fadeIn(200);
					$('#user_salva').click(function() {
						if($("#user_title").val().length<3) alert("Valore non accettato");
						else{
							user_annota_doc[temp].annotazione=$("#user_title").val();
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
						}
					});
					$('#user_elimina').click(function() {
						var temp_selector="#annot_doc"+ temp;
						$(temp_selector).parent().next().remove();
						$(temp_selector).parent().remove();
						user_annota_doc[temp]=0;
						$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
						$("#user_elimina").unbind( "click" );
						$("#modale").fadeOut(200);
						$("#backmodal").fadeOut(200);
						$(".nano").nanoScroller();
					
					});
					break;
				
				case "hasAbstract":
					$("#modale .nano-content").empty();
					$("#modale .nano-content").append("<h4>Inserisci riassunto relativo al documento</h4>" + '<textarea id="user_abstract" cols="80" rows="8" maxlength="600">' + user_annota_doc[temp].annotazione + '</textarea><br><br><a id="user_salva" class="button green">Salva</a><a id="user_elimina" class="button red">Elimina</a>');
					$("#modale").fadeIn(200);
					$("#backmodal").fadeIn(200);
					$('#user_salva').click(function() {
						if($("#user_abstract").val().length<3) alert("Valore non accettato")
						else{	
							user_annota_doc[temp].annotazione=$("#user_abstract").val();
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
						}
					});
					$('#user_elimina').click(function() {
						var temp_selector="#annot_doc"+ temp;
						$(temp_selector).parent().remove();
						$(temp_selector).parent().next().remove();
						user_annota_doc[temp]=0;
						$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
						$("#user_elimina").unbind( "click" );
						$("#modale").fadeOut(200);
						$("#backmodal").fadeOut(200);
						$(".nano").nanoScroller();
					});
					break;
					
				case "hasShortTitle":
					$("#modale .nano-content").empty();
					$("#modale .nano-content").append("<h4>Inserisci un titolo breve relativo al documento</h4>" + '<textarea id="user_short_title" cols="20" rows="5" maxlength="80">' + user_annota_doc[temp].annotazione + '</textarea><br><br><a id="user_salva" class="button green">Salva</a><a id="user_elimina" class="button red">Elimina</a>');
					$("#modale").fadeIn(200);
					$("#backmodal").fadeIn(200);
					$('#user_salva').click(function() {
						if($("#user_short_title").val().length<3) alert("Valore non accettato")
							user_annota_doc[temp].annotazione=$("#user_short_title").val();
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
					});
					$('#user_elimina').click(function() {
						var temp_selector="#annot_doc"+ temp;
						$(temp_selector).parent().next().remove();
						$(temp_selector).parent().remove();
						user_annota_doc[temp]=0;
						$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
						$("#user_elimina").unbind( "click" );
						$("#modale").fadeOut(200);
						$("#backmodal").fadeOut(200);
						$(".nano").nanoScroller();
					});
					break;
					
				case  "hasComment":
					$("#modale .nano-content").empty();
					$("#modale .nano-content").append("<h4>Inserisci un commento relativo al documento</h4>" + '<textarea id="user_comment_doc" cols="80" rows="8" maxlength="600">' + user_annota_doc[temp].annotazione + '</textarea><br><br><a id="user_salva" class="button green">Salva</a><a id="user_elimina" class="button red">Elimina</a>');
					$("#modale").fadeIn(200);
					$("#backmodal").fadeIn(200);
					$('#user_salva').click(function() {
						if($("#user_comment_doc").val().length<3) alert("Valore non accettato")
						else{
							user_annota_doc[temp].annotazione=$("#user_comment_doc").val();
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
						}
					});	
					$('#user_elimina').click(function() {
						var temp_selector="#annot_doc"+ temp;
						$(temp_selector).parent().next().remove();
						$(temp_selector).parent().remove();
						user_annota_doc[temp]=0;
						$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
						$("#user_elimina").unbind( "click" );
						$("#modale").fadeOut(200);
						$("#backmodal").fadeOut(200);
						$(".nano").nanoScroller();
					});
					break;		
			} 
			
			
	});
}

function user_newframnote(){
	$('.inseriscifram').click(function() {
		$("#menu").slideUp(200);
		var user_fram_offsets=getSelectionOffsets(getSelectionParentElement());/*salvo gli offset*/
		var user_fram_parent=$(getSelectionParentElement()).attr("id");/*mi salvo l'id del padre comune*/
		console.log($(getSelectionParentElement()).attr("id"),user_fram_offsets.start, user_fram_offsets.end);
		switch ($(this).attr("value")) {
			case "denotesPerson":
				$("#modale .nano-content").empty();
				$("#modale .nano-content").append("<h5>Inserisci il link di wikipedia della persona denotata dal frammento; puoi utilizzare la searchbox a destra per fare la ricerca.</h5><br><br>" + '<input id="user_denotesperson" size="60"  type="text" maxlength="200"></input><br><br>'  + '<h5>Inserisci il nome completo della persona denotata</h5><br><br><input id="user_denotesperson_vero" size="20"  type="text" maxlength="80"></input><br><br>' + ' <form style="float:right" action="http://www.wikipedia.org/search-redirect.php" target="_blank" method="get">Search Wikipedia: <input type="hidden" name="language" value="en" /><input type="text" name="search" size="20" /><input type="submit" name="go" value=" Go! " /></form><a id="aggiungi" class="button blue">Aggiungi</a>');
				$("#modale").fadeIn(200);
				$("#backmodal").fadeIn(200);
				$('#aggiungi').click(function() {
					if($("#user_denotesperson").val().indexOf('en.wikipedia.org/wiki/') === -1) alert('Valore non accettato. il link deve essere della forma "http://en.wikipedia.org/wiki/xxxxx"')
					else{	
						var getvalue=$("#user_denotesperson").val();
						var getvalue2=$("#user_denotesperson_vero").val();
						user_annota_fram[id_user_annota_fram]={ tipo:"denotesPerson", annotazione:getvalue2,link:user_actual_document,divid:user_fram_parent,start:user_fram_offsets.start , end:user_fram_offsets.end, extra:getvalue};
						$("#minihelp-save ol").append('<li> Tipo:Denota persona<a id="annot_fram' + id_user_annota_fram + '" class="button blue tosave2">Modifica</a></li><br>');
						$( "#aggiungi").unbind( "click" );/*disattivo l'evento click sul pulsante aggiungi*/
						$("#modale").fadeOut(200);
						$("#backmodal").fadeOut(200);
						$("#user_removeall").fadeIn(200);
						$("#user_saveall").fadeIn(200);
						$(".nano").nanoScroller();
						id_user_annota_fram++;
						user_editframnote();
					}
				});
		        break;
			case "denotesPlace":
				$("#modale .nano-content").empty();
				$("#modale .nano-content").append("<h5>Inserisci il link di wikipedia del posto denotato dal frammento; puoi utilizzare la searchbox a destra per fare la ricerca.</h5><br><br>" + '<input id="user_denotesplace" size="60"  type="text" maxlength="200"></input><br><br><br>'  + ' <form style="float:right" action="http://www.wikipedia.org/search-redirect.php" target="_blank" method="get">Search Wikipedia: <input type="hidden" name="language" value="en" /><input type="text" name="search" size="20" /><input type="submit" name="go" value=" Go! " /></form><a id="aggiungi" class="button blue">Aggiungi</a>');
				$("#modale").fadeIn(200);
				$("#backmodal").fadeIn(200);
				$('#aggiungi').click(function() {
					if($("#user_denotesplace").val().indexOf('en.wikipedia.org/wiki/') === -1) alert('Valore non accettato. il link deve essere della forma "http://en.wikipedia.org/wiki/xxxxx"')
					else{
						var getvalue=$("#user_denotesplace").val();
						user_annota_fram[id_user_annota_fram]={ tipo:"denotesPlace", annotazione:getvalue,link:user_actual_document,divid:user_fram_parent,start:user_fram_offsets.start , end:user_fram_offsets.end};
						$("#minihelp-save ol").append('<li> Tipo:Denota luogo<a id="annot_fram' + id_user_annota_fram + '" class="button blue tosave2">Modifica</a></li><br>');
						$( "#aggiungi").unbind( "click" );/*disattivo l'evento click sul pulsante aggiungi*/
						$("#modale").fadeOut(200);
						$("#backmodal").fadeOut(200);
						$("#user_removeall").fadeIn(200);
						$("#user_saveall").fadeIn(200);
						$(".nano").nanoScroller();
						id_user_annota_fram++;
						user_editframnote();

					}
				});
				break;
			case "relatesTo":
				$("#modale .nano-content").empty();
				$("#modale .nano-content").append("<h5>Inserisci il link di wikipedia correlato al frammento; puoi utilizzare la searchbox a destra per fare la ricerca.</h5><br><br>" + '<input id="user_relatesto" size="60"  type="text" maxlength="200"></input><br><br><br>'  + ' <form style="float:right" action="http://www.wikipedia.org/search-redirect.php" target="_blank" method="get">Search Wikipedia: <input type="hidden" name="language" value="en" /><input type="text" name="search" size="20" /><input type="submit" name="go" value=" Go! " /></form><a id="aggiungi" class="button blue">Aggiungi</a>');
				$("#modale").fadeIn(200);
				$("#backmodal").fadeIn(200);
				$('#aggiungi').click(function() {
					if($("#user_relatesto").val().indexOf('en.wikipedia.org/wiki/') === -1) alert('Valore non accettato. il link deve essere della forma "http://en.wikipedia.org/wiki/xxxxx"')
					else{
						var getvalue=$("#user_relatesto").val();
						user_annota_fram[id_user_annota_fram]={ tipo:"relatesTo", annotazione:getvalue,link:user_actual_document,divid:user_fram_parent,start:user_fram_offsets.start , end:user_fram_offsets.end};
						$("#minihelp-save ol").append('<li> Tipo:Relazionato a <a id="annot_fram' + id_user_annota_fram + '" class="button blue tosave2">Modifica</a></li><br>');
						$( "#aggiungi").unbind( "click" );/*disattivo l'evento click sul pulsante aggiungi*/
						$("#modale").fadeOut(200);
						$("#backmodal").fadeOut(200);
						$("#user_removeall").fadeIn(200);
						$("#user_saveall").fadeIn(200);
						$(".nano").nanoScroller();
						id_user_annota_fram++;
						user_editframnote();

					}
				});
				break;
			case "hasSubject":
				$("#modale .nano-content").empty();
				$("#modale .nano-content").append("<h5>Inserisci l'argomento principale trattato nel frammento <i>(tra i seguenti, conformi al BNCF sez. Medicina )</i></h5><br><br>" + '<select id="user_subject"><option>Fisiopatologia</option><option>Dietetica</option><option>Medicina Interna</option><option>Semeiotica</option><option>Anatomia</option><option>Anestesia</option><option>Bioetica</option><option>Chirurgia</option><option>Diagnostica</option><option>Malattia</option><option>Cromoterapia</option><option>Medicina alternativa</option><option>Medicina riabilitativa</option></select><br><br><br><a id="aggiungi" class="button blue">Aggiungi</a>');
				$("#modale").fadeIn(200);
				$("#backmodal").fadeIn(200);
				$('#aggiungi').click(function() {
					if($("#user_subject").val()=="")alert('Valore non accettato');
					else{
						var getvalue=$("#user_subject").val();
						user_annota_fram[id_user_annota_fram]={ tipo:"hasSubject", annotazione:getvalue,link:user_actual_document,divid:user_fram_parent,start:user_fram_offsets.start , end:user_fram_offsets.end};
						$("#minihelp-save ol").append('<li> Tipo:Argomento principale <a id="annot_fram' + id_user_annota_fram + '" class="button blue tosave2">Modifica</a></li><br>');
						$( "#aggiungi").unbind( "click" );/*disattivo l'evento click sul pulsante aggiungi*/
						$("#modale").fadeOut(200);
						$("#backmodal").fadeOut(200);
						$("#user_removeall").fadeIn(200);
						$("#user_saveall").fadeIn(200);
						$(".nano").nanoScroller();
						id_user_annota_fram++;
						user_editframnote();

					}
				});
				break;
			case "hasFormattingScore":
				$("#modale .nano-content").empty();
				$("#modale .nano-content").append("<h5>Inserisci un giudizio personale sulla formattazione e presentazione del frammento selezionato</h5><br><br>" + '<select id="user_formattingscore"><option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option><option>Very poor</option></select><br><br><br><a id="aggiungi" class="button blue">Aggiungi</a>');
				$("#modale").fadeIn(200);
				$("#backmodal").fadeIn(200);
				$('#aggiungi').click(function() {
					if($("#user_formattingscore").val()=="")alert('Valore non accettato');
					else{
						var getvalue=$("#user_formattingscore").val();
						user_annota_fram[id_user_annota_fram]={ tipo:"hasFormattingScore", annotazione:getvalue,link:user_actual_document,divid:user_fram_parent,start:user_fram_offsets.start , end:user_fram_offsets.end};
						$("#minihelp-save ol").append('<li> Tipo: Qualità formattazione <a id="annot_fram' + id_user_annota_fram + '" class="button blue tosave2">Modifica</a></li><br>');
						$( "#aggiungi").unbind( "click" );/*disattivo l'evento click sul pulsante aggiungi*/
						$("#modale").fadeOut(200);
						$("#backmodal").fadeOut(200);
						$("#user_removeall").fadeIn(200);
						$("#user_saveall").fadeIn(200);
						$(".nano").nanoScroller();
						id_user_annota_fram++;
						user_editframnote();
					}
				});
				break;
			case "hasClarityScore":
				$("#modale .nano-content").empty();
				$("#modale .nano-content").append("<h5>Inserisci un giudizio personale sulla chiarezza del frammento selezionato</h5><br><br>" + '<select id="user_clarityscore"><option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option><option>Very poor</option></select><br><br><br><a id="aggiungi" class="button blue">Aggiungi</a>');
				$("#modale").fadeIn(200);
				$("#backmodal").fadeIn(200);
				$('#aggiungi').click(function() {
					if($("#user_clarityscore").val()=="")alert('Valore non accettato');
					else{
						var getvalue=$("#user_clarityscore").val();
						user_annota_fram[id_user_annota_fram]={ tipo:"hasClarityScore", annotazione:getvalue,link:user_actual_document,divid:user_fram_parent,start:user_fram_offsets.start , end:user_fram_offsets.end};
						$("#minihelp-save ol").append('<li> Tipo: Chiarezza contenuto <a id="annot_fram' + id_user_annota_fram + '" class="button blue tosave2">Modifica</a></li><br>');
						$( "#aggiungi").unbind( "click" );/*disattivo l'evento click sul pulsante aggiungi*/
						$("#modale").fadeOut(200);
						$("#backmodal").fadeOut(200);
						$("#user_removeall").fadeIn(200);
						$("#user_saveall").fadeIn(200);
						$(".nano").nanoScroller();
						id_user_annota_fram++;
						user_editframnote();
					}
				});
				break;
			case "hasOriginalityScore":
				$("#modale .nano-content").empty();
				$("#modale .nano-content").append("<h5>Inserisci un giudizio personale sull' originalità del frammento selezionato</h5><br><br>" + '<select id="user_originalityscore"><option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option><option>Very poor</option></select><br><br><br><a id="aggiungi" class="button blue">Aggiungi</a>');
				$("#modale").fadeIn(200);
				$("#backmodal").fadeIn(200);
				$('#aggiungi').click(function() {
					if($("#user_originalityscore").val()=="")alert('Valore non accettato');
					else{
						var getvalue=$("#user_originalityscore").val();
						user_annota_fram[id_user_annota_fram]={ tipo:"hasOriginalityScore", annotazione:getvalue,link:user_actual_document,divid:user_fram_parent,start:user_fram_offsets.start , end:user_fram_offsets.end};
						$("#minihelp-save ol").append('<li> Tipo: Originalità contenuto <a id="annot_fram' + id_user_annota_fram + '" class="button blue tosave2">Modifica</a></li><br>');
						$( "#aggiungi").unbind( "click" );/*disattivo l'evento click sul pulsante aggiungi*/
						$("#modale").fadeOut(200);
						$("#backmodal").fadeOut(200);
						$("#user_removeall").fadeIn(200);
						$("#user_saveall").fadeIn(200);
						$(".nano").nanoScroller();
						id_user_annota_fram++;
						user_editframnote();
					}
				});
				break;
			case "cites":
				$("#modale .nano-content").empty();
				$("#modale .nano-content").append("<h5>Inserisci il link dell'articolo citato in questo frammento</h5><br><br>" + '<input id="user_cites" size="60" type="text" maxlength="200"></input><br><br><br>' + "<h5>Inserisci il titolo dell'articolo citato in questo frammento</h5><br><br>" + '<input id="user_cites_title" size="60" type="text" maxlength="200"></input><br><br><br><a id="aggiungi" class="button blue">Aggiungi</a>');
				$("#modale").fadeIn(200);																							
				$("#backmodal").fadeIn(200);
				$('#aggiungi').click(function() {
					if(($("#user_cites").val().indexOf('http://') === -1)||($("#user_cites_title").val().length<3))alert('Valori non accettati. il link deve essere della forma "http://xxx.xxx"');
					else{
						var getvalue=$("#user_cites").val();
						var getvalue2=$("#user_cites_title").val();
						user_annota_fram[id_user_annota_fram]={ tipo:"cites", annotazione:getvalue,link:user_actual_document,divid:user_fram_parent,start:user_fram_offsets.start , end:user_fram_offsets.end, extra:getvalue2};
						$("#minihelp-save ol").append('<li> Tipo: Citazione <a id="annot_fram' + id_user_annota_fram + '" class="button blue tosave2">Modifica</a></li><br>');
						$( "#aggiungi").unbind( "click" );/*disattivo l'evento click sul pulsante aggiungi*/
						$("#modale").fadeOut(200);
						$("#backmodal").fadeOut(200);
						$("#user_removeall").fadeIn(200);
						$("#user_saveall").fadeIn(200);
						$(".nano").nanoScroller();
						id_user_annota_fram++;
						user_editframnote();
					}
				});
				break;
			case "hasComment_fram":
				$("#modale .nano-content").empty();
				$("#modale .nano-content").append("<h3>Inserisci un commento personale relativo a questo frammento</h3><br><br>" + '<textarea id="user_comment_fram" cols="80" rows="8" maxlength="600" placeholder="Lunghezza massima 600 caratteri..."></textarea><br><br><br>' + '<br><br><a id="aggiungi" class="button blue">Aggiungi</a>');
				$("#modale").fadeIn(200);																							
				$("#backmodal").fadeIn(200);
				$('#aggiungi').click(function() {
					if($("#user_comment_fram").val().length<3) alert("Valore non accettato")
					else{
						var getvalue=$("#user_comment_fram").val();
						user_annota_fram[id_user_annota_fram]={ tipo:"hasComment", annotazione:getvalue,link:user_actual_document,divid:user_fram_parent,start:user_fram_offsets.start , end:user_fram_offsets.end};
						$("#minihelp-save ol").append('<li> Tipo: Commento(fram) <a id="annot_fram' + id_user_annota_fram + '" class="button blue tosave2">Modifica</a></li><br>');
						$( "#aggiungi").unbind( "click" );/*disattivo l'evento click sul pulsante aggiungi*/
						$("#modale").fadeOut(200);
						$("#backmodal").fadeOut(200);
						$("#user_removeall").fadeIn(200);
						$("#user_saveall").fadeIn(200);
						$(".nano").nanoScroller();
						id_user_annota_fram++;
						user_editframnote();
					}
				});
				break;
			case "denotesDisease":
				$("#modale .nano-content").empty();
				$("#modale .nano-content").append("<h5>Inserisci la malattia denotata nel frammento</h5><br><br>" + '<select id="user_denotesdisease"><option>Tuberculosis</option><option>Cholera</option><option>Salmonella</option><option>Viral Hepatitis</option><option>Human Immunodeficiency Virus HIV</option><option>Protozoan Infection</option><option>Schizophrenia</option><option>Glaucoma</option><option>Carcinoma</option></select><br><br><br><a id="aggiungi" class="button blue">Aggiungi</a>');
				$("#modale").fadeIn(200);
				$("#backmodal").fadeIn(200);
				$('#aggiungi').click(function() {
					if($("#user_denotesdisease").val()=="")alert('Valore non accettato');
					else{
						var getvalue=$("#user_denotesdisease").val();
						var getvalue2="http://www.icd10data.com/ICD10CM/Codes/" + getvalue.replace(/ /g, "-");
						user_annota_fram[id_user_annota_fram]={ tipo:"denotesDisease", annotazione:getvalue, link:user_actual_document,divid:user_fram_parent,start:user_fram_offsets.start , end:user_fram_offsets.end, extra:getvalue2};
						$("#minihelp-save ol").append('<li> Tipo: Malattia <a id="annot_fram' + id_user_annota_fram + '" class="button blue tosave2">Modifica</a></li><br>');
						$( "#aggiungi").unbind( "click" );/*disattivo l'evento click sul pulsante aggiungi*/
						$("#modale").fadeOut(200);
						$("#backmodal").fadeOut(200);
						$("#user_removeall").fadeIn(200);
						$("#user_saveall").fadeIn(200);
						$(".nano").nanoScroller();
						id_user_annota_fram++;
						user_editframnote();
					}
				});
				break;

		} 
		$("#modale input").keyup(function(event){ /*clicca il pulsante aggiungi anche premendo ENTER dove non c'e una texarea*/
    		if(event.keyCode == 13){
        	$("#aggiungi").click();
    		}
		});
	});
}

function user_editframnote(){
	$('.tosave2').click(function() {
		var temp=$(this).attr("id").substring(10);
		console.log(temp,user_annota_fram);
			switch (user_annota_fram[temp].tipo){
				case "denotesPerson":
					$("#modale .nano-content").empty();
					$("#modale .nano-content").append("<h5>Inserisci il link di wikipedia della persona denotata dal frammento; puoi utilizzare la searchbox a destra per fare la ricerca.</h5><br><br>" + '<input id="user_denotesperson" value="' + user_annota_fram[temp].extra +'" size="60"  type="text" maxlength="200"></input><br><br>'  + '<h5>Inserisci il nome completo della persona denotata</h5><br><br><input id="user_denotesperson_vero" value="' + user_annota_fram[temp].annotazione +'" size="20"  type="text" maxlength="80"></input><br><br>' + ' <form style="float:right" action="http://www.wikipedia.org/search-redirect.php" target="_blank" method="get">Search Wikipedia: <input type="hidden" name="language" value="en" /><input type="text" name="search" size="20" /><input type="submit" name="go" value=" Go! " /></form><br><a id="user_salva" class="button green">Salva</a><a id="user_elimina" class="button red">Elimina</a>');
					$("#modale").fadeIn(200);
					$("#backmodal").fadeIn(200);
					$('#user_salva').click(function() {
						if($("#user_denotesperson").val().indexOf('en.wikipedia.org/wiki/') === -1) alert('Valore non accettato. Il link deve essere della forma "http://en.wikipedia.org/wiki/xxxxx"')
						else{	
							user_annota_fram[temp].annotazione=$("#user_denotesperson_vero").val();
							user_annota_fram[temp].extra=$("#user_denotesperson").val();
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
						}
					});

					$('#user_elimina').click(function() {
							var temp_selector="#annot_fram"+ temp;
							$(temp_selector).parent().next().remove();
							$(temp_selector).parent().remove();
							user_annota_fram[temp]=0;
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
							$(".nano").nanoScroller();
					});
			        break;

			    case "denotesPlace":
			      	$("#modale .nano-content").empty();
				$("#modale .nano-content").append("<h5>Inserisci il link di wikipedia del posto denotato dal frammento; puoi utilizzare la searchbox a destra per fare la ricerca.</h5><br><br>" + '<input id="user_denotesplace" value="' + user_annota_fram[temp].annotazione + '" size="60"  type="text" maxlength="200"></input><br><br><br>'  + ' <form style="float:right" action="http://www.wikipedia.org/search-redirect.php" target="_blank" method="get">Search Wikipedia: <input type="hidden" name="language" value="en" /><input type="text" name="search" size="20" /><input type="submit" name="go" value=" Go! " /></form><br><a id="user_salva" class="button green">Salva</a><a id="user_elimina" class="button red">Elimina</a>');
			      	$("#modale").fadeIn(200);
			      	$("#backmodal").fadeIn(200);
			     	$('#user_salva').click(function() {
			      		if($("#user_denotesplace").val().indexOf('en.wikipedia.org/wiki/') === -1) alert('Valore non accettato. il link deve essere della forma "http://en.wikipedia.org/wiki/xxxxx"')
			      		else{
			      			user_annota_fram[temp].annotazione=$("#user_denotesplace").val();
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
			      		}
			      	});

			      	$('#user_elimina').click(function() {
							var temp_selector="#annot_fram"+ temp;
							$(temp_selector).parent().next().remove();
							$(temp_selector).parent().remove();
							user_annota_fram[temp]=0;
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
							$(".nano").nanoScroller();
					});
			      	break;

				case "relatesTo":
					$("#modale .nano-content").empty();
					$("#modale .nano-content").append("<h5>Inserisci il link di wikipedia correlato al frammento; puoi utilizzare la searchbox a destra per fare la ricerca.</h5><br><br>" + '<input id="user_relatesto" value="' + user_annota_fram[temp].annotazione + '" size="60"  type="text" maxlength="200"></input><br><br><br>'  + ' <form style="float:right" action="http://www.wikipedia.org/search-redirect.php" target="_blank" method="get">Search Wikipedia: <input type="hidden" name="language" value="en" /><input type="text" name="search" size="20" /><input type="submit" name="go" value=" Go! " /></form><a id="user_salva" class="button green">Salva</a><a id="user_elimina" class="button red">Elimina</a>');
					$("#modale").fadeIn(200);
					$("#backmodal").fadeIn(200);
					$('#user_salva').click(function() {
						if($("#user_relatesto").val().indexOf('en.wikipedia.org/wiki/') === -1) alert('Valore non accettato. il link deve essere della forma "http://en.wikipedia.org/wiki/xxxxx"')
						else{
							user_annota_fram[temp].annotazione=$("#user_relatesto").val();
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
			      		}
			      	});

			      	$('#user_elimina').click(function() {
							var temp_selector="#annot_fram"+ temp;
							$(temp_selector).parent().next().remove();
							$(temp_selector).parent().remove();
							user_annota_fram[temp]=0;
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
							$(".nano").nanoScroller();
					});
					break;
				case "hasSubject":
					$("#modale .nano-content").empty();
					$("#modale .nano-content").append("<h5>Inserisci l'argomento principale trattato nel frammento <i>(tra i seguenti, conformi al BNCF sez. Medicina )</i></h5><br><br>" + '<select id="user_subject"><option>Fisiopatologia</option><option>Dietetica</option><option>Medicina Interna</option><option>Semeiotica</option><option>Anatomia</option><option>Anestesia</option><option>Bioetica</option><option>Chirurgia</option><option>Diagnostica</option><option>Malattia</option><option>Cromoterapia</option><option>Medicina alternativa</option><option>Medicina riabilitativa</option></select><br><br><a id="user_salva" class="button green">Salva</a><a id="user_elimina" class="button red">Elimina</a>');
					$("#modale").fadeIn(200);
					$("#backmodal").fadeIn(200);
					$('#user_salva').click(function() {
					if($("#user_subject").val()=="")alert('Valore non accettato');
						else{
							user_annota_fram[temp].annotazione=$("#user_subject").val();
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
			      		}
			      	});

			      	$('#user_elimina').click(function() {
							var temp_selector="#annot_fram"+ temp;
							$(temp_selector).parent().next().remove();
							$(temp_selector).parent().remove();
							user_annota_fram[temp]=0;
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
							$(".nano").nanoScroller();
					});
					break;

				case "hasFormattingScore":
					$("#modale .nano-content").empty();
					$("#modale .nano-content").append("<h5>Inserisci un giudizio personale sulla formattazione e presentazione del frammento selezionato</h5><br><br>" + '<select id="user_formattingscore"><option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option><option>Very poor</option></select><br><br><a id="user_salva" class="button green">Salva</a><a id="user_elimina" class="button red">Elimina</a>');
					$("#modale").fadeIn(200);
					$("#backmodal").fadeIn(200);
					$('#user_salva').click(function() {
					if($("#user_formattingscore").val()=="")alert('Valore non accettato');
						else{
							user_annota_fram[temp].annotazione=$("#user_formattingscore").val();
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
			      		}
			      	});

			      	$('#user_elimina').click(function() {
							var temp_selector="#annot_fram"+ temp;
							$(temp_selector).parent().next().remove();
							$(temp_selector).parent().remove();
							user_annota_fram[temp]=0;
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
							$(".nano").nanoScroller();
					});
					break;

				case "hasClarityScore":
					$("#modale .nano-content").empty();
					$("#modale .nano-content").append("<h5>Inserisci un giudizio personale sulla chiarezza del frammento selezionato</h5><br><br>" + '<select id="user_clarityscore"><option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option><option>Very poor</option></select><br><br><a id="user_salva" class="button green">Salva</a><a id="user_elimina" class="button red">Elimina</a>');
					$("#modale").fadeIn(200);
					$("#backmodal").fadeIn(200);
					$('#user_salva').click(function() {
					if($("#user_clarityscore").val()=="")alert('Valore non accettato');
						else{
							user_annota_fram[temp].annotazione=$("#user_clarityscore").val();
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
			      		}
			      	});

			      	$('#user_elimina').click(function() {
							var temp_selector="#annot_fram"+ temp;
							$(temp_selector).parent().next().remove();
							$(temp_selector).parent().remove();
							user_annota_fram[temp]=0;
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
							$(".nano").nanoScroller();
					});
					break;

				case "hasOriginalityScore":
					$("#modale .nano-content").empty();
					$("#modale .nano-content").append("<h5>Inserisci un giudizio personale sull' originalità del frammento selezionato</h5><br><br>" + '<select id="user_originalityscore"><option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option><option>Very poor</option></select><br><br><a id="user_salva" class="button green">Salva</a><a id="user_elimina" class="button red">Elimina</a>');
					$("#modale").fadeIn(200);
					$("#backmodal").fadeIn(200);
					$('#user_salva').click(function() {
					if($("#user_originalityscore").val()=="")alert('Valore non accettato');
						else{
							user_annota_fram[temp].annotazione=$("#user_originalityscore").val();
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
			      		}
			      	});

			      	$('#user_elimina').click(function() {
							var temp_selector="#annot_fram"+ temp;
							$(temp_selector).parent().next().remove();
							$(temp_selector).parent().remove();
							user_annota_fram[temp]=0;
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
							$(".nano").nanoScroller();
					});
					break;	

				case "cites":
					$("#modale .nano-content").empty();
					$("#modale .nano-content").append("<h5>Inserisci il link dell'articolo citato in questo frammento</h5><br><br>" + '<input id="user_cites" value="' + user_annota_fram[temp].annotazione + '" size="60" type="text" maxlength="200"></input><br><br><br>' + "<h5>Inserisci il titolo dell'articolo citato in questo frammento</h5><br><br>" + '<input id="user_cites_title" value="' + user_annota_fram[temp].extra + '" size="60" type="text" maxlength="200"></input><br><br><a id="user_salva" class="button green">Salva</a><a id="user_elimina" class="button red">Elimina</a>');
					$("#modale").fadeIn(200);
					$("#backmodal").fadeIn(200);
					$('#user_salva').click(function() {
					if(($("#user_cites").val().indexOf('http://') === -1)||($("#user_cites_title").val().length<3))alert('Valori non accettati. il link deve essere della forma "http://xxx.xxx"');
						else{
							user_annota_fram[temp].annotazione=$("#user_cites").val();
							user_annota_fram[temp].extra=$("#user_cites_title").val();
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
			      		}
			      	});

			      	$('#user_elimina').click(function() {
							var temp_selector="#annot_fram"+ temp;
							$(temp_selector).parent().next().remove();
							$(temp_selector).parent().remove();
							user_annota_fram[temp]=0;
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
							$(".nano").nanoScroller();
					});
					break;		

				case "hasComment":
					$("#modale .nano-content").empty();
					$("#modale .nano-content").append("<h3>Inserisci un commento personale relativo a questo frammento</h3><br><br>" + '<textarea id="user_comment_fram" cols="80" rows="8" maxlength="600" ">' + user_annota_fram[temp].annotazione + '</textarea><br><br><a id="user_salva" class="button green">Salva</a><a id="user_elimina" class="button red">Elimina</a>');
					$("#modale").fadeIn(200);
					$("#backmodal").fadeIn(200);
					$('#user_salva').click(function() {
					if($("#user_comment_fram").val().length<3) alert("Valore non accettato")
						else{
							user_annota_fram[temp].annotazione=$("#user_comment_fram").val();
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
			      		}
			      	});

			      	$('#user_elimina').click(function() {
							var temp_selector="#annot_fram"+ temp;
							$(temp_selector).parent().next().remove();
							$(temp_selector).parent().remove();
							user_annota_fram[temp]=0;
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
							$(".nano").nanoScroller();
					});
					break;	

				case "denotesDisease":
					$("#modale .nano-content").empty();
					$("#modale .nano-content").append("<h5>Inserisci la malattia denotata nel frammento</h5><br><br>" + '<select id="user_denotesdisease"><option>Tuberculosis</option><option>Cholera</option><option>Salmonella</option><option>Viral Hepatitis</option><option>Human Immunodeficiency Virus HIV</option><option>Protozoan Infection</option><option>Schizophrenia</option><option>Glaucoma</option><option>Carcinoma</option></select><br><br><br><a id="user_salva" class="button green">Salva</a><a id="user_elimina" class="button red">Elimina</a>');
					$("#modale").fadeIn(200);
					$("#backmodal").fadeIn(200);
					$('#user_salva').click(function() {
					if($("#user_denotesdisease").val()=="")alert('Valore non accettato');
						else{
							user_annota_fram[temp].annotazione=$("#user_denotesdisease").val();
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
			      		}
			      	});

			      	$('#user_elimina').click(function() {
							var temp_selector="#annot_fram"+ temp;
							$(temp_selector).parent().next().remove();
							$(temp_selector).parent().remove();
							user_annota_fram[temp]=0;
							$("#user_salva").unbind( "click" );/*disattivo l'evento click sul pulsante salva e anche su elimina*/
							$("#user_elimina").unbind( "click" );
							$("#modale").fadeOut(200);
							$("#backmodal").fadeOut(200);
							$(".nano").nanoScroller();
					});
					break;		

						
			} 
			
			
	});
}
