import json
import os
import csv
import unicodecsv

from app import app
from flask import Flask, request


debug = False
type_abbr_map = {
    "General" : "GE",
    "Agricultural Sciences" : "AGRI",
    "Arts and Humanities" : "AH",
    "Biology and Biochemistry" : "BIO",
    "Chemistry" : "CHEM",
    "Clinical Medicine" : "CM",
    "Computer Science" : "CS",
    "Economics and Business" : "BE",
    "Engineering" : "ENG",
    "Environment/Ecology" : "ENV",
    "Geosciences" : "GEO",
    "Immunology" : "IMMU",
    "Materials Science" : "MS",
    "Mathematics" : "MATH",
    "Microbiology" : "MICRO",
    "Molecular Biology and Genetics" : "MBG",
    "Neuroscience and Behavior" : "NSB",
    "Pharmacology and Toxicology" : "PT",
    "Physics" : "PHY",
    "Plant and Animal Science" : "PAS",
    "Psychiatry/Psychology" : "PSY",
    "Social Sciences and Public Health" : "SSPH",
    "Space Science" : "SS"
}

@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/map_data/school_distribution')
def get_continents_school():
    map_scale = request.args['scale']
    data = load_map_json_data(map_scale);
    return json.dumps(data)

def load_map_json_data(filename):
    json_url = os.path.join(app.root_path, 'data/map/' + filename + '.json')
    return json.load(open(json_url))

@app.route('/list')
def _list():
    datalist = [name for name in os.listdir("app/data")]

    if ".DS_Store" in datalist:
        datalist.remove(".DS_Store")

    return json.dumps(datalist)

@app.route('/data/<dataname>')
def _data(dataname):
    # data preprocessing
    fpath = 'app/data/' + dataname
    data = []
    final_data = {}
    header = []
    top = 10

    with open(fpath,'rU') as f:
        reader = unicodecsv.reader(f,encoding='utf-8-sig')
        header = reader.next()

        for row in reader:
            university = {}
            ranks = []
            index = 0
            for value in row:
                if header[index] == "Name":
                     university["Name"] = value
                elif header[index] == "Country":
                     university["Country"] = value
                elif header[index] == "Location":
                     university["Location"] = value
                else:

                    if value != "N":
                        obj = {
                            "type" : index,
                            "rank" : int(value),
                            "Name" : university["Name"]
                            }
                        ranks.append(obj)
                index += 1

            university["ranks"] = ranks
            data.append(university)

        data = data[0 : top]

        final_data["header"] = header
        final_data["data"] = data
        final_data["other_info"] = {
            "type_abbr_map" : type_abbr_map,
        }

    return json.dumps(final_data)
