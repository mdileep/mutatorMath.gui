from flask import render_template,Response
from PythonWeb import app
from PythonWeb import lib
from PythonWeb import business
from datetime import datetime

def renderTemplate(htmlPage,navActive):
    return render_template(htmlPage, now=datetime.now(),sessionId=lib.getNewSessionId(),active=navActive)

@app.route('/gui')
@app.route('/GUI')
def appGUIPage():
    return renderTemplate('gui.html','gui')

@app.route('/')
@app.route('/about')
@app.route('/About')
def appHomePage():
    return renderTemplate('about.html','about')


@app.route('/contact')
@app.route('/Contact')
def appContactPage():
    return renderTemplate('contact.html','contact')

@app.route('/license')
@app.route('/License')
def appLicensePage():
    return renderTemplate('license.html','license')


@app.route('/Env')
@app.route('/env')
def appEnv():
    return business.showEnvDetails()

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
