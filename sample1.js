var map=null;
var markerLayer=null;
var PolylineLayer=null;
var markerdata=null;
var polylinedata=null;
var polygondata=null;

$.getJSON("marker.json",function(data){
    markerdata=data;
});

$.getJSON("polyline.json",function(data){
    polylinedata=data;
});

$.getJSON("polygon.json",function(data){
    polygondata=data;
});

var tiriLayer=new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png'
    })
  });
/*
var coordinates = [
    [139.75655240134424, 35.6553463380788],
    [139.75648388462506, 35.65504941783402],
    [139.75593575087174, 35.65512364799868],
    [139.75573020071425, 35.654585477741634],
    [139.7550450335226, 35.65467826597572],
    [139.7544512219565, 35.65473393886441],
    [139.75390308820317, 35.65482672692599],
    [139.75349198788817, 35.65477105410197],
    [139.75305804866682, 35.65484528452539],
    [139.752715465071, 35.65491951487979],
    [139.75280682069655, 35.65696082259022],
    [139.75040873552575, 35.65722062164694],
    [139.75040361339467, 35.65783126326163],
    [139.74689841726482, 35.65818210512349],
    [139.74705081709652, 35.65853294544405],
    [139.74578081849876, 35.659007609306684]
]

var coordinatesg=[
    [[ 139.71005104383386 , 35.68179658276378 ] ,
    [ 139.70794819196615 , 35.68287719820597 ] ,
    [ 139.70575950941003 , 35.683992656859445 ] ,
    [ 139.70502994855795 , 35.68472466812544 ] ,
    [ 139.70434330305017 , 35.68608409980037 ] ,
    [ 139.70485828718103 , 35.687548077236144 ] ,
    [ 139.70584534009848 , 35.68824519990561 ] ,
    [ 139.70726154645834 , 35.688384623708416 ] ,
    [ 139.70837734540856 , 35.68824519990561 ],
    [ 139.7091927369491 , 35.68747836463413 ],
    [ 139.71082352003012 , 35.68719951361685 ] ,
    [ 139.71189640363608 , 35.68712980071024 ] ,
    [ 139.71331260999597 , 35.68702523123605 ] ,
    [ 139.71357010206137 , 35.68643266829335 ] ,
    [ 139.71408508619226 , 35.68573552978438 ] ,
    [ 139.71455715497885 , 35.68500352779341 ] ,
    [ 139.71455715497885 , 35.68423666136103 ] ,
    [ 139.7144713242904 , 35.68427151908605 ] ,
    [ 139.7150292237655 , 35.68353950366236 ] ,
    [ 139.7154154618636 , 35.683016631390515 ] ,
    [ 139.71464298566735 , 35.68197087656698 ] ,
    [ 139.7137846787826 , 35.68158742969743 ] ,
    [ 139.71241138776693 , 35.68137827608278 ] ,
    [ 139.71005104383386 , 35.68179658276378 ]]
]*/

function loadMap(){
    try{
        //マップの作成
        map=new ol.Map({
            target: 'map', 
            layers: [new ol.layer.Tile({source: new ol.source.OSM()})],
            controls: ol.control.defaults({
                attributionOptions: {
                collapsible: false//折り畳みを無効
                }
            }),
            overlays: [popoverlay],
            view: new ol.View({
                center: ol.proj.fromLonLat([139.745433,35.658581]), //(4)
                zoom: 4 //(5)
            })//見える場所、初期位置
        });  

        /*
        //ポリラインを乗せるためのレイヤーを作成する
        PolylineLayer=new ol.layer.Vector({
            source: new ol.source.Vector()
        });
        map.addLayer(PolylineLayer);
        */

        document.getElementById('osm').onclick=function(){
            var layer=new ol.layer.Tile({
                source: new ol.source.OSM() // (3)
            })

            map.setLayerGroup(new ol.layer.Group ());
            map.addLayer(layer);
        }

        document.getElementById('tiri').onclick=function(){
            map.setLayerGroup(new ol.layer.Group ());
            map.addLayer(tiriLayer);
        }
        /*
        document.getElementById('poly').onclick=function(){
            drawMarker("TokyoTower");
            drawPolyline();
            drawPolygon();
        }*/

        //マーカーの話
        var marker0=[];
        //1個目のマーカー：吹き出しに表示するnameを追加
        marker0[0] = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([139.692,35.689])),
        name: '<a href="http://www.metro.tokyo.jp/" target="_blank">Tokyo</a>'
        });

        var style=new ol.style.Style({
            image: new ol.style.Icon({
            src : "img/icon.png",
            anchor : [0.5,1.0],
            scale : 0.3
            }) 
        });
        marker0[0].setStyle(style);

        map.addLayer(new ol.layer.Vector({source: new ol.source.Vector({
        features: [marker0[0]]
        })}));
        console.log("描写");
        //吹き出しを表示するためのクリックイベント
        map.on('click', function(evt) {
            var feature = map.forEachFeatureAtPixel(evt.pixel,function(feature) {return feature;});
            if (feature) {
                content.innerHTML = '<p>'+feature.get('name')+ '</p>';
                var coordinate = feature.getGeometry().getCoordinates();
                popoverlay.setPosition(coordinate);
            }
            });
                }catch(e){
                    console.log(e);
                }
            }

