import styled from 'styled-components';

export const StyledChart = styled.div`
	width: 100%;

	&.loading {
			&:after {
			content: 'loading…';
			display: block;
			margin-top: 100px;
			text-align: center;
		}

		svg {
			display: none;
		}
	}
`;