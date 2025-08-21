// This script handles the logic for the location and bearing app.

/**
 * A blank function that takes the values from the four input boxes
 * and returns a formatted string.
 * @param {string} location1 The value from the first location input.
 * @param {string} bearing1 The value from the first bearing input.
 * @param {string} location2 The value from the second location input.
 * @param {string} bearing2 The value from the second bearing input.
 * @returns {string} The combined string to be displayed.
 */
function createOutputString(location1, bearing1, location2, bearing2) {    
    // Lat & Long of each Fire Tower
    const Towers = { 
        // Tower1: [42.785463, -72.017079], My original test location points for the lake I am vacationing on!
        // Tower2: [42.784418, -72.022834], 
        NHPeterborough: [42.861900,-71.878722], 
        NHDerry: [42.885653,-71.266487],
        NHGilford: [43.517927, -71.369339],
        NHFarmington: [43.33143725584826, -71.11609093877593],
        NHOrange: [43.64954591042697, -71.91422094324123],
        NHCroyden: [43.48194102492495, -72.2193790481886], // This one I had to locate myself. Not pre-populated in Google Maps.
        NHMilford: [42.80473637844818, -71.63031890330458],
        NHEffingham: [43.76773272952898, -71.0369265037831],
        NHWilmot: [43.383284079983426, -71.85706915353312],
        NHPittsburg: [45.06285515415562, -71.16246767426217],
        NHMilan: [44.57231672764399, -71.22319512278509],
        NHLoudon: [43.278165632022656, -71.50504090697544],
        NHNottingham: [43.1019331322377, -71.18104668308564],
        NHStoddard: [43.09405694826296, -72.13497942946528],
        NHMoultonboro: [43.755754803457705, -71.45794460588132]
        //NHLancaster: [Unable to find] 
    };
        
    const ret = intersection(Towers[location1][0], Towers[location1][1], bearing1, Towers[location2][0], Towers[location2][1], bearing2);
    console.log(ret);
    return `${ret}`;
}

document.addEventListener('DOMContentLoaded', () => {
    // Lat & Long of each Fire Tower
    const Towers = { 
        // Tower1: [42.785463, -72.017079], My original test locations points for the lake I am vactioning on! 
        // Tower2: [42.784418, -72.022834], 
        NHPeterborough: [42.861900,-71.878722], 
        NHDerry: [42.885653,-71.266487], 
        NHGilford: [43.517927, -71.369339],
        NHFarmington: [43.33143725584826, -71.11609093877593],
        NHOrange: [43.64954591042697, -71.91422094324123],
        NHCroyden: [43.48194102492495, -72.2193790481886], // This one I had to locate myself. Not pre-populated in Google Maps.
        NHMilford: [42.80473637844818, -71.63031890330458],
        NHEffingham: [43.76773272952898, -71.0369265037831],
        NHWilmot: [43.383284079983426, -71.85706915353312],
        NHPittsburg: [45.06285515415562, -71.16246767426217],
        NHMilan: [44.57231672764399, -71.22319512278509],
        NHLoudon: [43.278165632022656, -71.50504090697544],
        NHNottingham: [43.1019331322377, -71.18104668308564],
        NHStoddard: [43.09405694826296, -72.13497942946528],
        NHMoultonboro: [43.755754803457705, -71.45794460588132]
        //NHLancaster: [Unable to find]
    };
    
    // Get Fields
    const location1Select = document.getElementById('location1');
    const bearing1Input = document.getElementById('bearing1');
    const location2Select = document.getElementById('location2');
    const bearing2Input = document.getElementById('bearing2');
    const calculateButton = document.getElementById('calculateBtn');
    const outputElement = document.getElementById('outputString');
    const copyButton = document.getElementById('copyBtn');
    const findInMapsButton = document.getElementById('findInMapsBtn');

    /**
     * Populates a select element with options from an object's keys.
     * @param {HTMLSelectElement} selectElement The select element to populate.
     * @param {object} optionsObject The object whose keys will be used as options.
     */
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

    /**
     * Handles the click event of the calculate button.
     * It retrieves the input values, passes them to the function,
     * and displays the returned string.
     */
    const handleCalculate = () => {        
        const location1 = location1Select.value;
        const bearing1 = bearing1Input.value;
        const location2 = location2Select.value;
        const bearing2 = bearing2Input.value;

        // Check if any fields are empty and provide a message if so
        if (!location1 || !bearing1 || !location2 || !bearing2) {
            outputElement.textContent = 'Please fill out all fields.';
            outputElement.classList.remove('text-gray-900');
            outputElement.classList.add('text-red-500');
            copyButton.disabled = true;
            findInMapsButton.disabled = true;
            return; // Stop execution if validation fails
        }

        // Call the blank function to get the formatted string
        const resultString = createOutputString(location1, bearing1, location2, bearing2);

        // Display the generated string in the output element
        outputElement.textContent = resultString;
        outputElement.classList.remove('text-red-500');
        outputElement.classList.add('text-gray-900');
        copyButton.disabled = false;
        findInMapsButton.disabled = false;
    };
    
    /**
     * Handles the click event for the Copy button.
     * It copies the content of the output string to the clipboard.
     */
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(outputElement.textContent);
            // Optionally, provide user feedback
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Optionally, provide user feedback for failure
        }
    };
    
    /**
     * Handles the click event for the Find In Maps button.
     * It opens a new tab with a Google Maps search for the output string.
     */
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

