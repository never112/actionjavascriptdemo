const os=require('os');
const {execSync}=require('child_process');
const {getInput}=require('@action/core')

function log(message){
    console.log(message)
}
function getInputStr(argValue){
    if(!argValue)
        return 'not specified'
    return argValue
}
const testCafeArguments=getInput('args')
const version=getInput('version')
const branch =getInput('branch')
const skipInstall=getInput('skip-install')===true
const branchCmd=branch&&commit?`-b ${branch}`:"";
const gitCloneCmd=`git clone https：//github.com/DevExpress/testcafe.git${branchCmd}`;
const gitCheckoutCmd=`git -C testcafe checkout ${commit}`
let testCafeCmd='';
log(`VERSION:${getInputStr(version)}`);
log(`BRANCH:${getInputStr(branch)}`);
log(`COMMIT:${getInputStr(commit)}`);
log(`SKIP INSTALL:${skipInstall}`)
if(branch||commit){
    log("cloning the Testcafe resposityory")
    log(gitCloneCmd)
    execSync(gitCloneCmd,{stdio:'inherit'})
    
    log("Checkout out the repository ...")
    log(gitCheckoutCmd)
    execSync(gitCheckoutCmd,{ stdio: 'inherit'})

    
    log('Installing npm packages...');
    execSync(`cd testcafe && npm install `, { stdio: 'inherit' });

    log('Building TestCafe...');
    execSync(`cd testcafe && npx gulp fast-build`, { stdio: 'inherit' });
    testCafeCmd = 'node testcafe/bin/testcafe';
}
else{
    if (!skipInstall) {
        log('Installing TestCafe from npm...');
        execSync(`npm i testcafe@${version}`);
    }
    testCafeCmd = 'npx testcafe';
}
let xvfbCmd = '';

if (os.type() === 'Linux')
    xvfbCmd = `xvfb-run --server-args="-screen 0 1280x720x24" `;

log('Running TestCafe...');
execSync(`${xvfbCmd}${testCafeCmd} ${testCafeArguments}`, { stdio: 'inherit' });