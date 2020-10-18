const OPTION_SAVE_KEY = 'options';
const EXIT_ON_SAVE_KEY = 'exit_on_save';

$(document).ready(() => {
	getSavedOptions( (options) => {
		if(options !== undefined) {
			console.log('Saved options', options);
			$('input[name=close-current-save]').prop('checked', options[EXIT_ON_SAVE_KEY]);
		}
	})
});

$('#options-form').submit((e) => {
	e.preventDefault();
	const exitOnSaveSwitchValue = $('input[name=close-current-save]').is(':checked');
	const options = {};
	options[EXIT_ON_SAVE_KEY] = exitOnSaveSwitchValue;

	saveOptions(options);
});

const saveOptions = (options) => {
	const obj = {};
	obj[OPTION_SAVE_KEY] = options;
	console.log('Saving: ', obj);
	chrome.storage.sync.set(obj, () => {
		if (!chrome.runtime.lastError) {
			alert('Options saved..');
			chrome.storage.sync.get(null, (result) => {
				console.log('Saved: ', result);
			});
		} else {
			console.log(chrome.runtime.lastError);
		}
	})
};

const getSavedOptions = (callback) => {
	chrome.storage.sync.get(null, (result) => {
		callback(result[OPTION_SAVE_KEY]);
	})
};
