var app = Backbone.Model.extend({
	
	defaults:{
		templates:{},
		defaultData: {
			user:
			{
				greeting: {
					label: "Greeting",
					data: "Best regards",
					type: "text"
				},
				usersname : {
					label: "Full Name",
					data: "John Doe",
					type: "text"
				},
				jobtitle: {
					label: "Job Title",
					data: "CEO",
					type: "text"
				},
				logourl: {
					label: "Logo URL (Link to your logo)",
					data: "https://placehold.it/114x70?text=LOGO",
					type: "text"
				},
				company: {
					label: "Company Name",
					data: "My Company Name",
					type: "text"
				},
				address: {
					label: "Address",
					data: "Street 163 1512A",
					type: "text"
				},
				city: {
					label: "City",
					data: "Attica",
					type: "text"
				},
				stateprovince: {
					label: "State/Province",
					data: "Athens",
					type: "text"
				},
				postalcode: {
					label: "ZIP/Postal Code",
					data: "151 62",
					type: "text"
				},
				country: {
					label: "Country",
					data: "Greece",
					type: "text"
				},
				telephone: {
					label: "Telephone",
					data: "+30 123 123 123",
					text: "text"
				},
				mobile: {
					label: "Mobile",
					data: "+30 654 21 65 289",
					text: "text"
				},
				email: {
					label: "e-mail",
					data: "myMail@mycompany.com",
					type: "email"
				},
				website: {
					label: "website",
					data: "www.example.com",
					type: "text"
				},
				// socialnetworks: {
				// 	twitter: "http://twitter.com/specktator_",
				// 	facebook: "http://twitter.com/specktator_",
				// 	googleplus: "http://twitter.com/specktator_"
				// },
				disclaimer: {
					label: "Disclaimer",
					data: "Important: This e-mail and its attachments are intended for the above named only and may be confidential. If they have come to you in error you must take no action based on them, nor must you copy or show them to anyone; please contact us immediately.",
					type: "text"
				}
			},
			modal:{
				socialmodal: {
				body: "",
				title: "Choose social network"
				}
			},
			socialicons:{
				twitter:"fa fa-twitter-square",
				facebook:"fa fa-facebook-square",
				googleplus:"fa fa-google-plus-square"
			}
		},
		sigloaded: false
	},

	name:"email signatures",

	initialize: function()
	{
		Handlebars.registerHelper('ifeq',this.ifeq);
	},

	loadScripts: function(jsonfile){
		var scripts = [];
		var a = 0;
		$.getJSON(jsonfile+'.json').done(function(data){
			for(var i in data.app){
				scripts[a]= data.app[i];
				a++;
			}
			head.js(scripts); // use headJS to include all scripts,ordered, from includes.json
		});
	},

	loadTemplates: function(){
		var self = this;
		return $.getJSON('templates.json').then(function(templatesData){
			self.set({templates: templatesData.templates});
		});
	},

	getHTML: function(name, context){
		return $.ajax({
			method:'get',
			url:'html/'+name+'.handlebars',
			mimeType:'text/x-handlebars-template',
			async: false
		}).then(function(source){
			return html = Handlebars.compile(source)(context);
		});
	},

	getEmailSig: function(name, callback){

		$.get('templates/'+name+'.html').done(function(data){
			callback(data);
		});
	},
	ifeq: function(conditional,options)
	{
		if (options.hash.value === conditional) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	}
});


// modals
var ModalModel = app.extend({});

