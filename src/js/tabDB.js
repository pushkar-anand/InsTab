const storage = chrome.storage.local;
const tabStorageKey = "saved_tab_state";

const tabDB = {
	save: (state) => {
		const obj = {};
		storage.get(null, (result) => {
			if (tabStorageKey in result) {
				let currentState = result[tabStorageKey];
				currentState.push(state);
				obj[tabStorageKey] = currentState;
			} else {
				obj[tabStorageKey] = [state];
			}
			storage.set(obj, () => {

			});
		});
	},
	retrieveAll: (callback) => {
		storage.get(null, (result) => {
			const states = result[tabStorageKey];
			console.log(states);
			callback(states);
		});
	},
	retrieve: (stateID, callback) => {
		storage.get(null, (result) => {
			const states = result[tabStorageKey];
			states.forEach((state) => {
				if (state.stateID === stateID) {
					callback(state);
				}
			});
		});
	}
};
