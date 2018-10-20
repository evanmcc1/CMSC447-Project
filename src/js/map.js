var __testEvents = [
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
];

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
    }
    LAT_MAGIC: 68.69,  // Magic constant for turning degree distance to miles.
    LNG_MAGIC: 69.17   // Magic constant for turning degree distance to miles.
};


// The leaflet map
var LF_MAP = (function() {
    var map = L.map('leaflet_map', NS.MAP_OPTIONS);

    map.displayed = [];  // All icons currently on the map.
    map.allEvents = [];  // All events

    map.shapes = {
        points: [],   // The current points on the map.
        lines: [],    // The current lines on the map.
        polygon: null // The current polygon on the map.
    };
    
    map.display = function(events) {
        var bounds = []; // Used to fit map to markers.

        // Reset map
        for (var marker of this.displayed) {
            marker.remove();
        }
        this.displayed = [];

        // Add the new markers
        for (var event of events) {
            var marker = L.marker([event['lat'], event['long']]);
            
            for (var field of Object.keys(event)) {
                if (field != "lat" && field != "long") {
                    // Puts ALL fields in marker. Maybe not necessary to do all?
                    marker[field] = event[field];
                }
            }

            this.displayed.push(marker);
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
    	for (var marker of this.displayed) {
    		var coords = marker.getLatLng();
    		var a = Math.abs(lat - coords.lat) * NS.LAT_MAGIC;
    		var b = Math.abs(lng - coords.lng) * NS.LNG_MAGIC * Math.cos(lat);
    		var isIn = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) <= mi
    			
    		isIn ? marker.addTo(this) : marker.remove();
    	}
    }


    /*
     * Adds a point to the map for drawing lines.
     */
    map.on('click', function(e) {
        var pts = this.shapes.points;

        if (this.shapes.points.length) {    
            var line = L.polyline([pts[pts.length - 1], e.latlng], 
                {color: "red"});
            line.addTo(this);
            this.shapes.lines.push(line);
        }

        pts.push(e.latlng);
    });


    var insidePolygon = function(coords, lat, lng) {

    }

    /*
     * Completes a polygon.
     */
    map.on('dblclick', function(e) {
        if (this.shapes.polygon) {
            this.shapes.polygon.remove();
            this.shapes.polygon = null;
        }

        if (this.shapes.points.length > 2) {
            var poly = L.polygon(this.shapes.points, {color: "red"}); 
            this.shapes.polygon = poly;
            poly.addTo(this);

            for (var marker of this.displayed) {
                var coords = marker.getLatLng();

                if (! insidePolygon(this.shapes.points, coords.lat, coords.lng)) {
                    // remove marker
                }
            }
        }
        
        this.shapes.points = [];
        for (var line of this.shapes.lines) {
            line.remove();
        }
        this.shapes.lines = [];
    });

    return map;
})();

LF_MAP.display(__testEvents);