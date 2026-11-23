<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingLog extends Model
{
    protected $fillable = [
        'booking_id',
        'user_id', 
        'action', 
        'old_status', 
        'new_status', 
        'notes'
    ];
}
