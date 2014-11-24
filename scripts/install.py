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

# Author: Simon Jensen

from subprocess import call
from os.path import exists
import shutil
import os
from time import sleep
from sys import platform
import zipfile
from urllib import urlretrieve

def npm_install():
    print "---> installing node modules"
    if os.system(" ".join(['npm', 'install'])) != 0:
        print "npm install failed"
        exit(1)

def call_fail(l):
    if call(l) != 0:
        print "{} failed".format(" ".join(l))
        exit(1)

def del_dir(d):
    if not exists(d):
        return 
    if platform == "win32":
        res = os.system('rmdir /q /s {}'.format(d))
    else:
        res = os.system('rm -rf {}'.format(d))
    if res != 0:
        print "failed to delete directory {}".format(res)
        exit(1)

if exists("node_modules"):
    shutil.rmtree("node_modules")
npm_install()

#urlretrieve("https://raw.github.com/Constellation/escodegen/1.1.0/escodegen.browser.js","node_modules/escodegen/escodegen.browser.js");

print "---> Installation successful."
print "---> run \'npm test\' to make sure all tests pass"
