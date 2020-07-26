'use strict';

const searches = require('./config').search;
const reddit_search = require('./config').reddit_search;
const reddit = require('./components/reddit');
const debug = require('./config').debug;
const {	getCatalog, getThread } = require('./components/chan');
const {	chanPostExists,	redditPostExists, addPost } = require('./components/db');
const { sendMedia } = require('./components/telegram');


const processRedditPosts = () => new Promise(async resolve => {
	const post_queue = [];

	for (let b = 0; b < reddit_search.length; b++) {
		const search = reddit_search[b];

		for (let o = 0; o < search.boards.length; o++) {
			const board = search.boards[o];
			const posts = await reddit.getNew(board.code);
			for (let t = 0; t < search.terms.length; t++) {
				const term = search.terms[t].toLowerCase();
				const filtered_posts = posts.filter(p => p.data.title.toLowerCase().includes(term));
				console.log(filtered_posts[0]);

				for (let p = 0; p < filtered_posts.length; p++) {
					const pst = filtered_posts[p].data;
					const post = {
						subreddit: pst.subreddit,
						author_fullname: pst.author_fullname,
						title: pst.title,
						name: pst.name,
						hint: pst.post_hint,
						urldest: pst.url_overridden_by_dest,
						subreddit_id: pst.subreddit_id,
						id: pst.id,
						author: pst.author,
						perma: pst.permalink,
						url: pst.url,
						reddit: true,
						chat: search.chat_id,
					};
					const exists = await redditPostExists(post)
					if (!exists) post_queue.push(post);
				}
			}

		}
	}

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

// eslint-disable-next-line no-async-promise-executor
const process4chanPosts = () => new Promise(async resolve => {
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
						const exists = await chanPostExists(post_data);
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
	//await process4chanPosts();
	await new Promise(r => setTimeout(r, 500));
	await processRedditPosts();
	await new Promise(r => setTimeout(r, 20000));
};

main();
