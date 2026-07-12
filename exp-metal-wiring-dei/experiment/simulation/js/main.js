document.addEventListener("DOMContentLoaded", () => {
    
    // Left Panel Equipment Selectors
    const equipDie = document.getElementById("equipDie");
    const equipDeposition = document.getElementById("equipDeposition");

    // Steps Pipeline Trackers
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");
    const step4 = document.getElementById("step4");
    const step5 = document.getElementById("step5");

    // Central Graphics Elements
    const wireTrace = document.getElementById("wireTrace");
    const electronFlow = document.getElementById("electronFlow");
    const liveMeterVal = document.getElementById("liveMeterVal");
    
    // Separated Sub View Targets
    const waferTop = document.getElementById("waferTop");
    const traceLineTop = document.getElementById("traceLineTop");
    const waferCross = document.getElementById("waferCross");
    const metalTrenchFill = document.getElementById("metalTrenchFill");

    const processTimer = document.getElementById("processTimer");
    const instructionText = document.getElementById("instructionText");
    const statusBox = document.getElementById("statusBox");

    // Parameters Panels
    const metalType = document.getElementById("metalType");
    const widthSlider = document.getElementById("widthSlider");
    const thicknessSlider = document.getElementById("thicknessSlider");
    const widthValue = document.getElementById("widthValue");
    const thicknessValue = document.getElementById("thicknessValue");

    // Output Diagnostic Nodes
    const outResistance = document.getElementById("outResistance");
    const outConductivity = document.getElementById("outConductivity");
    const outQuality = document.getElementById("outQuality");
    const outFlow = document.getElementById("outFlow");

    // HUD LED Indicators
    const lightGreen = document.getElementById("lightGreen");
    const lightOrange = document.getElementById("lightOrange");
    const lightRed = document.getElementById("lightRed");

    // Interactive Action Buttons
    const btnLoadDie = document.getElementById("btnLoadDie");
    const btnRouteMetal = document.getElementById("btnRouteMetal");
    const btnStartWiring = document.getElementById("btnStartWiring");
    const btnPause = document.getElementById("btnPause");
    const btnReset = document.getElementById("btnReset");

    let dieLoaded = false;
    let materialRouted = false;
    let processActive = false;
    let isPaused = false;
    let processComplete = false;

    let countdownTimer = 10; 
    let runInterval = null;

    const materialResistivity = { aluminum: 2.82, copper: 1.68, tungsten: 5.60 };
    const materialConductivity = { aluminum: 35.4, copper: 59.6, tungsten: 17.8 };
    const materialHexColor = { aluminum: "#cbd5e1", copper: "#ea580c", tungsten: "#78716c" };

    function updateStepTracker(activeStepNum) {
        [step1, step2, step3, step4, step5].forEach((elem, idx) => {
            if (idx + 1 === activeStepNum) elem.classList.add("active-step");
            else elem.classList.remove("active-step");
        });
    }

    function setHUDLight(state) {
        [lightGreen, lightOrange, lightRed].forEach(l => l.classList.remove("active"));
        if (state === "green") lightGreen.classList.add("active");
        if (state === "orange") lightOrange.classList.add("active");
        if (state === "red") lightRed.classList.add("active");
    }

    function calculateElectricalMatrix(currentFraction = 1.0) {
        let width = parseFloat(widthSlider.value);
        let thickness = parseFloat(thicknessSlider.value);
        let selection = metalType.value;

        let crossSectionArea = (width * thickness) / 1000; 
        let baseLineLength = 120; 
        
        let targetResistance = (materialResistivity[selection] * (baseLineLength / crossSectionArea)).toFixed(2);
        
        if (dieLoaded) {
            let mappedWidth = (width / 500) * 22 + 4; 
            let mappedHeight = (thickness / 1000) * 25 + 5;
            wireTrace.style.height = mappedHeight + "px";
            wireTrace.style.borderWidth = (mappedWidth / 6) + "px";
            
            let topLineWidth = (width / 500) * 40 + 2; 
            traceLineTop.style.height = topLineWidth + "px";

            let crossFillWidth = (width / 500) * 50 + 4;
            let crossFillHeight = (thickness / 1000) * 45 + 5;
            
            metalTrenchFill.style.width = crossFillWidth + "px";
            metalTrenchFill.style.left = (90 - (crossFillWidth / 2)) + "px"; 

            if (materialRouted) {
                let trackColor = materialHexColor[selection];
                
                wireTrace.style.backgroundColor = trackColor;
                wireTrace.style.borderColor = adjustHexBrightness(trackColor, -25);

                traceLineTop.style.backgroundColor = trackColor;

                metalTrenchFill.style.backgroundColor = trackColor;
                metalTrenchFill.style.height = (crossFillHeight * currentFraction) + "px";
            }
        }

        return {
            resistance: targetResistance,
            conductivity: materialConductivity[selection]
        };
    }

    function adjustHexBrightness(hex, percent) {
        let R = parseInt(hex.substring(1,3),16);
        let G = parseInt(hex.substring(3,5),16);
        let B = parseInt(hex.substring(5,7),16);
        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);
        R = (R<255)?R:255; G = (G<255)?G:255; B = (B<255)?B:255;
        let rHex = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        let gHex = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        let bHex = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
        return "#"+rHex+gHex+bHex;
    }

    widthSlider.addEventListener("input", () => {
        widthValue.textContent = widthSlider.value;
        calculateElectricalMatrix();
    });
    thicknessSlider.addEventListener("input", () => {
        thicknessValue.textContent = thicknessSlider.value;
        calculateElectricalMatrix();
    });
    metalType.addEventListener("change", () => {
        calculateElectricalMatrix();
    });


    btnLoadDie.addEventListener("click", () => {
        if (dieLoaded) return;

        dieLoaded = true;
        setHUDLight("orange");
        updateStepTracker(2);

        equipDie.classList.add("card-disabled");
        equipDie.querySelector(".status-badge").className = "status-badge state-active";
        equipDie.querySelector(".status-badge").textContent = "Loaded";

        wireTrace.style.display = "block"; 
        waferTop.style.display = "block";
        waferCross.style.display = "block";

        btnLoadDie.disabled = true;
        btnLoadDie.classList.add("btn-locked");
        btnRouteMetal.disabled = false;
        btnRouteMetal.classList.remove("btn-locked");

        calculateElectricalMatrix(0); 

        statusBox.innerHTML = "<b>WHAT HAPPENED:</b> Loaded a silicon block containing lower-level transistor houses. Right now, empty insulating oxide trenches sit on top of them, awaiting a metal layer connection channel path.";
        instructionText.textContent = "Substrate ready. Click \"Route Material\" to select your metal type.";
    });


    btnRouteMetal.addEventListener("click", () => {
        if (!dieLoaded || materialRouted) return;

        materialRouted = true;
        setHUDLight("green");
        updateStepTracker(3);

        equipDeposition.classList.add("card-disabled");
        equipDeposition.querySelector(".status-badge").className = "status-badge state-active";
        equipDeposition.querySelector(".status-badge").textContent = "Routed";

        btnRouteMetal.disabled = true;
        btnRouteMetal.classList.add("btn-locked");
        btnStartWiring.disabled = false;
        btnStartWiring.classList.remove("btn-locked");

        let stats = calculateElectricalMatrix(0);
        outConductivity.textContent = stats.conductivity;

        statusBox.innerHTML = `<b>WHAT HAPPENED:</b> Selected ${metalType.value.toUpperCase()} as the deposition target source. The browser mapped the intrinsic structural resistivity profile. Notice that cross-section trenches are still empty and non-conductive.`;
        instructionText.textContent = "Track mapped. Set your wire Width and Thickness sliders, then click \"Deposit Track\".";
    });

    btnStartWiring.addEventListener("click", () => {
        if (!materialRouted || processActive || processComplete) return;

        processActive = true;
        isPaused = false;
        setHUDLight("red");
        updateStepTracker(4);

        btnStartWiring.disabled = true;
        btnStartWiring.classList.add("btn-locked");
        btnPause.disabled = false;
        btnPause.classList.remove("btn-locked");

        [widthSlider, thicknessSlider, metalType].forEach(input => input.disabled = true);
        
        processTimer.textContent = `Time Remaining: ${countdownTimer}s`;
        let metrics = calculateElectricalMatrix(0);

        runInterval = setInterval(() => {
            if (isPaused) return;

            countdownTimer--;
            processTimer.textContent = `Time Remaining: ${countdownTimer}s`;

            let stepsFrac = (10 - countdownTimer) / 10;
            calculateElectricalMatrix(stepsFrac);

            let currentLiveResistance = (metrics.resistance * stepsFrac).toFixed(2);
            liveMeterVal.textContent = currentLiveResistance;

            statusBox.innerHTML = `<b>WHAT IS HAPPENING NOW:</b> High-energy atoms are hitting the target area in a vacuum. Metal is filling the insulating trenches from the bottom up. As the metal layer grows, the resistance decreases because the pathway is widening.`;

            if (countdownTimer <= 0) {
                finalizeMetallization(metrics);
            }
        }, 1000);
    });

    function finalizeMetallization(finalMetrics) {
        clearInterval(runInterval);
        processActive = false;
        processComplete = true;

        setHUDLight("green");
        updateStepTracker(5);
        processTimer.textContent = "Process Step Complete";

        btnPause.disabled = true;
        btnPause.classList.add("btn-locked");

        electronFlow.classList.add("flow-active");

        outResistance.textContent = finalMetrics.resistance;
        liveMeterVal.textContent = finalMetrics.resistance;

        let width = parseFloat(widthSlider.value);
        let thickness = parseFloat(thicknessSlider.value);

        let qualityScore = 100;
        if (width < 120) qualityScore -= 15; 
        if (thickness < 250) qualityScore -= 15; 

        let qualityGrade = "Excellent";
        if (qualityScore < 75) qualityGrade = "Fair (High Resistance Defect Hazard)";
        else if (qualityScore < 90) qualityGrade = "Good";
        
        outQuality.textContent = `${qualityScore}% (${qualityGrade})`;

        let flowEase = "Optimal Efficiency";
        if (finalMetrics.resistance > 5.0) flowEase = "Highly Restricted Flow";
        else if (finalMetrics.resistance > 2.5) flowEase = "Moderate Impedance Flow";
        outFlow.textContent = flowEase;

        statusBox.innerHTML = `<b>FINAL CONCLUDING OUTCOME:</b> The metal line has completely filled the trenches to form an interconnected electronic circuit network. White arrows represent electrons flowing smoothly over the paths. Notice that a smaller cross-section area increases line resistance.`;
        instructionText.textContent = "Simulation completed successfully! Review your output metrics, or click \"Reset\" to clear fields.";
    }

    btnReset.addEventListener("click", () => {
        if (runInterval) clearInterval(runInterval);
        location.reload();
    });
});