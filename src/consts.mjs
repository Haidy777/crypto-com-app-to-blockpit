export const CRYPTO_COM_TRANSACTION_TYPES = {
    crypto_viban: 'crypto_viban', // crypto -> fiat
    viban_purchase: 'viban_purchase', // fiat -> crypto
    crypto_viban_exchange: 'crypto_viban_exchange', // crypto -> fiat
    card_top_up: 'card_top_up', // card top up with crypto
    recurring_buy_order: 'recurring_buy_order', // fiat -> crypto

    crypto_earn_interest_paid: 'crypto_earn_interest_paid', // staking interest
    crypto_earn_extra_interest_paid: 'crypto_earn_extra_interest_paid', // extra staking interest

    // only in combination -> converting small balances to cro
    dust_conversion_credited: 'dust_conversion_credited',
    dust_conversion_debited: 'dust_conversion_debited',

    crypto_exchange: 'crypto_exchange', // crypto -> crypto

    crypto_purchase: 'crypto_purchase', // fiat -> eur (über visa glaub ich)

    crypto_transfer: 'crypto_transfer', // Einzahlung von anderem crypto.com Konto
    crypto_deposit: 'crypto_deposit', // Einzahlung
    crypto_withdrawal: 'crypto_withdrawal', // Auszahlung

    referral_gift: 'referral_gift', // Geschenk_erhalten

    mco_stake_reward: 'mco_stake_reward', // card staking rewards?

    referral_card_cashback: 'referral_card_cashback', // cashback?
    card_cashback_reverted: 'card_cashback_reverted', // cashback reversed?

    reimbursement: 'reimbursement', // Spotify / Netflix Erstattung

    referral_bonus: 'referral_bonus', // ref bonus

    crypto_to_exchange_transfer: 'crypto_to_exchange_transfer', // transfers to crypto.com exchange
    exchange_to_crypto_transfer: 'exchange_to_crypto_transfer', // transfers from crypto.com exchange

    viban_deposit: 'viban_deposit', // EUR Einzahlung per SEPA

    viban_card_top_up: 'viban_card_top_up', // Card Top Up from FIAT Wallet
};

export const CRYPTO_COM_DUST_TRANSACTION_TYPES = [CRYPTO_COM_TRANSACTION_TYPES.dust_conversion_credited, CRYPTO_COM_TRANSACTION_TYPES.dust_conversion_debited];

export const BLOCKPIT_TRANSACTION_TYPES = {
    Tausch: 'Tausch',
    Einzahlung: 'Einzahlung',
    Auszahlung: 'Auszahlung',
    Bezahlvorgang: 'Bezahlvorgang',
    Airdrop: 'Airdrop',
    Hardfork: 'Hardfork',
    Mining: 'Mining',
    Verleihung: 'Verleihung',
    Staking: 'Staking',
    Margin_Einkünfte: 'Margin Einkünfte',
    Margin_Verlust: 'Margin Verlust',
    Margin_Gebühr: 'Margin Gebühr',
    Masternode: 'Masternode',
    Bounty: 'Bounty',
    Geschenk_erhalten: 'Geschenk erhalten',
    Geschenk_gegeben: 'Geschenk gegeben',
    Gebühr: 'Gebühr',
    Tokensale: 'Tokensale',
    Security_Token_Dividende: 'Security Token Dividende',
};

export const CRYPTO_COM_TO_BLOCKPIT = {
    [CRYPTO_COM_TRANSACTION_TYPES.crypto_viban]: BLOCKPIT_TRANSACTION_TYPES.Tausch,
    [CRYPTO_COM_TRANSACTION_TYPES.viban_purchase]: BLOCKPIT_TRANSACTION_TYPES.Tausch,
    [CRYPTO_COM_TRANSACTION_TYPES.crypto_viban_exchange]: BLOCKPIT_TRANSACTION_TYPES.Tausch,
    [CRYPTO_COM_TRANSACTION_TYPES.card_top_up]: BLOCKPIT_TRANSACTION_TYPES.Tausch,
    [CRYPTO_COM_TRANSACTION_TYPES.recurring_buy_order]: BLOCKPIT_TRANSACTION_TYPES.Tausch,
    [CRYPTO_COM_TRANSACTION_TYPES.crypto_exchange]: BLOCKPIT_TRANSACTION_TYPES.Tausch,
    [CRYPTO_COM_TRANSACTION_TYPES.crypto_purchase]: BLOCKPIT_TRANSACTION_TYPES.Tausch,

    [CRYPTO_COM_TRANSACTION_TYPES.crypto_earn_interest_paid]: BLOCKPIT_TRANSACTION_TYPES.Staking,
    [CRYPTO_COM_TRANSACTION_TYPES.crypto_earn_extra_interest_paid]: BLOCKPIT_TRANSACTION_TYPES.Staking,
    [CRYPTO_COM_TRANSACTION_TYPES.mco_stake_reward]: BLOCKPIT_TRANSACTION_TYPES.Staking,

    [CRYPTO_COM_TRANSACTION_TYPES.crypto_transfer]: BLOCKPIT_TRANSACTION_TYPES.Einzahlung,
    [CRYPTO_COM_TRANSACTION_TYPES.crypto_deposit]: BLOCKPIT_TRANSACTION_TYPES.Einzahlung,
    [CRYPTO_COM_TRANSACTION_TYPES.exchange_to_crypto_transfer]: BLOCKPIT_TRANSACTION_TYPES.Einzahlung,
    [CRYPTO_COM_TRANSACTION_TYPES.viban_deposit]: BLOCKPIT_TRANSACTION_TYPES.Einzahlung,

    [CRYPTO_COM_TRANSACTION_TYPES.crypto_withdrawal]: BLOCKPIT_TRANSACTION_TYPES.Auszahlung,
    [CRYPTO_COM_TRANSACTION_TYPES.crypto_to_exchange_transfer]: BLOCKPIT_TRANSACTION_TYPES.Auszahlung,
    [CRYPTO_COM_TRANSACTION_TYPES.viban_card_top_up]: BLOCKPIT_TRANSACTION_TYPES.Auszahlung,

    [CRYPTO_COM_TRANSACTION_TYPES.referral_card_cashback]: BLOCKPIT_TRANSACTION_TYPES.Geschenk_erhalten,
    [CRYPTO_COM_TRANSACTION_TYPES.referral_bonus]: BLOCKPIT_TRANSACTION_TYPES.Geschenk_erhalten,
    [CRYPTO_COM_TRANSACTION_TYPES.reimbursement]: BLOCKPIT_TRANSACTION_TYPES.Geschenk_erhalten,
};

