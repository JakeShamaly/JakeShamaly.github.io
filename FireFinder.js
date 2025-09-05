// This script handles the logic for the location and bearing app with optional 3rd line of position.

/**
 * Build a formatted output string.
 * - With 2 lines: computes the best intersection of the two great circles.
 * - With 3 lines: computes all three pairwise intersections and returns the spherical mean
 *   (closest overall point) of those three intersection points.
 */
function createOutputString(location1, bearing1, location2, bearing2, location3 = null, bearing3 = null) {
    const Towers = getTowers();

    // Parse numbers safely
    const b1 = parseFloat(bearing1);
    const b2 = parseFloat(bearing2);

    if (location3 && bearing3 !== null && bearing3 !== undefined && bearing3 !== "") {
        const b3 = parseFloat(bearing3);
        const p12 = intersectionPoint(Towers[location1][0], Towers[location1][1], b1, Towers[location2][0], Towers[location2][1], b2);
        const p23 = intersectionPoint(Towers[location2][0], Towers[location2][1], b2, Towers[location3][0], Towers[location3][1], b3);
        const p13 = intersectionPoint(Towers[location1][0], Towers[location1][1], b1, Towers[location3][0], Towers[location3][1], b3);

        const mean = sphericalMean([p12, p23, p13]);
        return `${mean.lat.toFixed(8)}, ${mean.lon.toFixed(8)}`;
    } else {
        const p = intersectionPoint(Towers[location1][0], Towers[location1][1], b1, Towers[location2][0], Towers[location2][1], b2);
        return `${p.lat.toFixed(8)}, ${p.lon.toFixed(8)}`;
    }
}

// Keep the Towers dictionary in one place
function getTowers() {
    return {
        // Tower1: [42.785463, -72.017079],
        // Tower2: [42.784418, -72.022834],
        MILLER_FIRE_TOWER: [42.88568264, -71.26646328],
        WARNER_HILL_TOWER: [42.885653, -71.266487],
        BELKNAP_TOWER: [43.51793606, -71.36935549],
        BLUE_JOB_TOWER: [43.33145977, -71.11609593],
        CARDIGAN_MTN_TOWER: [43.64951863, -71.91418603],
        CROYDON_MTN_TOWER: [43.48184384, -72.21935872],
        FEDERAL_HILL_TOWER: [42.8047698, -71.63027225],
        GREEN_MTN_TOWER: [43.76771484, -71.03700492],
        HYLAND_HILL_TOWER: [42.95947877, -72.38431124],
        MAGALLOWAY_TOWER: [45.0628438, -71.16248386],
        MILAN_HILL_TOWER: [44.57227055, -71.22321721],
        OAK_HILL_TOWER: [43.27883633, -71.50583231],
        PAWTUCKAWAY_TOWER: [43.10195806, -71.18099417],
        PITCHER_MTN_TOWER: [43.09405694826296, -72.13497942946528],
        RED_HILL_TOWER: [43.75574388, -71.45796641],
        MT_KEARSARGE_TOWER: [43.38324024, -71.85701411],
        PROSPECT_FIRE_TOWER: [44.45104479, -71.57117603]
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const Towers = getTowers();

    // Get Fields
    const location1Select = document.getElementById('location1');
    const bearing1Input = document.getElementById('bearing1');
    const location2Select = document.getElementById('location2');
    const bearing2Input = document.getElementById('bearing2');
    const location3Select = document.getElementById('location3');
    const bearing3Input = document.getElementById('bearing3');
    const useThirdCheckbox = document.getElementById('useThird');
    const thirdInputs = document.getElementById('thirdInputs');

    const calculateButton = document.getElementById('calculateBtn');
    const outputElement = document.getElementById('outputString');
    const copyButton = document.getElementById('copyBtn');
    const findInMapsButton = document.getElementById('findInMapsBtn');

    const populateSelects = (selectElement, optionsObject) => {
        for (const key in optionsObject) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key;
            selectElement.appendChild(option);
        }
    };

    // Populate the dropdown menus when the DOM is loaded
    populateSelects(location1Select, Towers);
    populateSelects(location2Select, Towers);
    if (location3Select) populateSelects(location3Select, Towers);

    // Toggle third inputs
    useThirdCheckbox.addEventListener('change', () => {
        const enabled = useThirdCheckbox.checked;
        thirdInputs.classList.toggle('hidden', !enabled);
        location3Select.disabled = !enabled;
        bearing3Input.disabled = !enabled;
    });

    const handleCalculate = () => {
        const location1 = location1Select.value;
        const bearing1 = bearing1Input.value;
        const location2 = location2Select.value;
        const bearing2 = bearing2Input.value;

        const useThird = useThirdCheckbox.checked;
        const location3 = useThird ? location3Select.value : null;
        const bearing3 = useThird ? bearing3Input.value : null;

        // Validation
        if (!location1 || bearing1 === '' || !location2 || bearing2 === '') {
            setError('Please fill out all fields.');
            return;
        }
        if (useThird && (!location3 || bearing3 === '')) {
            setError('Please fill out Location 3 and Bearing 3, or uncheck the 3rd option.');
            return;
        }

        // Compute
        try {
            const resultString = createOutputString(location1, bearing1, location2, bearing2, location3, bearing3);
            outputElement.textContent = resultString;
            outputElement.classList.remove('text-red-500');
            outputElement.classList.add('text-gray-900');
            copyButton.disabled = false;
            findInMapsButton.disabled = false;
        } catch (e) {
            console.error(e);
            setError('Computation error. Please check inputs.');
        }
    };

    function setError(msg) {
        outputElement.textContent = msg;
        outputElement.classList.remove('text-gray-900');
        outputElement.classList.add('text-red-500');
        copyButton.disabled = true;
        findInMapsButton.disabled = true;
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(outputElement.textContent);
            copyButton.textContent = 'Copied!';
            setTimeout(() => { copyButton.textContent = 'Copy'; }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const handleFindInMaps = () => {
        const query = encodeURIComponent(outputElement.textContent);
        const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
        window.open(url, '_blank');
    };

    // Click event listeners
    calculateButton.addEventListener('click', handleCalculate);
    copyButton.addEventListener('click', handleCopy);
    findInMapsButton.addEventListener('click', handleFindInMaps);

    // Initially disable the copy and find in maps buttons
    copyButton.disabled = true;
    findInMapsButton.disabled = true;
});

// ---------- Math helpers for great-circle calculations ----------

function toRad(deg) { return (deg * Math.PI) / 180; }
function toDeg(rad) { return (rad * 180) / Math.PI; }

function latLonToCartesian(latDeg, lonDeg) {
    const lat = toRad(latDeg);
    const lon = toRad(lonDeg);
    return [
        Math.cos(lat) * Math.cos(lon),
        Math.cos(lat) * Math.sin(lon),
        Math.sin(lat)
    ];
}

function cartesianToLatLon(x, y, z) {
    const lat = Math.asin(z);
    const lon = Math.atan2(y, x);
    return { lat: toDeg(lat), lon: ((toDeg(lon) + 540) % 360) - 180 }; // normalize lon to [-180, 180]
}

// Returns the great-circle normal given a point & bearing (all in radians where needed)
function greatCircleNormalFromPointAndBearing(lat, lon, brng) {
    const n = [-Math.sin(lat) * Math.cos(lon), -Math.sin(lat) * Math.sin(lon), Math.cos(lat)];
    const e = [-Math.sin(lon), Math.cos(lon), 0];
    const d = [
        n[0] * Math.cos(brng) + e[0] * Math.sin(brng),
        n[1] * Math.cos(brng) + e[1] * Math.sin(brng),
        n[2] * Math.cos(brng) + e[2] * Math.sin(brng)
    ];
    // normal = p × d; but p uses the start point's cartesian
    const p = [Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat)];
    return [
        p[1] * d[2] - p[2] * d[1],
        p[2] * d[0] - p[0] * d[2],
        p[0] * d[1] - p[1] * d[0]
    ];
}

