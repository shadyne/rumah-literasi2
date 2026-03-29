import * as React from 'react';
import useSWR from 'swr';
import { fetcher } from '@/libs/axios';

export const useLocation = (
	{ province_id, city_id } = {
		province_id: null,
		city_id: null,
	}
) => {
	const [province, setProvince] = React.useState(province_id);
	const [city, setCity] = React.useState(city_id);

	const {
		data: provincesData,
		error: provincesError,
		isLoading: provincesLoading,
	} = useSWR('/teritories', fetcher);

	const {
		data: citiesData,
		error: citiesError,
		isLoading: citiesLoading,
	} = useSWR(province ? '/teritories/' + province : null, fetcher);

	const {
		data: districtsData,
		error: districtsError,
		isLoading: districtsLoading,
	} = useSWR(
		province && city ? '/teritories/' + province + '/' + city : null,
		fetcher
	);

	const handleProvinceChange = (provinceId) => {
		setProvince(provinceId);
		setCity(null);
	};

	const handleCityChange = (cityId) => {
		setCity(cityId);
	};

	const provinces = provincesData ? provincesData.data : [];
	const cities = citiesData ? citiesData.data : [];
	const districts = districtsData ? districtsData.data : [];

	const error = provincesError || citiesError || districtsError;
	const loading = {
		provinces: provincesLoading,
		districts: districtsLoading,
		cities: citiesLoading,
	};

	return {
		provinces,
		cities,
		districts,
		province,
		city,
		handleProvinceChange,
		handleCityChange,
		loading,
		error,
	};
};
