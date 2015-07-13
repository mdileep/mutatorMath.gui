import os
from flask import render_template, request, redirect, url_for, send_from_directory,Response
from werkzeug import secure_filename
from PythonWeb import app
from PythonWeb import lib


def allowed_file(filename,allowed):
    if(allowed == None or allowed == []):
        allowed = app.config['ALLOWED_EXTENSIONS']
    return '.' in filename and filename.rsplit('.', 1)[1] in allowed

def upload(file,toFileName,allowed):
    srcFileName = file.filename
    if file and allowed_file(srcFileName,allowed):
        filename = secure_filename(toFileName)
        destPath = os.path.join(app.config['UPLOAD_DIR'], filename)
        file.save(destPath)
        return destPath
    else:
        return ""

def uploaded_file(filename):
    try:
        dirPath = os.path.abspath(app.config['UPLOAD_DIR'])
        if os.path.isfile(os.path.join(dirPath,filename)):
            return send_from_directory(dirPath,filename,as_attachment=True)
        else:
            return lib.pushText("Sorry the requested file [" + filename + "] doesn't exist.Please note that log files and output files on this server available only for 1 hour.")
    except Exception as err:
        return lib.pushText('Following error occured while processing retrieving the file ['+filename+']\n'+str(err))