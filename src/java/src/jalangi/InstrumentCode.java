package jalangi;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

/**
 * Author: Koushik Sen (ksen@cs.berkeley.edu)
 * Date: 1/14/15
 * Time: 9:02 AM
 */
public class InstrumentCode {
    public static void main(String[] args) throws Exception {
        System.out.println(System.getProperty("user.dir"));
        // create a script engine manager
        ScriptEngineManager factory = new ScriptEngineManager();
        // create a JavaScript engine
        ScriptEngine engine = factory.getEngineByName("JavaScript");
        // evaluate JavaScript code from String
        engine.eval(new java.io.FileReader("src/js/Constants.js"));
        engine.eval(new java.io.FileReader("src/js/Config.js"));
        engine.eval(new java.io.FileReader("src/js/instrument/astUtil.js"));
        engine.eval(new java.io.FileReader("node_modules/escodegen/escodegen.browser.min.js"));
        engine.eval(new java.io.FileReader("node_modules/acorn/acorn.js"));
        engine.eval(new java.io.FileReader("src/js/instrument/esnstrument.js"));
    }
}
