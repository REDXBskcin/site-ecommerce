<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /** Format d'image cohérent : carré 600×600, bien affiché sur les cartes produit */
    private const IMG = '?w=600&h=600&fit=crop';

    public function run(): void
    {
        $cats = [
            'peripheriques' => Category::where('slug', 'peripheriques')->first(),
            'composants' => Category::where('slug', 'composants')->first(),
            'reseau' => Category::where('slug', 'reseau')->first(),
            'ordinateurs-portables' => Category::where('slug', 'ordinateurs-portables')->first(),
            'logiciels-licences' => Category::where('slug', 'logiciels-licences')->first(),
            'accessoires' => Category::where('slug', 'accessoires')->first(),
        ];
        if (!$cats['peripheriques'] || !$cats['composants']) return;

        $products = $this->getProducts($cats);
        foreach ($products as $p) {
            Product::firstOrCreate(['slug' => $p['slug']], array_merge($p, ['is_active' => true]));
        }
    }

    private function getProducts(array $cats): array
    {
        $img = self::IMG;
        $products = [];

        // ---------- Périphériques (10) ----------
        $cid = $cats['peripheriques']->id;
        $products[] = ['category_id' => $cid, 'name' => 'Clavier Mécanique RGB', 'slug' => 'clavier-mecanique-rgb', 'description' => 'Clavier gaming avec switches Cherry MX, rétroéclairage RGB.', 'price' => 129.99, 'stock' => 15, 'image' => "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae{$img}"];
        $products[] = ['category_id' => $cid, 'name' => 'Écran 27" 144 Hz', 'slug' => 'ecran-27-144hz', 'description' => 'Moniteur Full HD 144 Hz, 1 ms, FreeSync.', 'price' => 249.99, 'stock' => 8, 'image' => "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf{$img}"];
        $products[] = ['category_id' => $cid, 'name' => 'Casque Sans Fil Pro', 'slug' => 'casque-sans-fil-pro', 'description' => 'Casque Bluetooth, réduction de bruit, 30 h d\'autonomie.', 'price' => 179.99, 'stock' => 22, 'image' => "https://images.unsplash.com/photo-1505740420928-5e560c06d30e{$img}"];
        $products[] = ['category_id' => $cid, 'name' => 'Webcam Full HD', 'slug' => 'webcam-full-hd', 'description' => '1080p 60 fps, micro intégré.', 'price' => 69.99, 'stock' => 30, 'image' => "https://images.unsplash.com/photo-1587826080692-f439cd0b70da{$img}"];
        $products[] = ['category_id' => $cid, 'name' => 'Souris Ergonomique', 'slug' => 'souris-ergonomique', 'description' => 'Capteur 16000 DPI, 7 boutons programmables.', 'price' => 49.99, 'stock' => 50, 'image' => "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46{$img}"];
        $products[] = ['category_id' => $cid, 'name' => 'Clavier Sans Fil Compact', 'slug' => 'clavier-sans-fil-compact', 'description' => 'Format compact, autonomie 6 mois, connexion USB.', 'price' => 39.99, 'stock' => 40, 'image' => "https://images.unsplash.com/photo-1541140532154-b024d705b90a{$img}"];
        $products[] = ['category_id' => $cid, 'name' => 'Souris Gamer Légère', 'slug' => 'souris-gamer-legere', 'description' => '58 g, capteur haute précision, câble paracord.', 'price' => 59.99, 'stock' => 25, 'image' => "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7{$img}"];
        $products[] = ['category_id' => $cid, 'name' => 'Écran incurvé 32"', 'slug' => 'ecran-incurve-32', 'description' => 'QHD 165 Hz, courbure 1000R, HDR.', 'price' => 399.99, 'stock' => 12, 'image' => "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf{$img}"];
        $products[] = ['category_id' => $cid, 'name' => 'Casque Gaming 7.1', 'slug' => 'casque-gaming-71', 'description' => 'Son surround virtuel, micro détachable, RGB.', 'price' => 89.99, 'stock' => 18, 'image' => "https://images.unsplash.com/photo-1618366712010-4d9dc10f8f6c{$img}"];
        $products[] = ['category_id' => $cid, 'name' => 'Enceintes 2.0 Stéréo', 'slug' => 'enceintes-stereo-20', 'description' => 'Bois, 20 W, entrée jack et USB.', 'price' => 79.99, 'stock' => 20, 'image' => "https://images.unsplash.com/photo-1545454670-5ec2a6456f63{$img}"];

        // ---------- Composants (10) ----------
        $cid = $cats['composants']->id;
        $products[] = ['category_id' => $cid, 'name' => 'SSD NVMe 1 To', 'slug' => 'ssd-nvme-1to', 'description' => 'Stockage ultra-rapide, lecture 3500 Mo/s, M.2.', 'price' => 89.99, 'stock' => 45, 'image' => "https://images.unsplash.com/photo-1597872200969-2b65d565bd41{$img}"];
        $products[] = ['category_id' => $cid, 'name' => 'Barrette RAM 16 Go DDR5', 'slug' => 'ram-16go-ddr5', 'description' => 'DDR5 5600 MHz, dual channel.', 'price' => 79.99, 'stock' => 35, 'image' => "https://images.unsplash.com/photo-1562976540-1502c2145186{$img}"];
        $products[] = ['category_id' => $cid, 'name' => 'Carte graphique RTX 4060', 'slug' => 'carte-graphique-rtx-4060', 'description' => '8 Go GDDR6, ray tracing, DLSS 3.', 'price' => 329.99, 'stock' => 10, 'image' => "https://images.unsplash.com/photo-1591488320449-011701bb6704{$img}"];
        $products[] = ['category_id' => $cid, 'name' => 'Processeur Intel Core i5', 'slug' => 'processeur-intel-core-i5', 'description' => '14e gen, 6 cœurs, 4,7 GHz.', 'price' => 249.99, 'stock' => 25, 'image' => "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea{$img}"];
        $products[] = ['category_id' => $cid, 'name' => 'Ventilateur CPU 120 mm', 'slug' => 'ventilateur-cpu-120mm', 'description' => 'Tower, 4 caloducs, RGB.', 'price' => 44.99, 'stock' => 40, 'image' => "https://images.unsplash.com/photo-1587202372775-e229f172b9d7{$img}"];
        $products[] = ['category_id' => $cid, 'name' => 'Carte mère B760', 'slug' => 'carte-mere-b760', 'description' => 'DDR5, PCIe 4.0, Wi-Fi intégré.', 'price' => 159.99, 'stock' => 14, 'image' => "https://images.unsplash.com/photo-1518770660439-4636190af475{$img}"];
        $products[] = ['category_id' => $cid, 'name' => 'Alimentation 650 W 80+ Bronze', 'slug' => 'alimentation-650w-bronze', 'description' => 'Modulaire, silencieuse, 5 ans garantie.', 'price' => 69.99, 'stock' => 30, 'image' => "https://images.unsplash.com/photo-1558618666-fcd25c85cd64{$img}"];
        $products[] = ['category_id' => $cid, 'name' => 'SSD SATA 500 Go', 'slug' => 'ssd-sata-500go', 'description' => '2,5 pouces, 550 Mo/s lecture.', 'price' => 45.99, 'stock' => 55, 'image' => "https://images.unsplash.com/photo-1597872200969-2b65d565bd41{$img}"];
        $products[] = ['category_id' => $cid, 'name' => 'Kit RAM 32 Go DDR4', 'slug' => 'kit-ram-32go-ddr4', 'description' => '2×16 Go 3200 MHz, basse latence.', 'price' => 99.99, 'stock' => 28, 'image' => "https://images.unsplash.com/photo-1562976540-1502c2145186{$img}"];
        $products[] = ['category_id' => $cid, 'name' => 'Carte graphique RX 7600', 'slug' => 'carte-graphique-rx-7600', 'description' => '8 Go GDDR6, RDNA 3, FSR.', 'price' => 279.99, 'stock' => 11, 'image' => "https://images.unsplash.com/photo-1591488320449-011701bb6704{$img}"];

        // ---------- Réseau (10) ----------
        $cid = $cats['reseau']->id ?? null;
        if ($cid) {
            $products[] = ['category_id' => $cid, 'name' => 'Routeur Wi-Fi 6', 'slug' => 'routeur-wifi-6', 'description' => 'Dual band, 3000 Mbit/s.', 'price' => 119.99, 'stock' => 12, 'image' => "https://images.unsplash.com/photo-1606904825846-647eb07f5be2{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Câble Ethernet Cat 6', 'slug' => 'cable-ethernet-cat6', 'description' => '5 mètres, blindé, 1 Gbit/s.', 'price' => 12.99, 'stock' => 80, 'image' => "https://images.unsplash.com/photo-1558618666-fcd25c85cd64{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Switch Gigabit 8 ports', 'slug' => 'switch-gigabit-8ports', 'description' => 'Non managé, rack 19".', 'price' => 34.99, 'stock' => 22, 'image' => "https://images.unsplash.com/photo-1606904825846-647eb07f5be2{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Carte Wi-Fi 6 PCIe', 'slug' => 'carte-wifi-6-pcie', 'description' => 'AX3000, antennes détachables.', 'price' => 42.99, 'stock' => 19, 'image' => "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Câble Ethernet Cat 7', 'slug' => 'cable-ethernet-cat7', 'description' => '10 Gbit/s, 2 mètres.', 'price' => 18.99, 'stock' => 45, 'image' => "https://images.unsplash.com/photo-1558618666-fcd25c85cd64{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Répetiteur Wi-Fi Mesh', 'slug' => 'repetiteur-wifi-mesh', 'description' => 'Couverture étendue, 2 unités.', 'price' => 89.99, 'stock' => 15, 'image' => "https://images.unsplash.com/photo-1606904825846-647eb07f5be2{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Adaptateur CPL 1200 Mbit/s', 'slug' => 'adaptateur-cpl-1200', 'description' => 'Paire, prise passante.', 'price' => 54.99, 'stock' => 20, 'image' => "https://images.unsplash.com/photo-1558618666-fcd25c85cd64{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Routeur 4G LTE', 'slug' => 'routeur-4g-lte', 'description' => 'Sim incluse, batterie de secours.', 'price' => 129.99, 'stock' => 8, 'image' => "https://images.unsplash.com/photo-1606904825846-647eb07f5be2{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Patch cord 1 m bleu', 'slug' => 'patch-cord-1m-bleu', 'description' => 'Cat 6, RJ45, qualité bureau.', 'price' => 4.99, 'stock' => 120, 'image' => "https://images.unsplash.com/photo-1558618666-fcd25c85cd64{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Antenne Wi-Fi externe', 'slug' => 'antenne-wifi-externe', 'description' => '9 dBi, gain élevé, câble 1,5 m.', 'price' => 24.99, 'stock' => 35, 'image' => "https://images.unsplash.com/photo-1606904825846-647eb07f5be2{$img}"];
        }

        // ---------- Ordinateurs portables (10) ----------
        $cid = $cats['ordinateurs-portables']->id ?? null;
        if ($cid) {
            $products[] = ['category_id' => $cid, 'name' => 'Ultrabook 14"', 'slug' => 'ultrabook-14', 'description' => 'Intel Core i7, 16 Go RAM, 512 Go SSD, écran Full HD.', 'price' => 899.99, 'stock' => 7, 'image' => "https://images.unsplash.com/photo-1496181133206-80ce9b88a853{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'PC Portable Gamer 15"', 'slug' => 'pc-portable-gamer-15', 'description' => 'RTX 4050, 16 Go RAM, 1 To SSD, 165 Hz.', 'price' => 1299.99, 'stock' => 5, 'image' => "https://images.unsplash.com/photo-1603302576837-37561b2e2302{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Portable 17" travail', 'slug' => 'portable-17-travail', 'description' => 'i5, 8 Go, 256 Go SSD, numpad.', 'price' => 649.99, 'stock' => 11, 'image' => "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Chromebook 13"', 'slug' => 'chromebook-13', 'description' => 'Éducation et bureautique, 64 Go eMMC.', 'price' => 299.99, 'stock' => 24, 'image' => "https://images.unsplash.com/photo-1517336714731-489689fd1ca8{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Portable créatif 16"', 'slug' => 'portable-creatif-16', 'description' => 'Écran 2,5K 120 Hz, i7, 32 Go, 1 To.', 'price' => 1599.99, 'stock' => 4, 'image' => "https://images.unsplash.com/photo-1496181133206-80ce9b88a853{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Portable entrée de gamme', 'slug' => 'portable-entree-gamme', 'description' => 'Ryzen 5, 8 Go, 256 Go SSD, 15,6".', 'price' => 449.99, 'stock' => 16, 'image' => "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Gaming 17" RTX 4070', 'slug' => 'gaming-17-rtx-4070', 'description' => 'i9, 32 Go, 1 To NVMe, QHD 240 Hz.', 'price' => 2199.99, 'stock' => 3, 'image' => "https://images.unsplash.com/photo-1603302576837-37561b2e2302{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Convertible 2-en-1', 'slug' => 'convertible-2-en-1', 'description' => 'Tactile, stylet inclus, 12,3".', 'price' => 749.99, 'stock' => 9, 'image' => "https://images.unsplash.com/photo-1517336714731-489689fd1ca8{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Portable 14" AMD', 'slug' => 'portable-14-amd', 'description' => 'Ryzen 7, 16 Go, 512 Go, Full HD.', 'price' => 699.99, 'stock' => 13, 'image' => "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Mini PC portable', 'slug' => 'mini-pc-portable', 'description' => 'Format compact, N100, 8 Go, 128 Go.', 'price' => 279.99, 'stock' => 18, 'image' => "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89{$img}"];
        }

        // ---------- Logiciels & Licences (10) ----------
        $cid = $cats['logiciels-licences']->id ?? null;
        if ($cid) {
            $products[] = ['category_id' => $cid, 'name' => 'Licence Windows 11 Famille', 'slug' => 'licence-windows-11-famille', 'description' => 'Clé numérique, téléchargement officiel Microsoft.', 'price' => 145.00, 'stock' => 100, 'image' => "https://images.unsplash.com/photo-1555617981-dac3880eac6e{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Antivirus 1 an', 'slug' => 'antivirus-1an', 'description' => 'Protection complète, 3 appareils.', 'price' => 29.99, 'stock' => 200, 'image' => "https://images.unsplash.com/photo-1563986768609-322da13575f3{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Office 365 Famille 1 an', 'slug' => 'office-365-famille-1an', 'description' => 'Word, Excel, PowerPoint, 6 utilisateurs.', 'price' => 99.99, 'stock' => 80, 'image' => "https://images.unsplash.com/photo-1586281380349-632531db7ed4{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'VPN 2 ans', 'slug' => 'vpn-2-ans', 'description' => 'Serveurs monde entier, 5 appareils.', 'price' => 59.99, 'stock' => 150, 'image' => "https://images.unsplash.com/photo-1558494949-ef010cbdcc31{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Suite créative 1 mois', 'slug' => 'suite-creative-1-mois', 'description' => 'Photoshop, Illustrator, InDesign.', 'price' => 59.99, 'stock' => 999, 'image' => "https://images.unsplash.com/photo-1611162617474-5b21e879e113{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Windows 11 Pro', 'slug' => 'windows-11-pro', 'description' => 'Licence Pro, mise à jour incluse.', 'price' => 189.00, 'stock' => 60, 'image' => "https://images.unsplash.com/photo-1555617981-dac3880eac6e{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Stockage cloud 1 To', 'slug' => 'stockage-cloud-1to', 'description' => '1 an, synchronisation multi-appareils.', 'price' => 79.99, 'stock' => 200, 'image' => "https://images.unsplash.com/photo-1544197150-b99a580bb7a8{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Logiciel gravure', 'slug' => 'logiciel-gravure', 'description' => 'Licence à vie, Blu-ray et DVD.', 'price' => 49.99, 'stock' => 45, 'image' => "https://images.unsplash.com/photo-1516035069371-29a1b244cc32{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Antivirus Pro 3 ans', 'slug' => 'antivirus-pro-3-ans', 'description' => '5 appareils, pare-feu, VPN inclus.', 'price' => 69.99, 'stock' => 90, 'image' => "https://images.unsplash.com/photo-1563986768609-322da13575f3{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Licence Windows 10 Pro', 'slug' => 'licence-windows-10-pro', 'description' => 'Mise à jour vers Windows 11 possible.', 'price' => 139.00, 'stock' => 70, 'image' => "https://images.unsplash.com/photo-1555617981-dac3880eac6e{$img}"];
        }

        // ---------- Accessoires (10) ----------
        $cid = $cats['accessoires']->id ?? null;
        if ($cid) {
            $products[] = ['category_id' => $cid, 'name' => 'Hub USB-C 7-en-1', 'slug' => 'hub-usb-c-7-en-1', 'description' => 'HDMI, USB 3.0, SD, 100 W PD.', 'price' => 45.99, 'stock' => 28, 'image' => "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Support écran bras articulé', 'slug' => 'support-ecran-bras', 'description' => 'Jusqu\'à 27", réglable hauteur et orientation.', 'price' => 89.99, 'stock' => 18, 'image' => "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Sac à dos ordinateur 15"', 'slug' => 'sac-dos-ordi-15', 'description' => 'Compartiment laptop, port USB.', 'price' => 54.99, 'stock' => 32, 'image' => "https://images.unsplash.com/photo-1553062407-98eeb64c6a62{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Tapis de souris XXL', 'slug' => 'tapis-souris-xxl', 'description' => '900×400 mm, bordure tissée.', 'price' => 24.99, 'stock' => 40, 'image' => "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Support laptop ventilé', 'slug' => 'support-laptop-ventile', 'description' => '5 ventilateurs USB, réglable.', 'price' => 39.99, 'stock' => 25, 'image' => "https://images.unsplash.com/photo-1496181133206-80ce9b88a853{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Câble HDMI 2.1 2 m', 'slug' => 'cable-hdmi-21-2m', 'description' => '8K 60 Hz, compatible PS5 et Xbox.', 'price' => 19.99, 'stock' => 65, 'image' => "https://images.unsplash.com/photo-1558618666-fcd25c85cd64{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Station d\'accueil USB-C', 'slug' => 'station-accueil-usbc', 'description' => '2 écrans, 85 W, Ethernet, SD.', 'price' => 199.99, 'stock' => 10, 'image' => "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Webcam avec cache', 'slug' => 'webcam-avec-cache', 'description' => '1080p + cache physique confidentialité.', 'price' => 34.99, 'stock' => 38, 'image' => "https://images.unsplash.com/photo-1587826080692-f439cd0b70da{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Pied micro bureau', 'slug' => 'pied-micro-bureau', 'description' => 'Avec filtre anti-pop, câble 2 m.', 'price' => 29.99, 'stock' => 42, 'image' => "https://images.unsplash.com/photo-1590602847861-f357a9332bbc{$img}"];
            $products[] = ['category_id' => $cid, 'name' => 'Organisateur câbles', 'slug' => 'organisateur-cables', 'description' => 'Bac bureau, 3 compartiments.', 'price' => 14.99, 'stock' => 55, 'image' => "https://images.unsplash.com/photo-1558618666-fcd25c85cd64{$img}"];
        }

        return $products;
    }
}