function drawMarker(string){
    //マーカーの表示（レイヤー追加）
    var i;
    for(i=0;i<Object.keys(markerdata).length-1;i++){
        if(string==markerdata[i].name){
            break;
        }
    }

    //地理情報オブジェクトを作成（1）
    var featurearray =new Array(markerdata[i].coordinates.length);
    console.log(featurearray.length);
    for(var j=0;j<markerdata[i].coordinates.length;j++){
        var feature=new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat(markerdata[i].coordinates[j])),
            name: markerdata[i].name
        });
        featurearray[j]=feature;
    }

    //マーカーの見た目の設定（2）
    var style=new ol.style.Style({
        image: new ol.style.Icon({
            src: markerdata[i].src,
            anchor: markerdata[i].anchor,
            scale: markerdata[i].scale
        })
    });
    for(var j=0;j<featurearray.length;j++){
        featurearray[j].setStyle(style);//featureのスタイル設定
    }

    //レイヤーを作成してマップに追加する（3）
    markerLayer=new ol.layer.Vector({ 
        source: new ol.source.Vector({features: featurearray})
    });
    map.addLayer(markerLayer);
}

function drawPolyline(pl){
    console.log("drawing");
    if(pl===undefined){
        pl=coordinates
    }
    //ジオメトリの作成(1)
    var lineStrings=new ol.geom.LineString([]);
    lineStrings.setCoordinates(pl);

    //地物オブジェクトの作成(2)
    var feature=new ol.Feature(
        lineStrings.transform('EPSG:4326','EPSG:3857')
    );

    var vector=new ol.source.Vector({
        features: [feature]
    });

    //レイヤーの作成(3)
    var routeLayer=new ol.layer.Vector({
        source: vector,
        style: new ol.style.Style({
            stroke:new ol.style.Stroke({ color: '#ff33ff',width: 5})
        })
    });

    //作成したポリラインをレイヤーにのせる
    map.addLayer(routeLayer);
    console.log("drew");
}

function drawPolygon(){
    //ジオメトリの作成
    var polygon=new ol.geom.Polygon([]);
    polygon.setCoordinates(coordinatesg);

    //地物オブジェクトの作成 ~ レイヤーの作成
    var feature=new ol.Feature(
        polygon.transform('EPSG:4326','EPSG:3857')
    );

    var vector=new ol.source.Vector({
        features: [feature]
    });
    var routeLayer=new ol.layer.Vector({
        source: vector,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({color: '#000000',width: 5}),
            fill: new ol.style.Fill({color:[0,0,0,0.5]})
        })
    });

    map.addLayer(routeLayer);
}

/*
var lat=[];
var lon=[];
var pl_from_gpx=[];
function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files;
    var reader=new FileReader();
    var output = [];
    for (var i = 0; i < files.length; i++) {
        document.getElementById('output').innerHTML += files[i].name + '(' + files[i].size + ') '
            + files[i].lastModifiedDate.toLocaleDateString() + files[i].lastModifiedDate.toLocaleTimeString() +  ' - ' + files[i].type + '<br/>';
        if((files[i].name).match(/[.]*.gpx/)){
            reader.onload=function(){
                lat=reader.result.match(/lat="[0-9]+.[0-9]+"/gimu);
                console.log(lat[0]);
                lon=reader.result.match(/lon="[0-9]+.[0-9]+"/gimu);
                console.log(lon[0]);
                for(var j=0;j<lat.length;j++){
                    var info=[];
                    info[0]=parseFloat(lon[j].match(/[0-9]+.[0-9]+/i));
                    info[1]=parseFloat(lat[j].match(/[0-9]+.[0-9]+/i));
                    pl_from_gpx[j]=info;
                }
                console.log(pl_from_gpx);
                drawPolyline(pl_from_gpx);
            }
            console.log("hoge");
            reader.readAsText(files[i]);
        }
    }
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
}

function PageLoad(evt) {
    var dropFrame = document.getElementById('DropFrame');
    dropFrame.addEventListener('dragover', handleDragOver, false);
    dropFrame.addEventListener('drop', handleFileSelect, false);
}
*/
