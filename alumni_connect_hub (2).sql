-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 03, 2026 at 08:28 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `alumni_connect_hub`
--

-- --------------------------------------------------------

--
-- Table structure for table `alumni`
--

CREATE TABLE `alumni` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `birth_date` date DEFAULT NULL,
  `nisn` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `major` varchar(191) NOT NULL,
  `graduation_year` year(4) NOT NULL,
  `status` enum('active','inactive','pending') NOT NULL DEFAULT 'pending',
  `join_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `skills` text DEFAULT NULL,
  `work_status` varchar(191) NOT NULL DEFAULT 'siap_bekerja',
  `avatar` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `alumni`
--

INSERT INTO `alumni` (`id`, `user_id`, `name`, `email`, `birth_date`, `nisn`, `phone`, `major`, `graduation_year`, `status`, `join_date`, `created_at`, `updated_at`, `bio`, `skills`, `work_status`, `avatar`) VALUES
(1, 5, 'Mahbub', 'demoexample@gmail.com', '2008-06-04', '9863728379', '0897675456354', 'Ototronik', '2025', 'active', '2025-11-22', '2025-11-22 07:22:51', '2025-12-31 11:14:02', 'Saya Pelajar', '[\"Mesin\",\"Ahli Las\",\"ongkek\"]', 'siap_bekerja', 'http://localhost:8000/storage/avatars/avatar_1_1767198668.jpg'),
(4, 11, 'Hamid', 'menz@gmail.com', '2005-08-05', '987956745923', '87534872792', 'Rekayasa Perangkat Lunak', '2024', 'active', '2025-11-24', '2025-11-24 13:34:42', '2025-11-26 05:46:24', 'tes', '[\"react\"]', 'belum_siap', 'http://localhost:8000/storage/avatars/avatar_4_1764085337.jpg'),
(5, 41, 'Mat khamdi', 't2@gmail.com', NULL, 'P1767203477', '08735728639', 'DKV', '2026', 'active', '2025-12-31', '2025-12-31 10:51:17', '2025-12-31 10:53:02', 'pekerja', '[\"tidur\"]', 'mencari_peluang', 'https://avatar.vercel.sh/alumni');

-- --------------------------------------------------------

--
-- Table structure for table `application_documents`
--

CREATE TABLE `application_documents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `application_id` bigint(20) UNSIGNED NOT NULL,
  `document_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `application_documents`
--

INSERT INTO `application_documents` (`id`, `application_id`, `document_id`, `created_at`, `updated_at`) VALUES
(1, 2, 1, NULL, NULL),
(2, 3, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(191) NOT NULL,
  `file_name` varchar(191) NOT NULL,
  `file_path` varchar(191) NOT NULL,
  `file_type` varchar(191) NOT NULL,
  `file_size` bigint(20) NOT NULL,
  `mime_type` varchar(191) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `user_id`, `title`, `file_name`, `file_path`, `file_type`, `file_size`, `mime_type`, `created_at`, `updated_at`) VALUES
(1, 5, 'tes', 'CURRICULUM VITAE.pdf', 'documents/1764859777_5_CURRICULUM VITAE.pdf', 'cv', 390033, 'application/pdf', '2025-12-04 14:49:37', '2025-12-04 14:49:37');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES
(1, 'default', '{\"uuid\":\"08c8e4de-6455-40d3-86f6-25d1bdc10d21\",\"displayName\":\"App\\\\Events\\\\MessageSent\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:22:\\\"App\\\\Events\\\\MessageSent\\\":1:{s:7:\\\"message\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Message\\\";s:2:\\\"id\\\";i:113;s:9:\\\"relations\\\";a:2:{i:0;s:6:\\\"sender\\\";i:1;s:8:\\\"receiver\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767198563,\"delay\":null}', 0, NULL, 1767198563, 1767198563),
(2, 'default', '{\"uuid\":\"ba3ec1d0-50a2-4008-b1a1-84d6b13ad0fb\",\"displayName\":\"App\\\\Events\\\\ConversationUpdated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:30:\\\"App\\\\Events\\\\ConversationUpdated\\\":2:{s:6:\\\"userId\\\";i:2;s:12:\\\"conversation\\\";a:7:{s:7:\\\"user_id\\\";i:11;s:4:\\\"name\\\";s:5:\\\"Hamid\\\";s:5:\\\"email\\\";s:14:\\\"menz@gmail.com\\\";s:6:\\\"avatar\\\";N;s:12:\\\"last_message\\\";s:3:\\\"tes\\\";s:17:\\\"last_message_time\\\";s:25:\\\"2025-12-31T16:29:21+00:00\\\";s:12:\\\"unread_count\\\";i:0;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767198563,\"delay\":null}', 0, NULL, 1767198563, 1767198563),
(3, 'default', '{\"uuid\":\"11d6ad2b-032d-4e2c-b6d8-a81731351d59\",\"displayName\":\"App\\\\Events\\\\ConversationUpdated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:30:\\\"App\\\\Events\\\\ConversationUpdated\\\":2:{s:6:\\\"userId\\\";i:11;s:12:\\\"conversation\\\";a:7:{s:7:\\\"user_id\\\";i:2;s:4:\\\"name\\\";s:19:\\\"PT. Pondok Mojosari\\\";s:5:\\\"email\\\";s:20:\\\"mojosari@example.com\\\";s:6:\\\"avatar\\\";N;s:12:\\\"last_message\\\";s:3:\\\"tes\\\";s:17:\\\"last_message_time\\\";s:25:\\\"2025-12-31T16:29:21+00:00\\\";s:12:\\\"unread_count\\\";i:2;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767198563,\"delay\":null}', 0, NULL, 1767198563, 1767198563),
(4, 'default', '{\"uuid\":\"ec44fac0-c6b5-4f94-9c1c-bc37623572d4\",\"displayName\":\"App\\\\Events\\\\AlumniProfileUpdated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:31:\\\"App\\\\Events\\\\AlumniProfileUpdated\\\":1:{s:6:\\\"alumni\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"App\\\\Models\\\\Alumni\\\";s:2:\\\"id\\\";i:1;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767198658,\"delay\":null}', 0, NULL, 1767198658, 1767198658),
(5, 'default', '{\"uuid\":\"4a5091de-757e-42d1-b229-62c266f843ff\",\"displayName\":\"App\\\\Events\\\\GlobalRealtimeUpdate\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:31:\\\"App\\\\Events\\\\GlobalRealtimeUpdate\\\":3:{s:4:\\\"type\\\";s:7:\\\"alumnis\\\";s:6:\\\"action\\\";s:6:\\\"create\\\";s:4:\\\"data\\\";a:2:{s:2:\\\"id\\\";i:5;s:9:\\\"timestamp\\\";s:25:\\\"2025-12-31T17:51:17+00:00\\\";}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767203477,\"delay\":null}', 0, NULL, 1767203477, 1767203477),
(6, 'default', '{\"uuid\":\"348363d0-eae1-4993-880e-568ecb4bff34\",\"displayName\":\"App\\\\Events\\\\GlobalRealtimeUpdate\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:31:\\\"App\\\\Events\\\\GlobalRealtimeUpdate\\\":3:{s:4:\\\"type\\\";s:7:\\\"alumnis\\\";s:6:\\\"action\\\";s:6:\\\"update\\\";s:4:\\\"data\\\";a:2:{s:2:\\\"id\\\";i:5;s:9:\\\"timestamp\\\";s:25:\\\"2025-12-31T17:52:47+00:00\\\";}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767203567,\"delay\":null}', 0, NULL, 1767203567, 1767203567),
(7, 'default', '{\"uuid\":\"4f138b10-5a56-40e6-bc31-fa770d4be918\",\"displayName\":\"App\\\\Events\\\\AlumniProfileUpdated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:31:\\\"App\\\\Events\\\\AlumniProfileUpdated\\\":1:{s:6:\\\"alumni\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"App\\\\Models\\\\Alumni\\\";s:2:\\\"id\\\";i:5;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767203567,\"delay\":null}', 0, NULL, 1767203567, 1767203567),
(8, 'default', '{\"uuid\":\"f025b047-3e53-44c1-9908-6eef5d12ccef\",\"displayName\":\"App\\\\Events\\\\GlobalRealtimeUpdate\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:31:\\\"App\\\\Events\\\\GlobalRealtimeUpdate\\\":3:{s:4:\\\"type\\\";s:7:\\\"alumnis\\\";s:6:\\\"action\\\";s:6:\\\"update\\\";s:4:\\\"data\\\";a:2:{s:2:\\\"id\\\";i:5;s:9:\\\"timestamp\\\";s:25:\\\"2025-12-31T17:53:02+00:00\\\";}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767203582,\"delay\":null}', 0, NULL, 1767203582, 1767203582),
(9, 'default', '{\"uuid\":\"fbbda817-12d5-4a3a-8293-45fadd695fc2\",\"displayName\":\"App\\\\Events\\\\AlumniProfileUpdated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:31:\\\"App\\\\Events\\\\AlumniProfileUpdated\\\":1:{s:6:\\\"alumni\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"App\\\\Models\\\\Alumni\\\";s:2:\\\"id\\\";i:5;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767203582,\"delay\":null}', 0, NULL, 1767203582, 1767203582),
(10, 'default', '{\"uuid\":\"6c2179ba-9377-4607-bd2b-8a570e2d3740\",\"displayName\":\"App\\\\Events\\\\GlobalRealtimeUpdate\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:31:\\\"App\\\\Events\\\\GlobalRealtimeUpdate\\\":3:{s:4:\\\"type\\\";s:7:\\\"alumnis\\\";s:6:\\\"action\\\";s:6:\\\"update\\\";s:4:\\\"data\\\";a:2:{s:2:\\\"id\\\";i:1;s:9:\\\"timestamp\\\";s:25:\\\"2025-12-31T17:58:28+00:00\\\";}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767203909,\"delay\":null}', 0, NULL, 1767203909, 1767203909),
(11, 'default', '{\"uuid\":\"b971fed9-a209-4e6b-bf95-e47c57d98ff2\",\"displayName\":\"App\\\\Events\\\\AlumniProfileUpdated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:31:\\\"App\\\\Events\\\\AlumniProfileUpdated\\\":1:{s:6:\\\"alumni\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"App\\\\Models\\\\Alumni\\\";s:2:\\\"id\\\";i:1;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767203909,\"delay\":null}', 0, NULL, 1767203909, 1767203909),
(12, 'default', '{\"uuid\":\"ecb00511-70e6-4f39-b001-26378a88bb0e\",\"displayName\":\"App\\\\Events\\\\GlobalRealtimeUpdate\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:31:\\\"App\\\\Events\\\\GlobalRealtimeUpdate\\\":3:{s:4:\\\"type\\\";s:12:\\\"job_postings\\\";s:6:\\\"action\\\";s:6:\\\"create\\\";s:4:\\\"data\\\";a:2:{s:2:\\\"id\\\";i:5;s:9:\\\"timestamp\\\";s:25:\\\"2025-12-31T18:00:19+00:00\\\";}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767204019,\"delay\":null}', 0, NULL, 1767204019, 1767204019),
(13, 'default', '{\"uuid\":\"be97ee0e-b098-4a02-a51b-250eb11aae16\",\"displayName\":\"App\\\\Events\\\\JobPosted\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:20:\\\"App\\\\Events\\\\JobPosted\\\":1:{s:3:\\\"job\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:21:\\\"App\\\\Models\\\\JobPosting\\\";s:2:\\\"id\\\";i:5;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767204019,\"delay\":null}', 0, NULL, 1767204019, 1767204019),
(14, 'default', '{\"uuid\":\"0a5c61fd-b5c1-4f3f-b173-783bb6f001fa\",\"displayName\":\"App\\\\Events\\\\JobViewed\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:20:\\\"App\\\\Events\\\\JobViewed\\\":4:{s:5:\\\"jobId\\\";i:5;s:10:\\\"viewsCount\\\";i:0;s:9:\\\"companyId\\\";i:2;s:6:\\\"viewer\\\";a:2:{s:4:\\\"name\\\";s:5:\\\"hamid\\\";s:2:\\\"id\\\";i:5;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767204507,\"delay\":null}', 0, NULL, 1767204507, 1767204507),
(15, 'default', '{\"uuid\":\"0c532bcf-c4f9-49d0-9189-cbf2fb33cba0\",\"displayName\":\"App\\\\Events\\\\GlobalRealtimeUpdate\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:31:\\\"App\\\\Events\\\\GlobalRealtimeUpdate\\\":3:{s:4:\\\"type\\\";s:16:\\\"job_applications\\\";s:6:\\\"action\\\";s:6:\\\"create\\\";s:4:\\\"data\\\";a:2:{s:2:\\\"id\\\";i:3;s:9:\\\"timestamp\\\";s:25:\\\"2025-12-31T18:08:44+00:00\\\";}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767204524,\"delay\":null}', 0, NULL, 1767204524, 1767204524),
(16, 'default', '{\"uuid\":\"be0dc350-c681-48ee-adb3-b666f1aa6c05\",\"displayName\":\"App\\\\Events\\\\GlobalRealtimeUpdate\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:31:\\\"App\\\\Events\\\\GlobalRealtimeUpdate\\\":3:{s:4:\\\"type\\\";s:8:\\\"messages\\\";s:6:\\\"action\\\";s:6:\\\"create\\\";s:4:\\\"data\\\";a:2:{s:2:\\\"id\\\";i:114;s:9:\\\"timestamp\\\";s:25:\\\"2025-12-31T18:08:44+00:00\\\";}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767204524,\"delay\":null}', 0, NULL, 1767204524, 1767204524),
(17, 'default', '{\"uuid\":\"cb740bde-a732-4273-b9ab-3c3596e756bf\",\"displayName\":\"App\\\\Events\\\\JobApplicationSubmitted\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:34:\\\"App\\\\Events\\\\JobApplicationSubmitted\\\":1:{s:11:\\\"application\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:25:\\\"App\\\\Models\\\\JobApplication\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767204524,\"delay\":null}', 0, NULL, 1767204524, 1767204524),
(18, 'default', '{\"uuid\":\"b96c6629-57f5-47dd-8e22-20080621a2d9\",\"displayName\":\"App\\\\Events\\\\GlobalRealtimeUpdate\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:31:\\\"App\\\\Events\\\\GlobalRealtimeUpdate\\\":3:{s:4:\\\"type\\\";s:16:\\\"job_applications\\\";s:6:\\\"action\\\";s:6:\\\"update\\\";s:4:\\\"data\\\";a:2:{s:2:\\\"id\\\";i:3;s:9:\\\"timestamp\\\";s:25:\\\"2025-12-31T18:09:10+00:00\\\";}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767204550,\"delay\":null}', 0, NULL, 1767204550, 1767204550),
(19, 'default', '{\"uuid\":\"97bc8ee1-0e5f-4126-af78-a1f450c93cba\",\"displayName\":\"App\\\\Events\\\\JobApplicationStatusUpdated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:38:\\\"App\\\\Events\\\\JobApplicationStatusUpdated\\\":1:{s:11:\\\"application\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:25:\\\"App\\\\Models\\\\JobApplication\\\";s:2:\\\"id\\\";i:3;s:9:\\\"relations\\\";a:1:{i:0;s:10:\\\"jobPosting\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767204550,\"delay\":null}', 0, NULL, 1767204550, 1767204550),
(20, 'default', '{\"uuid\":\"4e1469a2-2319-42bb-bcff-291a56a5c2e1\",\"displayName\":\"App\\\\Events\\\\GlobalRealtimeUpdate\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:31:\\\"App\\\\Events\\\\GlobalRealtimeUpdate\\\":3:{s:4:\\\"type\\\";s:12:\\\"job_postings\\\";s:6:\\\"action\\\";s:6:\\\"delete\\\";s:4:\\\"data\\\";a:2:{s:2:\\\"id\\\";i:4;s:9:\\\"timestamp\\\";s:25:\\\"2025-12-31T18:12:20+00:00\\\";}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767204740,\"delay\":null}', 0, NULL, 1767204740, 1767204740),
(21, 'default', '{\"uuid\":\"926670be-50a4-40e3-b30c-dcc08d337137\",\"displayName\":\"App\\\\Events\\\\GlobalRealtimeUpdate\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:31:\\\"App\\\\Events\\\\GlobalRealtimeUpdate\\\":3:{s:4:\\\"type\\\";s:7:\\\"alumnis\\\";s:6:\\\"action\\\";s:6:\\\"update\\\";s:4:\\\"data\\\";a:2:{s:2:\\\"id\\\";i:1;s:9:\\\"timestamp\\\";s:25:\\\"2025-12-31T18:14:02+00:00\\\";}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767204842,\"delay\":null}', 0, NULL, 1767204842, 1767204842),
(22, 'default', '{\"uuid\":\"65c01d97-9db3-4fc7-b518-4c580beb05e1\",\"displayName\":\"App\\\\Events\\\\AlumniProfileUpdated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:31:\\\"App\\\\Events\\\\AlumniProfileUpdated\\\":1:{s:6:\\\"alumni\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:17:\\\"App\\\\Models\\\\Alumni\\\";s:2:\\\"id\\\";i:1;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767204842,\"delay\":null}', 0, NULL, 1767204842, 1767204842),
(23, 'default', '{\"uuid\":\"801a2fa9-e00f-4dfe-95ff-9870a2278266\",\"displayName\":\"App\\\\Events\\\\MessageSent\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:22:\\\"App\\\\Events\\\\MessageSent\\\":1:{s:7:\\\"message\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:18:\\\"App\\\\Models\\\\Message\\\";s:2:\\\"id\\\";i:115;s:9:\\\"relations\\\";a:2:{i:0;s:6:\\\"sender\\\";i:1;s:8:\\\"receiver\\\";}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767329844,\"delay\":null}', 0, NULL, 1767329844, 1767329844),
(24, 'default', '{\"uuid\":\"97c8402e-0df6-4ec3-9bbd-0818c2d39d74\",\"displayName\":\"App\\\\Events\\\\ConversationUpdated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:30:\\\"App\\\\Events\\\\ConversationUpdated\\\":2:{s:6:\\\"userId\\\";i:2;s:12:\\\"conversation\\\";a:8:{s:7:\\\"user_id\\\";i:5;s:4:\\\"name\\\";s:6:\\\"Mahbub\\\";s:5:\\\"email\\\";s:21:\\\"demoexample@gmail.com\\\";s:6:\\\"avatar\\\";N;s:12:\\\"last_seen_at\\\";s:25:\\\"2026-01-02T11:56:21+07:00\\\";s:12:\\\"last_message\\\";s:3:\\\"tes\\\";s:17:\\\"last_message_time\\\";s:25:\\\"2026-01-02T11:57:23+07:00\\\";s:12:\\\"unread_count\\\";i:0;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767329844,\"delay\":null}', 0, NULL, 1767329844, 1767329844),
(25, 'default', '{\"uuid\":\"49a8bac4-e8de-4f83-8ab1-55b75b6b71f9\",\"displayName\":\"App\\\\Events\\\\ConversationUpdated\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\",\"command\":\"O:38:\\\"Illuminate\\\\Broadcasting\\\\BroadcastEvent\\\":17:{s:5:\\\"event\\\";O:30:\\\"App\\\\Events\\\\ConversationUpdated\\\":2:{s:6:\\\"userId\\\";i:5;s:12:\\\"conversation\\\";a:8:{s:7:\\\"user_id\\\";i:2;s:4:\\\"name\\\";s:19:\\\"PT. Pondok Mojosari\\\";s:5:\\\"email\\\";s:20:\\\"mojosari@example.com\\\";s:6:\\\"avatar\\\";N;s:12:\\\"last_seen_at\\\";s:25:\\\"2026-01-02T11:57:23+07:00\\\";s:12:\\\"last_message\\\";s:3:\\\"tes\\\";s:17:\\\"last_message_time\\\";s:25:\\\"2026-01-02T11:57:23+07:00\\\";s:12:\\\"unread_count\\\";i:1;}}s:5:\\\"tries\\\";N;s:7:\\\"timeout\\\";N;s:7:\\\"backoff\\\";N;s:13:\\\"maxExceptions\\\";N;s:23:\\\"deleteWhenMissingModels\\\";b:1;s:10:\\\"connection\\\";N;s:5:\\\"queue\\\";N;s:12:\\\"messageGroup\\\";N;s:12:\\\"deduplicator\\\";N;s:5:\\\"delay\\\";N;s:11:\\\"afterCommit\\\";N;s:10:\\\"middleware\\\";a:0:{}s:7:\\\"chained\\\";a:0:{}s:15:\\\"chainConnection\\\";N;s:10:\\\"chainQueue\\\";N;s:19:\\\"chainCatchCallbacks\\\";N;}\"},\"createdAt\":1767329844,\"delay\":null}', 0, NULL, 1767329844, 1767329844);

-- --------------------------------------------------------

--
-- Table structure for table `job_applications`
--

CREATE TABLE `job_applications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `job_posting_id` bigint(20) UNSIGNED NOT NULL,
  `alumni_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `cover_letter` text NOT NULL,
  `status` enum('pending','viewed','accepted','rejected') NOT NULL DEFAULT 'pending',
  `reviewed_at` datetime DEFAULT NULL,
  `review_notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `job_applications`
