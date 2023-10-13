const canvas = document.getElementById('pixelGrid');
const stateConnected = document.getElementById('state');
const ctx = canvas.getContext('2d');

const rows = canvas.width;
const columns = canvas.height;
const pixelSize = 1;

const colorInput = document.getElementById('color-input');
const setColorButton = document.getElementById('set-color-button');

const x_input = document.getElementById('x');
const y_input = document.getElementById('y');
const send_input = document.getElementById('send');

let selectedColor;

setColorButton.addEventListener('click', function() {
    selectedColor = colorInput.value;
});

send_input.addEventListener('click', function () {
   sendFromInput();
});

function sendFromInput(){
    const x = x_input.value;
    const y = y_input.value;
    sendPixel(x,y, selectedColor);
}

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

function sendPixel(x,y,color){
    const pixel = {
        x_coordinate : x,
        y_coordinate : y,
        color : color
    }

    const msg = {
        type : "PIXEL",
        data : pixel
    }

    jsonData = JSON.stringify(msg);
    conn.send(jsonData);
}

//drawGrid();

canvas.addEventListener('click', function (event){
    const x = Math.floor(event.offsetX / pixelSize);
    const y = Math.floor(event.offsetY / pixelSize);

    sendPixel(x,y,selectedColor);
});

//We use 127.0.0.1 instead of localhost because we have some problem with the web socket
let conn = new WebSocket('ws://127.0.0.1:8080');

conn.onopen = function (e){
    console.log("Connected");
    stateConnected.style.color = "green";
}

conn.onmessage = function (e){

    const jsonData = JSON.parse(e.data);

    switch (jsonData.type){
        case "GetAllData":
            for (let element in jsonData['data']) {
                const dataElement = jsonData['data'][element];
                drawPixel(dataElement.x_coordinate, dataElement.y_coordinate, dataElement.color);
            }
            break;
        case "GetCurrentData":
            //We make another parsing for get the real object value instance
            let dataElement = JSON.parse(jsonData['data']);
            drawPixel(dataElement['x_coordinate'], dataElement['y_coordinate'], dataElement['color']);
            break;
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