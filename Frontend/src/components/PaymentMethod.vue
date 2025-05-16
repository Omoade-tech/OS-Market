<template>
  <div class="payment-method">
    <div class="payment-tabs">
      <button 
        class="tab-btn" 
        :class="{ active: selectedMethod === 'card' }"
        @click="selectedMethod = 'card'"
      >
        <i class="fas fa-credit-card"></i> Credit/Debit Card
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: selectedMethod === 'bank' }"
        @click="selectedMethod = 'bank'"
      >
        <i class="fas fa-university"></i> Bank Transfer
      </button>
    </div>

    <!-- Card Payment Form -->
    <div v-if="selectedMethod === 'card'" class="card-payment">
      <form @submit.prevent="handleCardPayment" class="payment-form">
        <div class="form-group">
          <label for="cardNumber">Card Number</label>
          <input 
            type="text" 
            id="cardNumber" 
            v-model="cardDetails.number"
            placeholder="1234 5678 9012 3456"
            @input="formatCardNumber"
            :class="{ 'error': errors.cardNumber }"
            required
          >
          <div class="card-types">
            <span class="card-type">
              <i class="fab fa-cc-visa"></i>
              <small>Visa</small>
            </span>
            <span class="card-type">
              <i class="fab fa-cc-mastercard"></i>
              <small>Mastercard</small>
            </span>
            <span class="card-type">
              <i class="fas fa-credit-card"></i>
              <small>Verve</small>
            </span>
          </div>
          <span class="error-message" v-if="errors.cardNumber">{{ errors.cardNumber }}</span>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="expiry">Expiry Date</label>
            <input 
              type="text" 
              id="expiry" 
              v-model="cardDetails.expiry"
              placeholder="MM/YY"
              @input="formatExpiryDate"
              :class="{ 'error': errors.expiry }"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="cvv">CVV</label>
            <input 
              type="text" 
              id="cvv" 
              v-model="cardDetails.cvv"
              placeholder="123"
              maxlength="4"
              :class="{ 'error': errors.cvv }"
              required
            >
          </div>
        </div>

       
      </form>
    </div>

    <!-- Bank Transfer Details -->
    <div v-else-if="selectedMethod === 'bank'" class="bank-details">
      <p>Please use the following bank details to complete your payment:</p>
      <div class="bank-info">
        <p><strong>Bank:</strong> FIrst Bank Of Nigeria</p>
        <p><strong>Account Number:</strong> 312-700-43-73</p>
        <p><strong>Account Name:</strong> Open Source Market</p>
        <p><strong>Reference:</strong> Order #{{ orderId }}</p>
      </div>
    </div>

    <div class="payment-actions">
      <button 
        class="cancel-btn" 
        @click="$emit('cancel')"
        :disabled="processing"
      >
        Cancel
      </button>
      <button 
        class="confirm-btn" 
        @click="handlePayment"
        :disabled="processing"
      >
        <span v-if="processing">
          <i class="fas fa-spinner fa-spin"></i> Processing...
        </span>
        <span v-else>
          Confirm Payment
        </span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentMethod',
  
  props: {
    orderId: {
      type: [String, Number],
      required: true
    },
    amount: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      selectedMethod: 'card',
      processing: false,
      cardDetails: {
        number: '',
        expiry: '',
        cvv: '',
        name: ''
      },
      errors: {}
    };
  },

  methods: {
    async handlePayment() {
      this.processing = true;
      try {
        if (this.selectedMethod === 'card') {
          await this.handleCardPayment();
        } else {
          await this.handleBankPayment();
        }
      } catch (error) {
        this.$emit('payment-error', error.message);
      } finally {
        this.processing = false;
      }
    },

    async handleCardPayment() {
      // Validate card details
      if (!this.validateCardDetails()) {
        throw new Error('Please check your card details');
      }

      // Emit payment data to parent
      this.$emit('payment-confirmed', {
        method: 'card',
        details: this.cardDetails
      });
    },

    async handleBankPayment() {
      // Emit bank payment confirmation
      this.$emit('payment-confirmed', {
        method: 'bank',
        reference: `ORDER-${this.orderId}`
      });
    },

    validateCardDetails() {
      this.errors = {};
      let isValid = true;

      // Validate card number
      if (!this.cardDetails.number) {
        this.errors.cardNumber = 'Card number is required';
        isValid = false;
      } else {
        const cardType = this.getCardType(this.cardDetails.number);
        if (!cardType) {
          this.errors.cardNumber = 'Invalid card number';
          isValid = false;
        }
      }

      // Validate expiry date
      if (!this.cardDetails.expiry) {
        this.errors.expiry = 'Expiry date is required';
        isValid = false;
      } else if (!this.validateExpiryDate(this.cardDetails.expiry)) {
        this.errors.expiry = 'Invalid expiry date';
        isValid = false;
      }

      // Validate CVV
      if (!this.cardDetails.cvv) {
        this.errors.cvv = 'CVV is required';
        isValid = false;
      } else if (!this.validateCVV(this.cardDetails.cvv)) {
        this.errors.cvv = 'Invalid CVV';
        isValid = false;
      }

      return isValid;
    },

    getCardType(number) {
      // Remove spaces and dashes
      number = number.replace(/[\s-]/g, '');
      
      // Visa: starts with 4, length 13, 16, or 19
      if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(number)) {
        return 'visa';
      }
      
      // Mastercard: starts with 51-55 or 2221-2720, length 16
      if (/^(5[1-5][0-9]{14}|2[2-7][0-9]{14})$/.test(number)) {
        return 'mastercard';
      }
      
      // Verve: starts with 506099-506198, 650002-650027, length 16, 18, or 19
      if (/^(506099|5061[0-8][0-9]|5062[0-9][0-9]|5063[0-8][0-9]|50639[0-8]|650002|650003|650004|650005|650006|650007|650008|650009|65001[0-9]|65002[0-7])[0-9]{10,13}$/.test(number)) {
        return 'verve';
      }
      
      return null;
    },

    validateExpiryDate(expiry) {
      // Format: MM/YY
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        return false;
      }

      const [month, year] = expiry.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      // Check if month is valid (1-12)
      if (month < 1 || month > 12) {
        return false;
      }

      // Check if card is expired
      if (year < currentYear || (year == currentYear && month < currentMonth)) {
        return false;
      }

      return true;
    },

    validateCVV(cvv) {
      // CVV should be 3 or 4 digits
      return /^\d{3,4}$/.test(cvv);
    },

    formatCardNumber() {
      // Remove all non-digit characters
      let number = this.cardDetails.number.replace(/\D/g, '');
      
      // Add spaces after every 4 digits
      number = number.replace(/(\d{4})/g, '$1 ').trim();
      
      // Update the card number
      this.cardDetails.number = number;
      
      // Clear error if card type is valid
      if (this.getCardType(number)) {
        this.errors.cardNumber = '';
      }
    },

    formatExpiryDate() {
      let expiry = this.cardDetails.expiry.replace(/\D/g, '');
      
      if (expiry.length >= 2) {
        expiry = expiry.slice(0, 2) + '/' + expiry.slice(2, 4);
      }
      
      this.cardDetails.expiry = expiry;
    }
  }
};
</script>

