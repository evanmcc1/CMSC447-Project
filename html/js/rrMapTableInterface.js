/*
 * This file should handle anything that the OM and OC interfaces share.
 */

// Objects to be used among the OC and OM map/table interfaces
var RR = {

    /**
     * General options for a table that displays events.
     * @param onRowClick {function} rowClick event handler.
     */
    rrEventTableOptions: function(onRowClick) {
        this.layout = "fitColumns";
        this.columns = [
            {title:"ID", field:"event_id"},
            {title:"Title", field:"title"},
            {title:"Type", field:"category_label"},
            {title:"Priority", field:"severity"},
            {title:"Recieved", field:"create_time"}
        ];
        this.rowClick = onRowClick;
    },

    /**
     * Creates a map for use in RapidResponse.
     * This is meant to be used for both the OM and OC.
     * @param ID {String} ID of DOM element to add this to.
     *
     * TODO: Complete insidePolygon() function.
     * TODO: Add functionaliy to polygon drawing feature.
     */
    rrLeafletMap: (function() {
        // All the data used in the RapidResponse Leaflet map.
        var MAP_NS = {
            MAP_OPTIONS: {
                zoomSnap: 0,    // If 0, zoom won't snap.
                doubleClickZoom: false,
                zoomDelta: 0.6, // Zoom will be a multiple of this.
                minZoom: 8,     // Users can't zoom out beyond this.
                layers: L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png') // Map style
            },
            AUTOPAN_OPTIONS: {
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
        
        return function(ID) {
            var map = L.map(ID, MAP_NS.MAP_OPTIONS);

            // Map should extend from bottom to top.
            document.getElementById(ID)
                .style.height = window.innerHeight + "px";

            map.displayed = [];  // All icons currently on the map.
            map.selected = null; // Used to close tooltip of event last focused on.
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
            map.getMarker = function(ID) {
                return this.displayed.find(function(marker) {
                    return marker.id == ID;
                });
            }

            // Opens tooltip of marker with eventId
            map.describeMarker = function(ID) {
                this.selected && this.selected.closeTooltip();
                var marker = this.getMarker(ID);
                marker.openTooltip();
                this.selected = marker
                return !!marker;
            };

            // Marks or unmarks a marker as having been grouped.
            map.markSelected = function(ID, isSelected) {
                var marker = this.getMarker(ID);

                if (marker) {
                    isSelected ? marker.circle.addTo(this) : marker.circle.remove();
                }
            };

            // Displays an event on the map. Event is a JSON event object.
            // Gives the marker a circle so that it will display when marker
            // is selected. 
            map.addMarker = function(event) {
                var marker = L.marker([event['lat'], event['long']]);
                marker.id = event.event_id;
                marker.circle = L.circle(marker.getLatLng(), 
                                        (event['rad'] * MAP_NS.CONST.TO_M_MAGIC), 
                                        MAP_NS.VECTOR_OPTIONS);
                marker.bindTooltip(event['body'], MAP_NS.TOOLTIP_OPTIONS);
                this.displayed.push(marker);
                marker.addTo(this);
            };

            // Adds to the map and displays all the supplied events.
            // Events is an array of JSON event object.
            // This also fits map around the events. addMarker does not.
            map.addAllEvents = function(events) {
                var bounds = []; // Used to fit map to markers.
                this.clear();

                // Add the new markers
                for (var event of events) {
                    this.addMarker(event);
                    bounds.push([event["lat"], event["long"]])
                }

                // Fit the view to the scope of the markers
                bounds.length && this.fitBounds(bounds, MAP_NS.AUTOPAN_OPTIONS);
            };

            // Displays only markers withing mi miles of lat and lng.
            // Returns list of the IDs of events removed.
            map.filterByRadius = function(lat, lng, mi) {
                this.reset();

                var removed = this.displayed.filter(function(marker) {
                    var coords = marker.getLatLng();
                    var a = Math.abs(lat - coords.lat) * MAP_NS.CONST.LAT_MAGIC;
                    var b = Math.abs(lng - coords.lng) * MAP_NS.CONST.LNG_MAGIC * Math.cos(lat);
                    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) <= mi
                });

                removed.forEach(marker.remove);
                return removed;
            };

            // Adds a point to the map for drawing lines.
            map.on('click', function(e) {
                var lastPt = this.shapes.points[this.shapes.points.length - 1];

                if (this.shapes.points.length) {    
                    var line = L.polyline([lastPt, e.latlng], MAP_NS.VECTOR_OPTIONS);
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
                    var poly = L.polygon(this.shapes.points, MAP_NS.VECTOR_OPTIONS); 
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
        };
    })()
};