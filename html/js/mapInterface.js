// Namespace
var NS = {
    OM_TABULAR_OPTIONS: {
		layout:"fitColumns",
		columns:[
			{title:"Id", field:"id"},
			{title:"Name", field:"name"},
		 	{title:"Class", field:"class"},
		 	{title:"Recieved", field:"recieved"}
		],
		rowClick:function(e, row){ //trigger an alert message when the row is clicked
	 		OM_TABLE_MAP_SYNCHRONIZER.migrate(row);
	 	},
	},
	OC_TABULAR_OPTIONS: {

	}
};


// LEAFLET MAP OBJECT
var LF_MAP = rrLeafletMap("leaflet_map");

// OM table objects
var EVENT_FEED = new Tabulator("#filtered_event_feed", NS.OM_TABULAR_OPTIONS);
var GROUPED_EVENTS = new Tabulator("#grouped_events_table", NS.OM_TABULAR_OPTIONS);

/**
 * Since the map and table both hold events, but each cares only about certain
 * kinds of event information, the OM_TABLE_MAP_SYNCHRONIZER is responsible for keeping them 
 * synchronized. Each handler on the page which affets events should invoke a
 * method of EVENT_HANDLER. The event handler will deal with the map and tables.
 * The OM_TABLE_MAP_SYNCHRONIZER is the middleman between the user and the map/table.
 */
var OM_TABLE_MAP_SYNCHRONIZER = {
    selected: null,

    // Queries data from the DB and then displays them on the page. 
    query: function(parameters) {
        // Query json object from DB
        LF_MAP.addAllEvents(parameters);
        EVENT_FEED.setData(parameters);
    },

    // Marks event as selected, opens tooltip.
    select: function(row) {
        LF_MAP.describeMarker(row.firstChild.textContent);
    },

    // Moves the event from its event table to the other 
    migrate: function(row) {
        if (EVENT_FEED.getRowPosition(row) > -1) {
        	row.delete();
            GROUPED_EVENTS.addRow(row.getData());
            LF_MAP.markSelected(row._row.data.id, true); // Shouldnt be accessing this??
        }
        else if (GROUPED_EVENTS.getRowPosition(row) > -1) {
        	row.delete();
        	EVENT_FEED.addRow(row.getData());
            LF_MAP.markSelected(row._row.data.id, false);
        }
    }
};

for (var table of document.getElementsByClassName("tabulator-table")) {
	table.addEventListener('mouseover', function(e) {
		OM_TABLE_MAP_SYNCHRONIZER.select(e.target.parentNode);
	})
}

//// TESTING ///////////////////////
OM_TABLE_MAP_SYNCHRONIZER.query([
{
    "id":123, 
    "name":123, 
    "class":"fire",
    "recieved": "date",
    "rad": 0.2, 
    "lat": 39.123, 
    "long": -76.824, 
    "desc": "description of event."
},
{
    "id":124, 
    "name":124, 
    "class":"cat",
    "recieved": "recently", 
    "rad": 0.3,
    "lat": 39.131, 
    "long": -76.842, 
    "desc": "cat on fire."
},
{
    "id":125, 
    "name":125, 
    "class":"superman",
    "recieved": "date", 
    "rad": 0.4,
    "lat": 39.111, 
    "long": -76.828, 
    "desc": "Lois Lane captured by Lex Luther."
}]);
////////////////////////////////////