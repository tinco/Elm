var Scene = function() {

var JS = Elm.JavaScript;

function sceneModels(w,h,models) {
    var canvas = Render.newElement('canvas');
    w = ~~w;
    h = ~~h;
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
    canvas.style.display = "block";
    canvas.width  = w;
    canvas.height = h;
    if (canvas.getContext) {
        var ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        function redo() { renderScene(this,ctx,w,h,models); }
        renderScene(redo,ctx,w,h,models);
        return canvas;
    }
    canvas.innerHTML = "Your browser does not support WebGL.";
    return canvas;
};

function renderScene(redo,ctx,w,h,forms) {
}

function scene(w,h,models) {
    if (models.length === 0) { return sceneModels(w,h,[]); }
    return sceneModels(w,h,[]);
}

function insideModel(point) { return function(model) {
}}

function updateScene(node,currs,nexts) {
    return node;
}

return {scene:scene, updateScene:updateScene, insideModel:insideModel};

}();
