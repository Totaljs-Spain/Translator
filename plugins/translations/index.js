exports.icon = 'ti ti-language-alt';
exports.name = '@(Translations)';
exports.position = 1;
exports.permissions = [{ id: 'translator', name: 'Translations' }];
exports.visible = user => user.sa || user.permissions.includes('translator');
// exports.routes = [
	// { url: '/app/*', html: 'index' }
// ];

exports.install = function() {
	// Languages
	ROUTE('+API    /api/    -active_langs  	*Translations   --> permissions active (response)');

	// Apps
	ROUTE('+API    /api/    -app   			*Translations   --> app');
	ROUTE('+API    /api/    +app_insert		*Translations   --> app_insert');

	// Translations
	ROUTE('+API    /api/	-import					*Translations	--> import');
	ROUTE('+API    /api/	-translations			*Translations	--> translations');
	ROUTE('+API    /api/	-localize				*Translations	--> localize');
	ROUTE('+API    /api/	+translation_update		*Translations	--> update');
	ROUTE('+API    /api/	+merge					*Translations	--> merge');
};
