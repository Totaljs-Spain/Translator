NEWSCHEMA('Languages', function(schema) {

	schema.action('permissions', {
		name: 'Check permissions',
		action: function($) {

			if (!UNAUTHORIZED($, 'languages'))
				$.success();

		}
	});

	schema.action('list', {
		name: 'Languages list',
		input: 'id:String,active:Boolean,ready:Boolean',
		action: function($) {
			DB().list('cl_language').autoquery($.query, 'id:UID,active:Boolean,ready:Boolean,en:String,' + CONF.language, CONF.language + '_asc' ,200).callback($.callback);
		}
	});

	schema.action('active', {
		name: 'Active languages list',
		input: 'id:String,name:String',
		action: function($) {
			DB().query('SELECT id, {0} as name FROM {1}cl_language WHERE active = TRUE ORDER BY {0} ASC'.format(CONF.language, MAIN.schema)).callback($.callback);
		}
	});

	schema.action('activate', {
		name: 'Activate language',
		input: 'id:String,name:String',
		action: async function($) {
			var opt = $.query;
			opt.active = opt.active === 'false';

			DB().query('ALTER TABLE {1}cl_language ADD COLUMN IF NOT EXISTS {0} text;'.format(opt.id, MAIN.schema)).callback(function(err, response) {
				DB().query('ALTER TABLE {1}tbl_translation ADD COLUMN IF NOT EXISTS {0} text;'.format(opt.id, MAIN.schema)).callback($);
				DB().query('UPDATE {1}cl_language SET {0}=en;'.format(opt.id, MAIN.schema)).callback($);
				DB().modify('cl_language', { 'active': opt.active }).id(opt.id).callback($.callback);
			});
		}
	});

	schema.action('ready', {
		name: 'Activate language',
		input: 'id:String,name:String',
		action: function($) {
			var opt = $.query;
			opt.ready = opt.ready === 'false';
			DB().modify('cl_language', { 'ready': opt.ready }).id(opt.id).callback($.callback);
		}
	});

		schema.action('create', {
		name: 'Create app',
		action: async function($, model) {
			var params = $.params;
			DB().insert('cl_language', params).callback($.callback);
		}
	});

	schema.action('update', {
		name: 'Update language',
		//params: '*id:String,active:Boolean,ready:Boolean,{0}:String'.format(CONF.language),
		action: async function($, model) {
			var params = $.params;
			DB().modify('cl_language', { [CONF.language]: model.name, active: model.active, ready: model.ready }).id(model.id).callback($.callback);
		}
	});
});