var Scene = function() {

var JS = Elm.JavaScript;

function sceneModels(w,h,color,models) {
    var canvas = Render.newElement('canvas');
    w = ~~w;
    h = ~~h;
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
    canvas.style.display = "block";
    canvas.width  = w;
    canvas.height = h;
    if (canvas.getContext) {
        var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if(gl) {
            function redo() { renderScene(this,gl,w,h,color,models); }
            renderScene(redo,gl,w,h,color,models);
            return canvas;
        }
    }
    canvas.innerHTML = "Your browser does not support WebGL.";
    return canvas;
};

function renderScene(redo,gl,w,h,color,forms) {
    gl.viewportWidth = w;
    gl.viewportHeight = h;
    color = toFloatColor(color);
    gl.clearColor(color[1], color[2], color[3], color[4]);
    gl.enable(gl.DEPTH_TEST);

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function toFloatColor(color) {
    return ["FloatColor", color[1] / 255, color[2] / 255, color[3] / 255, color[4]];
}

function scene(w,h,color,models) {
    if (models.length === 0) { return sceneModels(w,h,color,[]); }
    return sceneModels(w,h,color,[]);
}

function insideModel(point) { return function(model) {
}}

function updateScene(node,currs,nexts) {
    return node;
}

return {scene:scene, updateScene:updateScene, insideModel:insideModel};

}();
