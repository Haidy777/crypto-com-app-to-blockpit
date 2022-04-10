# crypto-com-app-to-blockpit
Import crypto.com App Transactions into Blockpit.io

Currently, there isn't an easy way to import Transactions from the crypto.com App into the Blockpit.io tax software.
As a developer I set out and built my own :)

At first I was working with a converter of the crypto.com CSV-Files to fit them into the Blockpit.io CSV-Format. Sadly after many failures, I switched over to a more "brutal" method and built a small click-script that can enter all transactions through the web interface after parsing them.
Because of this (and because the CSV format of the exports) could change, this thing can break anytime. As long as I'm actively using it, I will maintain this repository.

For an example I added the month of March 2022 of my transactions into the import directory. Be sure to remove them before you add your own, or you are going to import my transactions and mess up your asset balances.

**Use at your own risk! The first time I imported I had a bunch of duplicates, but there is know duplicate detection. Be sure to check the Values in Blockpit after importing to see if they could be incorrect.**
