import json
import os
import csv
import unicodecsv
import codecs

from app import app
from flask import Flask, request
from flaskext.mysql import MySQL
from pymysql.cursors import DictCursor

from app.map.map import get_remain_code

mysql = MySQL(cursorclass=DictCursor)
app.config['MYSQL_DATABASE_USER'] = 'coni_admin'
app.config['MYSQL_DATABASE_PASSWORD'] = 'admin'
app.config['MYSQL_DATABASE_DB'] = 'coni_db'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

debug = False

@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/map_data/school_distribution')
def get_continents_school():
    map_scale = request.args['scale']
    if map_scale == 'world-continents':
        group_name = 'continent_code'
    else:
        group_name = 'country_code'
        if map_scale == 'asia':
            continent_name = 'as'
        elif map_scale == 'north-america':
            continent_name = 'na'
        elif map_scale == 'south-america':
            continent_name = 'sa'
        elif map_scale == 'europe':
            continent_name = 'eu'
        elif map_scale == 'africa':
            continent_name = 'af'
        elif map_scale == 'oceania':
            continent_name = 'oc'

    cursor = mysql.connect().cursor()
    sql = 'SELECT COUNT(`id`) as `count`, `{}` as `code` FROM university_geo'.format(group_name)
    if map_scale != 'world-continents':
        sql += ' WHERE `continent_code`="{}"'.format(continent_name)

    sql += ' GROUP BY `{}`'.format(group_name)
    cursor.execute(sql)
    rows = cursor.fetchall()
    cursor.close()

    results = []
    for row in rows:
        results.append([row['code'], row['count']])

    results += get_remain_code(map_scale)

    return json.dumps(results)

@app.route('/map_data/school_coordinates')
def get_school_coordinates():
    map_scale = request.args['scale']
    if map_scale == 'united-states':
        country_code = 'us'
    elif map_scale == 'canada':
        country_code = 'ca'
    elif map_scale == 'united-kingdom':
        country_code = 'gb'
    elif map_scale == 'netherlands':
        country_code = 'nl'
    elif map_scale == 'germany':
        country_code = 'de'
    elif map_scale == 'china':
        country_code = 'cn'
    elif map_scale == 'japan':
        country_code = 'jp'
    elif map_scale == 'south-korea':
        country_code = 'kr'
    elif map_scale == 'australia':
        country_code = 'au'

    cursor = mysql.connect().cursor()
    sql = 'SELECT `university` as `name`, `latitude` as `lat`, `longitude` as `lon` FROM university_geo WHERE `country_code`="{}"'.format(country_code)

    if map_scale == 'china':
        sql += ' OR `country_code`="tw"'

    cursor.execute(sql)
    rows = cursor.fetchall()
    cursor.close()

    return json.dumps(rows)

@app.route('/vis/get_subject_scores')
def get_subject_scores():
    region_condition = ''
    if 'scale' in request.args:
        map_scale = request.args['scale']
        if map_scale == 'united-states':
            country_code = 'us'
        elif map_scale == 'canada':
            country_code = 'ca'
        elif map_scale == 'united-kingdom':
            country_code = 'gb'
        elif map_scale == 'netherlands':
            country_code = 'nl'
        elif map_scale == 'germany':
            country_code = 'de'
        elif map_scale == 'china':
            country_code = 'cn'
        elif map_scale == 'japan':
            country_code = 'jp'
        elif map_scale == 'south-korea':
            country_code = 'kr'
        elif map_scale == 'australia':
            country_code = 'au'
        elif map_scale == 'asia':
            continent_name = 'as'
        elif map_scale == 'north-america':
            continent_name = 'na'
        elif map_scale == 'south-america':
            continent_name = 'sa'
        elif map_scale == 'europe':
            continent_name = 'eu'
        elif map_scale == 'africa':
            continent_name = 'af'
        elif map_scale == 'oceania':
            continent_name = 'oc'
        if map_scale in ['asia', 'north-america', 'south-america', 'europe', 'africa', 'oceania']:
            region_condition = 'id IN (SELECT id FROM university_geo WHERE `continent_code`="{}")'.format(continent_name)
        else:
            region_condition = 'id IN (SELECT id FROM university_geo WHERE `country_code`="{}")'.format(country_code)

    cursor = mysql.connect().cursor()
    sql = 'SELECT `id`, `university`, `overall` AS `OVERALL`, `arts` AS `ARTS`, `eng` AS `ENG`, `life_sci` AS `LIFE SCI`, `natural` AS `NATURAL`, `social` AS `SOCIAL` FROM university_subjects WHERE `arts` IS NOT NULL AND `eng` IS NOT NULL AND `life_sci` IS NOT NULL AND `natural` IS NOT NULL AND `social` IS NOT NULL'

    if region_condition:
        sql += ' AND ' + region_condition

    cursor.execute(sql)
    data = cursor.fetchall()
    cursor.close()
    return json.dumps(data)

