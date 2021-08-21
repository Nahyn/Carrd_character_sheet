var dataUrl = "https://raw.githubusercontent.com/Nahyn/Carrd_character_sheet/master/data.json";

addEventTypes(window, [
	"DATA_ERROR",
	"DATA_SUCCESS",
	"DATA_COMPLETE",
	
	"CHANGE_SHEET",
	"SHEET_CHANGED",
]);

var INFO_ELEMENT_IDS = {
	"INFO_PICTURE": "info_picture",
	"INFO_LINE_WRAPPER": "info_line_container",
	
	"TRIVIA_AXIS_CONTAINER": "trivia_axis_container",
	"TRIVIA_GAUGE_CONTAINER": "trivia_gauge_container",
	
	"TRIVIA_RELATION_CONTAINER": "trivia_relation_container",
	"TRIVIA_RELATION_ICON_CONTAINER": "trivia_relation_icon_container",
	"TRIVIA_RELATION_FEELING_CONTAINER": "trivia_relation_feeling_container",
	"TRIVIA_RELATION_DESCRIPTION_CONTAINER": "trivia_relation_description_container",
	
	"LORE_LINE_CONTAINER": "lore_line_container",
	"GALLERY_CONTAINER": "gallery_container",
}

var mainContainer;
var currentSheet = undefined;
function getData(dataFileURL_) {
	$.ajax({
		"url": dataFileURL_,
		
		"data": {
			"random": Date.now()
		},
		
		"success": function(data_) {
			callEvent(window.EventTypes.DATA_SUCCESS, window, JSON.parse(data_))
		},
		
		"error": function() {
			callEvent(window.EventTypes.DATA_ERROR)
		},
		
		"complete": function() {
			callEvent(window.EventTypes.DATA_COMPLETE)
		}
	})
}


var sheetIdSeparator = "____"
var getSheetId = function getSheetId(groupId_, sheetIndex_) {
	return [groupId_, sheetIndex_].join(sheetIdSeparator);
}

var getSheet = function getSheet(data_, sheetId_) {
	var idComponents = sheetId_.split(sheetIdSeparator);
	
	return data_[idComponents[0]][idComponents[1]]
}

var inElementDataUrl = "data-img-url";
var createPictureContainer = function createPictureContainer(imgSrc_){
	var tmpContainer = $("<div>")
		.addClass("img-container")
		.attr("style", "background-image: url('" + imgSrc_ + "')")
		.attr(inElementDataUrl, imgSrc_)
	;
	
	return tmpContainer;
}

// lineFunction_ must return an element with .row > .col
var createListElements = function createListElements(infoArray_, lineFunction_) {
	return infoArray_.map(lineFunction_);
}

function clearSheetInfo() {
	var tmpFirstTab = new bootstrap.Tab($(".nav-link:first-child"))
	tmpFirstTab.show()
	
	$("#" + INFO_ELEMENT_IDS.INFO_PICTURE).attr("style", null)
	$("#" + INFO_ELEMENT_IDS.INFO_LINE_WRAPPER).html("")
	
	$("#" + INFO_ELEMENT_IDS.TRIVIA_AXIS_CONTAINER).html("")
	$("#" + INFO_ELEMENT_IDS.TRIVIA_GAUGE_CONTAINER).html("")
	
	$("#" + INFO_ELEMENT_IDS.TRIVIA_RELATION_ICON_CONTAINER).html("")
	$("#" + INFO_ELEMENT_IDS.TRIVIA_RELATION_FEELING_CONTAINER).html("")
	$("#" + INFO_ELEMENT_IDS.TRIVIA_RELATION_DESCRIPTION_CONTAINER).html("")
	
	$("#" + INFO_ELEMENT_IDS.LORE_LINE_CONTAINER).html("")
	$("#" + INFO_ELEMENT_IDS.GALLERY_CONTAINER).html("")
}

