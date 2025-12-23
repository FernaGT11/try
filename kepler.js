const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const container = document.getElementById("sim-container");

function resize() {
    const dpr = window.devicePixelRatio || 1;

    const rect = container.getBoundingClientRect();

    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width  = rect.width + "px";
    canvas.style.height = rect.height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

addEventListener("resize", resize);
resize();

// UI
const eccSlider = document.getElementById("ecc");
const speedSlider = document.getElementById("speed");
const eVal = document.getElementById("eVal");
const vVal = document.getElementById("vVal");

let e = +eccSlider.value;
let speed = +speedSlider.value;

eccSlider.oninput = () => {
    e = +eccSlider.value;
    eVal.textContent = e.toFixed(2);
};

speedSlider.oninput = () => {
    speed = +speedSlider.value;
    vVal.textContent = speed.toFixed(1);
};

// Parámetros orbitales
const a = 240;
const months = 12;
const dM = 2 * Math.PI / months;
let M = 0;

// Ecuación de Kepler
function kepler(M, e) {
    let E = M;
    for (let i = 0; i < 7; i++) {
        E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    }
    return E;
}

function drawOrbit(cx, cy, b) {
    ctx.beginPath();
    ctx.strokeStyle = "#5b7bb2";
    ctx.lineWidth = 1.4;
    for (let t = 0; t <= Math.PI * 2.01; t += 0.01) {
        ctx.lineTo(cx + a * Math.cos(t), cy + b * Math.sin(t));
    }
    ctx.stroke();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const b = a * Math.sqrt(1 - e * e);

    const fx = cx + a * e;
    const fy = cy;

    drawOrbit(cx, cy, b);

    // Sol
    ctx.beginPath();
    ctx.fillStyle = "#ffb703";
    ctx.shadowColor = "#ffb703";
    ctx.shadowBlur = 30;
    ctx.arc(fx, fy, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Sectores mensuales
    for (let i = 0; i < months; i++) {
        const Mi = M - i * dM;
        const Ei = kepler(Mi, e);

        const px = cx + a * Math.cos(Ei);
        const py = cy + b * Math.sin(Ei);

        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(px, py);
        ctx.strokeStyle = "rgba(70,130,200,0.35)";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Planeta
    const E = kepler(M, e);
    const px = cx + a * Math.cos(E);
    const py = cy + b * Math.sin(E);

    ctx.beginPath();
    ctx.fillStyle = "#1f7ae0";
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();

    M += speed * 0.015;
    requestAnimationFrame(draw);
}

draw();
