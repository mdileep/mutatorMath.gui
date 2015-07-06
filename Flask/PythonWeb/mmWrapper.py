from __future__ import print_function
import os
import time
import defcon.objects.font
import mutatorMath.objects.error
from mutatorMath.ufo.document import DesignSpaceDocumentWriter, DesignSpaceDocumentReader
from mutatorMath.objects.location import Location
from PythonWeb import app

def go(ufoVersion=2,roundGeometry=True):
    testRoot = app.config['UPLOAD_DIR']
    print(testRoot)
    documentPath = os.path.join(testRoot, 'exporttest_basic.designspace')
    sourcePath = os.path.join(testRoot, 'sources')
    instancePath = os.path.join(testRoot, 'instances')
    master1Path = os.path.join(testRoot, )
    logPath = os.path.join(testRoot, "tests.log")
    doc = DesignSpaceDocumentReader(documentPath, ufoVersion, roundGeometry=roundGeometry, verbose=True, logPath=logPath)
    doc.process(makeGlyphs=True, makeKerning=True, makeInfo=True)