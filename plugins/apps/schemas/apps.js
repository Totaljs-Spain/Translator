NEWSCHEMA('Apps', function(schema) {

	schema.action('permissions', {
		name: 'Check permissions',
		action: function($) {

			if (!UNAUTHORIZED($, 'apps'))
				$.success();
		}
	});

    schema.action('list', {
        name: 'List of Apps',
        permissions: 'apps',
        action: function($) {
			DB().list('tbl_app').autoquery($.query, 'id:UID,name:string,icon:string,url:string', 'name_asc', 200).callback($.callback);
        }
    });

	schema.action('update', {
        name: 'Update App',
        permissions: 'apps',
        action: function($, model) {
			if (model.id) {
				DB().modify('tbl_app', { name: model.name, icon: model.icon }).id(model.id).callback($.callback);
			} else {
				model.id = UID();
				DB().insert('tbl_app', model).id(model.id).callback($.callback);
			}
        }
    });

});