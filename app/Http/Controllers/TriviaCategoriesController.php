<?php

namespace App\Http\Controllers;

use App\Models\trivia_categories;
use App\Http\Requests\Storetrivia_categoriesRequest;
use App\Http\Requests\Updatetrivia_categoriesRequest;

class TriviaCategoriesController extends Controller
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
    public function store(Storetrivia_categoriesRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(trivia_categories $trivia_categories)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(trivia_categories $trivia_categories)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Updatetrivia_categoriesRequest $request, trivia_categories $trivia_categories)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(trivia_categories $trivia_categories)
    {
        //
    }
}
