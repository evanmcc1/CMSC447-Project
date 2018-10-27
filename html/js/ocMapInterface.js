/**
 * The DATA_HANDLER is responsible for keeping the map and tables 
 * synchronized. Each handler on the page which affets events should invoke a
 * method of EVENT_HANDLER. The event handler will deal with the map and tables.
 * The DATA_HANDLER is the middleman between the user and the map/table.
 */
var OC_DATA_HANDLER = (function() {

    var EVENT_TABLE_OPTIONS = new RR.rrEventTableOptions(
        onRowClick=function(e, row) {
            // Don't know if clicking these should do anyting.
        }
    );

    var MISSION_FEED_OPTIONS = {
        layout: "fitColumns",
        columns: [
            {title:"ID", field:"event_id"},
            {title:"Title", field:"title"},
            {title:"Priority", field:"severity"},
            {title:"Recieved", field:"create_time"}
        ],
        rowClick: function(e, row) { 
            DATA_HANDLER.expandMission(row);
        }
    };

    // Leaflet map, event feed, and grouped events feed.
    var LF_MAP = RR.rrLeafletMap("leaflet_map");
    var MISSION_FEED = new Tabulator("#mission_feed", MISSION_FEED_OPTIONS);
    var MISSION_EVENTS = new Tabulator("#mission_events_table", EVENT_TABLE_OPTIONS);

    var DATA_HANDLER = {
        selectedMission: null, // Currently clicked mission

        // Queries data from the DB and then displays them on the page. 
        queryMissions: function(parameters) {
            // Query json object from DB
            LF_MAP.addAllEvents(parameters);
            MISSION_FEED.setData(parameters);
        },

        // Marks event as selected, opens tooltip, highlights row.
        select: function(row) {
            LF_MAP.describeMarker(row.firstChild.textContent);
        },

        // Lists all events in the mission in the bottom table
        expandMission: function(row) {
            if (this.selectedMission) {
                var ID = this.selectedMission._row.data.event_id;
                LF_MAP.markSelected(ID, false);
            }
            this.selectedMission = row;
            LF_MAP.markSelected(row._row.data.event_id, true);
        }
    };

    document.getElementById("mission_feed")
        .getElementsByClassName("tabulator-table")[0]
        .addEventListener('mouseover', function(e) {
            DATA_HANDLER.select(e.target.parentNode);
        });

    document.getElementById("mission_events_table")
        .getElementsByClassName("tabulator-table")[0]
        .addEventListener('mouseover', function(e) {

        });

    return DATA_HANDLER;
})();



//// TESTING ///////////////////////
OC_DATA_HANDLER.queryMissions([
{
    "event_id":123,
    "severity":1, 
    "title":123, 
    "create_time": "date",
    "rad": 0.5, 
    "lat": 39.123, 
    "long": -76.824, 
    "body": "Missions."
},
{
    "event_id":124,
    "severity":2,  
    "title":124, 
    "create_time": "recently", 
    "rad": 0.8,
    "lat": 39.131, 
    "long": -76.842, 
    "body": "Some missions."
},
{
    "event_id":125, 
    "severity":3, 
    "title":125, 
    "create_time": "date", 
    "rad": 0.75,
    "lat": 39.111, 
    "long": -76.828, 
    "body": "Bunch of missions."
}]);
////////////////////////////////////