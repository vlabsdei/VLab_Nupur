document.addEventListener("DOMContentLoaded", () => {

    // Left Panel Cards
    const waferCard = document.getElementById("waferCard");
    const probeCard = document.getElementById("probeCard");
    const thermalCard = document.getElementById("thermalCard");

    // Execution Buttons
    const loadWaferBtn = document.getElementById("loadWaferBtn");
    const prepareBtn = document.getElementById("prepareBtn");
    const startBtn = document.getElementById("startBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const resetBtn = document.getElementById("resetBtn");

    // Input Parameters
    const binningMode = document.getElementById("binningMode");
    const supplyVoltage = document.getElementById("supplyVoltage");
    const testFrequency = document.getElementById("testFrequency");
    const voltageValue = document.getElementById("voltageValue");
    const frequencyValue = document.getElementById("frequencyValue");

    // HUD & Diagnostics Outputs
    const processTimer = document.getElementById("processTimer");
    const instructionText = document.getElementById("instructionText");
    const passOutput = document.getElementById("passOutput");
    const failOutput = document.getElementById("failOutput");
    const yieldOutput = document.getElementById("yieldOutput");
    const gradeOutput = document.getElementById("gradeOutput");
    const statusBox = document.getElementById("statusBox");
    const centerText = document.getElementById("centerText");
    const waferGridContainer = document.getElementById("waferGridContainer");

    // Graphics Elements
    const probeHead = document.getElementById("probeHead");
    const surfaceSweepDisplay = document.getElementById("surfaceSweepDisplay");
    const wavePath = document.getElementById("wavePath");

    const lightGreen = document.getElementById("lightGreen");
    const lightOrange = document.getElementById("lightOrange");
    const lightRed = document.getElementById("lightRed");

    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");
    const step4 = document.getElementById("step4");
    const step5 = document.getElementById("step5");

    // State Variables
    let waferLoaded = false;
    let proberRouted = false;
    let sortingRunning = false;
    let sortingPaused = false;

    let sortingInterval = null;
    let currentDieIndex = 0;
    let totalPass = 0;
    let totalFail = 0;

    // 9x9 Wafer Matrix Mapping Coordinate Array
    const waferStructure = [
        [0,0,1,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1,1],
        [0,1,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,1,0,0]
    ];
    const totalValidDies = waferStructure.flat().filter(d => d === 1).length;

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

    supplyVoltage.addEventListener("input", () => {
        voltageValue.textContent = supplyVoltage.value;
        updateWaveformOscilloscope();
    });

    testFrequency.addEventListener("input", () => {
        frequencyValue.textContent = testFrequency.value;
        updateWaveformOscilloscope();
    });

    binningMode.addEventListener("change", () => {
        if(binningMode.value === "high") {
            supplyVoltage.value = 4.2;
            testFrequency.value = 85;
        } else if(binningMode.value === "automotive") {
            supplyVoltage.value = 3.8;
            testFrequency.value = 35;
        } else {
            supplyVoltage.value = 3.3;
            testFrequency.value = 50;
        }
        voltageValue.textContent = supplyVoltage.value;
        frequencyValue.textContent = testFrequency.value;
        updateWaveformOscilloscope();
    });

    function updateWaveformOscilloscope() {
        if(!proberRouted) return;
        const V = parseFloat(supplyVoltage.value);
        const f = parseFloat(testFrequency.value);
        
        const amp = 14 * (V / 2.2);
        const cycleSpeed = f / 22.0;
        
        let dString = "M 0 40";
        for (let x = 0; x <= 200; x += 4) {
            let y = 40 + Math.sin(x * cycleSpeed * 0.15) * amp;
            dString += ` L ${x} ${y}`;
        }
        wavePath.setAttribute("d", dString);
        wavePath.setAttribute("stroke", "#06b6d4");
    }

    // Phase 1: Substrate Allocation Execution
    function loadWaferSubstrate() {
        if(waferLoaded) return;
        waferLoaded = true;
        setHUDLight("orange");
        activateStep(step2);

        loadWaferBtn.disabled = true;
        prepareBtn.disabled = false;
        waferCard.style.opacity = "0.5";

        waferGridContainer.innerHTML = '<div id="waferGrid" class="wafer-matrix-grid"></div>';
        const waferGrid = document.getElementById("waferGrid");
        
        waferStructure.forEach((row, r) => {
            row.forEach((isValid, c) => {
                const die = document.createElement("div");
                die.classList.add("die-element");
                die.id = `die-${r}-${c}`;
                if(!isValid) die.classList.add("masked");
                waferGrid.appendChild(die);
            });
        });

        instructionText.textContent = "Route the parametric hardware testing interface.";
        statusBox.innerHTML = "Wafer successfully loaded and locked onto the thermal chuck stage.";
        processTimer.textContent = "Wafer Loaded";
    }

    waferCard.addEventListener("click", loadWaferSubstrate);
    loadWaferBtn.addEventListener("click", loadWaferSubstrate);

    // Phase 2: Interlink Prober Hardware Channels
    prepareBtn.addEventListener("click", () => {
        if(!waferLoaded || proberRouted) return;
        proberRouted = true;
        activateStep(step3);

        prepareBtn.disabled = true;
        startBtn.disabled = false;
        probeCard.style.opacity = "0.5";
        thermalCard.style.opacity = "0.5";

        probeHead.classList.remove("hidden");
        updateWaveformOscilloscope();

        statusBox.innerHTML = "Automated probe card channels locked. Interface links established.";
        processTimer.textContent = "Tester Routed";
        instructionText.textContent = "Calibrate stress constraints. Press \"Start Sorting\" to initialize testing sweep.";
    });

    // Phase 3 & 4: Execute Automation Sorting Sweeps
    startBtn.addEventListener("click", () => {
        if(!waferLoaded || !proberRouted || sortingRunning) return;

        sortingRunning = true;
        sortingPaused = false;
        setHUDLight("red");
        activateStep(step4);

        startBtn.disabled = true;
        pauseBtn.disabled = false;
        surfaceSweepDisplay.classList.add("radar-active");

        processTimer.textContent = "Sorting...";
        instructionText.textContent = "Executing rapid automated functional matrix testing sweeps.";
        statusBox.innerHTML = "Automated matrix sweeps initialized. Tracking propagation delays...";

        const V = parseFloat(supplyVoltage.value);
        const f = parseFloat(testFrequency.value);
        const validDieElements = Array.from(document.querySelectorAll(".die-element:not(.masked)"));

        const intervalTime = 160; 

        sortingInterval = setInterval(() => {
            if(sortingPaused) return;

            if(currentDieIndex < validDieElements.length) {
              
                if(currentDieIndex > 0) validDieElements[currentDieIndex - 1].classList.remove("scanning");
                
                const currentDie = validDieElements[currentDieIndex];
                currentDie.classList.add("scanning");

        
                let randVal = Math.random();
                let isPass = true;
                let failType = "none";

                if (V < 1.7) {
                    if (randVal > 0.22) { isPass = false; failType = "time"; } 
                } else if (V > 4.6) {
                    if (randVal > 0.38) { isPass = false; failType = "param"; } 
                } else {
                    let threshold = 0.96 - (f / 240.0) + (V / 14.0);
                    if (randVal > threshold) {
                        isPass = false;
                        failType = (Math.random() > 0.75) ? "param" : "time";
                    }
                }

            
                if(isPass) {
                    totalPass++;
                    if(f >= 75 && V >= 3.6) {
                        currentDie.style.backgroundColor = "var(--die-pass-premium)";
                    } else {
                        currentDie.style.backgroundColor = "var(--die-pass-standard)";
                    }
                } else {
                    totalFail++;
                    currentDie.style.backgroundColor = (failType === "param") ? "var(--die-fail-param)" : "var(--die-fail-time)";
                }

        
                passOutput.textContent = totalPass;
                failOutput.textContent = totalFail;
                
                let currentYield = ((totalPass / (currentDieIndex + 1)) * 100).toFixed(1);
                yieldOutput.textContent = `${currentYield} %`;
                
                statusBox.innerHTML = `Scanning Die Array Coordinate #${currentDieIndex + 1}... \nStatus: ${isPass ? "PASS" : "FAIL (" + failType.toUpperCase() + ")"}`;

                currentDieIndex++;
            } else {
                clearInterval(sortingInterval);
                validDieElements[validDieElements.length - 1].classList.remove("scanning");
                completeWaferSorting();
            }
        }, intervalTime);
    });

    // Phase 5: Conclude Lot Evaluation Analytics
    function completeWaferSorting() {
        sortingRunning = false;
        surfaceSweepDisplay.classList.remove("radar-active");
        setHUDLight("green");
        activateStep(step5);

        processTimer.textContent = "Completed";
        pauseBtn.disabled = true;

        const finalYield = ((totalPass / totalValidDies) * 100);
        yieldOutput.textContent = `${finalYield.toFixed(1)} %`;

        let grade = "F";
        if(finalYield >= 88) grade = "A";
        else if(finalYield >= 72) grade = "B";
        else if(finalYield >= 55) grade = "C";
        else if(finalYield >= 35) grade = "D";
        gradeOutput.textContent = grade;

        instructionText.textContent = "Die sorting operational batch run completed successfully.";
        statusBox.innerHTML = `Wafer sorting complete.<br>Final Lot Yield: <b>${finalYield.toFixed(1)}%</b> &rarr; Grade Grade: [<b>${grade}</b>]`;
    }

    pauseBtn.addEventListener("click", () => {
        if(!sortingRunning) return;
        sortingPaused = !sortingPaused;

        if(sortingPaused) {
            pauseBtn.textContent = "Resume";
            processTimer.textContent = "Paused";
            setHUDLight("orange");
            statusBox.innerHTML = "Test automation sequence held on pause cycle configuration loop.";
        } else {
            pauseBtn.textContent = "Pause";
            processTimer.textContent = "Sorting...";
            setHUDLight("red");
            statusBox.innerHTML = "Resuming matrix sweep pin connections profiles...";
        }
    });

    resetBtn.addEventListener("click", () => { location.reload(); });
});