// Intersection (numeric) of two great circles defined by (lat1,lon1,brng1) and (lat2,lon2,brng2).
function intersectionPoint(lat1, lon1, brng1Deg, lat2, lon2, brng2Deg) {
    const lat1r = toRad(lat1), lon1r = toRad(lon1), b1 = toRad(brng1Deg);
    const lat2r = toRad(lat2), lon2r = toRad(lon2), b2 = toRad(brng2Deg);

    const gc1 = greatCircleNormalFromPointAndBearing(lat1r, lon1r, b1);
    const gc2 = greatCircleNormalFromPointAndBearing(lat2r, lon2r, b2);

    // Intersection direction = gc1 × gc2
    let x = [
        gc1[1] * gc2[2] - gc1[2] * gc2[1],
        gc1[2] * gc2[0] - gc1[0] * gc2[2],
        gc1[0] * gc2[1] - gc1[1] * gc2[0]
    ];
    const mag = Math.hypot(x[0], x[1], x[2]);
    x = [x[0] / mag, x[1] / mag, x[2] / mag];

    // Two antipodal intersections: x and -x.
    // Choose the one closer (sum of angular distances) to both observers.
    function angularDist(latA, lonA, vec) {
        const p = [Math.cos(latA) * Math.cos(lonA), Math.cos(latA) * Math.sin(lonA), Math.sin(latA)];
        const dot = p[0] * vec[0] + p[1] * vec[1] + p[2] * vec[2];
        return Math.acos(Math.max(-1, Math.min(1, dot)));
    }

    const xNeg = [-x[0], -x[1], -x[2]];
    const dPos = angularDist(lat1r, lon1r, x) + angularDist(lat2r, lon2r, x);
    const dNeg = angularDist(lat1r, lon1r, xNeg) + angularDist(lat2r, lon2r, xNeg);
    const use = dNeg < dPos ? xNeg : x;

    return cartesianToLatLon(use[0], use[1], use[2]);
}

// Spherical mean (normalized average in Cartesian space) of an array of {lat, lon}.
function sphericalMean(points) {
    let sx = 0, sy = 0, sz = 0;
    for (const p of points) {
        const [x, y, z] = latLonToCartesian(p.lat, p.lon);
        sx += x; sy += y; sz += z;
    }
    const mag = Math.hypot(sx, sy, sz);
    if (mag === 0) {
        // fallback: just return the first point if degenerate
        return points[0];
    }
    const x = sx / mag, y = sy / mag, z = sz / mag;
    return cartesianToLatLon(x, y, z);
}






