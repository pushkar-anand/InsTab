const storage = chrome.storage.local;
const tabStorageKey = "saved_tab_state";

const tabDB = {
	save: (state) => {
		const obj = {};
		storage.get(null, (result) => {
			// console.log("Results ========", result)
			if (tabStorageKey in result) {
				let currentState = result[tabStorageKey];
				// console.log("states ========", currentState)
				currentState.push(state);
				obj[tabStorageKey] = currentState;
			} else {
				obj[tabStorageKey] = [state];
			}
			storage.set(obj);
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
	},
	remove: (stateID, callback) => {
		const obj={};
		storage.get(null, (results) => {
			let states = results[tabStorageKey];
			states.forEach((state, i)=>{
				if(state.stateID === stateID){
					states.splice(i, 1);
					console.log(states)
					obj[tabStorageKey] = states
					storage.set(obj);
				}
			})
			
		});
	},
};
