require('dotenv').config();

const {BLOCKPIT_EMAIL, BLOCKPIT_PASSWORD, BLOCKPIT_DEPOT} = process.env;

(async () => {
    if (BLOCKPIT_EMAIL && BLOCKPIT_PASSWORD && BLOCKPIT_DEPOT) {

    }

    throw 'BLOCKPIT_EMAIL, BLOCKPIT_PASSWORD and BLOCKPIT_DEPOT need to be supplied to work!';
})();