const urls = [
    'http://127.0.0.1:5000/data/pie_chart/0',
    'http://127.0.0.1:5000/data/pie_chart/1',
    'http://127.0.0.1:5000/data/pie_chart/2',
    'http://127.0.0.1:5000/data/pie_chart/3',
    'http://127.0.0.1:5000/data/pie_chart/4',
    'http://127.0.0.1:5000/data/pie_chart/5',
    'http://127.0.0.1:5000/data/pie_chart/6',
    'http://127.0.0.1:5000/data/pie_chart/7',
    'http://127.0.0.1:5000/data/pie_chart/8',
    'http://127.0.0.1:5000/data/pie_chart/9'
  ];

  function loadData (){
    Promise.all(urls.map(url => d3.json(url)))
      .then(dataArray => {
        // dataArray is an array of arrays, where each inner array is the data from one URL
        const combinedData = dataArray.flat(); // flatten the array of arrays into a single array
        // process the combined data here
        console.log(combinedData);
        buildCrimePieByStatus(combinedData);
        buildCrimePieByGender(combinedData);
        buildCrimePieByAge(combinedData);
        buildCrimePieByDescent(combinedData);
      })
      .catch(error => {
        console.error(error);
      });
  }

function buildCrimePieByStatus(crimeData) {
    let statusCounts = {};

    crimeData.forEach(crime => {
      let status = crime.status;
      if (statusCounts[status]) {
        statusCounts[status]++;
      } else {
        statusCounts[status] = 1;
      }
    });

    // Convert the object to an array of { status, count } objects
    let sortedData = Object.keys(statusCounts).map(status => ({
      status: status,
      count: statusCounts[status]
    }));

    // Sort the data by count of crimes in descending order
    sortedData.sort((a, b) => b.count - a.count);

    //prepare data for pie chart
    let statuses = sortedData.map(entry => entry.status);
    let counts = sortedData.map(entry => entry.count);
    let totalCrimes = counts.reduce((sum, count) => sum + count, 0);

    // Custom colors for the status pie chart
    let statusColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

    let chartData = {
      labels: ['Investigation Complete', 'Awaiting Action', 'Investigation Open', 'Juvenile Offender', 'Juvenile Arrest'],
      datasets: [{
        data: counts,
        backgroundColor: statusColors
      }]
    };

    let options = {
      title: {
        display: true,
        text: 'Crime Reports by Status'
      },
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          fontSize: 10,
          usePointStyle: true,
          fontColor: '#333',
          padding: 10
        }
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            let label = data.labels[tooltipItem.index];
            let value = data.datasets[0].data[tooltipItem.index];
            let percentage = (value / totalCrimes * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    };

    let ctx = document.getElementById('pie-crime-status').getContext('2d');
    return new Chart(ctx, {
      type: 'pie',
      data: chartData,
      options: options
    });
}

function buildCrimePieByGender(crimeData) {
      let genderCounts = {};
  
      crimeData.forEach(crime => {
        let gender = crime.vict_sex;
        if (genderCounts[gender]) {
            genderCounts[gender]++;
        } else {
            genderCounts[gender] = 1;
        }
      });
  
      // Convert the object to an array of { status, count } objects
      let sortedData = Object.keys(genderCounts).map(gender => ({
        gender: gender,
        count: genderCounts[gender]
      }));
  
      // Sort the data by count of crimes in descending order
      sortedData.sort((a, b) => b.count - a.count);
  
      //prepare data for pie chart
      let statuses = sortedData.map(entry => entry.status);
      let counts = sortedData.map(entry => entry.count);
      let totalCrimes = counts.reduce((sum, count) => sum + count, 0);
  
      // Custom colors for the status pie chart
      let genderColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];
  
      let chartData = {
        labels: ['Female', 'Male', 'Others', 'X'],
        datasets: [{
          data: counts,
          backgroundColor: genderColors
        }]
      };
  
      let options = {
        title: {
          display: true,
          text: 'Crime Reports by Gender'
        },
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            fontSize: 10,
            usePointStyle: true,
            fontColor: '#333',
            padding: 10
          }
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              let label = data.labels[tooltipItem.index];
              let value = data.datasets[0].data[tooltipItem.index];
              let percentage = (value / totalCrimes * 100).toFixed(2);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      };
  
      let ctx = document.getElementById('pie-crime-gender').getContext('2d');
      return new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: options
      });
    
}
  
