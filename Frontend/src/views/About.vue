<template>
    <section class="py-5 bg-light mt-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-4 mb-lg-0">
            <img src="https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                 alt="About OS Market" 
                 class="img-fluid rounded shadow">
          </div>
          <div class="col-lg-6">
            <h2 class="display-4 fw-bold mb-4">About OS Market</h2>
            <p class="lead mb-4">
              OS Market is a revolutionary platform that connects buyers and sellers in an open-source marketplace. 
              Our mission is to create a transparent and efficient ecosystem for service exchange.
            </p>
            <div class="row g-4 mb-4">
              <div class="col-md-6">
                <div class="d-flex align-items-center">
                  <div class="me-3">
                    <i class="bi bi-shield-check text-primary fs-2"></i>
                  </div>
                  <div>
                    <h5 class="fw-bold mb-1">Secure Transactions</h5>
                    <p class="mb-0">Safe and reliable payment processing</p>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="d-flex align-items-center">
                  <div class="me-3">
                    <i class="bi bi-people text-primary fs-2"></i>
                  </div>
                  <div>
                    <h5 class="fw-bold mb-1">Verified Users</h5>
                    <p class="mb-0">Trusted community of buyers and sellers</p>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="d-flex align-items-center">
                  <div class="me-3">
                    <i class="bi bi-graph-up text-primary fs-2"></i>
                  </div>
                  <div>
                    <h5 class="fw-bold mb-1">Growth Opportunities</h5>
                    <p class="mb-0">Expand your business reach</p>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="d-flex align-items-center">
                  <div class="me-3">
                    <i class="bi bi-chat-dots text-primary fs-2"></i>
                  </div>
                  <div>
                    <h5 class="fw-bold mb-1">24/7 Support</h5>
                    <p class="mb-0">Always here to help you</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex gap-3">
              <router-link to="/signup" class="btn btn-primary btn-lg">
                Get Started
              </router-link>
              <router-link to="/contact" class="btn btn-outline-primary btn-lg">
                Contact Us
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>

  </script>
  
  <style scoped>
  section {
    background-color: #f8f9fa;
  }
  </style>