def query_subject_details(table, id_condition, output_dict, subject, region_condition):
    cursor = mysql.connect().cursor()
    sql = 'SELECT * FROM ' + table
    if id_condition and not region_condition:
        sql += ' WHERE ' + id_condition
    elif not id_condition and region_condition:
        sql += ' WHERE ' + region_condition
    elif id_condition and region_condition:
        sql += ' WHERE ' + id_condition + ' AND ' + region_condition
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
    region_condition = ''
    id_condition = ''
    if 'scale' in request.args:
        map_scale = request.args['scale']
        if map_scale == 'united-states':
            country_code = 'us'
        elif map_scale == 'canada':
            country_code = 'ca'
        elif map_scale == 'united-kingdom':
            country_code = 'gb'
        elif map_scale == 'netherlands':
            country_code = 'nl'
        elif map_scale == 'germany':
            country_code = 'de'
        elif map_scale == 'china':
            country_code = 'cn'
        elif map_scale == 'japan':
            country_code = 'jp'
        elif map_scale == 'south-korea':
            country_code = 'kr'
        elif map_scale == 'australia':
            country_code = 'au'
        elif map_scale == 'asia':
            continent_name = 'as'
        elif map_scale == 'north-america':
            continent_name = 'na'
        elif map_scale == 'south-america':
            continent_name = 'sa'
        elif map_scale == 'europe':
            continent_name = 'eu'
        elif map_scale == 'africa':
            continent_name = 'af'
        elif map_scale == 'oceania':
            continent_name = 'oc'
        if map_scale in ['asia', 'north-america', 'south-america', 'europe', 'africa', 'oceania']:
            region_condition = 'id IN (SELECT id FROM university_geo WHERE `continent_code`="{}")'.format(continent_name)
        else:
            region_condition = 'id IN (SELECT id FROM university_geo WHERE `country_code`="{}")'.format(country_code)
    if 'ids' in request.args:
        ids = json.loads(request.args['ids'])
        conditions = []
        for school_id in ids:
            conditions.append('`id` = ' + str(school_id))
        id_condition = ' OR '.join(conditions)
        id_condition = '(' + id_condition + ')'

    output_dict = dict()

    cursor = mysql.connect().cursor()
    sql = 'SELECT * FROM university_abbr'
    if id_condition and not region_condition:
        sql += ' WHERE ' + id_condition
    elif not id_condition and region_condition:
        sql += ' WHERE ' + region_condition
    elif id_condition and region_condition:
        sql += ' WHERE ' + id_condition + ' AND ' + region_condition

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

    query_subject_details('university_arts', id_condition, output_dict, 'ARTS', region_condition)
    query_subject_details('university_eng', id_condition, output_dict, 'ENG', region_condition)
    query_subject_details('university_life_sci', id_condition, output_dict, 'LIFE SCI', region_condition)
    query_subject_details('university_natural', id_condition, output_dict, 'NATURAL', region_condition)
    query_subject_details('university_social', id_condition, output_dict, 'SOCIAL', region_condition)

    output_list = []
    for school_id in output_dict.keys():
        output_list.append(output_dict[school_id])

    return json.dumps(output_list)
