import React from 'react'
import ReactDOM from 'react-dom'
import mapboxgl from 'mapbox-gl'
import Tooltip from './components/tooltip'
import './style.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

class Application extends React.Component {
  tooltipContainer;
  
  setTooltip(features) {
    if (features.length) {
      ReactDOM.render(
        React.createElement(
          Tooltip, {
            features
          }
        ),
        this.tooltipContainer
      );
    } else {
      this.tooltipContainer.innerHTML = '';
    }
  }

  componentDidMount() {

    // Container to put React generated content in.
    this.tooltipContainer = document.createElement('div');
    getGeo();
    
    const currentPosition = [];
    
    function error(err) {
        console.log(err);
    }

    function getGeo(){
        console.log('initialized');
        const geoLocation = navigator.geolocation.getCurrentPosition(showPosition, error,{timeout:10000});
    }

    function showPosition(position) {
        console.log('this', position);
        console.log('aaya');
        currentPosition.push(position.coords.latitude);
        currentPosition.push(position.coords.longitude);
        console.log(currentPosition);
    }

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [73.11, 18.932245],
      zoom: 10
    });

    const tooltip = new mapboxgl.Marker(this.tooltipContainer, {
      offset: [-120, 0]
    }).setLngLat([0,0]).addTo(map);
    
    map.on('mousemove', (e) => {
      const features = map.queryRenderedFeatures(e.point);
      tooltip.setLngLat(e.lngLat);
      map.getCanvas().style.cursor = features.length ? 'pointer' : '';
      this.setTooltip(features);
    });
  }

  render() {
    return (
      <div ref={el => this.mapContainer = el} className="map" />
    );
  }
}

ReactDOM.render(<Application />, document.getElementById('app'));
