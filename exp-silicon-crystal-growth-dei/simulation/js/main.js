const furnace =
    document.getElementById("furnace");

const crucible =
    document.getElementById("crucible");

const silicon =
    document.getElementById("silicon");

const moltenSilicon =
    document.getElementById("moltenSilicon");

const crystal =
    document.getElementById("crystal");

const heatBtn =
    document.getElementById("heatBtn");

const growthBtn =
    document.getElementById("growthBtn");

const resetBtn =
    document.getElementById("resetBtn");

const pullRate =
    document.getElementById("pullRate");

const rotationSpeed =
    document.getElementById("rotationSpeed");

const temperature =
    document.getElementById("temperature");

const pullValue =
    document.getElementById("pullValue");

const rotationValue =
    document.getElementById("rotationValue");

const tempValue =
    document.getElementById("tempValue");

const qualityText =
    document.getElementById("quality");

const statusBox =
    document.getElementById("statusBox");

const defectBox =
    document.getElementById("defectBox");

const resultBox =
    document.getElementById("resultBox");

const crucibleGuide =
    document.querySelector(".crucible-guide");

const siliconGuide =
    document.querySelector(".silicon-guide");

    const liveTemp =
    document.getElementById("liveTemp");

// STATES

let cruciblePlaced = false;

let siliconAdded = false;

let heated = false;

// DRAGGING

const draggableItems = [
    crucible,
    silicon
];

draggableItems.forEach(item => {

    item.addEventListener(
        "dragstart",
        function (e) {

            e.dataTransfer.setData(
                "text",
                e.target.id
            );

        });

});
// MOBILE Optimize


crucible.addEventListener(
    "click",
    function () {

        if (!cruciblePlaced) {

            placeCrucible();

        }

    });

silicon.addEventListener(
    "click",
    function () {

        if (
            cruciblePlaced
            && !siliconAdded
        ) {

            addSilicon();

        }

    });

// PLACE CRUCIBLE FUNCTION

function placeCrucible() {

    cruciblePlaced = true;

    const furnaceCrucible =
        document.createElement("div");

    furnaceCrucible.classList.add(
        "crucible"
    );

    furnaceCrucible.id =
        "furnaceCrucible";

    furnaceCrucible.innerHTML =
        `<div class="crucible-inner"></div>`;

    furnaceCrucible.style.position =
        "absolute";

    furnaceCrucible.style.bottom =
        "85px";

    furnaceCrucible.style.left =
        "50%";

    furnaceCrucible.style.transform =
        "translateX(-50%)";

    furnace.appendChild(
        furnaceCrucible
    );

    crucibleGuide.style.display =
        "none";

    statusBox.innerHTML =
        "Crucible placed successfully.";

}
// ADD SILICON FUNCTION

function addSilicon() {

    siliconAdded = true;

    moltenSilicon.style.opacity =
        "1";

    siliconGuide.style.display =
        "none";

    statusBox.innerHTML =
        "Silicon chunks added.";

}

// ALLOW DROP

furnace.addEventListener(
    "dragover",
    function (e) {

        e.preventDefault();

    });

// DROP LOGIC

furnace.addEventListener(
    "drop",
    function (e) {

        e.preventDefault();

        const itemId =
            e.dataTransfer.getData("text");

        // CRUCIBLE

        if (
            itemId === "crucible"
            && !cruciblePlaced
        ) {

            placeCrucible();

        }

        // SILICON

        if (
            itemId === "silicon"
            && cruciblePlaced
            && !siliconAdded
        ) {

            addSilicon();

        }

    });
// SLIDER VALUES

pullRate.addEventListener(
    "input",
    () => {

        pullValue.innerHTML =
            pullRate.value;

    });

rotationSpeed.addEventListener(
    "input",
    () => {

        rotationValue.innerHTML =
            rotationSpeed.value;

    });

temperature.addEventListener(
    "input",
    () => {

        tempValue.innerHTML =
            temperature.value;

    });


