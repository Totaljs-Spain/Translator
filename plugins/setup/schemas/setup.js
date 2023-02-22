NEWSCHEMA('Setup', function(schema) {

	schema.define('name', String, true);
	schema.define('totalapi', String);
	schema.define('allow_tms', Boolean);
	schema.define('secret_tms', String);
	schema.define('op_reqtoken', String);
	schema.define('op_restoken', String);
	schema.define('language', String);
	schema.define('translator', String);
	schema.define('key', String);
	schema.define('badhashes', String);

	schema.action('permissions', {
		name: 'Check permissions',
		action: function($) {
			if (!UNAUTHORIZED($, 'setup'))
				$.success();
		}
	});

	schema.action('save', {
		name: 'Save configuration',
		action: function($, model) {
			COPY(model, MAIN.db.config);
			LOADCONFIG(model);
			MAIN.db.save();
			$.success();
		}
	});

	schema.action('read', {
		name: 'Read configuration',
		action: function($) {
			$.callback(MAIN.db.config);
		}
	});

	schema.action('account', {
		name: 'Read account data',
		action: async function($) {
			$.callback($.user.json ? $.user.json() : $.user);
		}
	});

	schema.action('active', {
		name: 'Active languages list',
		input: 'id:String, name:String',
		action: function($) {
			DB().query('SELECT id, {0} as name FROM {1}cl_language WHERE active = TRUE ORDER BY {0} ASC'.format(CONF.language || 'en', MAIN.schema)).callback($.callback);
		}
	});

	schema.action('ready', {
		name: 'Ready to use languages list',
		input: 'id:String, name:String',
		action: function($) {
			DB().query('SELECT id, {0} as name FROM {1}cl_language WHERE ready = TRUE ORDER BY {0} ASC'.format(CONF.language || 'en', MAIN.schema)).callback($.callback);
		}
	});
});