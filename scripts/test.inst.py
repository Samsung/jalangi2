import sj
import sys

result = sj.execute_np("src/js/commands/instrument.js --inlineIID --inlineSource -i --analysis src/js/sample_analyses/ChainedAnalyses.js --analysis src/js/sample_analyses/dlint/Utils.js --analysis src/js/sample_analyses/dlint/CheckNaN.js --analysis src/js/sample_analyses/dlint/FunCalledWithMoreArguments.js --analysis src/js/sample_analyses/dlint/CompareFunctionWithPrimitives.js --analysis src/js/sample_analyses/dlint/ShadowProtoProperty.js --analysis src/js/sample_analyses/dlint/ConcatUndefinedToString.js --analysis src/js/sample_analyses/dlint/UndefinedOffset.js --outputDir /tmp tests/tizen/annex")

exit(result)
