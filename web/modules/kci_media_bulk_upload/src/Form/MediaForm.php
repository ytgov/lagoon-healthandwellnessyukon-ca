<?php

namespace Drupal\kci_media_bulk_upload\Form;

use Drupal\Core\Entity\Exception\UndefinedLinkTemplateException;
use Drupal\Core\Form\FormStateInterface;
use Drupal\media\MediaForm as BaseMediaForm;

/**
 * Adds dynamic preview support to the media entity form.
 */
class MediaForm extends BaseMediaForm {

  /**
   * {@inheritdoc}
   */
  public function save(array $form, FormStateInterface $form_state) {
    parent::save($form, $form_state);

    $entity = $this->getEntity();
    $queue = $this->getRequest()->query->get('bulk_create');
    // If there are no more entities to create, redirect to the collection.
    if (empty($queue)) {
      try {
        $form_state->setRedirectUrl($entity->toUrl('collection'));
      }
      catch (UndefinedLinkTemplateException $e) {
        // The entity type does not declare a collection, so don't do
        // anything.
      }
      finally {
        return;
      }
    }

    // Redirect to the edit form for the next entity in line.
    $queue = explode(',', $queue);
    $next_entity_id = array_shift($queue);
    $next_entity_edit_form = $this->entityTypeManager->getStorage($entity->getEntityTypeId())
      ->load($next_entity_id)
      ->toUrl('edit-form');

    // If there are more entities to edit, ensure they're mentioned in the query
    // string of the next entity's edit form.
    $query = $next_entity_edit_form->getOption('query') ?: [];
    if ($queue) {
      $query['bulk_create'] = implode(',', $queue);
      $next_entity_edit_form->setOption('query', $query);
    }
    $form_state->setRedirectUrl($next_entity_edit_form);
  }

}
