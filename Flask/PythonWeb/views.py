from flask import render_template,Response
from PythonWeb import app
from PythonWeb import uploader

@app.route('/')
def appHomePage():
    return render_template('index.html')

@app.route('/uploader')
def appUploader():
    return  uploader.uploadForm()

@app.route('/upload', methods=['POST'])
def appUpload():
    return uploader.upload('appGetFile')

@app.route('/uploads/<filename>')
def appGetFile(filename):
    return uploader.uploaded_file(filename)

