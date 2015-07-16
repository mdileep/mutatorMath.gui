from flask import render_template, request, redirect, url_for, send_from_directory,Response
import os
import random
import string
import urllib
import json

def getNewSessionId():
    return "".join([random.choice(string.digits) for i in   xrange(12)])

def saveToText(fileName,text):
    text_file = open(fileName, "w")
    text_file.write(text)
    text_file.close()

def pushText(inst):
    resp = Response(response=inst,status=200,mimetype="text/plain")
    return resp

def pushLoadScript(callBackName,arr):
    
    response = callBackName + "("
    cnt = 1
    #JS Encoding may be used not url
    for val in arr:
        if cnt != len(arr):
            response = response + json.dumps(val) + ','
        else:
            response = response + json.dumps(val) + ');'
        cnt = cnt + 1
    
    # For some reason mimeType=text/javascript is not working -8 July 2015
    # Update: It works fine with GET method but not with POST.  Seems it's a
    # expected behaviour.- 9 July 2015
    #resp = Response(response=response,status=200,"text/javascript")

    response = '<script type="text/javascript">' + response + '</script>' 
    resp = Response(response=response,status=200)

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