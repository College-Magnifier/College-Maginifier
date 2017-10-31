import json
import os
import csv
import unicodecsv

from app import app
from flask import Flask, request


debug = False

@app.route('/')
def root():
	return app.send_static_file('index.html')

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

	return json.dumps(final_data)
