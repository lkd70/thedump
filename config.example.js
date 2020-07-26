'use strict';

const debug = true;

const boards_config = {
	b: {
		name: 'Random',
		code: 'b',
		path: 'com'
	},
	gif: {
		name: 'Adult Gif',
		code: 'gif',
		path: 'sub'
	},
	wsg: {
		name: 'Worksafe Gif',
		code: 'wsg',
		path: 'sub'
	},
};

const reddit_boards = {
	gonewild: {
		name: 'Reddit Gone Wild',
		code: 'gonewild',
	}
}

const reddit_search = [{
	terms: ['[f]', '(f)'],
	boards: [reddit_boards.gonewild],
	types: ['.png', '.jpg'],
	chat_id: [''],
}];

const search = [{
		terms: ['ylyl'],
		boards: [boards_config.b, boards_config.gif, boards_config.wsg],
		types: ['.gif', '.png', '.jpg', '.webm'],
		chat_id: '',
	},
	{
		terms: ['rekt', 'gore'],
		boards: [boards_config.b, boards_config.gif],
		types: ['.gif', '.png', '.jpg', '.webm'],
		chat_id: '',
	},
];

const telegram = {
	token: '',
	log_chat: null,
};

module.exports = {
	search,
	telegram,
	debug,
	reddit_search,
};
