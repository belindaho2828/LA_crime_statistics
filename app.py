from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# URL for the crime data
CRIME_DATA_URL = 'https://data.lacity.org/resource/2nrs-mtv8.json'

@app.route('/pie')
def pie():
    return app.render_template('pie.html')

@app.route('/data', methods=['GET'])
def get_crime_data():
    # Fetch the crime data from the API
    response = requests.get(CRIME_DATA_URL)
    data = response.json()

    # Process the data to get the necessary information
    crime_data = []
    for crime in data:
        crime_data.append({
            'status': crime.get('status', 'Unknown'),
            'vict_sex': crime.get('vict_sex', 'Unknown'),
            'vict_age': crime.get('vict_age', 'Unknown'),
            'vict_descent': crime.get('vict_descent', 'Unknown'),
            'crime_code': crime.get('crm_cd', 'Unknown')
        })

    return jsonify(crime_data)

if __name__ == '__main__':
    app.run(debug=True)
