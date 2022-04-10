export default function parseTransactions(transactions) {
    return transactions.map(([timestamp, description, fromCurrency, fromAmount, toCurrency, toAmount, nativeCurrency, nativeAmount, nativeAmountUsd, transactionType]) => ({
        timestamp,
        description,
        fromCurrency,
        fromAmount: Math.abs(`${fromAmount}`.startsWith('.') ? Number(`0${fromAmount}`) : Number(fromAmount)).toFixed(18).replace('.', ','), // TODO replace with a parsing library!
        toCurrency,
        toAmount: Math.abs(`${toAmount}`.startsWith('.') ? Number(`0${toAmount}`) : Number(toAmount)).toFixed(18).replace('.', ','), // TODO replace with a parsing library!
        nativeCurrency,
        nativeAmount: Math.abs(`${nativeAmount}`.startsWith('.') ? Number(`0${nativeAmount}`) : Number(nativeAmount)).toFixed(18).replace('.', ','), // TODO replace with a parsing library!
        nativeAmountUsd,
        transactionType
    }))
}