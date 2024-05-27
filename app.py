
from flask import Flask, render_template, jsonify, Response, request
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.engine.row import Row
import psycopg2
import requests


from flask import Flask, render_template, jsonify, Response, request
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.engine.row import Row
import psycopg2

app = Flask(__name__)
engine = create_engine('postgresql://postgres:postgres@localhost:5432/la_crimes_db', connect_args = {'connect_timeout':4})

# URL for the crime data
CRIME_DATA_URL = 'https://data.lacity.org/resource/2nrs-mtv8.json'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/bar')
def bar():
    return render_template('bar.html')

@app.route('/data/bar_graph/<int:offset>')
def bar_graph(offset):
    offset = offset * 150000
    conn = psycopg2.connect(
        dbname="la_crimes_db",
        user="postgres",
        password="postgres",
        host="localhost",
        port="5432"
    )
    with conn.cursor()as cur:
        cur.execute("SELECT * FROM bar_graph LIMIT 150000 OFFSET %s", (offset,))
        data = cur.fetchall()
        columns = [desc[0] for desc in cur.description]
        data_kv = []
        for row in data:
            data_kv.append(dict(zip(columns, row)))
    return jsonify(data_kv)

@app.route('/data/<int:offset>')
def data(offset):
    offset = offset*30000
    conn = psycopg2.connect(
        dbname="la_crimes_db",
        user="postgres",
        password="postgres",
        host="localhost",
        port="5432"
    )
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM crimes_table LIMIT 30000 OFFSET %s", (offset,))
        data = cur.fetchall()
    return jsonify(data)


@app.route('/random-sample')
def random_sample():
    # Generate a random sample of 50 numbers between 1 and 999
    sample = random.sample(range(1, 999), 50)
    return jsonify(sample)

@app.route('/crime-data')
def crime_data_endpoint():
    zip_code = request.args.get('zip_code')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    limit = int(request.args.get('limit', 1000))
    offset = int(request.args.get('offset', 0))
    
    query = f"?$limit={limit}&$offset={offset}"
    if zip_code:
        query += f"&location_1_zip={zip_code}"
    if start_date and end_date:
        query += f"&$where=date_occ between '{start_date}T00:00:00' and '{end_date}T23:59:59'"
    
    response = requests.get(f"{CRIME_DATA_URL}{query}")
    if response.status_code == 200:
        crime_data = response.json()
        return jsonify(crime_data)
    else:
        return jsonify({"error": "Failed to fetch crime data"}), response.status_code

@app.route('/data_page')
def data_page():
    return render_template('data.html')


@app.route('/data')
def get_data(): 
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 1000, type = int) #set limit per page
    offset = (page-1) * per_page
    query=text('''
               SELECT * 
               FROM crimes_table
               LIMIT :limit OFFSET :offset
               ''')
    conn=engine.connect()
    results = conn.execute(query, {'limit': per_page, 'offset': offset}).fetchall()
    conn.close()
    results = [dict(row) for row in results]
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
