'use strict';

const express = require('express');
const service = express();
const request = require('superagent');

const locationKey = ENV_VARS_LOCATION_KEY;
const weatherKey = ENV_VARS_WEATHER_KEY;

service.get('/service/:location', (req, res, next) => {
    

	request.get('https://maps.googleapis.com/maps/api/geocode/json?address='+ req.params.location +'&key='+locationKey, (err, response)=> {

		if(err){
			console.log(err);
			return res.sendStatus(500);
		}

		if(!response.body.results[0]){
			console.log(`Could not get a location for that request`);
			return res.sendStatus(500);
		}

		const location = response.body.results[0].geometry.location;

		request.get('https://api.darksky.net/forecast/'+weatherKey+'/'+ location.lat + ',' + location.lng + '/?units=auto', (err, response)=> {

	        if (err) {
	            console.log(err);
	            return res.sendStatus(404);
	        }

	    	res.json({result: `${response.body.currently.summary} at ${response.body.currently.temperature}˚C, weather info kindly provided by https://darksky.net/poweredby/`});

    	});

    });
});

module.exports = service;