<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasColumn('messages', 'read')) {
            Schema::table('messages', function (Blueprint $table) {
                $table->boolean('read')->default(false)->after('message');
            });
        }
    }

    public function down()
    {
        if (Schema::hasColumn('messages', 'read')) {
            Schema::table('messages', function (Blueprint $table) {
                $table->dropColumn('read');
            });
        }
    }
}; 