--

INSERT INTO `job_applications` (`id`, `job_posting_id`, `alumni_id`, `user_id`, `cover_letter`, `status`, `reviewed_at`, `review_notes`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 5, 'nggolek kerjo', 'pending', NULL, NULL, '2025-11-26 17:21:06', '2025-11-26 17:21:06'),
(2, 3, 1, 5, 'tes', 'pending', NULL, NULL, '2025-12-11 01:22:23', '2025-12-11 01:22:23'),
(3, 5, 1, 5, 'tertarik', 'rejected', '2025-12-31 18:09:10', NULL, '2025-12-31 11:08:44', '2025-12-31 11:09:10');

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_postings`
--

CREATE TABLE `job_postings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `position` varchar(191) NOT NULL,
  `location` varchar(191) NOT NULL,
  `job_type` varchar(191) NOT NULL,
  `salary_range` varchar(191) DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `benefits` text DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  `status` enum('open','closed','draft') NOT NULL DEFAULT 'open',
  `views` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `job_postings`
--

INSERT INTO `job_postings` (`id`, `company_id`, `title`, `description`, `position`, `location`, `job_type`, `salary_range`, `requirements`, `benefits`, `deadline`, `status`, `views`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 2, 'Satpam', 'Lowongan untuk posisi Satpam di Mojosari', 'Satpam', 'Mojosari', 'full-time', '2 Juta', '[]', NULL, NULL, 'open', 0, '2025-11-26 16:41:20', '2025-12-11 01:38:31', '2025-12-11 01:38:31'),
(2, 25, 'Tukang Sapu', 'Lowongan untuk posisi Tukang Sapu di Nganjukk', 'Tukang Sapu', 'Nganjukk', 'part-time', '1 juta', '[]', NULL, NULL, 'open', 0, '2025-11-28 03:07:40', '2025-12-04 05:25:30', NULL),
(3, 2, 'Abdi Dalem', 'Lowongan untuk posisi Abdi Dalem di Mojosari', 'Abdi Dalem', 'Mojosari', 'part-time', '2 JUTA', '[]', NULL, NULL, 'open', 2, '2025-12-11 01:19:42', '2025-12-11 01:38:25', '2025-12-11 01:38:25'),
(4, 2, 'Ngarit', 'Lowongan untuk posisi Ngarit di Sawah', 'Ngarit', 'Sawah', 'part-time', '1 Juta', '[]', NULL, NULL, 'open', 2, '2025-12-11 01:43:19', '2025-12-31 11:12:20', '2025-12-31 11:12:20'),
(5, 2, 'Staff Lab', 'Lowongan untuk posisi Staff Lab di MTS NU MOJOSARI', 'Staff Lab', 'MTS NU MOJOSARI', 'full-time', '2 Juta/bulan', '[\"minimal S1\"]', NULL, NULL, 'open', 1, '2025-12-31 11:00:19', '2025-12-31 11:00:19', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `job_views`
--

CREATE TABLE `job_views` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `job_posting_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `viewed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `job_views`
--

INSERT INTO `job_views` (`id`, `job_posting_id`, `user_id`, `viewed_at`, `created_at`, `updated_at`) VALUES
(2, 5, 5, '2025-12-31 11:08:27', '2025-12-31 11:08:27', '2025-12-31 11:08:27');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sender_id` bigint(20) UNSIGNED NOT NULL,
  `receiver_id` bigint(20) UNSIGNED NOT NULL,
  `message` text NOT NULL,
  `status` enum('draft','sent','read') NOT NULL DEFAULT 'sent',
  `job_application_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `message`, `status`, `job_application_id`, `is_read`, `created_at`, `updated_at`) VALUES
