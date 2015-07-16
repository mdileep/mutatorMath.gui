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
        rg = request.form['rg'] 
        instance = request.form['instance'] 
        toFile = sessionId + ".designspace"
        logFile = sessionId + ".log"
        toFile = os.path.join(toDir,toFile)

        if rg == "1":
            rg = True
        else:
            rg = False

        #TODO:Validate the xml text against xsd.
        lib.saveToText(toFile,text)
        mmWrapper.go(toFile,logFile,3,rg)
        
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

def showLogFile(filename):
    return uploader.showFile(filename,'.log')

def showXmlFile(filename):
    return uploader.showFile(filename,'.designspace')


def save(allowed,toFileName):

    toDir = app.config['UPLOAD_DIR']
    if not os.path.exists(toDir):
        os.makedirs(toDir)
    
    file = request.files['file']
    filePath = uploader.upload(file,toFileName,allowed)
    

    

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