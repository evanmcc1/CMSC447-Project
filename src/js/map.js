var __testEvents = [
	{
		"lat": 		120.123,
		"long":     62.324,
		"severity": 5,
		"class":    "fire"
	},
	{
		"lat": 		120.125,
		"long":     62.322,
		"severity": 3,
		"class":    "flood"
	},
	{
		"lat": 		120.122,
		"long":     62.321,
		"severity": 2,
		"class":    "animal"
	},
	{
		"lat": 		120.132,
		"long":     62.311,
		"severity": 3,
		"class":    "animal"
	}
];

// Namespace
var NS = {
    MAP_OPTIONS: {
        zoomSnap: 0,    // If 0, zoom won't snap.
        zoomDelta: 0.6, // Zoom will be a multiple of this.
        minZoom: 8,     // Users can't zoom out beyond this.
        layers: L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png') // Map style
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
    }
};


// The leaflet map
var LF_MAP = (function() {
    var map = L.map('leaflet_map', NS.MAP_OPTIONS);

    map.displayed = [];  // All icons currently on the map.
    map.allEvents = [];  // All events
    
    /**
     * Switches up all markers on the map based on filter parameters.
     * @param conditions {object} Mapping of marker field names to filter parameters.
     */
    map.filter = function(conditions) {
        var bounds = []; // Used to fit map to markers.

        // Reset map
        for (var marker of this.displayed) {
            marker.remove();
        }
        this.displayed = [];

        // Add the new markers
        for (var marker of this.allEvents) {
        	var matches = true;

            for (var key of Object.keys(conditions)) {
                if (marker[key] != conditions[key]) {
                	matches = false;
                    break; // Marker doesn't meet conditions.
                }
            }

            if (matches) {
	            this.displayed.push(marker);
	            marker.addTo(this);
	            bounds.push(marker.getLatLng());
        	}
        }

        // Fit the view to the scope of the markers
        if (bounds.length) {
            this.fitBounds(bounds, NS.MAP_AUTOPAN_OPTIONS);
        }
    };

    /**
     * Adds all the events from json data to the map.
     * @param events {array} array of event objects.
     */
    map.populate = function(events) {
        for (var e of events) {
            var marker = L.marker([e['lat'], e['long']]);
            
            for (var field of Object.keys(e)) {
            	if (field != "lat" && field != "long") {
            		// Puts ALL fields in marker. Maybe not necessary to do all?
            		marker[field] = e[field];
            	}
            }

            this.allEvents.push(marker);
        }

        this.filter({}); // Add all markers to map.
    }

    /*
     * Add events to the map.
     */
    map.on('click', function(e) {
    	/* Start drawing polygon?? */
    });
    map.on('stuff', function(e) {

    });

    return map;
})();

LF_MAP.populate(__testEvents);
LF_MAP.filter({ "severity": 3 });