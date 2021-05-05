const sizeChanger = document.getElementById('sizeChanger');
const sizeEl = document.getElementById('size');
const typeEl = document.getElementById('writeText');
const selectColorEl = document.getElementById('select-color');
const colorEl = document.getElementById('color');
const eraserEl = document.getElementById('eraser');
const eraserIcon = document.getElementById('eraser-icon');
const downloadBtn = document.getElementById('download-img');
const clearBtn = document.getElementById('clear');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let canvasColor = '#fff';
let isPressed = false;
let dragAndDraw = false;
let textWriterActive = false;
let eraserActive = false;

let size = 10;
let fontFamily = 'Arial';
let startingColor = '#000';
let color = startingColor;
let allSelectedColors = [startingColor];
let x, y;

canvas.style.backgroundColor = canvasColor;
ctx.fillStyle = canvasColor;
ctx.fillRect(0, 0, canvas.width, canvas.height);


// Disable Right Click on Canvas
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

document.body.addEventListener('mouseup', (e) => {
    isPressed = false;
    x = e.offsetX;
    y = e.offsetY;
});

['mousedown', 'click'].forEach(evt => {
    canvas.addEventListener(evt, (e) => {
        x = e.offsetX;
        y = e.offsetY;
        if(e.button === 0) {
            isPressed = true;
            
            if(evt === 'mousedown') {
                dragAndDraw = true; 
            } else if(evt === 'click') {
                dragAndDraw = false; 
            }
        }
    });
});

['mousemove', 'click'].forEach(evt => {
    canvas.addEventListener(evt, (e) => {
        const x2 = e.offsetX;
        const y2 = e.offsetY;

        if(evt === 'mousemove') {
            if(dragAndDraw && isPressed && textWriterActive===false) {
                drawCircle(x2, y2);
                drawLine(x, y, x2, y2);
                x = x2, y = y2;
            }
        }

        if(evt === 'click') {
            if(dragAndDraw===false && isPressed && textWriterActive===false) {
                drawCircle(x2, y2);
            }
        }
        
    });
});

/* Text Writer */
typeEl.addEventListener('click', () => {
    typeEl.classList.toggle('active-state');
    eraserIcon.classList.remove('active-state');
    if(typeEl.classList.contains('active-state')) {
        textWriterActive = true;
        eraserActive = false;
        color = allSelectedColors[allSelectedColors.length-1];
    }
});

const untypedKeyCodes = [12, 13, 16, 17, 18, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 46, 8, 9, 91];

document.addEventListener('keydown', (e) => {
    ctx.font = `${size * 1.5}px ${fontFamily}`;
    ctx.fillStyle = color;
    if(typeEl.classList.contains('active-state')) {
        if(!untypedKeyCodes.includes(e.keyCode)) {
            ctx.fillText(e.key, x, y);
            x += ctx.measureText(e.key).width; // add space (width of key) after each keydown.
        }
    }
});

const drawCircle = (x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fillStyle = color;
    ctx.fill();
}

const drawLine = (x1, y1, x2, y2) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 2;
    ctx.stroke();
}

/* Select & Change Color */
selectColorEl.addEventListener('click', () => {
    eraserActive = false;
    textWriterActive = false;
    typeEl.classList.remove('active-state');
    eraserIcon.classList.remove('active-state');
    colorEl.click();
    changeColor();
    if(!eraserIcon.classList.contains('active-state')) {
        color = allSelectedColors[allSelectedColors.length-1];
    }
});

const changeColor = () => {
    colorEl.addEventListener('change', (e) => {
        selectColorEl.style.backgroundColor = color;
        color = e.target.value;
        allSelectedColors.push(color);
    });
}

changeColor();

/* Change Font Size */
['click', 'mousemove'].forEach(evt => {
    sizeChanger.addEventListener(evt, () => {
        size = sizeChanger.value;
        sizeEl.innerText = size;
    });
});

/* Eraser */
eraserEl.addEventListener('click', () => {
    eraserActive = true;
    textWriterActive = false;
    eraserIcon.classList.toggle('active-state');
    typeEl.classList.remove('active-state');

    if(eraserActive && eraserIcon.classList.contains('active-state')) {
        color = canvasColor;
    } else if(allSelectedColors.length === 0) {
        color = startingColor;
    } else {
        color = allSelectedColors[allSelectedColors.length-1]; // last selected color
    }
});

/* Save Image */
downloadBtn.addEventListener('click', () => {
    const dataURI = canvas.toDataURL('image/png');
    const a  = document.createElement('a');
    document.body.appendChild(a);
    a.href = dataURI;
    a.download = `canvas-image-${Math.floor(Math.random() * 90000) + 10000}.png`;
    a.click();
});

/* Clear Canvas */
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});