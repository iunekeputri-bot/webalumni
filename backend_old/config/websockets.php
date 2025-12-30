<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Laravel WebSockets Configuration - OPTIMIZED FOR LOW LATENCY
    |--------------------------------------------------------------------------
    |
    | This configuration is optimized for minimum latency with Redis support.
    | Designed for production use with high concurrent connections.
    |
    */

    'debug' => env('WEBSOCKETS_DEBUG', false),

    'host' => env('WEBSOCKET_HOST', '0.0.0.0'),

    'port' => env('WEBSOCKET_PORT', 6001),

    'ssl' => [
        'certPath' => env('WEBSOCKET_SSL_CERT_PATH', null),
        'keyPath' => env('WEBSOCKET_SSL_KEY_PATH', null),
        'passphrase' => env('WEBSOCKET_SSL_PASSPHRASE', null),
        'verify_peer' => env('WEBSOCKET_SSL_VERIFY_PEER', false),
        'allow_self_signed' => env('WEBSOCKET_SSL_ALLOW_SELF_SIGNED', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Performance Optimization
    |--------------------------------------------------------------------------
    |
    | These settings optimize for low latency and high throughput
    |
    */

    'max_request_size_in_kb' => env('WEBSOCKETS_MAX_REQUEST_SIZE', 250),
    
    'heartbeat_interval' => env('WEBSOCKETS_HEARTBEAT_INTERVAL', 30),
    
    'close_timeout' => env('WEBSOCKETS_CLOSE_TIMEOUT', 5),

    /*
    |--------------------------------------------------------------------------
    | App Configuration
    |--------------------------------------------------------------------------
    |
    | Configured for high capacity with client messages enabled
    |
    */

    'apps' => [
        [
            'id' => env('PUSHER_APP_ID', 1),
            'name' => env('APP_NAME', 'Laravel App'),
            'key' => env('PUSHER_APP_KEY', 'local-websocket-key'),
            'secret' => env('PUSHER_APP_SECRET', 'local-websocket-secret'),
            'path' => '/app',
            'capacity' => env('WEBSOCKETS_CAPACITY', null), // null = unlimited
            'enable_client_messages' => env('WEBSOCKETS_ENABLE_CLIENT_MESSAGES', true),
            'enable_statistics' => env('WEBSOCKETS_ENABLE_STATISTICS', false),
            'allowed_origins' => env('WEBSOCKETS_ALLOWED_ORIGINS', ['*']),
            'max_connection_age' => env('WEBSOCKETS_MAX_CONNECTION_AGE', 0), // 0 = no limit
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Statistics Configuration - DISABLED for Performance
    |--------------------------------------------------------------------------
    |
    | Statistics disabled to reduce overhead and improve latency
    |
    */

    'statistics' => [
        'enabled' => env('WEBSOCKETS_STATISTICS_ENABLED', false),
        'interval' => 60,
        'retention_period' => 604800,
        'drivers' => [
            'log' => [
                'enabled' => false,
            ],
            'model' => [
                'enabled' => false,
                'model' => \BeyondCode\LaravelWebSockets\Statistics\Models\WebSocketsStatisticsEntry::class,
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Replicator Configuration - REDIS ENABLED
    |--------------------------------------------------------------------------
    |
    | Enable replication for horizontal scaling with Redis
    |
    */

    'replicator' => [
        'enabled' => env('WEBSOCKETS_REPLICATOR_ENABLED', true),
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'port' => env('REDIS_PORT', 6379),
        'password' => env('REDIS_PASSWORD', null),
    ],

    /*
    |--------------------------------------------------------------------------
    | Channel Manager - REDIS
    |--------------------------------------------------------------------------
    |
    | Use Redis for channel management for better performance
    |
    */

    'channel_manager' => \BeyondCode\LaravelWebSockets\ChannelManagers\RedisChannelManager::class,

];
