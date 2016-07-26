'use strict';
  
angular.module('devfestApp')
  .factory('Config', function() {
    return {
      /* modify these */
      
      // group/site config
      'name'          : 'GDG Chicago and GDG Chicago West', // the name of your GDG
      'location'      : 'Chicagoland', // city location of GDG
      'email'         : 'info@windycity.io', // the email where you receive GDG emails
      'id'            : '116342852249328662050', // Google+ profile id for the GDG
      'googleAPI'     : 'AIzaSyBN1WhjvUYXb5pBKNivEDdASxlZYpXod5w', // Google API Key
      'website'       : 'http://windycity.io', // GDG website, custom domain or [your-app].appspot.com
      'allowRegister' : true, // set to false once your "admin" login has been setup to prevent unauthorized account creations
       
      // event details
      'eventName'     : 'WindyCity DevCon', // typically 'DevFest [place]'
      'eventLocation' : 'Google Chicago', // location of event
      'eventAddress'  : '320 N Morgan, Chicago, IL 60607', // address of event
      'eventURL'      : 'http://www.windycity.io', // link to event website (ex. G+, Meetup, Eventbrite, etc)
      'eventEmail'    : 'info@windycity.io', // Email where event inquries should go
      'speakerURL'    : 'http://goo.gl/forms/s2JqdQTqSxK1y7ks1', // link to the 'Call for Papers' form
      'sponsorURL'    : 'https://goo.gl/forms/rqHtKOzNJAcJoXdw1', // link to the sponsorship form
      'ticketURL'     : 'https://www.eventbrite.com/e/windycity-devcon-tickets-26714742514', // link to buy tickets
      'eventDate'     : '2016-09-16', // ISO formatted YYYY-MM-DD (currently only supports a single day DevFest)
      'eventStart'    : '09:00:00', // start time
      'eventEnd'      : '17:30:00', // end time
      'sessionLength' : '2700000', // use minutes in milliseconds
      'sessionTracks' : '3', // number of tracks sessions are split into (ie. Mobile, Web, Cloud, etc.)
      
      // social details
      // Google+ social details are derived from the keys above
      'twitter'       : 'gdgchicagowest', // Twitter handle
      'meetup'        : 'Google-Developers-Group-GDG-Chicago', // Meetup handle

   };
  });