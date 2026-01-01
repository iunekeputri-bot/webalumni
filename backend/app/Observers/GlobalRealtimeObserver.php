<?php

namespace App\Observers;

use App\Events\GlobalRealtimeUpdate;
use Illuminate\Database\Eloquent\Model;

class GlobalRealtimeObserver
{
    public function created(Model $model)
    {
        $this->broadcast('create', $model);
    }

    public function updated(Model $model)
    {
        $this->broadcast('update', $model);
    }

    public function deleted(Model $model)
    {
        $this->broadcast('delete', $model);
    }

    public function restored(Model $model)
    {
        $this->broadcast('restore', $model);
    }

    public function forceDeleted(Model $model)
    {
        $this->broadcast('force_delete', $model);
    }

    protected function broadcast($action, Model $model)
    {
        // Extract model name (e.g., 'JobPosting' from 'App\Models\JobPosting')
        $modelClass = class_basename($model);

        // Convert to camelCase/snake_case for frontend consistency if needed
        // e.g. JobPosting -> job_postings (frontend react-query key style usually plural)
        $type = \Illuminate\Support\Str::plural(\Illuminate\Support\Str::snake($modelClass));

        // Prepare minimal data to keep payload light
        $data = [
            'id' => $model->id,
            'timestamp' => now()->toIso8601String(),
        ];

        // Broadcast event
        event(new GlobalRealtimeUpdate($type, $action, $data));
    }
}
