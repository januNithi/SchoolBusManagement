-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Erstellungszeit: 09. Dez 2016 um 11:18
-- Server-Version: 10.1.9-MariaDB
-- PHP-Version: 5.6.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `schoolbus`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `bus`
--

CREATE TABLE `bus` (
  `id` int(11) NOT NULL,
  `regNo` varchar(20) COLLATE latin1_general_ci NOT NULL,
  `busCode` varchar(10) COLLATE latin1_general_ci NOT NULL,
  `gpsUnit` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- Daten für Tabelle `bus`
--

INSERT INTO `bus` (`id`, `regNo`, `busCode`, `gpsUnit`) VALUES
(1, '16Bus1', '16B01', 100);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `device_geofence`
--

CREATE TABLE `device_geofence` (
  `deviceid` int(11) NOT NULL,
  `geofenceid` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `drivers`
--

CREATE TABLE `drivers` (
  `id` int(11) NOT NULL,
  `drvName` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `drvLicence` longblob NOT NULL,
  `drvMob` varchar(15) COLLATE latin1_general_ci NOT NULL,
  `drvPhoto` blob NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `type` varchar(128) COLLATE latin1_general_ci NOT NULL,
  `servertime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deviceid` int(11) DEFAULT NULL,
  `positionid` int(11) DEFAULT NULL,
  `geofenceid` int(11) DEFAULT NULL,
  `attributes` varchar(4096) COLLATE latin1_general_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `geofences`
--

CREATE TABLE `geofences` (
  `id` int(11) NOT NULL,
  `name` varchar(128) COLLATE latin1_general_ci NOT NULL,
  `description` varchar(128) COLLATE latin1_general_ci DEFAULT NULL,
  `area` varchar(4096) COLLATE latin1_general_ci NOT NULL,
  `attributes` varchar(4096) COLLATE latin1_general_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `gpsunit`
--

CREATE TABLE `gpsunit` (
  `id` int(11) NOT NULL,
  `unitName` varchar(50) COLLATE latin1_general_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `positions`
--

CREATE TABLE `positions` (
  `id` int(11) NOT NULL,
  `protocol` varchar(128) COLLATE latin1_general_ci DEFAULT NULL,
  `deviceid` int(11) NOT NULL,
  `servertime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `devicetime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `fixtime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `valid` bit(1) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `altitude` float NOT NULL,
  `speed` float NOT NULL,
  `course` float NOT NULL,
  `address` varchar(512) COLLATE latin1_general_ci DEFAULT NULL,
  `attributes` varchar(4096) COLLATE latin1_general_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `routes`
--

CREATE TABLE `routes` (
  `id` int(11) NOT NULL,
  `rtName` varchar(50) COLLATE latin1_general_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `server`
--

CREATE TABLE `server` (
  `id` int(11) NOT NULL,
  `registration` bit(1) NOT NULL DEFAULT b'1',
  `latitude` double NOT NULL DEFAULT '0',
  `longitude` double NOT NULL DEFAULT '0',
  `zoom` int(11) NOT NULL DEFAULT '0',
  `map` varchar(128) COLLATE latin1_general_ci DEFAULT NULL,
  `distanceunit` varchar(128) COLLATE latin1_general_ci DEFAULT NULL,
  `speedunit` varchar(128) COLLATE latin1_general_ci DEFAULT NULL,
  `bingkey` varchar(128) COLLATE latin1_general_ci DEFAULT NULL,
  `mapurl` varchar(128) COLLATE latin1_general_ci DEFAULT NULL,
  `readonly` bit(1) NOT NULL DEFAULT b'0',
  `twelvehourformat` bit(1) NOT NULL DEFAULT b'0',
  `attributes` varchar(4096) COLLATE latin1_general_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- Daten für Tabelle `server`
--

INSERT INTO `server` (`id`, `registration`, `latitude`, `longitude`, `zoom`, `map`, `distanceunit`, `speedunit`, `bingkey`, `mapurl`, `readonly`, `twelvehourformat`, `attributes`) VALUES
(1, b'1', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, b'0', b'0', NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `stops`
--

CREATE TABLE `stops` (
  `id` int(11) NOT NULL,
  `stpName` varchar(100) COLLATE latin1_general_ci NOT NULL,
  `stpPosition` varchar(200) COLLATE latin1_general_ci NOT NULL,
  `stpTime` datetime NOT NULL,
  `rtId` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `trips`
--

CREATE TABLE `trips` (
  `id` int(11) NOT NULL,
  `trpName` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `trpSession` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `trpStart` datetime NOT NULL,
  `trpEnd` datetime NOT NULL,
  `rtId` int(11) NOT NULL,
  `busId` int(11) NOT NULL,
  `drvId` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `userId` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `pwd` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `usrType` varchar(10) COLLATE latin1_general_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user_student`
--

CREATE TABLE `user_student` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `studId` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `bus`
--


CREATE TABLE `user_geofence` (
  `userid` int(11) NOT NULL,
  `geofenceid` int(11) NOT NULL,
  KEY `fk_user_geofence_userid` (`userid`),
  KEY `fk_user_geofence_geofenceid` (`geofenceid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- Dumping data for table `user_geofence`
--

INSERT INTO `user_geofence` (`userid`, `geofenceid`) VALUES
(2, 14),
(2, 14);



CREATE TABLE `group_geofence` (
  `groupid` int(11) NOT NULL,
  `geofenceid` int(11) NOT NULL,
  KEY `fk_group_geofence_groupid` (`groupid`),
  KEY `fk_group_geofence_geofenceid` (`geofenceid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;


ALTER TABLE `bus`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `device_geofence`
--
ALTER TABLE `device_geofence`
  ADD KEY `fk_user_device_geofence_deviceid` (`deviceid`),
  ADD KEY `fk_user_device_geofence_geofenceid` (`geofenceid`);

--
-- Indizes für die Tabelle `drivers`
--
ALTER TABLE `drivers`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_event_deviceid` (`deviceid`);

--
-- Indizes für die Tabelle `geofences`
--
ALTER TABLE `geofences`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `gpsunit`
--
ALTER TABLE `gpsunit`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `positions`
--
ALTER TABLE `positions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `position_deviceid_fixtime` (`deviceid`,`fixtime`);

--
-- Indizes für die Tabelle `routes`
--
ALTER TABLE `routes`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `server`
--
ALTER TABLE `server`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `stops`
--
ALTER TABLE `stops`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `trips`
--
ALTER TABLE `trips`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `user_student`
--
ALTER TABLE `user_student`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `bus`
--
ALTER TABLE `bus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;
--
-- AUTO_INCREMENT für Tabelle `drivers`
--
ALTER TABLE `drivers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `geofences`
--
ALTER TABLE `geofences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `gpsunit`
--
ALTER TABLE `gpsunit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `positions`
--
ALTER TABLE `positions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `routes`
--
ALTER TABLE `routes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `server`
--
ALTER TABLE `server`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT für Tabelle `stops`
--
ALTER TABLE `stops`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `trips`
--
ALTER TABLE `trips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT für Tabelle `user_student`
--
ALTER TABLE `user_student`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
