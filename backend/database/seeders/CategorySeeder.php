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
            ['name' => 'Ordinateurs portables', 'slug' => 'ordinateurs-portables', 'description' => 'PC portables, ultrabooks, gaming.'],
            ['name' => 'Logiciels & Licences', 'slug' => 'logiciels-licences', 'description' => 'OS, antivirus, logiciels créatifs.'],
            ['name' => 'Accessoires', 'slug' => 'accessoires', 'description' => 'Sacs, supports, câbles, hubs USB.'],
        ];
        foreach ($categories as $cat) {
            Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}
