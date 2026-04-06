import * as React from 'react';
import { Link } from 'react-router';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/events/event-card';
import { useResultState } from '@/hooks/use-result-state';
import { Empty } from '@/components/empty';
import { Loading } from '@/components/loading';
import { Error } from '@/components/error';
import { usePagination } from '@/hooks/use-pagination';

const Home = () => {
	const ref = React.useRef(null);
	const { page } = usePagination();

	const {
		error,
		data,
		isLoading: loading,
	} = useSWR([
		'public/events',
		{
			params: {
				page: page,
				limit: 3,
			},
		},
	]);

	const { result, empty } = useResultState(error, loading, data);

	return (
		<React.Fragment>
			<div className='w-full overflow-x-hidden'>
				<div className='container grid items-center gap-6 py-24 lg:grid-cols-2 max-w-7xl'>
					<div className='flex flex-col gap-6'>
						<h1 className='text-4xl sm:text-6xl font-bold'>
							Empowering Communities Through Literacy
						</h1>
						<p className='text-zinc-600'>
							Mraen Mimpi is a non-profit initiative focused on redistributing
							used books to underserved communities. Partner with us to foster
							education, reduce waste, and drive social impact through literacy.
						</p>
						<div className='flex items-center gap-2'>
							<Button
								onClick={() =>
									ref.current.scrollIntoView({ behavior: 'smooth' })
								}>
								Read More
							</Button>
							<Link to='/about'>
								<Button variant='outline'>About Us</Button>
							</Link>
						</div>
					</div>

					<div className='relative order-first p-6 border rounded-full bg-zinc-50 size-full aspect-square border-zinc-200 lg:order-last'>
						<img
							alt='home'
							src='/hero.jpg'
							className='object-cover rounded-full size-full aspect-square'
						/>

						<div className='absolute top-0 xl:-right-20 xl:top-16 hidden xl:block'>
							<div className='relative p-6 text-sm origin-center bg-white border w-72 animate-slow-hover border-zinc-200 rounded-xl'>
								<div className='absolute top-0 left-0 -m-1'>
									<div className='relative'>
										<div className='absolute inset-0 rounded-full size-3 bg-primary-500'></div>
										<div className='absolute inset-0 rounded-full size-3 bg-primary-500 animate-ping'></div>
									</div>
								</div>

								<h2 className='font-semibold'>Donate your books</h2>
								<p className='text-zinc-600'>
									Instead of throwing your old books away, let them do more
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className='container py-24 max-w-7xl'>
					<div className='flex flex-col items-center gap-6 mb-16 text-center'>
						<h2 className='text-4xl font-bold'>Recent Events</h2>
						<p className='max-w-2xl text-zinc-600'>
							Stay updated with our latest events and activities in the
							community.
						</p>
					</div>

					<Error error={!loading && error} />
					<Empty empty={!loading && empty} />
					<Loading loading={loading} />

					<div className='grid gap-8 mb-8 md:grid-cols-2 lg:grid-cols-3'>
						{result.map((event) => (
							<Link to={'/events/' + event.id} key={event.id}>
								<EventCard event={event} />
							</Link>
						))}
					</div>

					<div className='flex justify-center'>
						<Link to='/events'>
							<Button variant='outline'>View All Events</Button>
						</Link>
					</div>
				</div>

				<div
					ref={ref}
					className='container grid items-center gap-6 py-24 lg:grid-cols-2 max-w-7xl'>
					<div className='relative order-first p-6 border rounded-full bg-zinc-50 size-full aspect-square border-zinc-200'>
						<img
							src='/about.jpg'
							alt='home'
							className='object-cover rounded-full size-full aspect-square'
						/>
					</div>

					<div className='flex flex-col gap-6'>
						<h2 className='text-4xl font-bold'>About Us</h2>
						<p className='text-zinc-600'>
							Mraen adalah sebuah dusun di kabupaten Sleman, Yogyakarta, di mana
							bermula dari gang kecil inilah lahir sebuah gerakan literasi
							bernama MRAEN MIMPI. Kata "mraen" kami umpamakan sebagai kata yang
							memiliki arti "meraih", kemudian kami menambahkan kata "mimpi"
							setelahnya. Iya, kami sedang meniti langkah untuk meraih sebuah
							mimpi. Mraen Mimpi sebagai gerakan literasi yang menggunakan media
							gerobak bernama "PELAN2" (dibaca pelan-pelan), memiliki filosofi
							yang bermakna; kami pelan-pelan berproses dengan memulai dari
							sesuatu yang mampu kami lakukan, yakni berupa Perpustakaan
							Jalan-jalan.
						</p>
					</div>
				</div>

				<div className='grid py-24 text-white bg-primary-600'>
					<div className='container max-w-7xl'>
						<div className='flex flex-col gap-6 text-center'>
							<h2 className='text-4xl font-bold'>Alur Donasi Buku</h2>
							<p>
								Donasi buku adalah kegiatan sosial untuk mengumpulkan dan
								mendistribusikan buku kepada yang membutuhkan, seperti sekolah
								terpencil. Proses donasi meliputi pengumpulan, penyortiran, dan
								pendistribusian buku ke perpustakaan dan komunitas baca yang
								membutuhkan. Selain buku, donasi dalam bentuk uang juga diterima
								untuk membantu fasilitas literasi di tempat yang kurang akses
								buku dan sumber belajar. Anda dapat berdonasi melalui website
								dan mengirimkan buku langsung ke alamat komunitas.
							</p>
							<div className='grid gap-6 mt-10 grid-cols-2 lg:grid-cols-4'>
								<img
									alt='steps'
									src='/steps/step-1.jpg'
									className='object-cover w-full rounded-xl aspect-thumbnail'
								/>
								<img
									alt='steps'
									src='/steps/step-2.jpg'
									className='object-cover w-full rounded-xl aspect-thumbnail'
								/>
								<img
									alt='steps'
									src='/steps/step-3.jpg'
									className='object-cover w-full rounded-xl aspect-thumbnail'
								/>
								<img
									alt='steps'
									src='/steps/step-4.jpg'
									className='object-cover w-full rounded-xl aspect-thumbnail'
								/>
							</div>
						</div>
					</div>
				</div>

				<div className='container py-24 max-w-7xl'>
					<div className='flex flex-col gap-6 text-center'>
						<h2 className='text-4xl font-bold'>Apa Itu Taman Baca?</h2>
						<p>
							Taman bacaan masyarakat adalah tempat yang menyediakan layanan
							baca dan sumber belajar bagi masyarakat sekitar, tanpa memandang
							latar belakang sosial, ekonomi, atau pendidikan.
						</p>

						<img
							src='/description.jpg'
							alt='home'
							className='object-cover w-full max-w-lg mx-auto rounded-xl aspect-square'
						/>

						<p>
							Jika buku adalah jendelanya, maka taman baca bagi komunitas adalah
							pintu yang terbuka lebar bagi warga untuk keluar dari keterbatasan
							informasi dan masuk ke ruang kolaborasi.
						</p>

						<p>
							TBM berperan penting dalam memfasilitasi kegiatan literasi
							baca-tulis, terutama bagi anak-anak dan masyarakat umum yang
							tinggal di sekitar lingkungan taman baca. Mraen Mimpi membuka
							Lapak Buku Bacaan dan Mainan Edukasi di beberapa kegiatan
							anak-anak maupun dewasa, bekerjasama serta kolaborasi dengan
							komunitas, organisasi atau lembaga lainnya.
						</p>

						<h2 className='mt-10 text-4xl font-bold'>Gallery Kami</h2>

						<div className='grid gap-6 md:grid-cols-2'>
							<img
								alt='gallery'
								src='/galleries/gallery-1.jpg'
								className='object-cover w-full rounded-xl aspect-video'
							/>
							<img
								alt='gallery'
								src='/galleries/gallery-2.jpg'
								className='object-cover w-full rounded-xl aspect-video'
							/>
							<img
								alt='gallery'
								src='/galleries/gallery-3.jpg'
								className='object-cover w-full rounded-xl aspect-video'
							/>
							<img
								alt='gallery'
								src='/galleries/gallery-4.jpg'
								className='object-cover w-full rounded-xl aspect-video'
							/>
							<img
								alt='gallery'
								src='/galleries/gallery-5.jpg'
								className='object-cover w-full rounded-xl md:col-span-full aspect-video'
							/>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Home;
