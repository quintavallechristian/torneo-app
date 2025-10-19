'use client';

import { useEffect, useState } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Input } from '../ui/input';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  onSelect?: (value: { address: string; lat: number; lng: number }) => void;
  address?: { address: string; lat: number; lng: number } | null;
};

export default function AddressPickerInner({ onSelect, address }: Props) {
  const [selected, setSelected] = useState(address || null);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  // 🟢 sincronizza input e mappa quando cambia la prop `address`
  useEffect(() => {
    if (address) {
      setSelected(address);
      setValue(address.address, false);
    }
  }, [address, setValue]);

  const MapUpdater = () => {
    const map = useMap();
    useEffect(() => {
      if (selected) map.setView([selected.lat, selected.lng], 15);
    }, [selected, map]);
    return null;
  };

  const handleSelect = async (description: string) => {
    setValue(description, false);
    clearSuggestions();

    const results = await getGeocode({ address: description });
    const { lat, lng } = await getLatLng(results[0]);

    const newValue = { address: description, lat, lng };
    setSelected(newValue);
    onSelect?.(newValue);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          placeholder="Cerca il tuo indirizzo"
          className="border p-2 rounded w-full"
        />
        {status === 'OK' && (
          <ul className="absolute z-10 bg-slate-700 border rounded w-full mt-1 max-h-48 overflow-y-auto shadow">
            {data.map(({ place_id, description }) => (
              <li
                key={place_id}
                className="p-2 hover:bg-slate-900 cursor-pointer"
                onClick={() => handleSelect(description)}
              >
                {description}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected && (
        <div className="h-[300px] w-full rounded overflow-hidden border">
          <MapContainer
            center={[selected.lat, selected.lng]}
            zoom={15}
            scrollWheelZoom={false}
            className="h-full w-full z-0"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[selected.lat, selected.lng]} icon={markerIcon} />
            <MapUpdater />
          </MapContainer>
        </div>
      )}
    </div>
  );
}
