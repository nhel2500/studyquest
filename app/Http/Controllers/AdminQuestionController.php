<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\trivia_questions;
use App\Models\trivia_options;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class AdminQuestionController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'required|integer',
            'rarity' => 'required|string|max:255',
            'question' => 'required|string',
            'correct_answer' => 'required|in:a,b,c,d',
            'reveal_text' => 'nullable|string',
            'streak_bonus' => 'nullable|integer',
            'row' => 'nullable|integer',
            'option_a' => 'required|string|max:255',
            'option_b' => 'required|string|max:255',
            'option_c' => 'required|string|max:255',
            'option_d' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Insert question first
            $question = new trivia_questions();
            $question->category_id = $request->category_id;
            $question->rarity = $request->rarity;
            $question->question = $request->question;
            $question->correct_answer = $request->correct_answer;
            $question->reveal_text = $request->reveal_text;
            $question->streak_bonus = ($request->streak_bonus !== null && $request->streak_bonus !== '') ? $request->streak_bonus : 0;
            $question->row = ($request->row !== null && $request->row !== '') ? $request->row : 1;

            $question->save(); // Save FIRST so it has an ID

            // Insert options
            $options = [
                ['option_id' => 'a', 'text' => $request->option_a],
                ['option_id' => 'b', 'text' => $request->option_b],
                ['option_id' => 'c', 'text' => $request->option_c],
                ['option_id' => 'd', 'text' => $request->option_d],
            ];

            foreach ($options as $option) {
                trivia_options::create([
                    'question_id' => $question->id, // Get the real ID after saving
                    'option_id' => $option['option_id'],
                    'text' => $option['text'],
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Question and options successfully added!',
                'data' => $question
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to add question.',
                'error' => $e->getMessage()
            ], 500);
        }



}

public function fetchQuestions()
{
    $questions = trivia_questions::all(); // Kunin lahat ng questions
    return response()->json($questions); // Balik JSON response
}

public function update(Request $request, $id)
{
    $question = trivia_questions::findOrFail($id);

    $validator = Validator::make($request->all(), [
        'question' => 'required|string',
        'reveal_text' => 'nullable|string',
        // Add more validation rules if you want to update more fields later
    ]);

    if ($validator->fails()) {
        return response()->json([
            'errors' => $validator->errors()
        ], 422);
    }

    $question->question = $request->question;
    $question->reveal_text = $request->reveal_text;
    // Add more fields if needed (like options, rarity, etc.)
    $question->save();

    return response()->json([
        'message' => 'Question updated successfully!'
    ], 200);
}

}
