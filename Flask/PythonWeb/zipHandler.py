from flask import render_template, request, redirect, url_for, send_from_directory,Response
import os
from PythonWeb import app
from PythonWeb import uploader
from PythonWeb import mmWrapper
from PythonWeb import lib
import zipfile

def extractZip(fileName,toDir):
    baseName=lib.findFileName(fileName)
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

def isDirExists(z, name):
    return any(x.startswith("%s/" % name.rstrip("/")) for x in z.namelist())

def isFileExists(z, name):
    return any(x.startswith("%s" % name) for x in z.namelist())


def isValidUFOZip(filePath):
    zf = zipfile.ZipFile(filePath, "r")
    
    if isDirExists(zf,"glyphs")==False:
        raise ValueError('The given file is not a valid UFO Zip file.Please ensure it contains "glyphs" directory.')
    
    if isFileExists(zf,"metainfo.plist")==False:
         raise ValueError('The given file is not a valid UFO Zip file.Please ensure it contains "metainfo.plist" file.')

    return True
