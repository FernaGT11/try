function simular() {
    const caras = parseInt(document.getElementById("caras").value);
    const n = parseInt(document.getElementById("lanzamientos").value);

    if (caras < 2 || caras > 10 || n < 1 || n > 1000) return;

    const datos = [];
    const frecuencias = Array(caras).fill(0);

    // Simulación aleatoria real
    for (let i = 0; i < n; i++) {
        const r = Math.floor(Math.random() * caras) + 1;
        datos.push(r);
        frecuencias[r - 1]++;
    }

    datos.sort((a, b) => a - b);

    mostrarEstadisticas(datos, frecuencias);
    dibujarGrafico(frecuencias);
    llenarTabla(frecuencias);
}

function mostrarEstadisticas(datos, f) {
    const n = datos.length;

    const media = datos.reduce((a, b) => a + b, 0) / n;

    let mediana;
    if (n % 2 === 0) {
        mediana = (datos[n / 2 - 1] + datos[n / 2]) / 2;
    } else {
        mediana = datos[Math.floor(n / 2)];
    }

    const maxF = Math.max(...f);
    const moda = f
        .map((v, i) => v === maxF ? i + 1 : null)
        .filter(v => v !== null);

    const ul = document.getElementById("estadisticas");
    ul.innerHTML = `
        <li><strong>Media:</strong> ${media.toFixed(2)}</li>
        <li><strong>Mediana:</strong> ${mediana}</li>
        <li><strong>Moda:</strong> ${moda.join(", ")}</li>
    `;
}

function dibujarGrafico(f) {
    const canvas = document.getElementById("grafico");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const max = Math.max(...f);
    const ancho = canvas.width / f.length;

    f.forEach((valor, i) => {
        const h = (valor / max) * (canvas.height - 20);

        ctx.fillStyle = "#3498db";
        ctx.fillRect(
            i * ancho + 10,
            canvas.height - h - 10,
            ancho - 20,
            h
        );

        ctx.fillStyle = "#000";
        ctx.fillText(i + 1, i * ancho + ancho / 2, canvas.height - 2);
    });
}

function llenarTabla(f) {
    const tbody = document.querySelector("#tabla tbody");
    tbody.innerHTML = "";

    f.forEach((valor, i) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${i + 1}</td>
            <td>${valor}</td>
        `;
        tbody.appendChild(fila);
    });
}
