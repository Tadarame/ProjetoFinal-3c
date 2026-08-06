<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class post extends Model
{
    
    //
    protected $fillable = ['user_id', 'caption', 'image_path'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function like()
    {
        return $this->hasMany(Like::class);
    }

}
