exports.icon = 'ti ti-language';
exports.name = '@(Languages)';
exports.position = 2;
exports.permissions = [{ id: 'languages', name: 'Languages' }];
exports.visible = user => user.sa || user.permissions.includes('languages');

exports.install = function() {
	CORS();
	// Languages
	ROUTE('+API    /api/    -languages    		*Languages   --> permissions list (response)');
	ROUTE('+API    /api/    -lang_activate    	*Languages   --> permissions activate (response)');
	ROUTE('+API    /api/    -lang_ready 		*Languages   --> permissions ready (response)');
	ROUTE('+API    /api/    +lang_update 		*Languages   --> permissions update (response)');

};
