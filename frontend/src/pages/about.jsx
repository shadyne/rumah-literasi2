import * as React from 'react';

const About = () => {
	return (
		<React.Fragment>
			<div className='container grid items-center gap-6 py-24 lg:grid-cols-2 max-w-7xl'>
				<div className='relative p-6 border rounded-full bg-zinc-50 size-full aspect-square border-zinc-200'>
					<img
						src='/about.jpg'
						alt='home'
						className='object-cover rounded-full size-full aspect-square '
					/>

					<div className='absolute top-0 xl:top-auto xl:-left-20 xl:bottom-16'>
						<div className='relative p-6 text-sm origin-center bg-white border w-72 animate-slow-hover border-zinc-200 rounded-xl'>
							<div className='absolute top-0 left-0 -m-1'>
								<div className='relative'>
									<div className='absolute inset-0 rounded-full size-3 bg-primary-500'></div>
									<div className='absolute inset-0 rounded-full size-3 bg-primary-500 animate-ping'></div>
								</div>
							</div>

							<span className='font-semibold'>Join our community</span>
							<p className='text-zinc-600'>
								Let's join our community and share your love for books with others. Together, we can create a vibrant and supportive environment for book lovers of all ages.
							</p>
						</div>
					</div>
				</div>

				<div className='flex flex-col gap-6'>
					<h1 className='text-6xl font-bold'>About Us</h1>
					<p className='text-zinc-600'>
						Mraen adalah sebuah dusun di kabupaten Sleman, Yogyakarta, dimana bermula dari gang kecil inilah lahir 
						sebuah gerakan literasi bernama MRAEN MIMPI. Kata “mraen” kami umpamakan sebagai kata yang memiliki arti “meraih”, kemudian kami menambahkan kata “mimpi” setelahnya. Iya, kami sedang meniti langkah untuk meraih sebuah mimpi.
						Mraen Mimpi sebagai gerakan literasi yang menggunakan media gerobak bernama “PELAN2” (dibaca pelan-pelan), 
						memiliki filosofi yang bermakna; kami pelan-pelan berproses dengan memulai dari sesuatu yang mampu kami lakukan, yakni berupa Perpustakaan Jalan-jalan.
					</p>
				</div>
			</div>
		</React.Fragment>
	);
};

export default About;
