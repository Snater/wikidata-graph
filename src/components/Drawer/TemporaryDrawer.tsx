import Drawer, {type DrawerProps} from '@mui/material/Drawer';
import {DRAWER_WIDTH} from '@/components/Drawer/Drawer';
import React from 'react';

export default function TemporaryDrawer({children, ...rest}: DrawerProps) {
	return (
		<Drawer
			ModalProps={{keepMounted: true}}
			sx={{
				"& .MuiDrawer-paper": {
					width: DRAWER_WIDTH,
					boxSizing: "border-box",
				},
			}}
			variant="temporary"
			{...rest}
		>
			{children}
		</Drawer>
	);
}
