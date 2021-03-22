//吹き出し用オーバレイ準備
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
var popoverlay = new ol.Overlay({
element: container,
autoPan: true,
autoPanAnimation: {
    duration: 250
}
});

//吹き出し閉じる用
closer.onclick = function() {
    popoverlay.setPosition(undefined);
    closer.blur();
    return false;
};  