// identities
var identitiesModel = Backbone.Model.extend({

	ls: localStorage,

	initialize: function()
	{
		this.list();
	},

	list: function()
	{
		ids = {};
		for(var key in this.ls)
		{
			if(!this.ls.hasOwnProperty(key) || /sig-/g.test(key) || !/sig[0-9]*/g.test(key)) continue;
			ids[key] = JSON.parse(this.ls[key]);
		}

		this.set({ids: ids}); // set ids anyway

		return ( (Object.keys(ids).length > 0)? ids : false );
	},

	clear: function()
	{
		this.ls.clear();
	},

	idset: function()
	{
		data = {
			template: this.get("template"),
			user:this.get("data")
		};
		this.ls.setItem(this.hashCode(data.user.usersname.data.toString()), JSON.stringify(data));
		console.info('identities saved!');
	},

	getId: function(identity)
	{
		return id = this.get("ids")[identity];
	},

    hashCode: function(str){
        var hash = 0;
        if (str.length == 0) return hash;
        for (i = 0; i < str.length; i++) {
            char = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return "sig"+(hash.toString().replace(/-/,''));
    }
});

/*  VIEWS */
var BaseModalView = Backbone.View.extend({

    el: $('#c'),

    events: {
      // 'change:body': 'update'
    },

    initialize: function() {
    	// this.renderBody();
    	this.render();
    },

	render: function()
	{
		var self = this;
		var context = {
				mid: self.model.get("mid"),
				title: self.model.get("title"),
				text: self.model.get("text"),
				body: self.model.get("body")
			};

		this.model.getHTML(this.model.get("modaltpl")+".modals",context).done(function(data)
		{
			$('#c').html(data);
		});
	}

 });

var alertsView = Backbone.View.extend({
	el: 'body',

	teardown: function(){
		$(this.el).find('.notification').fadeOut('slow').remove();
	},

	notification: function(context){
		this.teardown();
		this.model.getHTML('alerts',context).done(function(source){
			$(this.el).append(data);
		});
	}
});

var identitiesView = Backbone.View.extend({

	saveAlert: function()
	{
		// alerts = new alertsView;
		// alerts.notification({
		// 	position: 'fixed-wide-top',
		// 	type: 'success',
		// 	msg: 'You identity is saved to your browser!'
		// });
	},

	identitiesModal: function()
	{
		this.model.getHTML('identities.modals').done(function(source){
			template = Handlebars.compile(source);
			html = template(context);
			$('#m').html(html);
		});
	}

});

var mainView = Backbone.View.extend({

	initialize: function(){
		this.render();
	},

	render: function(){
		$('div#prevsig').html('<p id="choose">Choose your template first...</p>');
		this.nav();
	},

	nav: function(){
		var model = this.model;
		this.model.getHTML('nav',{appname: app.name, templates: model.get("templates")}).done(function(data){
			$('div#navbar').html(data);
		});

	}

});

var thumbnailsView = Backbone.View.extend({

	// el: $("div#pagecontent"),

	initialize: function(){
		this.thumbs();
	},

	thumbs: function(){
		var model = this.model;
		var el = this.$el;
		this.model.getHTML('thumbs',{appname: app.name, templates: model.get("templates")}).done(function(data){
			el.html(data);
		});
	}
});

var emailSigView = Backbone.View.extend({

	el: $('div#pagecontent'),

	events:{
		"keyup input" : "update",
		"keyup textarea" : "update",
		"keydown input" : "clearTM",
		"paste input" : "update",
		"click #cls" : "copyModal",
		"click #save" : "saveIdentity",
		"click #loadbtn" : "listIdentities",
		"click #clear" : "clearIdentities",
	},

	initialize: function()
	{
		this.identities = new identitiesModel;
		this.identitiesView = new identitiesView;
		// this.listenTo(this.model,"change",this.form);
		this.form();

	},

	timer: null,

	render: function(){
		var el = this.$el;
		var model = this.model;
		var self = this;



		$('div#prevsig').html('<div class="loader4 centerH"></div>');
		clearTimeout(this.timer);
    	this.timer = setTimeout(function()
    	{
    		model.getEmailSig(model.get("tpl"), function(source)
    		{
    			template = Handlebars.compile(source);
    			if( model.get("data") )
    			{
    				var tpldata = { user: $.extend({},model.get("defaultData").user, model.get("data"))};
    			}else
    			{
    				var tpldata = model.get("defaultData");
    			}
    			modal = new BaseModalView({
		    				model: new ModalModel(
		    				{
			    				modaltpl: "copy",
			    				mid: "copyModal",
			    				title: "Copy Signature",
			    				text: "Copy the code below and paste it in your email client!",
			    				body:template( tpldata )
		    				}),
		    				el: $('#c')
						});
    			$('div#prevsig').html( template( tpldata ) );
    			// self.form(tpldata);
				
    		});
    	}, 1000);
	},

	form: function(data)
	{
		var model = this.model;
		
		model.getHTML('formfields',(data || model.get("defaultData"))).done(function(data)
		{
			$('div#pagecontent').html( data );
		});
	},

	update: function( event )
	{
		var model = this.model;
		var data = {};
		if (typeof data[ $(event.target).attr("name") ] === 'undefined')
		{
			data[ $(event.target).attr("name") ] = {};
		}
		data[ $(event.target).attr("name") ].data = $(event.target).val();
		if( model.get("data") )
		{
			data = $.extend({},model.get("data"),data);
		}
		this.loadSigData(data);
		this.render();
	},

	copyModal: function()
	{
		$("#copyModal").modal('show');
	},

	saveIdentity: function()
	{
		this.identities.set({
			template: this.model.get("tpl"),
			data: this.model.get("data")
		});
		this.identities.idset();
		// this.identitiesView.saveAlert();
	},

	listIdentities: function()
	{
		this.identities.list();
		var context = {
				mid: 'identitiesModal',
				modaltpl: 'identities',
				title: 'Load your identity',
				text: 'You can choose any of your identities, modify and save for future use.',
				body: this.identities.get("ids")
			};

		m = new ModalModel;
		m.set(context);

		modalModel = new BaseModalView({
			model: m,
			el:$('#c')
		});
		$('.sig').on("click",function(e){
			$('#identitiesModal').modal("hide");
		});
	},

	clearIdentities: function()
	{
		this.identities.clear();
	},

	loadIdentities: function()
	{
		if(this.model.get("sigid")) this.model.set({data: this.identities.getId(this.model.get("sigid")).user});
		tpldata = { user: $.extend({},this.model.get("defaultData").user, this.model.get("data"))};
		for (var i in tpldata.user) {
			(tpldata.user[i].label)? $('#'+i).prop('placeholder',tpldata.user[i].data) : $('#'+i).val(tpldata.user[i].data);
		}
	},

	loadSigData: function(data)
	{
		if(this.model.get("sigid") && this.model.get("sigloaded") === false){
			this.model.set({ data: $.extend({},data,this.identities.getId(this.model.get("sigid")).user), sigloaded: true });
		}else{
			this.model.set({data:data});
		}
	},

	clearTM: function()
	{
		clearTimeout(this.timer);
	}

});

var _app = new app;

/* ROUTING */

var router = Backbone.Router.extend({
	routes:{
		"":"main",
		"template/:name(/sig/:sig)":"loadEmailSig",
	}
});

var R = new router;

	

R.on('route:main', function()
{
	_mainView = new mainView({el: $('div#pagecontent'), model: _app});
	_thumbsView = new thumbnailsView({el: $('div#pagecontent'), model: _app});
});

R.on('route:loadEmailSig', function (name,sig)
{
	_app.set({tpl: name, sigid:sig || false});
	_mainView = new mainView({el: $('div#pagecontent'), model: _app});
	_emailSigView = new emailSigView({ model: _app });
	_emailSigView.render();
	_emailSigView.loadIdentities();
	// _emailSigView.form();
	// _emailSigView.'modal('{id: "socialmodal", title:"Social Networks", body:""})
});

/*
	social links + icons gia ta email templates-> modal
	thumbnail caption me template name + helper gia social icon (tou author) <i class="fa fa-github-square"></i> 
	unique link generation
	import csv to creat signatures for whole companies
 */
_app.loadTemplates().done(function(){
	Backbone.history.start();
});