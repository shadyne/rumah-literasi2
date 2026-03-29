import * as React from 'react';
import ConfirmContext from '@/contexts/confirm-context';

const useConfirm = () => {
	const context = React.useContext(ConfirmContext);
	if (!context) {
		throw new Error('useConfirm must be used within an ConfirmProvider');
	}
	return context;
};

export { useConfirm };
