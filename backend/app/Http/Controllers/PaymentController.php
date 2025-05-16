<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'listing_id' => 'required|exists:listings,id',
                'payment_method' => 'required|in:card,bank',
                'amount' => 'required|numeric|min:0',
                'payment_details' => 'required|array'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Get the listing
            $listing = Listing::findOrFail($request->listing_id);

            // Verify amount matches listing price
            if ($listing->price != $request->amount) {
                return response()->json([
                    'success' => false,
                    'message' => 'Amount mismatch'
                ], 400);
            }

            // Generate unique transaction reference
            $transactionRef = 'TRX-' . strtoupper(Str::random(10));

            // Create payment record
            $payment = Payment::create([
                'listing_id' => $listing->id,
                'user_id' => auth()->id(),
                'amount' => $request->amount,
                'payment_method' => $request->payment_method,
                'transaction_reference' => $transactionRef,
                'payment_details' => $request->payment_details,
                'payment_status' => 'pending'
            ]);

            // Process payment based on method
            if ($request->payment_method === 'card') {
                return $this->processCardPayment($payment, $request->payment_details);
            } else {
                return $this->processBankPayment($payment, $request->payment_details);
            }

        } catch (\Exception $e) {
            Log::error('Payment processing error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Payment processing failed'
            ], 500);
        }
    }

    protected function processCardPayment(Payment $payment, array $details)
    {
        try {
            // Validate card details
            $validator = Validator::make($details, [
                'number' => 'required|string',
                'expiry' => 'required|string',
                'cvv' => 'required|string|min:3|max:4'
            ]);

            if ($validator->fails()) {
                throw new \Exception('Invalid card details');
            }

            // TODO: Integrate with actual payment gateway (e.g., Paystack, Flutterwave)
            // For now, we'll simulate a successful payment
            $payment->update([
                'payment_status' => 'completed',
                'card_details' => [
                    'last_four' => substr($details['number'], -4),
                    'expiry' => $details['expiry']
                ]
            ]);

            // Update listing status if needed
            // You might want to add a status field to listings table
            // $payment->listing->update(['status' => 'sold']);

            return response()->json([
                'success' => true,
                'message' => 'Payment successful',
                'data' => [
                    'transaction_reference' => $payment->transaction_reference,
                    'amount' => $payment->amount
                ]
            ]);

        } catch (\Exception $e) {
            $payment->update(['payment_status' => 'failed']);
            throw $e;
        }
    }

    protected function processBankPayment(Payment $payment, array $details)
    {
        try {
            // Validate bank payment details
            $validator = Validator::make($details, [
                'reference' => 'required|string'
            ]);

            if ($validator->fails()) {
                throw new \Exception('Invalid bank payment details');
            }

            // Update payment with bank reference
            $payment->update([
                'bank_reference' => $details['reference'],
                'payment_status' => 'pending' // Bank transfers are pending until confirmed
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Bank transfer initiated',
                'data' => [
                    'transaction_reference' => $payment->transaction_reference,
                    'bank_reference' => $payment->bank_reference,
                    'amount' => $payment->amount
                ]
            ]);

        } catch (\Exception $e) {
            $payment->update(['payment_status' => 'failed']);
            throw $e;
        }
    }

    public function verifyPayment($reference)
    {
        try {
            $payment = Payment::where('transaction_reference', $reference)
                            ->orWhere('bank_reference', $reference)
                            ->firstOrFail();

            // TODO: Integrate with payment gateway to verify payment status
            // For now, we'll return the current status

            return response()->json([
                'success' => true,
                'data' => [
                    'status' => $payment->payment_status,
                    'amount' => $payment->amount,
                    'method' => $payment->payment_method
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment verification failed'
            ], 404);
        }
    }
}