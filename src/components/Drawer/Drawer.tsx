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
import theme from '@/theme';
import useMediaQuery from '@mui/material/useMediaQuery';

const drawerWidth = 312;

export default function Drawer() {
	const isDesktop = useMediaQuery<typeof theme>((theme) => theme.breakpoints.up("sm"));

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

	const form = <Form />;

	return (
		<>
			{!isDesktop && (
				<AppBar position="fixed">
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
			)}
			<Box sx={{display: "flex"}}>
				{!isDesktop && (
					<MuiDrawer
						open={mobileOpen}
						onClose={handleDrawerClose}
						onTransitionEnd={handleDrawerTransitionEnd}
						ModalProps={{keepMounted: true}}
						sx={{
							"& .MuiDrawer-paper": {
								width: drawerWidth,
								boxSizing: "border-box",
							},
						}}
						variant="temporary"
					>
						{form}
					</MuiDrawer>
				)}
				{isDesktop && (
					<MuiDrawer
						open
						variant="permanent"
						sx={{
							"& .MuiDrawer-paper": {
								width: drawerWidth,
								boxSizing: "border-box",
							},
						}}
					>
						{form}
					</MuiDrawer>
				)}
			</Box>
		</>
	);
}
