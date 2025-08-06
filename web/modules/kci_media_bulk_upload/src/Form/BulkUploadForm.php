<?php

namespace Drupal\kci_media_bulk_upload\Form;

use Drupal\Component\Utility\Environment;
use Drupal\Core\Entity\EntityTypeBundleInfoInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\StringTranslation\TranslationInterface;
use Drupal\kci_media_bulk_upload\MediaHelper;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * A form for uploading multiple media assets at once.
 */
class BulkUploadForm extends FormBase {

  /**
   * Construct a BulkUploadForm object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   The entity type manager.
   * @param \Drupal\kci_media_bulk_upload\MediaHelper $helper
   *   The media helper service.
   * @param \Drupal\Core\StringTranslation\TranslationInterface $translator
   *   The string translation service.
   * @param \Drupal\Core\Entity\EntityTypeBundleInfoInterface $bundleInfo
   *   The entity type bundle info service.
   */
  public function __construct(
    protected EntityTypeManagerInterface $entityTypeManager,
    protected MediaHelper $helper,
    TranslationInterface $translator,
    protected EntityTypeBundleInfoInterface $bundleInfo,
  ) {
    $this->setStringTranslation($translator);
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager'),
      $container->get('kci.media_helper'),
      $container->get('string_translation'),
      $container->get('entity_type.bundle.info')
    );
  }

  /**
   * Get a media-type specific page title for the bulk upload form.
   */
  public static function getTypeSpecificTitle(RouteMatchInterface $route_match) {
    $media_type = $route_match->getParameter('media_type');
    if ($media_type) {
      $media_type_name = $media_type->label();
      return t('@type - Bulk upload', ['@type' => $media_type_name]);
    }
    return t('Bulk Upload');
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'bulk_upload_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $allow_all = $this->currentUser()->hasPermission('create media') || $this->currentUser()->hasPermission('administer media');

    $is_allowed = TRUE;

    // Media-type specific bulk upload form.
    /** @var \Drupal\media\MediaTypeInterface $media_type */
    $media_type = $this->getRouteMatch()->getParameter('media_type');
    if (!empty($media_type)) {
      if (!$allow_all && !$this->currentUser()->hasPermission('create ' . $media_type->id() . ' media')) {
        $this->messenger()->addError($this->t('You do not have permission to create @type media.', ['@type' => $media_type->label()]));
        $is_allowed = FALSE;
      }
    }
    else {
      $bundles = $this->bundleInfo->getBundleInfo('media');
      $options = [];

      foreach (array_keys($bundles) as $key) {
        if ($allow_all || $this->currentUser()->hasPermission('create ' . $key . ' media')) {
          $options[$key] = $bundles[$key]['label'];
        }
      }
      if (count($options) == 0) {
        $this->messenger()->addError($this->t('You need access to be able to create at least one type of media.'));
        $is_allowed = FALSE;
      }
    }

    if (!$is_allowed) {
      // Stop here if the user doesn't have permission to create any media.
      return [];
    }

    // If there's a default value, setup a hidden input to pass it along.
    // Otherwise, provide a select list.
    if (!empty($media_type)) {
      $bundle = $media_type->id();
    }
    else {
      // Get the bundle from the form state (present if the form was rebuilt).
      $bundle = $form_state->getValue('select_extension');
      // Prepend the empty option.
      $options = ['' => $this->t('- Select -')] + $options;
      // Create the select field.
      $form['select_extension'] = [
        '#type' => 'select',
        '#title' => $this
          ->t('Select A File type'),
        '#options' => $options,
        '#default_value' => $bundle,
        '#required' => TRUE,
        // Add an ajax callback to reload the form when the select list
        // changes.
        '#ajax' => [
          'callback' => '::ajaxRebuildForm',
          'wrapper'  => 'bulk-upload-form',
          'event'    => 'change',
        ],
      ];
      // Wrap the form for the ajax callback.
      $form['#prefix'] = '<div id="bulk-upload-form">';
      $form['#suffix'] = '</div>';
    }
    if (!empty($bundle)) {
      // If we have a bundle specified, render the dropzone widget.
      $extensions = (!empty($bundle)) ? $this->helper->getFileExtensions(TRUE, [$bundle]) : $this->helper->getFileExtensions(TRUE, array_keys($options));
      $form['dropzone'] = [
        '#type' => 'dropzonejs',
        '#dropzone_description' => $this->t('Drag files here to upload them'),
        '#extensions' => implode(' ', $extensions),
      ];
      $max_size = Environment::getUploadMaxSize();

      $variables = [
        '@max_size' => static::bytesToString($max_size),
        '@extensions' => implode(' ', $extensions),
      ];
      $form['dropzone']['#description'] = $this->t('You can upload as many files as you like. Each file can be up to @max_size in size. The following file extensions are accepted: @extensions', $variables);
    }
    else {
      // Otherwise display a message.
      $form['dropzone'] = [
        '#markup' => '<p><strong>' . $this->t('Please select a file type to upload files.') . '</strong></p>',
      ];
    }
    $form['continue'] = [
      '#type' => 'submit',
      '#value' => $this->t('Continue'),
    ];

    return $form;
  }

  /**
   * AJAX callback function to rebuild the form.
   */
  public function ajaxRebuildForm(array &$form, FormStateInterface $form_state) {
    return $form;
  }

  /**
   * Converts a number of bytes into a human-readable string.
   *
   * @param int $bytes
   *   A number of bytes.
   *
   * @return string
   *   The human-readable measurement, like '2 MB' or '10 GB'.
   */
  public static function bytesToString($bytes) {
    $units = array_map('t', ['bytes', 'KB', 'MB', 'GB', 'TB']);

    while ($bytes > 1024) {
      $bytes /= 1024;
      array_shift($units);
    }
    return $bytes . ' ' . reset($units);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $bulk_create = [];

    $uploads = $form_state->getValue(['dropzone', 'uploaded_files']);

    /** @var \Drupal\media\MediaTypeInterface $media_type */
    $media_type = $this->getRouteMatch()->getParameter('media_type');
    $bundle = $media_type?->id() ?? $form_state->getValue('select_extension');
    foreach ($uploads as $upload) {
      // Create a file entity for the temporary file.
      /** @var \Drupal\file\FileInterface $file */
      $file = $this->entityTypeManager->getStorage('file')->create([
        'uri' => $upload['path'],
        'uid' => $this->currentUser()->id(),
      ]);
      $file->setTemporary();
      $file->save();

      $entity = $this->helper->createMediaEntity($file, $bundle);

      $file = MediaHelper::useFile($entity, $file);
      $file->setPermanent();
      $file->save();
      $entity->save();
      array_push($bulk_create, $bulk_create ? $entity->id() : $entity);
    }

    if ($bulk_create) {
      /** @var \Drupal\media\MediaInterface $entity */
      $redirect = array_shift($bulk_create)->toUrl('edit-form', [
        'query' => [
          'bulk_create' => implode(',', $bulk_create),
        ],
      ]);
      $form_state->setRedirectUrl($redirect);
    }
  }

}
