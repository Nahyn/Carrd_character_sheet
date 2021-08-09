var dataUrl = "https://raw.githubusercontent.com/Nahyn/Carrd_character_sheet/master/data.json";

addEventTypes(window, [
	"DATA_ERROR",
	"DATA_SUCCESS",
	"DATA_COMPLETE",
]);

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
		var newSheet = getSheet(selectorElement.val());
		console.log(newSheet)
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

window.addEventListener("load", function(){
	window.addEventListener(window.EventTypes.DATA_SUCCESS, function(event_){
		var data = event_.detail;
		
		var mainContainer = $($("#main > .inner")[0]);
		var characterSelectorElement = createCharacterSelection(data)
		$("#" + characterSelectId, mainContainer).remove()
		mainContainer.append(characterSelectorElement)
	});
	
	getData(dataUrl);
})

getData(dataUrl);