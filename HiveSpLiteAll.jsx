/*
  <javascriptresource>
    <name>Hive SpLite All</name>
    <menu>filter</menu>
    <enableinfo>true</enableinfo>
  </javascriptresource>
*/

#include 'HiveSpLiteOnly/common.jsx'

!(function () {
  runInContext([].pop.call(arguments));
}).call(this, function (doc) {
  var spritableLayers = getSpritableLayers(doc);

  // no spritable layers, do nothing
  if (!spritableLayers.length) {
    return;
  }

  var contents = getSpriteContents(spritableLayers);
  display('Hive SpLite All', contents);
});
