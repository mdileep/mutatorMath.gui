from flask import render_template,Response
from PythonWeb import app
from PythonWeb import lib
from PythonWeb import business
from datetime import datetime

@app.route('/')
def appHomePage():
    return render_template('index.html', now=datetime.now(),sessionId=lib.getNewSessionId())

@app.route('/env')
def appEnv():
    toDir = app.config['UPLOAD_DIR']
    return lib.pushText(toDir+"  :"+os.path.exists(toDir))



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


@app.route('/View/<filename>.designspace')
@app.route('/view/<filename>.designspace')
def appShowXmlFile(filename):
    return business.showXmlFile(filename)


@app.route('/View/<filename>.log')
@app.route('/view/<filename>.log')
def appShowFile(filename):
    return business.showLogFile(filename)


@app.route('/Run', methods=['POST'])
@app.route('/run', methods=['POST'])
def appGo():
    return business.run()
