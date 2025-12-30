<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Document;
use Illuminate\Auth\Access\HandlesAuthorization;

class DocumentPolicy
{
    use HandlesAuthorization;

    /**
     * Determine if the user can view the document
     */
    public function view(User $user, Document $document)
    {
        return $user->id === $document->user_id;
    }

    /**
     * Determine if the user can delete the document
     */
    public function delete(User $user, Document $document)
    {
        return $user->id === $document->user_id;
    }
}


