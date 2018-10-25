// Namespace
var NS = {
    MAP_OPTIONS: {
        zoomSnap: 0,    // If 0, zoom won't snap.
        doubleClickZoom: false,
        zoomDelta: 0.6, // Zoom will be a multiple of this.
        minZoom: 8,     // Users can't zoom out beyond this.
        layers: L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png') // Map style
    },
    MAP_AUTOPAN_OPTIONS: {
        maxZoom: 15,                        // Map won't autopan beyond this.
        paddingBottomRight: L.point(80,80), // Buffer on edge of map.
        paddingTopLeft: L.point(25,25)      // Buffer on edge of map.
    },
    TOOLTIP_OPTIONS: {
        opacity: 0.8,
        offset: L.point(10,10),
        className: 'tooltip'
    },
    VECTOR_OPTIONS: {
        color: "red"
    },
    CONST: {
        LAT_MAGIC: 68.69,  // For turning degree distance to miles.
        LNG_MAGIC: 69.17,  // For turning degree distance to miles.
        TO_M_MAGIC: 1609.34 // For converting miles to meters. 
    }
};


// LEAFLET MAP OBJECT
var LF_MAP = (function() {
    var map = L.map('leaflet_map', NS.MAP_OPTIONS);

    document.getElementById("leaflet_map")
        .style.height = window.innerHeight + "px";

    map.displayed = [];  // All icons currently on the map.

    map.selected = null;
    
    map.shapes = {
        points: [],   // The current points on the map.
        lines: [],    // The current lines on the map.
        polygon: null // The current polygons on the map.
    };
    
    // Removes all icons from the map
    map.clear = function() {
        for (var marker of this.displayed) {
            marker.remove();
        }
        this.displayed = [];
    };

    // Returns marker displayd on map with the given id.
    map.getMarker = function(eventId) {
        for (var marker of this.displayed) {
            if (marker.id == eventId) {
                return marker;
            }
        }
        return null;
    }

    // Opens tooltip of marker with eventId
    map.describeEvent = function(eventId) {
        this.selected && this.selected.closeTooltip();
        var marker = this.getMarker(eventId);
        marker.openTooltip();
        this.selected = marker
        return !!marker;
    };

    // Marks or unmarks a marker as having been grouped.
    map.markSelected = function(eventId, isSelected) {
        var marker = this.getMarker(eventId);

        if (marker) {
            isSelected ? marker.circle.addTo(this) : marker.circle.remove();
        }
    };

    // Displays an event on the map. Event is a JSON event object.
    // Gives the marker a circle so that it will display when marker
    // is selected. 
    map.displayEvent = function(event) {
        var marker = L.marker([event['lat'], event['long']]);
        marker.id = event.id;
        marker.circle = L.circle(marker.getLatLng(), 
                                (event['rad'] * NS.CONST.TO_M_MAGIC), 
                                NS.VECTOR_OPTIONS);
        this.displayed.push(marker);
        marker.bindTooltip(event['desc'], NS.TOOLTIP_OPTIONS);
        marker.addTo(this);
    };

    // Adds to the map and displays all the supplied events.
    // Events is an array of JSON event object.
    map.displayAll = function(events) {
        var bounds = []; // Used to fit map to markers.
        this.clear();

        // Add the new markers
        for (var event of events) {
            this.displayEvent(event);
            bounds.push([event["lat"], event["long"]])
        }

        // Fit the view to the scope of the markers
        bounds.length && this.fitBounds(bounds, NS.MAP_AUTOPAN_OPTIONS);
    };

    // Displays only markers withing mi miles of lat and lng.
    map.filterByRadius = function(lat, lng, mi) {
        for (var marker of this.displayed) {
            var coords = marker.getLatLng();
            var a = Math.abs(lat - coords.lat) * NS.CONST.LAT_MAGIC;
            var b = Math.abs(lng - coords.lng) * NS.CONST.LNG_MAGIC * Math.cos(lat);
            var isIn = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) <= mi
                
            isIn ? marker.addTo(this) : marker.remove();
        }
    };

    // Adds a point to the map for drawing lines.
    map.on('click', function(e) {
        var lastPt = this.shapes.points.length - 1;

        if (this.shapes.points.length) {    
            var line = L.polyline([this.shapes.points[lastPt], e.latlng], 
                NS.VECTOR_OPTIONS);
            line.addTo(this);
            this.shapes.lines.push(line);
        }

        this.shapes.points.push(e.latlng);
    });

    // Detects if pt is inside poly. 
    // Pt is a [lat, lng pair]. Poly is an array of [lat, lng] pairs 
    var insidePolygon = function(poly, pt) {
        var x = pt.lng, y = pt.lat;
        return true;
    };

    // Triggers event which completes a polygon.
    map.on('dblclick', function(e) {
        // Remove any current polygon
        if (this.shapes.polygon) {
            this.shapes.polygon.remove();
            this.shapes.polygon = null;
        }

        // Create a new polygon if enough points have been added.
        if (this.shapes.points.length > 2) {
            var poly = L.polygon(this.shapes.points, NS.VECTOR_OPTIONS); 
            this.shapes.polygon = poly;
            poly.addTo(this);

            // Toggle outside the polygon
            for (var marker of this.displayed) {
                if (insidePolygon(this.shapes.points, marker.getLatLng())) {
                    // Toggle marker        
                }
            }
        }
        
        // Remove all other vectors, leaving just the polygon.
        this.shapes.points = [];
        for (var line of this.shapes.lines) {
            line.remove();
        }
        this.shapes.lines = [];
    });

    return map;
})();