// Used Chat GPT 5.0 to assist in spherical trig (since the earth is not flat Haversine is needed) to be as accurate as possible.
function intersection(lat1, lon1, brng1, lat2, lon2, brng2) {
  // Convert degrees to radians
  function toRad(deg) { return deg * Math.PI / 180; }
  function toDeg(rad) { return rad * 180 / Math.PI; }

  // Convert lat/lon to radians
  lat1 = toRad(lat1);
  lon1 = toRad(lon1);
  lat2 = toRad(lat2);
  lon2 = toRad(lon2);
  brng1 = toRad(brng1);
  brng2 = toRad(brng2);

  // Convert start points to Cartesian
  let p1 = [Math.cos(lat1) * Math.cos(lon1), Math.cos(lat1) * Math.sin(lon1), Math.sin(lat1)];
  let p2 = [Math.cos(lat2) * Math.cos(lon2), Math.cos(lat2) * Math.sin(lon2), Math.sin(lat2)];

  // Great circle normal for point and bearing
  function greatCircle(p, lat, lon, brng) {
    // North and East vectors at point
    let n = [-Math.sin(lat) * Math.cos(lon), -Math.sin(lat) * Math.sin(lon), Math.cos(lat)];
    let e = [-Math.sin(lon), Math.cos(lon), 0];
    // Direction vector of bearing
    let d = [
      n[0] * Math.cos(brng) + e[0] * Math.sin(brng),
      n[1] * Math.cos(brng) + e[1] * Math.sin(brng),
      n[2] * Math.cos(brng) + e[2] * Math.sin(brng)
    ];
    // Great circle normal is cross product of point and direction
    return [
      p[1] * d[2] - p[2] * d[1],
      p[2] * d[0] - p[0] * d[2],
      p[0] * d[1] - p[1] * d[0]
    ];
  }

  let gc1 = greatCircle(p1, lat1, lon1, brng1);
  let gc2 = greatCircle(p2, lat2, lon2, brng2);

  // Intersection is cross product of the two great circle normals
  let x = [
    gc1[1] * gc2[2] - gc1[2] * gc2[1],
    gc1[2] * gc2[0] - gc1[0] * gc2[2],
    gc1[0] * gc2[1] - gc1[1] * gc2[0]
  ];

  // Normalise
  let mag = Math.sqrt(x[0]**2 + x[1]**2 + x[2]**2);
  x = [x[0]/mag, x[1]/mag, x[2]/mag];

  // Convert back to lat/lon
  let latInt = Math.asin(x[2]);
  let lonInt = Math.atan2(x[1], x[0]);

  // There are two intersections: x and -x
  // Choose the one closest to both observers
  function angularDist(latA, lonA, latB, lonB) {
    return Math.acos(Math.sin(latA)*Math.sin(latB) + Math.cos(latA)*Math.cos(latB)*Math.cos(lonA-lonB));
  }

  let latInt2 = -latInt;
  let lonInt2 = lonInt > 0 ? lonInt - Math.PI : lonInt + Math.PI;

  let d1 = angularDist(lat1, lon1, latInt, lonInt) + angularDist(lat2, lon2, latInt, lonInt);
  let d2 = angularDist(lat1, lon1, latInt2, lonInt2) + angularDist(lat2, lon2, latInt2, lonInt2);

  if (d2 < d1) {
    latInt = latInt2;
    lonInt = lonInt2;
  }

  return `${toDeg(latInt)}, ${toDeg(lonInt)}`;
}

  return `${toDeg(latInt)}, ${toDeg(lonInt)}`;
}


