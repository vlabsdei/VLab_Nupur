document.addEventListener("DOMContentLoaded", () => {

    const waferCard = document.getElementById("waferCard");
    const gasCard = document.getElementById("gasCard");
    const targetCard = document.getElementById("targetCard");

    const loadWaferBtn = document.getElementById("loadWaferBtn");
    const prepareBtn = document.getElementById("prepareBtn");
    const startBtn = document.getElementById("startBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const resetBtn = document.getElementById("resetBtn");

    const depositionType = document.getElementById("depositionType");
    const materialType = document.getElementById("materialType");
    const depositionRate = document.getElementById("depositionRate");
    const depositionTime = document.getElementById("depositionTime");
    const rateValue = document.getElementById("rateValue");
    const timeValue = document.getElementById("timeValue");

    const processTimer = document.getElementById("processTimer");
    const instructionText = document.getElementById("instructionText");
    const thicknessOutput = document.getElementById("thicknessOutput");
    const coverageOutput = document.getElementById("coverageOutput");
    const qualityOutput = document.getElementById("qualityOutput");
    const processStatus = document.getElementById("processStatus");
    const statusBox = document.getElementById("statusBox");

    const depositedLayer = document.getElementById("depositedLayer");
    const depositedLayerTop = document.getElementById("depositedLayerTop");
    const filmLayer = document.getElementById("filmLayer");
    const waferReal = document.getElementById("waferReal");
    const waferTopView = document.querySelector(".wafer-top-view");
    const crossSectionWafer = document.querySelector(".cross-section-wafer");

    const particleZone = document.getElementById("particleZone");
    const plasmaZone = document.getElementById("plasmaZone");
    const showerhead = document.getElementById("showerhead");
    const pvdTarget = document.getElementById("pvdTarget");

    const lightGreen = document.getElementById("lightGreen");
    const lightOrange = document.getElementById("lightOrange");
    const lightRed = document.getElementById("lightRed");

    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");
    const step4 = document.getElementById("step4");
    const step5 = document.getElementById("step5");

    let waferLoaded = false;
    let sourcePrepared = false;
    let depositionRunning = false;
    let depositionPaused = false;

    let countdownInterval = null;
    let particleInterval = null;
    let growthInterval = null;

    let countdownSeconds = 10;
    let growthPercentage = 0; 

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

    depositionRate.addEventListener("input", () => { rateValue.textContent = depositionRate.value; });
    depositionTime.addEventListener("input", () => { timeValue.textContent = depositionTime.value; });

    function getMaterialColor() {
        switch(materialType.value){
            case "oxide": return "#38bdf8";     
            case "poly": return "#f59e0b";      
            case "aluminum": return "#a1a1aa";  
            default: return "#38bdf8";
        }
    }

    function loadWafer() {
        if(waferLoaded) return;
        waferLoaded = true;
        setHUDLight("orange");
        activateStep(step2);

        loadWaferBtn.disabled = true;
        prepareBtn.disabled = false;
        waferCard.style.opacity = "0.5";

        waferReal.style.display = "block";
        waferTopView.style.display = "block";
        crossSectionWafer.style.display = "block";

        instructionText.textContent = "Prepare the deposition source element.";
        statusBox.innerHTML = "Silicon wafer substrate aligned and positioned inside high-vacuum chuck.";
        processStatus.textContent = "Wafer Loaded";
    }

    waferCard.addEventListener("click", loadWafer);
    loadWaferBtn.addEventListener("click", loadWafer);

    prepareBtn.addEventListener("click", () => {
        if(!waferLoaded) return;
        sourcePrepared = true;
        activateStep(step3);
        
        prepareBtn.disabled = true;
        startBtn.disabled = false;

        if(depositionType.value === "cvd"){
            showerhead.classList.remove("hidden");
            pvdTarget.classList.add("hidden");
            gasCard.style.opacity = "0.5";
            statusBox.innerHTML = "Gas manifold showerhead stabilized with clean hydride carrier feeds.";
        } else {
            showerhead.classList.add("hidden");
            pvdTarget.classList.remove("hidden");
            targetCard.style.opacity = "0.5";
            statusBox.innerHTML = "Sputter shield vacuum valves matching physical source arrays.";
        }
        processStatus.textContent = "Source Ready";
        instructionText.textContent = "Configuration locked. Press \"Start Deposition\" to ignite growth fields.";
    });

    function createParticle() {
        const particle = document.createElement("div");
        particle.style.position = "absolute";
        particle.style.width = "6px";
        particle.style.height = "6px";
        particle.style.borderRadius = "50%";
        particle.style.zIndex = "100";
        particle.style.backgroundColor = getMaterialColor();

        if(depositionType.value === "cvd"){
            particle.style.left = (Math.random() * 70 + 15) + "%";
            particle.style.top = "80px";
        } else {
            particle.style.left = (Math.random() * 30 + 35) + "%";
            particle.style.top = "85px";
        }

        particleZone.appendChild(particle);

        let currentPos = parseFloat(particle.style.top);
        let animLoop = setInterval(() => {
            if (depositionPaused) return;
            currentPos += 6;
            particle.style.top = currentPos + "px";
            if (currentPos >= 270) {
                clearInterval(animLoop);
                particle.remove();
            }
        }, 20);
    }

    startBtn.addEventListener("click", () => {
        if(!waferLoaded || !sourcePrepared || depositionRunning) return;

        depositionRunning = true;
        depositionPaused = false;
        setHUDLight("red");
        activateStep(step4);

        startBtn.disabled = true;
        pauseBtn.disabled = false;

        plasmaZone.style.opacity = "1";
        plasmaZone.style.background = "radial-gradient(circle, rgba(56,189,248,0.4) 0%, transparent 75%)";
        plasmaZone.classList.add("plasma-active");

        processStatus.textContent = "Depositing";
        instructionText.textContent = "Observe thin film deposition growth layers.";
        statusBox.innerHTML = "Deposition loop initialized. Nucleation layers forming on substrate surface...";

        const rate = parseFloat(depositionRate.value);
        const time = parseFloat(depositionTime.value);
        const totalThickness = Math.round(rate * time);

        countdownSeconds = 10;
        processTimer.innerHTML = countdownSeconds + " s";

        countdownInterval = setInterval(() => {
            if(depositionPaused) return;
            countdownSeconds--;
            processTimer.innerHTML = countdownSeconds + " s";
            
            if(countdownSeconds <= 0) {
                clearInterval(countdownInterval);
                completeDeposition(totalThickness, rate);
            }
        }, 1000);

        particleInterval = setInterval(() => {
            if(!depositionPaused) createParticle();
        }, 90);

        growthPercentage = 0;
        const currentColor = getMaterialColor();

        growthInterval = setInterval(() => {
            if(depositionPaused) return;

            if (growthPercentage < 100) {
                growthPercentage += 1;
            } else {
                clearInterval(growthInterval);
                return;
            }

            let crossSectionHeight = (growthPercentage / 100) * 28; 
            depositedLayer.style.height = crossSectionHeight + "px";
            depositedLayer.style.backgroundColor = currentColor;

            let chamberWaferHeight = (growthPercentage / 100) * 12;
            filmLayer.style.height = chamberWaferHeight + "px";
            filmLayer.style.backgroundColor = currentColor;

            depositedLayerTop.style.backgroundColor = currentColor;
            depositedLayerTop.style.opacity = (growthPercentage / 100);

            thicknessOutput.textContent = Math.round((growthPercentage / 100) * totalThickness);
        }, 100); 
    });

    function completeDeposition(thickness, rate) {
        clearInterval(particleInterval);
        clearInterval(growthInterval);
        clearInterval(countdownInterval);

        depositionRunning = false;
        plasmaZone.style.opacity = "0";
        plasmaZone.classList.remove("plasma-active");
        particleZone.innerHTML = "";

        setHUDLight("green");
        activateStep(step5);

        processTimer.innerHTML = "Completed";
        processStatus.textContent = "Completed";
        thicknessOutput.textContent = thickness;

        coverageOutput.textContent = (depositionType.value === "cvd") ? "Excellent (Conformal)" : "Good (Directional)";
        
        let quality = "Fair";
        if(rate >= 30 && rate <= 70) quality = "Excellent";
        else if(rate >= 15 && rate <= 90) quality = "Good";
        qualityOutput.textContent = quality;

        pauseBtn.disabled = true;
        instructionText.textContent = "Deposition completed successfully.";
        statusBox.innerHTML = `Film layer grown successfully.<br>Final calibrated thickness: <b>${thickness} nm</b>`;
    }

    pauseBtn.addEventListener("click", () => {
        if(!depositionRunning) return;
        depositionPaused = !depositionPaused;

        if(depositionPaused){
            pauseBtn.textContent = "Resume";
            processStatus.textContent = "Paused";
            processTimer.innerHTML = "Paused";
            statusBox.innerHTML = "Process state held on pause cycle.";
        } else {
            pauseBtn.textContent = "Pause";
            processStatus.textContent = "Depositing";
            statusBox.innerHTML = "Resuming deposition flux tracking...";
        }
    });

    resetBtn.addEventListener("click", () => { location.reload(); });
});