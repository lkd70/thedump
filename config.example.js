'use strict';

const debug = false;

const boards_config = {
	b: { name: 'Random', code: 'b', path: 'com' },
	gif: { name: 'Adult Gif', code: 'gif', path: 'sub' },
	wsg: { name: 'Worksafe Gif', code: 'wsg', path: 'sub' },
};

const search = [
	{
		terms: [ 'ylyl' ],
		boards: [ boards_config.b, boards_config.gif, boards_config.wsg ],
		types: [ '.gif', '.png', '.jpg', '.webm' ],
		chat_id: '-222222222222',
	},
	{
		terms: [ 'rekt', 'gore' ],
		boards: [ boards_config.b, boards_config.gif ],
		types: [ '.gif', '.png', '.jpg', '.webm' ],
		chat_id: '-333333333333',
	},
];

const telegram = {
	token: '1234567890:h9rdd4d4idn39dged8b3f04crc9u4fby3d',
	log_chat: null,
};

module.exports = {
	search,
	telegram,
	debug,
};