heatBtn.addEventListener(
    "click",
    () => {

        if (
            !cruciblePlaced
            || !siliconAdded
        ) {

            statusBox.innerHTML =
                "Place crucible and silicon first.";

            return;

        }

        heated = true;

        moltenSilicon.classList.add(
            "melted"
        );

        statusBox.innerHTML =
            "Heating started. Silicon melting.";

    });

// START GROWTH

growthBtn.addEventListener(
    "click",
    () => {

        if (!heated) {

            statusBox.innerHTML =
                "Heat silicon first.";

            return;

        }

        startGrowth();

    });
// MAIN GROWTH FUNCTION


function startGrowth() {

    let quality = 100;

    let defects = "None";

    let result =
        "Excellent crystal formation.";

    const pull =
        parseFloat(pullRate.value);

    const rotation =
        parseFloat(rotationSpeed.value);

    const temp =
        parseFloat(temperature.value);

    // RESET STYLES

    crystal.style.animation =
        "none";

    crystal.offsetHeight;

    crystal.style.height =
        "0";

    crystal.style.width =
        "55px";

    crystal.style.borderRadius =
        "15px";

    crystal.style.transform =
        "translateX(-50%)";

    // HIGH PULL RATE

    if (pull > 2.2) {

        quality -= 30;

        defects =
            "Thin crystal due to high pull rate.";

        result =
            "Defective crystal formed.";

        crystal.style.width =
            "28px";

    }
    // HIGH TEMPERATURE

    if (temp > 1480) {

        quality -= 25;

        defects +=
            " Thermal instability detected.";

        result =
            "Unstable growth.";

        crystal.style.borderRadius =
            "5px";

    }
    // LOW ROTATION

    if (rotation < 10) {

        quality -= 20;

        defects +=
            " Uneven growth due to low rotation.";

        result =
            "Non-uniform crystal.";

        crystal.style.transform =
            "translateX(-50%) rotate(4deg)";

    }
    // GOOD CONDITIONS

    if (
        pull >= 1 &&
        pull <= 2 &&
        rotation >= 12 &&
        rotation <= 20 &&
        temp >= 1420 &&
        temp <= 1470
    ) {

        quality = 96;

        defects =
            "Minimal defects.";

        result =
            "High-quality silicon crystal.";

        crystal.style.width =
            "60px";

    }
    // UPDATE OUTPUTS

    qualityText.innerHTML =
        quality;

    defectBox.innerHTML =
        defects;

    resultBox.innerHTML =
        result;
    // START ANIMATION

    crystal.style.animation =
        "growCrystal 8s linear forwards";

    statusBox.innerHTML =
        "Crystal growth in progress...";

    setTimeout(() => {

        statusBox.innerHTML =
            "Crystal growth completed.";

    }, 8000);

}

// RESET

resetBtn.addEventListener(
    "click",
    () => {

        cruciblePlaced = false;

        siliconAdded = false;

        heated = false;

        moltenSilicon.classList.remove(
            "melted"
        );

        moltenSilicon.style.opacity =
            "0";

        crystal.style.animation =
            "none";

        crystal.style.height =
            "0";

        crystal.style.width =
            "55px";

        crystal.style.transform =
            "translateX(-50%)";

        crystal.style.borderRadius =
            "15px";

        // REMOVE FURNACE CRUCIBLE

        const furnaceCrucible =
            document.getElementById(
                "furnaceCrucible"
            );

        if (furnaceCrucible) {

            furnaceCrucible.remove();

        }

        // SHOW GUIDE BOXES

        crucibleGuide.style.display =
            "flex";

        siliconGuide.style.display =
            "flex";

        // RESET OUTPUTS

        qualityText.innerHTML =
            "100";

        statusBox.innerHTML =
            "Waiting for setup...";

        defectBox.innerHTML =
            "None";

        resultBox.innerHTML =
            "Not Started";

    });