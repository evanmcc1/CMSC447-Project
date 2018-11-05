/**
 * The DATA_HANDLER is responsible for keeping the map and tables 
 * synchronized. Each handler on the page which affets events should invoke a
 * method of EVENT_HANDLER. The event handler will deal with the map and tables.
 * The DATA_HANDLER is the middleman between the user and the map/table.
 */

var OM_DATA_HANDLER = (function() {

    var EVENT_TABLE_OPTIONS = new RR.rrEventTableOptions(
        onRowClick=function(e, row) {
            DATA_HANDLER.migrate(row);
        }
    );

    // Leaflet map, event feed, and grouped events feed.
    var LF_MAP = RR.rrLeafletMap("leaflet_map");
    var EVENT_FEED = new Tabulator("#filtered_event_feed", EVENT_TABLE_OPTIONS);
    var GROUPED_EVENTS = new Tabulator("#grouped_events_table", EVENT_TABLE_OPTIONS);

    var DATA_HANDLER = {
        // Queries data from the DB and then displays them on the page. 
        queryEvents: function(parameters) {
            LF_MAP.reset();
            LF_MAP.addAll(parameters);
            EVENT_FEED.setData(parameters);
        },

        // Marks event as selected, opens tooltip, highlights row.
        select: function(row) {
            LF_MAP.describeMarker(row.firstChild.textContent);
        },

        // Moves the event from its event table to the other 
        migrate: function(row) {
            if (EVENT_FEED.getRowPosition(row) > -1) {
            	row.delete();
                GROUPED_EVENTS.addRow(row.getData());
                LF_MAP.markSelected(row._row.data.event_id, true); // Shouldnt be accessing this??
            }
            else {
            	row.delete();
                EVENT_FEED.addRow(row.getData());
                LF_MAP.markSelected(row._row.data.event_id, false);
            }
        }
    };

    for (var table of document.getElementsByClassName("tabulator-table")) {
        table.addEventListener('mouseover', function(e) {
            DATA_HANDLER.select(e.target.parentNode);
        });
    }

    document.getElementById("filter_button").addEventListener('click', function(e) {
    	var table = document.getElementById("grouped_events_table");
    	var toolbar = document.getElementById("groups_toolbar");
    	var form = document.getElementById("filter_form");

    	if (e.target.textContent == "Filter") {
    		e.target.textContent = "Done";
	    	toolbar.style.display = "none";
	    	table.style.display = "none";
	    	form.style.display = "block";
	    }
	    else {
	    	e.target.textContent = "Filter";
	    	form.style.display = "none";
	    	toolbar.style.display = "block";
	    	table.style.display = "block";
	    }
    });

    return DATA_HANDLER;
})();



//// TESTING ///////////////////////
OM_DATA_HANDLER.queryEvents([
{
    "event_id":123,
    "severity":1, 
    "title":123, 
    "category_label":"danger",
    "create_time": "date",
    "rad": 0.2, 
    "lat": 39.123, 
    "long": -76.824, 
    "body": "description of event."
},
{
    "event_id":124,
    "severity":2,  
    "title":124, 
    "category_label":"evil",
    "create_time": "recently", 
    "rad": 0.3,
    "lat": 39.131, 
    "long": -76.842, 
    "body": "cat on fire."
},
{
    "event_id":125, 
    "severity":3, 
    "title":125, 
    "category_label":"fire",
    "create_time": "date", 
    "rad": 0.4,
    "lat": 39.111, 
    "long": -76.828, 
    "body": "Lois Lane captured by Lex Luther."
}]);
///////////////////////////////////