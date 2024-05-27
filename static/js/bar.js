//TO DO: figure out how to display dates of data shown

url = 'http://127.0.0.1:5000/data'
const urls = [
    'http://127.0.0.1:5000/data/bar_graph/0',
    'http://127.0.0.1:5000/data/bar_graph/1',
    'http://127.0.0.1:5000/data/bar_graph/2',
    'http://127.0.0.1:5000/data/bar_graph/3',
    'http://127.0.0.1:5000/data/bar_graph/4',
    'http://127.0.0.1:5000/data/bar_graph/5',
    'http://127.0.0.1:5000/data/bar_graph/6'
  ];

let allData =[];
let filteredData = [];

function loadData() {
      Promise.all(urls.map(url => d3.json(url)))
        .then(dataArray => {
          // dataArray is an array of arrays, where each inner array is the data from one URL
          const combinedData = dataArray.flat(); // flatten the array of arrays into a single array
          // process the combined data here
          allData = combinedData;
          filteredData = allData;
        //   updateDateRangeText(startDate, endDate);
          buildCrimeBarByArea();
          buildCrimeBarByType();
          updateTotalCrimesText();
        })
        .catch(error => {
          console.error(error);
        }); 
}

//date filter
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
let startDate = null;
let endDate = null;


//event listener for date filter
startDateInput.addEventListener('change', () => {
    startDate = startDateInput.value;
    updateDataWithDateRange();
});

endDateInput.addEventListener('change', () => {
    endDate = endDateInput.value;
    updateDataWithDateRange();
});

function updateDataWithDateRange() {
    // Call the functions to update the charts with the new date range
    if (allData.length > 0) {
        filteredData = allData.filter(crime => {
            const crimeDate = new Date(crime.dt_occurred);
            return (!startDate || crimeDate >= new Date(startDate)) && (!endDate || crimeDate <= new Date(endDate));
        });
        // updateDateRangeText(startDate, endDate);
        buildCrimeBarByArea();
        buildCrimeBarByType();
        updateTotalCrimesText();
    }
}



//set variables to use when filtering on charts
let selectedArea = null;
let selectedCrimeType = null;

//function to build bar chart by area
function buildCrimeBarByArea(type = null) {
    //get areas and count of crimes
   let crimeCounts = {};

   filteredData.forEach(crime => {
    if(type === null || crime.crime_description === type) {
    let areaName = crime.area_name;
    if(crimeCounts[areaName]) {
        crimeCounts[areaName]++;
    } else {
        crimeCounts[areaName] = 1;
    }
    }
   });

   // Convert the object to an array of { area_name, count } objects
   let sortedData = Object.keys(crimeCounts).map(areaName => ({
    area_name: areaName,
    count: crimeCounts[areaName]
   }));

   // Sort the data by count of crimes in ascending order
   sortedData.sort((a, b) => b.count - a.count);

   //prepare trace
   let areas = sortedData.map(entry => entry.area_name);
   let counts = sortedData.map(entry => entry.count);

   //define color scale (red for high crime count)
   let maxCount = Math.max(...counts);
   let colorScale = counts.map(count => `rgba(${255 * count/maxCount}, 0, 0, 0.6)`);

   let trace = {
    x: areas,
    y: counts,
    type: 'bar',
    text: counts.map(String),
    hoverinfo: 'text',
    hovertext: areas.map((area, i) => `${area}: ${counts[i]} crimes`),
    marker: {
        color: colorScale,
        width: 0.8
    }
   };

   let layout = {
    title: selectedCrimeType ? `Crime Counts by Area for ${selectedCrimeType}`: 'Crime Counts by Area',
    xaxis: {
        title: 'Area',
        tickangle: -90
    },
    yaxis: {
        title: 'Number of Crimes'
    }
   };
   let dataArea = [trace];

   //plot bar chart
   Plotly.newPlot('bar', dataArea, layout);

   //add clickevent listener to bars
   document.getElementById('bar').removeAllListeners('plotly_click');
   document.getElementById('bar').on('plotly_click', (data) => {
       selectedArea = data.points[0].x;
       buildCrimeBarByType(selectedArea);
   });
}

