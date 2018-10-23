// Because I dont feel like typing this all the time
// Do a mass replace of '__id' later...
function __id(ID) {
	return document.getElementById(ID);
}

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

    __id("leaflet_map").style.height = window.innerHeight + "px";

    map._displayed = [];  // All icons currently on the map.
    map._shapes = {
        points: [],   // The current points on the map.
        lines: [],    // The current lines on the map.
        polygon: null // The current polygon on the map.
    };
    
    /**
     * Adds to the map and displays all the supplied events.
     * @param events {object} An array of event object.
     */
    map.display = function(events) {
        var bounds = []; // Used to fit map to markers.

        // Reset map
        for (var marker of this._displayed) {
            marker.remove();
        }
        this._displayed = [];

        // Add the new markers
        for (var event of events) {
            var marker = L.marker([event['lat'], event['long']]);
            
            for (var field of Object.keys(event)) {
                if (field != "lat" && field != "long") {
                    // Puts ALL fields in marker. Maybe not necessary to do all?
                    marker[field] = event[field];
                }
            }

            this._displayed.push(marker);
            bounds.push(marker.getLatLng())
            marker.addTo(this);
        }

        // Fit the view to the scope of the markers
        if (bounds.length) {
            this.fitBounds(bounds, NS.MAP_AUTOPAN_OPTIONS);
        }
    };


    /**
     * Displays only markers withing r degrees of lat and lng.
     * @param lat {number} Latitude.
     * @param lng {number} Longitude.
     * @param mi {number} Radius in miles.
     */
    map.filterByRadius = function(lat, lng, mi) {
        for (var marker of this._displayed) {
            var coords = marker.getLatLng();
            var a = Math.abs(lat - coords.lat) * NS.CONSTANTS.LAT_MAGIC;
            var b = Math.abs(lng - coords.lng) * NS.CONSTANTS.LNG_MAGIC * Math.cos(lat);
            var isIn = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) <= mi
                
            isIn ? marker.addTo(this) : marker.remove();
        }
    };


    /*
     * Adds a point to the map for drawing lines.
     */
    map.on('click', function(e) {
        var lastPt = this._shapes.points.length - 1;

        if (this._shapes.points.length) {    
            var line = L.polyline([this._shapes.points[lastPt], e.latlng], 
                NS.VECTOR_OPTIONS);
            line.addTo(this);
            this._shapes.lines.push(line);
        }

        this._shapes.points.push(e.latlng);
    });


	/**
     * Detects if pt is inside poly.
     * Trying to get ray-casting algorithm to work for this.
     * @param poly {array} an array of [lat, lng] coordinates
     * @param pt {object} a latlng object. 
     */
    var insidePolygon = function(poly, pt) {
        var x = pt.lng, y = pt.lat;
        return true;
    };

    /**
     * Triggers event which completes a polygon.
     */
    map.on('dblclick', function(e) {
        // Remove any current polygon
        if (this._shapes.polygon) {
            this._shapes.polygon.remove();
            this._shapes.polygon = null;
        }

        // Create a new polygon if enough points have been added.
        if (this._shapes.points.length > 2) {
            var poly = L.polygon(this._shapes.points, NS.VECTOR_OPTIONS); 
            this._shapes.polygon = poly;
            poly.addTo(this);

            // Toggle outside the polygon
            for (var marker of this._displayed) {
                if (insidePolygon(this._shapes.points, marker.getLatLng())) {
                    // Toggle marker        
                }
            }
        }
        
        // Remove all other vectors, leaving just the polygon.
        this._shapes.points = [];
        for (var line of this._shapes.lines) {
            line.remove();
        }
        this._shapes.lines = [];
    });

    return map;
})();


// Binds events related to tables
(function() {
    /**
     * Displays an event in a table row.
     * @param id {String} ID of table to add it to.
     * @param event {Object} Event fields.
     */
    var displayEvent = function(id, event) {
        var newRow = __id(id).insertRow(-1);
        // Adds another tr DOM element. 
        // Sorts events maybe??

        for (var value of event) {
            newRow.insertCell(-1).appendChild(document.createTextNode(value));
        }
    };

    //// TESTING ///////////////////////
    for (var i = 0; i < 20; i++) {
        displayEvent("filtered_event_feed", [i, "A name", "fire", "A comment"]);
    }
    ////////////////////////////////////


    /*document.querySelector(".event_table tbody").on("click", function() {
        // Highlight event it on map
        // Select row so that it moves when [un]select event button is clicked
    });*/
})();


var FILTER_FORM = {
    //// TESTING ///////////////////////
	testEvents: [
	    {
	        "lat":         39.123,
	        "long":     -76.824,
	        "severity": 5,
	        "class":    "fire"
	    },
	    {
	        "lat":         39.125,
	        "long":     -76.822,
	        "severity": 3,
	        "class":    "flood"
	    },
	    {
	        "lat":         39.122,
	        "long":     -76.821,
	        "severity": 2,
	        "class":    "animal"
	    },
	    {
	        "lat":         39.132,
	        "long":     -76.811,
	        "severity": 3,
	        "class":    "animal"
	    }
	],
    ////////////////////////////////////

	/**
     * @param parameters {?} Contains parameters to filter events on. 
     * @return JSON object containing events from back end database. 
     */
    query: function(parameters) {
    	var events = null;
    	// Query json object from DB
    	return this.testEvents;
    }
};

//// TESTING ///////////////////////
LF_MAP.display(FILTER_FORM.query(null));
////////////////////////////////////