import json
import os
import csv
import unicodecsv
import codecs

from app import app
from flask import Flask, request


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
