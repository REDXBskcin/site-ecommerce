<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $peripheriques = Category::where('slug', 'peripheriques')->first();
        $composants = Category::where('slug', 'composants')->first();
        $reseau = Category::where('slug', 'reseau')->first();
        if (!$peripheriques || !$composants) return;

        $products = [
            ['category_id' => $peripheriques->id, 'name' => 'Clavier Mécanique RGB', 'slug' => 'clavier-mecanique-rgb', 'description' => 'Clavier gaming avec switches Cherry MX, rétroéclairage RGB.', 'price' => 129.99, 'stock' => 15, 'image' => 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&h=300&fit=crop'],
            ['category_id' => $peripheriques->id, 'name' => 'Écran 27" 144 Hz', 'slug' => 'ecran-27-144hz', 'description' => 'Moniteur Full HD 144 Hz, 1 ms, FreeSync.', 'price' => 249.99, 'stock' => 8, 'image' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop'],
            ['category_id' => $peripheriques->id, 'name' => 'Casque Sans Fil Pro', 'slug' => 'casque-sans-fil-pro', 'description' => 'Casque Bluetooth, réduction de bruit, 30 h d\'autonomie.', 'price' => 179.99, 'stock' => 22, 'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'],
            ['category_id' => $composants->id, 'name' => 'SSD NVMe 1 To', 'slug' => 'ssd-nvme-1to', 'description' => 'Stockage ultra-rapide, lecture 3500 Mo/s, M.2.', 'price' => 89.99, 'stock' => 45, 'image' => 'https://images.unsplash.com/photo-1597872200969-2b65d565bd41?w=400&h=300&fit=crop'],
            ['category_id' => $peripheriques->id, 'name' => 'Webcam Full HD', 'slug' => 'webcam-full-hd', 'description' => '1080p 60 fps, micro intégré.', 'price' => 69.99, 'stock' => 30, 'image' => 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=300&fit=crop'],
            ['category_id' => $peripheriques->id, 'name' => 'Souris Ergonomique', 'slug' => 'souris-ergonomique', 'description' => 'Capteur 16000 DPI, 7 boutons programmables.', 'price' => 49.99, 'stock' => 50, 'image' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop'],
        ];
        if ($reseau) {
            $products[] = ['category_id' => $reseau->id, 'name' => 'Routeur Wi-Fi 6', 'slug' => 'routeur-wifi-6', 'description' => 'Dual band, 3000 Mbit/s.', 'price' => 119.99, 'stock' => 12, 'image' => 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=300&fit=crop'];
        }
        foreach ($products as $p) {
            Product::firstOrCreate(['slug' => $p['slug']], array_merge($p, ['is_active' => true]));
        }
    }
}
