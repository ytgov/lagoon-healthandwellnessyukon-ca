<?php

/**
 * @file
 * theme-settings.php
 *
 * Provides theme settings for KCI Base theme.
 */

declare(strict_types=1);

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Markup;

/**
 * Implements hook_form_system_theme_settings_alter() for settings form.
 *
 * Replace Barrio setting options with subtheme ones.
 */
function kci_base_form_system_theme_settings_alter(&$form, FormStateInterface $form_state, $form_id = NULL) {
  $form['components']['navbar']['bootstrap_barrio_navbar_top_background']['#options'] = [
    'bg-primary' => t('Primary'),
    'bg-secondary' => t('Secondary'),
    'bg-light' => t('Light'),
    'bg-dark' => t('Dark'),
    'bg-white' => t('White'),
    'bg-transparent' => t('Transparent'),
  ];
  $form['components']['navbar']['bootstrap_barrio_navbar_background']['#options'] = [
    'bg-primary' => t('Primary'),
    'bg-secondary' => t('Secondary'),
    'bg-light' => t('Light'),
    'bg-dark' => t('Dark'),
    'bg-white' => t('White'),
    'bg-transparent' => t('Transparent'),
  ];

  $form['affix']['whole_header'] = [
    '#type' => 'details',
    '#title' => t('Affix whole header'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#weight' => -10,
  ];
  $form['affix']['whole_header']['kci_base_floating_header'] = [
    '#type' => 'checkbox',
    '#title' => t('Float header over banner and affix'),
    '#default_value' => theme_get_setting('kci_base_floating_header'),
    '#description' => t('This will keep the header always in a fixed position, floating over the banner if present with transparent background. The solid background color will only apply when scrolling down. This option negates any other header element affix options.'),
  ];
  $form['affix']['whole_header']['kci_base_floating_header_home_only'] = [
    '#type' => 'checkbox',
    '#title' => t('Floating header only on home page'),
    '#default_value' => theme_get_setting('kci_base_floating_header_home_only'),
    '#description' => t('This will only float the header on the home page. The header will be static on all other pages.'),
    '#states' => [
      'visible' => [
        ':input[name="kci_base_floating_header"]' => ['checked' => TRUE],
      ],
    ],
  ];
  $form['affix']['whole_header']['kci_base_whole_header_affix'] = [
    '#type' => 'checkbox',
    '#title' => t('Affix whole header'),
    '#default_value' => theme_get_setting('kci_base_whole_header_affix'),
    '#description' => t('This option negates the individual header nav element affix options.'),
    '#states' => [
      'visible' => [
        ':input[name="kci_base_floating_header"]' => ['checked' => FALSE],
      ],
    ],
  ];

  $form['affix']['whole_header']['kci_base_semi_transparent_header_on_scroll'] = [
    '#type' => 'checkbox',
    '#title' => t('Make header semi-transparent when scrolled'),
    '#default_value' => theme_get_setting('kci_base_semi_transparent_header_on_scroll'),
    '#description' => t('When you scroll down, this will make the header transparent and apply a blur backdrop filter in compatible browsers. The amount of transparency and blur can be controlled by sass variables, defaulting to 15% transparency and 20px blur.'),
    '#states' => [
      'visible' => [
        [':input[name="kci_base_floating_header"]' => ['checked' => TRUE]],
        'or',
        [':input[name="kci_base_whole_header_affix"]' => ['checked' => TRUE]],
      ],
    ],
  ];

  $form['affix']['navbar_top']['#states'] = [
    'visible' => [
      ':input[name="kci_base_whole_header_affix"]' => ['checked' => FALSE],
      ':input[name="kci_base_floating_header"]' => ['checked' => FALSE],
    ],
  ];

  $form['affix']['navbar']['#states'] = [
    'visible' => [
      ':input[name="kci_base_whole_header_affix"]' => ['checked' => FALSE],
      ':input[name="kci_base_floating_header"]' => ['checked' => FALSE],
    ],
  ];
  $form['logo']['kci_base_footer_logo_path'] = [
    '#type' => 'textfield',
    '#title' => t('Footer Logo File Path'),
    '#default_value' => theme_get_setting('kci_base_footer_logo_path'),
    '#description' => t('If left blank, the footer will use the same logo as the header. You should supply a path within themes/custom/site_theme for this logo file.'),
  ];

  $primary_menu_blocks_stacked = theme_get_setting('kci_base_primary_menu_blocks_stacked');
  if (isset($form['layout']['region']['primary_menu'])) {
    $form['layout']['region']['primary_menu']['kci_base_primary_menu_blocks_stacked'] = [
      '#type' => 'checkbox',
      '#title' => t('Vertically stack blocks in this region'),
      '#default_value' => $primary_menu_blocks_stacked,
    ];
  }

  $form['components']['navbar']['kci_base_footer_navbar_is_horizontal'] = [
    '#type' => 'checkbox',
    '#title' => t('Display footer navbar menu horizontally'),
    '#description' => t('The footer menu normally displays vertically. Enable this to display the menu items horizontally instead.'),
    '#default_value' => theme_get_setting('kci_base_footer_navbar_is_horizontal'),
  ];

  unset($form['components']['navbar_behaviour']['bootstrap_barrio_navbar_flyout'], $form['components']['navbar_behaviour']['bootstrap_barrio_navbar_slide']);

  $form['components']['navbar_behaviour']['kci_base_navbar_use_full_width'] = [
    '#type' => 'checkbox',
    '#title' => t('Render main navigation full width below branding'),
    '#default_value' => theme_get_setting('kci_base_navbar_use_full_width'),
    '#states' => [
      'visible' => [
        ':input[name="bootstrap_barrio_navbar_offcanvas"]' => ['value' => ''],
      ],
    ],
  ];

  $full_width_nav_position = theme_get_setting('kci_base_navbar_full_width_position');
  if (empty($full_width_nav_position)) {
    $full_width_nav_position = 'start';
  }
  $form['components']['navbar_behaviour']['kci_base_navbar_full_width_position'] = [
    '#type' => 'radios',
    '#title' => t('Full width menu position'),
    '#default_value' => $full_width_nav_position,
    '#options' => [
      'start'  => t('Left'),
      'center' => t('Center'),
      'end'  => t('Right'),
    ],
    '#states' => [
      'visible' => [
        ':input[name="kci_base_navbar_use_full_width"]' => ['checked' => TRUE],
        ':input[name="bootstrap_barrio_navbar_offcanvas"]' => ['value' => ''],
      ],
    ],
  ];

  $form['components']['navbar_behaviour']['kci_base_navbar_offcanvas_doublewide'] = [
    '#type' => 'checkbox',
    '#title' => t('Double-wide offcanvas menu'),
    '#default_value' => theme_get_setting('kci_base_navbar_offcanvas_doublewide'),
    '#description' => t('Doubles the $offcanvas-horizontal-width bootstrap value and puts the menu into two columns.'),
    '#states' => [
      'visible' => [
        ':input[name="bootstrap_barrio_navbar_offcanvas"]' => ['value' => 'offcanvas-collapse'],
      ],
    ],
  ];

  $form['colors']['safari_theme'] = [
    '#type' => 'details',
    '#title' => t('Safari Theme'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  ];
  $form['colors']['safari_theme']['kci_base_safari_theme_color'] = [
    '#type' => 'textfield',
    '#title' => t('Safari theme color'),
    '#description' => t('Enter a hex code (with or without the # sign at the start) to specify the Safari theme color. This will set the color of the Safari title/tab bar on mobile and desktop. Note that Safari will ignore the colour if it interferes with any of the normal UI elements.'),
    '#default_value' => theme_get_setting('kci_base_safari_theme_color'),
    '#size' => 7,
  ];

  $form['fonts']['icons']['bootstrap_barrio_icons']['#options']['fontawesome_6'] = 'Font Awesome 6';

  $form['layout']['sidebar_position']['kci_base_sidebar_mobile_position'] = [
    '#type' => 'select',
    '#title' => t('Mobile sidebars position'),
    '#default_value' => theme_get_setting('kci_base_sidebar_mobile_position'),
    '#options' => [
      'first'  => t('Top'),
      'last' => t('Bottom'),
    ],
  ];

  $form['layout']['floating_tabs'] = [
    '#type' => 'details',
    '#title' => t('Floating Tabs'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#description' => t('Tabs (e.g. View, Edit etc) are normally floated at the bottom of the window. This is good for admins, but not always desirable for publicly accessible pages, even when logged in as an admin. Configure the paths where you want to disable floating tabs.'),
  ];

  $default_floating_tab_excludes = theme_get_setting('kci_base_floating_tabs_disable_paths');
  if (empty($default_floating_tab_excludes)) {
    $default_floating_tab_excludes = "/user\n/user/*";
  }
  $form['layout']['floating_tabs']['kci_base_floating_tabs_disable_paths'] = [
    '#type' => 'textarea',
    '#title' => t('Disable floating tabs on these paths'),
    '#default_value' => $default_floating_tab_excludes,
    '#description' => t('Enter one path per line. Use * as a wildcard. Example: /node/*. Preceding slash is not required. Always enter a canonical Drupal path, not an alias.'),
    '#element_validate' => ['kci_base_floating_tabs_disable_paths_validate'],
  ];
  $form['email_options'] = [
    '#type' => 'details',
    '#title' => t('Email Options'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#weight' => $form['bootstrap']['#weight'] + 1,
  ];
  $form['email_options']['header'] = [
    '#type' => 'details',
    '#title' => t('Email Header/Branding'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ];
  $header_alignment = theme_get_setting('kci_base_email_header_alignment') ?: 'left';
  $form['email_options']['header']['kci_base_email_header_alignment'] = [
    '#type' => 'radios',
    '#title' => t('Logo and Title Alignment'),
    '#options' => [
      'left'   => t('Left'),
      'center' => t('Center'),
      'right'  => t('Right'),
    ],
    '#description' => t('Choose how the logo and title will be aligned horizontally in the email header area.'),
    '#default_value' => $header_alignment,
    '#required' => TRUE,
  ];
  $logo_position = theme_get_setting('kci_base_email_logo_position') ?: 'inline';
  $form['email_options']['header']['kci_base_email_logo_position'] = [
    '#type' => 'radios',
    '#title' => t('Logo Position'),
    '#options' => [
      'inline'   => t('In-line (left)'),
      'above' => t('Above'),
    ],
    '#description' => t('Choose how the logo will be positioned in relation to the title and subtitle text. This will work in conjunction with the alignment setting.'),
    '#default_value' => $logo_position,
  ];
  $logo_path = theme_get_setting('kci_base_email_logo_path') ?: 'themes/custom/site_theme/images/email-logo.png';
  $form['email_options']['header']['kci_base_email_logo_path'] = [
    '#type' => 'textfield',
    '#title' => t('Logo Path'),
    '#description' => t('Enter the path to the logo file. This should be a full path from the Drupal docroot without a leading slash.'),
    '#default_value' => $logo_path,
    '#required' => TRUE,
  ];
  $form['email_options']['header']['kci_base_email_title'] = [
    '#type' => 'textfield',
    '#title' => t('Title'),
    '#description' => t('Enter the title to display in the email header. If left blank, the site name will be used.'),
    '#default_value' => theme_get_setting('kci_base_email_title'),
  ];
  $form['email_options']['header']['kci_base_email_subtitle'] = [
    '#type' => 'textfield',
    '#title' => t('Subtitle'),
    '#description' => t('Enter a subtitle to display in the email header. If left blank, the site slogan (if there is one) will be used, otherwise no subtitle will be displayed.'),
    '#default_value' => theme_get_setting('kci_base_email_subtitle'),
  ];
  $form['email_options']['footer'] = [
    '#type' => 'details',
    '#title' => t('Email Footer'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ];
  $footer_text = theme_get_setting('kci_base_email_footer_text') ?: [
    'value' => '<h4>[site:name]</h4>
<p>123 Any Street, Yellowknife, NT X1A 1X1<br>
Phone: 867-123-4567<br>
Email: <a href="mailto:test@example.com">test@example.com</a></p>',
    'format' => 'email_html',
  ];
  $form['email_options']['footer']['kci_base_email_footer_text'] = [
    '#type' => 'text_format',
    '#title' => t('Footer Text'),
    '#description' => t('Enter the text to display in the email footer. This can be used for disclaimers, contact information, etc. You can include tokens such as [site:name] or [date:custom:Y] to include the site name or the current year for a copyright.'),
    '#default_value' => $footer_text['value'],
    '#format' => $footer_text['format'],
    '#required' => TRUE,
  ];
}

/**
 * Validate the floating tabs disable paths.
 *
 * @param array $element
 *   The form element.
 * @param \Drupal\Core\Form\FormStateInterface $form_state
 *   The form state.
 */
function kci_base_floating_tabs_disable_paths_validate($element, FormStateInterface $form_state) {
  $value = $element['#value'];
  $paths = explode("\n", $value);
  $paths = array_map('trim', $paths);
  $paths = array_filter($paths);
  // Load all routes and check if the paths are valid. Account for * in paths
  // as a wildcard.
  /**
   * @var \Drupal\Core\Routing\RouteProviderInterface $route_provider
   */
  $route_provider = \Drupal::service('router.route_provider');
  $routes = $route_provider->getAllRoutes();
  $invalid_paths = [];
  foreach ($paths as $path) {
    $user_entered_path = $path;
    $path = trim($path, '/');
    $path = trim($path);
    $path = str_replace('*', '%', $path);
    $path = str_replace('/', '\/', $path);
    $path = str_replace('%', '.*', $path);
    $path = "/$path/";
    $valid_route = FALSE;
    foreach ($routes as $route) {
      $valid_route = preg_match($path, $route->getPath());
      if ($valid_route) {
        break;
      }
    }
    if (!$valid_route) {
      $invalid_paths[] = $user_entered_path;
    }
  }
  if (!empty($invalid_paths)) {
    $form_state->setError($element, t('The following paths are invalid: @paths', ['@paths' => Markup::create('<ul><li>' . implode('</li><li>', $invalid_paths) . '</li></ul>')]));
  }
  else {
    // Set the fixed up value.
    $element['#value'] = implode("\n", $paths);
    $form_state->setValueForElement($element, $element['#value']);
  }
}
