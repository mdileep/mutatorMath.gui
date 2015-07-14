from __future__ import print_function
import os
import time
import defcon.objects.font
import mutatorMath.objects.error
from mutatorMath.ufo.document import DesignSpaceDocumentWriter, DesignSpaceDocumentReader
from mutatorMath.objects.location import Location
from PythonWeb import app
import logging


def go(docName,logFile,ufoVersion=3,roundGeometry=True):
    testRoot = app.config['UPLOAD_DIR']
    documentPath = os.path.join(testRoot, docName)
    sourcePath =testRoot
    instancePath = testRoot
    logPath = os.path.join(testRoot, logFile)
    doc = DesignSpaceDocumentReader(documentPath, ufoVersion, roundGeometry=roundGeometry, verbose=True, logPath=logPath)
    doc.process(makeGlyphs=True, makeKerning=True, makeInfo=True)
    close() #doc.close() ?? #It might be a bug on mutatorMath. There is no known inbuilt way of doing this. Ex: doc.Close() or doc.Flush() etc.https://github.com/LettError/MutatorMath/issues/10 



def close():
    logger=logging.getLogger("mutatorMath")
    if logger ==None:
        return
    if logger.root != None:
        logger.root.handlers=[]
    logger.handlers=[]