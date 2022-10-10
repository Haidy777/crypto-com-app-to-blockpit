import 'dotenv/config';

import {join} from "path";

const {BLOCKPIT_EMAIL, BLOCKPIT_PASSWORD, BLOCKPIT_DEPOT, CHROME_HEADLESS} = process.env;

import {fileURLToPath} from 'url';
import {dirname} from 'path';
import importTransactions from "./src/import.mjs";
import parseTransactions from "./src/parse.mjs";
import filterTransactions from "./src/filter.mjs";
import {
    BLOCKPIT_TRANSACTION_TYPES,
    CRYPTO_COM_DUST_TRANSACTION_TYPES,
    CRYPTO_COM_TO_BLOCKPIT,
    CRYPTO_COM_TRANSACTION_TYPES, KNOWN_CURRENCIES
} from "./src/consts.mjs";
import _ from "lodash";
import exportToBlockpit from "./src/blockpit.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__dirname);

const IMPORT_DIR = join(__dirname, 'import');

(async () => {
    if (BLOCKPIT_EMAIL && BLOCKPIT_PASSWORD && BLOCKPIT_DEPOT) {
        const importedTransactions = filterTransactions(parseTransactions(importTransactions(IMPORT_DIR)));
        const dustTransactions = [];
        const cashbackReversalTransactions = [];
        let preparedTransactions = [];

        // ! Main Transaction Type Handling
        for (const transaction of importedTransactions) {
            if (CRYPTO_COM_DUST_TRANSACTION_TYPES.includes(transaction.transactionType)) {
                dustTransactions.push(transaction);
            } else if (transaction.transactionType === CRYPTO_COM_TRANSACTION_TYPES.card_cashback_reverted) { // the received cashback also gets reverted when a transaction is reverted
                cashbackReversalTransactions.push(transaction);
            } else {
                const preparedTransaction = {
                    timestamp: transaction.timestamp,
                    transactionType: CRYPTO_COM_TO_BLOCKPIT[transaction.transactionType],
                    description: transaction.description,
                    originalTransaction: transaction
                };
                let notHandled = false;

                switch (transaction.transactionType) {
                    case CRYPTO_COM_TRANSACTION_TYPES.crypto_purchase:
                        preparedTransaction.fromAmount = transaction.nativeAmount;
                        preparedTransaction.fromCurrency = transaction.nativeCurrency;
                        preparedTransaction.toAmount = transaction.fromAmount;
                        preparedTransaction.toCurrency = transaction.fromCurrency;
                        break;

                    case CRYPTO_COM_TRANSACTION_TYPES.card_top_up:
                        preparedTransaction.fromAmount = transaction.fromAmount;
                        preparedTransaction.fromCurrency = transaction.fromCurrency;
                        preparedTransaction.toAmount = transaction.nativeAmount;
                        preparedTransaction.toCurrency = transaction.nativeCurrency;
                        break;

                    case CRYPTO_COM_TRANSACTION_TYPES.crypto_viban:
                    case CRYPTO_COM_TRANSACTION_TYPES.viban_purchase:
                    case CRYPTO_COM_TRANSACTION_TYPES.crypto_viban_exchange:
                    case CRYPTO_COM_TRANSACTION_TYPES.recurring_buy_order:
                    case CRYPTO_COM_TRANSACTION_TYPES.crypto_exchange:
                        preparedTransaction.fromAmount = transaction.fromAmount;
                        preparedTransaction.fromCurrency = transaction.fromCurrency;
                        preparedTransaction.toAmount = transaction.toAmount;
                        preparedTransaction.toCurrency = transaction.toCurrency;
                        break;

                    case CRYPTO_COM_TRANSACTION_TYPES.crypto_to_exchange_transfer:
                    case CRYPTO_COM_TRANSACTION_TYPES.crypto_withdrawal:
                    case CRYPTO_COM_TRANSACTION_TYPES.viban_card_top_up:
                        preparedTransaction.fromAmount = transaction.fromAmount;
                        preparedTransaction.fromCurrency = transaction.fromCurrency;
                        break;

                    case CRYPTO_COM_TRANSACTION_TYPES.exchange_to_crypto_transfer:
                    case CRYPTO_COM_TRANSACTION_TYPES.crypto_deposit:
                    case CRYPTO_COM_TRANSACTION_TYPES.viban_deposit:
                        preparedTransaction.toAmount = transaction.fromAmount;
                        preparedTransaction.toCurrency = transaction.fromCurrency;
                        break;

                    case CRYPTO_COM_TRANSACTION_TYPES.referral_card_cashback:
                    case CRYPTO_COM_TRANSACTION_TYPES.crypto_earn_interest_paid:
                    case CRYPTO_COM_TRANSACTION_TYPES.crypto_earn_extra_interest_paid:
                    case CRYPTO_COM_TRANSACTION_TYPES.reimbursement:
                    case CRYPTO_COM_TRANSACTION_TYPES.crypto_transfer:
                    case CRYPTO_COM_TRANSACTION_TYPES.referral_bonus:
                    case CRYPTO_COM_TRANSACTION_TYPES.mco_stake_reward:
                    case CRYPTO_COM_TRANSACTION_TYPES.rewards_platform_deposit_credited:
                    case CRYPTO_COM_TRANSACTION_TYPES.admin_wallet_credited:
                        preparedTransaction.toAmount = transaction.fromAmount;
                        preparedTransaction.toCurrency = transaction.fromCurrency;
                        break;

                    default:
                        notHandled = true;
                        break;
                }

                if (notHandled) {
                    console.error('Transaction could not be interpreted!', transaction);
                    process.exit(1);
                } else {
                    preparedTransactions.push(preparedTransaction);
                }
            }
        }
        // ! Main Transaction Type Handling

        // ! Dust Transaction Handling
        const dustGroups = Object.values(_.groupBy(dustTransactions, 'timestamp'));

        for (const group of dustGroups) {
            const toTransactions = group.filter(({fromCurrency}) => fromCurrency === 'CRO'); // -> the incoming cro
            const fromTransactions = group.filter(({fromCurrency}) => fromCurrency !== 'CRO'); // -> the outgoing asset (= the dust to convert)

            if (toTransactions.length === 1 && fromTransactions.length === 1) {
                const toTransaction = toTransactions[0];
                const fromTransaction = fromTransactions[0];
                // -> normal convert transaction -> 1=1

                const preparedTransaction = {
                    timestamp: toTransaction.timestamp,
                    transactionType: BLOCKPIT_TRANSACTION_TYPES.Tausch,
                    description: toTransaction.description,
                    fromCurrency: fromTransaction.fromCurrency,
                    toCurrency: toTransaction.fromCurrency,
                    fromAmount: fromTransaction.fromAmount,
                    toAmount: toTransaction.fromAmount,
                };

                preparedTransactions.push(preparedTransaction);
            } else {
                // -> dust conversions can have multiple input transactions and output transactions
                for (const fromTransaction of fromTransactions) {
                    preparedTransactions.push({
                        timestamp: fromTransaction.timestamp,
                        transactionType: BLOCKPIT_TRANSACTION_TYPES.Tausch,
                        description: fromTransaction.description,
                        fromCurrency: fromTransaction.fromCurrency,
                        toCurrency: fromTransaction.nativeCurrency,
                        fromAmount: fromTransaction.fromAmount,
                        toAmount: fromTransaction.nativeAmount,
                    });
                }

                for (const toTransaction of toTransactions) {
                    preparedTransactions.push({
                        timestamp: toTransaction.timestamp,
                        transactionType: BLOCKPIT_TRANSACTION_TYPES.Tausch,
                        description: toTransaction.description,
                        toCurrency: toTransaction.fromCurrency,
                        fromCurrency: toTransaction.nativeCurrency,
                        toAmount: toTransaction.fromAmount,
                        fromAmount: toTransaction.nativeAmount,
                    });
                }
            }
        }
        // ! Dust Transaction Handling

        // ! Cashback Reversal Handling
        for (const cashbackReversal of cashbackReversalTransactions) {
            const cashbackTransactions = preparedTransactions.filter(({toAmount}) => toAmount === cashbackReversal.fromAmount);

            if (cashbackTransactions.length) {
                for (const cbT of cashbackTransactions) {
                    _.remove(preparedTransactions, (
                        {
                            toAmount,
                            timestamp
                        }
                    ) => toAmount === cbT.toAmount && timestamp === cbT.timestamp);
                }
            }
        }
        // ! Cashback Reversal Handling

        // Since we need to "click" the currencies inside the web app we need to know them for importing
        const uniqueCurrencies = Array.from(new Set(preparedTransactions.map((
            {
                fromCurrency,
                toCurrency
            }
        ) => [fromCurrency, toCurrency]).flat().filter(Boolean)));

        for (const uniqueCurrency of uniqueCurrencies) {
            if (!Object.values(KNOWN_CURRENCIES).includes(uniqueCurrency)) {
                console.error('Unknown CURRENCY found, please add them to "KNOWN_CURRENCIES", "CURRENCY_BLOCKPIT_NAME_MAP", "SPECIAL_SEARCH_CURRENCIES" (and consider dropping a pull request :))!');
                console.error(uniqueCurrency);

                process.exit(1);
            }
        }

        // ! Transform the prepared transactions a little bit more
        preparedTransactions = preparedTransactions.map((tr) => ({...tr, timestamp: new Date(tr.timestamp).valueOf()})); // -> convert the date to a timestamp (TODO replace with library parsing?)
        preparedTransactions = _.sortBy(preparedTransactions, 'timestamp'); // -> sort by timestamps

        // ! Duplicate remover
        const uniqTransactions = [];

        for (const preparedTransaction of preparedTransactions) {
            const duplicates = preparedTransactions.filter(({
                                                                timestamp,
                                                                fromCurrency,
                                                                toCurrency,
                                                                fromAmount,
                                                                toAmount
                                                            }) => `${timestamp}`.slice(0, -4) === `${preparedTransaction.timestamp}`.slice(0, -4) // ignore seconds
                && fromCurrency === preparedTransaction.fromCurrency
                && toCurrency === preparedTransaction.toCurrency
                && fromAmount === preparedTransaction.fromAmount
                && toAmount === preparedTransaction.toAmount);
            const alreadyKnown = !!uniqTransactions.find(({
                                                              timestamp,
                                                              fromCurrency,
                                                              toCurrency,
                                                              fromAmount,
                                                              toAmount
                                                          }) => `${timestamp}`.slice(0, -4) === `${preparedTransaction.timestamp}`.slice(0, -4) // ignore seconds
                && fromCurrency === preparedTransaction.fromCurrency
                && toCurrency === preparedTransaction.toCurrency
                && fromAmount === preparedTransaction.fromAmount
                && toAmount === preparedTransaction.toAmount);

            if (!alreadyKnown) {
                if (duplicates.length === 1) {
                    uniqTransactions.push(duplicates[0]);
                } else {
                    console.log(`Duplicate Found: ${preparedTransaction.timestamp} ${preparedTransaction.fromCurrency} ${preparedTransaction.fromAmount} -> ${preparedTransaction.toCurrency} ${preparedTransaction.toAmount}`);

                    uniqTransactions.push(duplicates[0])
                }
            }
        }
        // ! Duplicate remover

        console.log(`Transactions to import: ${uniqTransactions.length} / ${preparedTransactions.length}`);

        await exportToBlockpit(uniqTransactions, BLOCKPIT_EMAIL, BLOCKPIT_PASSWORD, BLOCKPIT_DEPOT, CHROME_HEADLESS === undefined ? true : JSON.parse(CHROME_HEADLESS));

        console.log('Finished import. Do not forget to check all imported transactions!');

        process.exit(0);
    } else {
        throw 'BLOCKPIT_EMAIL, BLOCKPIT_PASSWORD and BLOCKPIT_DEPOT need to be supplied to work!';
    }
})();