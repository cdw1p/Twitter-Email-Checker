const fetch   = require('node-fetch'),
      chalk   = require('chalk'),
      fs      = require('fs-extra');

const reqCheckEmail = (email) => new Promise((resolve, reject) => {
    fetch(`https://twitter.com/users/email_available?email=${email}`, { method: 'GET' })
        .then(res => res.json())
        .then(response => resolve(response))
        .then(err => reject(err))
});

(async () => {
    try {
        const file = fs.readFileSync('./email.txt', 'utf-8');
        const splitFile = file.split('\r\n');
        for (i in splitFile) {
            var email   = splitFile[i];
            var docheck = await reqCheckEmail(email);

            if (docheck.msg == 'Tersedia!') {
                await fs.appendFile('notRegistered.txt', email+'\r\n', err => {
                    if (err) throw err;
                    console.log(`${chalk.green(`[TERSEDIA]`)} ${email}`);
                })
            } else {
                await fs.appendFile('registered.txt', email+'\r\n', err => {
                    if (err) throw err;
                    console.log(`${chalk.red(`[SUDAH DIGUNAKAN]`)} ${email}`);
                })
            }
        }
    } catch (e) {
        console.log(e)
    }
})();