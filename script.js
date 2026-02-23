var hoveredEvent = null;
for (var i of document.querySelectorAll(".event")) {
    addTilt3D(i);
}
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
function roundPlaces(value, places) {
    return Math.floor(value * places) / places
}
function addTilt3D(el, options = {}) {
    const { 
        maxTilt = 10,
        scale = 1.02,
        perspective = 10000,
        ease = 0.08,
        maxFloat = 10000
    } = options;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let currentShadowX = 0;
    let currentShadowY = 0;
    let targetShadowX = 0;
    let targetShadowY = 0;
    let targetShadowTrans = 0;
    let currentShadowTrans = 0;
    let hovering = false;

    el.style.transformStyle = "preserve-3d";
    el.style.willChange = "transform, box-shadow";
    function animate() {
        currentX += roundPlaces(((targetX - currentX) * ease), maxFloat);
        currentY += roundPlaces(((targetY - currentY) * ease), maxFloat);

        currentX = clamp(currentX, -maxTilt, maxTilt);
        currentY = clamp(currentY, -maxTilt, maxTilt);

        currentShadowX += roundPlaces(((targetShadowX - currentShadowX) * ease), maxFloat);
        currentShadowY += roundPlaces(((targetShadowY - currentShadowY) * ease), maxFloat);

        currentShadowTrans += roundPlaces(((targetShadowTrans - currentShadowTrans) * ease), maxFloat * 100)

        el.style.transform = `
    perspective(${perspective}px)
    rotateX(${currentX}deg)
    rotateY(${currentY}deg)
    scale(${hovering ? scale : 1})
  `;

        el.style.boxShadow = `
    ${currentShadowX}px
    ${currentShadowY}px
    30px rgba(0,0,0,${currentShadowTrans})
  `;

        el.style.scale = hovering ? scale : 1

        requestAnimationFrame(animate);
    }


    animate();

    el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        targetX = ((y - centerY) / centerY) * -maxTilt;
        targetY = ((x - centerX) / centerX) * maxTilt;

        targetShadowX = -targetY * 2 * (8000/perspective);
        targetShadowY = currentX * 2 * (8000/perspective);

        hovering = true;
    });

    el.addEventListener("mouseenter", () => {
        targetShadowTrans = 0.35;
        hovering = true;
    });

    el.addEventListener("mouseleave", () => {
        targetX = 0;
        targetY = 0;

        targetShadowX = 0;
        targetShadowY = 0;
        targetShadowTrans = 0;

        hovering = false;
    });
}