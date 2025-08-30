import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ReportsMap = ({ reports = [], fullScreen = false, isLoading = false }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);

  // OpenRouteService API key
  const ORS_API_KEY = '5b3ce3597851110001cf62485d8d8d067b94895b9ae2c86d6085f2a';

  // Geocoding function using OpenRouteService
  const searchLocation = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(query)}&boundary.country=BD&size=5`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const [lng, lat] = feature.geometry.coordinates;
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 12);
          
          // Add a temporary marker for the search result
          const searchMarker = L.marker([lat, lng], {
            icon: L.divIcon({
              html: `<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
              className: 'search-marker',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })
          }).addTo(mapInstanceRef.current);
          
          searchMarker.bindPopup(`
            <div class="p-2">
              <h3 class="font-bold text-sm">${feature.properties.label}</h3>
              <p class="text-xs text-gray-600">Search Result</p>
            </div>
          `).openPopup();
          
          // Remove search marker after 10 seconds
          setTimeout(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.removeLayer(searchMarker);
            }
          }, 10000);
        }
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([23.6850, 90.3563], 7); // Bangladesh center


    
    // Add OpenStreetMap tiles (OpenRouteService uses OSM data)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors | Powered by OpenRouteService',
      maxZoom: 18
    }).addTo(map);

    mapInstanceRef.current = map;

    // Add routing functionality using OpenRouteService
    const addRouting = async (startCoords, endCoords) => {
      try {
        const response = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${startCoords[1]},${startCoords[0]}&end=${endCoords[1]},${endCoords[0]}`);
        const data = await response.json();
        
        if (data.features && data.features[0]) {
          const coordinates = data.features[0].geometry.coordinates;
          const latLngs = coordinates.map(coord => [coord[1], coord[0]]);
          
          L.polyline(latLngs, {
            color: '#22c55e',
            weight: 4,
            opacity: 0.7
          }).addTo(map);
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    // Custom icons for different report types and statuses
    const getMarkerIcon = (report) => {
      let color = '#gray';
      if (report.status === 'pending') color = '#fbbf24'; // yellow
      else if (report.status === 'accepted') color = '#10b981'; // green
      else if (report.status === 'rejected') color = '#ef4444'; // red

      return L.divIcon({
        html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        className: 'custom-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
    };

    // Clear existing markers first
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    console.log('📍 Adding markers for', reports.length, 'reports');

    // Add markers for each report
    reports.forEach((report, index) => {
      // Ensure coordinates are valid numbers
      const lat = typeof report.location?.lat === 'number' ? report.location.lat : parseFloat(report.location?.lat || 0);
      const lng = typeof report.location?.lng === 'number' ? report.location.lng : parseFloat(report.location?.lng || 0);
      
      console.log(`📍 Report ${index + 1}:`, {
        id: report.id,
        type: report.type,
        lat: lat,
        lng: lng,
        status: report.status,
        originalLat: report.location?.lat,
        originalLng: report.location?.lng
      });
      
      // Skip invalid coordinates
      if (isNaN(lat) || isNaN(lng)) {
        console.warn('❌ Invalid coordinates for report:', report.id, { lat, lng, original: report.location });
        return;
      }

      // Skip coordinates that are exactly 0,0 (likely invalid)
      if (lat === 0 && lng === 0) {
        console.warn('⚠️ Zero coordinates for report:', report.id);
        return;
      }
      
      try {
        const marker = L.marker([lat, lng], {
          icon: getMarkerIcon(report)
        }).addTo(map);

        console.log('✅ Marker added for report:', report.id, 'at', [lat, lng]);

        // Create popup content with enhanced features
        const popupContent = `
          <div class="p-3 min-w-[280px]">
            <h3 class="font-bold text-lg mb-2 text-gray-800">${report.type || 'Unknown Type'}</h3>
            <p class="text-sm text-gray-600 mb-2 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
              ${report.location?.name || 'Unknown Location'}
            </p>
            <p class="text-sm mb-3 text-gray-700">${report.description || 'No description available'}</p>
            
            <div class="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div class="text-gray-500">
                <span class="font-medium">Reporter:</span><br>
                ${report.reporter || 'Anonymous'}
              </div>
              <div class="text-gray-500">
                <span class="font-medium">Date:</span><br>
                ${report.date || 'Unknown'}
              </div>
            </div>
            
            <div class="flex justify-between items-center mb-3">
              <span class="px-2 py-1 rounded text-xs font-medium ${
                (report.status || 'pending') === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                (report.status || 'pending') === 'accepted' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }">
                ${((report.status || 'pending').charAt(0).toUpperCase() + (report.status || 'pending').slice(1))}
              </span>
              <span class="text-xs text-gray-500">
                Points: ${report.points || 0}
              </span>
            </div>
            
            <div class="flex space-x-2">
              <button 
                onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}', '_blank')"
                class="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-2 px-3 rounded font-medium transition-colors"
              >
                Get Directions
              </button>
              <button 
                onclick="navigator.geolocation.getCurrentPosition(function(pos) { 
                  window.open('https://www.openrouteservice.org/directions?n1=${lat}&n2=${lng}&n3=16&a=' + pos.coords.latitude + ',' + pos.coords.longitude + ',${lat},${lng}&b=0&c=0&k1=en-US&k2=km', '_blank')
                })"
                class="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-3 rounded font-medium transition-colors"
              >
                Route (ORS)
              </button>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
      } catch (error) {
        console.error('❌ Error creating marker for report:', report.id, error);
      }
    });

    // Auto-fit map to show all markers if there are reports
    if (reports.length > 0) {
      const validReports = reports.filter(report => {
        const lat = parseFloat(report.location?.lat || 0);
        const lng = parseFloat(report.location?.lng || 0);
        return !isNaN(lat) && !isNaN(lng) && !(lat === 0 && lng === 0);
      });

      if (validReports.length > 0) {
        const group = new L.featureGroup(
          validReports.map(report => {
            const lat = parseFloat(report.location.lat);
            const lng = parseFloat(report.location.lng);
            return L.marker([lat, lng]);
          })
        );
        
        try {
          map.fitBounds(group.getBounds().pad(0.1));
          console.log('🗺️ Map bounds adjusted to fit', validReports.length, 'markers');
        } catch (error) {
          console.warn('⚠️ Could not fit bounds, using default view');
          map.setView([23.6850, 90.3563], 7);
        }
      }
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [reports]);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${fullScreen ? 'h-full' : ''}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Reports Location Map</h3>
            <p className="text-sm text-gray-600">Interactive map showing all reported incidents</p>
          </div>
          
          {/* Map Search */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search locations in India..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchLocation(searchQuery)}
                className="w-64 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isSearching}
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                </div>
              )}
            </div>
            <button
              onClick={() => searchLocation(searchQuery)}
              disabled={isSearching || !searchQuery.trim()}
              className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="relative">
        <div 
          ref={mapRef} 
          className={`w-full ${fullScreen ? 'h-[calc(100vh-200px)]' : 'h-96'} rounded-b-xl`}
        />
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-b-xl">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading reports...</p>
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && reports.length === 0 && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-b-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Reports Found</h3>
              <p className="text-sm text-gray-600">There are currently no reports to display on the map.</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Legend and Controls */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-full border-2 border-white shadow"></div>
              <span className="text-gray-600">
                Pending ({reports.filter(r => (r.status || 'pending') === 'pending').length})
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow"></div>
              <span className="text-gray-600">
                Accepted ({reports.filter(r => (r.status || 'pending') === 'accepted').length})
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow"></div>
              <span className="text-gray-600">
                Rejected ({reports.filter(r => (r.status || 'pending') === 'rejected').length})
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 font-medium">
                Total: {reports.length} reports
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>Powered by OpenRouteService</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsMap;