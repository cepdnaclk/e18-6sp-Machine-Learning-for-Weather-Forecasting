import mlflow
from flask import Flask, jsonify, request
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from sklearn.externals import joblib
import sqlite3

app = Flask(__name__)

mlflow.set_tracking_uri("sqlite:///mlruns.db")
mlflow.set_experiment("flask_mlflow")

with mlflow.start_run():
    # Train a model
    conn = sqlite3.connect('database.db')
    df = pd.read_sql_query("SELECT * from data", conn)

    X = df.drop('target', axis=1)
    y = df['target']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    clf = LinearRegression()
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    rmse = mean_squared_error(y_test, y_pred)

    joblib.dump(clf, 'model.pkl')

    # Log the model
    mlflow.sklearn.log_model(clf, "model")


@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    df = pd.read_excel(file)
    conn = sqlite3.connect('database.db')
    df.to_sql('table_name', conn, if_exists='replace', index=True)
    return 'File uploaded successfully!'


@app.route('/predict', methods=['POST'])
def predict():
    json_ = request.json
    query_df = pd.DataFrame(json_)
    query = pd.get_dummies(query_df)
    
    # Load the model
    loaded_model = mlflow.sklearn.load_model("model")

    prediction = loaded_model.predict(query)

    return jsonify({'prediction': list(prediction)})

if __name__ == '__main__':
    app.run(port=8080,debug=True)
