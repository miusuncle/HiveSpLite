function runInContext() {
  var documents = app.documents;

  // if there were no documents opened, do nothing
  if (!documents.length) { return; }

  with (app.preferences) {
    var original = rulerUnits;
    rulerUnits = Units.PIXELS;
    [].pop.call(arguments)(app.activeDocument);
    rulerUnits = original;
  }
}

function display(title, contents) {
  var parts = $.fileName.split(/(\/|\\)/);
  parts.pop();

  var dirname = parts.join('');
  var view = $.evalFile(dirname + 'view.jsx');

  var window = new Window(view);
  var output = window.findElement('output');

  window.text = title;
  output.text = contents;

  window.center();
  window.show();
}

function getSpriteContents(layers) {
  var contents = '';
  layers = [].concat(layers);

  for (var i = 0; i < layers.length; i += 1) {
    contents += getSpriteInfo(layers[i]);
  }

  return contents;
}

function getSpriteInfo(layer) {
  var layerInfo = getLayerInfo(layer);

  var x = -layerInfo.left;
  var y = -layerInfo.top;

  x = x + (x && 'px' || '');
  y = y + (y && 'px' || '');

  return vsub(cssTemplate(), {
    'selector': ('.' + layerInfo.name).toLowerCase(),
    'width': layerInfo.width + 'px',
    'height': layerInfo.height + 'px',
    'background-position': [x, y].join(' ')
  });
}

function vsub(tmpl, vector) {
  return ('' + tmpl).replace(/\$\{([^\{\}]+)\}/g, function (_, p) {
    return (vector || {})[p] || '';
  });
}

function cssTemplate() {
  return (
    '${selector} {\n' +
      '\twidth: ${width};\n' +
      '\theight: ${height};\n' +
      '\tbackground-position: ${background-position};\n' +
    '}\n\n'
  );
}

function getSpritableLayers(target) {
  var layers = target.layers;
  var result = [];

  for (var i = 0; i < layers.length; i += 1) {
    var layer = layers[i];

    switch (true) {
    case isLayerSet(layer):
      result.push.apply(result, arguments.callee(layer));
      break;
    case isLayerSpritable(layer):
      result.push(layer);
      break;
    }
  }

  return result;
}

function isLayerSpritable(layer) {
  if (!isArtLayer(layer)) {
    return false;
  }

  // reject `empty layer` and `background layer`
  if (isEmptyLayer(layer) || isBGLayer(layer)) {
    return false;
  }

  // accept `normal layer`
  if (layer.kind === LayerKind.NORMAL) {
    return true;
  }

  // accept `smart object`
  if (layer.kind === LayerKind.SMARTOBJECT) {
    return true;
  }

  return false;
}

function isLayerSet(layer) {
  return /^\[LayerSet[^\]]+\]$/.test('' + layer);
}

function isArtLayer(layer) {
  return /^\[ArtLayer[^\]]+\]$/.test('' + layer);
}

function isEmptyLayer(layer) {
  var result = getLayerInfo(layer);
  return !result.width && !result.height;
}

function isBGLayer(layer) {
  return layer.isBackgroundLayer;
}

function getLayerInfo(layer) {
  var bounds = layer.bounds;
  var left = Number(bounds[0]);
  var top = Number(bounds[1]);
  var right = Number(bounds[2]);
  var bottom = Number(bounds[3]);

  return {
    'name': layer.name.replace(/\s+/g, '-'),
    'left': left,
    'top': top,
    'width': right - left,
    'height': bottom - top
  };
}
