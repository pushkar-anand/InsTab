$(document).ready(() => {
    loadStateList();
});

$("#save-btn").click(() => {
    const stateName = prompt("Save as?");
    if (stateName !== null && stateName !== "" && stateName.trim() !== "") {
        saveTabs(stateName);
    }
});

$("#reset-btn").click(() => {
    tabDB.reset();
});


chrome.storage.onChanged.addListener((changes, area) => {
    loadStateList();
});

const loadStateList = () => {
    tabDB.retrieveAll((states) => {
        if (states !== undefined && states.length > 0) {
            $('.empty-list').hide();
            $('#state-list').show();
            states.forEach((state) => {
                /*				const apn = `<li class="collection-item">
                                                <div class="state-item">
                                                        <span>${state.stateName}</span>
                                                        <a class="load-icon" id="${state.stateID}">
                                                            <i class="material-icons">send</i>
                                                        </a>
                                                        <a class="secondary-content delete-icon" id="del-${state.stateID}">
                                                            <i class="material-icons">delete</i>
                                                        </a>
                                                </div>
                                            </li>`;*/
                const apn = `<div class="item">
            <div class="content" id="${state.stateID}">
                ${state.stateName} <i class="material-icons" id="del-${state.stateID}">delete</i>
            </div>
        </div>`;
                // noinspection JSJQueryEfficiency
                let selector = $(`#${state.stateID}`);
                if (!(selector.length)) {
                    $('#state-list').append(apn);
                    selector = $(`#${state.stateID}`);
                }
                selector.click(() => {
                    loadState(state.stateID);
                });
                $(`#del-${state.stateID}`).click(() => {
                    $(`#${state.stateID}`).parent().remove();
                    tabDB.remove(state.stateID);
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
        saveState(stateData);
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

const saveState = (stateData) => {
    console.log(stateData);
    tabDB.save(stateData, () => {
        getSavedOptions((options) => {
            if (options[EXIT_ON_SAVE_KEY] === true) {
                chrome.tabs.query({}, function (tabs) {
                    chrome.tabs.create({});
                    for (let i = 0; i < tabs.length; i++) {
                        chrome.tabs.remove(tabs[i].id);
                    }
                });
            }
        });
    });
};
