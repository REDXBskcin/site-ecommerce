<?php

namespace Tests\Feature;

use Tests\TestCase;

/**
 * Test d'exemple – BTS SIO
 * Vérifie que la page d'accueil répond correctement.
 */
class ExampleTest extends TestCase
{
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }
}
