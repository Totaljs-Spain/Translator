const Fs = require('fs');

NEWSCHEMA('Translations', function(schema) {

	schema.action('permissions', {
		name: 'Check permissions',
		action: function($) {

			if (!UNAUTHORIZED($, 'translator'))
				$.success();
		}
	});

	schema.action('active', {
		name: 'Active languages list',
		input: 'id:String, name:String',
		action: function($) {
			DB().query('SELECT id, {0} as name FROM {1}cl_language WHERE active = TRUE ORDER BY {0} ASC'.format(CONF.language || 'en', MAIN.schema)).callback($.callback);
		}
	});

    schema.action('app', {
        name: 'List of Apps',
        permissions: 'translator',
        action: function($) {
            DB().find('tbl_app').fields('id,name,icon,url').sort('name').callback($.callback);
        }
    });

	schema.action('app_insert', {
        name: 'Add App',
        permissions: 'translator',
        action: function($, model) {
			model.id = UID();
            DB().insert('tbl_app', model).callback($.callback);
        }
    });

	schema.action('translations', {
        name: 'List of localizations',
        permissions: 'translator',
        action: async function($) {
			var opt = $.query;
			$.query[opt.language] = $.query.name;
			opt[opt.language] = opt.name;

		if(opt.sort)
			opt.sort = opt.sort.replace('name', opt.language);

			var builder = await DB().list('tbl_translation').autoquery($.query, 'id:UID,text:String,deferr:Boolean,hash:String,app:String,{0}:String'.format(opt.language), opt.sort, opt.limit);
			builder.where('app', opt.app);
			opt.showempty && builder.empty(opt.showempty);
			builder.callback(function(err, response) {
				response.items = response.items.map(i => { return { 'id': i.id, 'text': i.text, 'deferr': i.deferr, 'hash': i.hash, 'name': i[opt.language] }; });
				$.callback(response);
			});
        }
    });

	schema.action('update', {
		name: 'Update translation',
		action: async function($, model) {
			DB().modify('tbl_translation', { [model.language]: model.name }).id(model.id).callback($.callback);
			FUNC.loadresources();
		}
	});

    schema.action('import', {
        name: 'Import resource to language/app',
        permissions: 'translator',
        action: async function($) {
			var body = $.query.body.parseConfig();
			var app = $.query.app;
			var language = $.query.language;
			var keys = Object.keys(body);
			for (var i = 0; i < keys.length; i++) {
				var item = keys[i];
				var def = item.substring(0,1) != 'T';
				var obj = {};
				obj.app = app;
				obj.hash = item;
				obj.text = body[item];
				obj[language] = body[item];
				obj.deferr = def;

				var translated = await DB().one('tbl_translation').where('hash', obj.hash).where('app', obj.app).promise($);

				if(translated) {
					await DB().modify('tbl_translation', obj).where('hash', obj.hash).where('app', obj.app).promise($);
				} else {
					obj.id = UID();
					await DB().insert('tbl_translation', obj).promise($);
				}
			}

			$.callback(keys.length);
        }
    });

	schema.action('merge', {
		name: 'Merge hash already translated from other app to empty hashes',
		action: async function($, model) {
			var origin = await DB().find('tbl_translation').fields('id,app,hash,{0}'.format(model.langsel)).where('app', model.appsel).empty(model.langsel).promise($);
			origin.wait(async function(item, next) {
				var translated = await DB().query('SELECT {0} as name FROM {5}tbl_translation WHERE id != {1} AND app != {2} AND hash = {4} AND {3} IS NOT NULL;'.format(model.langsel, PG_ESCAPE(item.id), PG_ESCAPE(item.app), PG_ESCAPE(model.langsel), PG_ESCAPE(item.hash), MAIN.schema )).promise($);
				if(translated.length) {
					DB().modify('tbl_translation', { [model.langsel] : translated[0].name }).id(item.id).callback(next);
				} else
					next();
			}, function() {
				$.callback();
			});
		}
	});

	schema.action('localize', {
		name: 'Get localized tags',
		action: async function($) {

			var opt = $.query;
			var dir;

			if(!opt.app || opt.app === '1') {
				dir = PATH.root();
			} else {
				var app = await DB().one('tbl_app').id(opt.app).promise($);
				if(!app)
					$.invalid();

				dir = app.path;
			}

			U.ls(dir, async function(files) {
				var resource = {};
				var texts = {};
				var count = 0;
				var output = []; // 'Hash;Text;Translation;App'

				for (var i = 0, length = files.length; i < length; i++) {
					var filename = files[i];
					var ext = U.getExtension(filename);

					if (ext !== 'html' && ext !== 'js')
						continue;

					var content = Fs.readFileSync(filename).toString('utf8');
					var command = FUNC.view_find_localization(content, 0);
					while (command !== null) {

						// Skip for direct reading
						if (command.command[0] === '#' && command.command[1] !== ' ') {
							command = FUNC.view_find_localization(content, command.end);
							continue;
						}

						var key = 'T' + HASH(command.command, true).toString(36);

						texts[key] = command.command;

						// Known Bad hashes
						var badhashes = CONF.badhashes.split(',');

						if (!resource[key] && !badhashes.includes(key)) {
							output.push({ hash: key, text: command.command, app: opt.app });
							resource[key] = true;
							count++;
						}

						command = FUNC.view_find_localization(content, command.end);
					}
				}

				// Insert/Modify
				output.wait(async function(item, next) {
					item.deferr = false;
					var exist = await DB().one('tbl_translation').where('hash', item.hash).where('app', item.app).promise($);

					if (exist && exist.id) {
						item.id = exist.id;
						await DB().modify('tbl_translation', item).where('hash', item.hash).where('app', item.app).promise();
					} else {
						item.id = UID();
						item.en = item.text;
						await DB().insert('tbl_translation', item).promise();
					}

					next();
				}, () => FUNC.cleantranslations(output, opt, $.callback));

			}, (path, dir) => dir ? (path.endsWith('/node_modules') && path.endsWith('/tmp') && path.endsWith('/resources') && path.endsWith('/databases') && path.endsWith('/.git')) ? false : true : true);
		}
	});

	FUNC.cleantranslations = async function(data, opt, callback) {
		// Clean
		var actual = await DB().find('tbl_translation').where('app', opt.app).promise();
		actual.wait(async function(item, next) {
			var exist = data.findItem('hash', item.hash);
			if(!exist && !item.deferr) {
				await DB().remove('tbl_translation').where('hash', item.hash).where('app', opt.app).promise();
			}
			next();
		}, () => callback(data.length));
	};

});