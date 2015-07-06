from flask import render_template, request, redirect, url_for, send_from_directory,Response

def showTextContext(inst):
    resp = Response(response=inst,status=200,mimetype="text/plain")
    return resp