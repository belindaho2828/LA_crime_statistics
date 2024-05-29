from flask import Flask, render_template, jsonify, Response, request
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.engine.row import Row
import psycopg2
import requests

app = Flask(__name__)
app.static_folder = 'static'
engine = create_engine('postgresql://postgres:postgres@localhost:5432/la_crimes_db', connect_args = {'connect_timeout':4})

# URL for the crime data
CRIME_DATA_URL = 'https://data.lacity.org/resource/2nrs-mtv8.json'

@app.route('/pie')
def pie():
    return render_template('pie.html')

@app.route('/data/pie_chart/<int:offset>')
def pie_data(offset):
    offset = offset * 100000
    conn = psycopg2.connect(
        dbname="la_crimes_db",
        user="postgres",
        password="postgres",
        host="localhost",
        port="5432"
    )
    with conn.cursor() as cur:
        cur.execute("SELECT status, status_desc, crime_code, vict_sex, vict_age, vict_descent FROM crimes_table LIMIT 100000 OFFSET %s", (offset,))
        data = cur.fetchall()
        columns = [desc[0] for desc in cur.description]
        data_kv = []
        for row in data:
            data_kv.append(dict(zip(columns, row)))
    return jsonify(data_kv)

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
