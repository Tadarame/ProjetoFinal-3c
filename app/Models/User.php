<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens , HasFactory, Notifiable;

    protected $fillable = ['name', 'username', 'email', 'password', 'bio', 'avatar'];

    protected $hidden = ['password', 'remember_token'];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }
    public function likes()
    {
        return $this->hasMany(Like::class);
    }
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function stories()
    {
        return $this->hasMany(Story::class);
    }

    //quem o usuario segue 

    public function following ()
    {
        return $this->belongsToMany(User::class, 'followers', 'follower_id', 'following_id')
        ->withTimestamps();
    }

    public function followers ()
    {
        return $this->belongsToMany(User::class, 'followers', 'following_id', 'follower_id')
        ->withTimestamps();
    }
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
