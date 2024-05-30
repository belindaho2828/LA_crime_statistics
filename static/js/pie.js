const url = 'http://127.0.0.1:5000/data';

// Test the API
d3.json(url).then((test_data) => {
  console.log(test_data);
  buildCrimePieByStatus();
  buildCrimePieByGender();
  buildCrimePieByAge();
  buildCrimePieByDescent();
});

function buildCrimePieByStatus() {
  d3.json(url).then((crimeData) => {
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
  }).then((chart) => {
    // Destroy the previous chart, if any
    if (window.myPieChart1) {
      window.myPieChart1.destroy();
    }
    window.myPieChart1 = chart;
  });
}

function buildCrimePieByGender() {
    d3.json(url).then((crimeData) => {
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
    }).then((chart) => {
      // Destroy the previous chart, if any
      if (window.myPieChart2) {
        window.myPieChart2.destroy();
      }
      window.myPieChart2 = chart;
    });
}
  
function buildCrimePieByAge() {
    d3.json(url).then((crimeData) => {
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
        }).then((chart) => {
        // Destroy the previous chart, if any
        if (window.myPieChart3) {
            window.myPieChart3.destroy();
        }
        window.myPieChart3 = chart;
    });
}
  
function buildCrimePieByDescent() {
  d3.json(url).then((crimeData) => {
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
  }).then((chart) => {
    // Destroy the previous chart, if any
    if (window.myPieChart4) {
      window.myPieChart4.destroy();
    }
    window.myPieChart4 = chart;
  });
}