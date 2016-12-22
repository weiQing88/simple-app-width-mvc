
var app = miApp(window);
    app.model('todoMdole',function(items){
    	  var Events = app.getEvents();
  		  items === '' && ( items = [] );
  	      this.items = items;
  	      this.itemIndex = -1;

  	      this.addEvent = new Events(this);
  	      this.deleteEvent = new Events(this);

  	      this.getItem = function(){
  	      			return [].concat(this.items);
  	      };	

  	      this.addItem = function(item){
  	      	 this.items.push(item);
  	      	 this.addEvent.notify();
  	      };

  	     this.deleteItem = function(){
  	     	 this.items.splice(itemIndex,1);
  	     	 this.deleteItemEvent.notify();
  	     };

  	     this.setItemAsSelected = function(selected){
  	     	   this.itemIndex = selected;
  	     }
  });


  app.view('todoView',function(model,elements){

  			var Events = app.getEvents();
  			var self = this;

  		    this.model = model;
  		    this.elements = elements;

  		    this.addEvent =  new Events(this);
  		    this.deleteEvent = new Events(this);

  		    this.show = function(){
  		    	 this.rebuild();
  		    };

  		   this.rebuild = function(){
  		   		var items = this.model.getItem(), 
  		   		    len = items.length,
  		   		    dom = document.createDocumentFragment(),
  		   		    ul = this.elements.ul,
  		   		    i; 

  		   		for(i=0;i<len;i+=1){
  		   			var li = document.createElement('li');
  		   				li.innerHTML = items[i];
  		   			    dom.appendChild(li);
  		   		}
  		   	   ul.empty();
  		       ul.append(dom);		
  		   };  
	

  		    this.model.addEvent.attach(function(){
  		    		self.rebuild()
  		    });

  		    this.model.deleteEvent.attach(function(){
  		    	  self.rebuild()
  		    });


  		    this.elements.ul.on('click','li',function(event){
  		    	  console.log(event.target);
  		    });


  		    this.elements.add.on('click',function(event){  
  		    		self.addEvent.notify(event);
  		    });


  
  });


  app.controller('todoController',['todoMdole','todoView',function(dependancies){

  			var self = this;

  		   this.model = new dependancies[0](['今晚回去收拾衣服','记得把房间打扫一遍','办公室的电脑记得关机']);

  		   this.view = new dependancies[1](this.model,{'ul':$('ul.col-6'),'add':$('.addItemBtn'),'input':$('#inputTxt')});

  		   this.view.addEvent.attach(function(){
  		   			var val = self.view.elements.input.val();
  		   			self.model.addItem(val);
  		   });

  		 this.view.show();  
  }]);


  app.config('todoController','home','/');

  app.initialize();
