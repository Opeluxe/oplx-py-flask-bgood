#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import pandas as pd
from datetime import datetime
#import numpy as np
#import dill as pickle
import flask
from flask import request
import os
import json

import warnings
warnings.filterwarnings("ignore")

# Constants for layout and dataframe manipulation
DATA_EVENT_PATH = os.path.dirname(os.path.abspath(__file__)) + '/data/event.csv'
DATA_OVERLAY_PATH = os.path.dirname(os.path.abspath(__file__)) + '/data/overlay.csv'
EVENT_SORT = ['From', 'To']
OVERLAY_SORT = ['Type', 'Intensity', 'From', 'To']

# Data manipulation routines
def load_data(date_):
    event_data = select_data(DATA_EVENT_PATH, EVENT_SORT, date_)
    overlay_data = select_data(DATA_OVERLAY_PATH, OVERLAY_SORT, date_)
    return event_data, overlay_data
    
def load_event_data(date_):
    return select_data(DATA_EVENT_PATH, EVENT_SORT, date_)
    
def load_overlay_data(date_):
    return select_data(DATA_OVERLAY_PATH, OVERLAY_SORT, date_)
        
def select_data(path_, sort_, date_):
    loaded_data = pd.read_csv(path_, sep=';', error_bad_lines=False, low_memory=False)
    selected_data = select_between_dates(loaded_data, date_)
    selected_data.sort_values(by=sort_, inplace=True)
    return selected_data
    
def select_between_dates(data_, date_):
    selected_data = data_
    selected_data['DateFrom'] = datetime(year = selected_data['Date'].year,
                                         month = selected_data['Date'].month,
                                         day = selected_data['Date'].day,
                                         hour = selected_data['From'].hour)
    selected_data['DateTo'] = datetime(year = selected_data['Date'].year,
                                       month = selected_data['Date'].month,
                                       day = selected_data['Date'].day,
                                       hour = selected_data['To'].hour)
    selected_data = selected_data[(selected_data['DateFrom'] <= date_) & 
                                  (selected_data['DateTo'] >= date_)]
    selected_data.drop('DateFrom', axis=1, inplace=True)
    selected_data.drop('DateTo', axis=1, inplace=True)
    return selected_data
    
app = flask.Flask(__name__)

#defining a route for only post requests for events data
@app.route('/event', methods=['POST'])
def event():
    #getting an array of features from the post request's body
    date = request.get_json()['date']
    print("Date: {}, Sample: {}, Random: {}".format(date))
    
    #get events data
    event_data = load_event_data(date)

    #returning the response object as json
    return flask.jsonify(json.loads(event_data.to_json(orient='records')))
    
#defining a route for only post requests for overlays data
@app.route('/overlay', methods=['POST'])
def overlay():
    #getting an array of features from the post request's body
    date = request.get_json()['date']
    print("Date: {}, Sample: {}, Random: {}".format(date))
    
    #get overlay data
    overlay_data = load_overlay_data(date)

    #returning the response object as json
    return flask.jsonify(json.loads(event_data.to_json(orient='records')))