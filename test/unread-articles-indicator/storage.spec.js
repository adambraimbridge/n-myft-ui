/* global expect */

import sinon from 'sinon';
import * as storage from '../../components/unread-articles-indicator/storage';

describe('storage', () => {
	let clock;
	let mockStorage;
	let now;

	beforeEach(() => {
		mockStorage = {};
		now = new Date();
		sinon.stub(window.Storage.prototype, 'getItem').callsFake(key => mockStorage[key]);
		sinon.stub(window.Storage.prototype, 'setItem').callsFake((key, value) => mockStorage[key] = value);
		clock = sinon.useFakeTimers(now);
	});

	afterEach(() => {
		window.Storage.prototype.getItem.restore();
		window.Storage.prototype.setItem.restore();
		clock.restore();
	});

	describe('getDeviceSessionExpiry', () => {
		describe('given a valid timestamp is stored', () => {
			beforeEach(() => {
				mockStorage.deviceSessionExpiry = String(now.getTime());
			});

			it('should return the correct iso date', () => {
				expect(storage.getDeviceSessionExpiry()).to.equal(now.toISOString());
			});
		});

		describe('given no value is stored', () => {
			beforeEach(() => {
				mockStorage.deviceSessionExpiry = null;
			});

			it('should return null', () => {
				expect(storage.getDeviceSessionExpiry()).to.equal(null);
			});
		});

		describe('given an invalid value is stored', () => {
			beforeEach(() => {
				mockStorage.deviceSessionExpiry = 'abc';
			});

			it('should return null', () => {
				expect(storage.getDeviceSessionExpiry()).to.equal(null);
			});
		});
	});

	describe('setDeviceSessionExpiry', () => {
		it('should store the date as a timestamp', () => {
			const date = new Date(2018, 6, 14, 11, 0, 0);

			storage.setDeviceSessionExpiry(date.toISOString());

			expect(mockStorage.deviceSessionExpiry).to.equal(String(date.getTime()));
		});
	});

	describe('getNewArticlesSinceTime', () => {
		describe('given a valid timestamp is stored', () => {
			beforeEach(() => {
				mockStorage.newArticlesSinceTime = String(now.getTime());
			});

			it('should return the correct iso date', () => {
				expect(storage.getNewArticlesSinceTime()).to.equal(now.toISOString());
			});
		});

		describe('given no value is stored', () => {
			beforeEach(() => {
				mockStorage.newArticlesSinceTime = null;
			});

			it('should return null', () => {
				expect(storage.getNewArticlesSinceTime()).to.equal(null);
			});
		});

		describe('given an invalid value is stored', () => {
			beforeEach(() => {
				mockStorage.newArticlesSinceTime = 'abc';
			});

			it('should return null', () => {
				expect(storage.getNewArticlesSinceTime()).to.equal(null);
			});
		});
	});

	describe('setNewArticlesSinceTime', () => {
		it('should store the date as a timestamp', () => {
			const date = new Date(2018, 5, 1, 11, 30, 0);

			storage.setNewArticlesSinceTime(date.toISOString());

			expect(mockStorage.newArticlesSinceTime).to.equal(String(date.getTime()));
		});
	});

	describe('isAvailable', () => {
		it('should return true if it is available', () => {
			sinon.stub(window.Storage.prototype, 'removeItem').callsFake((key) => delete mockStorage[key]);

			expect(storage.isAvailable()).to.be.true;
		});

		it('should return false if it is not available', () => {
			mockStorage = null;

			expect(storage.isAvailable()).to.be.false;
		});
	});
});
