FUNC.loadresources = async function() {
	// Translations
	await DB().query('SELECT hash as id, {0} as value FROM {3}tbl_translation WHERE {0} IS NOT NULL AND app = {2}'.format(CONF.language, 'app', PG_ESCAPE('1'), MAIN.schema)).callback(function(err, translations) {
		LOADRESOURCE(CONF.language, translations);
	});
};

FUNC.view_find_localization = function(content, index) {

	index = content.indexOf('@(', index);
	if (index === -1)
		return null;

	var length = content.length;
	var count = 0;
	var beg = content[index - 1];
	var esc = '';

	for (var i = index + 2; i < length; i++) {
		var c = content[i];

		if (c === '(') {
			count++;
			continue;
		}

		if (c !== ')')
			continue;
		else if (count) {
			count--;
			continue;
		}

		var end = content.substring(i + 1, i + 2);
		if (beg === end && beg === '"' || beg === '\'' || beg === '`')
			esc = beg;
		return { beg: index, end: i, command: content.substring(index + 2, i).trim(), escape: esc };
	}

	return null;
};