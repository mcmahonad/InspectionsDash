require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Expand",
    "esri/widgets/Legend",
    "esri/layers/FeatureLayer",
],

function(config, Map, MapView, BasemapGallery, Expand, Legend, FeatureLayer){
  config.apiKey = ""//Paste Key here
  config.PortalUrl = "" //Paste portal url here
  
  const map = new Map({
    basemap: "arcgis-topographic"
  });

  const view = new MapView({
      map: map,
      zoom:11,
      container: "viewDiv",
      padding: {
          right: 50
      }
  });
  const gallery = new BasemapGallery({
    container: document.createElement("div"),
    source: {
      query: {
        title:'"World Basemaps for Developers" AND owner:esri'
      }
    }
  });

  const legend = new Legend({
    view: view,
    container: document.createElement("div"),
  });

  const galleryExpand = new Expand({
    view: view,
    content: gallery
  });

  const legendExpand = new Expand({
    view: view,
    content: legend
  });

  const swData = new FeatureLayer({
    // sample public dataset. Swap out for inspections data once authentication is figured out.
    url: "https://services3.arcgis.com/TsynfzBSE6sXfoLq/arcgis/rest/services/Stormwater/FeatureServer/2",
  });

 swData
  .when(() => {
    return swData.queryExtent();
  })
  .then((response) => {
    view.goTo(response.extent);
  });

  map.add(swData);
  view.ui.add(galleryExpand, "bottom-left");
  view.ui.add(legendExpand, "bottom-left")


// query function working. Update where clause to use button yearinstalled and get target button year.

// I probably shouldn't ask Brianna for function names anymore. 
function potato(){
const anotherQuery = swData.createQuery();
anotherQuery.where = "YearInstalled = '2015'", // needs to use target button year
anotherQuery.returnGeometry = true

swData.queryFeatures(anotherQuery)
  .then((results) => {
    let dispText = document.querySelector("#countyAssetCountText");
    dispText.innerHTML = results.features.length;
    console.log(results.features.length + " assets installed in 2015");
  });
};

const buttons = document.querySelectorAll(".queryButtons");
buttons.forEach(but => {
  but.addEventListener("click", potato);
});

}); 

