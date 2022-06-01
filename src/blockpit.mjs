import puppeteer from 'puppeteer';
import {
    clickNewTransactionButton,
    clickTransactionTypeDropdown,
    getAndClearDateInput, importDeposit, importExchange, importGift,
    importStacking, importWithdraw, inputForLabel
} from "./puppeteer-helper.mjs";
import dayjs from "dayjs";
import {BLOCKPIT_TRANSACTION_TYPES} from "./consts.mjs";

const BLOCKPIT_BASE_URL = 'https://app.blockpit.io/';
const LOGIN_PAGE_URL = `${BLOCKPIT_BASE_URL}login`;
const DEPOT_LINK_TEXT = '/depots'

export default async function exportToBlockpit(transactions, user, password, depotName, headless) {
    const browser = await puppeteer.launch({headless});
    const page = await browser.newPage();

    await page.setViewport({width: 1920, height: 1080});

    await page.goto(LOGIN_PAGE_URL);

    await page.click('#hs-eu-confirmation-button'); // cookie banner
    await page.waitForTimeout(1500);

    await page.type('#mat-input-0', user); // email input
    await page.type('#mat-input-1', password); // password input
    await page.waitForTimeout(1500);

    await page.click('.footer lib-button button'); // login button
    await page.waitForTimeout(1500);

    await page.click(`a[href="${DEPOT_LINK_TEXT}"]`); // click "depot"
    await page.waitForTimeout(1500);

    const depot = await page.evaluateHandle((dN) => Array.from(document.querySelectorAll('strong.ng-star-inserted')).find((el) => el.innerHTML === dN), depotName); // search for the correct depot

    if (!depot) {
        throw 'Depot not found!';
    }

    await depot.click();
    await page.waitForTimeout(2500);

    const doneTransactionTime = [];

    for (let i = 0; i < transactions.length; i++) {
        // TODO if error in for -> try to re add transaction?
        const start = Date.now();
        const preparedTransaction = transactions[i];

        await clickNewTransactionButton(page);
        await page.waitForTimeout(1500);

        await clickTransactionTypeDropdown(page);
        await page.waitForTimeout(1500);

        // find correct transaction type
        const transactionType = await page.evaluateHandle((type) => Array.from(document.querySelectorAll('span.mat-option-text')).find((el) => el.innerHTML.includes(type)), preparedTransaction.transactionType);
        await transactionType.click();
        await page.waitForTimeout(500);
        // find correct transaction type

        // input date
        const dateInput = await getAndClearDateInput(page);
        await dateInput.type(dayjs(new Date(preparedTransaction.timestamp)).format('DD.MM.YYYY'));
        // input date

        // input time
        const zeitInput = await inputForLabel(page, 'Zeit'); // TODO multilingual
        await zeitInput.click({clickCount: 3});
        await zeitInput.type(dayjs(new Date(preparedTransaction.timestamp)).format('HH:mm.ss'));
        // input time

        if (preparedTransaction.transactionType === BLOCKPIT_TRANSACTION_TYPES.Geschenk_erhalten) {
            // gifts do need two different times
            const dI = await inputForLabel(page, 'Zeitpunkt der Akquise'); // TODO multilingual
            await dI.click({clickCount: 3});
            await dI.type(dayjs(new Date(preparedTransaction.timestamp)).format('DD.MM.YYYY'));

            const zI = await inputForLabel(page, 'Akquisezeit'); // TODO multilingual
            await zI.click({clickCount: 3});
            await zI.type(dayjs(new Date(preparedTransaction.timestamp)).format('HH:mm.ss'));
        }

        await page.waitForTimeout(500);

        // click next
        (await page.evaluateHandle(
            () => Array.from(document.querySelectorAll('.footer lib-button')).find((el) => el.querySelector('span').innerHTML.includes('Weiter')) // TODO multilingual
        )).click();
        await page.waitForTimeout(500);
        // click next

        // enter transaction details
        switch (preparedTransaction.transactionType) {
            case BLOCKPIT_TRANSACTION_TYPES.Staking:
                await importStacking(page, preparedTransaction);
                break;

            case BLOCKPIT_TRANSACTION_TYPES.Tausch:
                await importExchange(page, preparedTransaction);
                break;

            case BLOCKPIT_TRANSACTION_TYPES.Geschenk_erhalten:
                await importGift(page, preparedTransaction);
                break;

            case BLOCKPIT_TRANSACTION_TYPES.Einzahlung:
                await importDeposit(page, preparedTransaction);
                break;

            case BLOCKPIT_TRANSACTION_TYPES.Auszahlung:
                await importWithdraw(page, preparedTransaction);
                break;

            default:
                console.error('FOUND UNKNOWN TRANSACTION TO ENTER');
                console.error(preparedTransaction);
                process.exit(1);
                break;
        }
        // enter transaction details

        await page.waitForTimeout(500);

        // click create
        (await page.evaluateHandle(
            () => Array.from(document.querySelectorAll('.footer lib-button')).find((el) => el.querySelector('span').innerHTML.includes('Erstellen')) // TODO multilingual
        )).click();
        // click create

        await page.waitForTimeout(1500);

        console.log(`Imported: ${i + 1}/${transactions.length}`);

        // reload every 10th transaction because the sites acts strange after many entered transactions
        if (!(i % 10)) {
            await page.reload();
            await page.waitForTimeout(5000);
        }

        const duration = (Date.now() - start) / 1000;
        doneTransactionTime.push(duration);

        const averageTime = doneTransactionTime.reduce((p, c) => p + c, 0) / doneTransactionTime.length;

        console.log(`TOOK: ${duration.toFixed(2)} seconds - AVG: ${averageTime.toFixed(2)} seconds - ETA: ${((averageTime * (transactions.length - i + 1)) / 60).toFixed(2)} minutes`);
    }

    await browser.close();
}