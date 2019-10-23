$(document).ready(() => {
	loadStateList();
});

$("#save-tab").click(() => {
	const stateName = prompt("Save as?");
	saveTabs(stateName);
});

$("#reset").click(() => {
	tabDB.reset();
});

chrome.storage.onChanged.addListener(() => {
	loadStateList();
});

const loadStateList = () => {
	tabDB.retrieveAll((states) => {
		if (states === undefined || states.length > 0) {
			$('.empty-list').hide();
			$('#state-list').show();
			states.forEach((state) => {
				const apn = `<a class="collection-item" id="${state.stateID}">${state.stateName}</a>`;
				const selector = $(`#${state.stateID}`);
				if (!(selector.length)) {
					$('#state-list').append(apn);
				}
				selector.click(() => {
					loadState(state.stateID);
				});
			});
		} else {
			$('.empty-list').show();
			$('#state-list').hide();
		}
	});
};

const saveTabs = (stateName) => {
	const tabQuery = {
		currentWindow: true
	};
	chrome.tabs.query(tabQuery, (tabs) => {
		const tabsData = [];
		tabs.forEach((tab) => {
			const tabData = {
				title: tab.title,
				url: tab.url
			};
			tabsData.push(tabData);
		});
		const stateData = {
			stateID: generateID(),
			stateName: stateName,
			tabs: tabsData
		};
		console.log(stateData);
		tabDB.save(stateData);
	});
};

const loadState = (stateID) => {
	tabDB.retrieve(stateID, (state) => {
		const createData = {
			url: [],
			focused: true,
			type: "normal"
		};
		const tabs = state.tabs;
		tabs.forEach((tab) => {
			createData.url.push(tab.url);
		});
		chrome.windows.create(createData);
	});
};
