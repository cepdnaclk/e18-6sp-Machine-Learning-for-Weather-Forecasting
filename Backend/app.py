from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import pandas as pd
import sqlite3
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestRegressor
from datetime import datetime


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

    filename = f"{location}.csv"

    f.save(secure_filename(filename))

    # Load the data file into a pandas DataFrame
    weather = pd.read_csv(filename)

    # Create a target column
    weather['date'] = pd.to_datetime(weather['date'])  # Convert 'Date' column to DateTime format
    weather.sort_values(by='date', inplace=True)

    weather['target'] = weather['puttalam'].shift(-1)
    weather.dropna(inplace=True)        # Drop the last row

    weather4 = weather.copy()

    X_train =  weather4[weather4['date'] < pd.to_datetime("1/1/2006")].drop(['date', 'target'], axis=1)
    y_train = weather4[weather4['date'] < pd.to_datetime("1/1/2006")]['target']

    selected_features = ['rsuscs', 'wap_850', 'tro3_500', 'sbl', 'puttalam', 'sfcWind', 'rtmt',
        'va_500', 'tro3_850', 'rsds', 'rsutcs', 'rsdt', 'ta_850', 'rsus',
        'hurs', 'rsdscs', 'clwvi', 'hfss', 'ua_500', 'va_850', 'ta_500', 'clt',
        'zg_850', 'hfls', 'clivi', 'rlutcs', 'prc', 'zg_500', 'prw', 'evspsbl']

    model = RandomForestRegressor(n_estimators=100, random_state=42)

    model.fit(X_train[selected_features], y_train)

    # # Log the model with MLflow
    with mlflow.start_run(run_name=location):
        mlflow.sklearn.log_model(model, "model")

    return 'File uploaded, data stored and model trained successfully'





@app.route('/predict', methods=['GET'])
def predict():
    if 'location' not in request.form or 'time' not in request.form:
        return 'Location or time not found in the request', 400

    location = request.form['location']              # get the location 
    time = datetime.strptime(request.form['time'], '%m/%d/%Y')  # get the time

    # Load the latest model for this location from MLflow
    runs = mlflow.search_runs(filter_string=f"tags.mlflow.runName='{location}'")
    if runs.empty:
        return 'No model found for this location', 400

    latest_run_id = runs.loc[runs['start_time'].idxmax()]['run_id']
    model_uri = f"runs:/{latest_run_id}/model"
    
    model = mlflow.sklearn.load_model(model_uri)

    # Load the data for this location from the uploaded Excel file
    data = pd.read_csv(f"{location}.csv")

    # Convert 'date' column to DateTime format and find nearest date row for prediction
    data['date'] = pd.to_datetime(data['date'], format='%m/%d/%Y')

    data['delta'] = abs(data['date'] - time)
    
    nearest_date_row_df = data.loc[data['delta'].idxmin()].to_frame().T

    selected_features = ['rsuscs', 'wap_850', 'tro3_500', 'sbl', 'puttalam', 'sfcWind', 'rtmt',
        'va_500', 'tro3_850', 'rsds', 'rsutcs', 'rsdt', 'ta_850', 'rsus',
        'hurs', 'rsdscs', 'clwvi', 'hfss', 'ua_500', 'va_850', 'ta_500', 'clt',
        'zg_850', 'hfls', 'clivi', 'rlutcs', 'prc', 'zg_500', 'prw', 'evspsbl']

    # Drop unnecessary columns and ensure all necessary columns are present
    nearest_date_row_df.drop(['date','delta','puttalam'], axis=1, inplace=True)
    for feature in selected_features:
        if feature not in nearest_date_row_df.columns:
            nearest_date_row_df[feature] = 0  # or some other default value 
    
    # Make predictions using the model
    predictions = model.predict(nearest_date_row_df[selected_features])
    
    return str(predictions)  # Convert numpy array to string


if __name__ == '__main__':
    app.run(port=5000,debug=True)
