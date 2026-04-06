import * as React from 'react';
import { Link } from 'react-router';

import { Logo } from '@/components/ui/logo';
import { WIDGET_CONTACT, WIDGET_NAV, WIDGET_SOCIAL } from '@/libs/constant';

const Footer = () => {
	return (
		<div className='grid gap-6'>
			<Link to='/'>
				<Logo />
			</Link>

			<div className='grid gap-8 lg:grid-cols-5'>
				<p className='lg:col-span-2'>
					Peluang kebaikan untuk kamu yang ada di Yogyakarta dan sekitarnya. Sanggar Taman Mraen Mimpi menerima donasi berupa barang yang sudah tidak terpakai, 
					seperti: kertas, kardus, koran, kaleng, botol, dll. Tim kami siap mengambil donasi tersebut ke lokasi untuk dijual kembali dan hasilnya akan digunakan sebagai operasional utama kegiatan Mraen Mimpi.
				</p>

				<div className='div'>
					<h5 className='mb-4 font-semibold'>Navigation</h5>
					<ul className='flex flex-col gap-3'>
						{WIDGET_NAV.map((menu) => (
							<li key={menu.href}>
								<Link to={menu.href} className='hover:text-primary-500'>
									{menu.label}
								</Link>
							</li>
						))}
					</ul>
				</div>

				<div>
					<h5 className='mb-4 font-semibold'>Contact</h5>
					<ul className='flex flex-col gap-3'>
						{WIDGET_CONTACT.map((menu) => {
							const Icon = menu.icon;
							return (
								<li key={menu.href}>
									<Link
										to={menu.href}
										className='flex items-center gap-3 hover:text-primary-500'>
										<Icon className='size-5' />
										<span>{menu.label}</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</div>

				<div>
					<h5 className='mb-4 font-semibold'>Social</h5>
					<ul className='flex flex-col gap-3'>
						{WIDGET_SOCIAL.map((menu) => {
							const Icon = menu.icon;
							return (
								<li key={menu.href}>
									<Link
										to={menu.href}
										className='flex items-center gap-3 hover:text-primary-500'>
										<Icon className='size-5' />
										<span>{menu.label}</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Footer;
