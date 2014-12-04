import sj
import sys

# scripting jalangi sample 2
sj.create_and_cd_jalangi_tmp()
sj.execute(sj.INSTRUMENTATION_SCRIPT+' --inlineIID --inlineSource ../'+sys.argv[1]+'.js')
normal = sj.execute_return('../'+sys.argv[1]+'.js', savestderr=True)
ana = sj.execute_return(sj.ANALYSIS_SCRIPT+' --analysis ../src/js/sample_analyses/ChainedAnalyses.js --analysis ../src/js/runtime/analysisCallbackTemplate.js ../'+sys.argv[1]+'_jalangi_.js', savestderr=True)

if normal != ana:
    print "{} failed".format(sys.argv[1])
    print normal
    print ana
else:
    print "{} passed".format(sys.argv[1])
    print normal
    print ana
sj.cd_parent()
