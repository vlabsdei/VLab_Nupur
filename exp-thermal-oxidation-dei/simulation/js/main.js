const oxidationType =
    document.getElementById(
        "oxidationType"
    );

const temperature =
    document.getElementById(
        "temperature"
    );

const time =
    document.getElementById(
        "time"
    );

const tempValue =
    document.getElementById(
        "tempValue"
    );

const timeValue =
    document.getElementById(
        "timeValue"
    );

const startBtn =
    document.getElementById(
        "startBtn"
    );

const resetBtn =
    document.getElementById(
        "resetBtn"
    );

const oxideLayer =
    document.getElementById(
        "oxideLayer"
    );

const thicknessText =
    document.getElementById(
        "thickness"
    );

const growthRateText =
    document.getElementById(
        "growthRate"
    );

const qualityText =
    document.getElementById(
        "quality"
    );

const statusBox =
    document.getElementById(
        "statusBox"
    );

const pipeLabel =
    document.getElementById(
        "pipeLabel"
    );

const particles =
    document.querySelectorAll(
        ".particle"
    );

const furnace =
    document.getElementById(
        "furnace"
    );

const liveProcessType =
    document.getElementById(
        "liveProcessType"
    );

const liveGas =
    document.getElementById(
        "liveGas"
    );

const liveTemp =
    document.getElementById(
        "liveTemp"
    );

// SLIDER VALUES

temperature.addEventListener(
    "input",
    () => {

        tempValue.innerHTML =
            temperature.value;

        liveTemp.innerHTML =
            temperature.value;

    });

time.addEventListener(
    "input",
    () => {

        timeValue.innerHTML =
            time.value;

    });

// START BUTTON
startBtn.addEventListener(
    "click",
    startOxidation
);

// MAIN FUNCTION

function startOxidation() {

    const type =
        oxidationType.value;

    const temp =
        parseFloat(
            temperature.value
        );

    const heatingTime =
        parseFloat(
            time.value
        );

    // HOT FURNACE EFFECT

    furnace.classList.add(
        "hot"
    );

    // VISUAL DIFFERENCE

    if (type === "dry") {

        liveProcessType.innerHTML =
            "Dry Oxidation";

        liveGas.innerHTML =
            "O₂";

        pipeLabel.innerHTML =
            "O₂ Gas Inlet";

        oxideLayer.style.background =
            "#8ed0ff";

        particles.forEach(
            particle => {

                particle.style.background =
                    "#4aa3ff";

                particle.classList.add(
                    "animate"
                );

            });

        statusBox.innerHTML =
            "Dry oxidation initiated using pure oxygen gas environment.";

    }

    else {

        liveProcessType.innerHTML =
            "Wet Oxidation";

        liveGas.innerHTML =
            "O₂ + H₂O Vapor";

        pipeLabel.innerHTML =
            "Steam + O₂ Inlet";

        oxideLayer.style.background =
            "#dff7ff";

        particles.forEach(
            particle => {

                particle.style.background =
                    "#ffffff";

                particle.classList.add(
                    "animate"
                );

            });

        statusBox.innerHTML =
            "Wet oxidation initiated using steam oxidation environment.";

    }

    // DEAL GROVE MODEL

    let A;
    let B;

    // DRY OXIDATION

    if (type === "dry") {

        A = 0.08;

        B = 0.003;

    }

    // WET OXIDATION

    else {

        A = 0.2;

        B = 0.03;

    }

    const temperatureFactor =
        (temp - 800) / 400;

    A *= temperatureFactor;

    B *= temperatureFactor;

    const t =
        heatingTime;


    const tau = 1;

    // DEAL GROVE EQUATION

    const thickness =
    (
        (
            -A
            +
            Math.sqrt(
                (A * A)
                +
                (
                    4
                    *
                    B
                    *
                    (t + tau)
                )
            )
        ) / 2
    ).toFixed(2);
    // GROWTH RATE

    let growthRate = 0;

    if (heatingTime > 0) {

        growthRate =
        (
            thickness / heatingTime
        ).toFixed(3);

    }

    // QUALITY LOGIC

    let quality =
        "Good";

    // HIGH QUALITY DRY OXIDATION

    if (
        type === "dry"
        &&
        temp >= 950
        &&
        temp <= 1100
    ) {

        quality =
            "Excellent";

    }

    // THICK WET OXIDE

    if (
        type === "wet"
        &&
        thickness > 2
    ) {

        quality =
            "Moderate";

    }

    // LOW TEMPERATURE

    if (temp < 930) {

        quality =
            "Poor";

    }
    // VISUAL OXIDE GROWTH

    const visualThickness =
        thickness * 8;

    oxideLayer.style.height =
        visualThickness + "px";

    // OUTPUTS

    thicknessText.innerHTML =
        thickness;

    growthRateText.innerHTML =
        growthRate;

    qualityText.innerHTML =
        quality;

    // STATUS UPDATE


    statusBox.innerHTML +=
        "<br><br>Silicon dioxide layer formation detected on wafer surface.";

}

// RESET

resetBtn.addEventListener(
    "click",
    () => {

        // REMOVE HOT EFFECT

        furnace.classList.remove(
            "hot"
        );

        // RESET OXIDE

        oxideLayer.style.height =
            "0px";

        // RESET OUTPUTS

        thicknessText.innerHTML =
            "0";

        growthRateText.innerHTML =
            "0";

        qualityText.innerHTML =
            "Not Started";

        // RESET LIVE PROCESS INFO

        liveProcessType.innerHTML =
            "Dry Oxidation";

        liveGas.innerHTML =
            "O₂";

        liveTemp.innerHTML =
            temperature.value;

        // RESET PIPE LABEL

        pipeLabel.innerHTML =
            "O₂ Gas Inlet";

        // RESET STATUS

        statusBox.innerHTML =
            "Waiting to start oxidation...";

        // STOP PARTICLES

        particles.forEach(
            particle => {

                particle.classList.remove(
                    "animate"
                );

            });

        // RESET OXIDE COLOR

        oxideLayer.style.background =
            "#8ed0ff";

    });

