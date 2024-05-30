from flask import Flask, render_template, jsonify, Response, request
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.engine.row import Row
import psycopg2

app = Flask(__name__)
engine = create_engine('postgresql://postgres:postgres@localhost:5432/la_crimes_db', connect_args = {'connect_timeout':4})

@app.route("/")
def home():
    return render_template('index.html')

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
