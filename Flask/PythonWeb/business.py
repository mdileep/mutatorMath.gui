from flask import render_template, request, redirect, url_for, send_from_directory,Response
import os
from PythonWeb import app
from PythonWeb import uploader
from PythonWeb import mmWrapper
from PythonWeb import lib
from PythonWeb import zipHandler

def run():
    try:
        text = request.form['txt.xml'] 
        toDir = app.config['UPLOAD_DIR']
        sessionId = request.form['sessionId'] 
        instance = request.form['instance'] 
        toFile = sessionId + ".designspace"
        logFile = sessionId + ".log"
        toFile = os.path.join(toDir,toFile)

        #TODO:Validate the xml text against xsd.
        lib.saveToText(toFile,text)
        mmWrapper.go(toFile,logFile,2,True)
        
        arr = instance.split(',')
        for instanceFile in arr:
            zipHandler.zipDirectory(os.path.join(toDir,instanceFile),os.path.join(toDir,instanceFile + '.zip'))


        sessionId = lib.getNewSessionId()

        return lib.pushLoadScript('window.top.ComputeWorker.successCallBack',[sessionId])

    except Exception as err:
        return lib.pushLoadScript('window.top.ComputeWorker.errorCallBack',[str(err)])

def upload(allowed):
    try:
        id = request.form['id']
        sessionId = request.form['sessionId'] 
        file = request.files['file']


        destPath = save(allowed, "source_" + id + "_" + sessionId + lib.findFileExt(file.filename))

        arr = [id,destPath,  lib.findFileName(file.filename)]

        return lib.pushLoadScript('window.top.SourcesWorker.successCallBack',arr)

    except Exception as err:
        return lib.pushLoadScript('window.top.SourcesWorker.errorCallBack',[id,str(err)])

def sendFile(filename):
    return uploader.uploaded_file(filename)

def save(allowed,toFileName):
    file = request.files['file']

    #toFileName = file.filename

    filePath = uploader.upload(file,toFileName,allowed)
    toDir = app.config['UPLOAD_DIR']
    destPath = ""
    if filePath != "" and lib.findFileExt(filePath) == '.zip':
        destPath = zipHandler.extractZip(filePath,toDir)
    else:
        destPath = lib.findFileNameWithExt(filePath)
    return destPath


def initConfig():
    if  'OPENSHIFT_DATA_DIR' in os.environ:
        uploadDir = os.environ['OPENSHIFT_DATA_DIR'] + '/uploads/'
    else:
        uploadDir = '/uploads/'
    if not os.path.exists(uploadDir):
        os.makedirs(uploadDir)
    app.config['UPLOAD_DIR'] = uploadDir
    app.config['ALLOWED_EXTENSIONS'] = set(['zip','xml'])

initConfig()