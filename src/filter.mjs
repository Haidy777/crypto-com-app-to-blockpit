export default function filterTransactions (transactions) {
    return transactions.filter(({transactionType}) =>
        transactionType !== 'Transaction Kind' // remove file header
        && transactionType !== 'crypto_earn_program_withdrawn' // remove earn remove transaction
        && transactionType !== 'crypto_earn_program_created' // remove create remove transaction
        && transactionType !== '' // remove crypto card transactions (as they are made in EUR)
        && transactionType !== 'lockup_lock' // remove lock for card transaction
        && transactionType !== 'lockup_upgrade' // remove lock for card transaction
        && transactionType !== 'trading.limit_order.crypto_wallet.fund_lock' // lockup of funds for limit order
    );
}