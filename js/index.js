const canvas = document.getElementById('pixelGrid');
const stateConnected = document.getElementById('state');
const ctx = canvas.getContext('2d');

const rows = canvas.width;
const columns = canvas.height;
const pixelSize = 10;

function drawGrid(){
    for(let row = 0; row < rows; row++){
        for(let col = 0; col < columns; col++){
            const x = col * pixelSize;
            const y = row * pixelSize;
            ctx.strokeRect(x,y,pixelSize,pixelSize);
        }
    }
}

function drawPixel(x,y, color){
    ctx.fillStyle = color;
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
}

drawGrid();

canvas.addEventListener('click', function (event){
    const x = Math.floor(event.offsetX / pixelSize);
    const y = Math.floor(event.offsetY / pixelSize);

    drawPixel(x,y, 'FF0000');
});

//We use 127.0.0.1 instead of localhost because we have some problem with the web socket
let conn = new WebSocket('ws://127.0.0.1:8080');

conn.onopen = function (e){
    console.log("Connected");
    stateConnected.style.color = "green";
}

conn.onmessage = function (e){
    const jsonData = JSON.parse(e.data);
    for (let element of jsonData) {
        drawPixel(element.x_coordinate, element.y_coordinate, element.color);
    }
}

conn.onerror = function (e){
    console.log(e);
    stateConnected.innerText = "Error"
    stateConnected.style.color = "red";
}

conn.onclose = function (e){
    console.log(e);
    stateConnected.innerText = "Disconnected"
    stateConnected.style.color = "red";
}