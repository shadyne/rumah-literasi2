import * as React from 'react';
import * as z from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Map } from '@/components/map';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Hint } from '@/components/ui/hint';
import { cn } from '@/libs/utils';
import { DEFAULT_LOCATION } from '@/libs/constant';
import { useLocation } from '@/hooks/use-location';
import { reverseGeocode } from '@/libs/geocoder';

// Batas kasar wilayah Indonesia untuk validasi koordinat manual.
const ID_BOUNDS = { latMin: -11, latMax: 6.5, lngMin: 94.5, lngMax: 141.5 };

const AddressSchema = z.object({
	name: z.string().min(1, 'Nama alamat wajib diisi'),
	contact_name: z.string().min(1, 'Nama kontak wajib diisi'),
	contact_phone: z.string().min(1, 'No. telepon wajib diisi'),
	street_address: z.string().min(3, 'Alamat jalan terlalu pendek'),
	province_id: z.string().min(1, 'Pilih provinsi'),
	city_id: z.string().min(1, 'Pilih kota'),
	district_name: z.string().min(1, 'Kecamatan wajib diisi'),
	latitude: z.coerce
		.number({ invalid_type_error: 'Latitude wajib diisi' })
		.min(ID_BOUNDS.latMin, 'Latitude di luar wilayah Indonesia')
		.max(ID_BOUNDS.latMax, 'Latitude di luar wilayah Indonesia'),
	longitude: z.coerce
		.number({ invalid_type_error: 'Longitude wajib diisi' })
		.min(ID_BOUNDS.lngMin, 'Longitude di luar wilayah Indonesia')
		.max(ID_BOUNDS.lngMax, 'Longitude di luar wilayah Indonesia'),
	zipcode: z.string().regex(/^\d{5}$/, 'Kode pos harus 5 digit angka'),
	note: z.string().optional(),
	formatted_address: z.string().optional(),
	location_source: z
		.enum(['geocoded', 'manual_drag', 'centroid_fallback', 'user_location'])
		.optional(),
	is_location_confirmed: z.boolean().optional(),
});

const normalizeAdminName = (name) =>
	String(name || '')
		.toLowerCase()
		.replace(/^(kabupaten|kota administrasi|kota|provinsi|kecamatan|daerah khusus ibukota|daerah istimewa)\s+/i, '')
		.replace(/\s+/g, ' ')
		.trim();

const adminNameMatches = (a, b) => {
	const na = normalizeAdminName(a);
	const nb = normalizeAdminName(b);
	if (!na || !nb) return false;
	if (na === nb || na.includes(nb) || nb.includes(na)) return true;
	const ca = na.replace(/\s+/g, '');
	const cb = nb.replace(/\s+/g, '');
	return ca === cb || ca.includes(cb) || cb.includes(ca);
};

const PROVINCE_FIELDS = ['state', 'province', 'region', 'city', 'county'];
const CITY_FIELDS = ['city', 'county', 'town', 'municipality', 'state_district'];

// Cek kecocokan wilayah terhadap field address + segmen display_name.
const probeAdmin = (addr, displayName, fields, targetName) => {
	if (!targetName) return { matched: null, value: '' };

	for (const f of fields) {
		const v = addr[f];
		if (v && adminNameMatches(v, targetName)) {
			return { matched: true, value: v };
		}
	}

	const segments = String(displayName || '')
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
	const segmentHit = segments.find((s) => adminNameMatches(s, targetName));
	if (segmentHit) return { matched: true, value: segmentHit };

	const fallback = fields.map((f) => addr[f]).find(Boolean) || '';
	return { matched: fallback ? false : null, value: fallback };
};

