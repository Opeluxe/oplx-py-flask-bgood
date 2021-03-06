#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import pandas as pd
from datetime import datetime, timezone
import flask
from flask import request
from flask import render_template
import os
import json
import calendar

import warnings
warnings.filterwarnings("ignore")

# Constants for layout and dataframe manipulation
DATA_EVENT_PATH = os.path.dirname(os.path.abspath(__file__)) + '/app/data/event.csv'
DATA_OVERLAY_PATH = os.path.dirname(os.path.abspath(__file__)) + '/app/data/overlay.csv'
EVENT_SORT = ['From', 'To']
OVERLAY_SORT = ['Type', 'Intensity', 'From', 'To']

# Data manipulation routines
def load_data(date_, period_=False):
    event_data = select_data(DATA_EVENT_PATH, EVENT_SORT, date_, period_)
    overlay_data = select_data(DATA_OVERLAY_PATH, OVERLAY_SORT, date_, period_)
    return event_data, overlay_data
    
def load_event_data(date_, period_=False):
    return select_data(DATA_EVENT_PATH, EVENT_SORT, date_, period_)
    
def load_overlay_data(date_, period_=False):
    return select_data(DATA_OVERLAY_PATH, OVERLAY_SORT, date_, period_)
        
def select_data(path_, sort_, date_, period_=False):
    loaded_data = pd.read_csv(path_, sep=';', error_bad_lines=False, low_memory=False)
    selected_data = select_between_dates(loaded_data, date_, period_)
    selected_data.sort_values(by=sort_, inplace=True)
    return selected_data
    
def select_between_dates(data_, date_, period_=False):
    selected_data = data_
    dateFrom, dateTo = select_period_dates(date_, period_)
    selected_data['Date'] = pd.to_datetime(selected_data['Date'],yearfirst=True)
    selected_data['DateFrom'] = selected_data.apply(lambda row: datetime(year=row['Date'].year,
                                                                         month=row['Date'].month,
                                                                         day=row['Date'].day,
                                                                         hour=row['From'],
                                                                         tzinfo=timezone.utc).astimezone(), axis=1)
    selected_data['DateTo'] = selected_data.apply(lambda row: datetime(year=row['Date'].year,
                                                                       month=row['Date'].month,
                                                                       day=row['Date'].day,
                                                                       hour=row['To'],
                                                                       tzinfo=timezone.utc).astimezone(), axis=1)
    selected_data = selected_data[(selected_data['DateFrom'] <= dateTo) & 
                                  (selected_data['DateTo'] >= dateFrom)]
    #selected_data.drop('DateFrom', axis=1, inplace=True)
    #selected_data.drop('DateTo', axis=1, inplace=True)
    return selected_data
    
def select_period_dates(date_, period_=False):
    if period_ == True:
        dt = datetime.strptime(date_, '%Y-%m-%dT%H:%M:%S.%fZ')
        dt = datetime.combine(dt.date(), datetime.min.time())
        dateFrom = dt.replace(day=1, tzinfo=timezone.utc).astimezone()
        dt = datetime.combine(dt.date(), datetime.max.time())
        dateTo = dt.replace(day=calendar.monthrange(dt.year,dt.month)[1], tzinfo=timezone.utc).astimezone()
        return dateFrom, dateTo
    else:
        return date_, date_
    
def process_request(request_, type_):
    if request_.method == 'POST':
        _date = request_.get_json()['date']
        _period = request_.get_json()['period']
    else:
        _date = datetime.now(timezone.utc).astimezone()
        _period = False
    if type_ == 'event':
        _data = load_event_data(_date, _period)
    else:
        _data = load_overlay_data(_date, _period)
    return flask.jsonify(json.loads(_data.to_json(orient='records')))


app = flask.Flask(__name__)

#defining a route for only post requests for event data
@app.route('/event', methods=['GET', 'POST'])
def event():
    return process_request(request, 'event')
    
#defining a route for only post requests for overlay data
@app.route('/overlay', methods=['GET', 'POST'])
def overlay():
    return process_request(request, 'overlay')
    
#defining a route for rendering main page
@app.route('/')
@app.route('/main')
def main():
    return render_template('main.html')
    