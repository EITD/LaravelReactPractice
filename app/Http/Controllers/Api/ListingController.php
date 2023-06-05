<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ListingResource;
use App\Models\Listing;
use Illuminate\Http\Request;
use Psy\Readline\Hoa\Console;

class ListingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $text = request()->search;
        if($text) {
            return ListingResource::collection(
                Listing::where('title', 'LIKE', "%$text%")->get());
        }
        return ListingResource::collection(
            Listing::query()->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->all();
        $listing = Listing::create($data);
        return response(new ListingResource($listing));
    }

    /**
     * Display the specified resource.
     */
    public function show(Listing $listing)
    {
        return new ListingResource($listing);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