function buildCrimePieByAge(crimeData) {
      let ageCounts = {};
  
      crimeData.forEach(crime => {
        let age = crime.vict_age;
        let ageRange;
    
        if (age <= 17) {
            ageRange = '0-17';
        } else if (age <= 30) {
            ageRange = '18-30';
        } else if (age <= 45) {
            ageRange = '31-45';
        } else if (age <= 60) {
            ageRange = '46-60';
        } else {
            ageRange = '61+';
        }
    
        if (ageCounts[ageRange]) {
            ageCounts[ageRange]++;
        } else {
            ageCounts[ageRange] = 1;
        }
      });
    
  
      // Convert the object to an array of { status, count } objects
      let sortedData = Object.keys(ageCounts).map(age => ({
        age: age,
        count: ageCounts[age]
      }));
  
      // Sort the data by count of crimes in descending order
      sortedData.sort((a, b) => b.count - a.count);
  
      //prepare data for pie chart
      let statuses = sortedData.map(entry => entry.age);
      let counts = sortedData.map(entry => entry.count);
      let totalCrimes = counts.reduce((sum, count) => sum + count, 0);
  
      // Custom colors for the age pie chart
      let ageColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

      let chartData = {
        labels: ['0-17', '18-30', '31-45', '46-60', '61+'],
        datasets: [{
          data: counts,
          backgroundColor: ageColors
        }]
      };
  
      let options = {
        title: {
          display: true,
          text: 'Crime Reports by Age'
        },
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            fontSize: 10,
            usePointStyle: true,
            fontColor: '#333',
            padding: 10
          }
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              let label = data.labels[tooltipItem.index];
              let value = data.datasets[0].data[tooltipItem.index];
              let percentage = (value / totalCrimes * 100).toFixed(2);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      };
  
      let ctx = document.getElementById('pie-crime-age').getContext('2d');
        return new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options: options
        });
        }
  
function buildCrimePieByDescent(crimeData) {
    let descentCounts = {};
    let validDescents = ['H', 'B', 'W', 'A', 'X', 'Unknown'];

    crimeData.forEach(crime => {
        let descent = crime.vict_descent; // Access the descent information for the current crime
        if (validDescents.includes(descent)) {
            if (descentCounts[descent]) {
              descentCounts[descent]++;
            } else {
              descentCounts[descent] = 1;
            }
        } else {
            if (descentCounts['Unknown']) {
              descentCounts['Unknown']++;
            } else {
              descentCounts['Unknown'] = 1;
            }
        }
    });

    // Convert the object to an array of { descent, count } objects
    let sortedData = Object.keys(descentCounts).map(descent => ({
        descent: descent,
      count: descentCounts[descent]
    }));

    // Sort the data by count of crimes in descending order
    sortedData.sort((a, b) => b.count - a.count);

    //prepare data for pie chart
    let descentes = sortedData.map(entry => entry.descent);
    let counts = sortedData.map(entry => entry.count);
    let totalCrimes = counts.reduce((sum, count) => sum + count, 0);

    // Custom colors for the descent pie chart
    let descentColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#f542f5'];
  
    let chartData = {
      labels: ['Caucasian', 'African American', 'Hispanic', 'Asian', 'Other', 'Unknown'],
      datasets: [{
        data: counts,
        backgroundColor: descentColors
      }]
    };

    let options = {
      title: {
        display: true,
        text: 'Crime Reports by descent'
      },
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          fontSize: 10,
          usePointStyle: true,
          fontColor: '#333',
          padding: 10
        }
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            let label = data.labels[tooltipItem.index];
            let value = data.datasets[0].data[tooltipItem.index];
            let percentage = (value / totalCrimes * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    };

    let ctx = document.getElementById('pie-crime-descent').getContext('2d');
    return new Chart(ctx, {
      type: 'pie',
      data: chartData,
      options: options
    });
}

loadData()