function updateSheetInfo() {
	$("#" + INFO_ELEMENT_IDS.INFO_PICTURE)
		.attr("style", "background-image: url('" + currentSheet.portrait_img + "')")
		.attr(inElementDataUrl, currentSheet.portrait_img)
	;
	
	var infoContainer = createListElements(currentSheet.info, function(infoLine_){
		var titleParts = [];
		
		if(infoLine_.label != undefined) {
			titleParts.push(infoLine_.label.toUpperCase())
		}
		titleParts.push(infoLine_.value)
		
		var rowContainer = $("<div>")
			.addClass("row")
			.attr("title", titleParts.join(" : "))
		;
		
		var tmpContent = $("<div>")
			.addClass("col-12")
			.addClass("info-line")
			.appendTo(rowContainer)
		;
		
		var tmpLabel = $("<span>")
			.html(infoLine_.label)
			.appendTo(tmpContent)
		;
		
		var tmpValue = $("<span>")
			.html(infoLine_.value)
			.appendTo(tmpContent)
		;
		
		return rowContainer;
	});
	$("#" + INFO_ELEMENT_IDS.INFO_LINE_WRAPPER).append(infoContainer);
	
	
	var axisContainer = createListElements(currentSheet.trivia.axis.lines, function(axisLine_){
		var rowContainer = $("<div>")
			.addClass("row")
			.addClass("axis-line")
		;
		
		var leftLabelElement = $("<div>")
			.addClass("col-3")
			.append(
				$("<span>").html(axisLine_.left_label)
			)
			.appendTo(rowContainer)
		;
		
		var axisContainer = $("<div>")
			.addClass("col-6 axis-container")
			.appendTo(rowContainer)
		;
		
		var axisBackground = $("<div>")
			.addClass("axis-background")
			.attr("style", "background-image: url('"+ currentSheet.trivia.axis.axis_img +"')")
			.appendTo(axisContainer)
		;
		
		var cursorPositionner = $("<div>")
			.addClass("axis-cursor-positionner")
			.attr("style", "left: "+ (parseFloat(axisLine_.value.replace(",", ".")) * 100) +"%")
			.append(
				$("<img>")
					.addClass("axis-cursor")
					.attr("src", currentSheet.trivia.axis.cursor_img)
			)
			.appendTo(axisContainer)
		;
		
		var rightLabelElement = $("<div>")
			.addClass("col-3")
			.append(
				$("<span>").html(axisLine_.right_label)
			)
			.appendTo(rowContainer)
		;
		
		return rowContainer;
	});
	$("#" + INFO_ELEMENT_IDS.TRIVIA_AXIS_CONTAINER).append(axisContainer);
	
	var gaugesContainer = createListElements(currentSheet.trivia.gauges.lines, function(gaugeLine_){
		var rowContainer = $("<div>")
			.addClass("row")
			.addClass("gauge-line")
		;
		
		var labelElement = $("<div>")
			.addClass("col-3")
			.append(
				$("<span>").html(gaugeLine_.label)
			)
			.appendTo(rowContainer)
		;
		
		var gaugeContainer = $("<div>")
			.addClass("col-9")
			.appendTo(rowContainer)
		;
		
		var gaugeImg = $("<img>")
			.addClass("gauge-img")
			.attr("src", currentSheet.trivia.gauges.background_img)
			.appendTo(gaugeContainer)
		;
		
		return rowContainer;
	});
	$("#" + INFO_ELEMENT_IDS.TRIVIA_GAUGE_CONTAINER).append(gaugesContainer);
	
	
	var relationContainer = createListElements(currentSheet.trivia.relationships.lines, function(relationLine_, index_){
		var rowContainer = $("<div>")
			.addClass("row")
			.addClass("relationship-line")
		;
		
		var lineId = "relation_" + index_;
		
		var tmpHeader = $("<div>")
			.addClass("col-12")
			.appendTo(rowContainer)
		;
		
		var headerContent = $("<a>")
			.attr({
				"data-bs-toggle" : "collapse",
				"href" : "#" + lineId,
			})
			.appendTo(tmpHeader)
		;
		
		var tmpIcon = $("<img>")
			.attr("src", relationLine_.icon)
			.appendTo(headerContent)
		;
		
		var tmpLabel = $("<span>")
			.html(relationLine_.name)
			.appendTo(headerContent)
		;
		
		var tmpBody = $("<div>")
			.addClass("col-12")
			.addClass("collapse")
			.attr({
				"id": lineId,
			})
			.appendTo(rowContainer)
			.append(
				createListElements(relationLine_.text, function(textLine_){
					return $("<span>")
						.addClass("relation-text")
						.html(textLine_)
					;
				})
			)
		;
		
		
		return rowContainer;
	});
	$("#" + INFO_ELEMENT_IDS.TRIVIA_RELATION_CONTAINER).append(relationContainer);
	new bootstrap.Collapse($("", "#" + INFO_ELEMENT_IDS.TRIVIA_RELATION_CONTAINER))
	
	
	
	var loreContainer = createListElements(currentSheet.lore, function(loreLine_){
		var rowContainer = $("<div>")
			.addClass("row")
		;
		
		var tmpContent = $("<div>")
			.addClass("col-12")
			.addClass("lore-line")
			.appendTo(rowContainer)
		;
		
		var tmpLabel = $("<span>")
			.html(loreLine_)
			.appendTo(tmpContent)
		;
		
		return rowContainer;
	});
	$("#" + INFO_ELEMENT_IDS.LORE_LINE_CONTAINER).append(loreContainer);
	
	
	var galleryContainer = createListElements(currentSheet.gallery, function(galleryLine_){
		var tmpContent = $("<div>")
			.addClass("col-md-6")
			.addClass("gallery-line")
		;
		
		var tmpImage = createPictureContainer(galleryLine_)
			.appendTo(tmpContent)
		;
		
		return tmpContent;
	});
	
	$("#" + INFO_ELEMENT_IDS.GALLERY_CONTAINER).append(
		$("<div>")
			.addClass("row")
			.append(galleryContainer)
	);
}

