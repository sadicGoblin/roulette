import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

declare var google: any;


@Component({
  selector: 'app-txtgplaces',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './txtgplaces.component.html',
  styleUrl: './txtgplaces.component.scss'
})
export class TxtgplacesComponent implements AfterViewInit{
  @Output() selectedPlace = new EventEmitter<any>();
  @ViewChild('autocomplete') autocompleteElement!: ElementRef;
  data = null;

  ngAfterViewInit(): void {
        
    const autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete')
    );
    
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const processedPlace = this.processPlaceData(place)
      this.selectedPlace.emit(processedPlace);
      // console.log(place); // Aquí tienes los datos de la ubicación seleccionada
      // console.log(processedPlace);
    });
  }

  processPlaceData(place: any): any | null {
    if (!place) return null;

    // Create a new object to hold only the processed data
    const processedData = {
      formattedAddress: place.formatted_address,
      // Add other properties you need from 'place'
      // Example:
      streetNumber: this.extractStreetNumber(place.address_components),
      street: this.extractStreetName(place.address_components),
      commune: this.extractCommuneName(place.address_components),
      postal_code: this.extractPostalCodeName(place.address_components),
      city: this.extractCity(place.address_components),
      // ...and so on...
      geometry: {
        lat: place.geometry?.location?.lat(),
        lng: place.geometry?.location?.lng()
      },
    };

    return processedData;
  }

  // Helper functions to extract specific data (adapt to your needs)
  extractStreetNumber(addressComponents: any[]): string {
    const streetNumberComponent = addressComponents.find((component: any) => component.types.includes('street_number'));
    return streetNumberComponent?.long_name || ''; // Retorna "" si es undefined
  }

  extractStreetName(addressComponents: any[]): string {
    const streetNameComponent = addressComponents.find((component: any) => component.types.includes('route'));
    return streetNameComponent?.long_name || ''; // Retorna "" si es undefined
  }

  extractCommuneName(addressComponents: any[]): string {
    const communeComponent = addressComponents.find((component: any) => component.types.includes('administrative_area_level_3'));
    return communeComponent?.long_name || ''; // Retorna "" si es undefined
  }

  extractPostalCodeName(addressComponents: any[]): string {
    const postalCodeComponent = addressComponents.find((component: any) => component.types.includes('postal_code'));
    return postalCodeComponent?.long_name || ''; // Retorna "" si es undefined
  }

  extractCity(addressComponents: any[]): string {
    const cityComponent = addressComponents.find((component: any) => component.types.includes('locality'));
    return cityComponent?.long_name || ''; // Retorna "" si es undefined
  }


}
