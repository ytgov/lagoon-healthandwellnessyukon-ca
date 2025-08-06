<?php

declare(strict_types = 1);

namespace Drupal\auto_disable_menu_items\Form;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Entity\EntityTypeManager;
use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Admin settings form for Auto-Disable Menu Items module.
 */
class AutoDisableMenuItemsSettingsForm extends ConfigFormBase {
  use StringTranslationTrait;

  /**
   * Entity type manager service instance.
   *
   * @var \Drupal\Core\Entity\EntityTypeManager
   */
  protected $entityTypeManager;

  /**
   * Construct our settings form.
   */
  public function __construct(ConfigFactoryInterface $config_factory, EntityTypeManager $entityTypeManager) {
    parent::__construct($config_factory);
    $this->entityTypeManager = $entityTypeManager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      $container->get('entity_type.manager')
    );
  }

  /**
   * Return the form id.
   */
  public function getFormId() {
    return 'auto_disable_menu_items_settings';
  }

  /**
   * Get config name.
   */
  protected function getEditableConfigNames() {
    return [
      'auto_disable_menu_items.settings',
    ];
  }

  /**
   * Form build.
   *
   * @param array $form
   *   The form array.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The form_state array.
   *
   * @return array
   *   Return array of form data.
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('auto_disable_menu_items.settings');

    $contentTypeOptions = $this->getExistingContentTypes();

    $configuredContentTypes = $config->get('auto_disable_content_types');

    if (empty($configuredContentTypes)) {
      $configuredContentTypes = [];
    }

    $form['auto_disable_content_types'] = [
      '#type' => 'checkboxes',
      '#title' => $this->t('Content Types'),
      '#description' => $this->t('Select the content types that should have their menu items always automatically disabled when they are saved.'),
      '#empty_option' => $this->t('-- None --'),
      '#options' => $contentTypeOptions,
      '#default_value' => $configuredContentTypes,
      '#required' => TRUE,
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * Submit form.
   *
   * @param array $form
   *   The form array.
   * @param \Drupal\Core\Form\FormStateInterface $form_state
   *   The form_state object.
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->configFactory->getEditable('auto_disable_menu_items.settings')
      // Set the submitted configuration setting.
      ->set('auto_disable_content_types',
        $form_state->getValue('auto_disable_content_types'))
      ->save();

    parent::submitForm($form, $form_state);
  }

  /**
   * Returns a list of all the content types currently installed.
   *
   * @return array
   *   An array of content types.
   */
  protected function getExistingContentTypes() {
    $types = [];
    $contentTypes = $this->entityTypeManager->getStorage('node_type')->loadMultiple();
    foreach ($contentTypes as $contentType) {
      $types[$contentType->id()] = $contentType->label();
    }
    return $types;
  }

}
