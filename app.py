
from flask import Flask, render_template, jsonify, Response, request
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.engine.row import Row
import psycopg2
import requests

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

#need to update with Roha's actual html file
# @app.route('/pie')
# def pie():
#     return render_template('pie.html')

@app.route('/time')
def time():
    return render_template('time.html')

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

@app.route('/data/timeseries')
def get_combined_data():
    monthly_query = text('''
        SELECT
            SUM(CASE WHEN EXTRACT(MONTH FROM dt_occurred) = 1 THEN 1 ELSE 0 END) AS January,
            SUM(CASE WHEN EXTRACT(MONTH FROM dt_occurred) = 2 THEN 1 ELSE 0 END) AS February,
            SUM(CASE WHEN EXTRACT(MONTH FROM dt_occurred) = 3 THEN 1 ELSE 0 END) AS March,
            SUM(CASE WHEN EXTRACT(MONTH FROM dt_occurred) = 4 THEN 1 ELSE 0 END) AS April,
            SUM(CASE WHEN EXTRACT(MONTH FROM dt_occurred) = 5 THEN 1 ELSE 0 END) AS May,
            SUM(CASE WHEN EXTRACT(MONTH FROM dt_occurred) = 6 THEN 1 ELSE 0 END) AS June,
            SUM(CASE WHEN EXTRACT(MONTH FROM dt_occurred) = 7 THEN 1 ELSE 0 END) AS July,
            SUM(CASE WHEN EXTRACT(MONTH FROM dt_occurred) = 8 THEN 1 ELSE 0 END) AS August,
            SUM(CASE WHEN EXTRACT(MONTH FROM dt_occurred) = 9 THEN 1 ELSE 0 END) AS September,
            SUM(CASE WHEN EXTRACT(MONTH FROM dt_occurred) = 10 THEN 1 ELSE 0 END) AS October,
            SUM(CASE WHEN EXTRACT(MONTH FROM dt_occurred) = 11 THEN 1 ELSE 0 END) AS November,
            SUM(CASE WHEN EXTRACT(MONTH FROM dt_occurred) = 12 THEN 1 ELSE 0 END) AS December
        FROM crimes_table
    ''')

    hourly_query = text('''
        SELECT
            CASE
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 0 AND SUBSTRING(time_occ, 1, 2)::integer < 1 THEN '00:00 AM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 1 AND SUBSTRING(time_occ, 1, 2)::integer < 2 THEN '01:00 AM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 2 AND SUBSTRING(time_occ, 1, 2)::integer < 3 THEN '02:00 AM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 3 AND SUBSTRING(time_occ, 1, 2)::integer < 4 THEN '03:00 AM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 4 AND SUBSTRING(time_occ, 1, 2)::integer < 5 THEN '04:00 AM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 5 AND SUBSTRING(time_occ, 1, 2)::integer < 6 THEN '05:00 AM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 6 AND SUBSTRING(time_occ, 1, 2)::integer < 7 THEN '06:00 AM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 7 AND SUBSTRING(time_occ, 1, 2)::integer < 8 THEN '07:00 AM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 8 AND SUBSTRING(time_occ, 1, 2)::integer < 9 THEN '08:00 AM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 9 AND SUBSTRING(time_occ, 1, 2)::integer < 10 THEN '09:00 AM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 10 AND SUBSTRING(time_occ, 1, 2)::integer < 11 THEN '10:00 AM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 11 AND SUBSTRING(time_occ, 1, 2)::integer < 12 THEN '11:00 AM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 12 AND SUBSTRING(time_occ, 1, 2)::integer < 13 THEN '12:00 PM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 13 AND SUBSTRING(time_occ, 1, 2)::integer < 14 THEN '13:00 PM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 14 AND SUBSTRING(time_occ, 1, 2)::integer < 15 THEN '14:00 PM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 15 AND SUBSTRING(time_occ, 1, 2)::integer < 16 THEN '15:00 PM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 16 AND SUBSTRING(time_occ, 1, 2)::integer < 17 THEN '16:00 PM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 17 AND SUBSTRING(time_occ, 1, 2)::integer < 18 THEN '17:00 PM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 18 AND SUBSTRING(time_occ, 1, 2)::integer < 19 THEN '18:00 PM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 19 AND SUBSTRING(time_occ, 1, 2)::integer < 20 THEN '19:00 PM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 20 AND SUBSTRING(time_occ, 1, 2)::integer < 21 THEN '20:00 PM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 21 AND SUBSTRING(time_occ, 1, 2)::integer < 22 THEN '21:00 PM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 22 AND SUBSTRING(time_occ, 1, 2)::integer < 23 THEN '22:00 PM'
                WHEN SUBSTRING(time_occ, 1, 2)::integer >= 23 AND SUBSTRING(time_occ, 1, 2)::integer < 24 THEN '23:00 PM'
            END AS hour_interval,
            COUNT(*) AS count
        FROM
            crimes_table
        GROUP BY
            hour_interval
        ORDER BY
            hour_interval
    ''')

    with engine.connect() as conn:
        monthly_result = conn.execute(monthly_query).fetchone()
        hourly_results = conn.execute(hourly_query).fetchall()

    month_names = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    monthly_data = [{'month': month_names[i], 'count': monthly_result[i]} for i in range(12)]
    hourly_data = [{'hour_interval': row[0], 'count': row[1]} for row in hourly_results]

    return jsonify({'monthly': monthly_data, 'hourly': hourly_data})

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
