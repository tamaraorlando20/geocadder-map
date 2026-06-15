/* This will let you use the .remove() function later on */
if (!("remove" in Element.prototype)) {
  Element.prototype.remove = function () {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}

const bounds = [
  [-179.0, 18.0], // Southwest corner: Longitude, Latitude
  [-66.0, 72.0], // Northeast corner: Longitude, Latitude
];

mapboxgl.accessToken =
  "pk.eyJ1IjoiYy1tYW5uZWxsYSIsImEiOiJjbTJ3OHh2dmEwNGJ1Mmpwd3dzbHZncWd4In0.LwqLnuclTSEFooYUSIW8Sw";

/**
 * Add the map to the page
 */
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/c-mannella/cm3u9zpmh004d01quhz1d8mkq",
  zoom: 1,
  // cooperativeGestures: true,
  customAttribution:
    'created by <a style="padding: 0 3px 0 3px; color:#FFFFFF; background-color: #15817d;" target="_blank" href=http://www.geocadder.bg/en/>GEOCADDER</a>',
});

// adding button for toggling layers list
class MyCustomControl {
  onAdd(map) {
    this.map = map;
    this.container = document.createElement("div");
    this.container.className = "my-custom-control";
    this.container.className = "mapboxgl-ctrl my-custom-control";
    this.container.id = "layers-custom-control";
    this.container.innerHTML = '<span class="material-icons">layers</span>';
    return this.container;
  }
  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
}

const myCustomControl = new MyCustomControl();

map.addControl(myCustomControl, "top-left");

var element = document.getElementById("layers-custom-control");
element.addEventListener("click", function () {
  var layersList = document.getElementById("menu");
  if (layersList.style.display !== "none") {
    layersList.style.display = "none";
  } else {
    layersList.style.display = "block";
  }
});
/////////////////////

var isZipFound = false;

var markersCoordinates = [];

// Add zoom and rotation controls to the map.
var zoomButton = new mapboxgl.NavigationControl({ showCompass: false });
map.addControl(zoomButton, "top-left");

const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken, // Required: your Mapbox token
  mapboxgl: mapboxgl, // Pass the mapbox-gl instance
  marker: true, // Add a marker at the searched location
  placeholder: "Search for a place ...", // Placeholder text in the search bar
});

map.addControl(geocoder, "top-left"); // Add the search bar to the top-left corner

/**
 * Wait until the map loads to make changes to the map.
 */
