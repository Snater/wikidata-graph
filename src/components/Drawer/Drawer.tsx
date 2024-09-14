'use client'

import React, {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Form from '@/components/Form';
import IconButton from '@mui/material/IconButton';
import {Menu as MenuIcon} from '@mui/icons-material';
import {default as MuiDrawer} from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const drawerWidth = 312;

export default function Drawer() {
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
			setMobileOpen(!mobileOpen);
		}
	};

	return (
		<>
			<AppBar
				position="fixed"
				sx={{
					display: {
						sm: 'none',
					},
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
					<Typography component="div" noWrap variant="h6">
						Wikidata Graph
					</Typography>
				</Toolbar>
			</AppBar>
			<Box
				sx={{
					width: {
						sm: drawerWidth,
					},
					flexShrink: {
						sm: 0,
					}
				}}
			>
				<MuiDrawer
					ModalProps={{keepMounted: true}}
					onClose={handleDrawerClose}
					onTransitionEnd={handleDrawerTransitionEnd}
					open={mobileOpen}
					sx={{
						display: {
							xs: 'block',
							sm: 'none',
						},
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: drawerWidth,
						},
					}}
					variant="temporary"
				>
					<Form/>
				</MuiDrawer>
				<MuiDrawer
					open
					sx={{
						display: {
							xs: 'none',
							sm: 'block',
						},
						'& .MuiDrawer-paper': {
							boxSizing: 'border-box',
							width: drawerWidth,
						},
					}}
					variant="permanent"
				>
					<Form/>
				</MuiDrawer>
			</Box>
		</>
	);
}
