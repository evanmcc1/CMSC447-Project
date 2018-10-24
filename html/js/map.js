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
    CONSTANTS: {
        LAT_MAGIC: 68.69,  // For turning degree distance to miles.
        LNG_MAGIC: 69.17   // For turning degree distance to miles.
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
        polygon: null // The current polygon on the map.
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

        isSelected ? alert("Marker on map is now selected!") 
            : alert("Marker on map is now unselected!");
    };

    // Displays an event on the map. Event is a JSON event object.
    map.displayEvent = function(event) {
        var marker = L.marker([event['lat'], event['long']]);
        marker.id = event.id;
        this.displayed.push(marker);
        marker.bindTooltip(event["desc"], NS.TOOLTIP_OPTIONS);
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
            var a = Math.abs(lat - coords.lat) * NS.CONSTANTS.LAT_MAGIC;
            var b = Math.abs(lng - coords.lng) * NS.CONSTANTS.LNG_MAGIC * Math.cos(lat);
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
// TABLE is the table DOM element.
function EventTable(TABLE) {
    this.addRow = function(row) {
        TABLE.appendChild(row);
    }

    this.removeRow = function(oldRow) {
        if (TABLE.contains(oldRow)) {
            oldRow.remove();
            return oldRow;
        }
        return null;
    };

    // Displays an event JSON object in a table row.
    this.displayEvent = function(event) {
        var newRow = TABLE.insertRow(-1);
        newRow.id = event["id"];

        for (var key of ["name", "class", "recieved"]) {
            newRow.insertCell(-1)
                .appendChild(document.createTextNode(event[key]));
        }

        newRow.insertCell(0)
            .appendChild(document.createTextNode("Unres."));
    };

    // Displays all events in the events array of JSON objects.
    this.displayAll = function(events) {
        for (var event of events) {
            this.displayEvent(event);
        }
    };
}
var EVENT_FEED = new EventTable(document.getElementById("filtered_event_feed"));
var GROUPED_EVENTS = new EventTable(document.getElementById("grouped_events_table"));



/**
 * Since the map and table both hold events, but each cares only about certain
 * kinds of event information, the DATA_HANDLER is responsible for keeping them 
 * synchronized. Each handler on the page which affets events should invoke a
 * method of EVENT_HANDLER. The event handler will deal with the map and tables.
 * The DATA_HANDLER is the middleman between the user and the map/table.
 */
var DATA_HANDLER = {
    selected: null,

    /**
     * @param parameters {?} Contains parameters to filter events on. 
     * @return JSON object containing events from back end database. 
     */
    query: function(parameters) {
        // Query json object from DB
        LF_MAP.displayAll(parameters);
        EVENT_FEED.displayAll(parameters);
    },

    // Marks event as selected, opens tooltip, highlights row.
    select: function(row) {
        LF_MAP.describeEvent(row.id);
        if (this.selected) {
            this.selected.style["background-color"] = "blue";
        }
        this.selected = row;
        this.selected.style["background-color"] = "red";
    },

    // Moves the event from its event table to the other 
    migrate: function(row) {
        if (EVENT_FEED.removeRow(row)) {
            GROUPED_EVENTS.addRow(row);
            LF_MAP.markSelected(row.id, true);
        }
        else {
            GROUPED_EVENTS.removeRow(row);
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
    var select = function(e) {
        DATA_HANDLER.select(e.target.parentNode);
    };
    var migrate = function(e) {
        DATA_HANDLER.migrate(e.target.parentNode);
    };

    for (var tbl of ["filtered_event_feed", "grouped_events_table"]) {
        var obj = document.getElementById(tbl);
        obj.addEventListener('dblclick', migrate);
        obj.addEventListener('click', select);
    }
})();



//// TESTING ///////////////////////
DATA_HANDLER.query([{
    "id":123, 
    "name":123, 
    "class":"fire",
    "recieved": "now", 
    "lat": 39.123, 
    "long": -76.824, 
    "desc": "description of event."
}]);
////////////////////////////////////