import codecs
import hashlib
import os
import sys
import inspect
import traceback

from distutils.version import LooseVersion

from subprocess import CalledProcessError, Popen, PIPE, STDOUT

p = Popen(['mitmdump --version'], stdout=PIPE, stdin=PIPE, stderr=STDOUT, shell=True)
stdout = p.communicate()[0]
mitmversion = stdout.decode()[9:] # remove "mitmdump "


if LooseVersion(mitmversion) >= LooseVersion("0.17"):
    from mitmproxy.script import concurrent
else:
    from libmproxy.script import concurrent

filename = inspect.getframeinfo(inspect.currentframe()).filename
JALANGI_HOME = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(filename)), os.pardir))
WORKING_DIR = os.getcwd()

sys.path.insert(0, JALANGI_HOME+'/scripts')
import sj

print('Jalangi home is ' + JALANGI_HOME)
print('Current working directory is ' + WORKING_DIR)

jalangiArgs = ''
useCache = True
ignore = []

def processFile (flow, content, ext):
    try:
        url = flow.request.scheme + '://' + flow.request.host + ':' + str(flow.request.port) + flow.request.path
        name = os.path.splitext(flow.request.path_components[-1])[0] if hasattr(flow.request,'path_components') and len(flow.request.path_components) else 'index'

        hash = hashlib.md5(content).hexdigest()
        fileName = 'cache/' + flow.request.host + '/' + hash + '/' + name + '.' + ext
        instrumentedFileName = 'cache/' + flow.request.host + '/' + hash + '/' + name + '_jalangi_.' + ext
        if not os.path.exists('cache/' + flow.request.host + '/' + hash):
            os.makedirs('cache/' + flow.request.host + '/' + hash)
        if not useCache or not os.path.isfile(instrumentedFileName):
            print('Instrumenting: ' + fileName + ' from ' + url)
            with open(fileName, 'w') as file:
                file.write(sj.encode_input(content))
            sub_env = { 'JALANGI_URL': url }
            sj.execute(sj.INSTRUMENTATION_SCRIPT + ' ' + jalangiArgs + ' ' + fileName + ' --out ' + instrumentedFileName + ' --outDir ' + os.path.dirname(instrumentedFileName), None, sub_env)
        else:
            print('Already instrumented: ' + fileName + ' from ' + url)
        with open (instrumentedFileName, "r") as file:
            data = file.read()
        return data
    except:
        print('Exception in processFile() @ proxy.py')
        exc_type, exc_value, exc_traceback = sys.exc_info()
        lines = traceback.format_exception(exc_type, exc_value, exc_traceback)
        print(''.join(lines))
        return content

if LooseVersion(mitmversion) >= LooseVersion("0.18"):
    def start():
        _start(sys.argv)
else:
    def start(context, argv):
        _start(argv)

# Example usage: "proxy.py --no-cache --ignore http://cdn.com/jalangi --inlineIID --inlineSource --noResultsGUI --analysis ..."
def _start(argv):
    global jalangiArgs
    global useCache

    # For enabling/disabling instrumentation cache (enabled by default)
    if '--no-cache' in argv:
        print('Cache disabled.')
        useCache = False
        argv.remove('--no-cache')
    elif '--cache' in argv:
        argv.remove('--cache')

    # For not invoking jalangi for certain URLs
    ignoreIdx = argv.index('--ignore') if '--ignore' in argv else -1
    while ignoreIdx >= 0:
        argv.pop(ignoreIdx)
        ignore.append(argv[ignoreIdx])
        argv.pop(ignoreIdx)
        ignoreIdx = argv.index('--ignore') if '--ignore' in argv else -1

    # The remaining arguments are passed to jalangi
    def mapper(p):
        path = os.path.abspath(os.path.join(WORKING_DIR, p))
        return path if not p.startswith('--') and (os.path.isfile(path) or os.path.isdir(path)) else p
    jalangiArgs = ' '.join(map(mapper, [x for x in argv[1:]]))

if LooseVersion(mitmversion) >= LooseVersion("0.18"):
    @concurrent
    def response(flow):
        _response(flow)
else:
    @concurrent
    def response(context, flow):
        _response(flow)

def _response(flow):
    # Do not invoke jalangi if the domain is ignored
    for path in ignore:
        if flow.request.url.startswith(path):
            return

    # Do not invoke jalangi if the requested URL contains the query parameter noInstr
    # (e.g. https://cdn.com/jalangi/jalangi.min.js?noInstr=true)
    if LooseVersion(mitmversion) >= LooseVersion("0.17") and flow.request.query and flow.request.query.get('noInstr', None):
        return

    try:
        flow.response.decode()

        content_type = None
        csp_key = None
        for key in flow.response.headers.keys():
            if key.lower() == "content-type":
                if LooseVersion(mitmversion) >= LooseVersion("0.17"):
                    content_type = flow.response.headers[key].lower()
                else:
                    content_type = flow.response.headers[key][0].lower()
            elif key.lower() == "content-security-policy":
                csp_key = key

        if content_type:
            if content_type.find('javascript') >= 0:
                flow.response.content = processFile(flow, flow.response.content, 'js')
            if content_type.find('html') >= 0:
                flow.response.content = processFile(flow, flow.response.content, 'html')

        # Disable the content security policy since it may prevent jalangi from executing
        if csp_key:
            if LooseVersion(mitmversion) >= LooseVersion("0.17"):
                flow.response.headers.pop(csp_key, None)
            else:
                flow.response.headers[csp_key] = None
    except:
        print('Exception in response() @ proxy.py')
        exc_type, exc_value, exc_traceback = sys.exc_info()
        lines = traceback.format_exception(exc_type, exc_value, exc_traceback)
        print(''.join(lines))
