exports.install = function() {
	CORS();
	ROUTE('+GET /*', index);
	ROUTE('GET /ict/*', translations);
};

async function translations() {
	var $ = this;
	if(!$.query)
		return;

	var app = $.query.ict;
	var translations = {};
	translations.languages = await DB().find('cl_language').where('ready', true).promise($);
	if($.query.languages) {
		$.json(translations.languages);
		return;
	}

	for (var i = 0; i < translations.languages.length; i++) {
		var item = translations.languages[i];
		var lang = item.id;
		translations[lang] = await DB().find('tbl_translation').fields('hash, '+ lang).where('app', app).promise($);
	}
	$.json(translations);
}

function index() {

	var self = this;
	var plugins = [];

	for (var key in F.plugins) {
		var item = F.plugins[key];
		if (self.user.sa || !item.visible || item.visible(self.user)) {
			var obj = {};
			obj.id = item.id;
			obj.routes = item.routes;
			obj.position = item.position;
			obj.name = TRANSLATOR(self.user.language || '', item.name);
			obj.icon = item.icon;
			obj.import = item.import;
			plugins.push(obj);
		}
	}

	plugins.quicksort('position');
	self.view('index', plugins);
}