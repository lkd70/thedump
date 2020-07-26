'use strict';

const searches = require('./config').search;
const debug = require('./config').debug;
const {	getCatalog, getThread } = require('./components/chan');
const { postExists, addPost } = require('./components/db');
const { sendMedia } = require('./components/telegram');

// eslint-disable-next-line no-async-promise-executor
const processPosts = () => new Promise(async resolve => {
	const post_queue = [];

	for (let b = 0; b < searches.length; b++) {
		const search = searches[b];

		for (let o = 0; o < search.boards.length; o++) {
			const board = search.boards[o];
			// eslint-disable-next-line no-await-in-loop
			const threads = await getCatalog(board.code);
			for (let t = 0; t < search.terms.length; t++) {
				const term = search.terms[t].toLowerCase();
				const f_t = threads.filter(thread =>
					thread[board.path] && thread[board.path].toLowerCase().includes(term));
				for (let th = 0; th < f_t.length; th++) {
					const thread = f_t[th];
					// eslint-disable-next-line no-await-in-loop
					const posts = await getThread(board.code, thread.no);
					const media_posts = posts.data.posts.filter(post =>
						search.types.includes(post.ext));
					// eslint-disable-next-line no-return-await
					for (let p = 0; p < media_posts.length; p++) {
						const pst = media_posts[p];
						pst.board = board;
						const post_data = {
							board: board.code,
							chat: search.chat_id,
							md5: pst.md5,
							name: pst.filename,
							number: pst.no,
							term,
							time: pst.tim,
							type: pst.ext,
							poster: pst.name,
						};
						const exists = await postExists(post_data);
						if (!exists) post_queue.push(post_data);
					}
				}
			}
		}
	}

	if (debug) console.log('processing queue');

	for (let p = 0; p < post_queue.length; p++) {
		const post = post_queue[p];

		addPost(post).then(() => {
			sendMedia(post).then(() => debug && console.log('posted')).catch('errored');
		}).catch(console.error);

		// eslint-disable-next-line no-await-in-loop
		await new Promise(r => setTimeout(r, 2000));
	}
	resolve(true);
});

const main = async () => {
	await processPosts();
	await new Promise(r => setTimeout(r, 20000));
};

main();