export const KNOWN_CURRENCIES = {
    CRO: 'CRO',
    EUR: 'EUR',
    BTC: 'BTC',
    ETH: 'ETH',
    LTC: 'LTC',
    DOT: 'DOT',
    ENJ: 'ENJ',
    NEAR: 'NEAR',
    UNI: 'UNI',
    ZIL: 'ZIL',
    DOGE: 'DOGE',
    SHIB: 'SHIB',
    EFI: 'EFI',
    USDC: 'USDC',
    BOSON: 'BOSON',
    MANA: 'MANA',
    SDN: 'SDN',
    USDT: 'USDT',
    HBAR: 'HBAR',
    DYDX: 'DYDX',
    AXS: 'AXS',
    MATIC: 'MATIC',
};

export const CURRENCY_BLOCKPIT_NAME_MAP = {
    [KNOWN_CURRENCIES.CRO]: 'Crypto.com Coin (CRO)',
    [KNOWN_CURRENCIES.EUR]: 'Euro (EUR)',
    [KNOWN_CURRENCIES.BTC]: 'Bitcoin (BTC)',
    [KNOWN_CURRENCIES.ETH]: 'Ethereum (ETH)',
    [KNOWN_CURRENCIES.LTC]: 'Litecoin (LTC)',
    [KNOWN_CURRENCIES.DOT]: 'Polkadot (DOT)',
    [KNOWN_CURRENCIES.ENJ]: 'Enjin Coin (ENJ)',
    [KNOWN_CURRENCIES.NEAR]: 'NEAR Protocol (NEAR)',
    [KNOWN_CURRENCIES.UNI]: 'Uniswap (UNI)',
    [KNOWN_CURRENCIES.ZIL]: 'Zilliqa (ZIL)',
    [KNOWN_CURRENCIES.DOGE]: 'Dogecoin (DOGE)',
    [KNOWN_CURRENCIES.SHIB]: 'SHIBA INU (SHIB)',
    [KNOWN_CURRENCIES.EFI]: 'Efinity Token (EFI)',
    [KNOWN_CURRENCIES.USDC]: 'USD Coin (USDC)',
    [KNOWN_CURRENCIES.BOSON]: 'Boson Protocol (BOSON)',
    [KNOWN_CURRENCIES.MANA]: 'Decentraland (MANA)',
    [KNOWN_CURRENCIES.SDN]: 'Shiden Network (SDN)',
    [KNOWN_CURRENCIES.USDT]: 'Tether (USDT)',
    [KNOWN_CURRENCIES.HBAR]: 'Hedera Hashgraph (HBAR)',
    [KNOWN_CURRENCIES.DYDX]: 'dYdX (DYDX)',
    [KNOWN_CURRENCIES.AXS]: 'Axie Infinity (old) (AXS)',
    [KNOWN_CURRENCIES.MATIC]: 'Polygon (MATIC)',
}

export const SPECIAL_SEARCH_CURRENCIES = {
    [KNOWN_CURRENCIES.UNI]: 'unisw',
    [KNOWN_CURRENCIES.CRO]: 'CRO',
    [KNOWN_CURRENCIES.EUR]: 'EUR',
    [KNOWN_CURRENCIES.BTC]: 'BTC',
    [KNOWN_CURRENCIES.ETH]: 'ETH',
    [KNOWN_CURRENCIES.LTC]: 'LTC',
    [KNOWN_CURRENCIES.DOT]: 'DOT',
    [KNOWN_CURRENCIES.ENJ]: 'ENJ',
    [KNOWN_CURRENCIES.NEAR]: 'NEAR',
    [KNOWN_CURRENCIES.ZIL]: 'ZIL',
    [KNOWN_CURRENCIES.DOGE]: 'DOGE',
    [KNOWN_CURRENCIES.SHIB]: 'SHIB',
    [KNOWN_CURRENCIES.EFI]: 'EFI',
    [KNOWN_CURRENCIES.USDC]: 'USDC',
    [KNOWN_CURRENCIES.BOSON]: 'BOSON',
    [KNOWN_CURRENCIES.MANA]: 'MANA',
    [KNOWN_CURRENCIES.SDN]: 'SDN',
    [KNOWN_CURRENCIES.USDT]: 'USDT',
    [KNOWN_CURRENCIES.HBAR]: 'HBAR',
    [KNOWN_CURRENCIES.DYDX]: 'DYDX',
    [KNOWN_CURRENCIES.AXS]: 'AXS',
    [KNOWN_CURRENCIES.MATIC]: 'MATIC',
}