fetch('/data/timeseries')
    .then(response => response.json())
    .then(data => {
        // Extract month data
        const monthlyData = data.monthly;

        // Extract month intervals and counts
        const monthlyLabels = monthlyData.map(entry => entry.month);
        const monthlyCounts = monthlyData.map(entry => entry.count);

        // Create the line chart for monthly data
        const monthlyTrace = {
            x: monthlyLabels,
            y: monthlyCounts,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'blue' },
        };

        const monthlyLayout = {
            title: 'Monthly Crime Occurrences',
            xaxis: {
                title: 'Month'
            },
            yaxis: {
                title: 'Crime Count'
            }
        };

        Plotly.newPlot('LineChart', [monthlyTrace], monthlyLayout);

        // Extract hour data for radar chart
        const hourlyData = data.hourly;

        // Extract hour intervals and counts for radar chart
        const hourlyLabels = hourlyData.map(entry => entry.hour_interval);
        const hourlyCounts = hourlyData.map(entry => entry.count);

        // Create the radar chart for hourly data
        const radarCtx = document.getElementById('RadarChart').getContext('2d');
        const radarChart = new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: hourlyLabels,
                datasets: [{
                    label: 'Hourly Crime Counts',
                    data: hourlyCounts,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: Math.max(...hourlyCounts) + 10 // adjust max value for better visualization
                    }
                }
            }
        });
    })
    .catch(error => console.error('Error fetching data:', error));