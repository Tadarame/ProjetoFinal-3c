<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\FollowController;

Route::get('/users', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', function (\Illuminate\Http\Request $request) {
        return $request->user();
    });

    Route::apiResource('posts', PostController::class);

    Route::post('/users/{user}/follow', [FollowController::class, 'toggle']);

    Route::get('/search', [UserController::class, 'search']);
Route::put('/profile', [UserController::class, 'update']);
Route::get('/users/{user}', [UserController::class, 'show']);

    Route::get('/posts/{post}/comments', [CommentController::class, 'index']);
    Route::post('/posts/{post}/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{comments}',[CommentController::class, 'destroy']);

    Route::post('/posts/{post}/like', [LikeController::class, 'toggle']);
});