//function to build bar chart by crime type
function buildCrimeBarByType(area = null) {
   
        //get crime type and count of crimes
        let crimeCounts = {};

        filteredData.forEach(crime => {
            if(area === null || crime.area_name === area) {
            let crimeDescription = crime.crime_description;
            if(crimeCounts[crimeDescription]) {
                crimeCounts[crimeDescription]++;
            } else {
                crimeCounts[crimeDescription] = 1;
            }
        }
        });

        // Convert the object to an array of { crime_description, count } objects
        let sortedData = Object.keys(crimeCounts).map(crimeDescription => ({
            crime_description: crimeDescription,
            count: crimeCounts[crimeDescription]
        }));

        // Sort the data by count of crimes in descending order
        sortedData.sort((a, b) => a.count - b.count);

        //prepare trace 
        let crimeTypes = sortedData.map(entry => entry.crime_description);
        let counts = sortedData.map(entry => entry.count);

        //define color scale (red for high crime count)
        let maxCount = Math.max(...counts);
        let colorScale = counts.map(count => `rgba(${255 * count/maxCount}, 0, 0, 0.6)`);

        let trace = {
            x: counts,
            y: crimeTypes,
            type: 'bar',
            orientation: 'h',
            hoverinfo: 'text', // Show the text on hover
            hovertext: crimeTypes.map((crimeType, i) => `${crimeType}: ${counts[i]} crimes`),
            marker: {
                color: colorScale,
            }
        };

        let layout = {
            title: area ? `Crime Counts by Type in ${area}`: 'Crime Counts by Type',
            xaxis: {
                title: 'Number of Crimes',
                tickangle: -90,
            },
            yaxis: {
                automargin: true,
                tickfont: {
                    size: 10
                    },

            },
            margin: {
                1: 150,
                r: 50,
                b: 100,
                t: 50,
                pad: 4
            },
            width: 1500,
            bargap: 0.2,
            bargroupgap: 0.1,
            height: 1000
    
        };


        //Plot bar chart
        Plotly.newPlot('barbyType', [trace], layout);

        // Add click event listener to bars
        document.getElementById('barbyType').removeAllListeners('plotly_click');
        document.getElementById('barbyType').on('plotly_click', (data) => {
            selectedCrimeType = data.points[0].y;
            buildCrimeBarByArea(selectedCrimeType);
        });
    }

// Update the text container with the date range
// function updateDateRangeText(startDate, endDate) {
//     let dateRangeText = document.getElementById('dateRangeText');
//     if (startDate && endDate) {
//         dateRangeText.textContent = `Data date range: ${startDate} to ${endDate}`;
//     } else {
//         // Find the earliest and latest dates in the filtered dataset
//         let dates = filteredData.map(crime => new Date(crime.dt_occurred));
//         if (dates.length > 0) {
//             let earliestDate = new Date(Math.min(...dates));
//             let latestDate = new Date(Math.max(...dates));
//             let earliestDateString = earliestDate.toDateString();
//             let latestDateString = latestDate.toDateString();
//             dateRangeText.textContent = `Data date range: ${earliestDateString} to ${latestDateString}`;
//         } else {
//             dateRangeText.textContent = 'No data available for the selected date range';
//         }
//     }
// }

//text container w/ total number of crimes
function updateTotalCrimesText() {
    let totalCrimesText = document.getElementById('totalCrimesText');
    totalCrimesText.textContent = `Total crimes displayed: ${filteredData.length}`;
}

// Reset function
function resetFilters() {
    selectedArea = null;
    selectedCrimeType = null;
    startDate = null;
    endDate = null;
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    filteredData = allData;
    // updateDateRangeText(startDate, endDate);
    buildCrimeBarByArea();
    buildCrimeBarByType();
    updateTotalCrimesText();


}

// Event listener for the reset button
document.getElementById('resetButton').addEventListener('click', resetFilters);

//load data
loadData();