from flask import render_template
from PythonWeb import app

@app.route('/')
def home():
    return render_template('index.html')