from flask import render_template, request, redirect, url_for, send_from_directory,Response
import os
from PythonWeb import app
from PythonWeb import uploader
from PythonWeb import mmWrapper
from PythonWeb import lib
import zipfile

def extractZip(fileName,toDir):
    baseName=os.path.basename(fileName)
    baseName=os.path.splitext(baseName)[0]
    baseName2=os.path.join(toDir,baseName)
    with zipfile.ZipFile(fileName, "r") as z:
        z.extractall(baseName2)
    return baseName

def zipDirectory(fromDir,toFile):
    zf = zipfile.ZipFile(toFile, "w")
    for dirname, subdirs, files in os.walk(fromDir):
        relPath=os.path.relpath(dirname,fromDir)
        if relPath != ".":
            zf.write(fromDir,relPath, compress_type = zipfile.ZIP_DEFLATED)
        for filename in files:
            zf.write( os.path.join(dirname, filename),os.path.join(relPath, filename), compress_type = zipfile.ZIP_DEFLATED)
    zf.close()
    return toFile