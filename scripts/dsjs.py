
import sj
import sys

analyses = ['../src/js/sample_analyses/dsjs/Dsjs.js']

analysesStr = ' --analysis '+(' --analysis '.join(analyses))

def testDlint (file):
    sj.create_and_cd_jalangi_tmp()
    sj.execute_np(sj.INSTRUMENTATION_SCRIPT+' --inlineIID --inlineSource ../'+file+'.js')
    out = sj.execute(sj.ANALYSIS_SCRIPT+ analysesStr+' ../'+file+'_jalangi_.js')
    sj.cd_parent()


testDlint(sys.argv[1]);
