#!/bin/bash

TAJS_FOLDER=$1
TEST_FILE=$2
TEST_FILE_FOLDER=$3
SCRIPT_LOCATION_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
GEN_LOG_FILE_SCRIPT="$SCRIPT_LOCATION_DIR/genLogFile.sh" 

pushd $TAJS_FOLDER > /dev/null 
$GEN_LOG_FILE_SCRIPT "$TEST_FILE" "$TEST_FILE_FOLDER" "true"
popd > /dev/null
