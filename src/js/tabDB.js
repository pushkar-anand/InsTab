const storage = chrome.storage.local;
const tabStorageKey = "saved_tab_state";

const checkErr = () => {
	if (chrome.runtime.lastError) {
		console.log(chrome.runtime.lastError);
	}
};

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
				checkErr()
			});
		});
	},
	retrieveAll: (callback) => {
		storage.get(null, (result) => {
			const states = result[tabStorageKey];
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
	},
	remove: (stateID) => {
		console.log("Remove called", stateID);
		storage.get(null, (result) => {
			const newStates = [];
			const states = result[tabStorageKey];
			states.forEach((state) => {
				console.log(`Checking ${state.stateID} == ${stateID}`);
				if (state.stateID !== stateID) {
					newStates.push(state);
					console.log("Equality check failed. Pushing: ", state);
				} else {
					console.log("Equality check passes. Deleting: ", state);
				}
			});
			const obj = {};
			obj[tabStorageKey] = newStates;

			console.log('New States: ', obj);
			storage.set(obj, () => {
				checkErr();
				debug();
			})
			/*
			storage.clear(() => {
							console.log('Cleared states..');
							storage.set(obj, () => {
								checkErr();
								debug();
							});
						});*/
		});
	},

	reset: () => {
		storage.clear(() => {
			checkErr();
		});
	},

};
const debug = () => {
	storage.get(null, (result) => {
		console.log('Debug output: ', result);
	})
};
