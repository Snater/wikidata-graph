import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import {Typography} from "@material-ui/core";
import styled from 'styled-components';

export const StyledInput = styled.div`
	&& {
		display: flex;
		padding: 0;
	}
`;

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
		padding: ${p => p.theme.spacing.unit}px ${p => p.theme.spacing.unit * 2}px;
	}
`;

export const StyledSingleValue = styled(Typography)`
	&& {
		font-size: 16px;
	}
`;

export const StyledPlaceholder = styled(Typography)`
	&& {
		font-size: 16px;
		left: 2px;
		position: absolute;
	}
`;

export const StyledPaper = styled(Paper)`
	&& {
		left: 0;
		margin-top: ${p => p.theme.spacing.unit};
		position: absolute;
		right: 0;
		z-index: 1;
	}
`;

export const StyledOption = styled(MenuItem)`
	&& {
		height: auto;
		white-space: normal;
	}
`;