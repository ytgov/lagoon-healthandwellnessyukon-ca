FROM ghcr.io/ytgov/lagoon-boutique-base-image-cli:latest

COPY composer.* /app/
RUN COMPOSER_MEMORY_LIMIT=-1 composer install --no-dev
COPY . /app

RUN chmod 555 /app/web/sites/default && \
    chmod 444 /app/web/sites/default/settings.php && \
    chmod 444 /app/web/sites/default/services.yml
    
RUN mkdir -p -v -m775 /app/web/sites/default/files
RUN mkdir -p -v -m775 /app/private

# Compile themes.
RUN cd /app/web/themes/custom/govt_yukon && npm i && npm run compile && cd -
RUN cd /app/web/themes/custom/govt_yukon_claro && npm i && npm run compile && cd -
RUN cd /app/web/themes/custom/govt_yukon_rms && npm i && npm run compile && cd -

# Define where the Drupal Root is located.
ENV WEBROOT=web
