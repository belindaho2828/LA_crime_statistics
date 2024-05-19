let url = 'http://127.0.0.1:5000/data_page';

// GET request to query url using d3
d3.json(url).then(function(data) {
    //console log data to test
    console.log(data);
});