var characterSelectId = "character_sheet_selector"
function createCharacterSelection(data_) {
	sheetSelect = $("<select>");
	
	var defaultSelected = $("<option>")
		.attr("selected", true)
		.attr("disabled", true)
		.html("Select a character")
		.appendTo(sheetSelect)
	;
	
	sheetSelect.on("change", function(event_){
		var newSheet = getSheet(data_, sheetSelect.val())
		
		callEvent(window.EventTypes.CHANGE_SHEET, window, newSheet)
		currentSheet = newSheet;
		callEvent(window.EventTypes.SHEET_CHANGED, window, newSheet)
	})
	
	Object.keys(data_).forEach(function(groupId_){
		var tmpOptGroup = $("<optgroup>");
		tmpOptGroup.attr("label", groupId_);
		
		var characterArray = data_[groupId_];
		characterArray.forEach(function(characterLine_, sheetIndex_) {
			var characterName = "Character " + sheetIndex_
			
			if(characterLine_.info) {
				var nameInfoLine = characterLine_.info.find(function(infoLine_){
					return (["NOM", "NAME"]).indexOf(infoLine_.label.toUpperCase() != -1)
				})
				
				if(nameInfoLine != undefined) {
					characterName = nameInfoLine.value
				}
			}
			
			var sheetId = getSheetId(groupId_, sheetIndex_)
			
			var optionElement = $("<option>")
				.attr("value", sheetId)
				.html(characterName)
				.appendTo(tmpOptGroup)
		})
		
		tmpOptGroup.appendTo(sheetSelect)
	});
	
	return sheetSelect;
}

