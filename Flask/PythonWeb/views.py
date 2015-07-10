from flask import render_template,Response
from PythonWeb import app
from PythonWeb import lib
from PythonWeb import business
from datetime import datetime

@app.route('/')
def appHomePage():
    return render_template('index.html', now=datetime.now(),sessionId=lib.getNewSessionId())

@app.route('/Uploader')
@app.route('/uploader')
def appUploader():
    return  render_template('uploader.html')

@app.route('/Upload.zip', methods=['POST'])
@app.route('/upload.zip', methods=['POST'])
def appUploadZip():
    return business.upload(['zip'])

@app.route('/Download/<filename>')
@app.route('/download/<filename>')
def appGetFile(filename):
    return business.sendFile(filename)

@app.route('/Run', methods=['POST'])
@app.route('/run', methods=['POST'])
def appGo():
    return business.run()
