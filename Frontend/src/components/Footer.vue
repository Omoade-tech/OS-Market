<template>
    <footer class="text-muted py-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-3">
            <h5 class="text-dark mb-3">OS Market</h5>
            <p class="small">
              A community-driven platform for discovering, sharing, buying and selling aroud the  world.
            </p>
          </div>
  
          <div class="col-md-3">
            <h5 class="text-dark mb-3">Quick Links</h5>
            <ul class="list-unstyled">
              <li class="mb-2"><a href="/" class="text-muted text-decoration-none">Home</a></li>
              <li class="mb-2"><a href="/projects" class="text-muted text-decoration-none">Projects</a></li>
              <li class="mb-2"><a href="/submit" class="text-muted text-decoration-none">Submit Project</a></li>
              <li class="mb-2"><a href="/about" class="text-muted text-decoration-none">About Us</a></li>
            </ul>
          </div>
  
          <div class="col-md-3">
            <h5 class="text-dark mb-3">Contact Us</h5>
            <p class="small mb-2">Email: support@osmarket.org</p>
            <p class="small">Phone: +1 (800) 555-OPEN</p>
          </div>
  
          <div class="col-md-3">
            <h5 class="text-dark mb-3">Follow Us</h5>
            <div class="d-flex gap-3">
              <a href="https://twitter.com/osmarket" target="_blank" class="text-muted">
                <i class="fab fa-twitter fs-4"></i>
              </a>
              <a href="https://linkedin.com/company/osmarket" target="_blank" class="text-muted">
                <i class="fab fa-linkedin fs-4"></i>
              </a>
              <a href="https://github.com/osmarket" target="_blank" class="text-muted">
                <i class="fab fa-github fs-4"></i>
              </a>
              <a href="https://instagram.com/osmarket" target="_blank" class="text-muted">
                <i class="fab fa-instagram fs-4"></i>
              </a>
            </div>
          </div>
        </div>
  
        <div class="border-top mt-4 pt-3 text-center">
          <p class="small mb-0">&copy; {{ currentYear }} OS Market. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'Footer',
    data() {
      return {
        currentYear: new Date().getFullYear(),
      };
    },
  };
  </script>
  
  <style scoped>
  a:hover {
    color: #007bff !important;
  }
  footer {
    background-color: #ddd;
  }
  </style>
  