<?php

namespace App\Http\Controllers;

use App\Alumni;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AlumniController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
        $this->middleware('role:admin')->only(['store', 'update', 'destroy']);
    }

    public function index()
    {
        $alumni = Alumni::with('user')->get();

        $data = $alumni->map(function ($alum) {
            return [
                'id' => $alum->id,
                'user_id' => $alum->user_id,
                'name' => $alum->name,
                'email' => $alum->email,
                'birth_date' => $alum->birth_date,
                'nisn' => $alum->nisn,
                'phone' => $alum->phone,
                'major' => $alum->major,
                'graduation_year' => $alum->graduation_year,
                'status' => $alum->status,
                'join_date' => $alum->join_date,
                'bio' => $alum->bio ?? '',
                'skills' => is_array($alum->skills) ? $alum->skills : json_decode($alum->skills ?? '[]', true),
                'work_status' => $alum->work_status ?? 'siap_bekerja',
                'avatar' => $alum->avatar ? asset($alum->avatar) : "https://avatar.vercel.sh/" . strtolower(str_replace(" ", "", $alum->name)),
            ];
        });

        return response()->json($data);
    }

    public function store(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'birth_date' => 'required|date',
                'nisn' => 'required|string|unique:alumni,nisn',
                'phone' => 'nullable|string',
                'major' => 'required|string',
                'graduation_year' => 'required|integer',
                'status' => 'in:active,inactive',
            ]);

            // Use birth_date as password (format: YYYYMMDD)
            $password = date('Ymd', strtotime($validatedData['birth_date']));

            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => bcrypt($password),
                'role' => 'alumni',
            ]);

            $alumni = Alumni::create(array_merge($validatedData, [
                'user_id' => $user->id,
                'join_date' => now(),
            ]));

            return response()->json($alumni, 201);
        });
    }

    public function show($id)
    {
        $alumni = Alumni::findOrFail($id);
        return response()->json([
            'id' => $alumni->id,
            'user_id' => $alumni->user_id,
            'name' => $alumni->name,
            'email' => $alumni->email,
            'phone' => $alumni->phone,
            'major' => $alumni->major,
            'graduation_year' => $alumni->graduation_year,
            'status' => $alumni->status,
            'bio' => $alumni->bio ?? '',
            'skills' => $alumni->skills ?? [],
            'work_status' => $alumni->work_status ?? 'siap_bekerja',
            'avatar' => $alumni->avatar ? asset($alumni->avatar) : "https://avatar.vercel.sh/" . strtolower(str_replace(" ", "", $alumni->name)),
        ]);
    }

    public function update(Request $request, $id)
    {
        $alumni = Alumni::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'string|max:255',
            'email' => 'email|unique:alumni,email,'.$id,
            'birth_date' => 'date',
            'nisn' => 'string|unique:alumni,nisn,'.$id,
            'phone' => 'nullable|string',
            'major' => 'string',
            'graduation_year' => 'integer',
            'status' => 'in:active,inactive,pending',
        ]);

        $alumni->update($validatedData);

        return $alumni;
    }

    public function destroy($id)
    {
        $alumni = Alumni::findOrFail($id);
        $alumni->delete();

        return response()->json(null, 204);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        $alumni = Alumni::where('user_id', $user->id)->firstOrFail();

        // Calculate profile completion
        $totalFields = 10;
        $filledFields = 0;

        // Check required fields
        if (!empty($alumni->name)) $filledFields++;
        if (!empty($alumni->email)) $filledFields++;
        if (!empty($alumni->phone)) $filledFields++;
        if (!empty($alumni->major)) $filledFields++;
        if (!empty($alumni->graduation_year)) $filledFields++;
        if (!empty($alumni->birth_date)) $filledFields++;
        if (!empty($alumni->nisn)) $filledFields++;
        if (!empty($alumni->bio)) $filledFields++;
        if (!empty($alumni->avatar) && $alumni->avatar !== 'https://avatar.vercel.sh/' . strtolower(str_replace(" ", "", $alumni->name))) $filledFields++;
        if (!empty($alumni->skills) && count($alumni->skills) > 0) $filledFields++;

        $profileCompletion = ($filledFields / $totalFields) * 100;

        return response()->json([
            'id' => $alumni->id,
            'user_id' => $alumni->user_id,
            'name' => $alumni->name,
            'email' => $alumni->email,
            'phone' => $alumni->phone,
            'major' => $alumni->major,
            'graduation_year' => $alumni->graduation_year,
            'status' => $alumni->status,
            'bio' => $alumni->bio ?? '',
            'skills' => $alumni->skills ?? [],
            'work_status' => $alumni->work_status ?? 'siap_bekerja',
            'avatar' => $alumni->avatar ? asset($alumni->avatar) : "https://avatar.vercel.sh/" . strtolower(str_replace(" ", "", $alumni->name)),
            'profile_completion' => round($profileCompletion),
            'profile_completion_details' => [
                'total_fields' => $totalFields,
                'filled_fields' => $filledFields,
                'missing_fields' => $this->getMissingFields($alumni)
            ]
        ]);
    }

    private function getMissingFields($alumni)
    {
        $missing = [];

        if (empty($alumni->name)) $missing[] = 'Nama';
        if (empty($alumni->email)) $missing[] = 'Email';
        if (empty($alumni->phone)) $missing[] = 'Nomor Telepon';
        if (empty($alumni->major)) $missing[] = 'Jurusan';
        if (empty($alumni->graduation_year)) $missing[] = 'Tahun Lulus';
        if (empty($alumni->birth_date)) $missing[] = 'Tanggal Lahir';
        if (empty($alumni->nisn)) $missing[] = 'NISN';
        if (empty($alumni->bio)) $missing[] = 'Bio/Deskripsi';
        if (empty($alumni->avatar) || $alumni->avatar === 'https://avatar.vercel.sh/' . strtolower(str_replace(" ", "", $alumni->name))) {
            $missing[] = 'Foto Profil';
        }
        if (empty($alumni->skills) || count($alumni->skills) == 0) $missing[] = 'Keahlian';

        return $missing;
    }

    public function updateMe(Request $request)
    {
        $user = $request->user();
        $alumni = Alumni::where('user_id', $user->id)->firstOrFail();

        $validatedData = $request->validate([
            'name' => 'string|max:255',
            'phone' => 'nullable|string',
            'major' => 'string',
            'graduation_year' => 'integer',
            'bio' => 'nullable|string',
            'skills' => 'nullable|array',
            'work_status' => 'nullable|string',
            'avatar' => 'nullable|string', // Base64 string usually
        ]);

        // Update user name as well if provided
        if (isset($validatedData['name'])) {
             $user->update(['name' => $validatedData['name']]);
        }

        $alumni->update($validatedData);

        return response()->json([
            'id' => $alumni->id,
            'user_id' => $alumni->user_id,
            'name' => $alumni->name,
            'email' => $alumni->email,
            'phone' => $alumni->phone,
            'major' => $alumni->major,
            'graduation_year' => $alumni->graduation_year,
            'status' => $alumni->status,
            'bio' => $alumni->bio ?? '',
            'skills' => $alumni->skills ?? [],
            'work_status' => $alumni->work_status ?? 'siap_bekerja',
            'avatar' => $alumni->avatar ? asset($alumni->avatar) : "https://avatar.vercel.sh/" . strtolower(str_replace(" ", "", $alumni->name)),
        ]);
    }
    public function export()
    {
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\AlumniExport, 'alumni_export_' . date('Y-m-d_H-i-s') . '.xlsx');
    }

    public function downloadTemplate()
    {
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\AlumniTemplateExport, 'alumni_import_template.xlsx');
    }

    public function import(Request $request)
    {
        // Validate file with multiple MIME types for CSV compatibility
        $request->validate([
            'file' => [
                'required',
                'file',
                'max:10240', // 10MB max
                function ($attribute, $value, $fail) {
                    $extension = strtolower($value->getClientOriginalExtension());
                    $allowedExtensions = ['xlsx', 'xls', 'csv'];

                    if (!in_array($extension, $allowedExtensions)) {
                        $fail('File harus berformat: xlsx, xls, atau csv');
                    }

                    // Accept various MIME types for CSV
                    $mimeType = $value->getMimeType();
                    $allowedMimes = [
                        'application/vnd.ms-excel',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        'text/csv',
                        'text/plain',
                        'application/csv',
                        'text/comma-separated-values',
                        'application/octet-stream', // Some browsers send this for CSV
                    ];

                    if (!in_array($mimeType, $allowedMimes)) {
                        $fail("File MIME type tidak valid: {$mimeType}. Ekstensi: {$extension}");
                    }
                },
            ],
        ]);

        DB::beginTransaction();
        try {
            \Maatwebsite\Excel\Facades\Excel::import(new \App\Imports\AlumniImport, $request->file('file'));

            DB::commit();
            return response()->json([
                'success' => true,
                'message' => "Import completed successfully.",
            ]);

        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            DB::rollBack();
            $failures = $e->failures();
            $errors = [];

            foreach ($failures as $failure) {
                $errors[] = "Row " . $failure->row() . ": " . implode(', ', $failure->errors());
            }

            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $errors
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            \Illuminate\Support\Facades\Log::error('Import failed: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Import failed: ' . $e->getMessage()], 500);
        }
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // max 2MB
        ]);

        $user = $request->user();
        $alumni = Alumni::where('user_id', $user->id)->firstOrFail();

        // Delete old avatar if exists
        if ($alumni->avatar) {
            // Remove leading slash if exists
            $oldPath = ltrim($alumni->avatar, '/');
            if (\Storage::disk('public')->exists($oldPath)) {
                \Storage::disk('public')->delete($oldPath);
            }
        }

        // Store new avatar using Storage facade (works with symlinked public/storage)
        $file = $request->file('avatar');
        $filename = 'avatar_' . $alumni->id . '_' . time() . '.' . $file->getClientOriginalExtension();
        $filePath = $file->storeAs('avatars', $filename, 'public');

        // Update avatar path in database (store as relative path for flexibility)
        $alumni->update([
            'avatar' => '/storage/' . $filePath
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Avatar berhasil diupload',
            'avatar' => asset('/storage/' . $filePath)
        ]);
    }

    /**
     * Download CV for specific alumni (for companies)
     */
    public function downloadCV($userId)
    {
        // Get alumni's CV document
        $document = \App\Document::where('user_id', $userId)
            ->where('file_type', 'cv')
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$document) {
            return response()->json([
                'error' => 'CV tidak ditemukan untuk alumni ini'
            ], 404);
        }

        // Check if file exists
        if (!\Storage::disk('public')->exists($document->file_path)) {
            return response()->json([
                'error' => 'File CV tidak ditemukan'
            ], 404);
        }

        return \Storage::disk('public')->download($document->file_path, $document->file_name);
    }
}
