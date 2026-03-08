-- ============================================================
-- 6 catégories × 10 produits = 60 produits (WAMP / phpMyAdmin)
-- Images : format 600×600 cohérent pour un affichage parfait
-- Base : site_ecommerce (sélectionner avant d'exécuter)
-- ============================================================

INSERT IGNORE INTO `categories` (`name`, `slug`, `description`, `created_at`, `updated_at`) VALUES
('Périphériques', 'peripheriques', 'Claviers, souris, écrans, casques, webcams.', NOW(), NOW()),
('Composants', 'composants', 'SSD, RAM, cartes graphiques, processeurs.', NOW(), NOW()),
('Réseau', 'reseau', 'Routeurs, câbles, cartes Wi-Fi.', NOW(), NOW()),
('Ordinateurs portables', 'ordinateurs-portables', 'PC portables, ultrabooks, gaming.', NOW(), NOW()),
('Logiciels & Licences', 'logiciels-licences', 'OS, antivirus, logiciels créatifs.', NOW(), NOW()),
('Accessoires', 'accessoires', 'Sacs, supports, câbles, hubs USB.', NOW(), NOW());

SET @img = '?w=600&h=600&fit=crop';

-- Périphériques (10)
INSERT IGNORE INTO `products` (`category_id`, `name`, `slug`, `description`, `price`, `stock`, `image`, `is_active`, `created_at`, `updated_at`) VALUES
((SELECT id FROM categories WHERE slug = 'peripheriques' LIMIT 1), 'Clavier Mécanique RGB', 'clavier-mecanique-rgb', 'Clavier gaming avec switches Cherry MX, rétroéclairage RGB.', 129.99, 15, CONCAT('https://images.unsplash.com/photo-1511467687858-23d96c32e4ae', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'peripheriques' LIMIT 1), 'Écran 27" 144 Hz', 'ecran-27-144hz', 'Moniteur Full HD 144 Hz, 1 ms, FreeSync.', 249.99, 8, CONCAT('https://images.unsplash.com/photo-1527443224154-c4a3942d3acf', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'peripheriques' LIMIT 1), 'Casque Sans Fil Pro', 'casque-sans-fil-pro', 'Casque Bluetooth, réduction de bruit, 30 h d''autonomie.', 179.99, 22, CONCAT('https://images.unsplash.com/photo-1505740420928-5e560c06d30e', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'peripheriques' LIMIT 1), 'Webcam Full HD', 'webcam-full-hd', '1080p 60 fps, micro intégré.', 69.99, 30, CONCAT('https://images.unsplash.com/photo-1587826080692-f439cd0b70da', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'peripheriques' LIMIT 1), 'Souris Ergonomique', 'souris-ergonomique', 'Capteur 16000 DPI, 7 boutons programmables.', 49.99, 50, CONCAT('https://images.unsplash.com/photo-1527864550417-7fd91fc51a46', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'peripheriques' LIMIT 1), 'Clavier Sans Fil Compact', 'clavier-sans-fil-compact', 'Format compact, autonomie 6 mois, connexion USB.', 39.99, 40, CONCAT('https://images.unsplash.com/photo-1541140532154-b024d705b90a', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'peripheriques' LIMIT 1), 'Souris Gamer Légère', 'souris-gamer-legere', '58 g, capteur haute précision, câble paracord.', 59.99, 25, CONCAT('https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'peripheriques' LIMIT 1), 'Écran incurvé 32"', 'ecran-incurve-32', 'QHD 165 Hz, courbure 1000R, HDR.', 399.99, 12, CONCAT('https://images.unsplash.com/photo-1527443224154-c4a3942d3acf', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'peripheriques' LIMIT 1), 'Casque Gaming 7.1', 'casque-gaming-71', 'Son surround virtuel, micro détachable, RGB.', 89.99, 18, CONCAT('https://images.unsplash.com/photo-1618366712010-4d9dc10f8f6c', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'peripheriques' LIMIT 1), 'Enceintes 2.0 Stéréo', 'enceintes-stereo-20', 'Bois, 20 W, entrée jack et USB.', 79.99, 20, CONCAT('https://images.unsplash.com/photo-1545454670-5ec2a6456f63', @img), 1, NOW(), NOW());

-- Composants (10)
INSERT IGNORE INTO `products` (`category_id`, `name`, `slug`, `description`, `price`, `stock`, `image`, `is_active`, `created_at`, `updated_at`) VALUES
((SELECT id FROM categories WHERE slug = 'composants' LIMIT 1), 'SSD NVMe 1 To', 'ssd-nvme-1to', 'Stockage ultra-rapide, lecture 3500 Mo/s, M.2.', 89.99, 45, CONCAT('https://images.unsplash.com/photo-1597872200969-2b65d565bd41', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'composants' LIMIT 1), 'Barrette RAM 16 Go DDR5', 'ram-16go-ddr5', 'DDR5 5600 MHz, dual channel.', 79.99, 35, CONCAT('https://images.unsplash.com/photo-1562976540-1502c2145186', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'composants' LIMIT 1), 'Carte graphique RTX 4060', 'carte-graphique-rtx-4060', '8 Go GDDR6, ray tracing, DLSS 3.', 329.99, 10, CONCAT('https://images.unsplash.com/photo-1591488320449-011701bb6704', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'composants' LIMIT 1), 'Processeur Intel Core i5', 'processeur-intel-core-i5', '14e gen, 6 cœurs, 4,7 GHz.', 249.99, 25, CONCAT('https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'composants' LIMIT 1), 'Ventilateur CPU 120 mm', 'ventilateur-cpu-120mm', 'Tower, 4 caloducs, RGB.', 44.99, 40, CONCAT('https://images.unsplash.com/photo-1587202372775-e229f172b9d7', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'composants' LIMIT 1), 'Carte mère B760', 'carte-mere-b760', 'DDR5, PCIe 4.0, Wi-Fi intégré.', 159.99, 14, CONCAT('https://images.unsplash.com/photo-1518770660439-4636190af475', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'composants' LIMIT 1), 'Alimentation 650 W 80+ Bronze', 'alimentation-650w-bronze', 'Modulaire, silencieuse, 5 ans garantie.', 69.99, 30, CONCAT('https://images.unsplash.com/photo-1558618666-fcd25c85cd64', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'composants' LIMIT 1), 'SSD SATA 500 Go', 'ssd-sata-500go', '2,5 pouces, 550 Mo/s lecture.', 45.99, 55, CONCAT('https://images.unsplash.com/photo-1597872200969-2b65d565bd41', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'composants' LIMIT 1), 'Kit RAM 32 Go DDR4', 'kit-ram-32go-ddr4', '2×16 Go 3200 MHz, basse latence.', 99.99, 28, CONCAT('https://images.unsplash.com/photo-1562976540-1502c2145186', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'composants' LIMIT 1), 'Carte graphique RX 7600', 'carte-graphique-rx-7600', '8 Go GDDR6, RDNA 3, FSR.', 279.99, 11, CONCAT('https://images.unsplash.com/photo-1591488320449-011701bb6704', @img), 1, NOW(), NOW());

-- Réseau (10)
INSERT IGNORE INTO `products` (`category_id`, `name`, `slug`, `description`, `price`, `stock`, `image`, `is_active`, `created_at`, `updated_at`) VALUES
((SELECT id FROM categories WHERE slug = 'reseau' LIMIT 1), 'Routeur Wi-Fi 6', 'routeur-wifi-6', 'Dual band, 3000 Mbit/s.', 119.99, 12, CONCAT('https://images.unsplash.com/photo-1606904825846-647eb07f5be2', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'reseau' LIMIT 1), 'Câble Ethernet Cat 6', 'cable-ethernet-cat6', '5 mètres, blindé, 1 Gbit/s.', 12.99, 80, CONCAT('https://images.unsplash.com/photo-1558618666-fcd25c85cd64', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'reseau' LIMIT 1), 'Switch Gigabit 8 ports', 'switch-gigabit-8ports', 'Non managé, rack 19".', 34.99, 22, CONCAT('https://images.unsplash.com/photo-1606904825846-647eb07f5be2', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'reseau' LIMIT 1), 'Carte Wi-Fi 6 PCIe', 'carte-wifi-6-pcie', 'AX3000, antennes détachables.', 42.99, 19, CONCAT('https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'reseau' LIMIT 1), 'Câble Ethernet Cat 7', 'cable-ethernet-cat7', '10 Gbit/s, 2 mètres.', 18.99, 45, CONCAT('https://images.unsplash.com/photo-1558618666-fcd25c85cd64', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'reseau' LIMIT 1), 'Répetiteur Wi-Fi Mesh', 'repetiteur-wifi-mesh', 'Couverture étendue, 2 unités.', 89.99, 15, CONCAT('https://images.unsplash.com/photo-1606904825846-647eb07f5be2', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'reseau' LIMIT 1), 'Adaptateur CPL 1200 Mbit/s', 'adaptateur-cpl-1200', 'Paire, prise passante.', 54.99, 20, CONCAT('https://images.unsplash.com/photo-1558618666-fcd25c85cd64', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'reseau' LIMIT 1), 'Routeur 4G LTE', 'routeur-4g-lte', 'Sim incluse, batterie de secours.', 129.99, 8, CONCAT('https://images.unsplash.com/photo-1606904825846-647eb07f5be2', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'reseau' LIMIT 1), 'Patch cord 1 m bleu', 'patch-cord-1m-bleu', 'Cat 6, RJ45, qualité bureau.', 4.99, 120, CONCAT('https://images.unsplash.com/photo-1558618666-fcd25c85cd64', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'reseau' LIMIT 1), 'Antenne Wi-Fi externe', 'antenne-wifi-externe', '9 dBi, gain élevé, câble 1,5 m.', 24.99, 35, CONCAT('https://images.unsplash.com/photo-1606904825846-647eb07f5be2', @img), 1, NOW(), NOW());

-- Ordinateurs portables (10)
INSERT IGNORE INTO `products` (`category_id`, `name`, `slug`, `description`, `price`, `stock`, `image`, `is_active`, `created_at`, `updated_at`) VALUES
((SELECT id FROM categories WHERE slug = 'ordinateurs-portables' LIMIT 1), 'Ultrabook 14"', 'ultrabook-14', 'Intel Core i7, 16 Go RAM, 512 Go SSD, écran Full HD.', 899.99, 7, CONCAT('https://images.unsplash.com/photo-1496181133206-80ce9b88a853', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'ordinateurs-portables' LIMIT 1), 'PC Portable Gamer 15"', 'pc-portable-gamer-15', 'RTX 4050, 16 Go RAM, 1 To SSD, 165 Hz.', 1299.99, 5, CONCAT('https://images.unsplash.com/photo-1603302576837-37561b2e2302', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'ordinateurs-portables' LIMIT 1), 'Portable 17" travail', 'portable-17-travail', 'i5, 8 Go, 256 Go SSD, numpad.', 649.99, 11, CONCAT('https://images.unsplash.com/photo-1588872657578-7efd1f1555ed', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'ordinateurs-portables' LIMIT 1), 'Chromebook 13"', 'chromebook-13', 'Éducation et bureautique, 64 Go eMMC.', 299.99, 24, CONCAT('https://images.unsplash.com/photo-1517336714731-489689fd1ca8', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'ordinateurs-portables' LIMIT 1), 'Portable créatif 16"', 'portable-creatif-16', 'Écran 2,5K 120 Hz, i7, 32 Go, 1 To.', 1599.99, 4, CONCAT('https://images.unsplash.com/photo-1496181133206-80ce9b88a853', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'ordinateurs-portables' LIMIT 1), 'Portable entrée de gamme', 'portable-entree-gamme', 'Ryzen 5, 8 Go, 256 Go SSD, 15,6".', 449.99, 16, CONCAT('https://images.unsplash.com/photo-1588872657578-7efd1f1555ed', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'ordinateurs-portables' LIMIT 1), 'Gaming 17" RTX 4070', 'gaming-17-rtx-4070', 'i9, 32 Go, 1 To NVMe, QHD 240 Hz.', 2199.99, 3, CONCAT('https://images.unsplash.com/photo-1603302576837-37561b2e2302', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'ordinateurs-portables' LIMIT 1), 'Convertible 2-en-1', 'convertible-2-en-1', 'Tactile, stylet inclus, 12,3".', 749.99, 9, CONCAT('https://images.unsplash.com/photo-1517336714731-489689fd1ca8', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'ordinateurs-portables' LIMIT 1), 'Portable 14" AMD', 'portable-14-amd', 'Ryzen 7, 16 Go, 512 Go, Full HD.', 699.99, 13, CONCAT('https://images.unsplash.com/photo-1588872657578-7efd1f1555ed', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'ordinateurs-portables' LIMIT 1), 'Mini PC portable', 'mini-pc-portable', 'Format compact, N100, 8 Go, 128 Go.', 279.99, 18, CONCAT('https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89', @img), 1, NOW(), NOW());

-- Logiciels & Licences (10)
INSERT IGNORE INTO `products` (`category_id`, `name`, `slug`, `description`, `price`, `stock`, `image`, `is_active`, `created_at`, `updated_at`) VALUES
((SELECT id FROM categories WHERE slug = 'logiciels-licences' LIMIT 1), 'Licence Windows 11 Famille', 'licence-windows-11-famille', 'Clé numérique, téléchargement officiel Microsoft.', 145.00, 100, CONCAT('https://images.unsplash.com/photo-1555617981-dac3880eac6e', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'logiciels-licences' LIMIT 1), 'Antivirus 1 an', 'antivirus-1an', 'Protection complète, 3 appareils.', 29.99, 200, CONCAT('https://images.unsplash.com/photo-1563986768609-322da13575f3', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'logiciels-licences' LIMIT 1), 'Office 365 Famille 1 an', 'office-365-famille-1an', 'Word, Excel, PowerPoint, 6 utilisateurs.', 99.99, 80, CONCAT('https://images.unsplash.com/photo-1586281380349-632531db7ed4', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'logiciels-licences' LIMIT 1), 'VPN 2 ans', 'vpn-2-ans', 'Serveurs monde entier, 5 appareils.', 59.99, 150, CONCAT('https://images.unsplash.com/photo-1558494949-ef010cbdcc31', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'logiciels-licences' LIMIT 1), 'Suite créative 1 mois', 'suite-creative-1-mois', 'Photoshop, Illustrator, InDesign.', 59.99, 999, CONCAT('https://images.unsplash.com/photo-1611162617474-5b21e879e113', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'logiciels-licences' LIMIT 1), 'Windows 11 Pro', 'windows-11-pro', 'Licence Pro, mise à jour incluse.', 189.00, 60, CONCAT('https://images.unsplash.com/photo-1555617981-dac3880eac6e', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'logiciels-licences' LIMIT 1), 'Stockage cloud 1 To', 'stockage-cloud-1to', '1 an, synchronisation multi-appareils.', 79.99, 200, CONCAT('https://images.unsplash.com/photo-1544197150-b99a580bb7a8', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'logiciels-licences' LIMIT 1), 'Logiciel gravure', 'logiciel-gravure', 'Licence à vie, Blu-ray et DVD.', 49.99, 45, CONCAT('https://images.unsplash.com/photo-1516035069371-29a1b244cc32', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'logiciels-licences' LIMIT 1), 'Antivirus Pro 3 ans', 'antivirus-pro-3-ans', '5 appareils, pare-feu, VPN inclus.', 69.99, 90, CONCAT('https://images.unsplash.com/photo-1563986768609-322da13575f3', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'logiciels-licences' LIMIT 1), 'Licence Windows 10 Pro', 'licence-windows-10-pro', 'Mise à jour vers Windows 11 possible.', 139.00, 70, CONCAT('https://images.unsplash.com/photo-1555617981-dac3880eac6e', @img), 1, NOW(), NOW());

-- Accessoires (10)
INSERT IGNORE INTO `products` (`category_id`, `name`, `slug`, `description`, `price`, `stock`, `image`, `is_active`, `created_at`, `updated_at`) VALUES
((SELECT id FROM categories WHERE slug = 'accessoires' LIMIT 1), 'Hub USB-C 7-en-1', 'hub-usb-c-7-en-1', 'HDMI, USB 3.0, SD, 100 W PD.', 45.99, 28, CONCAT('https://images.unsplash.com/photo-1625723044792-44de16ccb4e9', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'accessoires' LIMIT 1), 'Support écran bras articulé', 'support-ecran-bras', 'Jusqu''à 27", réglable hauteur et orientation.', 89.99, 18, CONCAT('https://images.unsplash.com/photo-1527443224154-c4a3942d3acf', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'accessoires' LIMIT 1), 'Sac à dos ordinateur 15"', 'sac-dos-ordi-15', 'Compartiment laptop, port USB.', 54.99, 32, CONCAT('https://images.unsplash.com/photo-1553062407-98eeb64c6a62', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'accessoires' LIMIT 1), 'Tapis de souris XXL', 'tapis-souris-xxl', '900×400 mm, bordure tissée.', 24.99, 40, CONCAT('https://images.unsplash.com/photo-1527864550417-7fd91fc51a46', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'accessoires' LIMIT 1), 'Support laptop ventilé', 'support-laptop-ventile', '5 ventilateurs USB, réglable.', 39.99, 25, CONCAT('https://images.unsplash.com/photo-1496181133206-80ce9b88a853', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'accessoires' LIMIT 1), 'Câble HDMI 2.1 2 m', 'cable-hdmi-21-2m', '8K 60 Hz, compatible PS5 et Xbox.', 19.99, 65, CONCAT('https://images.unsplash.com/photo-1558618666-fcd25c85cd64', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'accessoires' LIMIT 1), 'Station d''accueil USB-C', 'station-accueil-usbc', '2 écrans, 85 W, Ethernet, SD.', 199.99, 10, CONCAT('https://images.unsplash.com/photo-1625723044792-44de16ccb4e9', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'accessoires' LIMIT 1), 'Webcam avec cache', 'webcam-avec-cache', '1080p + cache physique confidentialité.', 34.99, 38, CONCAT('https://images.unsplash.com/photo-1587826080692-f439cd0b70da', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'accessoires' LIMIT 1), 'Pied micro bureau', 'pied-micro-bureau', 'Avec filtre anti-pop, câble 2 m.', 29.99, 42, CONCAT('https://images.unsplash.com/photo-1590602847861-f357a9332bbc', @img), 1, NOW(), NOW()),
((SELECT id FROM categories WHERE slug = 'accessoires' LIMIT 1), 'Organisateur câbles', 'organisateur-cables', 'Bac bureau, 3 compartiments.', 14.99, 55, CONCAT('https://images.unsplash.com/photo-1558618666-fcd25c85cd64', @img), 1, NOW(), NOW());
