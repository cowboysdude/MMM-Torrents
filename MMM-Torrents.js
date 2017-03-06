 /* Magic Mirror
    * Module: MMM-Torrents    
    *
    * By cowboysdude
    * 
    */
   
Module.register("MMM-Torrents", {

       // Module config defaults.
       defaults: {
           updateInterval: 60*1000, // every 10 minutes
           animationSpeed: 5,
           initialLoadDelay: 4, // 0 seconds delay
           retryDelay: 1500,
           maxWidth: "400px",
           fadeSpeed: 0,
           rotateInterval: 5 * 1000
           
       },
       
       // Define required scripts.
       getScripts: function() {
           return ["moment.js"];
       },
       
       getStyles: function() {
           return ["MMM-Torrents.css"];
       },

       // Define start sequence.
       start: function() {
           Log.info("Starting module: " + this.name);
           
           // Set locale.
           this.url = "https://eztv.ag/ezrss.xml";
           this.torrents = {};
           this.today = "";
           this.activeItem = 0;
           this.rotateInterval = null;
           this.scheduleUpdate();
       },

      getDom: function() {
         
         var torrents = this.torrents;
         
         var wrapper = document.createElement("div");
         wrapper.className = "wrapper";
         wrapper.style.maxWidth = this.config.maxWidth;
         
         var header = document.createElement("header");
         header.className = "header";
         header.innerHTML = "TV Torrents'  " + moment().format('MM/DD/YYYY');
         wrapper.appendChild(header);
         
          var hkeys = Object.keys(torrents);
			if(hkeys.length > 0){
           	if(this.activeItem >= hkeys.length){
				this.activeItem = 1;
			}
         var torrents = this.torrents[hkeys[this.activeItem]];
		
         var top = document.createElement("div");
         top.classList.add("content");

         var tor = document.createElement("p");
         tor.classList.add("small", "bright");
         tor.innerHTML = torrents.title;
         top.appendChild(tor);

         var pdate = document.createElement("p");
         pdate.classList.add("xsmall", "bright");
         pdate.innerHTML = torrents.pubDate;
         top.appendChild(pdate);

         wrapper.appendChild(top);
         }
         return wrapper;
     },
     
     processTorrents: function(data) {
         this.today = data.Today;
         this.torrents = data;
         this.loaded = true;
     },
     
      scheduleCarousel: function() {
       		console.log("Scheduling Torrents...");
	   		this.rotateInterval = setInterval(() => {
				this.activeItem++;
				this.updateDom(this.config.animationSpeed);
			}, this.config.rotateInterval);
	   },
     
     scheduleUpdate: function() {
         setInterval(() => {
             this.getTorrents();
         }, this.config.updateInterval);
         this.getTorrents(this.config.initialLoadDelay);
         var self = this;
     },

     getTorrents: function() {
         this.sendSocketNotification('GET_TORRENTS', this.url);
     },

     socketNotificationReceived: function(notification, payload) {
         if (notification === "TORRENTS_RESULT") {
             this.processTorrents(payload);
             if(this.rotateInterval == null){
			   	this.scheduleCarousel();
			   }
               this.updateDom(this.config.animationSpeed);
         }
         this.updateDom(this.config.initialLoadDelay);
     },

 });
