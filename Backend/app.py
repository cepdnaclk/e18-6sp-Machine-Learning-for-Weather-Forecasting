from flask import Flask, request
from werkzeug.utils import secure_filename
import pandas as pd
import sqlite3
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestRegressor


app = Flask(__name__)

# Database setup
conn = sqlite3.connect('climate_data.db')
c = conn.cursor()

# MLflow setup
mlflow.set_tracking_uri("sqlite:///mlruns.db")


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files or 'location' not in request.form:
        return 'File or location not found in the request', 400

    f = request.files['file']
    location = request.form['location']

    f.save(secure_filename(f.filename))

    # # Load the data file into a pandas DataFrame
    data = pd.read_csv(f.filename)

    # # Store the data in the SQLite database
    # data.to_sql(location, conn, if_exists='replace')

    # # Train your model here using the data
    model = RandomForestRegressor()
    data = data.drop('date', axis=1)
    model.fit(data.drop('puttalam', axis=1), data['puttalam'])

    # # Log the model with MLflow
    with mlflow.start_run(run_name=location):
        mlflow.sklearn.log_model(model, "model")

    return 'File uploaded, data stored and model trained successfully'



@app.route('/predict', methods=['GET'])
def predict():
    if 'location' not in request.form or 'time' not in request.form:
        return 'Location or time not found in the request', 400

    location = request.form['location']              # get the location 

    # Load the latest model for this location from MLflow
    runs = mlflow.search_runs(filter_string=f"tags.mlflow.runName='{location}'")
    if runs.empty:
        return 'No model found for this location', 400

    latest_run_id = runs.loc[runs['start_time'].idxmax()]['run_id']
    model_uri = f"runs:/{latest_run_id}/model"
    
    model = mlflow.sklearn.load_model(model_uri)

    # return "model loaded success"

    # Load the data for this location from the SQLite database
    data = pd.read_sql_query(f"SELECT * FROM {location}", conn)

    # Make predictions using the model
    predictions = model.predict(data.drop('precipitation', axis=1))

    return str(predictions)  # Convert numpy array to string

if __name__ == '__main__':
    app.run(port=5000,debug=True)
