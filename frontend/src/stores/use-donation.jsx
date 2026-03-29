import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STEPS } from '@/libs/constant';
import { bookDonationSchema } from '@/libs/schemas';

const initial = [
	{
		id: 1,
		isbn: '9780743273565',
		title: 'The Great Gatsby',
		author: 'F. Scott Fitzgerald',
		publisher: 'Scribner',
		year: 1925,
		language: 'English',
		amount: 5,
	},
	{
		id: 2,
		isbn: '9780439139601',
		title: 'Harry Potter and the Goblet of Fire',
		author: 'J.K. Rowling',
		publisher: 'Bloomsbury',
		year: 2000,
		language: 'English',
		amount: 12,
	},
];

export const useDonation = create(
	persist(
		(set, get) => ({
			step: STEPS.ITEMS,
			items: initial,
			detail: null,
			courier: null,

			route: (step) => set({ step: step }),
			setDetail: (detail) => set({ detail }),
			setCourier: (courier) => set({ courier }),

			append: (item) => {
				return set((state) => {
					return {
						items: [
							...state.items,
							{
								id: new Date().getTime(),
								...item,
							},
						],
					};
				});
			},

			update: (id, updated) => {
				return set((state) => {
					return {
						items: state.items.map((item) => {
							if (item.id === id) {
								return {
									...item,
									...updated,
								};
							}

							return item;
						}),
					};
				});
			},

			remove: (id) => {
				return set((state) => {
					return {
						items: state.items.filter((item) => item.id !== id),
					};
				});
			},

			purge: () => {
				return set({
					items: [],
				});
			},

			reset: () => {
				return set({
					step: STEPS.ITEMS,
					items: [],
					detail: null,
					courier: null,
				});
			},

			validate: () => {
				const { items, detail, courier } = get();
				return bookDonationSchema.parse({
					items,
					detail,
					courier,
				});
			},
		}),
		{
			name: 'book-donation-storage',
		}
	)
);
