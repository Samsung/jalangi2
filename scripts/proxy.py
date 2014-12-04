JALANGI_HOME='/Users/ksen/Dropbox/jalangi2'
ANALYSES=[JALANGI_HOME+'/src/js/sample_analyses/ChainedAnalyses.js', JALANGI_HOME+'/src/js/runtime/analysisCallbackTemplate.js']

import hashlib
import os
import sys

sys.path.insert(0, JALANGI_HOME+'/scripts')
import sj

analysis = ' --analysis '.join([' ']+ANALYSES)
print analysis

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
		print sys.exc_info()
		return content

def response(context, flow):
	flow.response.decode()
	if 'Content-Type' in flow.response.headers:
		if flow.response.headers['Content-Type'][0].find('javascript') != -1:
			flow.response.content = processFile(flow.response.content, "js")
		if flow.response.headers['Content-Type'][0].find('html') != -1:
			flow.response.content = processFile(flow.response.content, "html")



