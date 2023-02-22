exports.icon = 'ti ti-rocket';
exports.name = '@(Apps)';
exports.position = 3;
exports.permissions = [{ id: 'otapps', name: 'Apps' }];
exports.visible = user => user.sa || user.permissions.includes('otapps');
// exports.routes = [
	// { url: '/app/*', html: 'index' }
// ];

exports.install = function() {
	// Apps
	ROUTE('+API    /api/    -app_list		*Apps   --> list');
	ROUTE('+API    /api/    +app_update		*Apps   --> update');
};
