<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        try {
            // Email configuration
            $recipientEmail = env('CONTACT_EMAIL', 'your-email@example.com');
            $subject = $validatedData['subject'] ?: 'Pesan Baru dari Website Alumni SMK';
            
            // Send email
            Mail::send('emails.contact', [
                'senderName' => $validatedData['name'],
                'senderEmail' => $validatedData['email'],
                'messageContent' => $validatedData['message'],
                'subject' => $subject
            ], function ($message) use ($recipientEmail, $subject, $validatedData) {
                $message->to($recipientEmail)
                        ->subject($subject)
                        ->replyTo($validatedData['email'], $validatedData['name']);
            });

            // Log the contact for record keeping
            Log::info('Contact form submission', [
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'subject' => $subject,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pesan berhasil dikirim'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Contact form error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim pesan. Silakan coba lagi.'
            ], 500);
        }
    }
}

