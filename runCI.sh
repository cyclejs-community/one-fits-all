#!/bin/bash

cli=$1

set -eu

dir=$(pwd)

cd ..
create-cycle-app test-app --flavor "$dir" "--$cli"
cd test-app
"$cli" run build
"$cli" test
echo "y\n" | "$cli" run eject
"$cli" run build
"$cli" test