map.on("load", function (e) {
  map.fitBounds(bounds);

  // Senate layer - polygon
  map.addLayer({
    id: "atlanta-united-fc-polygon-layer",
    type: "fill",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.1nxfe3mv",
    },
    "source-layer": "atlanta-united-fc-area-9o8y9f",
    paint: {
      "fill-color": "#0000FF",
      "fill-opacity": 0,
    },
  });

  // Add a popup on click
  // map.on("click", "atlanta-united-fc-polygon-layer", (e) => {
  //   map.on("click", "atlanta-united-fc-polygon-layer", (e) => {
  //     // Get the first clicked feature
  //     const features = map.queryRenderedFeatures(e.point, {
  //       layers: ["atlanta-united-fc-polygon-layer"],
  //     });

  //     if (!features.length) return;

  //     const feature = features[0];

  //     // Create a popup and set its content
  //     new mapboxgl.Popup({ offset: 25 }) // Adjust offset for better visibility
  //       .setLngLat(e.lngLat) // Use click location for popup
  //       .setHTML(
  //         `
  //             <h3>County: ${feature.properties.NAME || "No Name"}</h3>State:
  //             <p>${feature.properties.STATE || "No Description"}</p>
  //         `
  //       ) // Customize content using GeoJSON properties
  //       .addTo(map);
  //   });

  //   // Change the cursor to a pointer when hovering over the polygon
  //   map.on("mouseenter", "atlanta-united-fc-polygon-layer", () => {
  //     map.getCanvas().style.cursor = "pointer";
  //   });

  //   // Reset the cursor when leaving the polygon
  //   map.on("mouseleave", "atlanta-united-fc-polygon-layer", () => {
  //     map.getCanvas().style.cursor = "";
  //   });
  // });

  // Change the cursor to a pointer when hovering over the layer
  map.on("mouseenter", "atlanta-united-fc-polygon-layer", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  // Reset the cursor when leaving the layer
  map.on("mouseleave", "atlanta-united-fc-polygon-layer", () => {
    map.getCanvas().style.cursor = "";
  });

  // Atlanta United FC - line
  map.addLayer({
    id: "atlanta-united-fc-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.1nxfe3mv",
    },
    "source-layer": "atlanta-united-fc-area-9o8y9f",
    paint: {
      "line-width": 3.5,
      "line-color": "#D3BA34",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // Austin FC - polygon
  map.addLayer({
    id: "austin-fc-polygon-layer",
    type: "fill",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.bcsggzlv",
    },
    "source-layer": "austin-fc-area-cetn8v",
    paint: {
      "fill-color": "#0000FF",
      "fill-opacity": 0,
    },
  });

  // Austin FC - line
  map.addLayer({
    id: "austin-fc-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.bcsggzlv",
    },
    "source-layer": "austin-fc-area-cetn8v",
    paint: {
      "line-width": 3.5,
      "line-color": "#00b33e",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // CF Montreal - line
  map.addLayer({
    id: "cf-montreal-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.8s5k0x3v",
    },
    "source-layer": "cf-montreal-area-1nmtm5",
    paint: {
      "line-width": 3.5,
      "line-color": "#00549b",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // Charlotte FC - line
  map.addLayer({
    id: "charlotte-fc-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.09mx1jeb",
    },
    "source-layer": "charlotte-fc-area-0p2a4h",
    paint: {
      "line-width": 3.5,
      "line-color": "#1386c9",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // Chicago Fire - line
  map.addLayer({
    id: "chicago-fire-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.4eq7kz2w",
    },
    "source-layer": "chicago-fire-area-37i00v",
    paint: {
      "line-width": 3.5,
      "line-color": "#ff0000",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // Colorado Rapids - line
  map.addLayer({
    id: "colorado-rapids-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.dk1tbi1m",
    },
    "source-layer": "colorado-rapids-area-3hw921",
    paint: {
      "line-width": 3.5,
      "line-color": "#8d1e2e",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // Columbus Crew - line
  map.addLayer({
    id: "columbus-crew-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.cqwf2k9v",
    },
    "source-layer": "columbus-crew-area-bx9yba",
    paint: {
      "line-width": 3.5,
      "line-color": "#fee32b",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // DC United - polygon
  map.addLayer({
    id: "dc-united-polygon-layer",
    type: "fill",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.0g7rnhvl",
    },
    "source-layer": "dc-united-area-dtfoub",
    paint: {
      "fill-color": "#BDB246",
      "fill-opacity": 0,
    },
  });

  // DC United - line
  map.addLayer({
    id: "dc-united-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.0g7rnhvl",
    },
    "source-layer": "dc-united-area-dtfoub",
    paint: {
      "line-width": 3.5,
      "line-color": "#1e191a",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // FC Cincinnati - line
  map.addLayer({
    id: "fc-cincinnati-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.4hnmjayl",
    },
    "source-layer": "fc-cincinnati-area-1nwcgs",
    paint: {
      "line-width": 3.5,
      "line-color": "#f0521e",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // FC Dallas - line
  map.addLayer({
    id: "fc-dallas-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.9h3w4083",
    },
    "source-layer": "fc-dallas-area-6xkwwp",
    paint: {
      "line-width": 3.5,
      "line-color": "#c71a3c",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // Houston Dynamo - line
  map.addLayer({
    id: "houston-dynamo-fc-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.a8bpiwit",
    },
    "source-layer": "houston-dynamo-area-90nxv1",
    paint: {
      "line-width": 3.5,
      "line-color": "#ff6b00",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // Inter Miami - line
  map.addLayer({
    id: "inter-miami-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.6ktfju1z",
    },
    "source-layer": "inter-miami-area-4zynxl",
    paint: {
      "line-width": 3.5,
      "line-color": "#f6b5ce",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // Los Angeles FC - line
  map.addLayer({
    id: "los-angeles-fc-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.1mznwycd",
    },
    "source-layer": "los-angeles-fc-area-1jdepp",
    paint: {
      "line-width": 3.5,
      "line-color": "#000000",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // Los Angeles Galaxy - line
  map.addLayer({
    id: "los-angeles-galaxy-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.au4d44mt",
    },
    "source-layer": "los-angeles-galaxy-area-dxdwkf",
    paint: {
      "line-width": 3.5,
      "line-color": "#ffcf00",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // Minnesota United FC - line
  map.addLayer({
    id: "minnesota-united-fc-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.d7e0aqko",
    },
    "source-layer": "minnesota-united-fc-area-2zf50g",
    paint: {
      "line-width": 3.5,
      "line-color": "#8dd3f4",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // Nashville SC - line
  map.addLayer({
    id: "nashville-sc-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.ccotv6ni",
    },
    "source-layer": "nashville-sc-area-aqaqaa",
    paint: {
      "line-width": 3.5,
      "line-color": "#ece83a",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // New England Revolution - line
  map.addLayer({
    id: "new-england-revolution-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.98oioyt3",
    },
    "source-layer": "new-england-revolution-area-c3xh7s",
    paint: {
      "line-width": 3.5,
      "line-color": "#cf0629",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // New York City FC - line
  map.addLayer({
    id: "new-york-city-fc-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.3wesm35b",
    },
    "source-layer": "new-york-city-fc-area-62cet6",
    paint: {
      "line-width": 3.5,
      "line-color": "#a5d1f0",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // New York Red Bulls - line
  map.addLayer({
    id: "new-york-red-bulls-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.4f9aod63",
    },
    "source-layer": "new-york-red-bulls-area-five-5t1g4a",
    paint: {
      "line-width": 3.5,
      "line-color": "#ee1833",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // Orlando City SC - line
  map.addLayer({
    id: "orlando-city-sc-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.4vhnbr1u",
    },
    "source-layer": "orland-city-sc-area-6cn9za",
    paint: {
      "line-width": 3.5,
      "line-color": "#633193",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // Philadephia Union - line
  map.addLayer({
    id: "philadelphia-union-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.9dgfhkhz",
    },
    "source-layer": "philadelphia-union-area-six-crzf4v",
    paint: {
      "line-width": 3.5,
      "line-color": "#011428",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // Portland Timbers - line
  map.addLayer({
    id: "portland-timbers-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.4m9o8anq",
    },
    "source-layer": "portland-timbers-area-cxa9s8",
    paint: {
      "line-width": 3.5,
      "line-color": "#005131",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // Real Salt Lake - line
  map.addLayer({
    id: "real-salt-lake-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.bd4m31tx",
    },
    "source-layer": "real-salt-lake-area-dqsbmd",
    paint: {
      "line-width": 3.5,
      "line-color": "#1a235c",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // San Diego FC- line
  map.addLayer({
    id: "san-diego-fc-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.41bip822",
    },
    "source-layer": "san-diego-fc-area-6l4cq4",
    paint: {
      "line-width": 3.5,
      "line-color": "#2F86A6",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // San Jose Earthquakes- line
  map.addLayer({
    id: "san-jose-earthquakes-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.a611bg79",
    },
    "source-layer": "san-jose-earthquakes-area-6xqlzs",
    paint: {
      "line-width": 3.5,
      "line-color": "#00008B",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // Seattle Sounders FC - line
  map.addLayer({
    id: "seattle-sounders-fc-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.4ccj93fq",
    },
    "source-layer": "seattle-sounders-fc-area-28xbst",
    paint: {
      "line-width": 3.5,
      "line-color": "#4eb94e",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // Sporting Kansas City - line
  map.addLayer({
    id: "sporting-cansas-city-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.49xlbc0c",
    },
    "source-layer": "sporting-cansas-city-area-8khm1y",
    paint: {
      "line-width": 3.5,
      "line-color": "#90d5ff",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // St. Louis City - line
  map.addLayer({
    id: "st-louis-city-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.8gq02xaa",
    },
    "source-layer": "st-louis-city-area-9ijcga",
    paint: {
      "line-width": 3.5,
      "line-color": "#dd004a",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // Toronto FC - line
  map.addLayer({
    id: "toronto-fc-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.c8v788jp",
    },
    "source-layer": "toronto-fc-area-8qe6km",
    paint: {
      "line-width": 3.5,
      "line-color": "#FF0000",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // Vancoouver Whitecaps FC - line
  map.addLayer({
    id: "vancouver-whitecaps-fc-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.0sja0w0q",
    },
    "source-layer": "vancouver-whitecaps-fc-area-9nllw4",
    paint: {
      "line-width": 3.5,
      "line-color": "#9ec3eb",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // Counties layer - line
  map.addLayer({
    id: "counties-lines-layer",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://c-mannella.cpsw3qz6",
    },
    "source-layer": "us-counties-d8gihy",
    paint: {
      "line-width": 0.3,
      "line-color": "#073B4C",
      "line-opacity": 1,
    },
    layout: {
      visibility: "visible",
      "line-join": "round",
      "line-cap": "round",
    },
  });

  // After the last frame rendered before the map enters an "idle" state.

  // If these two layers were not added to the map, abort
  if (
    !map.getLayer("atlanta-united-fc-layer") ||
    !map.getLayer("austin-fc-layer") ||
    !map.getLayer("cf-montreal-layer") ||
    !map.getLayer("dc-united-layer") ||
    !map.getLayer("real-salt-lake-layer") ||
    !map.getLayer("counties-lines-layer")
  ) {
    return;
  }

  // Enumerate ids of the layers.
  const toggleableLayerIds = [
    ["all", "All"],
    ["atlanta-united-fc-layer", "Atlanta United FC"],
    ["austin-fc-layer", "Austin FC"],
    ["cf-montreal-layer", "CF Montreal"],
    ["charlotte-fc-layer", "Charlotte FC"],
    ["chicago-fire-layer", "Chicago Fire"],
    ["colorado-rapids-layer", "Colorado Rapids"],
    ["columbus-crew-layer", "Columbus Crew"],
    ["dc-united-layer", "DC United"],
    ["fc-cincinnati-layer", "FC Cincinnati"],
    ["fc-dallas-layer", "FC Dallas"],
    ["houston-dynamo-fc-layer", "Houston Dynamo FC"],
    ["inter-miami-layer", "Inter Miami FC"],
    ["los-angeles-fc-layer", "Los Angeles FC"],
    ["los-angeles-galaxy-layer", "Los Angeles Galaxy"],
    ["minnesota-united-fc-layer", "Minnesota United"],
    ["nashville-sc-layer", "Nashville SC"],
    ["new-england-revolution-layer", "New England Revolution"],
    ["new-york-city-fc-layer", "New York City FC"],
    ["new-york-red-bulls-layer", "New York Red Bulls"],
    ["orlando-city-sc-layer", "Orlando City SC"],
    ["philadelphia-union-layer", "Philadelphia Union"],
    ["portland-timbers-layer", "Portland Timbers"],
    ["real-salt-lake-layer", "Real Salt Lake"],
    ["san-diego-fc-layer", "San Diego FC"],
    ["san-jose-earthquakes-layer", "San Jose Earthquakes"],
    ["seattle-sounders-fc-layer", "Seattle Sounders FC"],
    ["sporting-cansas-city-layer", "Sporting Kansas City"],
    ["st-louis-city-layer", "St. Louis City"],
    ["toronto-fc-layer", "Toronto FC"],
    ["vancouver-whitecaps-fc-layer", "Vancouver Whitecaps FC"],
    ["counties-lines-layer", "Counties"],
  ];

  // Set up the corresponding toggle button for each layer.
  for (const id of toggleableLayerIds) {
    // Skip layers that already have a button set up.
    if (document.getElementById(id)) {
      continue;
    }

    // Create a link.
    const link = document.createElement("a");
    link.id = id[0];
    link.href = "#";
    link.className = "active";

    // Create an img element and set its src attribute
    const img = document.createElement("img");
    img.src = id[0] + ".svg"; // Replace with your actual image path
    // img.alt = "House Layer"; // Optional, for accessibility

    // Append the image to the anchor element
    link.appendChild(img);

    link.appendChild(document.createTextNode(id[1]));

    // Show or hide layer when the toggle is clicked.
    link.onclick = function (e) {
      const clickedLayer = this.id;
      e.preventDefault();
      e.stopPropagation();

      var visibility;
      if (id[0] !== "all"){
        visibility = map.getLayoutProperty(clickedLayer, "visibility");
      }
      

      // Toggle layer visibility by changing the layout object's visibility property.
      if (visibility === "visible") {
        map.setLayoutProperty(clickedLayer, "visibility", "none");
        this.className = "";
      } else {
        this.className = "active";
        if (id[0] !== "all"){
          map.setLayoutProperty(clickedLayer, "visibility", "visible");
        }
       
      }
    };

    const layers = document.getElementById("menu");
    layers.appendChild(link);
  }

  var allVisibility = true;
  $("a#all").click(function () {
    if (allVisibility === true) {
      for (const id of toggleableLayerIds) {
        if (id[0] !== "all") {
          map.setLayoutProperty(id[0], "visibility", "none");
        }
      }
      allVisibility = false;
    } else {
      {
        for (const id of toggleableLayerIds) {
          if (id[0] !== "all") {
            map.setLayoutProperty(id[0], "visibility", "visible");
          }
        }
        allVisibility = true;
      }
    }
  });
});

/**
 * Create a Mapbox GL JS `Popup`.
 **/
function createPopUp(currentFeature) {
  var popUps = document.getElementsByClassName("mapboxgl-popup");
  if (popUps[0]) popUps[0].remove();

  var popupContent =
    "<h3 class='geocadder'>" + currentFeature.properties.name + "</h3>";

  popupContent += "<div class='phone-directions'>";

  popupContent +=
    '<div class="phone"><i class="fa fa-university" aria-hidden="true"></i> ' +
    currentFeature.properties.party +
    "</div>";

  popupContent +=
    '<div class="phone"><i class="fa fa-globe" aria-hidden="true"></i>&nbsp;&nbsp;' +
    currentFeature.properties.type +
    " District " +
    currentFeature.properties.district +
    "</div>";

  popupContent +=
    '<div class="phone"><a target="_blank" href="mailto:' +
    currentFeature.properties.email +
    '"><i class="fa fa-envelope" aria-hidden="true"></i> Email</a></div>';

  popupContent += "</div>";

  popupContent +=
    "<div class='order-button'><a target='_blank' href='" +
    currentFeature.properties.website +
    "'>Website</a></div>";

  var popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML(popupContent)
    .addTo(map);
}

// close all opened popups

$("#menu").click(function () {
  $(".mapboxgl-popup").remove();
});
