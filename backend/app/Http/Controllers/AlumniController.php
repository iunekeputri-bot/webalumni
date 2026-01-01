<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use App\Models\User;
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
            ob_start(); // Start buffering to catch unexpected output

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

            $junk = ob_get_clean(); // Discard accumulated output
            if (!empty($junk)) {
                \Illuminate\Support\Facades\Log::warning('Unexpected output during alumni creation: ' . $junk);
            }

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
            'email' => 'email|unique:alumni,email,' . $id,
            'birth_date' => 'date',
            'nisn' => 'string|unique:alumni,nisn,' . $id,
            'phone' => 'nullable|string',
            'major' => 'string',
            'graduation_year' => 'integer',
            'status' => 'in:active,inactive,pending',
        ]);

        $alumni->update($validatedData);

        // Broadcast profile update
        broadcast(new \App\Events\AlumniProfileUpdated($alumni))->toOthers();

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
        // Self-healing: Create alumni record if it doesn't exist but user is alumni
        $alumni = Alumni::firstOrCreate(
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'email' => $user->email,
                'join_date' => now(),
                'status' => 'active',
                'graduation_year' => date('Y'), // Default
                'major' => 'Umum', // Default
                'nisn' => 'P' . time(), // Temporary NISN to avoid unique constraint error if strict
            ]
        );

        // Calculate profile completion
        $totalFields = 7; // Reduced from 10 (removed birth_date, nisn, graduation_year check)
        $filledFields = 0;

        // Check required fields (must match getMissingFields)
        if (!empty($alumni->name))
            $filledFields++;
        if (!empty($alumni->email))
            $filledFields++;
        if (!empty($alumni->phone))
            $filledFields++;
        if (!empty($alumni->major) && $alumni->major !== 'Umum')
            $filledFields++;
        // graduation_year is always filled by default, not really indicating "completion" unless user changes it.
        // But let's count it if it's set.
        // if (!empty($alumni->graduation_year)) $filledFields++; 

        if (!empty($alumni->bio))
            $filledFields++;
        if (!empty($alumni->avatar) && $alumni->avatar !== 'https://avatar.vercel.sh/' . strtolower(str_replace(" ", "", $alumni->name)))
            $filledFields++;
        if (!empty($alumni->skills) && count($alumni->skills) > 0)
            $filledFields++;

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

        if (empty($alumni->name))
            $missing[] = 'Nama';
        if (empty($alumni->email))
            $missing[] = 'Email';
        if (empty($alumni->phone))
            $missing[] = 'Nomor Telepon';
        if (empty($alumni->major) || $alumni->major === 'Umum')
            $missing[] = 'Jurusan';
        // if (empty($alumni->graduation_year))
        //     $missing[] = 'Tahun Lulus'; // Graduation year is almost never empty due to default, maybe check if it's realistic?
        // Let's keep it simple. Only check what's in ProfileForm.

        // date_birth & nisn removed from check because not in ProfileForm
        // if (empty($alumni->birth_date)) $missing[] = 'Tanggal Lahir';
        // if (empty($alumni->nisn)) $missing[] = 'NISN';

        if (empty($alumni->bio))
            $missing[] = 'Bio/Deskripsi';
        if (empty($alumni->avatar) || $alumni->avatar === 'https://avatar.vercel.sh/' . strtolower(str_replace(" ", "", $alumni->name))) {
            $missing[] = 'Foto Profil';
        }
        if (empty($alumni->skills) || count($alumni->skills) == 0)
            $missing[] = 'Keahlian';

        return $missing;
    }

    public function updateMe(Request $request)
    {
        $user = $request->user();

        // Self-healing in update as well
        $alumni = Alumni::firstOrCreate(
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'email' => $user->email,
                'join_date' => now(),
                'status' => 'active',
                'graduation_year' => date('Y'),
                'major' => 'Umum',
                'nisn' => 'P' . time(),
            ]
        );

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

        // Broadcast profile update
        broadcast(new \App\Events\AlumniProfileUpdated($alumni))->toOthers();

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
        if ($alumni->avatar && file_exists(public_path($alumni->avatar))) {
            unlink(public_path($alumni->avatar));
        }

        // Store new avatar
        $file = $request->file('avatar');
        $filename = 'avatar_' . $alumni->id . '_' . time() . '.' . $file->getClientOriginalExtension();
        $path = 'storage/avatars/' . $filename;

        // Ensure directory exists
        if (!file_exists(public_path('storage/avatars'))) {
            mkdir(public_path('storage/avatars'), 0755, true);
        }

        $file->move(public_path('storage/avatars'), $filename);

        // Update avatar path in database
        $alumni->update([
            'avatar' => '/' . $path
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Avatar berhasil diupload',
            'avatar' => asset($path)
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

        // Use response()->download with full path to avoid linter error on Storage::download
        $fullPath = \Storage::disk('public')->path($document->file_path);
        return response()->download($fullPath, $document->file_name);
    }

    public function recordProfileView(Request $request, $id)
    {
        $viewer = $request->user();
        if (!$viewer)
            return response()->json(['error' => 'Unauthorized'], 401);

        // Don't record own views?? Usually yes, don't record own
        $alumni = Alumni::findOrFail($id);
        if ($alumni->user_id === $viewer->id) {
            return response()->json(['message' => 'Own profile view ignored']);
        }

        // Prevent spam: check if viewed in last hour?
        // simple unique check per day
        $exists = \App\Models\ProfileView::where('alumni_id', $id)
            ->where('viewer_id', $viewer->id)
            ->whereRaw('DATE(viewed_at) = CURDATE()')
            ->exists();

        if (!$exists) {
            \App\Models\ProfileView::create([
                'alumni_id' => $id,
                'viewer_id' => $viewer->id,
                'viewed_at' => now(),
            ]);

            // Broadcast event manually if needed, or rely on Observer if ProfileView creates event
            // Note: ProfileView might not be in the Global Observer list yet, but we can add it or just let Frontend fetch
        }

        return response()->json(['success' => true]);
    }

    public function getProfileViewsStats(Request $request)
    {
        $user = $request->user();
        $alumni = Alumni::where('user_id', $user->id)->firstOrFail();

        // Get views for last 6 months
        $views = \App\Models\ProfileView::where('alumni_id', $alumni->id)
            ->where('viewed_at', '>=', now()->subMonths(6))
            ->orderBy('viewed_at', 'asc')
            ->get()
            ->groupBy(function ($date) {
                return \Carbon\Carbon::parse($date->viewed_at)->format('M'); // Group by Month name (Jan, Feb)
            });

        // Format for Recharts
        // We need all 6 months even if empty
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i)->format('M');
            $months[] = [
                'month' => $month,
                'views' => isset($views[$month]) ? $views[$month]->count() : 0,
                // Applications handled separately or join here
            ];
        }

        return response()->json($months);
    }
}


