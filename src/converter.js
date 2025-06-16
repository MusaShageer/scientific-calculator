const unitTypeSelect = document.getElementById("unitType");
const inputUnit = document.getElementById("inputUnit");
const outputUnit = document.getElementById("outputUnit");
const inputValue = document.getElementById("inputValue");
const outputValue = document.getElementById("outputValue");
const convertButton = document.getElementById("convertButton");
const swapButton = document.getElementById("swapButton");

// Unit definitions and conversion to base units
const unitData = {
    length: {
        base: "meter",
        units: {
            kilometer: 1000,
            meter: 1,
            centimeter: 0.01,
            micrometer: 1e-6,
            nanometer: 1e-9,
            inch: 0.0254,
            foot: 0.3048,
            yard: 0.9144,
            mile: 1609.344,
            nauticalmile: 1852,
        }
    },
    area: {
        base: "squaremeter",
        units: {
            squarekilometer: 1e6,
            squaremeter: 1,
            squarecentimeter: 0.0001,
            squaremillimeter: 0.000001,
            hectare: 10000,
            acre: 4046.8564224,
            squaremile: 2.59e6,
            squareyard: 0.836127,
            squarefoot: 0.092903,
            squareinch: 0.00064516,
        }
    },
    temperature: {
        units: {
            celsius: {
                toKelvin: val => val + 273.15,
                fromKelvin: val => val - 273.15
            },
            fahrenheit: {
                toKelvin: val => (val - 32) * 5/9 + 273.15,
                fromKelvin: val => (val - 273.15) * 9/5 + 32
            },
            kelvin: {
                toKelvin: val => val,
                fromKelvin: val => val
            }
        }
    },
    weight: {
        base: "kilogram",
        units: {
            kilogram: 1,
            gram: 0.001,
            milligram: 1e-6,
            microgram: 1e-9,
            ton: 1000,
            pound: 0.453592,
            ounce: 0.0283495,
            stone: 6.35029,
        }
    }
};

// Populate units in dropdowns
function populateUnits(unitType) {
    inputUnit.innerHTML = "";
    outputUnit.innerHTML = "";

    const units = unitType === "temperature"
        ? Object.keys(unitData[unitType].units)
        : Object.keys(unitData[unitType].units);

    for (const unit of units) {
        const option1 = document.createElement("option");
        const option2 = document.createElement("option");
        option1.value = unit;
        option2.value = unit;
        option1.textContent = capitalize(unit);
        option2.textContent = capitalize(unit);
        inputUnit.appendChild(option1);
        outputUnit.appendChild(option2);
    }

    // Default selection
    inputUnit.selectedIndex = 0;
    outputUnit.selectedIndex = 1;
}

function capitalize(word) {
    return word.replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase to space
               .replace(/^./, str => str.toUpperCase());
}

// Conversion logic dispatcher
function convertValue(value, from, to, type) {
    if (type === "temperature") {
        const kelvin = unitData.temperature.units[from].toKelvin(value);
        return unitData.temperature.units[to].fromKelvin(kelvin);
    } else {
        const unitMap = unitData[type].units;
        const baseValue = value * unitMap[from];
        return baseValue / unitMap[to];
    }
}

// Handle Convert button click
convertButton.addEventListener("click", () => {
    const unitType = unitTypeSelect.value;
    const from = inputUnit.value;
    const to = outputUnit.value;
    const value = parseFloat(inputValue.value);

    if (isNaN(value)) {
        outputValue.value = "Enter a valid number";
        return;
    }

    const result = convertValue(value, from, to, unitType);
    outputValue.value = result.toLocaleString(undefined, { maximumFractionDigits: 10 });
});

// Handle Swap button
swapButton.addEventListener("click", () => {
    const temp = inputUnit.value;
    inputUnit.value = outputUnit.value;
    outputUnit.value = temp;
    convertButton.click();
});

// Handle unit type change
unitTypeSelect.addEventListener("change", () => {
    populateUnits(unitTypeSelect.value);
    outputValue.value = "";
    inputValue.value = "";
});

// Initial load
populateUnits("length");
inputUnit.addEventListener("change", () => {
    outputValue.value = "";
});

outputUnit.addEventListener("change", () => {
    outputValue.value = "";
});

// Add a space after "square" for area units in dropdowns
function prettifyUnit(unit, type) {
    if (type === "area" && unit.startsWith("square")) {
        return "Square " + capitalize(unit.slice(6));
    }
    return capitalize(unit);
}

// Override populateUnits to use prettifyUnit for area
const originalPopulateUnits = populateUnits;
populateUnits = function(unitType) {
    inputUnit.innerHTML = "";
    outputUnit.innerHTML = "";

    const units = Object.keys(unitData[unitType].units);

    for (const unit of units) {
        const option1 = document.createElement("option");
        const option2 = document.createElement("option");
        option1.value = unit;
        option2.value = unit;
        option1.textContent = prettifyUnit(unit, unitType);
        option2.textContent = prettifyUnit(unit, unitType);
        inputUnit.appendChild(option1);
        outputUnit.appendChild(option2);
    }

    inputUnit.selectedIndex = 0;
    outputUnit.selectedIndex = 1;
};

// Re-populate units on initial load to apply prettify
populateUnits(unitTypeSelect.value);
