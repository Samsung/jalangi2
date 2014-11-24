/*
 * Copyright 2013-2014 Samsung Information Systems America, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Author: Koushik Sen

if (typeof J$ === 'undefined') {
    J$ = {};
}

(function (sandbox) {
    if (typeof sandbox.iidToLocation !== 'undefined') {
        return;
    }
    var Constants = sandbox.Constants;
    var isBrowser = Constants?Constants.isBrowser:undefined;
    var isInit = false;

    sandbox.iidToLocation = function (iid) {
        var ret;
        if (!isInit) {
            isInit = true;
            if (!isBrowser) {
                try {
                    require(process.cwd()+"/jalangi_sourcemap");
                } catch (e) {
                    // don't crash if we can't find sourcemap file
                }
            }
        }
        if (sandbox.iids) {
            if ((ret = sandbox.iids[iid])) {

                return "("+ret[0]/*.replace("_orig_.js", ".js")*/+":"+ret[1]+":"+ret[2]+":"+ret[3]+":"+ret[4]+")";
            }
        }
        return iid+"";
    };

}(J$));
