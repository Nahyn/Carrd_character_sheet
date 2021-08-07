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
			callEvent(window.EventTypes.DATA_SUCCESS, data_)
		},
		
		"error": function() {
			callEvent(window.EventTypes.DATA_ERROR)
		},
		
		"complete": function() {
			callEvent(window.EventTypes.DATA_COMPLETE)
		}
	})
}

window.addEventListener(window.EventTypes.DATA_SUCCESS, function(event_){
	console.log(event_.detail)
});

window.addEventListener("load", function(){
	getData(dataUrl);
})