(43, 11, 2, 'Saya ingin melamar untuk posisi Tukang sapu.\n\ntes', 'draft', NULL, 1, '2025-11-24 14:02:54', '2025-11-24 14:18:38'),
(45, 2, 11, 'okee besok datang ke kantor', 'sent', NULL, 1, '2025-11-24 14:18:52', '2025-11-24 14:20:47'),
(46, 2, 11, 'tes', 'sent', NULL, 0, '2025-11-26 08:43:18', '2025-11-26 08:43:18'),
(48, 2, 5, 'haloo', 'sent', NULL, 1, '2025-11-26 16:43:59', '2025-11-26 16:44:48'),
(49, 5, 2, 'piyee', 'sent', NULL, 1, '2025-11-26 16:45:00', '2025-11-26 16:45:02'),
(50, 5, 2, 'tes', 'sent', NULL, 1, '2025-11-26 17:19:22', '2025-11-27 04:46:05'),
(51, 5, 2, 'Saya ingin melamar untuk posisi Satpam.\n\nnggolek kerjo', 'draft', 1, 1, '2025-11-26 17:21:06', '2025-11-27 04:46:05'),
(52, 2, 5, 'santai', 'sent', NULL, 1, '2025-11-27 04:46:14', '2025-11-28 02:49:58'),
(53, 2, 5, 'pengen kerjo opo kon?', 'sent', NULL, 1, '2025-11-27 04:46:25', '2025-11-28 02:49:58'),
(54, 5, 2, 'hALOO', 'sent', NULL, 1, '2025-11-28 02:50:05', '2025-11-28 03:17:09'),
(55, 5, 2, 'tes', 'sent', NULL, 1, '2025-11-28 03:16:40', '2025-11-28 03:17:09'),
(56, 2, 5, 'yooo', 'sent', NULL, 1, '2025-11-28 03:17:14', '2025-11-29 04:08:34'),
(57, 2, 5, 'tes', 'sent', NULL, 1, '2025-11-28 03:59:59', '2025-11-29 04:08:34'),
(58, 2, 5, 'tes', 'sent', NULL, 1, '2025-11-28 04:31:12', '2025-11-29 04:08:34'),
(59, 5, 2, 'yoo', 'sent', NULL, 1, '2025-11-29 04:08:40', '2025-12-03 04:56:08'),
(60, 5, 2, 'pieee', 'sent', NULL, 1, '2025-12-03 04:39:43', '2025-12-03 04:56:08'),
(61, 2, 5, 'yoii', 'sent', NULL, 1, '2025-12-03 04:56:17', '2025-12-03 04:56:35'),
(62, 5, 2, 'okeee', 'sent', NULL, 1, '2025-12-03 04:56:52', '2025-12-03 04:57:27'),
(63, 2, 5, 'tes', 'sent', NULL, 1, '2025-12-03 04:57:33', '2025-12-03 04:58:15'),
(64, 5, 2, 'yooo', 'sent', NULL, 1, '2025-12-03 04:58:20', '2025-12-03 04:58:41'),
(65, 2, 5, 'tes', 'sent', NULL, 1, '2025-12-03 05:01:05', '2025-12-03 05:03:08'),
(66, 5, 2, 'tes', 'sent', NULL, 1, '2025-12-03 05:01:31', '2025-12-03 05:03:06'),
(67, 5, 2, 'tes', 'sent', NULL, 1, '2025-12-03 05:06:33', '2025-12-03 05:07:14'),
(68, 2, 5, 'hLO', 'sent', NULL, 1, '2025-12-03 05:06:42', '2025-12-03 05:07:03'),
(69, 2, 5, 'haiii', 'sent', NULL, 1, '2025-12-03 05:09:11', '2025-12-03 05:10:22'),
(70, 5, 2, 'tes', 'sent', NULL, 1, '2025-12-03 05:11:03', '2025-12-03 05:11:52'),
(71, 2, 5, 'tes', 'sent', NULL, 1, '2025-12-03 05:11:57', '2025-12-04 03:48:35'),
(72, 2, 5, '[', 'sent', NULL, 1, '2025-12-04 03:48:20', '2025-12-04 03:48:35'),
(73, 5, 2, 'y', 'sent', NULL, 1, '2025-12-04 03:48:40', '2025-12-04 03:52:43'),
(74, 2, 5, 'tes', 'sent', NULL, 1, '2025-12-04 03:52:49', '2025-12-04 03:55:34'),
(75, 2, 5, 'halooo', 'sent', NULL, 1, '2025-12-04 03:55:54', '2025-12-04 03:57:01'),
(76, 2, 5, 'tes', 'sent', NULL, 1, '2025-12-04 03:57:31', '2025-12-04 03:59:28'),
(77, 5, 2, 'tes', 'sent', NULL, 1, '2025-12-04 03:57:47', '2025-12-04 03:59:27'),
(78, 2, 5, 'halooo', 'sent', NULL, 1, '2025-12-04 04:00:02', '2025-12-04 04:00:04'),
(79, 5, 2, 'tesss', 'sent', NULL, 1, '2025-12-04 04:00:15', '2025-12-04 04:00:48'),
(80, 2, 5, 'halooo', 'sent', NULL, 1, '2025-12-04 04:00:45', '2025-12-04 04:02:00'),
(81, 5, 2, 'tes', 'sent', NULL, 1, '2025-12-04 04:02:06', '2025-12-04 04:02:33'),
(82, 5, 2, 'p', 'sent', NULL, 1, '2025-12-04 04:03:01', '2025-12-04 04:05:02'),
(83, 2, 5, 'tes', 'sent', NULL, 1, '2025-12-04 04:05:14', '2025-12-04 04:05:40'),
(84, 5, 2, 'tes', 'sent', NULL, 1, '2025-12-04 04:05:37', '2025-12-04 04:06:13'),
(85, 2, 5, 'tes', 'sent', NULL, 1, '2025-12-04 04:06:23', '2025-12-04 04:08:00'),
(86, 5, 2, 'halo', 'sent', NULL, 1, '2025-12-04 04:09:11', '2025-12-04 04:09:14'),
(87, 2, 5, 'tes', 'sent', NULL, 1, '2025-12-04 04:10:20', '2025-12-04 04:10:21'),
(88, 5, 2, 'tes', 'sent', NULL, 1, '2025-12-04 04:15:34', '2025-12-04 04:15:36'),
(89, 2, 5, 'y', 'sent', NULL, 1, '2025-12-04 04:17:36', '2025-12-04 04:17:40'),
(90, 5, 2, 'tesss', 'sent', NULL, 1, '2025-12-04 04:18:02', '2025-12-04 04:18:03'),
(91, 2, 5, 'yy', 'sent', NULL, 1, '2025-12-04 04:19:03', '2025-12-04 04:19:32'),
(92, 5, 2, 'tes', 'sent', NULL, 1, '2025-12-04 04:20:01', '2025-12-04 04:20:02'),
(93, 2, 5, 'tesss', 'sent', NULL, 1, '2025-12-04 04:22:35', '2025-12-04 04:22:37'),
(97, 2, 5, 'kalo', 'sent', NULL, 1, '2025-12-04 04:33:00', '2025-12-04 04:33:01'),
(98, 5, 2, 'oii', 'sent', NULL, 1, '2025-12-04 04:33:36', '2025-12-04 04:33:37'),
(99, 2, 5, 'yooo', 'sent', NULL, 1, '2025-12-04 04:38:12', '2025-12-04 04:38:19'),
(100, 5, 2, 'tess', 'sent', NULL, 1, '2025-12-04 04:38:36', '2025-12-04 04:38:37'),
(101, 2, 5, 'haiii', 'sent', NULL, 1, '2025-12-04 04:44:18', '2025-12-04 04:44:35'),
(102, 2, 5, 'haii', 'sent', NULL, 1, '2025-12-04 04:45:17', '2025-12-04 04:45:31'),
(103, 5, 2, 'piye', 'sent', NULL, 1, '2025-12-04 04:45:34', '2025-12-04 04:48:28'),
(104, 2, 5, 'yooo', 'sent', NULL, 1, '2025-12-04 04:48:39', '2025-12-04 04:49:05'),
(105, 5, 2, 'tes', 'sent', NULL, 1, '2025-12-04 04:49:20', '2025-12-04 04:53:25'),
(106, 5, 2, 'tess', 'sent', NULL, 1, '2025-12-04 04:53:01', '2025-12-04 04:53:25'),
(107, 2, 5, 'yy', 'sent', NULL, 1, '2025-12-04 04:54:47', '2025-12-04 04:54:54'),
(108, 5, 2, 'yyy', 'sent', NULL, 1, '2025-12-08 02:32:22', '2025-12-09 01:50:47'),
(109, 5, 2, 'tess', 'sent', NULL, 1, '2025-12-09 01:49:14', '2025-12-09 01:50:47'),
(110, 2, 5, 'yo', 'sent', NULL, 1, '2025-12-09 01:51:03', '2025-12-11 01:15:23'),
(111, 5, 2, 'yoo', 'sent', NULL, 1, '2025-12-11 01:15:41', '2025-12-11 01:25:26'),
(112, 5, 2, 'Saya ingin melamar untuk posisi Abdi Dalem.\n\ntes', 'draft', 2, 1, '2025-12-11 01:22:24', '2025-12-11 01:25:26'),
(113, 2, 11, 'tes', 'sent', NULL, 0, '2025-12-31 09:29:21', '2025-12-31 09:29:21'),
(114, 5, 2, 'Saya ingin melamar untuk posisi Staff Lab.\n\ntertarik', 'draft', 3, 1, '2025-12-31 11:08:44', '2026-01-01 21:48:42'),
(115, 2, 5, 'tes', 'sent', NULL, 1, '2026-01-02 04:57:23', '2026-01-02 05:01:33');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(191) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2025_11_21_034421_create_alumni_table', 1),
(6, '2025_11_21_040040_add_user_id_to_alumni_table', 1),
(7, '2025_11_21_040114_add_role_to_users_table', 1),
(8, '2025_11_21_070430_create_messages_table', 1),
(9, '2025_11_21_081224_add_indexes_to_messages_table', 1),
(10, '2025_11_21_134537_add_birth_date_and_nisn_to_alumni_table', 1),
(11, '2025_11_21_151301_add_profile_fields_to_alumni_table', 1),
(12, '2025_11_21_160000_create_documents_table', 1),
(13, '2025_11_21_170000_create_job_postings_table', 1),
(14, '2025_11_21_170100_create_job_applications_table', 1),
(15, '2025_11_21_170200_create_application_documents_table', 1),
(16, '2025_11_21_170300_add_status_and_application_to_messages_table', 1),
(17, '2025_11_26_091500_add_soft_deletes_to_job_postings_table', 2),
(18, '2025_11_26_000001_add_database_management_fields', 3),
(19, '2025_11_26_000002_create_test_tables_for_admin_database', 3),
(20, '2025_12_04_121716_add_views_to_job_postings_table', 4),
(21, '2025_12_04_122320_update_company_names_add_pt_prefix', 4),
(22, '2025_12_04_122409_fix_company_name_capitalization', 4),
(23, '2025_12_04_122621_fix_company_names_remove_incorrect_pt_prefix', 4),
(25, '2025_12_11_000001_create_job_views_table', 5),
(26, '0001_01_01_000000_create_users_table', 6),
(27, '0001_01_01_000001_create_cache_table', 6),
(28, '0001_01_01_000002_create_jobs_table', 6),
(29, '2025_12_29_161739_create_initial_tables_from_sql', 6),
(30, '2025_12_29_162333_create_personal_access_tokens_table', 6),
(31, '2025_12_30_105021_add_company_profile_fields_to_users_table', 6),
(32, '2025_12_30_130551_remove_user_id_fk_from_alumni_and_documents_tables', 6),
(33, '2025_12_30_160000_change_logo_column_type_in_users_table', 6),
(34, '2025_12_31_174256_create_profile_views_table', 7),
(35, '2026_01_02_044146_add_last_seen_at_to_users_table', 8);

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(191) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\User', 1, 'API Token', '9c03b7d18edef9a05d8efbea006d62aebbe7bb1bd4c96500828f492178977a06', '[\"*\"]', NULL, NULL, '2025-11-22 06:02:22', '2025-11-22 06:02:22'),
(2, 'App\\User', 2, 'API Token', '5aa7386087b7755952bd253f02247a376e11db4112d849d0ba0add9112b98db0', '[\"*\"]', '2025-11-22 06:14:48', NULL, '2025-11-22 06:04:57', '2025-11-22 06:14:48'),
(3, 'App\\User', 4, 'API Token', '6a3c9d331ea572487c1278fce2c384a5cc899f6977bb2564a12a01e3a40e25af', '[\"*\"]', NULL, NULL, '2025-11-22 06:18:56', '2025-11-22 06:18:56'),
(4, 'App\\User', 2, 'API Token', '4825e487ff21e37c998270283e5f6705b21d8f0cb740802cfacdbb49a5621f3f', '[\"*\"]', '2025-11-22 09:26:15', NULL, '2025-11-22 06:33:12', '2025-11-22 09:26:15'),
(5, 'App\\User', 2, 'API Token', 'b343ff6410b466808348f80737ddd8513a95f5e1a0271b4b6260fdc2b4df34f2', '[\"*\"]', '2025-11-22 07:19:47', NULL, '2025-11-22 07:19:43', '2025-11-22 07:19:47'),
(6, 'App\\User', 4, 'API Token', '04e6ff695ae932a8bab32306354ce8a781e1897bbbb1780d9909ac86a00da71e', '[\"*\"]', '2025-11-22 07:22:50', NULL, '2025-11-22 07:21:48', '2025-11-22 07:22:50'),
(7, 'App\\User', 5, 'API Token', '38fcc8eab7e82bc03ff156e5f4851cc6dddeac873430db85b2c63f8a16fc9c86', '[\"*\"]', NULL, NULL, '2025-11-22 07:24:47', '2025-11-22 07:24:47'),
(8, 'App\\User', 2, 'API Token', 'fd0ce609859ddaed2e30c22468bed3da4d4e351a77063cd96e2040f454ebee31', '[\"*\"]', '2025-11-22 07:26:23', NULL, '2025-11-22 07:26:20', '2025-11-22 07:26:23'),
(9, 'App\\User', 2, 'API Token', 'ce44571364608b8a3c47a5f18b1a4f33394958d7fc08fa5acb6a91059fd9a542', '[\"*\"]', '2025-11-22 09:32:02', NULL, '2025-11-22 09:26:34', '2025-11-22 09:32:02'),
(10, 'App\\User', 4, 'API Token', '48a44caff76e26f319515dbfffaeb33030c840e6ba970218d77bd6021efd0300', '[\"*\"]', NULL, NULL, '2025-11-22 09:32:39', '2025-11-22 09:32:39'),
(11, 'App\\User', 5, 'API Token', 'a827bc40066a7aeef5921b44f6a4341a81bbd62e6c3d107407bdb24dd949bfce', '[\"*\"]', '2025-11-22 09:33:40', NULL, '2025-11-22 09:33:04', '2025-11-22 09:33:40'),
(12, 'App\\User', 2, 'API Token', '0bf80db8da96dafcfc6eee15f94c5dc16e78d0f3bfaeadea39e9745ba6022ef1', '[\"*\"]', '2025-11-22 09:35:39', NULL, '2025-11-22 09:34:00', '2025-11-22 09:35:39'),
(13, 'App\\User', 2, 'API Token', '85d18fa21b2c813e34b09eb22e6a3927abebfe88c7a02277f91d079f4e97246f', '[\"*\"]', '2025-11-23 08:53:25', NULL, '2025-11-23 08:53:06', '2025-11-23 08:53:25'),
(14, 'App\\User', 5, 'API Token', '48024877b4ff30d997bc31e5c2f4e6cb03b46f48829a52e4f0a48a91ac681fc8', '[\"*\"]', '2025-11-23 09:00:05', NULL, '2025-11-23 08:53:58', '2025-11-23 09:00:05'),
(15, 'App\\User', 2, 'API Token', 'e39dd2cd02990738e50060474d17ed32e45191ebb9d163b96413579eec2214d4', '[\"*\"]', '2025-11-23 09:05:52', NULL, '2025-11-23 09:00:14', '2025-11-23 09:05:52'),
(16, 'App\\User', 5, 'API Token', 'daa2abe6e8e1be28464679f12ea364f019d39acab3e0ea62ef5c7c5cb4f08aad', '[\"*\"]', '2025-11-23 09:06:47', NULL, '2025-11-23 09:06:00', '2025-11-23 09:06:47'),
(17, 'App\\User', 2, 'API Token', '8cb9e99f369bf860c80d0f8f5a9efeb0f77e2622816b40ae9175ef41e2d52512', '[\"*\"]', '2025-11-23 09:10:57', NULL, '2025-11-23 09:06:57', '2025-11-23 09:10:57'),
(18, 'App\\User', 5, 'API Token', '99e95fe18bef1491637746a7ab553c3c150665400de3a49e33bba631728e186e', '[\"*\"]', '2025-11-23 09:12:51', NULL, '2025-11-23 09:11:04', '2025-11-23 09:12:51'),
(19, 'App\\User', 2, 'API Token', '44c0e221a3b6d1676c0d63a925147cb828da4c5ee5561ac916bae1525344517d', '[\"*\"]', '2025-11-23 09:48:16', NULL, '2025-11-23 09:16:52', '2025-11-23 09:48:16'),
(20, 'App\\User', 5, 'API Token', 'd9bb787fdc516c385795efab50f4ab06de14df15b9c03590eb2067e07e7ad378', '[\"*\"]', '2025-11-23 09:47:38', NULL, '2025-11-23 09:17:00', '2025-11-23 09:47:38'),
(21, 'App\\User', 5, 'API Token', 'b54aa53b37eed30c6442ff7d888072e8be26e75c7910f3cd86d7345dd680a684', '[\"*\"]', '2025-11-23 09:50:43', NULL, '2025-11-23 09:48:34', '2025-11-23 09:50:43'),
(22, 'App\\User', 2, 'API Token', 'f286dfd269b7e3a8352e352548192d9e2a921a068f336fb85e693f7e76d9dac5', '[\"*\"]', '2025-11-23 10:46:17', NULL, '2025-11-23 10:46:10', '2025-11-23 10:46:17'),
(23, 'App\\User', 5, 'API Token', '99922ff2e810f0b2716a2f2153bb13a5c59c047feb1e07dee9911aaeac0b89c2', '[\"*\"]', NULL, NULL, '2025-11-23 10:46:17', '2025-11-23 10:46:17'),
(24, 'App\\User', 2, 'API Token', '81e3bef8f9ff2deaf9d5733c6bab590c050d527168120706bac9fa276c38b39c', '[\"*\"]', '2025-11-23 10:57:12', NULL, '2025-11-23 10:49:42', '2025-11-23 10:57:12'),
(25, 'App\\User', 5, 'API Token', '4162007bbad74c6d679ba320031a9424146ef539a52aad8cb21c363361b9542b', '[\"*\"]', '2025-11-23 11:16:51', NULL, '2025-11-23 10:57:51', '2025-11-23 11:16:51'),
(26, 'App\\User', 2, 'API Token', '4fab59202ecbcf17ecaf5998191444b4341219cfd31ecb12e5733850e3f46b66', '[\"*\"]', '2025-11-23 11:04:56', NULL, '2025-11-23 10:58:07', '2025-11-23 11:04:56'),
(27, 'App\\User', 4, 'API Token', '3cd1c914c21233a84a15824c3d214d76f3a0e427bc38883a4a7194836734eef6', '[\"*\"]', NULL, NULL, '2025-11-23 11:07:14', '2025-11-23 11:07:14'),
(28, 'App\\User', 5, 'API Token', '12a97ae529c9d41afebe5a5da8e80cf59986f297c374c549dc4fd95e8779b158', '[\"*\"]', '2025-11-24 08:09:31', NULL, '2025-11-24 08:08:06', '2025-11-24 08:09:31'),
(29, 'App\\User', 2, 'API Token', '70f74536aa934b864776bb82595a58bdffaf787f477bbc411c6d9b2e689a2f77', '[\"*\"]', '2025-11-24 08:50:56', NULL, '2025-11-24 08:08:19', '2025-11-24 08:50:56'),
(30, 'App\\User', 6, 'API Token', '35461f1ac0f21f8e60f7550aaa3d65ce7fd530e927aad44791099363009e5ce6', '[\"*\"]', '2025-11-24 08:14:05', NULL, '2025-11-24 08:13:01', '2025-11-24 08:14:05'),
(31, 'App\\User', 5, 'API Token', 'ac3aec2a7a564f59e3e3901e99db505e64cb23a693358e5942d793ea67037d91', '[\"*\"]', '2025-11-24 08:36:56', NULL, '2025-11-24 08:33:14', '2025-11-24 08:36:56'),
(32, 'App\\User', 4, 'API Token', '31cfedef3a42351e1d97f88e6c6440b1b74d71ec5526c0100fb0fa7bc63550f5', '[\"*\"]', NULL, NULL, '2025-11-24 08:37:18', '2025-11-24 08:37:18'),
(33, 'App\\User', 6, 'API Token', '33dd200a987764551d7671766a596b8597a111581720900c69d79cecead945d1', '[\"*\"]', '2025-11-24 08:45:05', NULL, '2025-11-24 08:44:12', '2025-11-24 08:45:05'),
(34, 'App\\User', 5, 'API Token', '46d16fbe7782dae4a31e117f1bf1d024d48f0cd6e4563fffbed3da73bb707aef', '[\"*\"]', '2025-11-24 08:45:43', NULL, '2025-11-24 08:45:27', '2025-11-24 08:45:43'),
(35, 'App\\User', 4, 'API Token', 'bde7e593709a5f3fb2b0e0eb14aa696a06cfd62278ff8c3d0dc8fcfe875a144c', '[\"*\"]', NULL, NULL, '2025-11-24 08:46:00', '2025-11-24 08:46:00'),
(36, 'App\\User', 5, 'API Token', '2f6614cb4d8413add6767df9f1850832adb27bf7f525d026b81a22c8facb7043', '[\"*\"]', '2025-11-24 08:47:00', NULL, '2025-11-24 08:46:34', '2025-11-24 08:47:00'),
(37, 'App\\User', 6, 'API Token', 'b64dd517927c967f08116345bfb15146079f928878cb10d9e324ac13cfc31c92', '[\"*\"]', '2025-11-24 08:50:37', NULL, '2025-11-24 08:47:23', '2025-11-24 08:50:37'),
(38, 'App\\User', 6, 'API Token', '7f50e262d6db4acca62e3f261f18052264da4922c5508fcb1d943d65fc9aa64d', '[\"*\"]', '2025-11-24 08:51:31', NULL, '2025-11-24 08:51:27', '2025-11-24 08:51:31'),
(39, 'App\\User', 5, 'API Token', '67ec9d224f4e4156ac57bb5e12b19ec5aa4f046812c09a6148558de446d56c21', '[\"*\"]', '2025-11-24 08:52:02', NULL, '2025-11-24 08:52:01', '2025-11-24 08:52:02'),
(40, 'App\\User', 5, 'API Token', '92e087e5ff467114c664acb6aefba19162165887c3ca1b9fea8aa5e5e35697da', '[\"*\"]', '2025-11-24 08:55:08', NULL, '2025-11-24 08:55:06', '2025-11-24 08:55:08'),
(41, 'App\\User', 4, 'API Token', '413888c4470236f15cb9b608a04b760d873a5996a697e0d8ec6d825a08df5940', '[\"*\"]', NULL, NULL, '2025-11-24 08:55:33', '2025-11-24 08:55:33'),
(42, 'App\\User', 5, 'API Token', '3f79989b4d37489018953d2ba1aeedace4524779dc79f2228083b3b6deb46a4b', '[\"*\"]', '2025-11-24 08:59:18', NULL, '2025-11-24 08:59:17', '2025-11-24 08:59:18'),
(43, 'App\\User', 4, 'API Token', '70973fe262b89ae7564643efaf973f11407fc94219213c9f58b010993982223e', '[\"*\"]', NULL, NULL, '2025-11-24 08:59:51', '2025-11-24 08:59:51'),
(44, 'App\\User', 4, 'API Token', 'a673e9e91b6ba48337abcd53f37befc28dd3a9810a0c8fdca4cc8e24e5a65a5e', '[\"*\"]', '2025-11-24 13:34:41', NULL, '2025-11-24 09:03:50', '2025-11-24 13:34:41'),
(45, 'App\\User', 5, 'API Token', '498fd0637ec0b0def2cc4f67f76c309fb40e5413ed227d69f11f107028d53245', '[\"*\"]', '2025-11-24 13:46:18', NULL, '2025-11-24 13:45:53', '2025-11-24 13:46:18'),
(46, 'App\\User', 4, 'API Token', '5514a33666737ff4eca2f5e8c8a782515cb5268199747cdcd58c0e8708e6f167', '[\"*\"]', '2025-11-24 13:50:58', NULL, '2025-11-24 13:49:19', '2025-11-24 13:50:58'),
(47, 'App\\User', 4, 'API Token', '6fa4630326dc960777eee2990d9faf77f33aa1d842fbab211492660391505729', '[\"*\"]', NULL, NULL, '2025-11-24 14:01:23', '2025-11-24 14:01:23'),
(48, 'App\\User', 11, 'API Token', 'cdefd6272ae7f45a0740db1d927040d70d2cebc238f0ebe3b1b70d7493d64493', '[\"*\"]', '2025-11-24 14:12:14', NULL, '2025-11-24 14:02:22', '2025-11-24 14:12:14'),
(49, 'App\\User', 2, 'API Token', '82f08708f64c97d5844e3160062e9a068cd25fed693cea2f0cdcccff9ff8f443', '[\"*\"]', '2025-11-24 14:19:56', NULL, '2025-11-24 14:12:32', '2025-11-24 14:19:56'),
(50, 'App\\User', 11, 'API Token', '8368fba1bc5382e9a5e8058dd132cee250a3e2c8fbf1a87d719d3d357eccd4a2', '[\"*\"]', '2025-11-24 14:21:02', NULL, '2025-11-24 14:19:54', '2025-11-24 14:21:02'),
(51, 'App\\User', 6, 'API Token', '52099a558eb15acd6e00994ae58ba9150a2759ad2a9934e9f7642ef0968081f5', '[\"*\"]', '2025-11-24 14:28:39', NULL, '2025-11-24 14:21:37', '2025-11-24 14:28:39'),
(52, 'App\\User', 11, 'API Token', 'd01172a28c24b42499fa4c852a481b6e4206f0c30fb0d72f351f8239f3e54070', '[\"*\"]', '2025-11-24 14:28:26', NULL, '2025-11-24 14:22:03', '2025-11-24 14:28:26'),
(53, 'App\\User', 6, 'API Token', '548a732596fa774e5549da926554eba13daa329610daf4d955140c14283ad6d8', '[\"*\"]', '2025-11-25 17:15:40', NULL, '2025-11-24 14:29:43', '2025-11-25 17:15:40'),
(54, 'App\\User', 11, 'API Token', '5f529e2937e891ed9136903150223538b0a395be9079026beeadf16b62812d6e', '[\"*\"]', '2025-11-24 14:41:15', NULL, '2025-11-24 14:30:17', '2025-11-24 14:41:15'),
(55, 'App\\User', 4, 'API Token', '72432df2c4f3b557587fa71d5cbf17aec2cb41ac6c3d81966e4ea649c30d8e2e', '[\"*\"]', NULL, NULL, '2025-11-24 14:41:49', '2025-11-24 14:41:49'),
(56, 'App\\User', 11, 'API Token', '6d1f984bdb97e7798dc3ee688186190e11499161ef5addefe279be0147fe9eba', '[\"*\"]', '2025-11-24 15:12:00', NULL, '2025-11-24 14:46:41', '2025-11-24 15:12:00'),
(57, 'App\\User', 5, 'API Token', 'f0be63fe9c848e2f59418a2e4265fcc2e4708209c07059c427b6366b1ceced7d', '[\"*\"]', '2025-11-25 15:39:52', NULL, '2025-11-25 15:39:20', '2025-11-25 15:39:52'),
(58, 'App\\User', 6, 'API Token', '41c95e9b52c034b1ff28653e25ffedc0ca0fb0c21d3d3b5c8791b83b55e1b577', '[\"*\"]', '2025-11-25 15:40:10', NULL, '2025-11-25 15:40:06', '2025-11-25 15:40:10'),
(59, 'App\\User', 11, 'API Token', '763f0f0de518774d55ce4b3d5401a287716b327641e5255a54290378248de615', '[\"*\"]', '2025-11-25 15:43:18', NULL, '2025-11-25 15:41:19', '2025-11-25 15:43:18'),
(60, 'App\\User', 2, 'API Token', '6e66ddc0a1f77e45c424871e9f81760be3d7fbff528ce3552404e6a411fda543', '[\"*\"]', '2025-11-25 15:59:16', NULL, '2025-11-25 15:43:32', '2025-11-25 15:59:16'),
(61, 'App\\User', 5, 'API Token', '5f22c27a0a2e6b417967a499155cfb9cccfee8f266b7c7440101411b458a10f3', '[\"*\"]', '2025-11-25 16:54:17', NULL, '2025-11-25 16:51:22', '2025-11-25 16:54:17'),
(62, 'App\\User', 6, 'API Token', '141a8d044a4f5dd91cc05698e24de46e31d77b744c3b0b4410ec12746f989ac0', '[\"*\"]', '2025-11-25 16:54:15', NULL, '2025-11-25 16:52:09', '2025-11-25 16:54:15'),
(63, 'App\\User', 5, 'API Token', '11222256c3b3970cadbb1e8b06ff8456d525331ce510c2687ac66cbfc330ecbc', '[\"*\"]', '2025-11-25 17:15:36', NULL, '2025-11-25 16:54:37', '2025-11-25 17:15:36'),
(64, 'App\\User', 5, 'API Token', 'eced0417e522e7ddacd0bfa44b0fcc4d804dc891d8ad6e98aafe5a9af35f1620', '[\"*\"]', '2025-11-25 17:34:57', NULL, '2025-11-25 17:15:54', '2025-11-25 17:34:57'),
(65, 'App\\User', 6, 'API Token', '9e91c5b3ab153cf43b5bb3f0e49408333bfc7105ca38f85d46c3466dd8bc2022', '[\"*\"]', '2025-11-25 17:35:19', NULL, '2025-11-25 17:16:12', '2025-11-25 17:35:19'),
(66, 'App\\User', 5, 'API Token', 'bbee3ebd548a2422c2c5bf084613e93648f36b8b26e5502c6da24f0dee591dab', '[\"*\"]', '2025-11-25 17:38:31', NULL, '2025-11-25 17:37:19', '2025-11-25 17:38:31'),
(67, 'App\\User', 5, 'API Token', 'c9c19abb66cb95bc01a9aaf966d057179dc7c69af21b93fcd63926fa2f051232', '[\"*\"]', '2025-11-25 17:43:22', NULL, '2025-11-25 17:38:47', '2025-11-25 17:43:22'),
(68, 'App\\User', 6, 'API Token', '5b9ea63289384a5382c2a2253e8540b071759406d91edb6a0c1ffbec482f1fe1', '[\"*\"]', '2025-11-25 17:46:20', NULL, '2025-11-25 17:43:44', '2025-11-25 17:46:20'),
(69, 'App\\User', 4, 'API Token', 'a0710fe954614683e842f6178b04062ae7433090556d28e589d1131ab55987a1', '[\"*\"]', NULL, NULL, '2025-11-25 17:46:43', '2025-11-25 17:46:43'),
(70, 'App\\User', 5, 'API Token', '7de10662b434cc5e8f679fd3545a066f3c5e7b06766c53b102c3fd659a8d5fc3', '[\"*\"]', '2025-11-25 17:52:52', NULL, '2025-11-25 17:49:55', '2025-11-25 17:52:52'),
(71, 'App\\User', 2, 'API Token', '9771ed8ed12d6ce236d8337a1a26bdc3d6c9b59f022126b20032d5a424e6d067', '[\"*\"]', '2025-11-25 17:57:55', NULL, '2025-11-25 17:53:12', '2025-11-25 17:57:55'),
(72, 'App\\User', 5, 'API Token', 'b35db40e801a42eaa5ad4fdbece0ea7134bde79981f9199bed754def94907cca', '[\"*\"]', '2025-11-26 02:25:09', NULL, '2025-11-26 02:05:14', '2025-11-26 02:25:09'),
(73, 'App\\User', 11, 'API Token', 'afc42056921e4fd9ab533b90fa276f0e746c1b45cf28b72a359bda2377dd2c95', '[\"*\"]', '2025-11-26 02:32:02', NULL, '2025-11-26 02:27:06', '2025-11-26 02:32:02'),
(74, 'App\\User', 6, 'API Token', 'b8210a4bddb1b8185a73a026991f941a631adae54cd3df200c6ea2b5d7c06cc3', '[\"*\"]', '2025-11-26 02:34:46', NULL, '2025-11-26 02:32:13', '2025-11-26 02:34:46'),
(75, 'App\\User', 11, 'API Token', 'a9e596ac01b8ed8d5a7505b8bd51308f4972608005c4ba0045220468f9256479', '[\"*\"]', '2025-11-26 03:44:54', NULL, '2025-11-26 02:35:16', '2025-11-26 03:44:54'),
(76, 'App\\User', 4, 'API Token', '63c6310aa7e6696f98fdb896be079221b48c8066e036753ba2d8ae6dc1f5f3c7', '[\"*\"]', NULL, NULL, '2025-11-26 03:45:05', '2025-11-26 03:45:05'),
(77, 'App\\User', 11, 'API Token', 'f4c859a9f0502ef2f08d11d164afc29196b70b573d3c9ca2809419d56c455c0f', '[\"*\"]', '2025-11-26 03:46:44', NULL, '2025-11-26 03:46:01', '2025-11-26 03:46:44'),
(78, 'App\\User', 4, 'API Token', '84ac137a3d77a61853e7c22334646226206ca6bdfbbfda572a7bf658ac368bc3', '[\"*\"]', '2025-11-26 03:47:08', NULL, '2025-11-26 03:46:43', '2025-11-26 03:47:08'),
(79, 'App\\User', 6, 'API Token', '798fcf5fa4fbc45040989b7cf3297fc00043f414a90f878d9c9bdfb70e082caf', '[\"*\"]', '2025-11-26 03:48:42', NULL, '2025-11-26 03:47:22', '2025-11-26 03:48:42'),
(80, 'App\\User', 6, 'API Token', 'a9a9b598fbc9ae2fad968c5e4e8119fe307f6910afb58cc2c03b84ae04567c9d', '[\"*\"]', '2025-11-26 03:50:52', NULL, '2025-11-26 03:49:11', '2025-11-26 03:50:52'),
(81, 'App\\User', 5, 'API Token', '21b69f790dbb59f8a91cc3e52a2e430544e169f6fb5944a59c58021e31d94ed6', '[\"*\"]', '2025-11-26 03:52:39', NULL, '2025-11-26 03:51:06', '2025-11-26 03:52:39'),
(82, 'App\\User', 6, 'API Token', 'ba2634b756c508a417c127f4847ba1c71c614f2e0edbd66aa3e1b6cbb07b6a34', '[\"*\"]', '2025-11-26 03:53:42', NULL, '2025-11-26 03:53:00', '2025-11-26 03:53:42'),
(83, 'App\\User', 11, 'API Token', '01df1725f09ab77711ef7d817e42419a2aba24918372ebe4a8ffb7c97ca5a7ae', '[\"*\"]', '2025-11-26 03:55:51', NULL, '2025-11-26 03:55:15', '2025-11-26 03:55:51'),
(84, 'App\\User', 4, 'API Token', '0965615c1cbf50c08290f62ce1ba87dee543405a7878559542f8ffdd4df05f00', '[\"*\"]', NULL, NULL, '2025-11-26 05:25:21', '2025-11-26 05:25:21'),
(85, 'App\\User', 4, 'API Token', '9ec5834a06404f18ec3430d66180b87921f6fbd1af87a8312dbb2a56bc91e882', '[\"*\"]', NULL, NULL, '2025-11-26 05:35:59', '2025-11-26 05:35:59'),
(86, 'App\\User', 11, 'API Token', '95d3744d65e508636aa20fa2b2809d412339121ee938341e4bcb4b6ad26d8aca', '[\"*\"]', '2025-11-26 05:46:57', NULL, '2025-11-26 05:45:25', '2025-11-26 05:46:57'),
(87, 'App\\User', 6, 'API Token', 'b722bd57787cd310be1cea047222b7fdd95048fac5a4646adfb79f71994f73be', '[\"*\"]', '2025-11-26 05:53:23', NULL, '2025-11-26 05:47:40', '2025-11-26 05:53:23'),
(88, 'App\\User', 11, 'API Token', 'b4e8bf71f6293c91f58034464c926250097d59a5980cc4ebec0957f17b8a2180', '[\"*\"]', '2025-11-26 05:54:41', NULL, '2025-11-26 05:54:00', '2025-11-26 05:54:41'),
(89, 'App\\User', 4, 'API Token', 'c88dadb14caaa32ebbc0b5fbc4c704058c9c3b2c8b4ef0908c84430920a1cf22', '[\"*\"]', '2025-11-26 06:04:54', NULL, '2025-11-26 05:54:53', '2025-11-26 06:04:54'),
(90, 'App\\User', 16, 'API Token', '9e89289afab401f7de41ea26f31cc831420cdb54e5989f9fde9c4ba872f5c8fb', '[\"*\"]', NULL, NULL, '2025-11-26 06:09:36', '2025-11-26 06:09:36'),
(91, 'App\\User', 17, 'API Token', 'a01a6363e76643f5f96a22cfb6106f9e527a56fb493a853ffa9a8a6837170153', '[\"*\"]', NULL, NULL, '2025-11-26 06:56:58', '2025-11-26 06:56:58'),
(92, 'App\\User', 17, 'API Token', '140a7806df7c2d1b48c261c1080d8074b99b02548ec0db98e4e0829ad1b46043', '[\"*\"]', NULL, NULL, '2025-11-26 07:01:05', '2025-11-26 07:01:05'),
(93, 'App\\User', 18, 'API Token', 'c322426c02a17f2708a6c1e35042344f023847776d895b660ce69805da489bb4', '[\"*\"]', NULL, NULL, '2025-11-26 07:02:48', '2025-11-26 07:02:48'),
(94, 'App\\User', 22, 'API Token', '2bbe27f51f56e31b522a539e01c23b44beaadbfb149b69b22b28a42570077b0e', '[\"*\"]', NULL, NULL, '2025-11-26 07:21:35', '2025-11-26 07:21:35'),
(95, 'App\\User', 23, 'API Token', '5739a2e3f5d19c139cd644d05995e40d887e97cdcb58fdc60cb14f528c152fe2', '[\"*\"]', NULL, NULL, '2025-11-26 07:23:53', '2025-11-26 07:23:53'),
(96, 'App\\User', 23, 'API Token', '023e4168180b4a8d440fef31dbc2045f5a82e4b5b17f1898fc0fc967e976de1d', '[\"*\"]', NULL, NULL, '2025-11-26 07:25:40', '2025-11-26 07:25:40'),
(97, 'App\\User', 23, 'API Token', 'edec155b0f8878c20b298e26cd47182e299486bd14affebbcb8ae0f7f040f4e4', '[\"*\"]', '2025-11-26 07:29:06', NULL, '2025-11-26 07:27:51', '2025-11-26 07:29:06'),
(98, 'App\\User', 24, 'API Token', '1517c3429da8edbc8253f99f8c187c1d3f8def85d8a0e99d2db2b71a9a84b7cc', '[\"*\"]', '2025-11-26 08:10:05', NULL, '2025-11-26 07:53:45', '2025-11-26 08:10:05'),
(99, 'App\\User', 24, 'API Token', '8829d914a0c0095ec7bf35695d0a5f5affc06a3efd7fdc07f7337d35c82f86dc', '[\"*\"]', NULL, NULL, '2025-11-26 07:54:39', '2025-11-26 07:54:39'),
(100, 'App\\User', 5, 'API Token', 'e65a738c3171e24b574deab3918524bd16e2b2d6200e86e7beebe9bd8a6c7e55', '[\"*\"]', '2025-11-26 08:22:45', NULL, '2025-11-26 08:22:42', '2025-11-26 08:22:45'),
(101, 'App\\User', 2, 'API Token', '0894524c3ced6799bee27d9663147d8c0e09fef6ec884beaad4d85087b966c6c', '[\"*\"]', '2025-11-26 08:34:05', NULL, '2025-11-26 08:22:54', '2025-11-26 08:34:05'),
(102, 'App\\User', 2, 'API Token', 'f0cf2dc7f6b6eb1b8efa3a04f3ae0408249b8449b8f9924514e8e13e75002576', '[\"*\"]', '2025-11-26 08:46:27', NULL, '2025-11-26 08:34:22', '2025-11-26 08:46:27'),
(103, 'App\\User', 4, 'API Token', 'c99dc1decb5745ef15d350dadd406059a3d465d95637f8ce90414caca2f95084', '[\"*\"]', '2025-11-26 08:46:42', NULL, '2025-11-26 08:46:41', '2025-11-26 08:46:42'),
(104, 'App\\User', 24, 'API Token', 'c89ce9ee9bb55c0792b2c13b032d77c100fa1d567928ac90a101369d89d13080', '[\"*\"]', '2025-11-26 08:49:47', NULL, '2025-11-26 08:47:50', '2025-11-26 08:49:47'),
(105, 'App\\User', 22, 'API Token', '1244999b19613d47af6ff0b701b0c0e8bdea68c64519a4c6c579cd873afbcba0', '[\"*\"]', '2025-11-26 09:06:47', NULL, '2025-11-26 09:02:10', '2025-11-26 09:06:47'),
(106, 'App\\User', 2, 'API Token', 'de46bad8ce9bc05d881d0e84a8d7c70a9bf67abc03d8c539783f78608c620b0d', '[\"*\"]', '2025-11-26 09:08:03', NULL, '2025-11-26 09:07:59', '2025-11-26 09:08:03'),
(107, 'App\\User', 4, 'API Token', '5b4e6c971b04f1ccaa117b033143d6d4e7ec40d85c88323e1063edeb7405b80c', '[\"*\"]', '2025-11-26 09:13:26', NULL, '2025-11-26 09:08:43', '2025-11-26 09:13:26'),
(108, 'App\\User', 22, 'API Token', '174a3e071a464fccfba0d7a30e6cb6abb40975702ef61949fdbb3a144c2789e4', '[\"*\"]', '2025-11-26 14:47:29', NULL, '2025-11-26 09:14:01', '2025-11-26 14:47:29'),
(109, 'App\\User', 4, 'API Token', 'b22f3e5c3e38c7002a0d0d2c5758898905a6901e1f324c39eac375c2cb4291c7', '[\"*\"]', '2025-11-26 14:48:21', NULL, '2025-11-26 14:48:02', '2025-11-26 14:48:21'),
(110, 'App\\User', 22, 'API Token', '24add08f8f9c4ec56330aad2279b83975d94da4d3687a80020832914b76fb190', '[\"*\"]', '2025-11-26 14:49:51', NULL, '2025-11-26 14:48:44', '2025-11-26 14:49:51'),
(111, 'App\\User', 4, 'API Token', '985adfc05fb1e971baf71ef92edd1c815956dab51990329aa6c23247bb182fe4', '[\"*\"]', '2025-11-26 14:50:11', NULL, '2025-11-26 14:50:09', '2025-11-26 14:50:11'),
(112, 'App\\User', 24, 'API Token', 'c241fa82c74cc2abbfff802cbd630230dc8518ca4c0c9d2fce04fa69ec36b6de', '[\"*\"]', '2025-11-26 14:55:28', NULL, '2025-11-26 14:51:43', '2025-11-26 14:55:28'),
(113, 'App\\User', 29, 'API Token', 'f750142f6c17fcd5616cd7b3a9470be5b622810ddd87e8f32cd7f9366dc0afd6', '[\"*\"]', '2025-11-26 14:55:59', NULL, '2025-11-26 14:55:56', '2025-11-26 14:55:59'),
(114, 'App\\User', 2, 'API Token', 'd64fa6d15a10376bc9628b27ce6b7e11b0844a9b33834d6b5ef2e31026b8148a', '[\"*\"]', '2025-11-26 15:13:46', NULL, '2025-11-26 14:58:29', '2025-11-26 15:13:46'),
(115, 'App\\User', 30, 'API Token', '55693c090f97dd096742d4e83fc0ab433b03fa08b7b338c3ec478a27058c13a7', '[\"*\"]', '2025-11-26 15:06:04', NULL, '2025-11-26 15:06:01', '2025-11-26 15:06:04'),
(116, 'App\\User', 30, 'API Token', '0862c9365bd41122eb94c083c0729509109c7ddf4db46077f9d693378345c633', '[\"*\"]', '2025-11-26 15:06:28', NULL, '2025-11-26 15:06:26', '2025-11-26 15:06:28'),
(117, 'App\\User', 30, 'API Token', '7771e7e73d758e8bd1522bc7abf7845a74b674162c39dbf19b008d29ca90e1e0', '[\"*\"]', '2025-11-26 15:12:36', NULL, '2025-11-26 15:12:33', '2025-11-26 15:12:36'),
(118, 'App\\User', 24, 'API Token', 'e35cf5a65dd5578658db6a4940006d79f7a341db72f7533eae9b5c254dcfdc9c', '[\"*\"]', '2025-11-26 16:17:01', NULL, '2025-11-26 15:14:15', '2025-11-26 16:17:01'),
(119, 'App\\User', 24, 'API Token', 'c58c8b33794e0d877bfe9638b9f09b10f905b0bc62e7d78d1929e5f02c89cb12', '[\"*\"]', '2025-11-26 16:24:35', NULL, '2025-11-26 16:20:53', '2025-11-26 16:24:35'),
(120, 'App\\User', 5, 'API Token', '7cd326bf8c7f099de10c97f5e0391cb1824dbb513bc7c95f6ddb3df4de4e181c', '[\"*\"]', '2025-11-26 16:29:26', NULL, '2025-11-26 16:25:16', '2025-11-26 16:29:26'),
(121, 'App\\User', 2, 'API Token', 'd6da99285310e08873fca2ab7fcd1b3e968fadac963435631fd50254a7f6b5c2', '[\"*\"]', '2025-11-26 16:38:39', NULL, '2025-11-26 16:29:25', '2025-11-26 16:38:39'),
(122, 'App\\User', 2, 'API Token', '4b542a05d320600f110840e84e5283748790179a0acab2d625098d3cfe500fdb', '[\"*\"]', '2025-11-26 16:39:43', NULL, '2025-11-26 16:39:39', '2025-11-26 16:39:43'),
(123, 'App\\User', 2, 'API Token', '3926e2b5a9bf22bfacd33b3f0e17ddc687cf877dc53eb73be7f4dd839f06dceb', '[\"*\"]', '2025-11-26 16:43:15', NULL, '2025-11-26 16:40:40', '2025-11-26 16:43:15'),
(124, 'App\\User', 2, 'API Token', 'b302feb90c9264ef4ccc90e29941dc37734c74b799d7d8aebb6a77d5875bcb8f', '[\"*\"]', '2025-11-26 16:47:30', NULL, '2025-11-26 16:43:35', '2025-11-26 16:47:30'),
(125, 'App\\User', 5, 'API Token', 'aa4dda725d82ea7c116e70596647e977a8924be6cc702e32f8c35a13b2e9a54d', '[\"*\"]', '2025-11-26 16:54:20', NULL, '2025-11-26 16:44:32', '2025-11-26 16:54:20'),
(126, 'App\\User', 2, 'API Token', '362afdafe4db675632516989221fe95774c50b916ee4b48d343acac8efb3bc4f', '[\"*\"]', '2025-11-26 16:58:39', NULL, '2025-11-26 16:53:57', '2025-11-26 16:58:39'),
(127, 'App\\User', 5, 'API Token', '9f67673edf1b3bc42d5b6d045df6e3a31aeadb01e1a4443968e9cbeb7b6b4dec', '[\"*\"]', '2025-11-26 17:21:37', NULL, '2025-11-26 17:00:32', '2025-11-26 17:21:37'),
(128, 'App\\User', 2, 'API Token', 'c7fdda5cdc2baf2074dc7116b636fc9dbb655f7aa16b0dde6614c98aa35f09ed', '[\"*\"]', '2025-11-26 17:17:17', NULL, '2025-11-26 17:01:06', '2025-11-26 17:17:17'),
(129, 'App\\User', 24, 'API Token', '3840579295a229973a8619d3749f916e03d537e53f67a78254044d7881f82928', '[\"*\"]', '2025-11-27 04:25:39', NULL, '2025-11-27 03:53:06', '2025-11-27 04:25:39'),
(130, 'App\\User', 24, 'API Token', '8c13d642b8ae5feb6d0023f01f9945e4eabd1b0384645231d32a9e64646e0179', '[\"*\"]', '2025-11-27 04:28:16', NULL, '2025-11-27 04:26:54', '2025-11-27 04:28:16'),
(131, 'App\\User', 25, 'API Token', 'bef16b5c80886e1c94111f24aaa5bb2c952390dc95cb0b761a8903d4e24df47c', '[\"*\"]', '2025-11-27 04:29:00', NULL, '2025-11-27 04:28:39', '2025-11-27 04:29:00'),
(132, 'App\\User', 5, 'API Token', '164ff94a8919768cd3000f22b4b9cf504e2877f98ad42c37359e61c22fecc423', '[\"*\"]', '2025-11-27 04:43:49', NULL, '2025-11-27 04:34:36', '2025-11-27 04:43:49'),
(133, 'App\\User', 2, 'API Token', 'bad5ae1c9f0b5aa035773fa3cb3627117f99cb36aa7c360362665ffaf95abd35', '[\"*\"]', '2025-11-27 04:48:08', NULL, '2025-11-27 04:45:19', '2025-11-27 04:48:08'),
(134, 'App\\User', 5, 'API Token', '3f68a1c468f67a98ce1847cc473bf1d13b448a85b7c3b9138baba8de6d26495f', '[\"*\"]', '2025-11-28 02:53:15', NULL, '2025-11-28 02:49:26', '2025-11-28 02:53:15'),
(135, 'App\\User', 5, 'API Token', '8f99b74f9214a6d5b31b48a1fae46e3375f1077ee9b4bf12e69607df6192c947', '[\"*\"]', '2025-11-28 02:54:05', NULL, '2025-11-28 02:53:40', '2025-11-28 02:54:05'),
(136, 'App\\User', 5, 'API Token', '9a549697101611eb620a95ea4ebb4ac1bf86d12ddf4faebf056a7c64b8963fb4', '[\"*\"]', '2025-11-28 02:57:45', NULL, '2025-11-28 02:54:25', '2025-11-28 02:57:45'),
(137, 'App\\User', 5, 'API Token', '85ea49d08e94db86321ff0c6d8532ebda8b0f030ea00cc5d0698250eb40bafdd', '[\"*\"]', '2025-11-28 03:03:39', NULL, '2025-11-28 03:03:26', '2025-11-28 03:03:39'),
(138, 'App\\User', 5, 'API Token', '76ea93f6de219372a5d7cff19231991b0c988a98465ac37546711b97b15be1e5', '[\"*\"]', '2025-11-28 03:05:16', NULL, '2025-11-28 03:03:46', '2025-11-28 03:05:16'),
(139, 'App\\User', 5, 'API Token', '4d20741a5b5059e225f17a695a0cce4e68c9dbbe0512b09b24fadefbd87be9cc', '[\"*\"]', '2025-11-28 03:05:59', NULL, '2025-11-28 03:05:52', '2025-11-28 03:05:59'),
(140, 'App\\User', 25, 'API Token', '225951711bb71a153e000f453e95e758ee33a47331c6137360b4ab3fb07e9c5e', '[\"*\"]', '2025-11-28 03:07:40', NULL, '2025-11-28 03:06:26', '2025-11-28 03:07:40'),
(141, 'App\\User', 5, 'API Token', '88d5fb41a8f0ef319c8fc6f408f95a39e7808dbc30c068292b9b5401348721d9', '[\"*\"]', '2025-11-28 03:16:42', NULL, '2025-11-28 03:08:13', '2025-11-28 03:16:42'),
(142, 'App\\User', 2, 'API Token', '5b67d62be71c9ac24379090d77024ed975c04965da2c0bf3f5832aeb15133173', '[\"*\"]', '2025-11-28 03:17:16', NULL, '2025-11-28 03:16:57', '2025-11-28 03:17:16'),
(143, 'App\\User', 4, 'API Token', '1d499300a000df9db4f04533f32043f742d2193f9bf33c03288d31e21a119bdd', '[\"*\"]', '2025-11-28 03:17:59', NULL, '2025-11-28 03:17:40', '2025-11-28 03:17:59'),
(144, 'App\\User', 2, 'API Token', '653d580c6944d97c04e5b3613440ef8b661ddc65b153bd7dae172c095810c36d', '[\"*\"]', '2025-11-28 03:32:28', NULL, '2025-11-28 03:30:37', '2025-11-28 03:32:28'),
(145, 'App\\User', 2, 'API Token', 'f3e0870566b61c6c4609da754fd06d039c0d803012b3802cbcf83c66ccb604ae', '[\"*\"]', '2025-11-28 03:34:25', NULL, '2025-11-28 03:33:07', '2025-11-28 03:34:25'),
(146, 'App\\User', 2, 'API Token', 'f9d7b3d96f4c239a2abdcb2a67898929ea9300206f75532beef08f475b0401a7', '[\"*\"]', '2025-11-28 03:40:42', NULL, '2025-11-28 03:34:36', '2025-11-28 03:40:42'),
(147, 'App\\User', 2, 'API Token', 'c3be101d10920aee65ac17637d23f4bafdc5cdb695cb1e6e2b8cec89e76d60b1', '[\"*\"]', '2025-11-28 03:42:07', NULL, '2025-11-28 03:40:55', '2025-11-28 03:42:07'),
(148, 'App\\User', 2, 'API Token', '02dd567235158b7a380f49a81718d2f03c0ec51965240346a768843bfd4fd348', '[\"*\"]', '2025-11-28 03:44:41', NULL, '2025-11-28 03:43:00', '2025-11-28 03:44:41'),
(149, 'App\\User', 2, 'API Token', '747731f5ffdb418ac26352889eb3781fdea16df415d60a8bf74a7aaeb4450762', '[\"*\"]', '2025-11-28 03:46:33', NULL, '2025-11-28 03:45:24', '2025-11-28 03:46:33'),
(150, 'App\\User', 2, 'API Token', '44b65d112ca8580a148c03d324d1eaf0de07e468bb91a47c4d7a06cd2d03d315', '[\"*\"]', '2025-11-28 03:48:45', NULL, '2025-11-28 03:46:55', '2025-11-28 03:48:45'),
(151, 'App\\User', 2, 'API Token', '7ba8b6feefcbfe088ce40fc97f3ae8a8080607571969c948e85b26257f223b5f', '[\"*\"]', '2025-11-28 03:52:06', NULL, '2025-11-28 03:48:56', '2025-11-28 03:52:06'),
(152, 'App\\User', 2, 'API Token', '815fbbe5ef80970c1430f4a1c088a81e6189825a3fd059600981c60f1ce5e63c', '[\"*\"]', '2025-11-28 03:52:30', NULL, '2025-11-28 03:52:22', '2025-11-28 03:52:30'),
(153, 'App\\User', 2, 'API Token', '7de30034b497f247c773c5abff46a1fb7922056a4a9981fb03f0df601baf66eb', '[\"*\"]', '2025-11-28 03:58:53', NULL, '2025-11-28 03:55:10', '2025-11-28 03:58:53'),
(154, 'App\\User', 2, 'API Token', 'a41d6fe3f81b47980ecc18ae8a6ea30741ffe9d8ccfadda6121394cd2eb4147d', '[\"*\"]', '2025-11-28 04:00:00', NULL, '2025-11-28 03:59:30', '2025-11-28 04:00:00'),
(155, 'App\\User', 4, 'API Token', '6f411481b1e8cf4f40f3930f844a545356e7f78e90bb6589380f5e954fc4f51e', '[\"*\"]', '2025-11-28 04:00:30', NULL, '2025-11-28 04:00:19', '2025-11-28 04:00:30'),
(156, 'App\\User', 4, 'API Token', 'c4bace1e4e0778e3a017bc36cf518696700d963cfd1248c47612440450aeba68', '[\"*\"]', '2025-11-28 04:04:24', NULL, '2025-11-28 04:03:30', '2025-11-28 04:04:24'),
(157, 'App\\User', 4, 'API Token', '44b69ec04cffa2200b88c6e1717f56957375458f3d033fedd82ac7c64df8dfa6', '[\"*\"]', '2025-11-28 04:06:21', NULL, '2025-11-28 04:05:10', '2025-11-28 04:06:21'),
(158, 'App\\User', 4, 'API Token', '7627414ecc8b3720b50a89448cd6596f4732f23bfb8f7b2ce7a0868abd8650af', '[\"*\"]', '2025-11-28 04:06:53', NULL, '2025-11-28 04:06:50', '2025-11-28 04:06:53'),
(159, 'App\\User', 4, 'API Token', '4a9f1e499bf838036640f5b566204646d97c0b44061d53c3a43a44eb0b33db3c', '[\"*\"]', '2025-11-28 04:07:14', NULL, '2025-11-28 04:07:12', '2025-11-28 04:07:14'),
(160, 'App\\User', 2, 'API Token', 'fb2949d6bc816084964bcc11f93020b0acd46dc052e127e112bd3ce924aaf6e5', '[\"*\"]', '2025-11-28 04:08:54', NULL, '2025-11-28 04:08:48', '2025-11-28 04:08:54'),
(161, 'App\\User', 4, 'API Token', 'ddd86564713a8b1a0ecc85df4a43b75f55de829440e4c2e5a750874cef875493', '[\"*\"]', '2025-11-28 04:09:09', NULL, '2025-11-28 04:09:07', '2025-11-28 04:09:09'),
(162, 'App\\User', 4, 'API Token', '5414fdf755d991505e2e69d648625b26986e7bc9de4903f5602a4ded03f71152', '[\"*\"]', '2025-11-28 04:10:27', NULL, '2025-11-28 04:10:25', '2025-11-28 04:10:27'),
(163, 'App\\User', 4, 'API Token', '14e9d43a0de10bcb219fae5385cd4fb6e56b0220d6bbb2b399e909b1a9498b0a', '[\"*\"]', '2025-11-28 04:13:37', NULL, '2025-11-28 04:13:35', '2025-11-28 04:13:37'),
(164, 'App\\User', 4, 'API Token', '14db7d74b12545836dd21fc734ea867be4fc810532143701c4d7d7d84faa5464', '[\"*\"]', '2025-11-28 04:15:19', NULL, '2025-11-28 04:15:16', '2025-11-28 04:15:19'),
(165, 'App\\User', 4, 'API Token', 'af64fe28a7ddeb46f5902a068dac49f885227af6c21f23acec952e32ba70afab', '[\"*\"]', '2025-11-28 04:17:15', NULL, '2025-11-28 04:17:13', '2025-11-28 04:17:15'),
(166, 'App\\User', 2, 'API Token', '2181481a6e7d0cc679837fbc420f64e0c3c3720f9c7d2fcdcc8738049721b1da', '[\"*\"]', '2025-11-28 04:17:57', NULL, '2025-11-28 04:17:51', '2025-11-28 04:17:57'),
(167, 'App\\User', 5, 'API Token', '6bf0e448d6445748bd15c6b94251f463befd5636721b387e972923cb71e5b387', '[\"*\"]', '2025-11-28 04:19:12', NULL, '2025-11-28 04:18:43', '2025-11-28 04:19:12'),
(168, 'App\\User', 5, 'API Token', '2aa001bb04b27a14dc584841ff4c1cca078bb026c202fa3ffc07dce22227982f', '[\"*\"]', NULL, NULL, '2025-11-28 04:19:08', '2025-11-28 04:19:08'),
(169, 'App\\User', 5, 'API Token', '6c67a2a19745c7348a137d962c63f493364ab4dc1baa37fa5cdc0d0d8c9ad0ad', '[\"*\"]', '2025-11-28 04:20:46', NULL, '2025-11-28 04:19:43', '2025-11-28 04:20:46'),
(170, 'App\\User', 5, 'API Token', 'a19e2d68b733165fc26b6bb20b6a9b649311f6732c59bcade68fa6588f66b028', '[\"*\"]', '2025-11-28 04:21:55', NULL, '2025-11-28 04:21:47', '2025-11-28 04:21:55'),
(171, 'App\\User', 2, 'API Token', '6d933bc77f1cf1d03500967b5ae98b2f0cfc8cad871508ee58d60c44c1481a2c', '[\"*\"]', '2025-11-28 04:22:07', NULL, '2025-11-28 04:22:01', '2025-11-28 04:22:07'),
(172, 'App\\User', 4, 'API Token', 'e4e9e46d86988476945807fecd4a011a3d1a6d455fdaf564932426dc1cbdc052', '[\"*\"]', '2025-11-28 04:22:23', NULL, '2025-11-28 04:22:21', '2025-11-28 04:22:23'),
(173, 'App\\User', 5, 'API Token', '4ab632796344459db839343bc9c93b3077ca1ce54e5f6aea59d650d61f0c43e7', '[\"*\"]', '2025-11-28 04:24:03', NULL, '2025-11-28 04:22:48', '2025-11-28 04:24:03'),
(174, 'App\\User', 5, 'API Token', 'f03be7246c34439e6416004eafc4f4d933b5a41a6388f12f9f7c366dcef879e6', '[\"*\"]', '2025-11-28 04:25:39', NULL, '2025-11-28 04:24:33', '2025-11-28 04:25:39'),
(175, 'App\\User', 5, 'API Token', 'fb3b016d13e61cb01056b88c46d7e6cd1f3bb5d20c7e9ee91fcba46b851db58a', '[\"*\"]', '2025-11-28 04:29:40', NULL, '2025-11-28 04:26:04', '2025-11-28 04:29:40'),
(176, 'App\\User', 5, 'API Token', '4e90c0d84c48bfc21e59348c987a4595f4a48d7399abf95c89e2b78059d34c2c', '[\"*\"]', '2025-11-28 04:30:21', NULL, '2025-11-28 04:30:14', '2025-11-28 04:30:21'),
(177, 'App\\User', 2, 'API Token', '8c3c9f830d88d6626c1ffcba8035359fc43a50cd81ff18ec7e64b8188eabea55', '[\"*\"]', '2025-11-28 04:31:13', NULL, '2025-11-28 04:30:40', '2025-11-28 04:31:13'),
(178, 'App\\User', 24, 'API Token', '3397fd452287c8abb8f8c4e5b269d7fd20171f31e1c0f52a72ad8de770d1e5da', '[\"*\"]', '2025-11-28 04:31:40', NULL, '2025-11-28 04:31:31', '2025-11-28 04:31:40'),
(179, 'App\\User', 4, 'API Token', '468cd4bb31249ad899e151a98cb3b6c790fa3cc9671a4a798c20bcd8fd306a8c', '[\"*\"]', '2025-11-28 04:34:32', NULL, '2025-11-28 04:32:24', '2025-11-28 04:34:32'),
(180, 'App\\User', 5, 'API Token', 'baf3198b151eb1e25ce5ec5714e269f00c65bc234e19d08e9ca85b8b0d86a04d', '[\"*\"]', '2025-11-29 04:07:28', NULL, '2025-11-29 04:07:20', '2025-11-29 04:07:28'),
(181, 'App\\User', 5, 'API Token', 'ebe85190d709549034129e7805065804eb0087bca1ca37b2d8d6b4caa86453ad', '[\"*\"]', '2025-11-29 04:09:17', NULL, '2025-11-29 04:07:48', '2025-11-29 04:09:17'),
(182, 'App\\User', 2, 'API Token', 'c244c5dd5674a8abdf0c7cb4ee370b46aecbae649fab40757dd41c8de055652c', '[\"*\"]', '2025-11-29 04:09:56', NULL, '2025-11-29 04:09:37', '2025-11-29 04:09:56'),
(183, 'App\\User', 2, 'API Token', 'cdf4a09d5ea732382a74965bd156621266aa4357126edcf7b7745e6c973e65a7', '[\"*\"]', NULL, NULL, '2025-11-29 04:11:13', '2025-11-29 04:11:13'),
(184, 'App\\User', 4, 'API Token', '80ffe18bb67b6c497637ee18a2afcb0a0a048d3822874f14c68a089956eb7888', '[\"*\"]', '2025-11-29 04:11:36', NULL, '2025-11-29 04:11:32', '2025-11-29 04:11:36'),
(185, 'App\\User', 4, 'API Token', '1027c3561183cd7d459d2acb5821632ee1343a974ad879fa36d6f314bcdce105', '[\"*\"]', NULL, NULL, '2025-11-29 04:12:19', '2025-11-29 04:12:19'),
(186, 'App\\User', 5, 'API Token', 'a2de294246223d8496ae65733aec033ce3b7e9cd22204a16e0e678fd4578a507', '[\"*\"]', '2025-11-29 04:12:46', NULL, '2025-11-29 04:12:40', '2025-11-29 04:12:46'),
(187, 'App\\User', 2, 'API Token', '8f02ba167067a96ec3a6b8681141cfb5bbb98af61177826242734fe29ac9f6c7', '[\"*\"]', '2025-11-29 04:14:21', NULL, '2025-11-29 04:13:49', '2025-11-29 04:14:21'),
(188, 'App\\User', 5, 'API Token', 'c7eab18746bf7d9bbcfbf680de89fe0945bcaf248a50929736bb9960cab6ab0f', '[\"*\"]', '2025-11-29 04:14:23', NULL, '2025-11-29 04:14:15', '2025-11-29 04:14:23'),
(189, 'App\\User', 5, 'API Token', 'bea16d761a7b226efc6d8f9ce5ee49e35e543099419bc15295fc23fc6e288a7f', '[\"*\"]', '2025-11-29 04:18:21', NULL, '2025-11-29 04:17:19', '2025-11-29 04:18:21'),
(190, 'App\\User', 5, 'API Token', '873904c91368ad2712e5e29cf1dee84183b93374ce6fbc35b39e7e807f916276', '[\"*\"]', '2025-11-29 04:20:36', NULL, '2025-11-29 04:20:11', '2025-11-29 04:20:36'),
(191, 'App\\User', 2, 'API Token', 'aa1c75dc46b24df1ee3d94a277e3ef834eee1a0167f160e34cb6ee6567664e4f', '[\"*\"]', '2025-11-29 04:20:49', NULL, '2025-11-29 04:20:43', '2025-11-29 04:20:49'),
(192, 'App\\User', 4, 'API Token', 'ee4cc39b5a68b117502025805fb64e1aef2a0bb5baceff6a85976264e548de27', '[\"*\"]', '2025-11-29 04:21:09', NULL, '2025-11-29 04:21:05', '2025-11-29 04:21:09'),
(193, 'App\\User', 5, 'API Token', 'fa6fe92ed1ba3aadd609854b4a7229607f5fbd647832e2be334d56e0889c6fa4', '[\"*\"]', '2025-11-29 04:25:01', NULL, '2025-11-29 04:24:26', '2025-11-29 04:25:01'),
(194, 'App\\User', 2, 'API Token', '5368878ae882de4c4b2f38d18f75de5a30846865f0826e1332cf96fbfc2a7161', '[\"*\"]', '2025-11-29 04:26:18', NULL, '2025-11-29 04:26:11', '2025-11-29 04:26:18'),
(195, 'App\\User', 5, 'API Token', '4ff407f79651af43a72150066872419ca3a3699afc69abd1edddf036585c27a1', '[\"*\"]', '2025-11-29 04:26:38', NULL, '2025-11-29 04:26:29', '2025-11-29 04:26:38'),
(196, 'App\\User', 2, 'API Token', '7530ab00744e17d3355d3162efbb8f437627053f0e49badc07c577a72f5d0ded', '[\"*\"]', '2025-11-29 04:27:08', NULL, '2025-11-29 04:27:02', '2025-11-29 04:27:08'),
(197, 'App\\User', 4, 'API Token', '13e8079a472f5560ffe13419ed40bb8c12622bf03d62aa57bc67647e770d2cb7', '[\"*\"]', '2025-11-29 04:29:58', NULL, '2025-11-29 04:27:23', '2025-11-29 04:29:58'),
(198, 'App\\User', 5, 'API Token', '65f7f3ac791ad3ad9fee5b090b98a305f9bb089b02bd076a4a770d7945a08b86', '[\"*\"]', '2025-11-29 04:31:05', NULL, '2025-11-29 04:31:00', '2025-11-29 04:31:05'),
(199, 'App\\User', 5, 'API Token', '464b54ee7efcf934765b4e0d52cd994575a8f5a76041a0cd7804ee8c8991ea45', '[\"*\"]', '2025-11-29 04:33:25', NULL, '2025-11-29 04:33:17', '2025-11-29 04:33:25'),
(200, 'App\\User', 5, 'API Token', 'f586ed676981eda17551b65214c87da6f9844aad813398feca774f6728336436', '[\"*\"]', '2025-11-29 04:37:19', NULL, '2025-11-29 04:37:11', '2025-11-29 04:37:19'),
(201, 'App\\User', 2, 'API Token', '19f4959a15688d5d234f9c0120e297ba28d5c838676caeba5d2d1b9fce8ece15', '[\"*\"]', '2025-11-29 04:37:46', NULL, '2025-11-29 04:37:40', '2025-11-29 04:37:46'),
(202, 'App\\User', 5, 'API Token', 'ae3e19fdff263cf3cd59e9700b55ef97e9c77907c4073da07f26d87bc827efce', '[\"*\"]', '2025-11-29 04:39:59', NULL, '2025-11-29 04:38:04', '2025-11-29 04:39:59'),
(203, 'App\\User', 5, 'API Token', 'df7427086850229d46942f3d0fe3c264bda960237d3669eaaba77f268d5dcded', '[\"*\"]', '2025-11-29 04:40:52', NULL, '2025-11-29 04:40:50', '2025-11-29 04:40:52'),
(204, 'App\\User', 5, 'API Token', '34b44f704d31a1e0191f44385d0d76142c675bdc37ac7ddc03d4a68d54e4f47c', '[\"*\"]', '2025-11-29 04:42:16', NULL, '2025-11-29 04:42:08', '2025-11-29 04:42:16'),
(205, 'App\\User', 5, 'API Token', '7add3f3ec47ce2e9fde40f3ec63b3a2d9ceefa185d710d7abbc52099d384910d', '[\"*\"]', '2025-11-29 04:42:57', NULL, '2025-11-29 04:42:50', '2025-11-29 04:42:57'),
(206, 'App\\User', 5, 'API Token', 'df869d3eb7b01f843575535261d358f90072fb33126baa002d075dd92974f31f', '[\"*\"]', '2025-11-29 04:45:02', NULL, '2025-11-29 04:44:54', '2025-11-29 04:45:02'),
(207, 'App\\User', 2, 'API Token', '7a63c5f675779dfa779eeec92d516cf2ab9141f12cb05ad38e75a4918dc9a54f', '[\"*\"]', '2025-11-29 04:45:19', NULL, '2025-11-29 04:45:13', '2025-11-29 04:45:19'),
(208, 'App\\User', 4, 'API Token', '61d9fead6c4b0d07d6b295c2bdee11af43b6c457518c233c58ca4753076500eb', '[\"*\"]', '2025-11-29 04:45:31', NULL, '2025-11-29 04:45:27', '2025-11-29 04:45:31'),
(209, 'App\\User', 5, 'API Token', '5d2229c64276ab1cd4ec499d58080676d558b231a35a8f6166f78b05c34ec4a6', '[\"*\"]', '2025-11-29 04:57:50', NULL, '2025-11-29 04:57:42', '2025-11-29 04:57:50'),
(210, 'App\\User', 2, 'API Token', 'f8df487d38f80d9356fe4036d6f812cc633e64e9e03de9dbe2c8ae91706f7bfe', '[\"*\"]', '2025-11-29 04:58:08', NULL, '2025-11-29 04:58:02', '2025-11-29 04:58:08'),
(211, 'App\\User', 4, 'API Token', '722960672b7f85674b0de8920c6796e0a19bd052eac6ed709b2ead5c03240503', '[\"*\"]', '2025-11-29 04:58:20', NULL, '2025-11-29 04:58:16', '2025-11-29 04:58:20'),
(212, 'App\\User', 5, 'API Token', '058cdffc4e08096fa53345b2f14eed12aa93792c80b3340718d2f4578b1550a5', '[\"*\"]', '2025-12-03 04:50:16', NULL, '2025-11-29 04:58:31', '2025-12-03 04:50:16'),
(213, 'App\\User', 5, 'API Token', '1cb166e79c2ca1c17e19ea4cc9b30bee08a89676ece230f4c26c8cc3c1622e60', '[\"*\"]', '2025-12-01 02:32:09', NULL, '2025-12-01 02:31:42', '2025-12-01 02:32:09'),
(214, 'App\\User', 2, 'API Token', '63cda0eaee11f6475d5984d8bc6c2b2c9f7dc137a7b6f0a8f1c07062724af738', '[\"*\"]', '2025-12-01 02:35:35', NULL, '2025-12-01 02:32:36', '2025-12-01 02:35:35'),
(215, 'App\\User', 5, 'API Token', '77906557dab1fc98dfcc72876b183c7ec584d98d823540135000d9b9dcb93a31', '[\"*\"]', '2025-12-01 02:38:35', NULL, '2025-12-01 02:35:54', '2025-12-01 02:38:35'),
(216, 'App\\User', 5, 'API Token', '2dad79e3c894ab99a019ad727adf01724d2aa5a48310b3b9a304dfdcd7dd31a6', '[\"*\"]', '2025-12-01 02:39:05', NULL, '2025-12-01 02:38:48', '2025-12-01 02:39:05'),
(217, 'App\\User', 2, 'API Token', '9ead6a9a71efb2dc650104df212c2b3b54a0239bf44b6e2057046b9dc90bfc5b', '[\"*\"]', '2025-12-01 02:39:23', NULL, '2025-12-01 02:39:11', '2025-12-01 02:39:23'),
(218, 'App\\User', 5, 'API Token', '956dba0c8a28c081bf0aed6703ad80c838088cd61b2582ea1f8a7236dabd8533', '[\"*\"]', '2025-12-01 02:44:07', NULL, '2025-12-01 02:41:58', '2025-12-01 02:44:07'),
(219, 'App\\User', 5, 'API Token', 'c03fe4ae303d930576be30e2e3784f1160c1363cedb19058799f8fb5e43e7d0e', '[\"*\"]', '2025-12-01 02:44:51', NULL, '2025-12-01 02:44:37', '2025-12-01 02:44:51'),
(220, 'App\\User', 2, 'API Token', 'fda935e4ecdd56e8b2a9ff9513de53874fb0e89ff22f8bb5be2218ccfa3a5bf0', '[\"*\"]', '2025-12-01 02:45:02', NULL, '2025-12-01 02:44:54', '2025-12-01 02:45:02'),
(221, 'App\\User', 4, 'API Token', 'cf2eda9605aebe8f302327a64dbc266f84f56d05d3d0de5abe1ce69653b34b49', '[\"*\"]', '2025-12-01 02:45:28', NULL, '2025-12-01 02:45:25', '2025-12-01 02:45:28'),
(222, 'App\\User', 2, 'API Token', 'd3527d91dfd6aab347a0954f1914b6e07fdb7386e4eec12403d83efaf4853a32', '[\"*\"]', '2025-12-01 02:45:54', NULL, '2025-12-01 02:45:49', '2025-12-01 02:45:54'),
(223, 'App\\User', 5, 'API Token', '0b61f592c45258dcfec6c80fbb7fa2bb55e24516b2227a4d39856d66e2e30302', '[\"*\"]', '2025-12-01 02:46:12', NULL, '2025-12-01 02:46:05', '2025-12-01 02:46:12'),
(224, 'App\\User', 2, 'API Token', 'd55a1bf2d596fc4bcf7e714db31c6828e8d283a1f28223737ae8f8c42918fc38', '[\"*\"]', '2025-12-01 02:50:46', NULL, '2025-12-01 02:50:40', '2025-12-01 02:50:46'),
(225, 'App\\User', 5, 'API Token', '7d133a6a17ad0ece988ee77a9f6bf745143275a7e0a92b8e2b7ef313d195baec', '[\"*\"]', '2025-12-04 03:47:46', NULL, '2025-12-03 04:55:41', '2025-12-04 03:47:46'),
(226, 'App\\User', 2, 'API Token', '80116954fd77b740a5ce1bcb226fd9bf431790e305b6351b21387441aed3ce94', '[\"*\"]', '2025-12-03 05:11:58', NULL, '2025-12-03 04:55:52', '2025-12-03 05:11:58'),
(227, 'App\\User', 5, 'API Token', '515c901dffef1cf70f2c453b2415cd099733aa194820d28c3e36c27dbb72881a', '[\"*\"]', '2025-12-04 04:16:00', NULL, '2025-12-04 03:44:33', '2025-12-04 04:16:00'),
(228, 'App\\User', 2, 'API Token', '81803b173255fe824af0ae392b1aa84f4280f57ecfe19f85e590422675b6ca7a', '[\"*\"]', '2025-12-04 04:15:59', NULL, '2025-12-04 03:47:55', '2025-12-04 04:15:59'),
(229, 'App\\User', 5, 'API Token', 'afd7897b7ada2d89df4e4e26751a7f9e0d0dc18059d973adb066fc8d5df801a0', '[\"*\"]', '2025-12-04 04:18:24', NULL, '2025-12-04 04:16:59', '2025-12-04 04:18:24'),
(230, 'App\\User', 2, 'API Token', '954d82925919e01494660d0d6fe7146a1db11655f23a51f18f5ed4da29c5e009', '[\"*\"]', '2025-12-04 05:30:50', NULL, '2025-12-04 04:17:10', '2025-12-04 05:30:50'),
(231, 'App\\User', 5, 'API Token', '50b0c8b872ac8c8c10c0bd395acd77c773922f19e9c2a2fe199aaa2d85658c5b', '[\"*\"]', '2025-12-04 05:30:50', NULL, '2025-12-04 04:18:31', '2025-12-04 05:30:50'),
(232, 'App\\User', 5, 'API Token', 'af55333d79145c41c6f7ff208b9196d9b69aa846e30cabbaf18d33c2efd10555', '[\"*\"]', '2025-12-04 05:07:39', NULL, '2025-12-04 05:04:47', '2025-12-04 05:07:39'),
(233, 'App\\User', 5, 'API Token', '5ade1218dbceae0d3f9e208f12cbae193a363722310d09490c0c8554ed8a4098', '[\"*\"]', '2025-12-04 06:43:03', NULL, '2025-12-04 06:42:50', '2025-12-04 06:43:03'),
(234, 'App\\User', 5, 'API Token', 'e7909d3ee2e7171794d7b9934bbac90ec8c3cffa039821969a838788ed414bc7', '[\"*\"]', '2025-12-04 14:56:47', NULL, '2025-12-04 14:39:00', '2025-12-04 14:56:47'),
(235, 'App\\User', 2, 'API Token', 'a9ddde91c10361e3c48ec89c915368421d10b812fcf854afd8753dbc19a14a61', '[\"*\"]', '2025-12-04 14:57:52', NULL, '2025-12-04 14:49:58', '2025-12-04 14:57:52'),
(236, 'App\\User', 24, 'API Token', 'c75f63df7564ddbcaac4b73eb9c6a15297ebec55ab5a54104d298ab8d0ea4ed1', '[\"*\"]', '2025-12-04 15:00:00', NULL, '2025-12-04 14:58:08', '2025-12-04 15:00:00'),
(237, 'App\\User', 26, 'API Token', 'edc93cdcdd5c6b2d01cee31bede80aeb3e6f78685307cbb3f19ca7c8ab82bfc6', '[\"*\"]', '2025-12-04 15:23:27', NULL, '2025-12-04 15:00:27', '2025-12-04 15:23:27'),
(238, 'App\\User', 4, 'API Token', '5a605208c9e7ff884431724be2531f78849f56447c53ce5a18f2037d042f07b3', '[\"*\"]', '2025-12-04 15:44:28', NULL, '2025-12-04 15:27:10', '2025-12-04 15:44:28'),
(239, 'App\\User', 2, 'API Token', '57fcbf86fdfceead9e346a2b0e10f9fbc96650b1b97f792a1dcd98236bfb8f55', '[\"*\"]', '2025-12-04 15:55:27', NULL, '2025-12-04 15:44:25', '2025-12-04 15:55:27'),
(240, 'App\\User', 4, 'API Token', '51913e0dc71bec2802963b745f22f159d990b4df2d785e6f6953d34c503b9b44', '[\"*\"]', '2025-12-04 15:55:42', NULL, '2025-12-04 15:55:39', '2025-12-04 15:55:42'),
(241, 'App\\User', 26, 'API Token', '80d431cb5ea3f6592d2ce3bc6d5b9ead22d2ebbd79468db3f7a3a47a29a2c63d', '[\"*\"]', '2025-12-04 15:56:02', NULL, '2025-12-04 15:55:59', '2025-12-04 15:56:02'),
(242, 'App\\User', 5, 'API Token', 'b7a2f8fc178cc7505663dde3bb8bbf2e0918d2373f1bd1e43ab682471a941d07', '[\"*\"]', '2025-12-07 15:05:26', NULL, '2025-12-07 14:47:51', '2025-12-07 15:05:26'),
(243, 'App\\User', 2, 'API Token', '2bcd9a94baf9ccce3fdc5279b756d803316ecc7cff82fd58b24ebc1abf94130c', '[\"*\"]', '2025-12-07 14:59:44', NULL, '2025-12-07 14:55:57', '2025-12-07 14:59:44'),
(244, 'App\\User', 4, 'API Token', '01a21411d8e31ace41b8484ce68f5251f008d04b4cd883324542b0c80f4064df', '[\"*\"]', '2025-12-07 15:00:39', NULL, '2025-12-07 15:00:35', '2025-12-07 15:00:39'),
(245, 'App\\User', 5, 'API Token', '14a1b0a2d0fcf57dc7ede64f10804e9619b057a7bf4e547435c64b5718abbba3', '[\"*\"]', '2025-12-07 15:04:53', NULL, '2025-12-07 15:04:39', '2025-12-07 15:04:53'),
(246, 'App\\User', 2, 'API Token', '9119b81187894106cb0b66cbe6cee41086fd867848d6a5d1376a74ca3f81d38b', '[\"*\"]', '2025-12-07 15:10:41', NULL, '2025-12-07 15:05:21', '2025-12-07 15:10:41'),
(247, 'App\\User', 24, 'API Token', '489c4ea6c59d05bfc1aad76dbd690aa621353b96f481c77b44da3f99fcffd3e2', '[\"*\"]', '2025-12-07 15:23:03', NULL, '2025-12-07 15:11:36', '2025-12-07 15:23:03'),
(248, 'App\\User', 4, 'API Token', 'c9bf485d4989c9326d570c831226241f60c5585112c11b670ea47802c1bb4172', '[\"*\"]', '2025-12-07 16:29:35', NULL, '2025-12-07 16:29:32', '2025-12-07 16:29:35'),
(249, 'App\\User', 26, 'API Token', 'cf6cfb898fc6b47e6e11ab6bc3097bd8c4de7e6ccb081013ecde4abd728587e1', '[\"*\"]', '2025-12-07 16:30:43', NULL, '2025-12-07 16:30:30', '2025-12-07 16:30:43'),
(250, 'App\\User', 5, 'API Token', '1b1ff778d97a4c9a1db14f89708257faba2bba75e9bad7d8c9e426e0d6ccf235', '[\"*\"]', '2025-12-07 16:31:55', NULL, '2025-12-07 16:31:16', '2025-12-07 16:31:55'),
(251, 'App\\User', 2, 'API Token', '540efb0b2e14c23a3b4583948dbab74f1adec8cb095ffba77f2470e44867181c', '[\"*\"]', '2025-12-07 16:33:00', NULL, '2025-12-07 16:32:17', '2025-12-07 16:33:00'),
(252, 'App\\User', 5, 'API Token', 'b5860a40e40ce73ac980abb9f31591a3c6202d97ea3163930e1493e53911dd4a', '[\"*\"]', '2025-12-07 16:41:17', NULL, '2025-12-07 16:33:13', '2025-12-07 16:41:17'),
(253, 'App\\User', 2, 'API Token', '405afb5a51a8bc0d2c21270eeb172fe7b45e862c9e3ab5ca7f435b8648334bb7', '[\"*\"]', '2025-12-07 16:37:53', NULL, '2025-12-07 16:34:11', '2025-12-07 16:37:53'),
(254, 'App\\User', 5, 'API Token', '4c3b60615dc845926b9b1aad99557a9eb7c299b1567b30f88a7785501fb51c38', '[\"*\"]', '2025-12-07 16:40:46', NULL, '2025-12-07 16:38:08', '2025-12-07 16:40:46'),
(255, 'App\\User', 2, 'API Token', '37f05159319078dbf5b2ae4249616d3c741bd65688ef2bc1fd6c5fcba47006cf', '[\"*\"]', '2025-12-07 16:42:36', NULL, '2025-12-07 16:41:13', '2025-12-07 16:42:36'),
(256, 'App\\User', 5, 'API Token', 'd844e6874c49060b104aeefbd63ec1ced732eb7466e771f90b6660761687ddeb', '[\"*\"]', '2025-12-07 16:49:14', NULL, '2025-12-07 16:43:18', '2025-12-07 16:49:14'),
(257, 'App\\User', 5, 'API Token', 'a71461327c7684b7fe2f698f9cc995de54e5ae177ddae6ff614091b4dad891fd', '[\"*\"]', '2025-12-08 02:07:03', NULL, '2025-12-08 02:05:55', '2025-12-08 02:07:03'),
(258, 'App\\User', 5, 'API Token', '979435745b8a7b6a0571d852b31a31e6e977390691e4e0b303bdff3ba9c0759f', '[\"*\"]', '2025-12-08 03:41:00', NULL, '2025-12-08 02:31:06', '2025-12-08 03:41:00'),
(259, 'App\\User', 5, 'API Token', 'b7b4ed1d3cc5bc3d6b7549d50ebb04f2142fafb77641b7f7f8b25a592529309b', '[\"*\"]', '2025-12-09 01:50:48', NULL, '2025-12-09 01:47:21', '2025-12-09 01:50:48'),
(260, 'App\\User', 2, 'API Token', '762ce3bcd9b669c541c7d4a579efb0b6d7c78c7dcadb5e2ffd54f05acf2b57d4', '[\"*\"]', '2025-12-09 01:51:07', NULL, '2025-12-09 01:49:50', '2025-12-09 01:51:07'),
(261, 'App\\User', 26, 'API Token', 'b6ea4c600626131daa6cef0e837122094cc360d4bf03671facfff3535d3f3e93', '[\"*\"]', '2025-12-09 01:51:15', NULL, '2025-12-09 01:51:11', '2025-12-09 01:51:15'),
(262, 'App\\User', 4, 'API Token', '9990e1020bc91274c0ce534d34964d073cff6fb1068f76c7372dd01fc708dcb4', '[\"*\"]', '2025-12-09 01:51:44', NULL, '2025-12-09 01:51:41', '2025-12-09 01:51:44'),
(263, 'App\\User', 5, 'API Token', 'fb4d22f8e213c5f5392288359150d83cd264b2b58b9be2f15387bb8dd27867b6', '[\"*\"]', '2025-12-11 01:07:29', NULL, '2025-12-09 13:07:57', '2025-12-11 01:07:29'),
(264, 'App\\User', 5, 'API Token', '51726c2d56754c05cc36c226142af1f45b8d4ea8b4b4df3520bcd05d5fea36a6', '[\"*\"]', '2025-12-11 01:09:17', NULL, '2025-12-11 01:07:24', '2025-12-11 01:09:17'),
(265, 'App\\User', 2, 'API Token', '65152899d3f881d25ef3258286b50698525b02a6246549b68deaded5318178ae', '[\"*\"]', '2025-12-11 01:15:23', NULL, '2025-12-11 01:09:33', '2025-12-11 01:15:23'),
(266, 'App\\User', 5, 'API Token', '8c4cb787eb19fa321f4304320bd89429809ee117f328bd06f7409dafde91ba70', '[\"*\"]', '2025-12-11 01:16:03', NULL, '2025-12-11 01:11:46', '2025-12-11 01:16:03'),
(267, 'App\\User', 2, 'API Token', 'c07684b4c77594f9a84fdeaef606834005c84f280e2d16e90f049aae6dc81cbc', '[\"*\"]', '2025-12-11 01:20:25', NULL, '2025-12-11 01:16:06', '2025-12-11 01:20:25');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(268, 'App\\User', 5, 'API Token', 'b1603fb9c9470647d3920bcf9faa3f6761bc96130f7383d778ca7ca4f1c29905', '[\"*\"]', '2025-12-11 01:20:28', NULL, '2025-12-11 01:19:59', '2025-12-11 01:20:28'),
(269, 'App\\User', 2, 'API Token', 'dcd49f65ee29eda932c34443737acdfa33baf764b69d862fa69d6752676e74be', '[\"*\"]', '2025-12-11 01:21:44', NULL, '2025-12-11 01:21:20', '2025-12-11 01:21:44'),
(270, 'App\\User', 5, 'API Token', '073aaaeb7fd0b837f0627ae5a2af7252f3628eee5ede13062d8cc870a65a1d05', '[\"*\"]', '2025-12-11 01:23:25', NULL, '2025-12-11 01:21:40', '2025-12-11 01:23:25'),
(271, 'App\\User', 5, 'API Token', '00dda7a095ea81fab2ec3d4986b5902a3f99604a1276477cef4472078b152d54', '[\"*\"]', '2025-12-11 02:08:15', NULL, '2025-12-11 01:23:49', '2025-12-11 02:08:15'),
(272, 'App\\User', 2, 'API Token', '571a0c57eef01496086d39f32635a9b400974913e5c89f8b468a8b3a700390a5', '[\"*\"]', '2025-12-11 01:31:39', NULL, '2025-12-11 01:24:06', '2025-12-11 01:31:39'),
(273, 'App\\User', 5, 'API Token', 'be49c546121721a500692302576e23f6cbfc92a788ddebe97eb0b50f7dc8d978', '[\"*\"]', '2025-12-11 01:37:43', NULL, '2025-12-11 01:37:23', '2025-12-11 01:37:43'),
(274, 'App\\User', 2, 'API Token', 'd3981cfa5b18126ab54d2b22e7a0d0fc985b88689e15dcac3bfa9ffcd131ad1d', '[\"*\"]', '2025-12-11 01:43:22', NULL, '2025-12-11 01:37:57', '2025-12-11 01:43:22'),
(275, 'App\\User', 5, 'API Token', '792521f24bf50cc896ff44d0b26803acef6e8d7236cfa27a764e059d56c774a6', '[\"*\"]', '2025-12-11 01:44:02', NULL, '2025-12-11 01:43:36', '2025-12-11 01:44:02'),
(276, 'App\\User', 2, 'API Token', 'fc0afb99b1814d52871346aa8c429d9894bcd600fcc828e77d679cc233d5fee8', '[\"*\"]', '2025-12-11 01:46:57', NULL, '2025-12-11 01:44:11', '2025-12-11 01:46:57'),
(277, 'App\\User', 5, 'API Token', '5d7fd827ea88de99e1940a444baa6089a10dcb0357a0b72ea48fe93153d1f0ff', '[\"*\"]', '2025-12-11 02:08:07', NULL, '2025-12-11 02:07:44', '2025-12-11 02:08:07'),
(278, 'App\\User', 2, 'API Token', '588c582b493263ea552593b9ad42e000d5cc41bd203bd08d7a38a89c771cdf07', '[\"*\"]', '2025-12-11 02:15:28', NULL, '2025-12-11 02:08:12', '2025-12-11 02:15:28'),
(279, 'App\\Models\\User', 27, 'API Token', 'd5cce58a517d079766787f330e2397243804c2dc14f815153656d9eb9775bf7e', '[\"*\"]', NULL, NULL, '2025-12-31 05:03:23', '2025-12-31 05:03:23'),
(280, 'App\\Models\\User', 5, 'API Token', '91fc2b2eebb18b22221dce47575db664b8a12045fb106515e8b105a0b78d8c6f', '[\"*\"]', '2025-12-31 05:04:20', NULL, '2025-12-31 05:04:14', '2025-12-31 05:04:20'),
(281, 'App\\Models\\User', 4, 'API Token', '13dbd564b99da343f8cb213bf694e9f6cb7f0d677d458d01972a6813ff16e1d8', '[\"*\"]', '2025-12-31 05:47:54', NULL, '2025-12-31 05:05:32', '2025-12-31 05:47:54'),
(282, 'App\\Models\\User', 4, 'API Token', '10128a9f73c9d5763ffd53c44073ffb0840993a318a7bfc505cc525a17e6d06c', '[\"*\"]', NULL, NULL, '2025-12-31 09:17:39', '2025-12-31 09:17:39'),
(283, 'App\\Models\\User', 4, 'API Token', '458848afda500875cca2761dd1d9418dcba61d31b1af663db1a3c07e7ed57202', '[\"*\"]', '2025-12-31 09:19:35', NULL, '2025-12-31 09:19:34', '2025-12-31 09:19:35'),
(284, 'App\\Models\\User', 2, 'API Token', '0f8c3d5a97adc4dd5a7fdf351a7aa9ff27a142c7bae1c28d2e01de3dfda08c98', '[\"*\"]', '2025-12-31 09:29:24', NULL, '2025-12-31 09:20:02', '2025-12-31 09:29:24'),
(285, 'App\\Models\\User', 5, 'API Token', 'eccfeab44f9d7a0b62c85377b1bd5832d45ab47a46ae66ad15d2267f2c2df6a1', '[\"*\"]', '2025-12-31 09:31:08', NULL, '2025-12-31 09:29:55', '2025-12-31 09:31:08'),
(286, 'App\\Models\\User', 2, 'API Token', '4d276b8e81d5936db5dd31708ddacae4cab20f55011a73dfd8e4e7490806c169', '[\"*\"]', '2025-12-31 09:43:37', NULL, '2025-12-31 09:31:26', '2025-12-31 09:43:37'),
(287, 'App\\Models\\User', 40, 'API Token', '4a7e331372ce74ef9698d0a283f1e8725ea8a4261a774726dded74ecfe20fdad', '[\"*\"]', '2025-12-31 10:05:27', NULL, '2025-12-31 10:03:45', '2025-12-31 10:05:27'),
(288, 'App\\Models\\User', 41, 'API Token', '7ef73139391b1346c58e32c24c32b1452c9e33b66ea48cca02d28e7b4bfda64b', '[\"*\"]', '2025-12-31 10:57:01', NULL, '2025-12-31 10:06:10', '2025-12-31 10:57:01'),
(289, 'App\\Models\\User', 5, 'API Token', '849650cf2113f28ed3418480eff69710784af5cf7431b1e42836f84b24d62404', '[\"*\"]', '2026-01-02 05:01:33', NULL, '2025-12-31 10:58:08', '2026-01-02 05:01:33'),
(290, 'App\\Models\\User', 2, 'API Token', '4741449a23854219d236eca78e7689eae7081dff1fcd4a6678a7e7f45b74a3c9', '[\"*\"]', '2025-12-31 11:14:04', NULL, '2025-12-31 10:59:34', '2025-12-31 11:14:04'),
(291, 'App\\Models\\User', 2, 'API Token', 'a9c96249e846d06a182d3ddafa6ec090e052b38316e5601f7bad12afd9e41519', '[\"*\"]', '2026-01-02 05:01:47', NULL, '2026-01-01 21:48:34', '2026-01-02 05:01:47'),
(292, 'App\\Models\\User', 2, 'API Token', 'b0806832eb9ed58fd34558c81430e9ab609ab1d031a3fe64a9df8790b210c9a8', '[\"*\"]', '2026-01-02 09:06:05', NULL, '2026-01-02 05:02:10', '2026-01-02 09:06:05'),
(293, 'App\\Models\\User', 4, 'API Token', '20a9e535f6de88beea91eeb3f4d9b551e2b89aa0fd9f3bd2d9669a105d983ffe', '[\"*\"]', '2026-01-02 09:06:34', NULL, '2026-01-02 09:06:32', '2026-01-02 09:06:34'),
(294, 'App\\Models\\User', 5, 'API Token', '73cf6dc9476db8387813408d43c663a8079fd5f03ae7eace3da0fcc642a9f716', '[\"*\"]', '2026-01-02 09:53:05', NULL, '2026-01-02 09:07:58', '2026-01-02 09:53:05'),
(295, 'App\\Models\\User', 2, 'API Token', '937bc453e123668ce43f2e752d45b8e24985a87f3aa2accfd953597123f6e961', '[\"*\"]', '2026-01-02 09:53:23', NULL, '2026-01-02 09:08:47', '2026-01-02 09:53:23'),
(296, 'App\\Models\\User', 2, 'API Token', '1432768f299553e098b3609e4b1904178bf7b74abae1fbf1c14331c2e4cd05ee', '[\"*\"]', '2026-01-02 09:54:12', NULL, '2026-01-02 09:53:50', '2026-01-02 09:54:12'),
(297, 'App\\Models\\User', 5, 'API Token', '88720a99d711f5ff996260f0d8d3ab5aa81e20a72b59d8d12776bca3b433d3fe', '[\"*\"]', '2026-01-02 10:00:43', NULL, '2026-01-02 09:54:30', '2026-01-02 10:00:43');

-- --------------------------------------------------------

--
-- Table structure for table `profile_views`
--

CREATE TABLE `profile_views` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `alumni_id` bigint(20) UNSIGNED NOT NULL,
  `viewer_id` bigint(20) UNSIGNED NOT NULL,
  `viewed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `profile_views`
--

INSERT INTO `profile_views` (`id`, `alumni_id`, `viewer_id`, `viewed_at`, `created_at`, `updated_at`) VALUES
(1, 5, 2, '2026-01-02 09:08:57', '2026-01-02 09:08:57', '2026-01-02 09:08:57');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'alumni',
  `industry` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `logo` longtext DEFAULT NULL,
  `database_name` varchar(191) DEFAULT NULL,
  `database_created_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `last_seen_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `email_verified_at`, `password`, `role`, `industry`, `website`, `address`, `city`, `description`, `logo`, `database_name`, `database_created_at`, `remember_token`, `created_at`, `updated_at`, `last_seen_at`) VALUES
(2, 'PT. Pondok Mojosari', 'mojosari@example.com', '8993489304', NULL, '$2y$12$5dah1jfEbE0VJFZvHuBjtONhcY2NymgzRhtieQfHOZB4E.wuqdv16', 'company', 'Teknologi', 'https://smkalbasthomi.sch.id', 'Mojosari, Loceret', 'Nganjuk', 'Perusahaan terkemuka', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX///8ZGRkAAAAXFxcUFBQNDQ38/PwRERH19fUKCgrn5+f5+fny8vL39/fNzc3d3d2enp6mpqbQ0NB9fX3k5OSwsLCKiorCwsLs7OxOTk4qKirW1ta4uLhjY2Nubm41NTVJSUkrKyszMzM/Pz9ra2uTk5N2dnZWVlY7OzuYmJgiIiJsbGxNTU1bW1u+vr4eHh53VSHiAAAMcklEQVR4nO2dCXeiOhSA4RKWIIKoLIoobqBO1f//795NBAsq1r7Wgp5858y0teDkmuTuYSRJIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAT/G6vT9AiezGEVNj2E59LZdZsewpMxj02P4OnMJ0b/vXdiH5b9psfwZOJB0yN4Nr7f9Aieiyb9mzY9hidjjIk9cZoexROZ7MC3pNRuehxPozODDx9ncGc1PZJnYSq2GTqhFEdNj+RZDIDhS8HbqhsbFHkb2Za5bXokT2NPyXyCq1RreiBPYwq0NwmdtOlxPI8plWHW6yybHsfzmFIFIq2/bnocz0KbHnXA4ClcrbvSW25FG8jcY86pFCRB04N5ApoPMqFu/kP6flGU+QGyIseH00+a5GVvlbLRJGcOskx7zmcKY5J13mkv9qkqIwAz8/xa750WKuoYmaOoMAiG/DVN+ngfBzwoBGQyou/tWQbbhPa7+DbGgX4KyIHdcbHyLGn5FjZj6M8woriAKITCbtvxp9arm/4OhoT6lYC5mLA0nWTS9BB/goYa5nr+PkG1sxr6q1e2ix6QevlQwlksg2snr6tSJ/cmkKF/2D7EzspteqT/k+j+DDLARkuyGA5eNBGeqF8JKAMuUCuDcNBrerD/hx58KaBMY3alu5R2L1gaDr7ahAwFuM0fSoe99nJ2caZ/LSAu06KGMXg5bWPfW6PomlIV/+jqzMivD5evVhq+2IUoD5wVD/QOvTTzttNkDOepe7lyjV+REBI3cEfFS2TnDvMZC4fFDZNXy4NXJASfq5GUvUZUnRCA3fIjDYLh5w32q6UYvVxChagqMJvgrqwIX9Nn2WgOBfpycMh9tuDVTKIDuTmY77PYcY3uDhJ8jYz5b63+ZJ1xhYN/so/dfBWuDw2P+LuEY4XH8ynbcGvwJGkLwwUhu9I1w8NgBlTmy9a3Fq9U/DbdPfNJKaSnJfgPBp7vgTPSVbV6pWbveYClHJ1w9hIiokbpTmICqoITODqbc0gigNgASMC4vMXsqegc6GRibfqvEPBHgyOc0jL68ixMABBpobTCUMK5YdidHbCI3+8krd+LYQ/VZBEyQSkdikvRt1MY1txnZMwbgL21Wrd6FodpJSejZp+D7U5RZx7rvZYB17ywNHtxi9s0Qr1s5BVFryQnhlF0Z+zZyaNTj3Y0aq/3digLeNyB+nj6JQjyewmsrbS1Af+0JCHZdJwrpVmLtqGfDt4mCjbtTE1Zu1JWRqlVKjfJSvkOHQZhOmjjbqwGhPCdpdadlVNWdJAG/dhtXxZ1W5GQ7C7s3p0B2zEtC5hK0mjlBN9aBH9CZZiyIpckjLYjvT5J4UHlTpiwXmloXz3DqCZH1T1/VZO0vs/Ce6iXcET1sxVFV/0Dr+yS+K/G/TiaXxER8nh2e0QnR2GJi5r7nAE6q0kRTB4Htuky5dpK921CSzIWEu2h+vMVGetVzH0arp8s5q5PHzc1f0i0dTGevdClsfqFhOjpoTTd0310ipuP5YbbeWJhwpZXkbwo3O4vJXRhwb6kuYgItLYw7OHWi+I8tigk3H8lobXmSqWwpgr6s3OnjfYesRc4ztieLFjM/rCEDCeUrJI1VaFaF+60pabRPfoJ06DGGg3cwxKGQ7R+ciSNcy2lq0AvTEV7+m4cOR/aEBXkoxLiPpyhVF22YXVVgWQUXnhDhgot9MSD8aMSrnm2HzwfZDpaya511eTuAoHWtTNoUphb/KwsoT25ViETJ8AFqu49lNSJ1pJ7ldxf6qwq4LVlMxZo+ZydJXSlYQ+t5eAQmZe5KNYa7Zt7rxe5jrS4CvF5HVIHfdquZGMnl3CUS0g2G5bdHoyAlSxW64n9aRLYFmRG0Fx2pB69equ80ooua6sMpXExh4oSe6euxG7fW8djXrWQNx9J0pswv5vvtP1xCdcOaeE04D79QwG+xOqdop+RXqNpTHvip3HCRGV2Apif1vFX1WnCt7C8j6KYrH780eAfwkKFoQ291dkTr6kOGlEvY/FhjUEwfQLnajm06iyRZdv+Ejfekty1FnyeIzSfMLwR8WpbpdzucGMFN8c/jDIWfmBIK5qriRp7GLBlqR1SGHtXv4tmlZBTn7cm6tekFRSdo6gmiIqmblxjs6e5G2RNYRGVplFjvgBfn4qO8YZK8ENqT6pYm+ZVbQStwy7zWVrp5gR0VSgsOQb7aclSWhlfoCqoSbyKWdm4PVVwbVX6tCeTqNYZwZjhAKXla5YWqrNgwQaFkTfkH40Vtchx6/Q+nQ+t9PcVwVqKqT679StbpsyP2bcz1n+YZcz8lVt2IsItSGDTno33/zjAmPWk3NhfFtFxA7a0N6NrPqzSEwqdIchkfvWbGOVetsvPLgj9DVk9KuIG417mt8KlLDYGhIN2drl5GOOQhyOAHtAOayyCS1uPk+u1LqfP6Ey5BbuTvz9fyf+OYI9bDh2Ci7RMAGdro3U6LRLVyPK89bX7dXmlzEftcF2SAplX61J7rl2tyB1kY3octCb73WUCKqwG86WOD4B/8XnEFMCFvTBRcMddsbBKJQp5YEn8ETE7XgiDw/5KcZwp1lvKJXRBZ96ONSbVWfdgiUEJJcoDida/pIdqH2KM4m295gqj8FWtObhdJwV6KsClAJUjbCkllSJWS7w1B4hK+VRE+9tXmJsk/24CMk9h5OsvALWcndDyirei80SHAublOzVDDHRx2k3m7QL+QYc8vDPyFncin1zyLgaBpSQjr0Ix6ZLp2jusSUuCQgfopvisr0MJjZ1gI/LJUHbOFcXioxjRsqpx2Mwt/eDkG3WqK7g51qDeKxfZvFhDVBSxv2Eql02TUtgIF8r60tykXniet3VLVKm2rFeguO7SPJmk8L5nVLljwGV4viMCWjdRfbj3xn/IEO5Uh6LxqSuPJ2x42J5Y+82qlHmCugyMSWjSjm3o3ekPCvgxCwK+W7Su0ajw23L26u0OqnBJ25K6GIBS56pFfIUCWjVjcUos4bcX87KGm56ekaCtaHiRGvm/n6kElH0vuI54tLnKJpA3jfbRUSFww4LjNN8wosYSTWbDmjTc5SlaVn5hOUP4F13MDztXoqr5DEXZfDa9sR4tjAevPhxrxrykZktq1jivTXz2XV7OkIlWQh3nM43X3n4Qhja6rNyjWZzRR8KU5zI6lxG8c5sBqW4cnEJ997Xb5YN+8Vyl4Mgqbg2vUZ+cZ0RLziJW7EZ4xI33QELQhgsHm3eQQcOWwi67WsYU2AkLNonlMzFbeCTiZ+drdEI+Jz/gFpTOmu2q6e6qRt7ZZjtmGBT4fM0Yk8vGkZtorCNKlz0uUeiNeD1G3TXcYLqmV59w6KEBK0voPRz79PmJknE8naLS4SVfVWnYEpq3K54ulCTUZvrDLsmIcm+H0tNal2HctD+a6rc3CcYJ5+8PGBU/mvUcVg9+w0fTnW1WnattjT8LLTiFj4c+pSdoKOpnca4x3NqE2vLsf+EUjr+RCXSLp6BQ+LCbT5ImpGbs1vgcZWwe34UcJz0dnI3b0DVjQt2jHaPzwkRFqn9T3xv9yaTfjgRwUNv3kRZVC2tH2tUc8j22dRGvA0U0gCFjizoLvk1aJ2ECs5OOQBOub370bzQbVsQ1Xr9fNM5qGM//LPTpw7RJfZpBcutl1up6WpkDQAf1RyOMATYNujUZPV75HBrXnqeAhz0f6mcVFQffQYdBYxn9jN7ItrhMLG4rIkpkIv9I7a+BJ60a01UretUIqbFzPfqC+aHmQn2oEnyPSGeN7c09UJn1iFQXYcST9XxmjSXGCXT5o2eTauyIvtJgYY2dSy6LaJ7y9vwRJt0Nj/V+fn7AhwZbgkMWxcHe5lvNCqan81w6+x8PQp6y+ZV6itlkKpGfolBhEU//Zcf8CCjP1ke84e5eGeNFyM9hlYJy1O3okXrsWbrKGwio8b6ECir0JS1lYWxrG9K+hzWvnmuGjSk5Jx3zLv+f06nD9ZzM9zWpByrO39xtPDz/LcLp6Qgzq8ikjuQk7JFPmdeOAPaXiAa8bD3qmewgN8DebUljyK9i8XYDj862LTwi+Hv4vabTt88meOF0xReEJk9sjmmbjuv8Kqns8MiXQNq+B3X8BkPgeXv2uGBoSe/SL8PaEGBk84d2tut852+h8qDQt9Bb08dND+YpeCzuxVi3499u+XkD+gsAXmsa9t5Rz7Agqrsd28X378pbedq3ed/JEwgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBC/If78soxvQm2H9AAAAAElFTkSuQmCC', NULL, NULL, NULL, '2025-11-22 06:04:23', '2026-01-02 09:54:12', '2026-01-02 09:54:12'),
(4, 'Agus widodo', 'email@example.com', NULL, NULL, '$2y$12$fsUabd7W./9.qHERacVHruG1K8Tedk7vCf7LOeGx31tv8YtJE0Wim', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, 'admin_4_email', NULL, NULL, '2025-11-22 06:10:09', '2026-01-02 09:06:34', '2026-01-02 09:06:34'),
(5, 'Mahbub', 'demoexample@gmail.com', NULL, NULL, '$2y$12$FxVu5QPnXhgfxQktFD.mLu6KFs6zUla8tONrIkLnqMCjqf/9tnQuW', 'alumni', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-22 07:22:51', '2026-01-02 10:00:43', '2026-01-02 10:00:43'),
(11, 'Hamid', 'menz@gmail.com', NULL, NULL, '$2y$10$y4UEoonxImiJ3L6TX8c/i.djKlSsd7kGDMsW9m5MG0sw2CX8sy2RG', 'alumni', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-24 13:34:42', '2025-11-24 13:34:42', NULL),
(24, 'Super Admin', 'superadmin@example.com', NULL, NULL, '$2y$10$FkbH2g/qqMkJq.7lIm7FZ.b95ou4th67UiSjiETn45ThjbBIBSpwe', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, 'admin_24_superadmin', NULL, NULL, '2025-11-26 07:53:36', '2025-12-04 06:18:49', NULL),
(25, 'PT. Permadani', 'perma@gmail.com', NULL, NULL, '$2y$10$O4EzzdNns4Un6hO754oVluseflCSSdc28oRI9iAOzld2vllRbD/GO', 'company', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-27 04:28:11', '2025-11-27 04:28:11', NULL),
(27, 'Test User', 'testlogin@example.com', NULL, NULL, '$2y$12$12x.reAKV7ULltjJuGjEo.E2T6TSXYey567vKHhFFLFosIH9vRSvW', 'alumni', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-31 04:59:45', '2025-12-31 04:59:45', NULL),
(28, 'Alice Putri', 'alice.putri@example.com', NULL, NULL, '$2y$12$3sIGga3C/LnlzkZnX3UdFunib1vtvwGd8uDmZox6z3Ichk4NtVPsS', 'alumni', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-31 05:05:53', '2025-12-31 05:05:53', NULL),
(29, 'Budi Santoso', 'budi.s@example.com', NULL, NULL, '$2y$12$KCK1scUafLRDvAnHnOO4L.uxHfFhmK.eeUekkwQvjSs0YmxOOaD8K', 'alumni', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-31 05:05:53', '2025-12-31 05:05:53', NULL),
(30, 'Citra Dewi', 'citra.dewi@example.com', NULL, NULL, '$2y$12$JRyEPgQLeEyJqpqTv3pKYO6riIO7D2smuLoiN9VRLScKKiZTEH.qu', 'alumni', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-31 05:05:54', '2025-12-31 05:05:54', NULL),
(31, 'Dedi Pratama', 'dedi.p@example.com', NULL, NULL, '$2y$12$rUxA9abbZXh/R1n/lhcLNuJpmzkqqpgoi.R9.dakyJDj3HzIfO0xu', 'alumni', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-31 05:05:54', '2025-12-31 05:05:54', NULL),
(32, 'Eka Lestari', 'eka.l@example.com', NULL, NULL, '$2y$12$HoGwQRNGnWOKJvF4oME9s.KoOCaxBuiB4IXMO3FIo/DEiRxCVTr1q', 'alumni', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-31 05:05:54', '2025-12-31 05:05:54', NULL),
(33, 'Fajar Nugroho', 'fajar.n@example.com', NULL, NULL, '$2y$12$wgLm8CQhp4UsV/eQ2ia81eaCrAyrvTfPsJqTa98F5bpAdNgd2HSgG', 'alumni', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-31 05:05:55', '2025-12-31 05:05:55', NULL),
(34, 'Gita Maharani', 'gita.m@example.com', NULL, NULL, '$2y$12$KyjSXmSonl66cGhD4V8TyuWets.AX79f/xNw1GoEUt67kWkEd8wLm', 'alumni', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-31 05:05:55', '2025-12-31 05:05:55', NULL),
(35, 'Hadi Saputra', 'hadi.s@example.com', NULL, NULL, '$2y$12$wZp5dfUHLndaU/Z9zVTwBOeObASqpyts90k7XZDhCIONM2UhsLEmm', 'alumni', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-31 05:05:55', '2025-12-31 05:05:55', NULL),
(36, 'Indah Permata', 'indah.p@example.com', NULL, NULL, '$2y$12$/Z1dA7HzlhbXkRloU1qkeOsSIQXsLR7y7g82aNd1lqgXFcIEMF5N6', 'alumni', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-31 05:05:55', '2025-12-31 05:05:55', NULL),
(37, 'Joko Widodo', 'joko.w@example.com', NULL, NULL, '$2y$12$.6gbXSSFwaw1/xX6TMj4reTjKbKBYRrgEfD1IfQrMY94SCtdqLGu6', 'alumni', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-31 05:05:56', '2025-12-31 05:05:56', NULL),
(40, 'Albasthomi', 't1@gmail.com', NULL, NULL, '$2y$12$PKhKyvroaGCSzoflFY4HIOKZJO0rV/VdSgEf7p/7IHSme4dGFrpQ2', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, 'admin_40_t1', '2025-12-31 09:59:54', NULL, '2025-12-31 09:59:54', '2025-12-31 09:59:54', NULL),
(41, 'Mat khamdi', 't2@gmail.com', NULL, NULL, '$2y$12$rH96.oTh6Nvi3wGGqVOSFOff/lgYW/RlSq.mplOTR0GyjuVxU0zTW', 'alumni', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-31 10:05:26', '2025-12-31 10:52:47', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alumni`
--
ALTER TABLE `alumni`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `alumni_email_unique` (`email`),
  ADD UNIQUE KEY `alumni_nisn_unique` (`nisn`),
  ADD KEY `alumni_user_id_foreign` (`user_id`);

--
-- Indexes for table `application_documents`
--
ALTER TABLE `application_documents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `application_documents_application_id_document_id_unique` (`application_id`,`document_id`),
  ADD KEY `application_documents_document_id_foreign` (`document_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `documents_user_id_index` (`user_id`),
  ADD KEY `documents_created_at_index` (`created_at`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_applications`
--
ALTER TABLE `job_applications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `job_applications_job_posting_id_user_id_unique` (`job_posting_id`,`user_id`),
  ADD KEY `job_applications_job_posting_id_index` (`job_posting_id`),
  ADD KEY `job_applications_user_id_index` (`user_id`),
  ADD KEY `job_applications_alumni_id_index` (`alumni_id`),
  ADD KEY `job_applications_status_index` (`status`),
  ADD KEY `job_applications_created_at_index` (`created_at`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job_postings`
--
ALTER TABLE `job_postings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_postings_company_id_index` (`company_id`),
  ADD KEY `job_postings_status_index` (`status`),
  ADD KEY `job_postings_created_at_index` (`created_at`);

--
-- Indexes for table `job_views`
--
ALTER TABLE `job_views`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `job_views_job_posting_id_user_id_unique` (`job_posting_id`,`user_id`),
  ADD KEY `job_views_job_posting_id_index` (`job_posting_id`),
  ADD KEY `job_views_user_id_index` (`user_id`),
  ADD KEY `job_views_viewed_at_index` (`viewed_at`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_sender_id_foreign` (`sender_id`),
  ADD KEY `messages_receiver_id_foreign` (`receiver_id`),
  ADD KEY `messages_created_at_index` (`created_at`),
  ADD KEY `messages_is_read_index` (`is_read`),
  ADD KEY `messages_job_application_id_foreign` (`job_application_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `profile_views`
--
ALTER TABLE `profile_views`
  ADD PRIMARY KEY (`id`),
  ADD KEY `profile_views_viewer_id_foreign` (`viewer_id`),
  ADD KEY `profile_views_alumni_id_created_at_index` (`alumni_id`,`created_at`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alumni`
--
ALTER TABLE `alumni`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `application_documents`
--
ALTER TABLE `application_documents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `job_applications`
--
ALTER TABLE `job_applications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `job_postings`
--
ALTER TABLE `job_postings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `job_views`
--
ALTER TABLE `job_views`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=116;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=298;

--
-- AUTO_INCREMENT for table `profile_views`
--
ALTER TABLE `profile_views`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `application_documents`
--
ALTER TABLE `application_documents`
  ADD CONSTRAINT `application_documents_application_id_foreign` FOREIGN KEY (`application_id`) REFERENCES `job_applications` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `application_documents_document_id_foreign` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_applications`
--
ALTER TABLE `job_applications`
  ADD CONSTRAINT `job_applications_alumni_id_foreign` FOREIGN KEY (`alumni_id`) REFERENCES `alumni` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `job_applications_job_posting_id_foreign` FOREIGN KEY (`job_posting_id`) REFERENCES `job_postings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `job_applications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_postings`
--
ALTER TABLE `job_postings`
  ADD CONSTRAINT `job_postings_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_views`
--
ALTER TABLE `job_views`
  ADD CONSTRAINT `job_views_job_posting_id_foreign` FOREIGN KEY (`job_posting_id`) REFERENCES `job_postings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `job_views_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_job_application_id_foreign` FOREIGN KEY (`job_application_id`) REFERENCES `job_applications` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `messages_receiver_id_foreign` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `profile_views`
--
ALTER TABLE `profile_views`
  ADD CONSTRAINT `profile_views_alumni_id_foreign` FOREIGN KEY (`alumni_id`) REFERENCES `alumni` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `profile_views_viewer_id_foreign` FOREIGN KEY (`viewer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
