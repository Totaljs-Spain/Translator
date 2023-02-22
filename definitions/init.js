var db = MAIN.db = MEMORIZE('data');

if (!db.config)
	db.config = {};

var config = db.config;

if (!config.name)
	config.name = 'Total.js Translator';

if (!config.cdn)
	config.cdn = '//cdn.componentator.com';

if(!config.language)
	config.language = 'en';

if(!config.badhashes)
	config.badhashes = 'T0,T13,T1va4ive,T1g7kdl5,Tqqpj6,T1cfqx3j,Tay69xz,T1yi6,Tu27,Tjso48d,T1vltmuu,T1wpy2k6,T10qvu3a,T1f2g7o0,T1p779b,T6wp898,Tqyc10e,Ty8z7f3,T1y139im,T1z3k,T29j,T1n8q1rc,T1f7fd8f';

if(!config.translator)
	config.translator = 'google';

// Fixed settings
CONF.allow_custom_titles = true;
CONF.version = '1.0.0';
CONF.op_icon = 'ti ti-language-alt';

// Loads configuration
LOADCONFIG(db.config);

// UI components
COMPONENTATOR('ui', 'exec,locale,aselected,page,viewbox,input,importer,box,validate,loading,selected,intranetcss,notify,message,errorhandler,empty,menu,ready,datagrid,directory,navlayout,filereader,approve,miniform,icons,clipboard', true);

async function init() {
	var index = CONF.database.indexOf('?');
	var schema = 'public';
	var pooling = 0;

	if (index !== -1) {
		var tmp = CONF.database.substring(index + 1).parseEncoded();
		if (tmp.schema)
			schema = tmp.schema;

		if (tmp.pools || tmp.pooling)
			pooling = tmp.pools || tmp.pooling;
	}

	MAIN.schema = schema === 'public' ? '' : (schema + '.');
	require('querybuilderpg').init('default', CONF.database, pooling || CONF.pooling || 0);

	// check DB
	var is = await DB().query('SELECT schema_name FROM information_schema.schemata WHERE "schema_name"=\'{0}\''.format(schema)).first().promise();

	if (is) {
		PAUSESERVER('Database');
		return;
	}

	// DB is empty
	F.Fs.readFile(PATH.public('init.sql'), async function(err, buffer) {
		var sql = buffer.toString('utf8').format(schema);

		// Run SQL
		await DB().query(sql).promise();

		PAUSESERVER('Database');

	});
}

PAUSESERVER('Database');

// Docker
if (process.env.DATABASE)
	setTimeout(init, 3000);
else
	init();

// Permissions
ON('ready', function() {
	for (var key in F.plugins) {
		var item = F.plugins[key];
		if (item.permissions)
			OpenPlatform.permissions.push.apply(OpenPlatform.permissions, item.permissions);
	}
});