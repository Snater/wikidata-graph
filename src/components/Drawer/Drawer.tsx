'use client'

import React, {type PropsWithChildren, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import {Menu as MenuIcon} from '@mui/icons-material';
import PermanentDrawer from '@/components/Drawer/PermanentDrawer';
import TemporaryDrawer from '@/components/Drawer/TemporaryDrawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export const DRAWER_WIDTH = 312;

export default function Drawer({children}: PropsWithChildren) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);

	const handleDrawerClose = () => {
		setIsClosing(true);
		setMobileOpen(false);
	};

	const handleDrawerTransitionEnd = () => {
		setIsClosing(false);
	};

	const handleDrawerToggle = () => {
		if (!isClosing) {
			setMobileOpen((prev) => !prev);
		}
	};

	return (
		<>
			<AppBar
				position="fixed"
				sx={{
					display: {sm: "none"}
				}}
			>
				<Toolbar>
					<IconButton
						aria-label="open drawer"
						color="inherit"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{mr: 2}}
					>
						<MenuIcon />
					</IconButton>
					<Typography noWrap variant="h6">
						Wikidata Graph
					</Typography>
				</Toolbar>
			</AppBar>
			<Box sx={{display: "flex"}}>
					<TemporaryDrawer
						onClose={handleDrawerClose}
						onTransitionEnd={handleDrawerTransitionEnd}
						open={mobileOpen}
					>
						{children}
					</TemporaryDrawer>
					<PermanentDrawer>
						{children}
					</PermanentDrawer>
			</Box>
		</>
	);
}
