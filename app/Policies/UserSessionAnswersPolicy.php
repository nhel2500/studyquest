<?php

namespace App\Policies;

use App\Models\User;
use App\Models\user_session_answers;
use Illuminate\Auth\Access\Response;

class UserSessionAnswersPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, user_session_answers $userSessionAnswers): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, user_session_answers $userSessionAnswers): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, user_session_answers $userSessionAnswers): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, user_session_answers $userSessionAnswers): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, user_session_answers $userSessionAnswers): bool
    {
        return false;
    }
}
