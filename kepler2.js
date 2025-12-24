const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const header = document.getElementById("header");
const ui = document.getElementById("ui");

/* Ajuste dinámico del canvas */
function resize(){
    canvas.width = innerWidth;
    canvas.height = innerHeight - header.offsetHeight - ui.offsetHeight;
    canvas.style.position = "absolute";
    canvas.style.top = header.offsetHeight + "px";
}
addEventListener("resize", resize);
resize();

/* Controles */
const ecc = document.getElementById("ecc");
const speedSlider = document.getElementById("speed");
const eVal = document.getElementById("eVal");
const vVal = document.getElementById("vVal");

let e = +ecc.value;
let speed = +speedSlider.value;

ecc.oninput = () => {
    e = +ecc.value;
    eVal.textContent = e.toFixed(2);
};

speedSlider.oninput = () => {
    speed = +speedSlider.value;
    vVal.textContent = speed.toFixed(1);
};

/* Tamaño de la órbita: PC vs celular */
function getA(){
    let base = 240;
    if(innerWidth <= 600){
        base = 180;
    }
    return base;
}

/* Parámetros orbitales */
const months = 12;
const dM = 2*Math.PI / months;
let M0 = 0;

/* Ecuación de Kepler */
function kepler(M,e){
    let E = M;
    for(let i=0;i<8;i++){
        E -= (E - e*Math.sin(E) - M)/(1 - e*Math.cos(E));
    }
    return E;
}

/* Dibujo principal */
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    const a = getA();
    const cx = canvas.width/2;
    const cy = canvas.height/2;
    const b = a*Math.sqrt(1-e*e);
    const fx = cx + a*e;
    const fy = cy;

    /* Órbita */
    ctx.beginPath();
    ctx.strokeStyle="#5c6fd6";
    ctx.lineWidth=1.3;
    for(let t=0;t<=Math.PI*2.01;t+=0.01){
        ctx.lineTo(cx + a*Math.cos(t), cy + b*Math.sin(t));
    }
    ctx.stroke();

    /* Sol */
    ctx.beginPath();
    ctx.fillStyle="#ffb703";
    ctx.shadowColor="#ffb703";
    ctx.shadowBlur=14;
    ctx.arc(fx,fy,8,0,Math.PI*2);
    ctx.fill();
    ctx.shadowBlur=0;

    /* Rayos mensuales */
    for(let i=0;i<months;i++){
        const Ei = kepler(M0 + i*dM,e);
        ctx.beginPath();
        ctx.moveTo(fx,fy);
        ctx.lineTo(cx + a*Math.cos(Ei), cy + b*Math.sin(Ei));
        ctx.strokeStyle="rgba(90,130,255,0.3)";
        ctx.lineWidth=2;
        ctx.stroke();
    }

    /* Planeta */
    const E = kepler(M0,e);
    ctx.beginPath();
    ctx.fillStyle="#1f77ff";
    ctx.arc(cx + a*Math.cos(E), cy + b*Math.sin(E),6,0,Math.PI*2);
    ctx.fill();

    M0 += speed * 0.015;
    requestAnimationFrame(draw);
}

draw();
