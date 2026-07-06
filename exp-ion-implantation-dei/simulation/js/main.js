document.addEventListener("DOMContentLoaded", () => {
    
    // Left Panel Equipment Tray Selectors
    const equipWafer = document.getElementById("equipWafer");
    const equipSource = document.getElementById("equipSource");
    const equipAnalyzer = document.getElementById("equipAnalyzer");
    const equipColumn = document.getElementById("equipColumn");

    // Center Panel Functional Interactives
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");
    const step4 = document.getElementById("step4");
    const step5 = document.getElementById("step5");

    const magnetChamber = document.getElementById("magnetChamber");
    const columnChamber = document.getElementById("columnChamber");
    const plasmaGlow = document.getElementById("plasmaGlow");
    const ionBeam = document.getElementById("ionBeam");
    
    const waferTop = document.getElementById("waferTop");
    const waferCross = document.getElementById("waferCross");
    const dopantProfile = document.getElementById("dopantProfile");
    
    const processTimer = document.getElementById("processTimer");
    const instructionText = document.getElementById("instructionText");
    const statusBox = document.getElementById("statusBox");

    // Right Parameters Panel Inputs
    const dopantType = document.getElementById("dopantType");
    const energySlider = document.getElementById("energySlider");
    const doseSlider = document.getElementById("doseSlider");
    const timeSlider = document.getElementById("timeSlider");

    const energyValue = document.getElementById("energyValue");
    const doseValue = document.getElementById("doseValue");
    const timeValue = document.getElementById("timeValue");

    // Diagnostic Readouts Targets
    const outDepth = document.getElementById("outDepth");
    const outResistance = document.getElementById("outResistance");
    const outUniformity = document.getElementById("outUniformity");
    const outQuality = document.getElementById("outQuality");

    // Safety Lights HUD Links
    const lightGreen = document.getElementById("lightGreen");
    const lightOrange = document.getElementById("lightOrange");
    const lightRed = document.getElementById("lightRed");
    const hvHazardTag = document.getElementById("hvHazardTag");

    // Action Control Keys
    const btnLoadWafer = document.getElementById("btnLoadWafer");
    const btnPrepareSource = document.getElementById("btnPrepareSource");
    const btnStartImplant = document.getElementById("btnStartImplant");
    const btnPause = document.getElementById("btnPause");
    const btnReset = document.getElementById("btnReset");

    let waferLoaded = false;
    let sourcePrepared = false;
    let implantationActive = false;
    let isPaused = false;
    let simulationComplete = false;

    let totalDuration = 10;
    let timeRemaining = 10;
    let executionInterval = null;
    let growthProgressPercent = 0; 

    const StoppingIndices = { boron: 3.1, phosphorus: 1.8, arsenic: 1.1 };
    const ResistanceBaselines = { boron: 450, phosphorus: 280, arsenic: 190 };

    // Slider Sync Listeners
    energySlider.addEventListener("input", () => {
        energyValue.textContent = energySlider.value;
        if (!implantationActive && !simulationComplete) calculateStaticPreview();
    });
    doseSlider.addEventListener("input", () => {
        let rawExponent = parseFloat(doseSlider.value);
        let numericBase = Math.pow(10, rawExponent - Math.floor(rawExponent)).toFixed(1);
        doseValue.innerHTML = `${numericBase} &times; 10<sup>${Math.floor(rawExponent)}</sup>`;
        if (!implantationActive && !simulationComplete) calculateStaticPreview();
    });
    timeSlider.addEventListener("input", () => {
        timeValue.textContent = timeSlider.value;
        if (!implantationActive) {
            totalDuration = parseInt(timeSlider.value);
            timeRemaining = totalDuration;
            processTimer.textContent = `Time: ${timeRemaining}s`;
        }
    });

    function updateStepTracker(activeStepNum) {
        [step1, step2, step3, step4, step5].forEach((elem, index) => {
            if (index + 1 === activeStepNum) {
                elem.classList.add("active-step");
            } else {
                elem.classList.remove("active-step");
            }
        });
    }

    function setHUDLight(state) {
        lightGreen.classList.remove("active");
        lightOrange.classList.remove("active");
        lightRed.classList.remove("active");
        if (state === "green") lightGreen.classList.add("active");
        if (state === "orange") lightOrange.classList.add("active");
        if (state === "red") lightRed.classList.add("active");
    }

    function calculateStaticPreview() {
        let energy = parseFloat(energySlider.value);
        let spec = dopantType.value;
        let depth = Math.sqrt(energy) * StoppingIndices[spec];
        outDepth.textContent = depth.toFixed(1);
    }
    calculateStaticPreview(); 

    /* ==========================================================================
       STEP 1: SUBSTRATE LOADING MANAGEMENT
       ========================================================================== */
    btnLoadWafer.addEventListener("click", () => {
        if (waferLoaded) return;

        waferLoaded = true;
        equipWafer.classList.add("card-disabled");
        equipWafer.querySelector(".status-badge").className = "status-badge state-active";
        equipWafer.querySelector(".status-badge").textContent = "Loaded";

        waferTop.style.display = "block";
        waferCross.style.display = "block";

        btnLoadWafer.classList.add("btn-locked");
        btnLoadWafer.disabled = true;
        btnPrepareSource.classList.remove("btn-locked");
        btnPrepareSource.disabled = false;

        updateStepTracker(2);
        statusBox.textContent = "Silicon wafer substrate loaded onto center target stage.";
        instructionText.textContent = "Wafer mounted. Click \"Prepare Ion Source\".";
    });

    /* ==========================================================================
       STEP 2: ENERGIZING HIGH VOLTAGE SUB-CHASSIS SYSTEMS
       ========================================================================== */
    btnPrepareSource.addEventListener("click", () => {
        if (!waferLoaded || sourcePrepared) return;

        sourcePrepared = true;
        setHUDLight("orange");
        statusBox.textContent = "Initializing electrical fields. Tuning source parameters...";
        btnPrepareSource.classList.add("btn-locked");
        btnPrepareSource.disabled = true;

        setTimeout(() => {
            plasmaGlow.classList.add("plasma-active");
            magnetChamber.classList.add("magnet-active");
            columnChamber.classList.add("column-active");

            [equipSource, equipAnalyzer, equipColumn].forEach(card => {
                card.classList.add("card-disabled");
                card.querySelector(".status-badge").className = "status-badge state-active";
                card.querySelector(".status-badge").textContent = "Active";
            });

            btnStartImplant.classList.remove("btn-locked");
            btnStartImplant.disabled = false;

            updateStepTracker(3);
            setHUDLight("green");
            statusBox.textContent = "Subsystems active. High-voltage acceleration column energized.";
            instructionText.textContent = "Subsystems locked. Click \"Start Implantation\".";
        }, 1200);
    });

    /* ==========================================================================
       STEP 3: ACTIVE OPERATION CYCLE EXECUTION LOOP
       ========================================================================== */
    btnStartImplant.addEventListener("click", () => {
        if (!sourcePrepared || implantationActive || simulationComplete) return;

        implantationActive = true;
        isPaused = false;
        setHUDLight("red");
        
        if (hvHazardTag) hvHazardTag.classList.add("active-tag");

        [energySlider, doseSlider, timeSlider, dopantType].forEach(el => el.disabled = true);
        btnStartImplant.classList.add("btn-locked");
        btnStartImplant.disabled = true;
        btnPause.classList.remove("btn-locked");
        btnPause.disabled = false;

        updateStepTracker(4);
        statusBox.textContent = "Gates open. Ion beam raster scanning active...";
        ionBeam.classList.add("beam-active-firing", "beam-scanning-active");

        totalDuration = parseInt(timeSlider.value);
        timeRemaining = growthProgressPercent === 0 ? totalDuration : timeRemaining;

        executionInterval = setInterval(() => {
            if (isPaused) return;

            timeRemaining--;
            processTimer.textContent = `Time: ${timeRemaining}s`;

            let elapsedFraction = (totalDuration - timeRemaining) / totalDuration;
            growthProgressPercent = elapsedFraction * 100;

            let energy = parseFloat(energySlider.value);
            let spec = dopantType.value;

            let finalDepth = Math.sqrt(energy) * StoppingIndices[spec];
            let currentDepth = finalDepth * elapsedFraction;
            outDepth.textContent = currentDepth.toFixed(1);

            // Responsive profile height bounds capping
            dopantProfile.style.height = Math.min(62, (currentDepth * 0.45)) + "px";
            dopantProfile.style.backgroundColor = spec === "boron" ? 
                `rgba(239, 68, 68, ${0.15 + (elapsedFraction * 0.6)})` : 
                `rgba(30, 144, 255, ${0.15 + (elapsedFraction * 0.6)})`;

            let hueSaturationValue = Math.floor(elapsedFraction * 100);
            waferTop.style.backgroundColor = spec === "boron" ? 
                `rgb(${74 + hueSaturationValue}, 85, 104)` : 
                `rgb(74, 85, ${104 + hueSaturationValue})`;

            if (timeRemaining <= 0) finalizeSimulation();
        }, 1000);
    });

    /* ==========================================================================
       PAUSE & FINALIZATION CRITERIA
       ========================================================================== */
    btnPause.addEventListener("click", () => {
        if (!implantationActive || simulationComplete) return;

        if (!isPaused) {
            isPaused = true;
            btnPause.textContent = "Resume";
            setHUDLight("orange");
            statusBox.textContent = "Process Paused. Scanner frozen.";
            ionBeam.classList.remove("beam-active-firing", "beam-scanning-active");
        } else {
            isPaused = false;
            btnPause.textContent = "Pause";
            setHUDLight("red");
            statusBox.textContent = "Resuming ion track scan.";
            ionBeam.classList.add("beam-active-firing", "beam-scanning-active");
        }
    });

    function finalizeSimulation() {
        clearInterval(executionInterval);
        implantationActive = false;
        simulationComplete = true;
        
        setHUDLight("green");
        if (hvHazardTag) hvHazardTag.classList.remove("active-tag");
        ionBeam.classList.remove("beam-active-firing", "beam-scanning-active");
        
        btnPause.classList.add("btn-locked");
        btnPause.disabled = true;
        processTimer.textContent = "Completed";
        updateStepTracker(5);

        let energy = parseFloat(energySlider.value);
        let rawExponent = parseFloat(doseSlider.value);
        let spec = dopantType.value;
        let actualTime = parseInt(timeSlider.value);

        let finalDepth = Math.sqrt(energy) * StoppingIndices[spec];
        outDepth.textContent = finalDepth.toFixed(1);

        let calculatedResistance = (ResistanceBaselines[spec] / (rawExponent - 11.5)).toFixed(1);
        outResistance.textContent = calculatedResistance;

        let uniformityGrade = actualTime >= 25 ? (actualTime <= 40 ? "Excellent" : "Good") : "Fair";
        outUniformity.textContent = uniformityGrade;

        let qualityScore = 100;
        if (energy < 80 || energy > 150) qualityScore -= 15;
        if (rawExponent < 14.7 || rawExponent > 15.7) qualityScore -= 20;
        if (actualTime < 25 || actualTime > 40) qualityScore -= 15;

        let qualityGrade = qualityScore >= 85 ? "Excellent" : (qualityScore >= 65 ? "Good" : "Fair");
        outQuality.textContent = `${qualityScore}% (${qualityGrade})`;
        
        statusBox.textContent = "Implantation complete. Dopants embedded securely into target silicon lattice matrix structure.";
        instructionText.textContent = "Experiment completed successfully! Click 'Reset' to restart.";
    }

    btnReset.addEventListener("click", () => {
        if (executionInterval) clearInterval(executionInterval);
        location.reload();
    });
});