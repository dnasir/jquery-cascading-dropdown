// Some mockjax code to simulate Ajax calls
var phoneList = [
{
	maker: 'HTC',
	model: 'One S',
	screen: 4.3,
	resolution: 540,
	storage: [8, 16]
},
{
	maker: 'Samsung',
	model: 'Galaxy S4',
	screen: 5,
	resolution: 1080,
	storage: [16, 32, 64]
},
{
	maker: 'HTC',
	model: 'One',
	screen: 4.7,
	resolution: 1080,
	storage: [32, 64]
},
{
	maker: 'Motorola',
	model: 'Droid 4',
	screen: 4,
	resolution: 540,
	storage: [8]
},
{
	maker: 'Motorola',
	model: 'Droid RAZR HD',
	screen: 4.7,
	resolution: 720,
	storage: [16]
},
{
	maker: 'LG',
	model: 'Optimus 4X HD',
	screen: 4.7,
	resolution: 720,
	storage: [16]
},
{
	maker: 'HTC',
	model: 'Butterfly',
	screen: 5,
	resolution: 1080,
	storage: [16]
},
{
	maker: 'Motorola',
	model: 'Moto X',
	screen: 4.7,
	resolution: 720,
	storage: [16, 32]
},
];

function getPhones(screen, resolution, storage) {
	return $.grep(phoneList, function(item, index) {
		var s = true, r = true, st = true;

		if(screen) {
			s = item.screen == screen;
		}

		if(resolution) {
			r = item.resolution == resolution;
		}

		if(storage) {
			st = item.storage.indexOf(storage) > -1;
		}

		return !!(s && r && st);
	});
}

function getScreens(resolution, storage) {
	var phones = getPhones(null, resolution, storage);

	var screens = $.map(phones, function(phone) { return phone.screen; });
	screens.sort(asc);
	return arrayUnique(screens);
}

function getResolutions(screen, storage) {
	var phones = getPhones(screen, null, storage);

	var resolutions = $.map(phones, function(phone) { return phone.resolution; });
	resolutions.sort(asc);
	return arrayUnique(resolutions);
}

function getStorages(screen, resolution) {
	var phones = getPhones(screen, resolution, null);

	var storages = [];
	$.each(phones, function(index, item) {
		storages = arrayUnique(storages.concat(item.storage));
	});
	storages.sort(asc);
	return storages;
}

function arrayUnique(array) {
	var a = array.concat();
	for(var i=0; i<a.length; ++i) {
		for(var j=i+1; j<a.length; ++j) {
			if(a[i] === a[j])
				a.splice(j--, 1);
		}
	}

	return a;
}

function asc(a, b) {
	return a - b;
}

$.mockjax({
	url: '/api/screens',
	contentType: 'application/json; charset=utf-8',
	responseTime: 1000,
	response: function(settings){
		this.responseText = JSON.stringify(getScreens(parseFloat(settings.data.resolution), parseFloat(settings.data.storage)));
	}
});

$.mockjax({
	url: '/api/resolutions',
	contentType: 'application/json; charset=utf-8',
	responseTime: 1000,
	response: function(settings){
		this.responseText = JSON.stringify(getResolutions(parseFloat(settings.data.screen), parseFloat(settings.data.storage)));
	}
});

$.mockjax({
	url: '/api/storages',
	contentType: 'application/json; charset=utf-8',
	responseTime: 1000,
	response: function(settings){
		this.responseText = JSON.stringify(getStorages(parseFloat(settings.data.screen), parseFloat(settings.data.resolution)));
	}
});

$.mockjax({
	url: '/api/phones',
	contentType: 'application/json; charset=utf-8',
	responseTime: 1000,
	response: function(settings){
		this.responseText = JSON.stringify(getPhones(parseFloat(settings.data.screen), parseFloat(settings.data.resolution), parseFloat(settings.data.storage)));
	}
});