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
	"TRIVIA_RELATION_ICON_CONTAINER": "trivia_relation_icon_container",
	"TRIVIA_RELATION_FEELING_CONTAINER": "trivia_relation_feeling_container",
	"TRIVIA_RELATION_DESCRIPTION_CONTAINER": "trivia_relation_description_container",
	
	"LORE_LINE_CONTAINER": "lore_line_container",
	"GALLERY_CONTAINER": "gallery_container",
}

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

function clearSheetInfo() {
	$("#" + INFO_ELEMENT_IDS.INFO_PICTURE + " img").attr("src", null)
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
	console.log(currentSheet)
	
	$("#" + INFO_ELEMENT_IDS.INFO_PICTURE, " img").attr("src", currentSheet.portrait_img)
}

var characterSelectId = "character_sheet_selector"
function createCharacterSelection(data_) {
	var selectorElement = $("<select>");
	
	var defaultSelected = $("<option>")
		.attr("selected", true)
		.attr("disabled", true)
		.html("Select a character")
		.appendTo(selectorElement)
	;
	
	var getSheetId = function getSheetId(groupId_, sheetIndex_) {
		return groupId_ + "____" + sheetIndex_
	}
	
	var getSheet = function getSheet(sheetId_) {
		var components = sheetId_.split("____")
		return data_[components[0]][components[1]]
	}
	
	selectorElement.on("change", function(event_){
		var newSheet = getSheet(selectorElement.val())
		
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
		
		tmpOptGroup.appendTo(selectorElement)
	})
	
	return selectorElement;
}

function initializeSheetElements(mainContainer_) {
	var createPictureContainer = function createPictureContainer(imgSrc_){
		var tmpContainer = $("<div>")
			.addClass("img-container")
		;
		
		var horizonalAlignContainer = $("<div>")
			.addClass("img-horizontal-align")
		;
		
		var verticalAlignContainer = $("<div>")
			.addClass("img-vertical-align")
		;
		
		var tmpImg = $("<img>")
			.attr("src", imgSrc_)
		;
		
		tmpContainer.append(horizonalAlignContainer)
		horizonalAlignContainer.append(verticalAlignContainer)
		verticalAlignContainer.append(tmpImg)
		
		return tmpContainer;
	}
	
	// lineFunction_ must return an element with .row > .col
	var createInfoArrayElement = function createInfoArrayElement(infoArray_, lineFunction_) {
		var tmpContainer = $("<div>")
			.addClass("container-fluid")
		;
		
		infoArray_.forEach(function(infoLine_) {
			tmpContainer.append(lineFunction_(infoLine_))
		})
		
		return tmpContainer;
	}
	
	/*	Create info block ====================================================================== */
	var createInfoBlock = function createInfoBlock(){
		var tmpContainer = $("<div>")
			.addClass("row")
		;
		
		var pictureContainer = createPictureContainer("INFO_PICTURE.PNG")
			.addClass("col-md-6")
			.attr("id", INFO_ELEMENT_IDS.INFO_PICTURE)
		;
		
		var linesContainer = createInfoArrayElement(
				[], 
				function(infoLine_){
					var lineContainer = $("<div>")
						.addClass("row")
					;
					
					return lineContainer;
				}
			)
			.attr("id", INFO_ELEMENT_IDS.INFO_LINE_WRAPPER)
		;
		
		var linesColumn = $("<div>")
			.addClass("col-md-6")
			.append(linesContainer)
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
			.addClass("container-fluid")
		;
		
		return tmpContainer;
	}
	
	/*	Create lore block ====================================================================== */
	var createLoreBlock = function createTriviaBlock() {
		var tmpContainer = $("<div>")
			.addClass("container-fluid")
		;
		
		return tmpContainer;
	}
	
	
	/*	Create gallery block =================================================================== */
	var createGalleryBlock = function createTriviaBlock() {
		var tmpContainer = $("<div>")
			.addClass("container-fluid")
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
	
	var tabContentContainer = $("<div>")
		.addClass("tab-content")
	;
	
	tabContentContainer
		.append(createTabContentElement(tabsIds.TRIVIA).append(createTriviaBlock()))
		.append(createTabContentElement(tabsIds.LORE).append(createLoreBlock()))
		.append(createTabContentElement(tabsIds.GALLERY).append(createGalleryBlock()))
	;
	
	/*	ASSEMBLE THE SHEET ===================================================================== */
	mainContainer_.append(createInfoBlock())
	mainContainer_.append(createTabsBlock())
	mainContainer_.append(tabContentContainer)
}

window.addEventListener(window.EventTypes.DATA_SUCCESS, function(event_){
	var data = event_.detail;
	
	var mainContainer = $($("#main > .inner")[0]);
	var characterSelectorElement = createCharacterSelection(data)
	$("#" + characterSelectId, mainContainer).remove()
	mainContainer.append(characterSelectorElement)
	
	initializeSheetElements(mainContainer)
});

window.addEventListener(window.EventTypes.CHANGE_SHEET, function(event_){
	clearSheetInfo();
});

window.addEventListener(window.EventTypes.SHEET_CHANGED, function(event_){
	if (currentSheet != undefined) {
		updateSheetInfo();
	}
});

getData(dataUrl);

var triggerTabList = [].slice.call(document.querySelectorAll(".nav-tabs .nav-link"))
triggerTabList.forEach(function (triggerEl) {
	var tabTrigger = new bootstrap.Tab(triggerEl)

	triggerEl.addEventListener('click', function (event) {
		event.preventDefault()
		tabTrigger.show()
	})
})