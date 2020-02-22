# oplx-py-flask-bgood
Demo to show basic functionality of SéBien prototype (MVP). Pyhton implementation will me adjusted to use web-scrapped data and predictions.

## Execution
Command line (local): `flask run` (will execute app.py and locally activate web service at http://127.0.0.1:5000/api)  
Command line (local): `flask run --cert=cert.pem --key=key.pem` (will execute app.py in secure mode to locally activate web service at http://127.0.0.1:5000/api using the local certificates included in this bundle)  
Heroku: configuration set in `Procfile`. Web service for event information can be tested pointing to web service using [https://oplx-py-flask-bgood.herokuapp.com/event](https://oplx-py-flask-bgood.herokuapp.com/event).  
Heroku: configuration set in `Procfile`. Web service for overlay information can be tested pointing to web service using [https://oplx-py-flask-bgood.herokuapp.com/overlay](https://oplx-py-flask-bgood.herokuapp.com/overlay).

## Files information
- `app.py` is a basic demo of web service using to consume envent and overlay innformation.  
- `requirements.txt`, `runtime.txt` and `Procfile` are used during web service execution (Heroku).  
- `main.html` contains a basic web implementation to show the infomration and interact with user to exploit it.
