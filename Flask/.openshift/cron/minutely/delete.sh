#!/bin/bash
cd $OPENSHIFT_DATA_DIR
find  $OPENSHIFT_DATA_DIR -name '*.*' -type f -mmin +360 -delete