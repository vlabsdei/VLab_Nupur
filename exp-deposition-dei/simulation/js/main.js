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

    const depositedLayer =
        document.getElementById("depositedLayer");

    const depositedLayerTop =
        document.getElementById("depositedLayerTop");

    const filmLayer =
        document.getElementById("filmLayer");

    const particleZone =
        document.getElementById("particleZone");

    const plasmaZone =
        document.getElementById("plasmaZone");

    const showerhead =
        document.getElementById("showerhead");

    const pvdTarget =
        document.getElementById("pvdTarget");

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

    let countdownSeconds = 0;
    let currentHeight = 0;
    let targetHeight = 0;
 function activateStep(step) {

        [
            step1,
            step2,
            step3,
            step4,
            step5
        ].forEach(s =>
            s.classList.remove("active-step")
        );

        step.classList.add("active-step");
    }

   depositionRate.addEventListener("input", () => {

        rateValue.textContent =
            depositionRate.value;

    });

    depositionTime.addEventListener("input", () => {

        timeValue.textContent =
            depositionTime.value;

    });

   function getMaterialColor() {

        switch(materialType.value){

            case "oxide":
                return "#8ed0ff";

            case "poly":
                return "#f59e0b";

            case "aluminum":
                return "#d1d5db";

            default:
                return "#8ed0ff";
        }

    }
function loadWafer() {

        if(waferLoaded)
            return;

        waferLoaded = true;

        activateStep(step2);

        prepareBtn.disabled = false;

        waferCard.style.opacity = "0.5";

        instructionText.textContent =
            "Prepare the deposition source.";

        statusBox.innerHTML =
            "Silicon wafer loaded into chamber.";

        processStatus.textContent =
            "Wafer Loaded";

    }

    waferCard.addEventListener(
        "click",
        loadWafer
    );

    loadWaferBtn.addEventListener(
        "click",
        loadWafer
    );

    prepareBtn.addEventListener("click", () => {

        if(!waferLoaded){

            statusBox.innerHTML =
                "Load wafer first.";

            return;
        }

        sourcePrepared = true;

        activateStep(step3);

        startBtn.disabled = false;

        if(depositionType.value === "cvd"){

            showerhead.classList.remove(
                "hidden"
            );

            pvdTarget.classList.add(
                "hidden"
            );

            gasCard.style.opacity = "0.5";

            statusBox.innerHTML =
                "CVD gas source prepared.";

        }

        else{

            showerhead.classList.add(
                "hidden"
            );

            pvdTarget.classList.remove(
                "hidden"
            );

            targetCard.style.opacity = "0.5";

            statusBox.innerHTML =
                "PVD sputtering target prepared.";

        }

        processStatus.textContent =
            "Source Ready";

        instructionText.textContent =
            "Start deposition process.";

    });

    function createParticle() {

        const particle =
            document.createElement("div");

        particle.classList.add(
            "particle"
        );

        particle.style.background =
            getMaterialColor();

        if(depositionType.value === "cvd"){

            particle.style.left =
                Math.random() * 100 + "%";

        }
        else{

            particle.style.left =
                (45 + Math.random()*10) + "%";

        }

        particle.style.top = "80px";

        particle.style.animation =
            "fall 2s linear forwards";

        particleZone.appendChild(
            particle
        );

        setTimeout(() => {

            particle.remove();

        },2000);

    }

    startBtn.addEventListener("click", () => {

        if(!waferLoaded ||
           !sourcePrepared)
            return;

        if(depositionRunning)
            return;

        depositionRunning = true;
        depositionPaused = false;

        activateStep(step4);

        startBtn.disabled = true;
        prepareBtn.disabled = true;
        loadWaferBtn.disabled = true;
        pauseBtn.disabled = false;

        processStatus.textContent =
            "Depositing";

        instructionText.textContent =
            "Observe thin film growth.";

        statusBox.innerHTML =
            "Deposition started.";

        if(depositionType.value === "pvd"){

            plasmaZone.classList.add(
                "plasma-active"
            );

        }

        const rate =
            parseFloat(
                depositionRate.value
            );

        const time =
            parseFloat(
                depositionTime.value
            );

        const thickness =
            Math.round(rate * time);

        targetHeight =
            Math.min(
                thickness / 20,
                35
            );

        countdownSeconds = 10;

        processTimer.innerHTML =
            countdownSeconds + " s";

        countdownInterval =
            setInterval(() => {

            if(depositionPaused)
                return;

            countdownSeconds--;

            processTimer.innerHTML =
                countdownSeconds + " s";

            if(countdownSeconds <= 0){

                clearInterval(
                    countdownInterval
                );

            }

        },1000);

       
        particleInterval =
            setInterval(
                createParticle,
                120
            );

        currentHeight = 0;

        const topTarget =
            Math.min(
                thickness / 10,
                100
            );

        let topGrowth = 0;

        growthInterval =
            setInterval(() => {

            if(depositionPaused)
                return;

            currentHeight += 0.4;
            topGrowth += 1;

            depositedLayer.style.height =
                currentHeight + "px";

            filmLayer.style.height =
                currentHeight + "px";

            depositedLayerTop.style.height =
                topGrowth + "%";

            const liveThickness =
                Math.round(
                    (topGrowth / topTarget)
                    * thickness
                );

            thicknessOutput.textContent =
                Math.max(
                    liveThickness,
                    0
                );

            if(currentHeight >= targetHeight){

                clearInterval(
                    growthInterval
                );

            }

        },100);

        
        setTimeout(() => {

            completeDeposition(
                thickness,
                rate
            );

        },10000);

    });

    function completeDeposition(
        thickness,
        rate
    ){

        clearInterval(
            particleInterval
        );

        clearInterval(
            growthInterval
        );

        clearInterval(
            countdownInterval
        );

        depositionRunning = false;

        plasmaZone.classList.remove(
            "plasma-active"
        );

        activateStep(step5);

        processTimer.innerHTML =
            "Completed";

        processStatus.textContent =
            "Completed";

        thicknessOutput.textContent =
            thickness;

        if(depositionType.value === "cvd"){

            coverageOutput.textContent =
                "Excellent";

        }
        else{

            coverageOutput.textContent =
                "Good";

        }
   let quality = "Fair";

        if(rate >= 30 &&
           rate <= 70){

            quality =
                "Excellent";

        }
        else if(rate >= 15 &&
                rate <= 90){

            quality =
                "Good";

        }

        qualityOutput.textContent =
            quality;

        pauseBtn.disabled = true;

        instructionText.textContent =
            "Deposition completed successfully.";

        statusBox.innerHTML =
            "Film deposited successfully.<br>" +
            "Thickness: " +
            thickness +
            " nm";

    }

    pauseBtn.addEventListener("click", () => {

        if(!depositionRunning)
            return;

        depositionPaused =
            !depositionPaused;

        if(depositionPaused){

            pauseBtn.textContent =
                "Resume";

            processStatus.textContent =
                "Paused";

            processTimer.innerHTML =
                "Paused";

            statusBox.innerHTML =
                "Process paused.";

        }
        else{

            pauseBtn.textContent =
                "Pause";

            processStatus.textContent =
                "Depositing";

            statusBox.innerHTML =
                "Process resumed.";

        }

    });

    resetBtn.addEventListener("click", () => {

        location.reload();

    });

});