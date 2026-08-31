import * as React from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, UploadCloud } from 'lucide-react';

import axios from '@/libs/axios';
import { currency, animate, whatsappUrl } from '@/libs/utils';
import { WHATSAPP_ADMIN_NUMBER } from '@/libs/constant';
import { useAuth } from '@/hooks/use-auth';

import {
	Heading,
	HeadingDescription,
	HeadingTitle,
} from '@/components/ui/heading';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Hint } from '@/components/ui/hint';
import { Loading } from '@/components/loading';
import { Error } from '@/components/error';
import PaymentChannelPicker from '@/components/payments/payment-channel-picker';

const PayDonation = ({ type }) => {
	const { user } = useAuth();
	const { id } = useParams();
	const navigate = useNavigate();
	const { mutate } = useSWRConfig();

	const endpoint =
		type === 'book' ? '/book-donations/' : '/financial-donations/';
	const listEndpoint =
		type === 'book' ? '/book-donations' : '/financial-donations';
	const listPath =
		type === 'book'
			? '/dashboard/book-donations'
			: '/dashboard/financial-donations';

	const { data, error, isLoading } = useSWR(endpoint + id);

	const [channelId, setChannelId] = React.useState(null);
	const [proof, setProof] = React.useState(null);
	const [submitting, setSubmitting] = React.useState(false);

	const donation = data?.data;
	const amount =
		type === 'book' ? donation?.shipping_fee : donation?.amount;
	const hasValidAmount = Number.isFinite(Number(amount)) && Number(amount) > 0;

	const createWhatsappConfirmation = () => {
		const donorName = donation?.user?.name || user?.name || 'Donatur';
		const donationType = type === 'book' ? 'Donasi Buku' : 'Donasi Finansial';
		const lines = [
			'Halo Admin Mraen Mimpi, saya ingin mengonfirmasi donasi berikut:',
			'',
			`Nama donatur: ${donorName}`,
			`Jenis donasi: ${donationType}`,
			`ID donasi: ${donation?.id || id}`,
		];

		if (type === 'financial') {
			lines.push(`Nominal transaksi: ${currency(Number(amount))}`);
		} else if (donation?.book_donation_items?.length) {
			const totalBooks = donation.book_donation_items.reduce(
				(total, item) => total + Number(item.amount || 0),
				0
			);
			lines.push(`Jumlah buku: ${totalBooks} buku`);
		}

		lines.push('', 'Bukti pembayaran sudah saya unggah. Mohon dicek, terima kasih.');
		return whatsappUrl(WHATSAPP_ADMIN_NUMBER, lines.join('\n'));
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		if (!hasValidAmount) {
			return toast.error(
				type === 'book'
					? 'Ongkir belum tersedia. Jangan lakukan pembayaran dan hubungi admin.'
					: 'Nominal pembayaran tidak valid.'
			);
		}
		if (!channelId) return toast.error('Pilih metode pembayaran terlebih dahulu');
		if (!proof) return toast.error('Unggah bukti pembayaran terlebih dahulu');

		const form = new FormData();
		form.append('payment_channel_id', channelId);
		form.append('payment_proof', proof);

		try {
			setSubmitting(true);
			await axios.post(endpoint + id + '/pay', form, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			mutate(listEndpoint);
			mutate(endpoint + id);
			toast('Bukti pembayaran terkirim', {
				description:
					'Status menjadi "Menunggu Verifikasi". Admin akan memverifikasi dalam 1×24 jam.',
			});
			animate();
			window.location.assign(createWhatsappConfirmation());
		} catch (err) {
			toast.error('Gagal mengirim bukti pembayaran', {
				description: err.response?.data?.message || err.message,
			});
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className='grid gap-8'>
			<Heading>
				<HeadingTitle>Pembayaran Donasi</HeadingTitle>
				<HeadingDescription>
					Pilih metode pembayaran, lakukan transfer, lalu unggah bukti
					pembayaran. Admin akan memverifikasi pembayaran Anda.
				</HeadingDescription>
			</Heading>

			<Error error={!isLoading && error} />
			<Loading loading={isLoading} />

			{donation && (
				<form onSubmit={onSubmit} className='grid gap-6'>
					<div className='rounded-xl border border-zinc-200 p-4'>
						<span className='text-sm text-zinc-500'>
							{type === 'book' ? 'Total Ongkir' : 'Total Donasi'}
						</span>
						<p className='text-2xl font-bold'>
							{hasValidAmount ? currency(Number(amount)) : 'Tidak tersedia'}
						</p>
					</div>

					{!hasValidAmount && (
						<div className='rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
							{type === 'book'
								? 'Data ongkir tidak valid. Jangan transfer atau unggah bukti pembayaran. Silakan hubungi admin.'
								: 'Nominal pembayaran tidak valid. Silakan hubungi admin.'}
						</div>
					)}

					<div className='grid gap-2'>
						<Label>Metode Pembayaran</Label>
						<PaymentChannelPicker value={channelId} onChange={setChannelId} />
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='payment_proof'>Bukti Pembayaran</Label>
						<label className='flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-zinc-300 p-4 hover:border-amber-400'>
							<UploadCloud className='size-5 text-zinc-400' />
							<span className='text-sm text-zinc-500'>
								{proof ? proof.name : 'Klik untuk mengunggah bukti transfer'}
							</span>
							<input
								id='payment_proof'
								type='file'
								accept='image/*,application/pdf'
								className='hidden'
								onChange={(e) => setProof(e.target.files?.[0] || null)}
							/>
						</label>
						<Hint>Format gambar atau PDF, maksimal beberapa MB.</Hint>
					</div>

					<div className='flex flex-wrap items-center gap-2'>
						<Button
							type='button'
							variant='outline'
							onClick={() => navigate(listPath)}>
							<ArrowLeft className='size-4 sm:mr-2' />
							<span className='hidden sm:inline'>Kembali</span>
						</Button>
						<Button type='submit' disabled={submitting || !hasValidAmount}>
							{submitting
								? 'Mengirim...'
								: 'Kirim Bukti & Konfirmasi via WhatsApp'}
						</Button>
					</div>
				</form>
			)}
		</div>
	);
};

export default PayDonation;
