<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Périphériques', 'slug' => 'peripheriques', 'description' => 'Claviers, souris, écrans, casques, webcams.'],
            ['name' => 'Composants', 'slug' => 'composants', 'description' => 'SSD, RAM, cartes graphiques, processeurs.'],
            ['name' => 'Réseau', 'slug' => 'reseau', 'description' => 'Routeurs, câbles, cartes Wi-Fi.'],
        ];
        foreach ($categories as $cat) {
            Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}
