# ebay-last-call

A simple script which verbally alerts the eBay seller that it's time to ship. Meant to be called via systemd or similar.

I set systemd to run this script at the same time configured as my eBay store's [same business day handling time](https://www.ebay.com/ship/prf#)


## Installation

`npm run install`

This script generates a systemd service, copies it to /etc/systemd/system/ and enables it to run on a schedule.

The time at which the notification will occur is set using environment variable `EBAY_SHIPPING_TIME` using [systemd time format](https://www.freedesktop.org/software/systemd/man/systemd.time.html#). Use a .env file as demonstrated below, or add it to your user profile environment using any other method. EBAY_SHIPPING_TIME must be configured at installation, as it is written to the systemd timer file which summons the notification script.

```
EBAY_SHIPPING_TIME='Mon..Sat *-*-* 08:30'
```
