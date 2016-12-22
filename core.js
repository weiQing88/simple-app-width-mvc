 var miApp =(function(window,undefined){

 	 var Events = function(sender){
 	 	     this.sender = sender;
 	 	     this.listeners = [];
 	 }

 	 Events.prototype = {
 	 		constructor : Event,
 	 		attach : function(listener){
 	 			 this.listeners.push(listener)
 	 		},
 	 		notify:function(args){
 	 				var len = this.listeners.length;
 	 			 for(var i = 0; i< len;i+=1){
 	 			 	 this.listeners[i](this.sendar,args);
 	 			 }
 	 		}
 	 };



  var Resources = {
  	    'controllers' : {},
  	    'dependancies': {},
  	    'routeMap' : [],
  	    'models' : {},
  	    'views' : {}
  };


var routeobj = function(controller,routerName,url){
	 this.controller = controller;
	 this.routeName = routerName;
	 this.url = url;
}

 

  var Router = {
  	    'routeMap' : {},
  	    'defaultRoute' : null,
  	    'container' : null,
  	    'config' : function(controllerName,routeName,url){
 	  	 this.routeMap[routeName] = new routeobj(controllerName,routeName,url);
 	  	 return this;
      },

       'links' : function(){
 	    var links = document.querySelectorAll('*[data-route]'),
 	        links_len = links.length;
 	        document.body.onclick = function(event){
 	        	 var target = event.target;
 	        	     name = target.nodeName.toLowerCase();
 	        	     if(name === 'a'){
 	        	     	if(!!target.getAttribute('data-route'))
 	        	     	  window.location.hash = encodeURI(target.getAttribute('data-route'));
 	        	     }
 	        };

 	   return this;   
     },

    'getRouteMap' : function(){ return this.routeMap},

    'listener' : function(){ 
    			   var decodeurl =  decodeURI(window.location.hash),
			 		   pageHash = decodeurl.replace('#',''),
			 		   routename = pageHash.replace('/','').replace(/\?(.*)$/,''),
			 		   routeobj = this.routeMap[routename],
			 		   controller = null,
				 	   dependancies = null;

		
				   (!!routeobj) == false && (routeobj = this.defaultRoute);

		 		    controller =  Resources.controllers[routeobj.controller];

		 		  	 dependancies = Resources.dependancies[routeobj.controller];

		 		  	 dependancies = api.loadDependancy(dependancies);

		 		     controller(dependancies);  // 执行控制器

    },


    initialize : function(){
          this.links();

 	   var self = this;
 	       try{
 			   this.defaultRoute = this.routeMap[Object.getOwnPropertyNames(this.routeMap)[0]]; 
 	       }catch(err){
 	       		var propertyNames = [],i;
 	            for(i in this.routeMap){ propertyNames.push(i) }
 	            this.defaultRoute =this.routeMap[propertyNames[0]]; 
 	       }

 	     window.onhashchange = this.listener.bind(this);

 	    this.listener(); // 初始化页面路由

    }


  };






 var api = {

 		'controller' : function(controllerName,handler){

 				if(typeof handler === 'function'){
 					    Resources.controllers[controllerName] = handler;
 				}else{
 					 if(handler.length <= 1) throw new Error('如果没有依赖，可直接使用函数作为参数!');
 				    var lastIndex = handler.length - 1;
 				    var dependancies = handler.slice(0,-1);
	 				if(typeof handler[lastIndex] === 'function'){

	 			    	   Resources.controllers[controllerName] = handler[lastIndex];
	 			    	   Resources.dependancies[controllerName] = dependancies;

	 			    }else{
	 			        throw new Error('无法创建 controller');
	 			    }

 				}
 		   return this;
 		},

 		'model' : function(modelName,model){
 			  if(typeof model == 'function'){
 			 	   Resources.models[modelName] = model;
 			  }else{
 			  	  throw new Error('无法创建 model ');
 			  }
 			return this;
 		},
 		'view' : function(viewName,view){
				if(typeof view === 'function'){
			    	   Resources.controllers[viewName] = view;
			    }else{
			       throw new Error('无法创建 view ');
			    }
		   return this;   
 		},

 	   'loadDependancy' : function(arrayArg){ 
 	   		 var dependancies = [];
 	   		 var len = arrayArg.length,
 	   		     i;
 	   		 for(i=0;i<len;i+=1){

 	   		 	  if(typeof arrayArg[i] === 'string'){
 	   		 	  	  if(Resources.controllers.hasOwnProperty(arrayArg[i])){
 	   		 	  	  	    dependancies.push(Resources.controllers[arrayArg[i]]);
 	   		 	  	  }else{
 	   		 	  	  	  if(Resources.models.hasOwnProperty(arrayArg[i])){
 	   		 	  	  	  	  	 dependancies.push(Resources.models[arrayArg[i]])
 	   		 	  	  	  }else{
 	   		 	  	  	  	  if(Resources.views.hasOwnProperty(arrayArg[i])){
 	   		 	  	  	  	  		dependancies.push(Resources.views[arrayArg[i]]);
 	   		 	  	  	  	   }else{
 	   		 	  	  	  	   	 throw new Error('无法找到依赖模块 “'+ arrayArg[i] +'”');
 	   		 	  	  	  	   }

 	   		 	  	  	  }	
 	   		 	  	 
 	   		 	  	  }

 	   		 	  }

 	   		 }
 	   	   return dependancies;	 
 	   }

 };



function loadDependancy(){
		 api.loadDependancy(arguments[0]);
		 return this;
}

function controller(){
		 api.controller(arguments[0],arguments[1]);
		 return this;
}

function config(){
		Router.config(arguments[0],arguments[1],arguments[2]);
	    return this;
}

function router(){
		  return Router;
}

function model(){
		 api.model(arguments[0],arguments[1]);
		return this; 
}

function view(){
		 api.view(arguments[0],arguments[1]);
		return this; 
}

function initialize(){
		 Router.initialize()
}

function getEvents(){
	 return Events;
}

return {
	     'loadDependancy' : loadDependancy,
		 'controller' : controller,
		 'config' :  config,
		 'router' : router,
		 'model' : model,
		 'view' : view,
		 'initialize' : initialize,
		 'getEvents' : getEvents
}


});
