<?php

use Illuminate\Database\Seeder;
use App\Message;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Sample messages between company (ID=2) and alumni (ID=3,4,5)
        $messages = [
            // Conversation with alumni ID 3
            [
                'sender_id' => 3,
                'receiver_id' => 2,
                'message' => 'Halo, saya tertarik dengan lowongan yang Anda posting.',
                'is_read' => true,
                'created_at' => now()->subDays(2)->subHours(3),
                'updated_at' => now()->subDays(2)->subHours(3),
            ],
            [
                'sender_id' => 2,
                'receiver_id' => 3,
                'message' => 'Terima kasih atas ketertarikan Anda! Boleh saya tahu lebih detail tentang pengalaman Anda?',
                'is_read' => true,
                'created_at' => now()->subDays(2)->subHours(2),
                'updated_at' => now()->subDays(2)->subHours(2),
            ],
            [
                'sender_id' => 3,
                'receiver_id' => 2,
                'message' => 'Saya memiliki pengalaman 2 tahun di bidang web development dengan fokus pada React dan Node.js.',
                'is_read' => true,
                'created_at' => now()->subDays(2)->subHours(1),
                'updated_at' => now()->subDays(2)->subHours(1),
            ],
            [
                'sender_id' => 2,
                'receiver_id' => 3,
                'message' => 'Bagus! Apakah Anda bisa bergabung untuk interview minggu depan?',
                'is_read' => false,
                'created_at' => now()->subDay(),
                'updated_at' => now()->subDay(),
            ],

            // Conversation with alumni ID 4
            [
                'sender_id' => 2,
                'receiver_id' => 4,
                'message' => 'Halo, kami tertarik dengan profil Anda untuk posisi UI/UX Designer.',
                'is_read' => true,
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ],
            [
                'sender_id' => 4,
                'receiver_id' => 2,
                'message' => 'Terima kasih! Saya sangat tertarik. Apakah ada detail lebih lanjut yang bisa dishare?',
                'is_read' => true,
                'created_at' => now()->subDays(3)->addHours(2),
                'updated_at' => now()->subDays(3)->addHours(2),
            ],
            [
                'sender_id' => 2,
                'receiver_id' => 4,
                'message' => 'Tentu, saya akan kirimkan job description lengkapnya via email.',
                'is_read' => false,
                'created_at' => now()->subHours(5),
                'updated_at' => now()->subHours(5),
            ],

            // Conversation with alumni ID 5
            [
                'sender_id' => 5,
                'receiver_id' => 2,
                'message' => 'Apakah perusahaan Anda masih membuka lowongan untuk Fresh Graduate?',
                'is_read' => false,
                'created_at' => now()->subHours(2),
                'updated_at' => now()->subHours(2),
            ],
        ];

        foreach ($messages as $message) {
            Message::create($message);
        }

        echo "Sample messages created successfully!\n";
    }
}
