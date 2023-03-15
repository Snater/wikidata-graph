import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Typography from "@mui/material/Typography";
import styled from 'styled-components';

export const StyledValueContainer = styled.div`
	&& {
		align-items: center;
		display: flex;
		flex: 1;
		flex-wrap: wrap;
		overflow: hidden;
	}
`;

export const StyledNoOptionsMessage = styled(Typography)`
	&& {
		padding: ${p => p.theme.spacing(1)}px ${p => p.theme.spacing(2)}px;
	}
`;

export const StyledSingleValue = styled(Typography)`
	&& {
		font-size: 16px;
		margin-left: 2px;
	}
`;

export const StyledPlaceholder = styled(Typography)`
	&& {
		font-size: 16px;
	}
`;

export const StyledPaper = styled(Paper)`
	&& {
		left: 0;
		margin-top: ${p => p.theme.spacing(1)};
		position: absolute;
		right: 0;
		z-index: 2;
	}
`;

export const StyledOption = styled(MenuItem)`
	&& {
		height: auto;
		white-space: normal;
	}
`;