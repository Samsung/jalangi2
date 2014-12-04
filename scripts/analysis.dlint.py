import sj
import sys

analyses = ['../src/js/sample_analyses/ChainedAnalyses.js',
 '../src/js/sample_analyses/dlint/Utils.js',
 '../src/js/sample_analyses/dlint/CompareFunctionWithPrimitives.js',
 '../src/js/sample_analyses/dlint/FunCalledWithMoreArguments.js',
 '../src/js/sample_analyses/dlint/UndefinedOffset.js',
 '../src/js/sample_analyses/dlint/CheckNaN.js',
 '../src/js/sample_analyses/dlint/ConcatUndefinedToString.js',
 '../src/js/sample_analyses/dlint/ShadowProtoProperty.js']

analysesStr = ' --analysis '+(' --analysis '.join(analyses))

def testDlint (file):
    sj.create_and_cd_jalangi_tmp()
    sj.execute(sj.INSTRUMENTATION_SCRIPT+' --inlineIID --inlineSource ../'+file+'.js')
    out = sj.execute(sj.ANALYSIS_SCRIPT+ analysesStr+' ../'+file+'_jalangi_.js')
    sj.cd_parent()


testDlint(sys.argv[1])
