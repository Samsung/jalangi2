
import hashlib
import os
import sys
import inspect

filename = inspect.getframeinfo(inspect.currentframe()).filename
JALANGI_HOME = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(filename)),os.pardir))
ANALYSES=[JALANGI_HOME+'/src/js/sample_analyses/ChainedAnalyses.js', JALANGI_HOME+'/src/js/runtime/analysisCallbackTemplate.js']
WORKING_DIR = os.getcwd()

print "Jalangi home is "+JALANGI_HOME
print "Current working directory is "+WORKING_DIR

sys.path.insert(0, JALANGI_HOME+'/scripts')
import sj

analysis = ' --analysis '.join([' ']+ANALYSES)

def processFile (content, ext):
	try:
		fileName = hashlib.md5(content).hexdigest()
		if not os.path.isfile(fileName+'.'+ext):
			print "Storing and instrumenting "+fileName+"."+ext
			with open(fileName+"."+ext, "w") as text_file:
				text_file.write(content)
			sj.execute(sj.INSTRUMENTATION_SCRIPT+' --inlineIID --inlineSource '+analysis+' '+fileName+'.'+ext)
		with open (fileName+"_jalangi_."+ext, "r") as text_file:
			data = text_file.read()
		return data
	except:
		print "Exception in proxy.py"
		print sys.exc_info()
		return content

def start(context, argv):
	global ANALYSES
	global analysis
	if len(argv) > 1:
		ANALYSES = [os.path.abspath(os.path.join(WORKING_DIR,x)) for x in argv[1:]]
		analysis = ' --analysis '.join([' ']+ANALYSES)
		print analysis

def response(context, flow):
	flow.response.decode()
	if 'Content-Type' in flow.response.headers:
		if flow.response.headers['Content-Type'][0].find('javascript') != -1:
			flow.response.content = processFile(flow.response.content, "js")
		if flow.response.headers['Content-Type'][0].find('html') != -1:
			flow.response.content = processFile(flow.response.content, "html")



