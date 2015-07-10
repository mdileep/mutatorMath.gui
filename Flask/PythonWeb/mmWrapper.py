from __future__ import print_function
import os
import time
import defcon.objects.font
import mutatorMath.objects.error
from mutatorMath.ufo.document import DesignSpaceDocumentWriter, DesignSpaceDocumentReader
from mutatorMath.objects.location import Location
from PythonWeb import app

def go(docName,logFile,ufoVersion=3,roundGeometry=True):
    testRoot = app.config['UPLOAD_DIR']
    documentPath = os.path.join(testRoot, docName)
    sourcePath =testRoot
    instancePath = testRoot
    logPath = os.path.join(testRoot, logFile)
    doc = DesignSpaceDocumentReader(documentPath, ufoVersion, roundGeometry=roundGeometry, verbose=True, logPath=logPath)
    doc.process(makeGlyphs=True, makeKerning=True, makeInfo=True)