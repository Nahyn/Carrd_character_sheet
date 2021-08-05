/** Définition de la classe EventTargetableObject
 *	Permet l'émulation d'évènements sur des objets Javascript (ie MaClasseHeritee.addEventListener("click", function(){ console.log("Do interesting stuff here !") }) )
 *	@param {HTMLElement} element_ - HTMLElement lié à l'objet sur lequel les events seront appelés
**/
EventTargetableObject = function(element_){
	var self = this;
	
	var _eventElement = element_ || document.createElement("div");
	
	this.addEventListener = function(eventType_, callback_, this_){
		this_ = this_ || this;
		if(eventType_ != undefined){
			if(typeof eventType_ == "string" || eventType_ instanceof String){
				eventType_ = eventType_.split(" ");
			}
		
			for(var i=0 ; i < eventType_.length ; i++){
				_eventElement.addEventListener(eventType_[i], callback_.bind(this_)); 
			}
		}
	};
	this.on = this.addEventListener;

	this.removeEventListener = function(eventType_, callback_){ 
		_eventElement.removeEventListener(eventType_, callback_); 
	};

	this.callEvent = function(eventType_, data_){ 
		if(data_ == undefined){
			data_ = {};
		}
		
		data_.eventTargetableObject = self;
		callEvent(eventType_, _eventElement, data_) 
	};

	this.one = function(eventType_, callback_){ 
		var tmpCallback;
		tmpCallback = function(event_){
			callback_.apply(self, arguments);
			_eventElement.removeEventListener(eventType_, tmpCallback)
		}
		
		_eventElement.addEventListener(eventType_, tmpCallback); 
	};
};


/**	Appel d'un évènement sur l'élément ciblé
 *	@param {string} eventType_ - Nom de l'évènement qui sera appelé
 *	@param {HTMLElement} target_ - Cible sur laquelle l'évènement sera déclenché. Par défaut, la fenêtre est ciblée ("window")
 *	@param {Object} data_ - Donnée supplémentaires accessibles depuis la variable "detail" de l'event
**/
var callEvent;
try {
	// IE ne gère pas "new CustomEvent()" et oblige l'utilise de code obsolète
	new CustomEvent();
	
	callEvent = function(eventType_, target_, data_){
		if(target_ == undefined) {
			target_ = window;
		}
		
		if(eventType_ == undefined) {
			console.warn("Undefined custom event name used");
		}
		
		target_.dispatchEvent(new CustomEvent(eventType_, {"detail": data_}));
	}
} catch (e_) {
	callEvent = function(eventType_, target_, data_){
		if(target_ == undefined) {
			target_ = window;
		}
		
		if(eventType_ == undefined) {
			console.warn("Undefined custom event name used");
		}
		
		var tempEvent = document.createEvent("CustomEvent");
		tempEvent.initCustomEvent(eventType_, true, true, data_);

		target_.dispatchEvent(tempEvent);
	}
}


/** Ajout de nouveaux type d'évènements au constructeur d'un objet
 *	@param {constructor} objectType_ - Classe à laquelle on souhaite rajouter des events
**/
function addEventTypes(objectType_, eventType_){
	if(eventType_ instanceof Array){
		eventType_.forEach(function(currentEventType_){
			addEventTypes(objectType_, currentEventType_);
		});
	} else {
		if(objectType_.EventTypes == undefined){
			objectType_.EventTypes = {}
		}
		
		if(objectType_.EventTypes[eventType_.toUpperCase()] == undefined){
			var eventName = "CustomEvent_";
			
			if(objectType_.name){
				eventName += objectType_.name.replace(/ /g, "_")+"_";
			}
			
			eventName += eventType_.toLowerCase();
			 
			objectType_.EventTypes[eventType_.toUpperCase()] = eventName
		}
	}
}