function initializeSheetElements(mainContainer_) {
	/*	Create info block ====================================================================== */
	var createInfoBlock = function createInfoBlock(){
		var tmpContainer = $("<div>")
			.attr("id", "info-block")
			.addClass("row")
		;
		
		var pictureContainer = createPictureContainer("INFO_PICTURE.PNG")
			.addClass("col-md-6")
			.attr("id", INFO_ELEMENT_IDS.INFO_PICTURE)
		;
		
		var linesColumn = $("<div>")
			.addClass("col-md-6")
			.attr("id", INFO_ELEMENT_IDS.INFO_LINE_WRAPPER)
		;
		
		tmpContainer.append(pictureContainer);
		tmpContainer.append(linesColumn);
		
		return tmpContainer;
	}
	
	/*	Create tabs block ====================================================================== */
	var tabsIds = {
		"TRIVIA": "trivia_container_element",
		"LORE": "lore_container_element",
		"GALLERY": "gallery_container_element"
	}
	var createTabsBlock = function createTabsBlock() {
		var tmpContainer = $("<div>")
			.attr("id", "tab-block")
			.addClass("row")
		;
		
		var tmpColumn = $("<div>")
			.addClass("col-12")
			.appendTo(tmpContainer)
		;
		
		var navElement = $("<nav>")
			.appendTo(tmpColumn)
		;
		
		var tempContent = $("<div>")
			.addClass("nav nav-tabs")
			.attr("role", "tablist")
			.appendTo(navElement)
		;
		
		Object.keys(tabsIds).forEach(function(tabLabel_, index_){
			var tmpTabId = tabsIds[tabLabel_];
			
			var tmpTab = $("<button>")
				.addClass("nav-link")
				.attr({
					"id": "tab-" + tmpTabId,
					"role": "tab" ,
					"data-bs-toggle": "tab",
					"data-bs-target": "#" + tmpTabId,
					"aria-controls": tmpTabId,
					"aria-selected": "false",
				})
				.html(tabLabel_)
				.appendTo(tempContent)
			;
		});
		
		return tmpContainer;
	}
	
	/*	Create trivia block ==================================================================== */
	var createTriviaBlock = function createTriviaBlock() {
		var tmpContainer = $("<div>")
			.addClass("row")
		;
		
		var tmpAxisContainer = $("<div>")
			.addClass("col-12")
			.attr("id", INFO_ELEMENT_IDS.TRIVIA_AXIS_CONTAINER)
			.appendTo(tmpContainer)
		;
		
		var tmpGaugesContainer = $("<div>")
			.addClass("col-12")
			.attr("id", INFO_ELEMENT_IDS.TRIVIA_GAUGE_CONTAINER)
			.appendTo(tmpContainer)
		;
		
		var tmpRelationshipContainer = $("<div>")
			.addClass("col-12")
			.attr("id", INFO_ELEMENT_IDS.TRIVIA_RELATION_CONTAINER)
			.appendTo(tmpContainer)
		;
		
		var tmpRelationshipContent = $("<div>")
			.addClass("row")
			.appendTo(tmpRelationshipContainer)
		;
		
		return tmpContainer;
	}
	
	/*	Create lore block ====================================================================== */
	var createLoreBlock = function createTriviaBlock() {
		var tmpContainer = $("<div>")
			.addClass("row")
		;
		
		var tmpContent = $("<div>")
			.addClass("col-12")
			.attr("id", INFO_ELEMENT_IDS.LORE_LINE_CONTAINER)
			.appendTo(tmpContainer)
		;
		
		return tmpContainer;
	}
	
	
	/*	Create gallery block =================================================================== */
	var createGalleryBlock = function createTriviaBlock() {
		var tmpContainer = $("<div>")
			.addClass("row")
		;
		
		var tmpContent = $("<div>")
			.addClass("col-12")
			.attr("id", INFO_ELEMENT_IDS.GALLERY_CONTAINER)
			.appendTo(tmpContainer)
		;
		
		return tmpContainer;
	}
	
	
	/*	Create tab content ===================================================================== */
	var createTabContentElement = function createTabContentElement(tabId_) {
		return $("<div>")
			.addClass("tab-pane fade")
			.attr({
				"id": tabId_,
				"role": "tabpanel",
				"aria-labelledby": "nav-contact-tab"
			})
		;
	}
	
	var tabContentBlock = $("<div>")
		.attr("id", "tab-content-container")
		.addClass("tab-content")
	;
	
	tabContentBlock
		.append(createTabContentElement(tabsIds.TRIVIA).append(createTriviaBlock()))
		.append(createTabContentElement(tabsIds.LORE).append(createLoreBlock()))
		.append(createTabContentElement(tabsIds.GALLERY).append(createGalleryBlock()))
	;
	
	var tabContentContainer = $("<div>")
		.addClass("row")
		.append(
			$("<div>")
				.addClass("col-12")
				.append(tabContentBlock)
		)
	;
	
	/*	ASSEMBLE THE SHEET ===================================================================== */
	mainContainer_.append(createInfoBlock())
	mainContainer_.append(createTabsBlock())
	mainContainer_.append(tabContentContainer)
}

window.addEventListener(window.EventTypes.DATA_SUCCESS, function(event_){
	var data = event_.detail;
	
	var characterSelectorElement = createCharacterSelection(data)
	mainContainer.append(characterSelectorElement)
});

window.addEventListener(window.EventTypes.CHANGE_SHEET, function(event_) {
	if (currentSheet == undefined) {
		mainContainer = $($("#main > .inner")[0]);
		initializeSheetElements(mainContainer)
	}
	clearSheetInfo();
});

window.addEventListener(window.EventTypes.SHEET_CHANGED, function(event_) {
	if (currentSheet != undefined) {
		updateSheetInfo();
	}
});

var imgModal;
var showImgModal = function(imgSrc_){
	if(imgModal == undefined) {
		imgModal = createPictureContainer("")
			.addClass("img-modal")
			.appendTo($("body"))
			.on("click", function(){
				hideImgModal();
			})
		;
	}
	
	imgModal
		.attr("style", "background-image: url('" + imgSrc_ + "')")
		.removeClass("hide")
	;
}

var hideImgModal = function(){
	imgModal.addClass("hide");
}

window.addEventListener("load", function(){
	$("body").on("click", ".img-container:not(.img-modal)", function(event_){
		var currentTarget = $(event_.currentTarget);
		var imgUrl = currentTarget.attr(inElementDataUrl);
		
		showImgModal(imgUrl)
	})
	
	mainContainer = $($("#main > .inner")[0]);
	getData(dataUrl);
})

var triggerTabList = [].slice.call(document.querySelectorAll(".nav-tabs .nav-link"))
triggerTabList.forEach(function (triggerEl) {
	var tabTrigger = new bootstrap.Tab(triggerEl)

	triggerEl.addEventListener('click', function (event) {
		event.preventDefault()
		tabTrigger.show()
	})
})