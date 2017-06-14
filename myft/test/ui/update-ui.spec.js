/* global expect sinon */

describe('Update UI', () => {

	let updateUi;
	let stubs;
	let mockRelationships;

	const mockRelationshipConfig = {
		saved: {},
		followed: {},
		danced: {}
	};

	beforeEach(() => {

		mockRelationships = {
			saved: [],
			followed: [],
			danced: []
		};

		stubs = {
			getRelationshipsStub: relationshipName => mockRelationships[relationshipName],
			personaliseLinksStub: sinon.stub(),
			setStateOfManyButtonsStub: sinon.stub()
		};

		const updateUiInjector = require('inject-loader!../../ui/update-ui');
		updateUi = updateUiInjector({
			'./lib/loaded-relationships': { getRelationships: stubs.getRelationshipsStub },
			'./lib/button-states': { setStateOfManyButtons: stubs.setStateOfManyButtonsStub },
			'./personalise-links': stubs.personaliseLinksStub,
			'./lib/relationship-config': mockRelationshipConfig
		});
	});

	it('should call `setStateOfManyButtons` with an array of subjectIds for each relationship', () => {

		mockRelationships.saved = [
			{ uuid: 'some-content-id', uuidV2: 'v2ID' }, //CAPI2_CLEANUP
			{ uuid: 'some-other-content-id', uuidV2: 'other-v2ID' }
		];

		mockRelationships.danced = [
			{ uuid: 'some-dance-id', uuidV2: 'dance-v2' }
		];

		updateUi(document.body);
		expect(stubs.setStateOfManyButtonsStub).to.have.been.calledTwice;

		expect(stubs.setStateOfManyButtonsStub).to.have.been.calledWithMatch(
			'saved',
			sinon.match.array.deepEquals(['some-content-id', 'some-other-content-id', 'v2ID', 'other-v2ID']),
			true,
			document.body
		);

		expect(stubs.setStateOfManyButtonsStub).to.have.been.calledWithMatch(
			'danced',
			sinon.match.array.deepEquals(['some-dance-id', 'dance-v2']),
			true,
			document.body
		);
	});
});
