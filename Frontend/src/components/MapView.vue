<template>
  <div class="map-container">
    <div id="map" ref="mapContainer"></div>
    <div v-if="geocodingError" class="geocoding-error">
      <p>Unable to find exact location. Showing approximate area.</p>
    </div>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default {
  name: 'MapView',
  props: {
    location: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      map: null,
      marker: null,
      geocodingError: false
    };
  },
  mounted() {
    console.log('MapView mounted, location:', this.location);
    if (this.location) {
      this.initializeMap();
    }
  },
  methods: {
    async initializeMap() {
      if (!this.location) {
        console.log('No location provided');
        return;
      }

      try {
        console.log('Fetching coordinates for:', this.location);
        // Use Nominatim API to geocode the location
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.location)}`
        );
        const data = await response.json();
        console.log('Geocoding response:', data);

        let coordinates;
        if (data && data.length > 0) {
          coordinates = {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon)
          };
          this.geocodingError = false;
        } else {
          // Fallback to Nigeria coordinates if location not found
          coordinates = {
            lat: 9.0820,  
            lon: 8.6753
          };
          this.geocodingError = true;
        }

        console.log('Using coordinates:', coordinates);
        
        // Initialize map if not already initialized
        if (!this.map) {
          console.log('Initializing new map');
          this.map = L.map(this.$refs.mapContainer).setView([coordinates.lat, coordinates.lon], 6);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(this.map);
        } else {
          console.log('Updating existing map');
          this.map.setView([coordinates.lat, coordinates.lon], 6);
        }

        // Add or update marker
        if (this.marker) {
          this.marker.setLatLng([coordinates.lat, coordinates.lon]);
        } else {
          this.marker = L.marker([coordinates.lat, coordinates.lon]).addTo(this.map);
        }

        // Add a popup to the marker
        this.marker.bindPopup(this.location).openPopup();

        // Force a resize event to ensure the map renders properly
        setTimeout(() => {
          this.map.invalidateSize();
        }, 100);

      } catch (error) {
        console.error('Error initializing map:', error);
        this.geocodingError = true;
      }
    }
  },
  watch: {
    location: {
      handler(newLocation) {
        console.log('Location changed to:', newLocation);
        if (newLocation) {
          this.$nextTick(() => {
            this.initializeMap();
          });
        }
      }
    }
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  }
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

#map {
  width: 100%;
  height: 100%;
  z-index: 1;
}

.geocoding-error {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  padding: 8px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2;
  font-size: 14px;
  color: #666;
}

/* Fix Leaflet CSS issues */
:deep(.leaflet-container) {
  width: 100%;
  height: 100%;
}
</style> 