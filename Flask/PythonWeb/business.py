from flask import render_template, request, redirect, url_for, send_from_directory,Response
import os
import glob
from datetime import datetime
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
        ufoVer= request.form['ufoVer'] 

        if rg == "1":
            rg = True
        else:
            rg = False

        if ufoVer=="2":
            ver=2 #Doing White listing so  not Parsing as int.
        else:
            ver=3
            

        lib.saveToText(toFile,text)
        mmWrapper.go(toFile,logFile,ver,rg)

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
    if filePath=="":
        raise ValueError('The given file is not a valid file. Please choose another file.')
    
    

    if filePath != "" and lib.findFileExt(filePath) == '.zip':
        isValidFile= zipHandler.isValidUFOZip(filePath)
        if isValidFile:
            destPath = zipHandler.extractZip(filePath,toDir)
            return destPath
        else:
            raise ValueError('The given zip file is not a valid UFO zip file. Please ensure zip file contains metainfo.plist.')
                
    else:
        #destPath = lib.findFileNameWithExt(filePath)
        raise ValueError('The given file is not a valid file. Please choose another file.')
    
    return destPath# Never Reaches??


def showEnvDetails():

    toDir = app.config['UPLOAD_DIR']
    s="Now: "+str( datetime.now())
    s= s+"\nUpload Directory: "+toDir
    s= s+"\n Is Exists: " +str(os.path.exists(toDir))
    if os.path.exists(toDir):
        s= s+"\n No. of zip Files(Load): "+str(len(glob.glob1(toDir,"*.zip")))
        s= s+"\n No. of Log Files(Sessions): "+str(len(glob.glob1(toDir,"*.log")))
    
    quota=os.path.join(app.config['DATA_DIR'],"quota.txt")
    if os.path.exists(quota):
        with open(quota, 'r') as content_file:
            content = content_file.read()
            s=s+"\nQuota Details:"
            s=s+"\n"+content

    last_hourly_cron_ran=os.path.join(app.config['DATA_DIR'],"last_hourly_cron_ran")
    if os.path.exists(last_hourly_cron_ran):
        with open(last_hourly_cron_ran, 'r') as content_file:
            content = content_file.read()
            s=s+"\nLast Hourly Cron exeuted at:"
            s=s+" "+content
    
    return lib.pushText(s)



def initConfig():
    if  'OPENSHIFT_DATA_DIR' in os.environ:
        app.config['DATA_DIR']=os.environ['OPENSHIFT_DATA_DIR']
        uploadDir =  os.environ['OPENSHIFT_DATA_DIR']+ 'uploads/'
    else:
        uploadDir = '/uploads/'
        app.config['DATA_DIR']='/uploads/'

    if not os.path.exists(uploadDir):
        os.makedirs(uploadDir)
    app.config['UPLOAD_DIR'] = uploadDir
    app.config['ALLOWED_EXTENSIONS'] = set(['zip','xml'])

initConfig()