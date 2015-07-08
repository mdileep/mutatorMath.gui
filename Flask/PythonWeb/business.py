from flask import render_template, request, redirect, url_for, send_from_directory,Response
import os,string
import random
from PythonWeb import app
from PythonWeb import uploader
from PythonWeb import mmWrapper
from PythonWeb import lib
from PythonWeb import zipHandler

def run():
    try:
        text= request.form['txt.xml'] 
        toDir=app.config['UPLOAD_DIR']
        instanceFile= request.form['instance'] 
        rName="".join( [random.choice(string.digits) for i in   xrange(10)])
        toFile=rName+".designspace"
        lib.saveToText(os.path.join(toDir,toFile ),text)
        #TODO:Validate the xml text against xsd.
        #Don't Depend on instanceFile value to get the File name.Remove this dependency
        #make sure instance file name is unique
        #make sure random text is also unique.
        #may be use session based directories.
        mmWrapper.go(os.path.join(toDir,toFile),2,True)
        zipHandler.zipDirectory(os.path.join(toDir,instanceFile+'.zip'))
        return sendFile(os.path.join(toDir,instanceFile+'.zip'))
    except Exception as err:
        return lib.pushText(err)

def upload(allowed):
    try:
        id = request.form['id']
        destPath=save(allowed)
        arr=[id,destPath]
        return lib.pushLoadScript('window.top.SourcesWorker.successCallBack',arr)
    except Exception as err:
        return lib.pushLoadScript('window.top.SourcesWorker.errorCallBack',[id,err])

def sendFile(filename):
    return uploader.uploaded_file(filename)

def save(allowed):
    file = request.files['file']
    toFileName = file.filename
    filePath = uploader.upload(file,toFileName,allowed)
    toDir=app.config['UPLOAD_DIR']
    destPath=""
    if filePath !="" and lib.findFileExt(filePath)=='.zip':
        destPath=zipHandler.extractZip(filePath,toDir)
    else:
        destPath= lib.findFileNameWithExt(filePath)
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