import sj
import sys

def test(prefix, file, rest):
    sj.create_and_cd_jalangi_tmp()
    sj.execute_np(sj.INSTRUMENTATION_SCRIPT+' '+prefix+file+'.js')
    normal = sj.execute_return_np(prefix+file+'.js '+rest, savestderr=True)
    ana = sj.execute_return_np(sj.ANALYSIS_SCRIPT+'  --analysis ../src/js/sample_analyses/ChainedAnalyses.js --analysis ../src/js/runtime/analysisCallbackTemplate.js '+prefix+file+'_jalangi_.js '+rest, savestderr=True)

    if normal != ana:
        print "{} failed".format(file)
        print normal
        print ana
    else:
        print "{} passed".format(file)
    sj.cd_parent()

with open('tests/unit/unitTests.txt') as fp:
    for line in fp:
        args = line.split()
        if len(args) == 2:
            rest = args[1]
        else:
            rest = ''
        test('../tests/unit/',args[0], rest)

with open('tests/sunspider1/unitTests.txt') as fp:
    for line in fp:
        args = line.split()
        if len(args) == 2:
            rest = args[1]
        else:
            rest = ''
        test('../tests/sunspider1/',args[0], rest)
