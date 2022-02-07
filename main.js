require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Expand",
    "esri/widgets/Legend",
    "esri/layers/FeatureLayer"
],

function(config, Map, MapView, BasemapGallery, Expand, Legend, FeatureLayer){
  // Paste key and portal here
  config.apiKey = ""//Paste Key here
  config.PortalUrl = "" //Paste portal url here

  const map = new Map({
    basemap: "arcgis-topographic"
  });

  const view = new MapView({
      map: map,
      zoom: 11,
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
    container: document.createElement("div")
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
    url: "https://services3.arcgis.com/TsynfzBSE6sXfoLq/arcgis/rest/services/Stormwater/FeatureServer/2"
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
  view.ui.add(legendExpand, "bottom-left");

  // highlight persists outside of layerView
  let highlight;

  // create a layer view from feature layer once it's loaded. Can't highlight a feature layer.
  view.whenLayerView(swData).then(function(swLayer){
    // I probably shouldn't ask Brianna for function names anymore. Potato fired on click
    function potato(evt){
    const clickQuery = swData.createQuery();
    clickQuery.where = `YearInstalled='${evt.target.innerText}'`; // using arcade expression.
    clickQuery.returnGeometry = true;

    // update panel text
    swData.queryFeatures(clickQuery)
      .then((results) => {
        let dispText = document.querySelector("#newAssetCountText");
        dispText.innerHTML = results.features.length;
        console.log(results.features.length + " assets installed in 2015");

        // zoom to query results
        view.goTo({
          target: results.features
        });

        // highlight query results
        if(highlight){
          highlight.remove();
        }
      highlight = swLayer.highlight(results.features);
      });
    }
    // apply potato to buttons. 
    const buttons = document.querySelectorAll(".queryButtons");
    buttons.forEach(but => {
      but.addEventListener("click", potato);
    });
  });
});
