document.addEventListener("DOMContentLoaded", () => {
    const waferCard = document.getElementById("waferCard");
    const etchantCard = document.getElementById("etchantCard");
    const gasCard = document.getElementById("gasCard");

    const mainWafer = document.getElementById("mainWafer");
    const targetEtchLayer = document.getElementById("targetEtchLayer");
    const maskLeft = document.querySelector(".layer-mask-left");
    const maskRight = document.querySelector(".layer-mask-right");
    
    const wetTank = document.getElementById("wetTank");
    const wetLiquid = document.getElementById("wetLiquid");
    const dryReactor = document.getElementById("dryReactor");
    const plasmaGlow = document.getElementById("plasmaGlow");
    const handlingChuck = document.getElementById("handlingChuck");

    const instructionText = document.getElementById("instructionText");
    const processTimer = document.getElementById("processTimer");
    const statusBox = document.getElementById("statusBox");

    const etchType = document.getElementById("etchType");
    const concentrationGroup = document.getElementById("concentrationGroup");
    const rfPowerGroup = document.getElementById("rfPowerGroup");
    const etchConcentration = document.getElementById("etchConcentration");
    const rfPower = document.getElementById("rfPower");
    const etchTime = document.getElementById("etchTime");

    const concentrationValue = document.getElementById("concentrationValue");
    const rfValue = document.getElementById("rfValue");
    const timeValue = document.getElementById("timeValue");

    const etchRateDisplay = document.getElementById("etchRateDisplay");
    const anisotropyDisplay = document.getElementById("anisotropyDisplay");
    const qualityDisplay = document.getElementById("qualityDisplay");

    const lightGreen = document.getElementById("lightGreen");
    const lightOrange = document.getElementById("lightOrange");
    const lightRed = document.getElementById("lightRed");
    const chemicalHazardTag = document.getElementById("chemicalHazardTag");
    const rfHazardTag = document.getElementById("rfHazardTag");

    const loadChemicalBtn = document.getElementById("loadChemicalBtn");
    const ignitePlasmaBtn = document.getElementById("ignitePlasmaBtn");
    const startEtchBtn = document.getElementById("startEtchBtn");
    const stripPRBtn = document.getElementById("stripPRBtn");
    const resetBtn = document.getElementById("resetBtn");

    let waferLoaded = false;
    let chamberPrepared = false;
    let etchingCompleted = false;
    let resistStripped = false;

    function updateStepTracker(stepIndex) {
        const steps = document.querySelectorAll(".step");
        steps.forEach((step, idx) => {
            if (idx === stepIndex) {
                step.classList.add("active-step");
            } else {
                step.classList.remove("active-step");
            }
        });
    }
    etchType.addEventListener("change", () => {
        if (etchType.value === "wet") {
            concentrationGroup.style.display = "flex";
            rfPowerGroup.style.display = "none";
            instructionText.textContent = "Wet Etch Mode selected. Click the Patterned Wafer to load it onto the stage.";
        } else {
            concentrationGroup.style.display = "none";
            rfPowerGroup.style.display = "flex";
            instructionText.textContent = "Dry Plasma Mode selected. Click the Patterned Wafer to load it onto the stage.";
        }
    });

    etchConcentration.addEventListener("input", () => concentrationValue.textContent = etchConcentration.value);
    rfPower.addEventListener("input", () => rfValue.textContent = rfPower.value);
    etchTime.addEventListener("input", () => timeValue.textContent = etchTime.value);

    function setHUDLight(activeLight) {
        [lightGreen, lightOrange, lightRed].forEach(light => light.classList.remove("active"));
        activeLight.classList.add("active");
    }

    function clearStationHighlights() {
        wetTank.classList.remove("active-station");
        dryReactor.classList.remove("active-station");
        handlingChuck.classList.remove("active-station");
    }


    waferCard.addEventListener("click", () => {
        if (!waferLoaded) {
            waferLoaded = true;
            mainWafer.style.display = "block";
            document.getElementById("waferTool").style.opacity = "0.3";
            
            clearStationHighlights();
            handlingChuck.classList.add("active-station");

            statusBox.textContent = "Substrate loaded. Photoresist mask segments protect the oxide layer fields below.";
            if (etchType.value === "wet") {
                instructionText.textContent = "Substrate ready. Click the Liquid Acid tray card or 'Fill Wet Bench' button to load chemicals.";
            } else {
                instructionText.textContent = "Substrate ready. Click the Plasma Gas canister card to inject gas values into the reactor cavity.";
            }
            updateStepTracker(1);
        }
    });

    etchantCard.addEventListener("click", () => {
        if (etchType.value !== "wet") {
            statusBox.textContent = "Configuration Conflict: Cannot fill wet tank while operating in Dry Plasma mode.";
            return;
        }
        if (!waferLoaded) {
            statusBox.textContent = "Error: Load the patterned substrate onto the central staging platform first.";
            return;
        }
        if (!chamberPrepared) {
            statusBox.textContent = "Wet Acid Tank filling sequence activated...";
            instructionText.textContent = "Filling tank bath. Please wait.";
            setHUDLight(lightOrange);

            setTimeout(() => {
                chamberPrepared = true;
                wetLiquid.style.height = "75%";
                setHUDLight(lightGreen);
                statusBox.textContent = "Liquid Acid Tank prepared to targeted capacity values.";
                instructionText.textContent = "Chamber ready. Click the 'Initiate Etch' button below to lower the substrate table.";
                updateStepTracker(2);
            }, 1500);
        }
    });

    gasCard.addEventListener("click", () => {
        if (etchType.value !== "dry") {
            statusBox.textContent = "Configuration Conflict: Plasma canisters cannot vent into an open atmospheric wet station bench.";
            return;
        }
        if (!waferLoaded) {
            statusBox.textContent = "Error: Load the patterned substrate onto the central staging platform first.";
            return;
        }
        if (!chamberPrepared) {
            statusBox.textContent = "Gas injection manifold active. Backing pumps pulling high vacuum...";
            instructionText.textContent = "Venting gas framework. Please wait.";
            setHUDLight(lightOrange);

            setTimeout(() => {
                chamberPrepared = true;
                setHUDLight(lightGreen);
                statusBox.textContent = "Chamber base pressure stabilized with reactive fluorocarbon tracking gas feeds.";
                instructionText.textContent = "Chamber sealed. Click the 'Pump Gas / Ignite' button below to ignite the core plasma field.";
                updateStepTracker(2);
            }, 1500);
        }
    });

    loadChemicalBtn.addEventListener("click", () => etchantCard.click());
    
    ignitePlasmaBtn.addEventListener("click", () => {
        if (etchType.value !== "dry" || !chamberPrepared || etchingCompleted) return;
        setHUDLight(lightRed);
        rfHazardTag.classList.add("active");
        dryReactor.classList.add("processing");
        statusBox.textContent = "RF Generator active. Glow discharge initiated inside reactor vault.";
        instructionText.textContent = "Plasma field active. Click the 'Initiate Etch' button to start material ion bombardment.";
    });

    startEtchBtn.addEventListener("click", () => {
        if (!chamberPrepared) {
            statusBox.textContent = "Process Hold: Chemical preparation protocols or vacuum seal states missing.";
            return;
        }
        if (etchingCompleted) return;

        if (etchType.value === "dry" && !dryReactor.classList.contains("processing")) {
            statusBox.textContent = "Error: Ignite the reactive plasma system before exposing the substrate tracking profile.";
            return;
        }

        etchingCompleted = true;
        setHUDLight(lightOrange);
        processTimer.textContent = "Etching Active...";

        let operationalFactor = etchType.value === "wet" ? etchConcentration.value : rfPower.value;
        let calculatedRate = etchType.value === "wet" ? (operationalFactor * 4).toFixed(1) : (operationalFactor * 1.8).toFixed(1);

        clearStationHighlights();
        if (etchType.value === "wet") {
            wetTank.classList.add("processing", "active-station");
            chemicalHazardTag.classList.add("active");
            statusBox.textContent = "Substrate lowering into chemical bath layout channel.";
        } else {
            dryReactor.classList.add("active-station");
            statusBox.textContent = "Wafer surface exposed directly to vertical anisotropic ionic flux.";
        }

        setTimeout(() => {
            processTimer.textContent = "Etch Finished";
            setHUDLight(lightGreen);
            chemicalHazardTag.classList.remove("active");
            rfHazardTag.classList.remove("active");
            wetTank.classList.remove("processing");
            dryReactor.classList.remove("processing");
            clearStationHighlights();
            handlingChuck.classList.add("active-station");

            let timeFactor = etchTime.value / 60;
            let depthReduction = Math.min(45, Math.floor(calculatedRate * timeFactor * 0.3));
            
            targetEtchLayer.style.top = depthReduction + "px";
            targetEtchLayer.style.height = (45 - depthReduction) + "px";

            etchRateDisplay.textContent = calculatedRate;
            
            if (etchType.value === "wet") {
                anisotropyDisplay.textContent = "Isotropic Undercut";
                anisotropyDisplay.style.color = "orange";
                targetEtchLayer.style.borderRadius = "50% 50% 0 0";
                targetEtchLayer.style.width = "90%";
                targetEtchLayer.style.margin = "0 auto";
                
                let qualityScore = etchConcentration.value > 60 ? "72%" : "88%";
                qualityDisplay.textContent = qualityScore;
                qualityDisplay.style.color = "#e03131";
                qualityDisplay.style.backgroundColor = "#fff5f5";
            } else {
                anisotropyDisplay.textContent = "Anisotropic Vertical";
                anisotropyDisplay.style.color = "#10b981";
                
                let qualityScore = rfPower.value > 250 ? "84% (Over-etch)" : "98% (Excellent)";
                qualityDisplay.textContent = qualityScore;
            }

            statusBox.textContent = "Etching target boundaries cleared. Material layers removed.";
            instructionText.textContent = "Etching finished. Click the 'Strip Photoresist' button to remove the dark polymer mask blocks.";
            updateStepTracker(3);
        }, 4000);
    });

    stripPRBtn.addEventListener("click", () => {
        if (!etchingCompleted || resistStripped) return;
        resistStripped = true;
        setHUDLight(lightOrange);
        processTimer.textContent = "PR Stripping...";

        setTimeout(() => {
            processTimer.textContent = "Batch Completed";
            setHUDLight(lightGreen);
            maskLeft.style.opacity = "0";
            maskRight.style.opacity = "0";
            
            statusBox.textContent = "Photoresist cleanly dissolved. Only the etched micro-structures remain on the substrate.";
            instructionText.textContent = "Experiment completed successfully! Review your outputs or click 'Reset' to evaluate a new run structure.";
        }, 2000);
    });

    resetBtn.addEventListener("click", () => location.reload());
});