<style scoped>
.payment-method {
  padding: 0;
}

.payment-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tab-btn {
  flex: 1;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.tab-btn:hover {
  border-color: #3498db;
  color: #3498db;
}

.tab-btn.active {
  background-color: #3498db;
  color: white;
  border-color: #3498db;
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  font-weight: 500;
  color: #2c3e50;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  width: 100%;
}

input:focus {
  outline: none;
  border-color: #3498db;
}

.bank-details {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.bank-info {
  margin-top: 1rem;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.bank-info p {
  margin-bottom: 0.5rem;
  color: #666;
}

.payment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn,
.confirm-btn {
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
}

.cancel-btn {
  background-color: #f8f9fa;
  color: #666;
  border: 1px solid #e0e0e0;
}

.cancel-btn:hover:not(:disabled) {
  background-color: #e9ecef;
}

.confirm-btn {
  background-color: #2ecc71;
  color: white;
  border: none;
}

.confirm-btn:hover:not(:disabled) {
  background-color: #27ae60;
}

.cancel-btn:disabled,
.confirm-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.card-types {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.card-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.card-type i {
  font-size: 1.2rem;
}

.card-type i.fa-cc-visa {
  color: #1A1F71;
}

.card-type i.fa-cc-mastercard {
  color: #EB001B;
}

.card-type i.fa-credit-card {
  color: #2E3192;
}

.error {
  border-color: #e74c3c !important;
}

.error-message {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

@media (max-width: 768px) {
  .payment-tabs {
    flex-direction: column;
    gap: 0.5rem;
  }

  .tab-btn {
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  .payment-form {
    gap: 0.75rem;
  }

  .form-group {
    gap: 0.25rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  label {
    font-size: 0.9rem;
  }

  input {
    padding: 0.6rem;
    font-size: 0.9rem;
  }

  .bank-details {
    padding: 1rem;
  }

  .bank-info {
    padding: 0.75rem;
  }

  .bank-info p {
    font-size: 0.9rem;
  }

  .payment-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .cancel-btn,
  .confirm-btn {
    width: 100%;
    padding: 0.75rem;
    font-size: 0.9rem;
  }

  .card-types {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  
  .card-type {
    font-size: 0.8rem;
  }
  
  .card-type i {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .tab-btn {
    padding: 0.6rem;
    font-size: 0.85rem;
  }

  .payment-form {
    gap: 0.5rem;
  }

  .form-group {
    gap: 0.2rem;
  }

  label {
    font-size: 0.85rem;
  }

  input {
    padding: 0.5rem;
    font-size: 0.85rem;
  }

  .bank-details {
    padding: 0.75rem;
  }

  .bank-info {
    padding: 0.5rem;
  }

  .bank-info p {
    font-size: 0.85rem;
    margin-bottom: 0.4rem;
  }

  .payment-actions {
    gap: 0.5rem;
  }

  .cancel-btn,
  .confirm-btn {
    padding: 0.6rem;
    font-size: 0.85rem;
  }

  .card-types {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  
  .card-type {
    font-size: 0.8rem;
  }
  
  .card-type i {
    font-size: 1.1rem;
  }
}
</style> 