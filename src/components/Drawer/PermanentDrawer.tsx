import Drawer, {type DrawerProps} from '@mui/material/Drawer';
import {DRAWER_WIDTH} from '@/components/Drawer/Drawer';
import React from 'react';

export default function PermanentDrawer({children, ...rest}: DrawerProps) {
	return (
		<Drawer
			open
			sx={{
				"& .MuiDrawer-paper": {
					width: DRAWER_WIDTH,
					boxSizing: "border-box",
				},
			}}
			variant="permanent"
			{...rest}
		>
			{children}
		</Drawer>
	);
}
