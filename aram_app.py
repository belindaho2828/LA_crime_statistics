from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

# URL for the crime data
CRIME_DATA_URL = 'https://data.lacity.org/resource/2nrs-mtv8.json'
CRIME_DATA_COUNT_URL = 'https://data.lacity.org/resource/2nrs-mtv8.json?$select=count(*)'

@app.route('/')
def home():
    return app.send_static_file('index.html')

@app.route('/crime-data')
def crime_data_endpoint():
    zip_code = request.args.get('zip_code')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    limit = int(request.args.get('limit', 1000))
    offset = int(request.args.get('offset', 0))
    city = request.args.get('city')

    query = f"?$limit={limit}&$offset={offset}"
    if zip_code:
        query += f"&location_1_zip={zip_code}"
    if start_date and end_date:
        query += f"&$where=date_occ between '{start_date}T00:00:00' and '{end_date}T23:59:59'"
    if city:
        query += f"&area_name={city}"

    response = requests.get(f"{CRIME_DATA_URL}{query}")
    if response.status_code == 200:
        crime_data = response.json()
        return jsonify(crime_data)
    else:
        return jsonify({"error": "Failed to fetch crime data"}), response.status_code

@app.route('/paged-crime-data')
def paged_crime_data():
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 1000))
    offset = (page - 1) * limit

    response = requests.get(f"{CRIME_DATA_URL}?$limit={limit}&$offset={offset}")
    if response.status_code == 200:
        crime_data = response.json()
        return jsonify(crime_data)
    else:
        return jsonify({"error": "Failed to fetch crime data"}), response.status_code

@app.route('/crime-data-count')
def crime_data_count():
    response = requests.get(CRIME_DATA_COUNT_URL)
    if response.status_code == 200:
        count = response.json()[0]['count']
        return jsonify({'total': int(count)})
    else:
        return jsonify({"error": "Failed to fetch crime data count"}), response.status_code

if __name__ == '__main__':
    app.run(debug=True)
