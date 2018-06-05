/* global expect */

import fetchMock from 'fetch-mock';
import fetchNewContent from '../fetch-new-content';

const USER_UUID = '0-0-0-0';
const SINCE = '2018-06-05T06:48:26.635Z';
const FOLLOWED_CONCEPT = 'followed-concept';
const UNFOLLOWED_CONCEPT = 'unfollowed-concept';
const READ_AND_FOLLOWED_ARTICLE = 'read-followed-article';
const UNREAD_AND_FOLLOWED_ARTICLE = 'unread-followed-article';
const READ_AND_UNFOLLOWED_ARTICLE = 'read-unfollowed-article';
const UNREAD_AND_UNFOLLOWED_ARTICLE = 'unread-unfollowed-article';
const mockData = {
	data: {
		user: {
			followed: [
				{ id: FOLLOWED_CONCEPT }
			],
			articlesFromReadingHistory: {
				articles: [
					{ id: READ_AND_FOLLOWED_ARTICLE },
					{ id: READ_AND_UNFOLLOWED_ARTICLE }
				]
			}
		},
		latestContent: [
			{
				id: READ_AND_FOLLOWED_ARTICLE,
				annotations: [
					{ id: FOLLOWED_CONCEPT },
					{ id: UNFOLLOWED_CONCEPT }
				]
			},
			{
				id: UNREAD_AND_FOLLOWED_ARTICLE,
				annotations: [
					{ id: FOLLOWED_CONCEPT },
					{ id: UNFOLLOWED_CONCEPT }
				]
			},
			{
				id: READ_AND_UNFOLLOWED_ARTICLE,
				annotations: [
					{ id: UNFOLLOWED_CONCEPT }
				]
			},
			{
				id: UNREAD_AND_UNFOLLOWED_ARTICLE,
				annotations: [
					{ id: UNFOLLOWED_CONCEPT }
				]
			}
		]
	}
};

describe('fetch-new-content', () => {
	let data;

	beforeEach(() => {
		data = null;
		fetchMock.get('*', mockData);

		return fetchNewContent(USER_UUID, SINCE)
			.then(resolvedValue => {
				data = resolvedValue;
			});
	});

	afterEach(fetchMock.reset);

	it('should fetch', () => {
		expect(fetchMock.calls().matched.length).to.equal(1);
	});

	it('should return an array of articles', () => {
		expect(Array.isArray(data)).to.equal(true);
	});

	it('should return only the followed articles', () => {
		expect(data.length).to.equal(2);
		expect(data.some(article => article.id === READ_AND_FOLLOWED_ARTICLE)).to.equal(true);
		expect(data.some(article => article.id === UNREAD_AND_FOLLOWED_ARTICLE)).to.equal(true);
	});

	it('should decorate read articles with hasBeenRead = true', () => {
		expect(data.find(article => article.id === READ_AND_FOLLOWED_ARTICLE).hasBeenRead).to.equal(true);
		expect(data.find(article => article.id === UNREAD_AND_FOLLOWED_ARTICLE).hasBeenRead).not.to.equal(true);
	});
});