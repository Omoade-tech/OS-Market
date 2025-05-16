FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy existing application directory
COPY . .

# Copy .env.example to .env if .env doesn't exist
RUN if [ ! -f .env ]; then cp .env.example .env; fi

# Install dependencies
RUN composer install --no-dev

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Configure Apache
RUN a2enmod rewrite
COPY docker/apache/000-default.conf /etc/apache2/sites-available/000-default.conf

# Update Apache configuration to use PORT environment variable
RUN echo "Listen \${PORT:-80}" > /etc/apache2/ports.conf
RUN sed -i 's/:80>/:${PORT:-80}>/g' /etc/apache2/sites-available/000-default.conf

# Cache configuration
RUN php artisan config:cache
RUN php artisan route:cache

# Create a script to run migrations
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port (will be overridden by PORT environment variable)
EXPOSE 80

# Start Apache with migrations
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"] 