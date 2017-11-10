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

@app.route('/list')
def _list():
    datalist = [name for name in os.listdir("app/data")]

    if ".DS_Store" in datalist:
        datalist.remove(".DS_Store")

    return json.dumps(datalist)

@app.route('/data/<dataname>')
def _data(dataname):
    # data preprocessing
	type_rank = {}

	fpath = 'app/data/' + dataname
	with open(fpath) as f:
		dataset = json.load(f)
		for univ in dataset["data"]:
			years = {}
			for item in univ["scores"]:
				year = item["year"]
				years[year] = item["detail"]
				if not type_rank.has_key(year):
					type_rank[year] = {}
				for detail in years[year]:
					if type_rank[year].has_key(detail["type"]):
						type_rank[year][detail["type"]].append(detail["score"])
					else:
						type_rank[year][detail["type"]] = []
						type_rank[year][detail["type"]].append(detail["score"])
			univ["scores"] = years

		for year in type_rank:
			for type in type_rank[year]:
				type_rank[year][type].sort(reverse = True)

		for univ in dataset["data"]:
			for item in univ["scores"]:
				for detail in univ["scores"][item]:
					detail["rank"] = type_rank[item][detail["type"]].index(detail["score"])

	return json.dumps(dataset)
