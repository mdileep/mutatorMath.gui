import os
from flask import render_template, request, redirect, url_for, send_from_directory,Response
from werkzeug import secure_filename
from PythonWeb import app
from PythonWeb import lib

def initConfig():
    if  'OPENSHIFT_DATA_DIR' in os.environ:
        uploadDir = os.environ['OPENSHIFT_DATA_DIR'] + '/uploads/'
    else:
        uploadDir = '/uploads/'
    if not os.path.exists(uploadDir):
        os.makedirs(uploadDir)
    app.config['UPLOAD_DIR']=uploadDir
    app.config['ALLOWED_EXTENSIONS'] = set(['zip'])

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']

def uploadForm():
    return render_template('uploader.html')

def upload(postHandler):
    try:
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_DIR'], filename))
            file_url = url_for(postHandler,filename=filename)
            return redirect(file_url)
    except Exception as inst:
        return lib.showTextContext(inst)

def uploaded_file(filename):
    try:
        dirPath = os.path.abspath(app.config['UPLOAD_DIR'])
        return send_from_directory(dirPath,filename)
    except Exception as inst:
        lib.showException(inst)

initConfig()