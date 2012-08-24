/*
 * Copyright © 2012 Patrick McCann
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */
 
//What are we looking at?
FB.init({
	appId  : fbAppId,
	status : true, // check login status
	cookie : true, // enable cookies to allow the server to access the session
	xfbml  : true  // parse XFBML
});

FB.getLoginStatus(function(response) {
	if (response.status === 'connected') { //this is the only status we're interested in
		// the user is logged in and has authenticated your
		// app, and response.authResponse supplies
		// the user's ID, a valid access token, a signed
		// request, and the time the access token
		// and signed request each expire
		var uid = response.authResponse.userID;
		var accessToken = response.authResponse.accessToken;
		//make request for resource
		makeFacebookRequest(getURLParameter("fbid"), accessToken);
	}
});

function getURLParameter(name){return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g,'%20'))||null;}

//Struggling to get Facebook permissions to propagate - this needs further work
function makeFacebookRequest(id, accessToken) {
	FB.api(id+'?access_token='+accessToken, function(response) {
		alert(response);
		if (response) {
			uploadFileFromURL(response.source, "FB_photo");
		}
	});
}

function uploadFileFromURL(url,filename) {
 	$.ajax({
 		type: "GET",
 		url: wgServer + wgScriptPath + "/api.php",
 		data: "format=json&action=query&prop=info&intoken=edit&titles="+filename,
 		dataType: 'json',
 		success: function(data) {
 			var obj = data.query.pages;
 			for (var prop in obj) {
 				if (obj.hasOwnProperty(prop)) {
 					var wtoken = encodeURIComponent(obj[prop].edittoken);
 					//if (obj[prop].missing != undefined && obj[prop].touched == undefined) {
 						$.ajax({
 							type: "POST",
 							url: wgServer + wgScriptPath + "/api.php",
 							data: "action=upload&filename="+encodeURIComponent(filename)+"&url="+encodeURIComponent(url)+"&token="+wtoken,
 							success: function(data){
 								alert(data);
 							}
 						});
 					//}
 				}
 			}
 		}
 	});
}