<?php

namespace App\Http\Controllers;

use App\Models\trivia_questions;
use App\Http\Requests\Storetrivia_questionsRequest;
use App\Http\Requests\Updatetrivia_questionsRequest;

class TriviaQuestionsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Storetrivia_questionsRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(trivia_questions $trivia_questions)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(trivia_questions $trivia_questions)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Updatetrivia_questionsRequest $request, trivia_questions $trivia_questions)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(trivia_questions $trivia_questions)
    {
        //
    }
}
