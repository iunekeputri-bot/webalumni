<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Pesan Kontak Baru</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            border: 1px solid #e0e0e0;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px 10px 0 0;
            margin: -30px -30px 20px -30px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .info-row {
            display: flex;
            margin-bottom: 15px;
            padding: 10px;
            background-color: white;
            border-radius: 5px;
        }
        .info-label {
            font-weight: bold;
            min-width: 100px;
            color: #667eea;
        }
        .message-content {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            border-left: 4px solid #667eea;
            margin-top: 20px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 Pesan Kontak Baru</h1>
        </div>
        
        <p>Anda menerima pesan baru dari website Alumni SMK:</p>
        
        <div class="info-row">
            <span class="info-label">Nama:</span>
            <span>{{ $senderName }}</span>
        </div>
        
        <div class="info-row">
            <span class="info-label">Email:</span>
            <span>{{ $senderEmail }}</span>
        </div>
        
        <div class="info-row">
            <span class="info-label">Subjek:</span>
            <span>{{ $subject }}</span>
        </div>
        
        <div class="message-content">
            <h3 style="margin-top: 0; color: #667eea;">Pesan:</h3>
            <p style="white-space: pre-wrap;">{{ $messageContent }}</p>
        </div>
        
        <div class="footer">
            <p>Email ini dikirim otomatis dari website Alumni SMK</p>
            <p>Anda dapat membalas langsung ke email pengirim: {{ $senderEmail }}</p>
        </div>
    </div>
</body>
</html>
