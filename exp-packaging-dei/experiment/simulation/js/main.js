document.addEventListener("DOMContentLoaded", () => {

    // Left Panel Cards
    const dieCard = document.getElementById("dieCard");
    const leadframeCard = document.getElementById("leadframeCard");
    const moldCard = document.getElementById("moldCard");

    // Execution Controls
    const loadWaferBtn = document.getElementById("loadWaferBtn");
    const prepareBtn = document.getElementById("prepareBtn");
    const startBtn = document.getElementById("startBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const resetBtn = document.getElementById("resetBtn");

    // Inputs Sliders
    const wireMaterial = document.getElementById("wireMaterial");
    const ultrasonicForce = document.getElementById("ultrasonicForce");
    const moldTemperature = document.getElementById("moldTemperature");
    const forceValue = document.getElementById("forceValue");
    const temperatureValue = document.getElementById("temperatureValue");

    // HUD Readings
    const processTimer = document.getElementById("processTimer");
    const instructionText = document.getElementById("instructionText");
    const pullOutput = document.getElementById("pullOutput");
    const sweepOutput = document.getElementById("sweepOutput");
    const delamOutput = document.getElementById("delamOutput");
    const statusOutput = document.getElementById("statusOutput");
    const statusBox = document.getElementById("statusBox");
    const packagingEnvelope = document.getElementById("packagingEnvelope");

    // Graphics Overlay Nodes
    const capillaryTool = document.getElementById("capillaryTool");
    const sparkGlow = document.getElementById("sparkGlow");
    const emcResinFill = document.getElementById("emcResinFill");
    const moldDiePlaceholder = document.getElementById("moldDiePlaceholder");
    const moldInternalWires = document.getElementById("moldInternalWires");
    const resinLabel = document.getElementById("resinLabel");
    const wavePath = document.getElementById("wavePath");

    const lightGreen = document.getElementById("lightGreen");
    const lightOrange = document.getElementById("lightOrange");
    const lightRed = document.getElementById("lightRed");

    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");
    const step4 = document.getElementById("step4");
    const step5 = document.getElementById("step5");

    // Application Logic Variables
    let substrateLoaded = false;
    let bonderInitialized = false;
    let packagingRunning = false;
    let packagingPaused = false;

    let countdownSeconds = 10;
    let mainSequenceTimer = null;
    let currentSequenceStep = 0;

    function activateStep(step) {
        [step1, step2, step3, step4, step5].forEach(s => s.classList.remove("active-step"));
        step.classList.add("active-step");
    }

    function setHUDLight(activeColor) {
        lightGreen.classList.remove("active");
        lightOrange.classList.remove("active");
        lightRed.classList.remove("active");
        if(activeColor === "green") lightGreen.classList.add("active");
        if(activeColor === "orange") lightOrange.classList.add("active");
        if(activeColor === "red") lightRed.classList.add("active");
    }

    ultrasonicForce.addEventListener("input", () => { forceValue.textContent = ultrasonicForce.value; });
    moldTemperature.addEventListener("input", () => { temperatureValue.textContent = moldTemperature.value; });

    function getWireColor() {
        switch(wireMaterial.value) {
            case "gold": return "var(--color-gold)";
            case "copper": return "var(--color-copper)";
            case "aluminum": return "var(--color-aluminum)";
            default: return "var(--color-gold)";
        }
    }

    // Phase 1: Substrate Loading Mechanics
    function loadDieSubstrate() {
        if(substrateLoaded) return;
        substrateLoaded = true;
        setHUDLight("orange");
        activateStep(step2);

        loadWaferBtn.disabled = true;
        prepareBtn.disabled = false;
        dieCard.style.opacity = "0.5";

        packagingEnvelope.innerHTML = `
            <div class="assembly-substrate-block">
                <div class="leadframe-plate">
                    <div class="leadframe-pin"></div><div class="leadframe-pin"></div>
                    <div class="leadframe-pin"></div><div class="leadframe-pin"></div>
                </div>
                <div class="silicon-die-node"></div>
                <svg class="wire-canvas-svg" id="wireSvgCanvas"></svg>
            </div>
        `;

        moldDiePlaceholder.classList.remove("hidden");
        moldInternalWires.style.borderColor = getWireColor();
        
        instructionText.textContent = "Initialize the automated bonding tool capillary system.";
        statusBox.innerHTML = "Silicon die singulated chuck locked onto assembly carrier platform.";
        statusOutput.textContent = "Die Attached";
        processTimer.textContent = "Substrate Loaded";
    }

    dieCard.addEventListener("click", loadDieSubstrate);
    loadWaferBtn.addEventListener("click", loadDieSubstrate);

    // Phase 2: Capillary Setup Calibration
    prepareBtn.addEventListener("click", () => {
        if(!substrateLoaded || bonderInitialized) return;
        bonderInitialized = true;
        activateStep(step3);

        prepareBtn.disabled = true;
        startBtn.disabled = false;
        leadframeCard.style.opacity = "0.5";

        capillaryTool.classList.remove("hidden");
        statusBox.innerHTML = "Capillary loop matrix calibrated. Flame-off ignition spark grids online.";
        statusOutput.textContent = "Tool Ready";
        processTimer.textContent = "Bonder Ready";
        instructionText.textContent = "Review sliders targets. Press \"Start Sorting\" to begin thermosonic stitching paths.";
    });

    // Phase 3 & 4: Automation Timeline Execution
    startBtn.addEventListener("click", () => {
        if(!substrateLoaded || !bonderInitialized || packagingRunning) return;

        packagingRunning = true;
        packagingPaused = false;
        setHUDLight("red");
        activateStep(step4);

        startBtn.disabled = true;
        pauseBtn.disabled = false;
        wireMaterial.disabled = true;
        ultrasonicForce.disabled = true;
        moldTemperature.disabled = true;

        statusOutput.textContent = "Stitching Wires";
        instructionText.textContent = "Observe active capillary wire stitch and acoustic compression loops.";
        
        countdownSeconds = 10;
        processTimer.textContent = countdownSeconds + " s";
        currentSequenceStep = 0;

        const force = parseFloat(ultrasonicForce.value);
        const temp = parseFloat(moldTemperature.value);
        const mat = wireMaterial.value;

        mainSequenceTimer = setInterval(() => {
            if(packagingPaused) return;

            currentSequenceStep++;
            
            if (currentSequenceStep <= 6) {
                animateCapillaryStitchStep(currentSequenceStep);
                countdownSeconds = Math.max(5, countdownSeconds - 1);
                processTimer.textContent = countdownSeconds + " s";
            } 
            else if (currentSequenceStep === 7) {
                statusOutput.textContent = "Injecting Resin";
                statusBox.innerHTML = "Wire loops secured. Transfer molding chamber valves opened. Injecting heated epoxy molding compound...";
                capillaryTool.classList.add("hidden");
                resinLabel.textContent = "INJECTING EMC RESIN...";
                moldCard.style.opacity = "0.5";
            } 
            else if (currentSequenceStep <= 10) {
                let fillPercentage = (currentSequenceStep - 7) / 3;
                emcResinFill.style.width = (fillPercentage * 100) + "%";
                renderDynamicShearGraph(currentSequenceStep, force);
                countdownSeconds--;
                processTimer.textContent = Math.max(0, countdownSeconds) + " s";
            } 
            else {
                clearInterval(mainSequenceTimer);
                concludePackagingAssemblyLot(force, temp, mat);
            }
        }, 900);
    });

    function animateCapillaryStitchStep(step) {
        const svgCanvas = document.getElementById("wireSvgCanvas");
        const currentColor = getWireColor();
        
        if(!svgCanvas) return;

        if (step % 2 === 1) {
            capillaryTool.style.transform = `translateX(-50%) translateY(${115 + (step * 8)}px)`;
            sparkGlow.style.opacity = "1";
            setTimeout(() => { sparkGlow.style.opacity = "0"; }, 250);
            statusBox.innerHTML = `Forming Thermosonic Joint Weld #${Math.ceil(step/2)}...`;
            renderDynamicShearGraph(step, parseFloat(ultrasonicForce.value));
        } else {
            capillaryTool.style.transform = `translateX(-50%) translateY(40px)`;
            statusBox.innerHTML = `Stitching internal wire routing loop layer #${step/2}...`;
            
            let loopIndex = step / 2;
            let pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
            
            let startX = 100 + (loopIndex * 15);
            let endX = 40 + (loopIndex * 22);
            
            pathElement.setAttribute("d", `M ${startX} 62 Q ${(startX + endX)/2} 15 ${endX} 88`);
            pathElement.setAttribute("fill", "none");
            pathElement.setAttribute("stroke", currentColor);
            pathElement.setAttribute("stroke-width", "2");
            svgCanvas.appendChild(pathElement);
        }
    }

    function renderDynamicShearGraph(step, force) {
        let baseHeight = 70 - (force / 150.0) * 35;
        if (step > 7) baseHeight = 35;
        
        let dStr = `M 0 70 L 40 70 L 60 ${baseHeight} L 80 70 L 120 70 L 140 ${baseHeight - 5} L 160 70 L 200 70`;
        if (step >= 8) {
            dStr = `M 0 70 Q 50 ${baseHeight}, 100 ${baseHeight} T 200 ${baseHeight}`;
        }
        wavePath.setAttribute("d", dStr);
        wavePath.setAttribute("stroke", "#22c55e");
    }

    function concludePackagingAssemblyLot(force, temp, mat) {
        packagingRunning = false;
        setHUDLight("green");
        activateStep(step5);

        processTimer.textContent = "Completed";
        pauseBtn.disabled = true;
        resinLabel.textContent = "ENCAPSULATION CURED";
        moldInternalWires.style.display = "block";

        let calculatedPull = (6.5 + (force / 20.0) - Math.pow(force - 65, 2) / 1100).toFixed(1);
        if (calculatedPull < 1.0) calculatedPull = 1.2;
        pullOutput.textContent = calculatedPull;

        let calculatedSweep = "Low (0.4%)";
        if (temp > 195) calculatedSweep = "High (4.8%) - Sweeping Risk";
        else if (temp < 135) calculatedSweep = "Moderate (2.1%)";
        sweepOutput.textContent = calculatedSweep;

        let delamScore = "Excellent (0.1%)";
        let isCratered = false;
        let isPopcorned = false;

        if (force > 115) { delamScore = "Poor (8.4%) [Die Cratering]"; isCratered = true; }
        else if (temp > 200) { delamScore = "Severe (14.2%) [Popcorn Burst]"; isPopcorned = true; }
        else if (force < 35 || temp < 140) { delamScore = "Marginal (4.5%) [Weak Adhesion]"; }
        delamOutput.textContent = delamScore;

        let structuralGrade = "Pass (High Reliability)";
        if (isCratered || isPopcorned) {
            structuralGrade = "Catastrophic Rejection";
            setHUDLight("red");
        } else if (parseFloat(calculatedPull) < 5.0 || temp < 145) {
            structuralGrade = "Pass (Marginal Yield)";
            setHUDLight("orange");
        }

        statusOutput.textContent = structuralGrade;
        
        if (structuralGrade === "Catastrophic Rejection") {
            statusBox.innerHTML = `<b>Process Alert: Assembly Rejection</b>\nLot failure triggered. ${isCratered ? 'Excessive ultrasonic shock cracked silicon pads (Die Cratering).' : 'Extreme curing heat triggered structural package popcorning.'}`;
        } else {
            statusBox.innerHTML = `<b>Assembly Cycle Concluded</b>\nSilicon module encapsulated successfully.\nFinal calibrated wire pull weight: <b>${calculatedPull} gf</b>`;
        }
    }

    pauseBtn.addEventListener("click", () => {
        if(!packagingRunning) return;
        packagingPaused = !packagingPaused;

        if(packagingPaused) {
            pauseBtn.textContent = "Resume";
            processTimer.textContent = "Paused";
            setHUDLight("orange");
            statusBox.innerHTML = "Assembly automation state suspended on active holding loop.";
        } else {
            pauseBtn.textContent = "Pause";
            processTimer.textContent = "Sorting...";
            setHUDLight("red");
            statusBox.innerHTML = "Resuming packaging line processing telemetry flux...";
        }
    });

    resetBtn.addEventListener("click", () => { location.reload(); });
});