# ebay-last-call

A simple script which verbally alerts the eBay seller that it's time to ship. Meant to be called via systemd or similar.

I set systemd to run this script at the same time configured as my eBay store's [same business day handling time](https://www.ebay.com/ship/prf#)


## Dependencies

  * cvlc
  * espeak
  * jq

## Installation

`npm run systemd`

This script generates a systemd service, copies it to /etc/systemd/system/ and enables it to run on a schedule.

The time at which the notification will occur is set using `./config/default.json` `ebayShippingTime` using [systemd time format](https://www.freedesktop.org/software/systemd/man/systemd.time.html#).
