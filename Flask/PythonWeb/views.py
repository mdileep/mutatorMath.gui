from flask import render_template,Response
from PythonWeb import app
from PythonWeb import business
from datetime import datetime


@app.route('/')
def appHomePage():
    return render_template('index.html', now=datetime.now())

@app.route('/go')
def appGo():
    return business.go()

@app.route('/uploader')
def appUploader():
    return  render_template('uploader.html')

@app.route('/upload', methods=['POST'])
def appUpload():
    return business.upload()

@app.route('/uploads/<filename>')
def appGetFile(filename):
    return business.sendFile(filename)