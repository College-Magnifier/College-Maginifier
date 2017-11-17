import json
import os
import csv
import unicodecsv
import codecs

from app import app
from flask import Flask, request
from flaskext.mysql import MySQL
from pymysql.cursors import DictCursor

mysql = MySQL(cursorclass=DictCursor)
app.config['MYSQL_DATABASE_USER'] = 'coni_admin'
app.config['MYSQL_DATABASE_PASSWORD'] = 'admin'
app.config['MYSQL_DATABASE_DB'] = 'coni_db'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

debug = False

def load_map_json_data(filename):
    json_url = os.path.join(app.root_path, 'data/map/' + filename + '.json')
    return json.load(open(json_url))

@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/map_data/school_distribution')
def get_continents_school():
    map_scale = request.args['scale']
    data = load_map_json_data(map_scale);
    return json.dumps(data)

@app.route('/vis/get_subject_scores')
def get_subject_scores():
    cursor = mysql.connect().cursor()
    sql = 'SELECT `id`, `university`, `overall` AS `OVERALL`, `arts` AS `ARTS`, `eng` AS `ENG`, `life_sci` AS `LIFE SCI`, `natural` AS `NATURAL`, `social` AS `SOCIAL` FROM university_subjects WHERE `arts` IS NOT NULL AND `eng` IS NOT NULL AND `life_sci` IS NOT NULL AND `natural` IS NOT NULL AND `social` IS NOT NULL'
    cursor.execute(sql)
    data = cursor.fetchall()
    cursor.close()
    return json.dumps(data)

@app.route('/data/<dataname>')
def _data(dataname):
    dataset = []
    fpath = 'app/data/' + dataname

    with codecs.open(fpath,'rU', errors='ignore') as data:

        reader = csv.reader(data, delimiter=',', quotechar='"')
        header = reader.next()

        for row in reader:
            item = {}
            for counter in range(len(header)):
                item[header[counter]] = row[counter]
            dataset.append(item)

    return json.dumps(dataset)
