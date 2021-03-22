var lat=[];
var lon=[];
var pl_from_gpx=[];
var info=[];
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
            //console.log("hoge");
            reader.readAsText(files[i]);
            reader.onload=function(){
                //console.log(reader.result);
                lat=reader.result.match(/lat="[0-9]+.[0-9]+"/gimu);
                //console.log(lat[1]);
                lon=reader.result.match(/lon="[0-9]+.[0-9]+"/gimu);
                //console.log(lon[1]);
                for(var j=0;j<lat.length;j++){
                    //console.log(lat[j])
                    info[0]=parseFloat(lon[j].match(/[0-9]+.[0-9]+/i));
                    info[1]=parseFloat(lat[j].match(/[0-9]+.[0-9]+/i));
                    //console.log(info)
                    pl_from_gpx[j]=info.slice();
                    //console.log(pl_from_gpx[j-1])
                }
                //console.log(pl_from_gpx);
                drawPolyline(pl_from_gpx);
            }
        }
        if((files[i].name).match(/[.]*.jpg/)){
            var gps_lon;
            var gps_lat;
            EXIF.getData(files[i], function(){
                gps_lon=EXIF.getTag(this, "GPSLongitude");
                gps_lat=EXIF.getTag(this, "GPSLatitude");
                console.log(gps_lon+"   "+gps_lat);
                console.log(typeof(gps_lat[0]));
                var g_lon=parseFloat(gps_lon[0])+parseFloat(gps_lon[1])/60+parseFloat(gps_lon[2])/3600;
                var g_lat=parseFloat(gps_lat[0])+parseFloat(gps_lat[1])/60+parseFloat(gps_lat[2])/3600;
                //マーカーの話
                var marker0;
                //1個目のマーカー：吹き出しに表示するnameを追加
                marker0 = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([g_lon,g_lat])),
                name: '<a target="_blank"><img src="sample.jpg" width="150" height="150"></a>'
                });
                var style=new ol.style.Style({
                    image: new ol.style.Icon({
                    src : "img/icon.png",
                    anchor : [0.5,1.0],
                    scale : 0.3
                    }) 
                });
                marker0.setStyle(style);

                map.addLayer(new ol.layer.Vector({source: new ol.source.Vector({
                features: [marker0]
                })}));
                console.log("描写");
            });
        }
        //console.log("hoge");
        //reader.readAsText(files[i]);
    }
}

function trans(lon_lat){
    var dobu = parseFloat(lon_lat.match(/[0-9]+/gimu));
    var byou = parseFloar(lon_lat.match(/[0-9]+.[0-9]+/gimu))
    return dobu[0]+dobu[1]*60+byou*3600
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