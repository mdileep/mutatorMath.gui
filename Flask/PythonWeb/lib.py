from flask import render_template, request, redirect, url_for, send_from_directory,Response
import os


def pushText(inst):
    resp = Response(response=inst,status=200,mimetype="text/plain")
    return resp

def findFileName(fileName):
    baseName = os.path.basename(fileName)
    baseName = os.path.splitext(baseName)[0]
    return baseName

def findFileExt(fileName):
    baseName = os.path.basename(fileName)
    baseName = os.path.splitext(baseName)
    if(len(baseName) > 1):
        return baseName[1].lower()
    return ""

def findFileNameWithExt(filePath):
    return os.path.basename(filePath)
    