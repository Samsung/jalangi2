import sj
import sys

status = 0

analyses = ['../src/js/sample_analyses/ChainedAnalyses.js',
 '../src/js/sample_analyses/dlint/Utils.js',
 '../src/js/sample_analyses/dlint/FunCalledWithMoreArguments.js',
 '../src/js/sample_analyses/dlint/CompareFunctionWithPrimitives.js',
 '../src/js/sample_analyses/dlint/UndefinedOffset.js',
 '../src/js/sample_analyses/dlint/CheckNaN.js',
 '../src/js/sample_analyses/dlint/ConcatUndefinedToString.js',
 '../src/js/sample_analyses/dlint/ShadowProtoProperty.js']

analysesStr = ' --analysis '+(' --analysis '.join(analyses))

def testDlint (file, output):
    sj.create_and_cd_jalangi_tmp()
    sj.execute_np(sj.INSTRUMENTATION_SCRIPT+' --inlineIID --inlineSource ../tests/dlint/'+file+'.js')
    out = sj.execute_return_np(sj.ANALYSIS_SCRIPT+ analysesStr+' ../tests/dlint/'+file+'_jalangi_.js')
    if output != out:
        print "{} failed".format(file)
        print "********** Actual **********"
        print out
        print "********** Expected **********"
        print output
        status = 1
    else:
        print "{} passed".format(file)
    sj.cd_parent()


out="""Observed NaN at (../tests/dlint/testNaN.js:7:5:7:10) 1 time(s).
"""
testDlint('testNaN',out)


out = """Accessed property 'undefined' at (../tests/dlint/dlint1.js:7:1:7:9) 1 time(s).
Accessed property 'undefined' at (../tests/dlint/dlint1.js:9:10:9:14) 1 time(s).
Written property x at (../tests/dlint/dlint1.js:19:1:19:8) 1 time(s) and it shadows the property in its prototype.
"""
testDlint('dlint1',out)


out="""Function at (../tests/dlint/dlint2.js:6:1:6:7) called 1 time(s) with more arguments that expected.
Function at (../tests/dlint/dlint2.js:14:1:14:11) called 1 time(s) with more arguments that expected.
"""
testDlint('dlint2',out)

out="""Concatenated undefined to a string at (../tests/dlint/dlint3.js:6:5:6:10) 1 time(s).
Concatenated undefined to a string at (../tests/dlint/dlint3.js:7:5:7:10) 1 time(s).
"""
testDlint('dlint3',out)

out="""Comparing a function with a number or string or boolean at (../tests/dlint/dlint4.js:4:5:4:37) 1 time(s).
"""
testDlint('dlint4',out)

exit(status)
