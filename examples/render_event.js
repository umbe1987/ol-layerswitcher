(function () {
    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Group({
                // A layer must have a title to appear in the layerswitcher
                'title': 'Base maps',
                layers: [
                    new ol.layer.Group({
                        // A layer must have a title to appear in the layerswitcher
                        title: 'Water color with labels',
                        // Setting the layers type to 'base' results
                        // in it having a radio button and only one
                        // base layer being visibile at a time
                        type: 'base',
                        // Setting combine to true causes sub-layers to be hidden
                        // in the layerswitcher, only the parent is shown
                        combine: true,
                        visible: false,
                        layers: [
                            new ol.layer.Tile({
                                source: new ol.source.Stamen({
                                    layer: 'watercolor'
                                })
                            }),
                            new ol.layer.Tile({
                                source: new ol.source.Stamen({
                                    layer: 'terrain-labels'
                                })
                            })
                        ]
                    }),
                    new ol.layer.Tile({
                        // A layer must have a title to appear in the layerswitcher
                        title: 'Water color',
                        // Again set this layer as a base layer
                        type: 'base',
                        visible: false,
                        source: new ol.source.Stamen({
                            layer: 'watercolor'
                        })
                    }),
                    new ol.layer.Tile({
                        // A layer must have a title to appear in the layerswitcher
                        title: 'OSM',
                        // Again set this layer as a base layer
                        type: 'base',
                        visible: true,
                        source: new ol.source.OSM()
                    })
                ]
            }),
            new ol.layer.Group({
                // A layer must have a title to appear in the layerswitcher
                title: 'Overlays',
                // Adding a 'fold' property set to either 'open' or 'close' makes the group layer
                // collapsible
                fold: 'open',
                layers: [
                    new ol.layer.Image({
                        // A layer must have a title to appear in the layerswitcher
                        title: 'Countries',
                        source: new ol.source.ImageArcGISRest({
                            ratio: 1,
                            params: { 'LAYERS': 'show:0' },
                            url: "https://ons-inspire.esriuk.com/arcgis/rest/services/Administrative_Boundaries/Countries_December_2016_Boundaries/MapServer"
                        })
                    }),
                    new ol.layer.Group({
                        // A layer must have a title to appear in the layerswitcher
                        title: 'Census',
                        fold: 'open',
                        layers: [
                            new ol.layer.Image({
                                // A layer must have a title to appear in the layerswitcher
                                title: 'Districts',
                                source: new ol.source.ImageArcGISRest({
                                    ratio: 1,
                                    params: { 'LAYERS': 'show:0' },
                                    url: "https://ons-inspire.esriuk.com/arcgis/rest/services/Census_Boundaries/Census_Merged_Local_Authority_Districts_December_2011_Boundaries/MapServer"
                                })
                            }),
                            new ol.layer.Image({
                                // A layer must have a title to appear in the layerswitcher
                                title: 'Wards',
                                visible: false,
                                source: new ol.source.ImageArcGISRest({
                                    ratio: 1,
                                    params: { 'LAYERS': 'show:0' },
                                    url: "https://ons-inspire.esriuk.com/arcgis/rest/services/Census_Boundaries/Census_Merged_Wards_December_2011_Boundaries/MapServer"
                                })
                            })
                        ]
                    })
                ]
            })
        ],
        view: new ol.View({
            center: ol.proj.transform([-0.92, 52.96], 'EPSG:4326', 'EPSG:3857'),
            zoom: 6
        })
    });

    var layerSwitcher = new ol.control.LayerSwitcher({
        tipLabel: 'Légende', // Optional label for button
        groupSelectStyle: 'children' // Can be 'children' [default], 'group' or 'none'
    });
    map.addControl(layerSwitcher);

    var layer_class = document.getElementsByClassName("layer");

    layerSwitcher.on('rendercomplete', function () {
        ol.control.LayerSwitcher.forEachRecursive(map, function (l, idx, a) {
            var sliders = [];
            if (l.getLayers) {
                return;
            }
            if (l.get('type') !== 'base') {
                opacitySlider(l, layer_class, sliders);
            }
        });
    });

    function opacitySlider(ol_layer, class_layers, sliders) {
        var layer_title = ol_layer.values_['title'];
        for (var i = 0, len_i = class_layers.length; i < len_i; ++i) {
            var class_elem = class_layers[i];
            var elem_name = class_layers[i].innerText;
            if (elem_name.replace('\t', '') === layer_title) {
                // create new li element
                var li_elem = document.createElement("LI");
                // create slider input elem
                var input_slider = document.createElement("INPUT");
                input_slider.setAttribute("class", "slider");
                input_slider.setAttribute("type", "range");
                input_slider.setAttribute("min", "0.0");
                input_slider.setAttribute("max", "1.0");
                input_slider.setAttribute("value", "1.0");
                input_slider.setAttribute("step", "0.1");
                // set id of slider elem to layer_title
                input_slider.setAttribute("id", layer_title);
                // add slider input to li elem
                li_elem.appendChild(input_slider);
                // add li with layer legend after layer li
                class_elem.parentNode.insertBefore(li_elem, class_elem.nextSibling);
                changeOpacity(input_slider, ol_layer);
                // push current slider into sliders array
                sliders.push(input_slider);

                break;
            }
        }
    }

    function changeOpacity(slider_elem, lyr) {
        // attach 'oninput' event to slider
        slider_elem.oninput = function () {
            if (lyr.get('title') === this.id) {
                lyr.setProperties({ opacity: this.value });
            }
        }
    }

})();
