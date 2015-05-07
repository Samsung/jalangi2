# node-jalangi

Enables jalangi interception of all node-usages in a shell command.

Useful for instrumenting everything in a unit test run.

## Usage
Abstract: `node-jalangi/node-jalangi-runner.sh target-dir command...`

Example: `node-jalangi/node-jalangi-runner.sh underscore npm run test-node`

The target directory will be restored after the run completes.

The command can be any shell command and its arguments.

Two variables need to be set prior to running node-jalangi-runner.sh:

- `$NJ_JALANGI`: the path to the local jalangi installation, e.g. `$HOME/workspace/jalangi2`
- `$NJ_JALANGI_ARGUMENTS`: arguments for jalangi, e.g. `--analysis $HOME/workspace/myAnalysis.js`

I.e. a wrapper shell script like this should suffice for repeated usage:

```bash
#!/usr/bin/env bash
env NJ_JALANGI="$HOME/workspace/jalangi2" \
    NJ_JALANGI_ARGUMENTS="--analysis $HOME/workspace/myAnalysis.js" \
    node-jalangi/node-jalangi-runner.sh $*
```

NB: multiple calls to `analysis.endExecution` might be observed for a single run of node-jalangi-runner.sh, separate scripts are needed to merge the results for each run.
