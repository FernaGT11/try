function simular() {
    const dados = Number(document.getElementById("dados").value);
    const caras = Number(document.getElementById("caras").value);
    const lanzadas = Number(document.getElementById("lanzadas").value);

    if (
        dados < 1 || dados > 20 ||
        caras < 2 || caras > 10 ||
        lanzadas < 1 || lanzadas > 100
    ) {
        alert("Valores fuera de rango");
        return;
    }

    const sumas = [];

    // Simulación principal
    for (let i = 0; i < lanzadas; i++) {
        let suma = 0;
        for (let j = 0; j < dados; j++) {
            suma += Math.floor(Math.random() * caras) + 1;
        }
        sumas.push(suma);
    }

    sumas.sort((a, b) => a - b);

    mostrarEstadisticas(sumas);
    dibujarGrafico(sumas);
    llenarTabla(sumas);
}

function mostrarEstadisticas(datos) {
    const n = datos.length;
    const media = datos.reduce((a, b) => a + b, 0) / n;

    const mediana = n % 2 === 0
        ? (datos[n / 2 - 1] + datos[n / 2]) / 2
        : datos[Math.floor(n / 2)];

    const frecuencias = {};
    datos.forEach(v => frecuencias[v] = (frecuencias[v] || 0) + 1);

    const maxF = Math.max(...Object.values(frecuencias));
    const moda = Object.keys(frecuencias)
        .filter(k => frecuencias[k] === maxF)
        .join(", ");

    document.getElementById("estadisticas").innerHTML = `
        <li><strong>Media:</strong> ${media.toFixed(2)}</li>
        <li><strong>Mediana:</strong> ${mediana}</li>
        <li><strong>Moda:</strong> ${moda}</li>
    `;
}

function dibujarGrafico(datos) {
    const canvas = document.getElementById("grafico");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const frecuencias = {};
    datos.forEach(v => frecuencias[v] = (frecuencias[v] || 0) + 1);

    const valores = Object.keys(frecuencias);
    const max = Math.max(...Object.values(frecuencias));
    const ancho = canvas.width / valores.length;

    valores.forEach((v, i) => {
        const h = (frecuencias[v] / max) * (canvas.height - 30);

        ctx.fillStyle = "#3498db";
        ctx.fillRect(
            i * ancho + 5,
            canvas.height - h - 10,
            ancho - 10,
            h
        );

        ctx.fillStyle = "black";
        ctx.fillText(v, i * ancho + ancho / 2, canvas.height - 2);
    });
}

function llenarTabla(datos) {
    const tbody = document.querySelector("#tabla tbody");
    tbody.innerHTML = "";

    datos.forEach((suma, i) => {
        tbody.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${suma}</td>
            </tr>
        `;
    });
}