// Represents a the state of a table of events.
// TABLE is a table DOM element.
function EventTable(TABLE, FIELDS) {
    this.addRow = function(row) {
        TABLE.tBodies[0].appendChild(row);
    }

    this.removeRow = function(row) {
        var exists = TABLE.contains(row);
        exists && row.remove();
        return (exists ? row : null);
    };

    // Displays an event JSON object in a table row.
    this.displayEvent = function(event) {
        var newRow = document.createElement("tr");
        newRow.id = event["id"];

        for (var key of FIELDS) {
            var text = document.createTextNode(event[key]);
            newRow.insertCell(-1).appendChild(text);
        }

        var text = document.createTextNode("Unres.");
        newRow.insertCell(0).appendChild(text);

        TABLE.tBodies[0].appendChild(newRow);
    };

    // Displays all events in the events array of JSON objects.
    this.displayAll = function(events) {
        for (var event of events) {
            this.displayEvent(event);
        }
    };
}

var EVENT_FEED = new EventTable(document.getElementById("filtered_event_feed"), 
                                    ["name", "class", "recieved"]);
var GROUPED_EVENTS = new EventTable(document.getElementById("grouped_events_table"), 
                                    ["name", "class", "recieved"]);



/**
 * Since the map and table both hold events, but each cares only about certain
 * kinds of event information, the DATA_HANDLER is responsible for keeping them 
 * synchronized. Each handler on the page which affets events should invoke a
 * method of EVENT_HANDLER. The event handler will deal with the map and tables.
 * The DATA_HANDLER is the middleman between the user and the map/table.
 */
var DATA_HANDLER = {
    selected: null,

    // Queries data from the DB and then displays them on the page. 
    query: function(parameters) {
        // Query json object from DB
        LF_MAP.displayAll(parameters);
        EVENT_FEED.displayAll(parameters);
    },

    // Marks event as selected, opens tooltip, highlights row.
    select: function(row) {
        if (this.selected) {
            this.selected.style["background-color"] = "blue";
        }
        this.selected = row;
        LF_MAP.describeEvent(row.id);
        row.style["background-color"] = "red";
    },

    // Moves the event from its event table to the other 
    migrate: function(row) {
        if (EVENT_FEED.removeRow(row)) {
            GROUPED_EVENTS.addRow(row);
            LF_MAP.markSelected(row.id, true);
        }
        else if (GROUPED_EVENTS.removeRow(row)) {
            EVENT_FEED.addRow(row);
            LF_MAP.markSelected(row.id, false);
        }
    }
};



/*
 * Adds listener to table so that when a row is clicked, stuff happens
 * Event target should be the cell, so parentNode is the row.
 * depending on event ID in that row
 */
(function() {
    var handler = function(e, func) {
    	// Ensures function is called on a table row in the table body.
    	var row = e.target.parentNode;
        (row.parentNode.tagName == "TBODY") && func(row);
    };

    for (var tbl of ["filtered_event_feed", "grouped_events_table"]) {
        var obj = document.getElementById(tbl);

        obj.addEventListener('click', function(e) {
        	handler(e, DATA_HANDLER.migrate);
        });
        obj.addEventListener('mouseover', function(e) {
        	handler(e, DATA_HANDLER.select);
        });
    }
})();



//// TESTING ///////////////////////
DATA_HANDLER.query([
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