const AddressForm = ({ initial, action, label }) => {
	const [validation, setValidation] = React.useState(null);
	const [validating, setValidating] = React.useState(false);
	const [submitError, setSubmitError] = React.useState('');
	// Toggle lokasi otomatis (GPS). Default OFF = user isi manual / geser peta.
	const [useGps, setUseGps] = React.useState(false);
	const {
		province,
		provinces,
		cities,
		loading,
		handleCityChange,
		handleProvinceChange,
	} = useLocation(
		initial && {
			province_id: initial.province_id,
			city_id: initial.city_id,
		}
	);

	const {
		control,
		watch,
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(AddressSchema),
		defaultValues: initial || {
			name: '',
			contact_name: '',
			contact_phone: '',
			street_address: '',
			province_id: '',
			city_id: '',
			district_name: '',
			zipcode: '',
			note: '',
			formatted_address: '',
			location_source: undefined,
			is_location_confirmed: false,
			...DEFAULT_LOCATION,
		},
	});

	const watchedCityId = watch('city_id');
	const watchedProvinceId = watch('province_id');
	const watchedZipcode = watch('zipcode');
	const lat = watch('latitude');
	const lng = watch('longitude');

	const provinceName = React.useMemo(
		() =>
			provinces.find((p) => String(p.id) === String(watchedProvinceId))?.name ||
			'',
		[provinces, watchedProvinceId]
	);
	const cityName = React.useMemo(
		() => cities.find((c) => String(c.id) === String(watchedCityId))?.name || '',
		[cities, watchedCityId]
	);

	// Verifikasi lunak: cocokkan titik peta dengan provinsi/kota + saran kode pos.
	React.useEffect(() => {
		if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
			setValidation(null);
			return;
		}

		setValidating(true);
		const handler = setTimeout(async () => {
			const result = await reverseGeocode(lat, lng);
			setValidating(false);
			if (!result) {
				setValidation({ displayAddress: '' });
				return;
			}
			const addr = result.address;
			const dn = result.display_name;
			const provinceProbe = probeAdmin(addr, dn, PROVINCE_FIELDS, provinceName);
			const cityProbe = probeAdmin(addr, dn, CITY_FIELDS, cityName);
			const osmPostcode = addr.postcode || '';

			setValidation({
				displayAddress: result.display_name,
				osmProvince: provinceProbe.value,
				osmCity: cityProbe.value,
				osmPostcode,
				provinceMatch: provinceName ? provinceProbe.matched : null,
				cityMatch: cityName ? cityProbe.matched : null,
				zipcodeMatch:
					osmPostcode && watchedZipcode
						? osmPostcode === watchedZipcode
						: null,
			});
			setValue('formatted_address', result.display_name || '', {
				shouldDirty: true,
			});
		}, 800);
		return () => clearTimeout(handler);
	}, [lat, lng, provinceName, cityName, watchedZipcode, setValue]);

	const applyCoordinate = (nextLat, nextLng, source) => {
		setValue('latitude', nextLat, { shouldDirty: true, shouldValidate: true });
		setValue('longitude', nextLng, { shouldDirty: true, shouldValidate: true });
		setValue('location_source', source, { shouldDirty: true });
		setValue('is_location_confirmed', false, { shouldDirty: true });
	};

	// Ambil koordinat dari GPS perangkat. Dipakai saat toggle GPS dinyalakan
	// dan saat tombol "Perbarui Lokasi" ditekan.
	const fetchGps = () => {
		if (!('geolocation' in navigator)) {
			alert('Browser Anda tidak mendukung geolokasi.');
			setUseGps(false);
			return;
		}
		navigator.geolocation.getCurrentPosition(
			(position) => {
				applyCoordinate(
					position.coords.latitude,
					position.coords.longitude,
					'user_location'
				);
			},
			() => {
				alert(
					'Tidak dapat mengambil lokasi Anda. Periksa izin lokasi browser, atau matikan GPS untuk mengisi koordinat manual.'
				);
				setUseGps(false);
			},
			{ enableHighAccuracy: true }
		);
	};

	const handleToggleGps = (next) => {
		setUseGps(next);
		if (next) fetchGps();
	};

	const guardedSubmit = (values) => {
		setSubmitError('');
		if (!values.is_location_confirmed) {
			setSubmitError(
				'Centang konfirmasi posisi marker di peta sebelum menyimpan.'
			);
			return;
		}
		return action(values);
	};

	return (
		<form onSubmit={handleSubmit(guardedSubmit)} className='grid gap-6 lg:grid-cols-2'>
			<div>
				<Label htmlFor='contact_name'>Nama Kontak</Label>
				<Input placeholder='Masukkan nama kontak' {...register('contact_name')} />
				<Hint>Nama orang yang dapat dihubungi pada alamat ini.</Hint>
				{errors.contact_name && (
					<span className='text-red-500'>{errors.contact_name.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='contact_phone'>No. Telepon Kontak</Label>
				<Input placeholder='Masukkan nomor telepon' {...register('contact_phone')} />
				<Hint>Nomor telepon orang yang dapat dihubungi.</Hint>
				{errors.contact_phone && (
					<span className='text-red-500'>{errors.contact_phone.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='name'>Nama Alamat</Label>
				<Input
					placeholder='Masukkan nama alamat (misal: Rumah, Kantor)'
					{...register('name')}
				/>
				<Hint>Nama deskriptif untuk lokasi ini.</Hint>
				{errors.name && (
					<span className='text-red-500'>{errors.name.message}</span>
				)}
			</div>

			<div className='col-span-full'>
				<Label htmlFor='street_address'>Alamat Jalan</Label>
				<Textarea
					placeholder='Masukkan alamat lengkap, misal: Jl. Mawar No.10'
					{...register('street_address')}
				/>
				<Hint>Tulis alamat selengkap mungkin agar mudah ditemukan kurir.</Hint>
				{errors.street_address && (
					<span className='text-red-500'>{errors.street_address.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='province_id'>Provinsi</Label>
				<Controller
					name='province_id'
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							onChange={(e) => {
								field.onChange(e);
								handleProvinceChange(e.target.value);
								setValue('city_id', '');
							}}
							disabled={loading.provinces}>
							<option value=''>Pilih provinsi</option>
							{provinces.map((p) => (
								<option key={p.id} value={p.id}>
									{p.name}
								</option>
							))}
						</Select>
					)}
				/>
				<Hint>Pilih provinsi tempat alamat ini berada.</Hint>
				{errors.province_id && (
					<span className='text-red-500'>{errors.province_id.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='city_id'>Kota / Kabupaten</Label>
				<Controller
					name='city_id'
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							onChange={(e) => {
								field.onChange(e);
								handleCityChange(e.target.value);
							}}
							disabled={loading.cities || !province}>
							<option value=''>Pilih kota</option>
							{cities.map((c) => (
								<option key={c.id} value={c.id}>
									{c.name}
								</option>
							))}
						</Select>
					)}
				/>
				<Hint>Pilih kota tempat alamat ini berada.</Hint>
				{errors.city_id && (
					<span className='text-red-500'>{errors.city_id.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='district_name'>Kecamatan</Label>
				<Input
					placeholder='Ketik nama kecamatan, misal: Setiabudi'
					{...register('district_name')}
				/>
				<Hint>Ketik nama kecamatan sesuai alamat Anda.</Hint>
				{errors.district_name && (
					<span className='text-red-500'>{errors.district_name.message}</span>
				)}
			</div>

			<div>
				<Label htmlFor='zipcode'>Kode Pos</Label>
				<Input
					type='text'
					inputMode='numeric'
					placeholder='Contoh: 55285'
					maxLength={5}
					{...register('zipcode')}
				/>
				<Hint>
					Kode pos 5 digit. Pastikan benar karena inilah yang dipakai untuk
					menghitung ongkos kirim.
				</Hint>
				{errors.zipcode && (
					<span className='text-red-500'>{errors.zipcode.message}</span>
				)}
			</div>

			<div className='col-span-full'>
				<Label htmlFor='note'>Catatan (opsional)</Label>
				<Textarea
					placeholder='Tambahkan catatan untuk kurir, misal: patokan rumah, nomor unit, dll.'
					{...register('note')}
				/>
				<Hint>Catatan ini membantu kurir menemukan lokasi Anda dengan lebih mudah.</Hint>
				{errors.note && (
					<span className='text-red-500'>{errors.note.message}</span>
				)}
			</div>

			<div className='col-span-full'>
				<div className='flex items-center justify-between gap-3'>
					<Label htmlFor='location'>Titik Lokasi</Label>
					<label className='flex items-center gap-2 text-sm cursor-pointer select-none'>
						<span className='text-zinc-600'>Lokasi otomatis (GPS)</span>
						<button
							type='button'
							role='switch'
							aria-checked={useGps}
							onClick={() => handleToggleGps(!useGps)}
							className={cn(
								'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
								useGps ? 'bg-primary-500' : 'bg-zinc-300'
							)}>
							<span
								className={cn(
									'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
									useGps ? 'translate-x-6' : 'translate-x-1'
								)}
							/>
						</button>
					</label>
				</div>
				<Hint className='mb-2'>
					{useGps
						? 'GPS aktif: koordinat diambil otomatis dari perangkat Anda. Tekan "Perbarui Lokasi" untuk mengambil ulang.'
						: 'Klik pada peta untuk menaruh penanda, atau isi koordinat (latitude & longitude) secara manual di bawah.'}
				</Hint>
				<Map
					location={{ latitude: lat, longitude: lng }}
					className='aspect-banner'
					setLocation={
						useGps
							? undefined
							: (location) =>
									applyCoordinate(
										location.latitude,
										location.longitude,
										'manual_drag'
									)
					}
				/>

				<div className='grid gap-4 mt-3 sm:grid-cols-2'>
					<div>
						<Label htmlFor='latitude'>Latitude</Label>
						<Input
							type='number'
							step='any'
							readOnly={useGps}
							className={cn(useGps && 'bg-zinc-100 text-zinc-500')}
							placeholder='Contoh: -6.2185'
							value={lat ?? ''}
							onChange={(e) => {
								if (useGps) return;
								const v = e.target.value === '' ? undefined : Number(e.target.value);
								setValue('latitude', v, {
									shouldDirty: true,
									shouldValidate: true,
								});
								setValue('location_source', 'manual_drag', { shouldDirty: true });
								setValue('is_location_confirmed', false, { shouldDirty: true });
							}}
						/>
						{errors.latitude && (
							<span className='text-red-500'>{errors.latitude.message}</span>
						)}
					</div>
					<div>
						<Label htmlFor='longitude'>Longitude</Label>
						<Input
							type='number'
							step='any'
							readOnly={useGps}
							className={cn(useGps && 'bg-zinc-100 text-zinc-500')}
							placeholder='Contoh: 106.8283'
							value={lng ?? ''}
							onChange={(e) => {
								if (useGps) return;
								const v = e.target.value === '' ? undefined : Number(e.target.value);
								setValue('longitude', v, {
									shouldDirty: true,
									shouldValidate: true,
								});
								setValue('location_source', 'manual_drag', { shouldDirty: true });
								setValue('is_location_confirmed', false, { shouldDirty: true });
							}}
						/>
						{errors.longitude && (
							<span className='text-red-500'>{errors.longitude.message}</span>
						)}
					</div>
				</div>

				{useGps && (
					<div className='mt-2'>
						<Button variant='outline' type='button' onClick={fetchGps}>
							Perbarui Lokasi
						</Button>
					</div>
				)}

				<div className='mt-3 rounded-md border p-3 text-sm space-y-1'>
					{validating && (
						<p className='text-gray-500'>Memeriksa alamat di peta...</p>
					)}
					{!validating && validation && validation.displayAddress && (
						<>
							<p className='text-gray-700'>
								<span className='font-medium'>Alamat menurut peta: </span>
								{validation.displayAddress}
							</p>
							{validation.provinceMatch === false && (
								<p className='text-amber-600'>
									Provinsi mungkin tidak cocok: peta menunjukkan "
									{validation.osmProvince || '-'}", Anda memilih "{provinceName}".
									Periksa kembali titik peta.
								</p>
							)}
							{validation.cityMatch === false && (
								<p className='text-amber-600'>
									Kota/kabupaten mungkin tidak cocok: peta menunjukkan "
									{validation.osmCity || '-'}", Anda memilih "{cityName}".
								</p>
							)}
							{validation.osmPostcode && validation.zipcodeMatch === false && (
								<p className='text-blue-600 flex items-center gap-2 flex-wrap'>
									Peta menyarankan kode pos {validation.osmPostcode}.
									<button
										type='button'
										className='underline'
										onClick={() =>
											setValue('zipcode', validation.osmPostcode, {
												shouldDirty: true,
												shouldValidate: true,
											})
										}>
										Gunakan
									</button>
								</p>
							)}
						</>
					)}
					{!validating && validation && !validation.displayAddress && (
						<p className='text-gray-500'>
							Tidak dapat memverifikasi alamat dari peta saat ini.
						</p>
					)}
				</div>
			</div>

			{submitError && (
				<div className='col-span-full text-red-600 text-sm'>{submitError}</div>
			)}

			<div className='col-span-full'>
				<label className='flex items-start gap-2 text-sm'>
					<input
						type='checkbox'
						className='mt-1'
						checked={!!watch('is_location_confirmed')}
						onChange={(e) =>
							setValue('is_location_confirmed', e.target.checked, {
								shouldDirty: true,
							})
						}
					/>
					<span>
						Saya sudah memeriksa posisi marker di peta dan memastikan lokasi
						sudah benar.
					</span>
				</label>
			</div>

			<div className='flex items-center gap-2 col-span-full'>
				<Button disabled={!watch('is_location_confirmed')}>{label}</Button>
			</div>
		</form>
	);
};

export default AddressForm;
