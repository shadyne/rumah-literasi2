import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

import * as React from 'react';
import {
	MapContainer,
	Marker,
	TileLayer,
	useMap,
	useMapEvents,
} from 'react-leaflet';
import { cn } from '@/libs/utils';
import { DEFAULT_LOCATION } from '@/libs/constant';

const isValidCoordinate = (value) =>
	value !== null && value !== undefined && value !== '' &&
	Number.isFinite(Number(value));

const MapEvent = ({ handleClick }) => {
	useMapEvents({
		click: (e) => {
			handleClick(e.latlng);
		},
	});
	return null;
};

const ChangeView = ({ lat, lng }) => {
	const map = useMap();

	React.useEffect(() => {
		if (lat && lng) {
			map.flyTo([lat, lng], 15);
		}
	}, [map, lat, lng]);

	return null;
};

export const Map = ({ location, setLocation = () => {}, className }) => {
	const handleClick = (latlng) => {
		setLocation({
			latitude: latlng.lat,
			longitude: latlng.lng,
		});
	};

	const hasLocation =
		isValidCoordinate(location?.latitude) &&
		isValidCoordinate(location?.longitude);

	const lat = hasLocation
		? Number(location.latitude)
		: DEFAULT_LOCATION.latitude;
	const lng = hasLocation
		? Number(location.longitude)
		: DEFAULT_LOCATION.longitude;

	return (
		<MapContainer
			zoom={15}
			scrollWheelZoom={false}
			center={[lat, lng]}
			className={cn('w-full border rounded-xl z-0', className)}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			/>
			{hasLocation && <ChangeView lat={lat} lng={lng} />}
			{hasLocation && <Marker position={[lat, lng]} />}
			<MapEvent handleClick={handleClick} />
		</MapContainer>
	);
};
