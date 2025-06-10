# lagoon-healthandwellnessyukon-ca: Health and Wellness Yukon - Health Authority

## Introduction

This project was generated from
[lagoon-boutique-template](https://github.com/ytgov/lagoon-boutique-template).

## How to Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md)

## Licence

Unless otherwise noted, the source code of this project is distributed under the
[MIT License](LICENSE).

## Requirements

- Install [ddev](https://ddev.readthedocs.io/en/stable/users/install/ddev-installation/) v1.24+.

## Installation

### Install new site from in a local development environment

1. Launch the development environment: `ddev start`
2. Visit the new site's Drupal installation page at `https://lagoon-healthandwellnessyukon-ca.ddev.site`.
3. Install the site with the following options:
   - Choose language: English
   - Installation profile: Minimal
   - Configure site: as desired but site settings will be overridden shortly.
     The site email address should be `eservices@yukon.ca` unless advised otherwise by eServices.
4. Replace the system site UUID in `config/sync/system.site.yml` with the installed value retrieved using
   `ddev drush cget system.site uuid`
5. Import the template's default configuration: `ddev drush cim -y`
6. Genuflect to the Drupal God: `ddev drush cr`
7. Add the user created in step #3 to the Administrator role.
8. Verify that any errors shown on the Drupal
   [Status report](https://lagoon-healthandwellnessyukon-ca.ddev.site/admin/reports/status)
   are within reason.
