# Copyright 2013 Samsung Information Systems America, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#        http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Author: Manu Sridharan

from subprocess import call

def call_fail(l):
    if call(l) != 0:
        print "{} failed".format(" ".join(l))
        exit(1)

#call_fail(["python", "scripts/units.py"])
#call_fail(["python", "scripts/unitsv.py"])
#call_fail(["python", "scripts/html_units.py"])
#call_fail(["python", "scripts/html_unitsv.py"])
call_fail(["python", "scripts/test.analysis.py"])
call_fail(["python", "scripts/test.dlint.py"])
call_fail(["python", "scripts/test.inst.py"])
#call_fail(["python", "scripts/sym.py"])
#call_fail(["python", "scripts/testmultiple.py"])
# call_fail(["python", "scripts/testsp.py"])
# call_fail(["python", "scripts/testspv.py"])
# call_fail(["python", "scripts/testoctane.py"])
# call_fail(["python", "scripts/testoctanev.py"])
