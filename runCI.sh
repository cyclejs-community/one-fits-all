#!/bin/bash

cli=$1

set -eu

create-cycle-app test-app --flavor $(pwd) "--$cli"
cd test-app
"$cli" run build
"$cli" test
echo "y\n" | "$cli" run eject
"$cli" run build
"$cli" test
