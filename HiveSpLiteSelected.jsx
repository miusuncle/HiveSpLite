/*
  <javascriptresource>
    <name>Hive SpLite Selected</name>
    <menu>filter</menu>
    <enableinfo>true</enableinfo>
  </javascriptresource>
*/

#include 'HiveSpLiteOnly/common.jsx'

!(function () {
  runInContext([].pop.call(arguments));
}).call(this, function (doc) {
  var layer = doc.activeLayer;
  var spritableLayers = [];

  switch (true) {
  case isLayerSet(layer):
    spritableLayers = getSpritableLayers(layer);
    break;
  case isLayerSpritable(layer):
    spritableLayers = [layer];
    break;
  }

  // no spritable layers, do nothing
  if (!spritableLayers.length) {
    return;
  }

  var contents = getSpriteContents(spritableLayers);
  display('Hive SpLite Selected', contents);
});
