<?php

/**
 * @file
 * Shared development (non-production) settings.
 *
 * Add your own local settings overrides to a file named `settings.local.yml`.
 */

// Default local dev settings.
$settings['skip_permissions_hardening'] = TRUE;
$config['system.logging']['error_level'] = 'verbose';
$config['system.performance']['css']['preprocess'] = FALSE;
$config['system.performance']['js']['preprocess'] = FALSE;

// Development and Test environments Matomo site ID.
$config['matomo.settings']['site_id'] = 4;
