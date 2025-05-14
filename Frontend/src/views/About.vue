<template>
  <section class="about-section">
    <div class="container">
      <div class="row align-items-center justify-content-center">
        <div class="col-lg-5 mb-4 mb-lg-0">
          <div class="image-container">
            <img src="https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                 alt="About OS Market" 
                 class="img-fluid rounded shadow-lg hover-zoom">
            <div class="image-overlay"></div>
          </div>
        </div>
        <div class="col-lg-6 offset-lg-1">
          <div class="content-wrapper">
            <span class="section-subtitle">Welcome to</span>
            <h2 class="section-title">OS Market</h2>
            <p class="section-description">
              OS Market is a revolutionary platform that connects buyers and sellers in an open-source marketplace. 
              Our mission is to create a transparent and efficient ecosystem for service exchange.
            </p>
            <div class="row g-4 mb-4">
              <div class="col-md-6">
                <div class="feature-card">
                  <div class="d-flex align-items-center">
                    <div class="icon-wrapper me-3">
                      <i class="bi bi-shield-check text-primary"></i>
                    </div>
                    <div>
                      <h5>Secure Transactions</h5>
                      <p>Safe and reliable payment processing</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="feature-card">
                  <div class="d-flex align-items-center">
                    <div class="icon-wrapper me-3">
                      <i class="bi bi-people text-primary"></i>
                    </div>
                    <div>
                      <h5>Verified Users</h5>
                      <p>Trusted community of buyers and sellers</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="feature-card">
                  <div class="d-flex align-items-center">
                    <div class="icon-wrapper me-3">
                      <i class="bi bi-graph-up text-primary"></i>
                    </div>
                    <div>
                      <h5>Growth Opportunities</h5>
                      <p>Expand your business reach</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="feature-card">
                  <div class="d-flex align-items-center">
                    <div class="icon-wrapper me-3">
                      <i class="bi bi-chat-dots text-primary"></i>
                    </div>
                    <div>
                      <h5>24/7 Support</h5>
                      <p>Always here to help you</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex gap-3">
              <router-link to="/signup" class="btn btn-primary btn-gradient">
                Get Started
              </router-link>
              <router-link to="/contact" class="btn btn-outline-primary btn-hover">
                Contact Us
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AboutPage'
}
</script>

<style scoped>
.about-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 3rem 0;
}

.image-container {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  height: 100%;
  display: flex;
  align-items: center;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  min-height: 450px;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(0,0,0,0.05), rgba(0,0,0,0));
  transition: all 0.3s ease;
}

.hover-zoom {
  transition: transform 0.5s ease;
}

.image-container:hover .hover-zoom {
  transform: scale(1.03);
}

.image-container:hover .image-overlay {
  background: linear-gradient(45deg, rgba(0,0,0,0.1), rgba(0,0,0,0));
}

.content-wrapper {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.section-subtitle {
  color: #007bff;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
  display: block;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #007bff, #6610f2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #6c757d;
  margin-bottom: 2rem;
}

.feature-card {
  padding: 1.25rem;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.feature-card h5 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #2c3e50;
}

.feature-card p {
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0;
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 123, 255, 0.08);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.icon-wrapper i {
  font-size: 1.25rem;
}

.feature-card:hover .icon-wrapper {
  background: rgba(0, 123, 255, 0.12);
  transform: rotate(8deg);
}

.btn {
  padding: 0.6rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 6px;
}

.btn-gradient {
  background: linear-gradient(45deg, #007bff, #6610f2);
  border: none;
  color: white;
  transition: all 0.3s ease;
}

.btn-gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
  color: white;
}

.btn-hover {
  transition: all 0.3s ease;
}

.btn-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
}

@media (max-width: 991px) {
  .image-container img {
    min-height: 400px;
  }
  
  .content-wrapper {
    padding: 1.75rem;
    margin-top: 2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .about-section {
    padding: 2rem 0;
  }
  
  .image-container img {
    min-height: 300px;
  }
  
  .content-wrapper {
    padding: 1.5rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .feature-card {
    padding: 1rem;
  }
}
</style>