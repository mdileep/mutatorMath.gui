from flask import render_template, request, redirect, url_for, send_from_directory,Response
import os
from PythonWeb import app
from PythonWeb import uploader
from PythonWeb import mmWrapper
from PythonWeb import lib
from PythonWeb import zipHandler

def go():
    mmWrapper.go(2,True)
    return render_template('index.html')

def upload():
    try:
        file = request.files['file']
        toFileName = file.filename
        filePath = uploader.upload(file,toFileName)
        toDir=app.config['UPLOAD_DIR']
        destPath=""
        if filePath !="":
            destPath=zipHandler.extractZip(filePath,toDir)
        return lib.showTextContext(destPath)
    except Exception as inst:
        return lib.showTextContext(inst)

def sendFile(filename):
    return business.uploaded_file(filename)

def initConfig():
    if  'OPENSHIFT_DATA_DIR' in os.environ:
        uploadDir = os.environ['OPENSHIFT_DATA_DIR'] + '/uploads/'
    else:
        uploadDir = '/uploads/'
    if not os.path.exists(uploadDir):
        os.makedirs(uploadDir)
    app.config['UPLOAD_DIR'] = uploadDir
    app.config['ALLOWED_EXTENSIONS'] = set(['zip'])

initConfig()