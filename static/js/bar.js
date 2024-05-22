url = 'http://127.0.0.1:5000/data'

//test
d3.json(url).then((test_data) => {
    console.log(test_data)
}
);

//note: for bar by area: add time frame drop down
//note: for types of crime: add area drop down

function buildCrimeBarByArea() {
    d3.json(url).then((data) => {
    
    //get areas and count of crimes
   let crimeCounts = {};

   data.forEach(crime => {
    let areaName = crime.area_name;
    if(crimeCounts[areaName]) {
        crimeCounts[areaName]++;
    } else {
        crimeCounts[areaName] = 1;
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
    title: 'Crime Counts by Area',
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

    }
)};

function buildCrimeBarByType() {
    d3.json(url).then((data) => {
        let crimeCounts = {};

        data.forEach(crime => {
            let crimeDescription = crime.crime_description;
            if(crimeCounts[crimeDescription]) {
                crimeCounts[crimeDescription]++;
            } else {
                crimeCounts[crimeDescription] = 1;
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
            marker: {
                color: colorScale,
                width: 1
            }
        };

        let layout = {
            title: 'Crime Counts by Type',
            xaxis: {
                title: 'Number of Crimes',
                tickangle: -90,
            },
            yaxis: {
                title: 'Crime Type',
                automargin: true
            },
            margin: {
                1: 150,
                r: 50,
                b: 100,
                t: 50,
                pad: 4
            }
        };
        let config = {
            responsiveness: true
        };

        //Plot bar chart
        Plotly.newPlot('barbyType', [trace], layout);
    })
}

//call function
buildCrimeBarByArea();
buildCrimeBarByType();
