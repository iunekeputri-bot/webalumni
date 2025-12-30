<?php

namespace App\Http\Controllers;

use App\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Get all documents for authenticated user
     */
    public function index(Request $request)
    {
        $documents = Document::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($documents);
    }

    /**
     * Store a newly created document
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'file_type' => 'required|in:cv,sertifikat,portofolio,surat_rekomendasi',
            'file' => 'required|file|max:5120', // 5MB max
        ]);

        $file = $request->file('file');
        $user = $request->user();

        // Store file
        $fileName = time() . '_' . $user->id . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('documents', $fileName, 'public');

        // Create document record
        $document = Document::create([
            'user_id' => $user->id,
            'title' => $request->input('title'),
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $filePath,
            'file_type' => $request->input('file_type'),
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ]);

        return response()->json($document, 201);
    }

    /**
     * Display the specified document
     */
    public function show($id)
    {
        $document = Document::findOrFail($id);
        $this->authorize('view', $document);

        return response()->json($document);
    }

    /**
     * Download document
     */
    public function download($id)
    {
        $document = Document::findOrFail($id);
        $this->authorize('view', $document);

        return Storage::disk('public')->download($document->file_path, $document->file_name);
    }

    /**
     * Delete document
     */
    public function destroy($id)
    {
        $document = Document::findOrFail($id);
        $this->authorize('delete', $document);

        // Delete file
        if (Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();

        return response()->json(null, 204);
    }
}
