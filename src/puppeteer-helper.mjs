import {CURRENCY_BLOCKPIT_NAME_MAP, SPECIAL_SEARCH_CURRENCIES} from "./consts.mjs";

export function inputForLabel(page, label) {
    return page.evaluateHandle((lbl) => {
        const dateInput = Array.from(
            document.querySelectorAll('label')
        )
            .find(
                (el) => {
                    if (el.innerHTML?.includes(lbl)) {
                        return true;
                    }

                    return el.querySelector('span')?.innerHTML?.includes(lbl);
                });

        if (dateInput) {
            return dateInput.parentElement.querySelector('input');
        }

        return null;
    }, label);
}

export async function clickNewTransactionButton(page) {
    try {
        const newTransactionButton = await page.evaluateHandle(() => {
            const span = Array.from(document.querySelectorAll('span')).find((el) => el.innerHTML?.includes('Neue Transaktion')); // TODO multilingual

            if (span) {
                return span;
            }

            return null;
        });

        if (newTransactionButton) {
            await newTransactionButton.click();

            return true;
        }
    } catch (err) {
        console.error(err);
    }

    await page.reload();
    await page.waitForTimeout(10000);

    return clickNewTransactionButton(page);
}

export async function clickTransactionTypeDropdown(page) {
    try {
        const transactionTypeSelect = await page.evaluateHandle(() => {
            const dateInput = Array.from(
                document.querySelectorAll('label')
            )
                .find(
                    (el) => {
                        if (el.innerHTML?.includes('Transaktionstyp')) { // TODO multilingual
                            return true;
                        }

                        return el.querySelector('span')?.innerHTML?.includes('Transaktionstyp'); // TODO multilingual
                    });

            if (dateInput) {
                return dateInput;
            }
        });

        if (transactionTypeSelect) {
            await transactionTypeSelect.click();

            return true;
        }
    } catch (err) {
        console.error(err);
    }

    await page.reload();
    await page.waitForTimeout(10000);

    return clickNewTransactionButton(page).then(() => clickTransactionTypeDropdown(page));
}

export async function getAndClearDateInput(page) {
    const datumInput = await inputForLabel(page, 'Datum'); // TODO multilingual
    await datumInput.click({clickCount: 3});

    await datumInput.press('Backspace');
    await datumInput.press('Backspace');
    await datumInput.press('Backspace');
    await datumInput.press('Backspace');
    await datumInput.press('Backspace');
    await datumInput.press('Backspace');
    await datumInput.press('Backspace');
    await datumInput.press('Backspace');
    await datumInput.press('Backspace');
    await datumInput.press('Backspace');

    return datumInput;
}

async function importAmountAndCurrency(page, amount, currency) {
    await (await inputForLabel(page, 'Menge')).type(amount); // TODO multilingual
    await (await inputForLabel(page, 'Währung')).type(SPECIAL_SEARCH_CURRENCIES[currency]); // TODO multilingual
}

export async function importStacking(page, preparedTransaction) {
    await importAmountAndCurrency(page, preparedTransaction.toAmount, preparedTransaction.toCurrency);

    const currencySelection = await page.evaluateHandle(
        (currency) => Array.from(
            document.querySelectorAll('span.mat-option-text')
        ).find((el) => el.innerHTML.includes(currency)),
        CURRENCY_BLOCKPIT_NAME_MAP[preparedTransaction.toCurrency]
    );

    if (currencySelection) {
        await currencySelection.click();
    } else {
        console.error('COULD NOT CLICK BUTTON');
    }
}

export async function importExchange(page, preparedTransaction) {
    await (await inputForLabel(page, 'Ausgehende Menge')).type(preparedTransaction.fromAmount); // TODO multilingual
    await (await inputForLabel(page, 'Ausgehende Währung')).type(SPECIAL_SEARCH_CURRENCIES[preparedTransaction.fromCurrency]); // TODO multilingual

    const currencySelection = await page.evaluateHandle(
        (currency) => Array.from(
            document.querySelectorAll('span.mat-option-text')
        ).find((el) => el.innerHTML.includes(currency)),
        CURRENCY_BLOCKPIT_NAME_MAP[preparedTransaction.fromCurrency]
    );

    if (currencySelection) {
        await currencySelection.click();
    } else {
        console.error('COULD NOT CLICK BUTTON');
    }

    await page.waitForTimeout(500);

    await (await inputForLabel(page, 'Eingehende Menge')).type(preparedTransaction.toAmount); // TODO multilingual
    await (await inputForLabel(page, 'Eingehende Währung')).type(SPECIAL_SEARCH_CURRENCIES[preparedTransaction.toCurrency]); // TODO multilingual

    const currencySelection2 = await page.evaluateHandle(
        (currency) => Array.from(
            document.querySelectorAll('span.mat-option-text')
        ).find((el) => el.innerHTML.includes(currency)),
        CURRENCY_BLOCKPIT_NAME_MAP[preparedTransaction.toCurrency]
    );

    if (currencySelection2) {
        await currencySelection2.click();
    } else {
        console.error('COULD NOT CLICK BUTTON');
    }
}

export async function importGift(page, preparedTransaction) {
    await importAmountAndCurrency(page, preparedTransaction.toAmount, preparedTransaction.toCurrency);

    const currencySelection = await page.evaluateHandle(
        (currency) => Array.from(
            document.querySelectorAll('span.mat-option-text')
        ).find((el) => el.innerHTML.includes(currency)),
        CURRENCY_BLOCKPIT_NAME_MAP[preparedTransaction.toCurrency]
    );

    if (currencySelection) {
        await currencySelection.click();
    } else {
        console.error('COULD NOT CLICK BUTTON');
    }
}

export async function importDeposit(page, preparedTransaction) {
    await importAmountAndCurrency(page, preparedTransaction.toAmount, preparedTransaction.toCurrency);

    const currencySelection = await page.evaluateHandle(
        (currency) => Array.from(
            document.querySelectorAll('span.mat-option-text')
        ).find((el) => el.innerHTML.includes(currency)),
        CURRENCY_BLOCKPIT_NAME_MAP[preparedTransaction.toCurrency]
    );

    if (currencySelection) {
        await currencySelection.click();
    } else {
        console.error('COULD NOT CLICK BUTTON');
    }
}

export async function importWithdraw(page, preparedTransaction) {
    await (await inputForLabel(page, 'Menge')).type(preparedTransaction.fromAmount); // TODO multilingual
    await (await inputForLabel(page, 'Währung')).type(SPECIAL_SEARCH_CURRENCIES[preparedTransaction.fromCurrency]); // TODO multilingual

    const currencySelection = await page.evaluateHandle(
        (currency) => Array.from(
            document.querySelectorAll('span.mat-option-text')
        ).find((el) => el.innerHTML.includes(currency)),
        CURRENCY_BLOCKPIT_NAME_MAP[preparedTransaction.fromCurrency]
    );

    if (currencySelection) {
        await currencySelection.click();
    } else {
        console.error('COULD NOT CLICK BUTTON');
    }
}