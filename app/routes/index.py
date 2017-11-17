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
    sql = 'SELECT `id`, `university`, `overall` AS `OVERALL`, `arts` AS `ARTS`, `eng` AS `ENG`, `life_sci` AS `LIFE SCI`, `natural` AS `NATURAL`, `social` AS `SOCIAL` FROM university_subjects_abbr WHERE `arts` IS NOT NULL AND `eng` IS NOT NULL AND `life_sci` IS NOT NULL AND `natural` IS NOT NULL AND `social` IS NOT NULL'
    cursor.execute(sql)
    data = cursor.fetchall()
    cursor.close()
    return json.dumps(data)

def query_subject_details(table, combined_condition, output_dict, subject):
    cursor = mysql.connect().cursor()
    sql = 'SELECT * FROM ' + table + ' WHERE ' + combined_condition
    cursor.execute(sql)
    rows = cursor.fetchall()
    cursor.close()

    for row in rows:
        school_id = row['id']
        subject_list = output_dict[school_id]['subjects']
        for key in row.keys():
            if key in ['id', 'university', 'overall'] or not row[key]:
                continue
            temp = dict()
            temp['type'] = subject
            temp['subject'] = key
            temp['score'] = row[key]
            subject_list.append(temp)

# parallel coordinates
@app.route('/vis/get_subject_details')
def get_subject_details():
    ids = json.loads(request.args['ids'])

    conditions = []
    for school_id in ids:
        conditions.append('`id` = ' + str(school_id))
    combined_condition = ' OR '.join(conditions)

    output_dict = dict()

    cursor = mysql.connect().cursor()
    sql = 'SELECT * FROM university_abbr'
    cursor.execute(sql)
    rows = cursor.fetchall()
    cursor.close()
    for row in rows:
        school_id = row['id']
        school = row['name']
        abbr = row['abbr']

        temp_dict = dict()
        temp_dict['id'] = school_id
        temp_dict['university'] = school
        temp_dict['abbr'] = abbr
        temp_dict['subjects'] = []
        output_dict[school_id] = temp_dict

    query_subject_details('university_arts', combined_condition, output_dict, 'ARTS')
    query_subject_details('university_eng', combined_condition, output_dict, 'ENG')
    query_subject_details('university_life_sci', combined_condition, output_dict, 'LIFE SCI')
    query_subject_details('university_natural', combined_condition, output_dict, 'NATURAL')
    query_subject_details('university_social', combined_condition, output_dict, 'SOCIAL')

    output_list = []

    cursor = mysql.connect().cursor()
    sql = 'SELECT id, abbr FROM ' + 'university_subjects_abbr'
    cursor.execute(sql)
    rows = cursor.fetchall()
    cursor.close()

    abbr = {}
    for row in rows:
        abbr[row['id']] = row['abbr']

    for school_id in output_dict.keys():
        output_dict[school_id]['abbr'] = abbr[school_id]
        output_list.append(output_dict[school_id])

    return json.dumps(output_list)
