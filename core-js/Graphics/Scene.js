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

function renderScene(redo,gl,w,h,color,models) {
    gl.viewportWidth = w;
    gl.viewportHeight = h;
    color = toFloatColor(color);
    gl.clearColor(color[1], color[2], color[3], color[4]);
    gl.enable(gl.DEPTH_TEST);

    var buffers = initBuffers(gl,models);
    var shaders = initShaders(gl,models);
    drawScene(redo,gl,w,h,color,shaders,models);
}

function initShaders(gl,models) {
    var fragmentShader = initializeFragmentShader(gl);
    var vertexShader = initializeVertexShader(gl);
    
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        throw "Could not initialize shaders";
    }

    gl.useProgram(shaderProgram);
    
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.pMatrix = mat4.create();
    shaderProgram.mvMatrix = mat4.create();
    shaderProgram.setMatrixUniforms = function() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, shaderProgram.pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, shaderProgram.mvMatrix);
    }


    return shaderProgram;
}

function initializeFragmentShader(gl) {
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, "precision mediump float;void main(void) {gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);}");
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        throw "Could not compile default fragment shader: " + gl.getShaderInfoLog(fragmentShader);
    }
    return fragmentShader;
}

function initializeVertexShader(gl) {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, "attribute vec3 aVertexPosition;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;void main(void) {gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);}");
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        throw "Could not compile default vertex shader: " + gl.getShaderInfoLog(vertexShader);
    }
    return vertexShader;
}

function initBuffers(gl,models) {
    var buffers = []
    for(var m in models) {
        var buf = buffers[m] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        var vertices = models[m][1];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        buf.itemSize = 3;
        buf.numItems = vertices.length / buf.itemSize;
        models[m].buffer = buf;
    }
    return buffers;
}

function drawScene(redo,gl,w,h,color,shaderProgram,models) {
    // Initialize scene
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Position camera
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, shaderProgram.pMatrix);
    
    for (var m in models) {
        // Move to begin
        mat4.identity(shaderProgram.mvMatrix);
        // Do any translations
        mat4.translate(shaderProgram.mvMatrix, [-1.5, 0.0, -7.0]);
        gl.bindBuffer(gl.ARRAY_BUFFER,models[m].buffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
                               models[m].buffer.itemSize, gl.FLOAT, false, 0, 0);
        // Upload our translation to the graphics card 
        shaderProgram.setMatrixUniforms();
        // Draw this model
        gl.drawArrays(gl.TRIANGLES, 0, models[m].buffer.numItems);
    }
}

function toFloatColor(color) {
    return ["FloatColor", color[1] / 255, color[2] / 255, color[3] / 255, color[4]];
}

function scene(w,h,color,models) {
    if (models.length === 0) { return sceneModels(w,h,color,[["Model", [
         0.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0
    ]]]); }
    return sceneModels(w,h,color,[]);
}

function insideModel(point) { return function(model) {
}}

function updateScene(node,currs,nexts) {
    return node;
}

return {scene:scene, updateScene:updateScene, insideModel:insideModel};

}();
