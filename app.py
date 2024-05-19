from flask import Flask, render_template, jsonify, Response, request
from sqlalchemy import create_engine, text, inspect

app = Flask(__name__)
engine = create_engine('postgresql://postgres:postgres@localhost:5432/la_crimes_db')

@app.route("/")
def home():
    return render_template('index.html')

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
