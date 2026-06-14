document.addEventListener("DOMContentLoaded", () => {

    const waferCard = document.getElementById("waferCard");
    const prCard = document.getElementById("prCard");
    const maskCard = document.getElementById("maskCard");
    
    const waferTool = document.getElementById("waferTool");
    const photoresistBottle = document.getElementById("photoresistBottle");
    const mainWafer = document.getElementById("mainWafer");
    const mainMask = document.getElementById("mainMask");
    const photoresistLayer = document.getElementById("photoresistLayer");
    const pattern = document.getElementById("pattern");
    const uvLight = document.getElementById("uvLight");
    const hotplateSurface = document.querySelector(".hotplate-surface");
    
    const spinCoaterEl = document.getElementById("spinCoater");
    const hotplateEl = document.getElementById("hotplate").querySelector(".hotplate-surface");
    const devTankEl = document.querySelector(".developer-tank");
   
    const instructionText = document.getElementById("instructionText");
    
    const processTimer = document.getElementById("processTimer");
    const spinSpeed = document.getElementById("spinSpeed");
    const exposureTime = document.getElementById("exposureTime");
    const spinValue = document.getElementById("spinValue");
    const exposureValue = document.getElementById("exposureValue");
    const thicknessText = document.getElementById("thickness");
    const qualityText = document.getElementById("quality");
    const statusBox = document.getElementById("statusBox");
  
    const lightGreen = document.getElementById("lightGreen");
    const lightOrange = document.getElementById("lightOrange");
    const lightRed = document.getElementById("lightRed");
    const uvHazardTag = document.getElementById("uvHazardTag");
    const heatHazardTag = document.getElementById("heatHazardTag");

    const coatBtn = document.getElementById("coatBtn");
    const bakeBtn = document.getElementById("bakeBtn");
    const uvBtn = document.getElementById("uvBtn");
    const developBtn = document.getElementById("developBtn");
    const hardBakeBtn = document.getElementById("hardBakeBtn");
    const resetBtn = document.getElementById("resetBtn");

    let waferPlaced = false;
    let resistAdded = false;
    let coated = false;
    let baked = false;
    let maskPlaced = false;
    let exposed = false;
    let developed = false;

    spinSpeed.addEventListener("input", () => {
        spinValue.textContent = spinSpeed.value;
    });

    exposureTime.addEventListener("input", () => {
        exposureValue.textContent = exposureTime.value;
    });

    function setHUDLight(activeLight) {
        [lightGreen, lightOrange, lightRed].forEach(light => light.classList.remove("active"));
        activeLight.classList.add("active");
    }

    function clearAllStationHighlights() {
        spinCoaterEl.classList.remove("active-station");
        hotplateEl.classList.remove("active-station");
        devTankEl.classList.remove("active-station");
    }

    waferCard.addEventListener("click", () => {
        if (!waferPlaced) {
            waferPlaced = true;
            mainWafer.style.display = "block";
            waferTool.style.opacity = "0.3";
       
            clearAllStationHighlights();
            spinCoaterEl.classList.add("active-station");
            
            statusBox.textContent = "Silicon Wafer transferred and fixed onto the vacuum chuck seat.";
            instructionText.textContent = "Wafer loaded into chuck safely. Click on the Photoresist (PR) Bottle in the tray to dispense.";
        }
    });

    prCard.addEventListener("click", () => {
        if (!waferPlaced) {
            statusBox.textContent = "Error: Cannot deposit photoresist before loading the silicon wafer substrate.";
            return;
        }
        if (!resistAdded) {
            resistAdded = true;
            photoresistBottle.style.opacity = "0.3";
            statusBox.textContent = "Amber Photoresist polymer successfully dispensed onto the substrate center. Ready to spin coat.";
            instructionText.textContent = "Photoresist applied. Adjust the parameter sliders on the right panel if needed, then click the 'Spin Coat' button.";
        }
    });

    maskCard.addEventListener("click", () => {
        if (!baked) {
            statusBox.textContent = "Process Stop: Perform Soft Bake execution step to stabilize the PR layer first.";
            return;
        }
        if (!maskPlaced) {
            mainMask.style.display = "flex";
            maskPlaced = true;
            statusBox.textContent = "Photomask alignment system locked directly over the substrate field area.";
            instructionText.textContent = "Photomask alignment locked. Click the 'UV Exposure' button below to engage radiation projection.";
        }
    });

    
    coatBtn.addEventListener("click", () => {
        if (!resistAdded) {
            statusBox.textContent = "Error: Photoresist missing on substrate surface.";
            return;
        }
        if (coated) return;

        coated = true;
        setHUDLight(lightOrange);
        
        processTimer.textContent = "Spin Coating...";
        statusBox.textContent = "Spin engine processing substrate rotational distribution acceleration.";
        mainWafer.classList.add("spin-wafer");

        const calculatedThickness = (316.22 / Math.sqrt(spinSpeed.value)).toFixed(2);

        setTimeout(() => {
            mainWafer.classList.remove("spin-wafer");
            photoresistLayer.style.height = "100%";
            thicknessText.textContent = calculatedThickness;
            processTimer.textContent = "Coating Complete";
            setHUDLight(lightGreen);
            
            statusBox.textContent = `Uniform dispersion finalized. Calculated film layer thickness: ${calculatedThickness} µm.`;
            instructionText.textContent = "Thin-film coating uniform. Click the 'Soft Bake' button to transfer the substrate to the Hot Plate module.";
        }, 4000);
    });

    bakeBtn.addEventListener("click", () => {
        if (!coated) {
            statusBox.textContent = "Error: Spin coating operation sequence missing.";
            return;
        }
        if (baked) return;

        baked = true;
        setHUDLight(lightOrange);
        heatHazardTag.classList.add("active");
        
        clearAllStationHighlights();
        hotplateEl.classList.add("active-station");
        
        processTimer.textContent = "Soft Bake...";
        statusBox.textContent = "Substrate handling track shifted to pre-bake hotplate matrix unit.";
        hotplateSurface.style.background = "#e64a19";

        setTimeout(() => {
            processTimer.textContent = "Bake Complete";
            setHUDLight(lightGreen);
            heatHazardTag.classList.remove("active");
            
            statusBox.textContent = "Solvent residue successfully outgassed. Molecular crystallization layer stable.";
            instructionText.textContent = "Soft bake done. Click on the Photomask in the Equipment Tray to bring down the pattern stencil.";
        }, 5000);
    });

    uvBtn.addEventListener("click", () => {
        if (!maskPlaced) {
            statusBox.textContent = "Error: Photomask optical alignment layer missing.";
            return;
        }
        if (exposed) return;

        exposed = true;
        setHUDLight(lightRed);
        uvHazardTag.classList.add("active");
        
        processTimer.textContent = "UV Radiation Active";
        statusBox.textContent = "Mercury-vapor lamp lowering into exposure coordinates above alignment frame.";
        uvLight.style.height = "115px";

        setTimeout(() => {
            uvLight.style.height = "0px";
            processTimer.textContent = "Exposure Complete";
            setHUDLight(lightGreen);
            uvHazardTag.classList.remove("active");
            mainMask.style.display = "none"; 
            
            statusBox.textContent = "Polymer chain modification registered over clear window field sections.";
            instructionText.textContent = "Exposure complete. Gantry system retracted. Click the 'Develop' button to transfer to the Wet Chemistry Bench.";
        }, 4000);
    });

    developBtn.addEventListener("click", () => {
        if (!exposed) {
            statusBox.textContent = "Error: Complete alignment exposure step run profile first.";
            return;
        }
        if (developed) return;

        developed = true;
        setHUDLight(lightOrange);
        
        clearAllStationHighlights();
        devTankEl.classList.add("active-station");
        
        processTimer.textContent = "Developing Window...";
        statusBox.textContent = "Substrate entered chemical developer immersion segment block.";

        setTimeout(() => {
            pattern.style.opacity = "1";
            processTimer.textContent = "Development Complete";
            setHUDLight(lightGreen);
            
            if (spinSpeed.value >= 2500 && spinSpeed.value <= 3500 && exposureTime.value >= 12 && exposureTime.value <= 18) {
                qualityText.textContent = "Excellent Resolution";
            } else {
                qualityText.textContent = "Resolution Distortion";
            }
            
            statusBox.textContent = "Exposed photoresist structures fully dissolved. DI Water rinse complete.";
            instructionText.textContent = "Micro-patterns developed. Click the 'Hard Bake' button to finish sample cross-linking reinforcement.";
        }, 4000);
    });

    hardBakeBtn.addEventListener("click", () => {
        if (!developed) {
            statusBox.textContent = "Error: Chemical development extraction verification step required.";
            return;
        }
        setHUDLight(lightOrange);
        
        clearAllStationHighlights();
        hotplateEl.classList.add("active-station");
        
        processTimer.textContent = "Hard Bake Running";
        statusBox.textContent = "Substrate returned to heating plate for high-temperature pattern hardening.";

        setTimeout(() => {
            setHUDLight(lightGreen);
            processTimer.textContent = "Process Finalized";
            clearAllStationHighlights(); 
            
            statusBox.textContent = "Photolithography process finished. Ready for micro-machining etch pipeline structural processing.";
            instructionText.textContent = "Batch runs finalized flawlessly! Review outputs or click 'Reset' to restart lab metrics configurations.";
        }, 4000);
    });
    resetBtn.addEventListener("click", () => {
        location.reload();
    });
});